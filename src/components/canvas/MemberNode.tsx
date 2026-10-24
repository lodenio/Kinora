import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { FamilyMember } from '../../types/member';
import { Camera, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export interface MemberNodeData {
  member: FamilyMember;
  memoryCount?: number;
  isSelected?: boolean;
  onSelect?: (member: FamilyMember) => void;
  onQuickAdd?: (member: FamilyMember) => void;
}

export const MemberNode = memo(({ data }: NodeProps) => {
  const nodeData = data as unknown as MemberNodeData;
  const member = nodeData.member;
  const memoryCount = nodeData.memoryCount ?? 0;
  const isSelected = nodeData.isSelected;

  // Gender colors for initials avatar
  const getGenderStyle = () => {
    switch (member.gender) {
      case 'female':
        return 'from-[oklch(82%_0.12_25)] to-[oklch(68%_0.18_28)]';
      case 'male':
        return 'from-[oklch(78%_0.12_250)] to-[oklch(62%_0.16_250)]';
      default:
        return 'from-[oklch(80%_0.10_150)] to-[oklch(65%_0.14_150)]';
    }
  };

  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`;

  return (
    <div
      onClick={() => nodeData.onSelect?.(member)}
      className="group relative flex flex-col items-center cursor-pointer select-none w-24"
    >
      {/* Circular Avatar Container with Handles */}
      <div className="relative w-16 h-16">
        {/* Top Handle (Incoming Parent->Child) */}
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="!w-2 !h-2 !bg-[oklch(74%_0.17_68)] !border-2 !border-white !-top-1"
        />

        {/* Left Handle (Incoming Spouse) */}
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          className="!w-2 !h-2 !bg-[oklch(68%_0.18_28)] !border-2 !border-white !-left-1"
        />

        {/* Avatar Circle */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className={`w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-white transition-all duration-200
            ${isSelected
              ? 'ring-3 ring-[oklch(74%_0.17_68)] ring-offset-2 ring-offset-[oklch(98.2%_0.008_85)] shadow-[0_0_16px_oklch(74%_0.17_68/0.45)]'
              : 'shadow-[0_2px_10px_rgba(0,0,0,0.12)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)]'
            }`}
        >
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getGenderStyle()} text-white font-bold text-base flex items-center justify-center font-['Raleway'] tracking-wider`}
            >
              {initials}
            </div>
          )}
        </motion.div>

        {/* Status Dot (Living vs In Loving Memory) */}
        <span
          title={member.isLiving ? 'Living' : 'In Loving Memory'}
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
            member.isLiving ? 'bg-[oklch(66%_0.16_145)]' : 'bg-[oklch(50%_0.02_60)]'
          }`}
        />

        {/* Memories Badge */}
        {memoryCount > 0 && (
          <span
            title={`${memoryCount} memories`}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[oklch(74%_0.17_68)] text-white text-[10px] font-bold flex items-center justify-center border border-white shadow-xs"
          >
            {memoryCount}
          </span>
        )}

        {/* Quick Add Button (Visible on hover or when node is selected) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nodeData.onQuickAdd?.(member);
          }}
          title="Add relative"
          className={`absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-white text-[oklch(35%_0.02_55)] border border-[oklch(88%_0.015_80)] shadow-xs hover:bg-[oklch(96%_0.01_80)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
        </button>

        {/* Right Handle (Outgoing Spouse) */}
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          className="!w-2 !h-2 !bg-[oklch(68%_0.18_28)] !border-2 !border-white !-right-1"
        />

        {/* Bottom Handle (Outgoing Parent->Child) */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          className="!w-2 !h-2 !bg-[oklch(74%_0.17_68)] !border-2 !border-white !-bottom-1"
        />
      </div>

      {/* Name Directly Below Circular Image */}
      <div className="mt-1.5 text-center w-full px-0.5">
        <span className="font-semibold text-xs text-[oklch(22%_0.03_55)] leading-tight line-clamp-2 block font-['Raleway']">
          {member.firstName} {member.lastName}
        </span>
        {member.maidenName && (
          <span className="text-[10px] text-[oklch(55%_0.025_55)] italic block truncate">
            née {member.maidenName}
          </span>
        )}
      </div>
    </div>
  );
});

MemberNode.displayName = 'MemberNode';
