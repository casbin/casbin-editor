export interface PolicyNode {  
  name: string;  
  children: PolicyNode[];  
  type: 'user' | 'role' | 'resource' | 'object' | 'action';  
  level: number;  
  policyType?: 'p' | 'g' | 'g2' | 'g3';  
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
  
  /**  
   * Parse the strategy text and extract all strategy relationships (P strategy + G strategy)
   */  
  parsePolicy(policyText: string): PolicyRelation[] {  
    const lines = policyText.split('\n').filter((line) => {return line.trim()});  
    const relations: PolicyRelation[] = [];  
    this.nodeMap.clear();
  
    lines.forEach((line) => {  
      const trimmed = line.trim();  
        
      // Analysis of P Strategy  
      if (trimmed.startsWith('p,')) {  
        const pRelation = this.parsePolicyRule(trimmed);  
        if (pRelation) relations.push(pRelation);  
      }  
        
      // Analysis of G Strategy (Role Inheritance)  
      if (trimmed.startsWith('g,') || trimmed.startsWith('g2,') || trimmed.startsWith('g3,')) {  
        const gRelation = this.parseRoleRule(trimmed);  
        if (gRelation) relations.push(gRelation);  
      }  
    });  
  
    this.relations = relations;  
    return relations;  
  }  
  
  /**  
   * Analyze the P strategy rule
   */  
  private parsePolicyRule(line: string): PolicyRelation | null {  
    const parts = line.split(',').map((p) => {return p.trim()});  
    if (parts.length < 4) return null;  
  
    const [type, subject, object, action, ...rest] = parts;  
    const domain = rest.length > 0 ? rest[0] : undefined;  
  
    return {  
      source: subject,  
      target: object,  
      type: 'p',  
      action,  
      domain  
    };  
  }  
  
  /**  
   * Analyze the G strategy rule  
   */  
  private parseRoleRule(line: string): PolicyRelation | null {  
    const parts = line.split(',').map((p) => {return p.trim()});  
    if (parts.length < 3) return null;  
  
    const [type, source, target, ...rest] = parts;  
    const domain = rest.length > 0 ? rest[0] : undefined;  
  
    return {  
      source,  
      target,  
      type: type as 'g' | 'g2' | 'g3',  
      domain  
    };  
  }  
  
  /**  
   * Build a de-duplication strategy map  
   */  
  buildPolicyGraph(): PolicyNode[] {  
    if (this.relations.length === 0) return [];  
  
    // Collect all unique nodes

    const allNodeIds = new Set<string>();  
    this.relations.forEach((rel) => {  
      allNodeIds.add(rel.source);  
      allNodeIds.add(rel.target);  
    });  
  
    // Create a PolicyNode for each unique node  
    allNodeIds.forEach((nodeId) => {  
      if (!this.nodeMap.has(nodeId)) {  
        const nodeType = this.determineNodeType(nodeId);  
        const policyType = this.getNodePolicyType(nodeId);  
          
        this.nodeMap.set(nodeId, {  
          name: nodeId,  
          children: [],  
          type: nodeType,  
          level: 0,  
          policyType  
        });  
      }  
    });  
  
    // Building a father-son relationship (only for Strategy G)  
    const gRelations = this.relations.filter((rel) => {return rel.type.startsWith('g')});  
    gRelations.forEach((rel) => {  
      const parentNode = this.nodeMap.get(rel.target);  
      const childNode = this.nodeMap.get(rel.source);  
        
      if (parentNode && childNode) {  
        // Check if the child node already exists to avoid duplication  
        const existingChild = parentNode.children.find((child) => {return child.name === childNode.name});  
        if (!existingChild) {  
          parentNode.children.push(childNode);  
          childNode.level = parentNode.level + 1;  
        }  
      }  
    });  
  
    // Return to the root node (a node without a parent node)  
    const rootNodes: PolicyNode[] = [];  
    this.nodeMap.forEach((node) => {  
      const hasParent = gRelations.some((rel) => {return rel.source === node.name});  
      if (!hasParent) {  
        rootNodes.push(node);  
      }  
    });  
  
    return rootNodes.length > 0 ? rootNodes : Array.from(this.nodeMap.values());  
  }  
  
  /**  
   * Obtain all unique nodes (for force-directed graphs)  
   */  
  getAllUniqueNodes(): PolicyNode[] {  
    return Array.from(this.nodeMap.values());  
  }  
  
  /**  
   * Heuristic determination of node types  
   */  
  private determineNodeType(nodeId: string): 'user' | 'role' | 'resource' | 'object' | 'action' {  
    // Check whether it is in the G2 relationship (resource role)  
    const hasG2 = this.relations.some((rel) =>   
      {return rel.type === 'g2' && (rel.source === nodeId || rel.target === nodeId)}  
    );  
    if (hasG2) return 'resource';  
  
    // Check whether it is used as an action in the P strategy  
    const isAction = this.relations.some((rel) =>   
      {return rel.type === 'p' && rel.action === nodeId}  
    );  
    if (isAction) return 'action';  
  
    // Check whether it is used as an object in the P strategy  
    const isObject = this.relations.some((rel) =>   
      {return rel.type === 'p' && rel.target === nodeId}  
    );  
    if (isObject) return 'object';  
  
    // Check whether it is only as a source (usually a user)  
    const isOnlySource = this.relations.some((rel) => {return rel.source === nodeId}) &&  
                        !this.relations.some((rel) => {return rel.target === nodeId});  
    if (isOnlySource) return 'user';  
  
    // The default is a role. 
    return 'role';  
  }  
  
  /**  
   * Obtain the policy type of the node  
   */  
  private getNodePolicyType(nodeId: string): 'p' | 'g' | 'g2' | 'g3' | undefined {  
    const relation = this.relations.find((rel) =>   
      {return rel.source === nodeId || rel.target === nodeId}  
    );  
    return relation?.type;  
  }  
  
  /**  
   * Obtain the connection relationship (used for drawing different types of connections)  
   */  
  getConnectionsByType(): Record<string, PolicyRelation[]> {  
    return {  
      p: this.relations.filter((rel) => {return rel.type === 'p'}),  
      g: this.relations.filter((rel) => {return rel.type === 'g'}),  
      g2: this.relations.filter((rel) => {return rel.type === 'g2'}),  
      g3: this.relations.filter((rel) => {return rel.type === 'g3'})  
    };  
  }  
  
  /**  
   * Obtain circular dependencies  
   */  
  findCircularDependencies(): string[][] {  
    const cycles: string[][] = [];  
    const allNodes = new Set<string>();  
      
    this.relations.forEach((rel) => {  
      allNodes.add(rel.source);  
      allNodes.add(rel.target);  
    });  
  
    allNodes.forEach((nodeId) => {  
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
      .filter((rel) => {return rel.source === nodeId && rel.type.startsWith('g')})  
      .map((rel) => {return rel.target});  
  
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