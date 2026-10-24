import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { MemberNode } from './MemberNode';
import type { FamilyMember } from '../../types/member';
import type { Relationship } from '../../types/relationship';
import type { Memory } from '../../types/memory';

const nodeTypes = {
  member: MemberNode,
};

interface FamilyCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  members: FamilyMember[];
  relationships: Relationship[];
  memories: Memory[];
  selectedMemberId: string | null;
  onSelectMember: (member: FamilyMember) => void;
  onQuickAdd: (member: FamilyMember) => void;
  onInteractionChange?: (isInteracting: boolean) => void;
}

export const FamilyCanvas: React.FC<FamilyCanvasProps> = ({
  initialNodes,
  initialEdges,
  members,
  relationships,
  memories,
  selectedMemberId,
  onSelectMember,
  onQuickAdd,
  onInteractionChange,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync nodes when initialNodes changes
  React.useEffect(() => {
    const memoryCountMap: Record<string, number> = {};
    memories.forEach((mem) => {
      mem.taggedMemberIds.forEach((id) => {
        memoryCountMap[id] = (memoryCountMap[id] || 0) + 1;
      });
    });

    const enrichedNodes = initialNodes.map((node) => {
      const member = node.data.member as FamilyMember;
      return {
        ...node,
        data: {
          ...node.data,
          memoryCount: memoryCountMap[member.id] || 0,
          isSelected: member.id === selectedMemberId,
          onSelect: onSelectMember,
          onQuickAdd: onQuickAdd,
        },
      };
    });

    setNodes(enrichedNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, memories, selectedMemberId, onSelectMember, onQuickAdd, setNodes, setEdges]);

  // MiniMap node color logic
  const nodeColor = useCallback((node: Node) => {
    const member = node.data?.member as FamilyMember | undefined;
    if (!member) return '#cbd5e1';
    if (member.gender === 'female') return 'oklch(75% 0.14 28)';
    if (member.gender === 'male') return 'oklch(70% 0.14 250)';
    return 'oklch(74% 0.17 68)';
  }, []);

  const handleMoveStart = useCallback(() => {
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    onInteractionChange?.(true);
  }, [onInteractionChange]);

  const handleMoveEnd = useCallback(() => {
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }
    // Small delay ensures smooth transition without flickering on quick stop-start gestures
    moveTimeoutRef.current = setTimeout(() => {
      onInteractionChange?.(false);
    }, 200);
  }, [onInteractionChange]);

  return (
    <div className="w-full h-screen relative bg-[oklch(98.2%_0.008_85)] overflow-hidden touch-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={2.0}
        panOnDrag={true}
        zoomOnPinch={true}
        preventScrolling={true}
        onMoveStart={handleMoveStart}
        onMoveEnd={handleMoveEnd}
        onNodeDragStart={handleMoveStart}
        onNodeDragStop={handleMoveEnd}
        defaultEdgeOptions={{
          style: { strokeWidth: 2.5, stroke: 'oklch(74% 0.17 68)' },
          type: 'default', // Curved Bezier lines
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="oklch(88% 0.015 80)"
        />

        {/* MiniMap visible on desktop/tablet, hidden on mobile */}
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          nodeBorderRadius={12}
          maskColor="oklch(22% 0.03 55 / 0.1)"
          className="!bottom-24 !right-4 !bg-white/90 !backdrop-blur-md !border !border-[oklch(88%_0.015_80)] !rounded-2xl !shadow-lg hidden md:block overflow-hidden"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};
