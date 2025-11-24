import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PolicyInheritanceParser, PolicyNode, PolicyRelation } from '@/app/utils/roleInheritanceParser';
import { useLang } from '@/app/context/LangContext';

interface RoleInheritanceGraphProps {
  policy: string;
  className?: string;
}

export const RoleInheritanceGraph: React.FC<RoleInheritanceGraphProps> = ({ policy, className = '' }) => {
  const { t } = useLang();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeData, setTreeData] = useState<PolicyNode[]>([]);
  const [relations, setRelations] = useState<Record<string, PolicyRelation[]>>({});
  const [rawRelations, setRawRelations] = useState<PolicyRelation[]>([]);
  const [circularDeps, setCircularDeps] = useState<string[][]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const medicalColorScheme = {
    user: '#2E86AB',
    role: '#A23B72',
    resource: '#F18F01',
    object: '#6A994E',
    action: '#BC4749',
    background: '#FAFAFA',
    text: '#2C3E50',
    border: '#000000ff',
    gridLine: '#E8E8E8',
    shadow: 'rgba(0,0,0,0.1)',
    // connectingLineColor
    policyLine: '#2C3E50', // P Strategy Connection - Dark gray
    roleInheritance: '#3498DB', // G Strategy Connection - Blue
    resourceInheritance: '#27AE60', // G2 Strategy connection - Green
    domainInheritance: '#9B59B6', // G3 Strategy Connection - Purple
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(containerRef.current);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const borderTop = parseFloat(computedStyle.borderTopWidth);
        const borderBottom = parseFloat(computedStyle.borderBottomWidth);
        const actualHeight = rect.height - paddingTop - paddingBottom - borderTop - borderBottom;

        setDimensions({
          width: rect.width,
          height: Math.max(actualHeight, 200),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const parser = new PolicyInheritanceParser();
    parser.parsePolicy(policy);
    const tree = parser.buildPolicyGraph();
    const relationsByType = parser.getConnectionsByType();
    const cycles = parser.findCircularDependencies();

    setTreeData(tree);
    setRelations(relationsByType);
    setCircularDeps(cycles);
    setRawRelations(parser.getRelations());
  }, [policy]);

  useEffect(() => {
    if ((treeData.length === 0 && Object.keys(relations).length === 0) || !svgRef.current) return;
    renderGraph();
  }, [treeData, relations, dimensions]);
  const renderGraph = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('width', width).attr('height', height);

    // Check if there is any strategy data (P strategy or G strategy)
    const hasAnyPolicy = treeData.length > 0 || Object.keys(relations).length > 0;
    if (!hasAnyPolicy) {
      // Display centered "(empty)" label when no policy exists
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#9ca3af')
        .attr('class', 'dark:fill-gray-400')
        .text(t('(empty)'));
      return;
    }

    // Add a cropping path to ensure that the content does not exceed the boundary
    svg.append('defs').append('clipPath').attr('id', 'chart-area').append('rect').attr('width', innerWidth).attr('height', innerHeight);

    const defs = svg.select('defs');

    const arrowTypes = [
      { id: 'arrow-p', color: medicalColorScheme.policyLine },
      { id: 'arrow-g', color: medicalColorScheme.roleInheritance },
      { id: 'arrow-g2', color: medicalColorScheme.resourceInheritance },
      { id: 'arrow-g3', color: medicalColorScheme.domainInheritance },
    ];

    arrowTypes.forEach((arrow) => {
      defs
        .append('marker')
        .attr('id', arrow.id)
        .attr('viewBox', '0 -3 8 6')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-3L8,0L0,3L2,0z')
        .attr('fill', `url(#gradient-${arrow.id})`)
        .attr('stroke-width', 0.5);
    });
    arrowTypes.forEach((arrow) => {
      const gradient = defs.append('linearGradient').attr('id', `gradient-${arrow.id}`).attr('gradientUnits', 'userSpaceOnUse');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', arrow.color).attr('stop-opacity', 0.8);

      gradient.append('stop').attr('offset', '100%').attr('stop-color', arrow.color).attr('stop-opacity', 1);
    });

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`).attr('clip-path', 'url(#chart-area)');

    // Transparent background to capture empty-space clicks
    g.append('rect')
      .attr('class', 'graph-background')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all');

    // Create a de-duplicated node mapping
    const nodeMap = new Map();
    const allLinks: any[] = [];

    // Add nodes from the tree data
    const flattenNodes = (nodes: PolicyNode[], parentId?: string) => {
      nodes.forEach((node) => {
        if (!nodeMap.has(node.name)) {
          nodeMap.set(node.name, {
            id: node.name,
            type: node.type,
            policyType: node.policyType,
            level: node.level,
          });
        }

        if (parentId) {
          const linkId = `${parentId}-${node.name}`;
          if (
            !allLinks.find((l) => {
              return l.id === linkId;
            })
          ) {
            allLinks.push({
              id: linkId,
              source: parentId,
              target: node.name,
              type: node.policyType || 'g',
            });
          }
        }

        if (node.children && node.children.length > 0) {
          flattenNodes(node.children, node.name);
        }
      });
    };

    flattenNodes(treeData);

    // Add nodes and connections from parsed relations (use rawRelations which includes lineIndex)
    // Group relations by source-target-type so multiple policy lines between same nodes become a single link
    rawRelations.forEach((rel) => {
      const type = rel.type;
      // Add source node
      if (!nodeMap.has(rel.source)) {
        nodeMap.set(rel.source, {
          id: rel.source,
          type: determineNodeTypeFromRelation(rel, 'source'),
          policyType: type,
          level: 0,
        });
      }

      // Add the target node
      if (!nodeMap.has(rel.target)) {
        nodeMap.set(rel.target, {
          id: rel.target,
          type: determineNodeTypeFromRelation(rel, 'target'),
          policyType: type,
          level: 1,
        });
      }

      // Group by source-target-type to avoid duplicate overlapping links; keep an array of line indices
      const groupId = `${rel.source}--${rel.target}--${type}`;
      const existingLink = allLinks.find((l) => {
        return l.groupId === groupId || l.id === groupId;
      });
      if (existingLink) {
        if (rel.action && !existingLink.actions.includes(rel.action)) {
          existingLink.actions.push(rel.action);
        }
        if (rel.lineIndex !== undefined) {
          existingLink.lineIndices = Array.from(new Set([...(existingLink.lineIndices || []), rel.lineIndex]));
        }
      } else {
        allLinks.push({
          id: groupId,
          groupId,
          source: rel.source,
          target: rel.target,
          type: type,
          actions: rel.action ? [rel.action] : [],
          domain: rel.domain,
          effect: rel.effect,
          lineIndices: rel.lineIndex !== undefined ? [rel.lineIndex] : [],
        });
      }
    });

    const allNodes = Array.from(nodeMap.values());

    if (allNodes.length === 0) {
      return;
    }

    // Dynamically calculate the node radius
    const calculateNodeRadius = (text: string) => {
      const baseRadius = 25;
      const textLength = text.length;
      const minRadius = 20;
      const maxRadius = 50;

      // Dynamically adjust the radius according to the text length
      const dynamicRadius = Math.max(minRadius, Math.min(maxRadius, baseRadius + textLength * 2));
      return dynamicRadius;
    };

    // Get the connection color and style
    const getConnectionStyle = (type: string) => {
      switch (type) {
        case 'p':
          return { color: medicalColorScheme.policyLine, strokeWidth: 3, dashArray: 'none' };
        case 'g':
          return { color: medicalColorScheme.roleInheritance, strokeWidth: 3, dashArray: 'none' };
        case 'g2':
          return { color: medicalColorScheme.resourceInheritance, strokeWidth: 3, dashArray: '8,4' };
        case 'g3':
          return { color: medicalColorScheme.domainInheritance, strokeWidth: 3, dashArray: '4,2' };
        default:
          return { color: '#999', strokeWidth: 2, dashArray: 'none' };
      }
    };

    const getArrowMarker = (type: string): string => {
      switch (type) {
        case 'p':
          return 'url(#arrow-p)';
        case 'g':
          return 'url(#arrow-g)';
        case 'g2':
          return 'url(#arrow-g2)';
        case 'g3':
          return 'url(#arrow-g3)';
        default:
          return '';
      }
    };

    // Group nodes by type for better layout
    const nodesByType = new Map<string, any[]>();
    allNodes.forEach((node: any) => {
      const type = node.type || 'user';
      if (!nodesByType.has(type)) {
        nodesByType.set(type, []);
      }
      nodesByType.get(type)!.push(node);
    });

    // Assign initial positions to nodes based on their type to reduce edge crossing
    // This creates a hierarchical layout with users at top, resources at bottom
    const typeOrder = ['user', 'role', 'action', 'object', 'resource'];
    const verticalSpacing = innerHeight / (typeOrder.length + 1);
    
    allNodes.forEach((node: any) => {
      const typeIndex = typeOrder.indexOf(node.type || 'user');
      const yPosition = typeIndex >= 0 ? (typeIndex + 1) * verticalSpacing : innerHeight / 2;
      
      // Get nodes of the same type
      const sameTypeNodes = nodesByType.get(node.type || 'user') || [];
      const nodeIndex = sameTypeNodes.indexOf(node);
      const totalSameType = sameTypeNodes.length;
      
      // Distribute nodes of the same type horizontally
      const horizontalSpacing = innerWidth / (totalSameType + 1);
      const xPosition = (nodeIndex + 1) * horizontalSpacing;
      
      // Set initial position
      node.x = xPosition;
      node.y = yPosition;
    });

    // Create a force-oriented diagram simulation with improved parameters
    const simulation = d3
      .forceSimulation(allNodes)
      .force(
        'link',
        d3
          .forceLink(allLinks)
          .id((d: any) => {
            return d.id;
          })
          .distance(200)
          .strength(0.5),
      )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => {
          return calculateNodeRadius(d.id) + 30;
        }),
      )
      .force('y', d3.forceY((d: any) => {
        const typeIndex = typeOrder.indexOf(d.type || 'user');
        return typeIndex >= 0 ? (typeIndex + 1) * verticalSpacing : innerHeight / 2;
      }).strength(0.3))
      .force('x', d3.forceX(innerWidth / 2).strength(0.05));

    // Draw the connecting lines
    const links = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(allLinks)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        return getConnectionStyle(d.type).color;
      })
      .attr('stroke-width', (d: any) => {
        return getConnectionStyle(d.type).strokeWidth;
      })
      .attr('stroke-dasharray', (d: any) => {
        return getConnectionStyle(d.type).dashArray;
      })
      .attr('marker-end', (d: any) => {
        return getArrowMarker(d.type);
      })
      .attr('opacity', 0.8);

    // Create drag-and-drop behavior
    const drag = d3
      .drag<SVGGElement, any>()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d: any) => {
        const nodeRadius = calculateNodeRadius(d.id);
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const actualInnerWidth = svgRect.width - margin.left - margin.right;
          const actualInnerHeight = svgRect.height - margin.top - margin.bottom;

          d.fx = Math.max(nodeRadius, Math.min(actualInnerWidth - nodeRadius, event.x));
          d.fy = Math.max(nodeRadius, Math.min(actualInnerHeight - nodeRadius, event.y));
        } else {
          d.fx = Math.max(nodeRadius, Math.min(innerWidth - nodeRadius, event.x));
          d.fy = Math.max(nodeRadius, Math.min(innerHeight - nodeRadius, event.y));
        }
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const linkLabels = g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(
        allLinks.filter((d: any) => {
          return d.actions && d.actions.length > 0;
        }),
      )
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .attr('stroke', 'white')
      .attr('stroke-width', '2')
      .attr('paint-order', 'stroke')
      .text((d: any) => {
        return d.actions.join(', ');
      });

    // Add deny effect indicators (red X markers)
    const denyMarkers = g
      .append('g')
      .attr('class', 'deny-markers')
      .selectAll('g')
      .data(
        allLinks.filter((d: any) => {
          return d.effect === 'deny';
        }),
      )
      .enter()
      .append('g')
      .attr('class', 'deny-marker');

    // Draw red X for deny relationships
    denyMarkers
      .append('circle')
      .attr('r', 10)
      .attr('fill', 'white')
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2);

    denyMarkers
      .append('line')
      .attr('x1', -6)
      .attr('y1', -6)
      .attr('x2', 6)
      .attr('y2', 6)
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    denyMarkers
      .append('line')
      .attr('x1', -6)
      .attr('y1', 6)
      .attr('x2', 6)
      .attr('y2', -6)
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    // OnCustomDrawItem
    const nodes = g.append('g').attr('class', 'nodes').selectAll('g').data(allNodes).enter().append('g').call(drag);

    // Add a circle
    nodes
      .append('circle')
      .attr('r', (d: any) => {
        return calculateNodeRadius(d.id);
      })
      .attr('fill', (d: any) => {
        return medicalColorScheme[d.type] || medicalColorScheme.user;
      })
      .attr('stroke', medicalColorScheme.border)
      .attr('stroke-width', 2);

    // Add text labels (inside the circle)
    nodes
      .append('text')
      .text((d: any) => {
        return d.id;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d: any) => {
        const radius = calculateNodeRadius(d.id);
        const textLength = d.id.length;
        // Dynamically adjust the font size based on the circle size and text length
        const fontSize = Math.max(10, Math.min(14, (radius / textLength) * 2));
        return `${fontSize}px`;
      })
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .attr('pointer-events', 'none');

      // --- Interaction helpers and handlers (selection/highlight) ---
      // Compute neighbors and related relation line indices for a node
      const nodeNeighbors = (nodeId: string) => {
        const connectedLinks = allLinks.filter((l: any) => {
          const s = typeof l.source === 'object' ? l.source.id || l.source : l.source;
          const t = typeof l.target === 'object' ? l.target.id || l.target : l.target;
          return s === nodeId || t === nodeId;
        });
        const neighborNodes = new Set<string>();
        connectedLinks.forEach((l: any) => {
          const s = typeof l.source === 'object' ? l.source.id || l.source : l.source;
          const t = typeof l.target === 'object' ? l.target.id || l.target : l.target;
          neighborNodes.add(s);
          neighborNodes.add(t);
        });

        // Collect line indices from connected links (support multiple indices per link)
        const linkLineIndices = connectedLinks
          .flatMap((l: any) => {
            if (l.lineIndices && l.lineIndices.length > 0) {
              return l.lineIndices;
            }
            if (l.lineIndex !== undefined) {
              return [l.lineIndex];
            }
            return [];
          })
          .filter((x: any) => {
            return x !== undefined;
          }) as number[];

        // Also collect any relations from rawRelations that reference this node (source or target)
        const relationLineIndices = (rawRelations || [])
          .filter((r) => {
            return r.source === nodeId || r.target === nodeId;
          })
          .map((r) => {
            return r.lineIndex;
          })
          .filter((x: any) => {
            return x !== undefined;
          }) as number[];

        // Merge and dedupe indices
        const mergedIndices = Array.from(new Set<number>([...linkLineIndices, ...relationLineIndices]));

        return { links: mergedIndices, nodes: Array.from(neighborNodes) };
      };

      let currentSelection: { nodes: string[]; links: number[] } = { nodes: [], links: [] };

      const applyHighlight = (selection: { nodes: string[]; links: number[] }) => {
        // reset styles
        g.selectAll('.links line').attr('stroke-opacity', 0.8).attr('stroke-width', (d: any) => {
          return getConnectionStyle(d.type).strokeWidth;
        });
        g.selectAll('.nodes circle').attr('stroke-width', 2).attr('r', (d: any) => {
          return calculateNodeRadius(d.id);
        });
        g.selectAll('text').attr('font-weight', '700');

        // highlight links by lineIndex
        selection.links.forEach((ln) => {
          if (ln === undefined) return;
          g.selectAll('.links line')
            .filter((d: any) => {
              if (d.lineIndices && Array.isArray(d.lineIndices)) {
                return d.lineIndices.includes(ln);
              }
              return d.lineIndex === ln;
            })
            .attr('stroke-opacity', 1)
            .attr('stroke-width', 5);
        });

        // highlight nodes
        selection.nodes.forEach((nodeId) => {
          g.selectAll('.nodes circle')
            .filter((d: any) => {
              return d.id === nodeId;
            })
            .attr('stroke-width', 4)
            .attr('r', (d: any) => {
              return calculateNodeRadius(d.id) + 6;
            });
        });

        g.selectAll('text').attr('font-weight', (d: any) => {
          return selection.nodes.includes(d?.id) ? '900' : '700';
        });

        // dispatch selection as numeric line indices for precise policy highlighting
        try {
          const detail = { nodes: selection.nodes, links: selection.links.filter((x) => {
            return x !== undefined;
          }) };
          document.dispatchEvent(new CustomEvent('role-graph-selection', { detail }));
          if (svgRef.current && typeof (svgRef.current as any)?._onSelectionChange === 'function') {
            (svgRef.current as any)._onSelectionChange(detail);
          }
        } catch (e) {
          // ignore
        }
      };

    // Attach interaction handlers for links/nodes and background
      links
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).attr('stroke-opacity', 1).attr('stroke-width', 5);
      })
      .on('mouseout', function (event: any, d: any) {
        const isSelected = (d.lineIndices && d.lineIndices.some((li: number) => {
          return currentSelection.links.includes(li)
        })) || currentSelection.links.includes(d.lineIndex);
        d3.select(this).attr('stroke-opacity', isSelected ? 1 : 0.8).attr('stroke-width', isSelected ? 5 : getConnectionStyle(d.type).strokeWidth);
      })
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        const s = typeof d.source === 'object' ? d.source.id || d.source : d.source;
        const t = typeof d.target === 'object' ? d.target.id || d.target : d.target;
        const linksArr = d.lineIndices && d.lineIndices.length > 0
          ? d.lineIndices
          : d.lineIndex !== undefined
            ? [d.lineIndex]
            : [];
        currentSelection = { nodes: [s, t], links: linksArr };
        applyHighlight(currentSelection);
      });

    g.selectAll('.nodes g')
      .style('cursor', 'pointer')
      .on('mouseover', function (event: any, d: any) {
        d3.select(this).select('circle').attr('stroke-width', 4);
      })
      .on('mouseout', function (event: any, d: any) {
        const isSelected = currentSelection.nodes.includes(d.id);
        d3.select(this)
          .select('circle')
          .attr('stroke-width', isSelected ? 4 : 2)
          .attr('r', (dd: any) => {
            return isSelected ? calculateNodeRadius(dd.id) + 6 : calculateNodeRadius(dd.id);
          });
      })
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        const nodeId = d.id;
        const neighbors = nodeNeighbors(nodeId);
        const nodesToHighlight = Array.from(new Set([nodeId, ...neighbors.nodes]));
        currentSelection = { nodes: nodesToHighlight, links: neighbors.links };
        applyHighlight(currentSelection);
      });

    // Background click clears selection
    g.select('.graph-background').on('click', () => {
      currentSelection = { nodes: [], links: [] };
      applyHighlight(currentSelection);
    });

    // Force simulation update
    simulation.on('tick', () => {
      // The constraint node position is within the container
      allNodes.forEach((d: any) => {
        const radius = calculateNodeRadius(d.id);
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const actualInnerWidth = svgRect.width - margin.left - margin.right;
          const actualInnerHeight = svgRect.height - margin.top - margin.bottom;

          d.x = Math.max(radius, Math.min(actualInnerWidth - radius, d.x));
          d.y = Math.max(radius, Math.min(actualInnerHeight - radius, d.y));
        } else {
          d.x = Math.max(radius, Math.min(innerWidth - radius, d.x));
          d.y = Math.max(radius, Math.min(innerHeight - radius, d.y));
        }
      });

      links
        .attr('x1', (d: any) => {
          return d.source.x;
        })
        .attr('y1', (d: any) => {
          return d.source.y;
        })
        .attr('x2', (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = calculateNodeRadius(d.target.id);
          const arrowSpace = 0;
          return d.target.x - (dx / distance) * (nodeRadius + arrowSpace);
        })
        .attr('y2', (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const nodeRadius = calculateNodeRadius(d.target.id);
          const arrowSpace = 0;
          return d.target.y - (dy / distance) * (nodeRadius + arrowSpace);
        });

      linkLabels
        .attr('x', (d: any) => {
          return (d.source.x + d.target.x) / 2;
        })
        .attr('y', (d: any) => {
          return (d.source.y + d.target.y) / 2;
        });

      // Position deny markers below action labels to avoid overlap
      denyMarkers.attr('transform', (d: any) => {
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        // Offset by 20px below the midpoint to avoid overlapping with action text
        return `translate(${midX},${midY + 20})`;
      });

      nodes.attr('transform', (d: any) => {
        return `translate(${d.x},${d.y})`;
      });
    });
  };

  // Heuristic node type judgment
  const determineNodeTypeFromRelation = (rel: PolicyRelation, position: 'source' | 'target') => {
    const value = position === 'source' ? rel.source : rel.target;

    if (rel.type === 'p') {
      if (position === 'source') {
        return 'user';
      } else if (rel.action) {
        return 'object';
      } else {
        return 'resource';
      }
    }

    // Heuristic judgment of Strategy G
    if (value.includes('admin') || value.includes('manager')) {
      return 'role';
    }
    if (value.includes('data') || value.includes('resource')) {
      return 'resource';
    }

    return 'user';
  };

  return (
    <div ref={containerRef} className={`flex flex-col h-full ${className}`}>
      {/*legend */}
      {(treeData.length > 0 || Object.keys(relations).length > 0) && (
        <div className="flex-shrink-0 mb-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="font-medium mb-1 dark:text-white">{t('Node Types')}</div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.user }}></div>
                  <span className="dark:text-gray-300">{t('User')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.role }}></div>
                  <span className="dark:text-gray-300">{t('Role')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.resource }}></div>
                  <span className="dark:text-gray-300">{t('Resource')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.object }}></div>
                  <span className="dark:text-gray-300">{t('Object')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.action }}></div>
                  <span className="dark:text-gray-300">{t('Action')}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium mb-1 dark:text-white">{t('Connection Types')}</div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5" style={{ backgroundColor: medicalColorScheme.policyLine }}></div>
                  <span className="dark:text-gray-300">{t('p (Policy)')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5" style={{ backgroundColor: medicalColorScheme.roleInheritance }}></div>
                  <span className="dark:text-gray-300">{t('g (Role)')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: medicalColorScheme.resourceInheritance }}></div>
                  <span className="dark:text-gray-300">{t('g2 (Resource)')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-0.5 border-t-2 border-dotted" style={{ borderColor: medicalColorScheme.domainInheritance }}></div>
                  <span className="dark:text-gray-300">{t('g3 (Domain)')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Circular Dependency Warning */}
      {circularDeps.length > 0 && (
        <div className="flex-shrink-0 mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="font-medium text-yellow-800">{t('Circular dependency detected')}</div>
          {circularDeps.map((cycle, index) => {
            return (
              <div key={index} className="text-yellow-700">
                {cycle.join(' → ')}
              </div>
            );
          })}
        </div>
      )}

      {/* SVG graphics - Occupy all remaining space */}
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 overflow-hidden">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};
