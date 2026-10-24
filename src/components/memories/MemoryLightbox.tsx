import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Users } from 'lucide-react';
import type { Memory } from '../../types/memory';
import type { FamilyMember } from '../../types/member';

interface MemoryLightboxProps {
  memory: Memory | null;
  memoriesList: Memory[];
  allMembers: FamilyMember[];
  onClose: () => void;
  onSelectMember: (member: FamilyMember) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memory,
  memoriesList,
  allMembers,
  onClose,
  onSelectMember,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  if (!memory) return null;

  const taggedMembers = memory.taggedMemberIds
    .map((id) => allMembers.find((m) => m.id === id))
    .filter(Boolean) as FamilyMember[];

  const currentIndex = memoriesList.findIndex((m) => m.id === memory.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < memoriesList.length - 1;

  return (
    <AnimatePresence>
      {/* Lightbox container at z-[100] to always float directly on top of all modals & drawers */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center select-none p-2 sm:p-4">
        {/* Dark Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/92 backdrop-blur-2xl"
        />

        {/* Top Floating Close Button */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[110] flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-all backdrop-blur-md active:scale-95 border border-white/10"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {hasPrev && (
          <button
            onClick={() => onNavigate('prev')}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md active:scale-95 flex items-center justify-center border border-white/10 shadow-lg"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => onNavigate('next')}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md active:scale-95 flex items-center justify-center border border-white/10 shadow-lg"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Content Modal Frame */}
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl max-h-[92vh] sm:max-h-[90vh] w-full flex flex-col md:flex-row bg-[#181816]/95 rounded-3xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden z-[105] text-white backdrop-blur-3xl"
        >
          {/* Photo Display Area */}
          <div className="flex-1 bg-black/50 flex items-center justify-center p-3 sm:p-5 min-h-[220px] sm:min-h-[320px] md:min-h-[500px]">
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="max-h-[45vh] md:max-h-[76vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Details Sidebar / Inspector */}
          <div className="w-full md:w-84 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-4 bg-white/5 border-t md:border-t-0 md:border-l border-white/10">
            <div className="space-y-3.5">
              {/* Title in Lobster Two Typography */}
              <h3 className="font-['Lobster_Two'] text-2xl sm:text-3xl font-bold text-amber-200 tracking-wide leading-snug italic">
                {memory.title}
              </h3>

              {/* Metadata Badges in Raleway */}
              <div className="flex flex-wrap gap-2 text-xs font-['Raleway']">
                {memory.dateTaken && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{memory.dateTaken}</span>
                  </span>
                )}
                {memory.location && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-300" />
                    <span>{memory.location}</span>
                  </span>
                )}
              </div>

              {/* Story / Caption in Raleway */}
              {memory.caption && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed font-light font-['Raleway']">
                  "{memory.caption}"
                </div>
              )}
            </div>

            {/* Tagged Family Members */}
            {taggedMembers.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5 font-['Raleway']">
                  <Users className="w-3.5 h-3.5 text-amber-300" />
                  <span>People in this Memory</span>
                </div>
                <div className="flex flex-wrap gap-2 font-['Raleway']">
                  {taggedMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onClose();
                        onSelectMember(m);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-all active:scale-95 border border-white/5"
                      title={`Jump to ${m.firstName} in Family Tree`}
                    >
                      {m.avatarUrl ? (
                        <img
                          src={m.avatarUrl}
                          alt={m.firstName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[oklch(74%_0.17_68)] text-white text-[9px] flex items-center justify-center font-bold">
                          {m.firstName[0]}
                        </div>
                      )}
                      <span>{m.firstName} {m.lastName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
