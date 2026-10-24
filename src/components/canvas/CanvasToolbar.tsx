import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Maximize2,
  Plus,
  Images,
  Download,
  Upload,
  RotateCcw,
  Search,
  Users,
  X,
  MoreHorizontal,
} from 'lucide-react';
import type { FamilyMember } from '../../types/member';

interface CanvasToolbarProps {
  members: FamilyMember[];
  memoryCount: number;
  isMoving: boolean;
  onFitView: () => void;
  onAutoLayout: () => void;
  onAddMember: () => void;
  onOpenMemoriesFeed: () => void;
  onSelectMember: (member: FamilyMember) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  members,
  memoryCount,
  isMoving,
  onFitView,
  onAutoLayout,
  onAddMember,
  onOpenMemoriesFeed,
  onSelectMember,
  onExport,
  onImport,
  onReset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const filteredMembers = searchQuery.trim()
    ? members.filter((m) =>
        `${m.firstName} ${m.lastName} ${m.maidenName || ''} ${m.nickname || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. TOP BAR: Brand, Member Count & View/Align Controls   */}
      {/* ======================================================== */}
      <header
        className={`absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none transition-all duration-300 ${
          isMoving ? 'opacity-35 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Brand & Member Counter Pill */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[oklch(89%_0.015_80)] shadow-[0_4px_16px_-2px_oklch(22%_0.03_55/0.06)]">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[oklch(74%_0.17_68)] to-[oklch(68%_0.18_28)] flex items-center justify-center text-white shadow-xs">
            <span className="font-['Lobster_Two'] text-lg font-bold italic leading-none">K</span>
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-['Lobster_Two'] text-lg text-[oklch(24%_0.03_55)] font-bold italic leading-none">
              Kinora
            </h1>
            <span className="text-[oklch(75%_0.02_60)]">•</span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[oklch(50%_0.02_55)] font-['Raleway']">
              <Users className="w-3 h-3 text-[oklch(74%_0.17_68)]" />
              <span>{members.length}</span>
            </div>
          </div>
        </div>

        {/* View & Auto-Align Dropdown Button */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => {
              setIsViewMenuOpen(!isViewMenuOpen);
              setIsMoreMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/85 backdrop-blur-md border border-[oklch(89%_0.015_80)] text-[oklch(25%_0.03_55)] text-xs font-semibold shadow-xs hover:bg-white active:scale-95 transition-all font-['Raleway']"
            title="Tree Layout & View options"
          >
            <Sparkles className="w-3.5 h-3.5 text-[oklch(74%_0.17_68)] stroke-[2.5]" />
            <span className="hidden sm:inline">Align & View</span>
            <span className="sm:hidden">Align</span>
          </button>

          {isViewMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-[oklch(89%_0.015_80)] shadow-[0_12px_32px_-6px_oklch(22%_0.03_55/0.15)] p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 font-['Raleway']">
              <div className="px-2.5 py-1 text-[10px] font-bold text-[oklch(55%_0.02_60)] uppercase tracking-wider">
                Canvas Alignment
              </div>
              <button
                onClick={() => {
                  onAutoLayout();
                  setIsViewMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 hover:bg-[oklch(96%_0.02_75)] text-[oklch(25%_0.03_55)] hover:text-[oklch(74%_0.17_68)] transition-colors font-medium"
              >
                <Sparkles className="w-4 h-4 text-[oklch(74%_0.17_68)]" />
                <span>Auto-Align Tree</span>
              </button>
              <button
                onClick={() => {
                  onFitView();
                  setIsViewMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 hover:bg-[oklch(96%_0.01_80)] text-[oklch(25%_0.03_55)] transition-colors font-medium"
              >
                <Maximize2 className="w-4 h-4 text-[oklch(55%_0.02_60)]" />
                <span>Fit Entire Tree</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MACOS STYLE FLOATING GLASS DOCK (Thumb Reach)        */}
      {/* ======================================================== */}
      <nav
        className={`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-all duration-300 ${
          isMoving ? 'opacity-30 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[26px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)]">
          {/* 1. Search Dock Icon */}
          <div className="relative group flex flex-col items-center">
            {/* macOS Tooltip */}
            <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1c1917]/85 backdrop-blur-md text-white text-[11px] font-medium shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-['Raleway']">
              Search
            </div>
            <motion.button
              whileHover={{ scale: 1.18, y: -5 }}
              whileTap={{ scale: 0.92, y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-gradient-to-b from-white/95 to-[oklch(96%_0.01_80)] border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-[oklch(35%_0.02_55)] hover:text-[oklch(20%_0.03_55)] cursor-pointer"
              title="Search family members"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </motion.button>
          </div>

          {/* 2. Add Member Dock Icon */}
          <div className="relative group flex flex-col items-center">
            {/* macOS Tooltip */}
            <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1c1917]/85 backdrop-blur-md text-white text-[11px] font-medium shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-['Raleway']">
              Add Member
            </div>
            <motion.button
              whileHover={{ scale: 1.18, y: -5 }}
              whileTap={{ scale: 0.92, y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={onAddMember}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-gradient-to-b from-white/95 to-[oklch(96%_0.01_80)] border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-[oklch(35%_0.02_55)] hover:text-[oklch(20%_0.03_55)] cursor-pointer"
              title="Add new family member"
            >
              <Plus className="w-5 h-5 stroke-[2.2]" />
            </motion.button>
          </div>

          {/* 3. Memories Dock Icon */}
          <div className="relative group flex flex-col items-center">
            {/* macOS Tooltip */}
            <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1c1917]/85 backdrop-blur-md text-white text-[11px] font-medium shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-['Raleway']">
              Memories
            </div>
            <motion.button
              whileHover={{ scale: 1.18, y: -5 }}
              whileTap={{ scale: 0.92, y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={onOpenMemoriesFeed}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-gradient-to-b from-white/95 to-[oklch(96%_0.01_80)] border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-[oklch(35%_0.02_55)] hover:text-[oklch(20%_0.03_55)] cursor-pointer"
              title="Browse family memories"
            >
              <Images className="w-5 h-5 stroke-[2]" />
              {memoryCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[oklch(68%_0.18_28)] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  {memoryCount}
                </span>
              )}
            </motion.button>
          </div>

          {/* macOS Dock Hairline Divider */}
          <div className="w-[1px] h-7 bg-black/15 mx-0.5 sm:mx-1" />

          {/* 4. More Options Dock Icon */}
          <div className="relative group flex flex-col items-center">
            {/* macOS Tooltip */}
            <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-[#1c1917]/85 backdrop-blur-md text-white text-[11px] font-medium shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-['Raleway']">
              Settings & Backup
            </div>
            <motion.button
              whileHover={{ scale: 1.18, y: -5 }}
              whileTap={{ scale: 0.92, y: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              onClick={() => {
                setIsMoreMenuOpen(!isMoreMenuOpen);
                setIsViewMenuOpen(false);
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-gradient-to-b from-white/95 to-[oklch(96%_0.01_80)] border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] flex items-center justify-center text-[oklch(35%_0.02_55)] hover:text-[oklch(20%_0.03_55)] cursor-pointer"
              title="More options"
            >
              <MoreHorizontal className="w-5 h-5 stroke-[2]" />
            </motion.button>

            {/* More Menu Dropdown (Pops upward from dock) */}
            {isMoreMenuOpen && (
              <div className="absolute right-0 bottom-full mb-3 w-56 rounded-3xl bg-white border border-[oklch(89%_0.015_80)] shadow-[0_16px_40px_-8px_oklch(22%_0.03_55/0.2)] p-2 z-40 animate-in fade-in zoom-in-95 duration-150 font-['Raleway']">
                <div className="px-2.5 py-1 text-[10px] font-bold text-[oklch(55%_0.02_60)] uppercase tracking-wider">
                  Backup & Options
                </div>
                <button
                  onClick={() => {
                    onExport();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 hover:bg-[oklch(96%_0.01_80)] transition-colors text-[oklch(25%_0.03_55)] font-medium active:scale-95"
                >
                  <Download className="w-4 h-4 text-[oklch(55%_0.14_68)]" />
                  <span>Export Backup (JSON)</span>
                </button>
                <button
                  onClick={() => {
                    onImport();
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 hover:bg-[oklch(96%_0.01_80)] transition-colors text-[oklch(25%_0.03_55)] font-medium active:scale-95"
                >
                  <Upload className="w-4 h-4 text-[oklch(55%_0.14_150)]" />
                  <span>Import Backup</span>
                </button>
                <div className="my-1 border-t border-[oklch(92%_0.01_80)]" />
                <button
                  onClick={() => {
                    if (window.confirm('Reset family tree to default sample data? Your changes will be replaced.')) {
                      onReset();
                    }
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 hover:bg-rose-50 text-[oklch(55%_0.18_28)] transition-colors font-medium active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Sample Tree</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* 3. SEARCH SHEET / MODAL (Instant Mobile Finder)          */}
      {/* ======================================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 select-none font-['Raleway']">
          <div
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-[oklch(88%_0.015_80)] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden z-10 flex flex-col mt-4 sm:mt-12 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-3 sm:p-4 border-b border-[oklch(90%_0.015_80)] flex items-center gap-3">
              <Search className="w-5 h-5 text-[oklch(74%_0.17_68)] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search by name, maiden name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-base text-[oklch(22%_0.03_55)] placeholder-[oklch(62%_0.02_55)] focus:outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1.5 rounded-xl text-[oklch(50%_0.02_55)] hover:bg-[oklch(96%_0.01_80)] active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-6 text-center text-xs text-[oklch(55%_0.02_60)]">
                  Type a name to quickly locate anyone in the family tree.
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="p-6 text-center text-xs text-[oklch(55%_0.02_60)]">
                  No family members found for "{searchQuery}".
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      onSelectMember(member);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-2xl text-sm flex items-center justify-between hover:bg-[oklch(96%_0.015_80)] active:bg-[oklch(93%_0.02_80)] transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-[oklch(24%_0.03_55)] block">
                        {member.firstName} {member.lastName}
                      </span>
                      {member.maidenName && (
                        <span className="text-[11px] text-[oklch(55%_0.025_55)] italic">
                          née {member.maidenName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[oklch(96%_0.01_80)] text-[oklch(50%_0.02_55)] font-medium">
                      {member.isLiving ? 'Living' : 'Deceased'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
