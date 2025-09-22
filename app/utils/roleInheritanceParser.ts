export interface PolicyNode {
  name: string;
  children: PolicyNode[];
  type: string; // Changed to dynamic string type based on model parameters
  level: number;
  policyType?: 'p' | 'g' | 'g2' | 'g3';
  parameterIndex?: number; // Added to track parameter position in model
}

export interface PolicyRelation {
  source: string;
  target: string;
  type: 'p' | 'g' | 'g2' | 'g3';
  action?: string;
  domain?: string;
}

export class PolicyInheritanceParser {
  private relations: PolicyRelation[] = [];
  private visited: Set<string> = new Set();
  private visiting: Set<string> = new Set();
  private nodeMap: Map<string, PolicyNode> = new Map();
  private modelParameters: string[] = []; // Added to store model parameters

  /**
   * Parse the policy text and extract all policy relationships (P policy + G policy)
   * Now supports model-aware parsing
   */
  parsePolicy(policyText: string, modelText?: string): void {
    this.relations = [];
    this.nodeMap.clear();

    // Parse model configuration if provided
    if (modelText) {
      this.parseModelConfig(modelText);
    }

    const lines = policyText.split('\n').filter((line) => {
      return line.trim() && !line.trim().startsWith('#');
    });

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.startsWith('p,') || trimmedLine.startsWith('p ')) {
        const relation = this.parsePolicyRule(trimmedLine);
        if (relation) {
          this.relations.push(relation);
        }
      } else if (trimmedLine.match(/^g[0-9]*[,\s]/)) {
        const relation = this.parseGroupRule(trimmedLine);
        if (relation) {
          this.relations.push(relation);
        }
      }
    }
  }
  /**
   * Parse a policy rule (P strategy) and extract relationships
   */
  private parsePolicyRule(line: string): PolicyRelation | null {
    const parts = line.split(',').map((part) => {
      return part.trim();
    });
    if (parts.length < 3) return null;

    const [, subject, object, action, domain] = parts;

    return {
      source: subject,
      target: object,
      type: 'p',
      action,
      domain,
    };
  }

  /**
   * Parse a group rule (G strategy) and extract relationships
   */
  private parseGroupRule(line: string): PolicyRelation | null {
    const parts = line.split(',').map((part) => {
      return part.trim();
    });
    if (parts.length < 3) return null;

    const ruleType = parts[0];
    const [, source, target, domain] = parts;

    return {
      source,
      target,
      type: ruleType as 'g' | 'g2' | 'g3',
      domain,
    };
  }

  /**
   * Parse Casbin model configuration to extract parameter definitions
   */
  private parseModelConfig(modelText: string): void {
    this.modelParameters = [];

    const lines = modelText.split('\n');
    let inRequestDefinition = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Check for request_definition section
      if (trimmedLine === '[request_definition]') {
        inRequestDefinition = true;
        continue;
      }

      // Check for other sections (exit request_definition)
      if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']') && trimmedLine !== '[request_definition]') {
        inRequestDefinition = false;
        continue;
      }

      // Parse request definition line
      if (inRequestDefinition && trimmedLine.startsWith('r = ')) {
        const paramString = trimmedLine.substring(4).trim();
        this.modelParameters = paramString.split(',').map((param) => {
          return param.trim();
        });
        break;
      }
    }

    // Fallback to default parameters if parsing fails
    if (this.modelParameters.length === 0) {
      this.modelParameters = ['sub', 'obj', 'act'];
    }
  }

  /**
   * Determine node type based on model parameters and position
   */
  private determineNodeType(nodeId: string, parameterIndex?: number): string {
    // If we have model parameters and parameter index, use model-based typing
    if (this.modelParameters.length > 0 && parameterIndex !== undefined && parameterIndex < this.modelParameters.length) {
      return this.modelParameters[parameterIndex];
    }

    // Fallback to heuristic-based typing for backward compatibility
    return this.determineNodeTypeHeuristic(nodeId);
  }

  /**
   * Heuristic-based node type determination (fallback method)
   */
  private determineNodeTypeHeuristic(nodeId: string): string {
    const lowerNodeId = nodeId.toLowerCase();

    // User patterns
    if (lowerNodeId.includes('user') || lowerNodeId.includes('alice') || lowerNodeId.includes('bob') || lowerNodeId.includes('charlie')) {
      return 'user';
    }

    // Role patterns
    if (lowerNodeId.includes('admin') || lowerNodeId.includes('role') || lowerNodeId.includes('manager') || lowerNodeId.includes('group')) {
      return 'role';
    }

    // Resource patterns
    if (lowerNodeId.includes('data') || lowerNodeId.includes('file') || lowerNodeId.includes('resource') || lowerNodeId.includes('document')) {
      return 'resource';
    }

    // Action patterns
    if (
      lowerNodeId.includes('read') ||
      lowerNodeId.includes('write') ||
      lowerNodeId.includes('delete') ||
      lowerNodeId.includes('get') ||
      lowerNodeId.includes('post')
    ) {
      return 'action';
    }

    // Default to object for unrecognized patterns
    return 'object';
  }
  /**
   * Build policy graph from parsed relations
   */
  buildPolicyGraph(): PolicyNode[] {
    const rootNodes: PolicyNode[] = [];

    // Create nodes for all entities
    const allEntities = new Set<string>();
    this.relations.forEach((rel) => {
      allEntities.add(rel.source);
      allEntities.add(rel.target);
    });

    allEntities.forEach((entity) => {
      if (!this.nodeMap.has(entity)) {
        const node: PolicyNode = {
          name: entity,
          children: [],
          type: this.determineNodeType(entity),
          level: 0,
          parameterIndex: this.getParameterIndex(entity),
        };
        this.nodeMap.set(entity, node);
      }
    });

    // Build hierarchy for G relations
    this.relations
      .filter((rel) => {
        return rel.type.startsWith('g');
      })
      .forEach((rel) => {
        const parentNode = this.nodeMap.get(rel.source);
        const childNode = this.nodeMap.get(rel.target);
        if (parentNode && childNode) {
          parentNode.children.push(childNode);
          childNode.level = parentNode.level + 1;
        }
      });

    // Find root nodes (nodes with no parents)
    const childNodes = new Set<string>();
    this.relations
      .filter((rel) => {
        return rel.type.startsWith('g');
      })
      .forEach((rel) => {
        return childNodes.add(rel.target);
      });

    this.nodeMap.forEach((node, id) => {
      if (!childNodes.has(id)) {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }

  /**
   * Get parameter index for a node based on its position in policy rules
   */
  private getParameterIndex(nodeId: string): number | undefined {
    // Find the parameter index by checking P policy rules
    for (const rel of this.relations) {
      if (rel.type === 'p') {
        if (rel.source === nodeId) return 0; // subject position
        if (rel.target === nodeId) return 1; // object position
        if (rel.action === nodeId) return 2; // action position
        if (rel.domain === nodeId) return 3; // domain position
      }
    }
    return undefined;
  }

  /**
   * Get connections grouped by type
   */
  getConnectionsByType(): Record<string, PolicyRelation[]> {
    const connections: Record<string, PolicyRelation[]> = {};

    this.relations.forEach((rel) => {
      if (!connections[rel.type]) {
        connections[rel.type] = [];
      }
      connections[rel.type].push(rel);
    });

    return connections;
  }

  /**
   * Find circular dependencies in role inheritance
   */
  findCircularDependencies(): string[][] {
    this.visited.clear();
    const cycles: string[][] = [];

    // Get all unique node IDs from G relations
    const nodeIds = new Set<string>();
    this.relations
      .filter((rel) => {
        return rel.type.startsWith('g');
      })
      .forEach((rel) => {
        nodeIds.add(rel.source);
        nodeIds.add(rel.target);
      });

    nodeIds.forEach((nodeId) => {
      const path = new Set<string>();
      if (this.detectCycle(nodeId, path)) {
        cycles.push(Array.from(path));
      }
    });

    return cycles;
  }

  private detectCycle(nodeId: string, path: Set<string>): boolean {
    if (path.has(nodeId)) return true;
    if (this.visited.has(nodeId)) return false;

    path.add(nodeId);

    const children = this.relations
      .filter((rel) => {
        return rel.source === nodeId && rel.type.startsWith('g');
      })
      .map((rel) => {
        return rel.target;
      });

    for (const child of children) {
      if (this.detectCycle(child, path)) {
        return true;
      }
    }

    path.delete(nodeId);
    this.visited.add(nodeId);
    return false;
  }
}
