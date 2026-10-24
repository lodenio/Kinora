import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import type { FamilyMember } from '../types/member';
import type { Relationship } from '../types/relationship';

// Compact circular avatar dimensions
const NODE_WIDTH = 96;
const NODE_HEIGHT = 96;

export interface LayoutOptions {
  direction?: 'TB' | 'LR';
  nodeSeparation?: number;
  rankSeparation?: number;
}

/**
 * Calculates hierarchical generation layout for members & relationships using Dagre
 */
export function getTreeLayout(
  members: FamilyMember[],
  relationships: Relationship[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  const { direction = 'TB', nodeSeparation = 45, rankSeparation = 85 } = options;

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    marginx: 30,
    marginy: 30,
  });

  // 1. Add nodes to Dagre
  members.forEach((member) => {
    dagreGraph.setNode(member.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // 2. Add edges to Dagre
  relationships.forEach((rel) => {
    if (rel.type === 'parent-child') {
      dagreGraph.setEdge(rel.sourceId, rel.targetId, { weight: 2 });
    } else if (rel.type === 'spouse') {
      dagreGraph.setEdge(rel.sourceId, rel.targetId, { weight: 1 });
    }
  });

  // 3. Compute layout
  dagre.layout(dagreGraph);

  // 4. Transform into React Flow Nodes
  const nodes: Node[] = members.map((member) => {
    const nodeWithPosition = dagreGraph.node(member.id);
    return {
      id: member.id,
      type: 'member',
      position: {
        x: (nodeWithPosition?.x ?? 0) - NODE_WIDTH / 2,
        y: (nodeWithPosition?.y ?? 0) - NODE_HEIGHT / 2,
      },
      data: {
        member,
      },
    };
  });

  // 5. Transform into React Flow Edges with organic Curved Bezier Lines
  const edges: Edge[] = relationships.map((rel) => {
    const isSpouse = rel.type === 'spouse';
    return {
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      sourceHandle: isSpouse ? 'right' : 'bottom',
      targetHandle: isSpouse ? 'left' : 'top',
      type: 'default', // Smooth Cubic Bezier Curves
      animated: isSpouse,
      style: {
        stroke: isSpouse ? 'oklch(68% 0.18 28)' : 'oklch(74% 0.17 68)',
        strokeWidth: isSpouse ? 2 : 2.5,
        strokeDasharray: isSpouse ? '4,4' : undefined,
      },
      data: {
        relationship: rel,
      },
    };
  });

  return { nodes, edges };
}
