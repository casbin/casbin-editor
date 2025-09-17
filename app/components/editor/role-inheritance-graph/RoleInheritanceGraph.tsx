import React, { useEffect, useRef, useState } from 'react';  
import * as d3 from 'd3';  
import { PolicyInheritanceParser, PolicyNode, PolicyRelation } from '@/app/utils/roleInheritanceParser';  
import { useLang } from '@/app/context/LangContext';  
  
interface RoleInheritanceGraphProps {  
  policy: string;  
  className?: string;  
}  
  
export const RoleInheritanceGraph: React.FC<RoleInheritanceGraphProps> = ({   
  policy,   
  className = ''   
}) => {  
  const { t } = useLang();  
  const svgRef = useRef<SVGSVGElement>(null);  
  const containerRef = useRef<HTMLDivElement>(null);  
  const [treeData, setTreeData] = useState<PolicyNode[]>([]);  
  const [relations, setRelations] = useState<Record<string, PolicyRelation[]>>({});  
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
    policyLine: '#2C3E50',        // P Strategy Connection - Dark gray  
    roleInheritance: '#3498DB',   // G Strategy Connection - Blue  
    resourceInheritance: '#27AE60', // G2 Strategy connection - Green  
    domainInheritance: '#9B59B6'    // G3 Strategy Connection - Purple  
  };  
  
  // Dynamically calculate the node radius  
  const calculateNodeRadius = (text: string) => {  
    const baseRadius = 25;  
    const textLength = text.length;  
    return Math.max(baseRadius, textLength * 3.5);  
  };  
  
  // Get the connection color  
  const getLineColor = (type: string) => {  
    switch (type) {  
      case 'p': return medicalColorScheme.policyLine;  
      case 'g': return medicalColorScheme.roleInheritance;  
      case 'g2': return medicalColorScheme.resourceInheritance;  
      case 'g3': return medicalColorScheme.domainInheritance;  
      default: return medicalColorScheme.text;  
    }  
  };  
  
  // Get the connection style  
  const getLineStyle = (type: string) => {  
    switch (type) {  
      case 'p': return 'none';  
      case 'g': return 'none';  
      case 'g2': return '5,5';  
      case 'g3': return '2,3';  
      default: return 'none';  
    }  
  };  
  
  useEffect(() => {  
    const updateDimensions = () => {  
      if (containerRef.current) {  
        const rect = containerRef.current.getBoundingClientRect();  
        setDimensions({ width: rect.width, height: rect.height });  
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
      return;  
    }  
  
    // Add a cropping path to ensure that the content does not exceed the boundary  
    svg.append('defs').append('clipPath')  
      .attr('id', 'chart-area')  
      .append('rect')  
      .attr('width', innerWidth)  
      .attr('height', innerHeight);  
  
    const g = svg.append('g')  
      .attr('transform', `translate(${margin.left},${margin.top})`)  
      .attr('clip-path', 'url(#chart-area)');  
  
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
            level: node.level  
          });  
        }  
  
        if (parentId) {  
          const linkId = `${parentId}-${node.name}`;  
          if (!allLinks.find((l) => {return l.id === linkId})) {  
            allLinks.push({  
              id: linkId,  
              source: parentId,  
              target: node.name,  
              type: node.policyType || 'g'  
            });  
          }  
        }  
  
        if (node.children && node.children.length > 0) {  
          flattenNodes(node.children, node.name);  
        }  
      });  
    };  
  
    flattenNodes(treeData);  
  
    // Add nodes and connections from relational data  
    Object.entries(relations).forEach(([type, rels]) => {  
      rels.forEach((rel) => {  
        // Add source node  
        if (!nodeMap.has(rel.source)) {  
          nodeMap.set(rel.source, {  
            id: rel.source,  
            type: determineNodeTypeFromRelation(rel, 'source'),  
            policyType: type,  
            level: 0  
          });  
        }  
  
        // Add the target node  
        if (!nodeMap.has(rel.target)) {  
          nodeMap.set(rel.target, {  
            id: rel.target,  
            type: determineNodeTypeFromRelation(rel, 'target'),  
            policyType: type,  
            level: 1  
          });  
        }  
  
        // Add a connection (remove duplicates)  
        const linkId = `${rel.source}-${rel.target}-${type}`;  
        if (!allLinks.find((l) => {return l.id === linkId})) {  
          allLinks.push({  
            id: linkId,  
            source: rel.source,  
            target: rel.target,  
            type: type,  
            action: rel.action,  
            domain: rel.domain  
          });  
        }  
      });  
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
        case 'p': return { color: medicalColorScheme.policyLine, strokeWidth: 3, dashArray: 'none' };  
        case 'g': return { color: medicalColorScheme.roleInheritance, strokeWidth: 3, dashArray: 'none' };  
        case 'g2': return { color: medicalColorScheme.resourceInheritance, strokeWidth: 3, dashArray: '8,4' };  
        case 'g3': return { color: medicalColorScheme.domainInheritance, strokeWidth: 3, dashArray: '4,2' };  
        default: return { color: '#999', strokeWidth: 2, dashArray: 'none' };  
      }  
    };  
  
    // Create a force-oriented diagram simulation  
    const simulation = d3.forceSimulation(allNodes)  
      .force('link', d3.forceLink(allLinks).id((d: any) => {return d.id}).distance(100))  
      .force('charge', d3.forceManyBody().strength(-400))  
      .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))  
      .force('collision', d3.forceCollide().radius((d: any) => {return calculateNodeRadius(d.id) + 5}));  
  
    // Draw the connecting lines  
    const links = g.append('g')  
      .attr('class', 'links')  
      .selectAll('line')  
      .data(allLinks)  
      .enter().append('line')  
      .attr('stroke', (d: any) => {return getConnectionStyle(d.type).color})  
      .attr('stroke-width', (d: any) => {return getConnectionStyle(d.type).strokeWidth})  
      .attr('stroke-dasharray', (d: any) => {return getConnectionStyle(d.type).dashArray})  
      .attr('opacity', 0.8);  
  
    // Create drag-and-drop behavior  
    const drag = d3.drag<SVGGElement, any>()  
      .on('start', (event, d: any) => {  
        if (!event.active) simulation.alphaTarget(0.3).restart();  
        d.fx = d.x;  
        d.fy = d.y;  
      })  
      .on('drag', (event, d: any) => {  
        d.fx = event.x;  
        d.fy = event.y;  
      })  
      .on('end', (event, d: any) => {  
        if (!event.active) simulation.alphaTarget(0);  
        d.fx = null;  
        d.fy = null;  
      });  
  
    // OnCustomDrawItem  
    const nodes = g.append('g')  
      .attr('class', 'nodes')  
      .selectAll('g')  
      .data(allNodes)  
      .enter().append('g')  
      .call(drag);  
  
    // Add a circle  
    nodes.append('circle')  
      .attr('r', (d: any) => {return calculateNodeRadius(d.id)})  
      .attr('fill', (d: any) => {return medicalColorScheme[d.type] || medicalColorScheme.user})  
      .attr('stroke', medicalColorScheme.border)  
      .attr('stroke-width', 2);  
  
    // Add text labels (inside the circle)  
    nodes.append('text')  
      .text((d: any) => {return d.id})  
      .attr('text-anchor', 'middle')  
      .attr('dy', '0.35em')  
      .attr('font-size', (d: any) => {  
        const radius = calculateNodeRadius(d.id);  
        const textLength = d.id.length;  
        // Dynamically adjust the font size based on the circle size and text length  
        const fontSize = Math.max(10, Math.min(14, radius / textLength * 2));  
        return `${fontSize}px`;  
      })  
      .attr('font-weight', 'bold')  
      .attr('fill', 'white')  
      .attr('pointer-events', 'none');  
  
    // Force simulation update 
    simulation.on('tick', () => {  
      // The constraint node position is within the container  
      allNodes.forEach((d: any) => {  
        const radius = calculateNodeRadius(d.id);  
        d.x = Math.max(radius, Math.min(innerWidth - radius, d.x));  
        d.y = Math.max(radius, Math.min(innerHeight - radius, d.y));  
      });  
  
      links  
        .attr('x1', (d: any) => {return d.source.x})  
        .attr('y1', (d: any) => {return d.source.y})  
        .attr('x2', (d: any) => {return d.target.x})  
        .attr('y2', (d: any) => {return d.target.y});  
  
      nodes  
        .attr('transform', (d: any) => {return `translate(${d.x},${d.y})`});  
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
      {/*legeng */}  
      {(treeData.length > 0 || Object.keys(relations).length > 0) && (  
        <div className="flex-shrink-0 mb-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs">  
          <div className="grid grid-cols-2 gap-2">  
            <div>  
              <div className="font-medium mb-1">{t('Node Types')}</div>  
              <div className="flex flex-wrap gap-2">  
                <div className="flex items-center gap-1">  
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.user }}></div>  
                  <span>{t('User')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.role }}></div>  
                  <span>{t('Role')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.resource }}></div>  
                  <span>{t('Resource')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.object }}></div>  
                  <span>{t('Object')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: medicalColorScheme.action }}></div>  
                  <span>{t('Action')}</span>  
                </div>  
              </div>  
            </div>  
            <div>  
              <div className="font-medium mb-1">{t('Connection Types')}</div>  
              <div className="flex flex-wrap gap-2">  
                <div className="flex items-center gap-1">  
                  <div className="w-4 h-0.5" style={{ backgroundColor: medicalColorScheme.policyLine }}></div>  
                  <span>{t('P (Policy)')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-4 h-0.5" style={{ backgroundColor: medicalColorScheme.roleInheritance }}></div>  
                  <span>{t('G (Role)')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: medicalColorScheme.resourceInheritance }}></div>  
                  <span>{t('G2 (Resource)')}</span>  
                </div>  
                <div className="flex items-center gap-1">  
                  <div className="w-4 h-0.5 border-t-2 border-dotted" style={{ borderColor: medicalColorScheme.domainInheritance }}></div>  
                  <span>{t('G3 (Domain)')}</span>  
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
          {circularDeps.map((cycle, index) => {return (  
            <div key={index} className="text-yellow-700">  
              {cycle.join(' → ')}  
            </div>  
          )})}  
        </div>  
      )}  
  
      {/* SVG graphics - Occupy all remaining space */}  
      <div className="flex-1 min-h-0 border border-gray-200 rounded bg-white overflow-hidden">  
        <svg ref={svgRef} className="w-full h-full"></svg>  
      </div>  
  
      {/* Empty state - Modify condition check */}  
      {treeData.length === 0 && Object.keys(relations).length === 0 && (  
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">  
          {t('No policy relationships found')}  
        </div>  
      )}  
    </div>  
  );  
};