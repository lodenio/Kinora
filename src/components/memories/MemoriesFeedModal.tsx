import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Plus, Search, MapPin, Users } from 'lucide-react';
import type { Memory } from '../../types/memory';
import type { FamilyMember } from '../../types/member';

interface MemoriesFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  allMembers: FamilyMember[];
  onOpenMemory: (memory: Memory) => void;
  onAddNewMemory: () => void;
}

export const MemoriesFeedModal: React.FC<MemoriesFeedModalProps> = ({
  isOpen,
  onClose,
  memories,
  allMembers,
  onOpenMemory,
  onAddNewMemory,
}) => {
  const [filterMemberId, setFilterMemberId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredMemories = memories.filter((mem) => {
    if (filterMemberId !== 'all' && !mem.taggedMemberIds.includes(filterMemberId)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mem.title.toLowerCase().includes(q);
      const matchCaption = mem.caption?.toLowerCase().includes(q) || false;
      const matchLoc = mem.location?.toLowerCase().includes(q) || false;
      return matchTitle || matchCaption || matchLoc;
    }
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#faf8f5] rounded-3xl border border-[oklch(88%_0.015_80)] shadow-[0_25px_65px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col z-10"
        >
          {/* Header with Lobster Two Typography */}
          <div className="px-5 py-4 border-b border-[oklch(91%_0.015_80)] bg-white/80 backdrop-blur-md flex items-center justify-between">
            <div>
              <h2 className="font-['Lobster_Two'] text-2xl sm:text-3xl font-bold text-[oklch(22%_0.03_55)] italic leading-tight">
                Family Memories
              </h2>
              <p className="text-xs text-[oklch(55%_0.02_60)] mt-0.5 font-['Raleway']">
                {memories.length} captured family moments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddNewMemory}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-[oklch(88%_0.015_80)] text-[oklch(25%_0.03_55)] text-xs font-semibold shadow-xs hover:bg-[oklch(96%_0.01_80)] active:scale-95 transition-all font-['Raleway']"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Add Memory</span>
                <span className="sm:hidden">Add</span>
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[oklch(40%_0.02_55)] transition-colors active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & People Filter Bar in Raleway */}
          <div className="px-5 py-3 bg-white/50 border-b border-[oklch(92%_0.01_80)] space-y-2.5 font-['Raleway']">
            {/* Search Input */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-[oklch(88%_0.015_80)] shadow-xs">
              <Search className="w-4 h-4 text-[oklch(60%_0.02_55)] shrink-0" />
              <input
                type="text"
                placeholder="Search memories, locations, or stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm text-[oklch(22%_0.03_55)] placeholder-[oklch(65%_0.02_55)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[oklch(60%_0.02_55)] hover:text-[oklch(22%_0.03_55)]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* People Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setFilterMemberId('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterMemberId === 'all'
                    ? 'bg-[oklch(25%_0.03_55)] text-white shadow-xs'
                    : 'bg-white border border-[oklch(89%_0.015_80)] text-[oklch(45%_0.02_55)] hover:bg-[oklch(96%_0.01_80)]'
                }`}
              >
                All Moments
              </button>

              {allMembers.map((member) => {
                const isSelected = filterMemberId === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => setFilterMemberId(isSelected ? 'all' : member.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-[oklch(25%_0.03_55)] text-white shadow-xs'
                        : 'bg-white border border-[oklch(89%_0.015_80)] text-[oklch(40%_0.02_55)] hover:bg-[oklch(96%_0.01_80)]'
                    }`}
                  >
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.firstName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[oklch(80%_0.08_75)] text-white text-[9px] flex items-center justify-center font-bold">
                        {member.firstName[0]}
                      </div>
                    )}
                    <span>{member.firstName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-['Raleway']">
            {filteredMemories.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-dashed border-[oklch(85%_0.02_80)] max-w-sm mx-auto my-8">
                <Camera className="w-10 h-10 mx-auto text-[oklch(75%_0.02_60)] stroke-[1.2] mb-3" />
                <h3 className="font-bold text-[oklch(25%_0.03_55)] text-sm sm:text-base">
                  No memories found
                </h3>
                <p className="text-xs text-[oklch(55%_0.02_55)] mt-1">
                  Try clearing your search or upload a photo to remember this moment.
                </p>
                <button
                  onClick={onAddNewMemory}
                  className="mt-4 px-4 py-2 rounded-2xl bg-white border border-[oklch(88%_0.015_80)] text-[oklch(25%_0.03_55)] text-xs font-semibold shadow-xs hover:bg-[oklch(96%_0.01_80)] active:scale-95"
                >
                  Upload a Memory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredMemories.map((mem) => {
                  const taggedCount = mem.taggedMemberIds.length;
                  return (
                    <motion.div
                      key={mem.id}
                      whileHover={{ scale: 1.025 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => onOpenMemory(mem)}
                      className="group cursor-pointer relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 bg-black/5"
                    >
                      {/* Full-bleed Photo */}
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        {mem.dateTaken ? (
                          <span className="text-[10px] sm:text-[11px] font-semibold text-white/95 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xs">
                            {mem.dateTaken}
                          </span>
                        ) : <span />}

                        {taggedCount > 0 && (
                          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-white/95 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xs">
                            <Users className="w-3 h-3 text-amber-300" />
                            <span>{taggedCount}</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Gradient Scrim & Titles with Lobster Two */}
                      <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end">
                        <h4 className="font-['Lobster_Two'] font-bold text-white text-lg sm:text-xl leading-snug drop-shadow-sm italic">
                          {mem.title}
                        </h4>

                        {mem.location && (
                          <div className="flex items-center gap-1 text-[11px] text-white/80 mt-0.5 font-medium truncate drop-shadow-xs">
                            <MapPin className="w-3 h-3 text-rose-300 shrink-0" />
                            <span className="truncate">{mem.location}</span>
                          </div>
                        )}

                        {mem.caption && (
                          <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5 font-light leading-relaxed">
                            {mem.caption}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
