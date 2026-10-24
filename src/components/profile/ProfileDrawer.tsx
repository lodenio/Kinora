import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  UserPlus,
  Edit3,
  Trash2,
  Camera,
  Plus,
  Sparkles,
} from 'lucide-react';
import { FamilyMember } from '../../types/member';
import { Relationship } from '../../types/relationship';
import { Memory } from '../../types/memory';

interface ProfileDrawerProps {
  member: FamilyMember | null;
  allMembers: FamilyMember[];
  relationships: Relationship[];
  memories: Memory[];
  onClose: () => void;
  onEdit: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
  onAddRelative: (member: FamilyMember) => void;
  onAddMemory: (member: FamilyMember) => void;
  onSelectMember: (member: FamilyMember) => void;
  onOpenMemoryLightbox: (memory: Memory) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  member,
  allMembers,
  relationships,
  memories,
  onClose,
  onEdit,
  onDelete,
  onAddRelative,
  onAddMemory,
  onSelectMember,
  onOpenMemoryLightbox,
}) => {
  if (!member) return null;

  // Filter memories tagged with this member
  const memberMemories = memories.filter((m) =>
    m.taggedMemberIds.includes(member.id)
  );

  // Compute relatives
  const parentRelationships = relationships.filter(
    (r) => r.type === 'parent-child' && r.targetId === member.id
  );
  const parents = parentRelationships
    .map((r) => allMembers.find((m) => m.id === r.sourceId))
    .filter(Boolean) as FamilyMember[];

  const childRelationships = relationships.filter(
    (r) => r.type === 'parent-child' && r.sourceId === member.id
  );
  const children = childRelationships
    .map((r) => allMembers.find((m) => m.id === r.targetId))
    .filter(Boolean) as FamilyMember[];

  const spouseRelationships = relationships.filter(
    (r) =>
      r.type === 'spouse' &&
      (r.sourceId === member.id || r.targetId === member.id)
  );
  const spouses = spouseRelationships
    .map((r) => {
      const partnerId = r.sourceId === member.id ? r.targetId : r.sourceId;
      return {
        member: allMembers.find((m) => m.id === partnerId),
        relation: r,
      };
    })
    .filter((s) => Boolean(s.member)) as {
    member: FamilyMember;
    relation: Relationship;
  }[];

  // Calculate age
  const calculateAge = () => {
    if (!member.birthDate) return null;
    const birthYear = parseInt(member.birthDate.slice(0, 4), 10);
    if (isNaN(birthYear)) return null;

    if (member.isLiving) {
      const currentYear = new Date().getFullYear();
      return `${currentYear - birthYear} years old`;
    } else if (member.deathDate) {
      const deathYear = parseInt(member.deathDate.slice(0, 4), 10);
      if (!isNaN(deathYear)) {
        return `Passed at age ${deathYear - birthYear}`;
      }
    }
    return null;
  };

  const ageText = calculateAge();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 pointer-events-none flex justify-end">
        {/* Backdrop for mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs pointer-events-auto md:hidden"
        />

        {/* Sliding Sheet */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="pointer-events-auto w-full max-w-md h-full bg-[#fdfbf7] border-l border-[oklch(88%_0.015_80)] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col z-50 overflow-hidden"
        >
          {/* Top Header Bar */}
          <div className="p-4 flex items-center justify-between border-b border-[oklch(90%_0.015_80)] bg-white/70 backdrop-blur-sm">
            <span className="text-xs uppercase font-bold tracking-wider text-[oklch(55%_0.02_60)]">
              Family Profile
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(member)}
                className="p-2 rounded-xl text-[oklch(40%_0.02_55)] hover:text-[oklch(20%_0.03_55)] hover:bg-[oklch(96%_0.01_80)] transition-colors active:scale-95"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to remove ${member.firstName} from the family tree?`
                    )
                  ) {
                    onDelete(member.id);
                  }
                }}
                className="p-2 rounded-xl text-[oklch(55%_0.16_28)] hover:bg-rose-50 transition-colors active:scale-95"
                title="Delete Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[oklch(40%_0.02_55)] hover:bg-[oklch(96%_0.01_80)] transition-colors active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Hero Profile Details */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative shrink-0">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.firstName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-black/5"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[oklch(74%_0.17_68)] to-[oklch(68%_0.18_28)] text-white font-bold text-2xl flex items-center justify-center border-2 border-white shadow-md font-['Lobster_Two']">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                )}
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    member.isLiving
                      ? 'bg-[oklch(66%_0.16_145)]'
                      : 'bg-[oklch(55%_0.02_60)]'
                  }`}
                  title={member.isLiving ? 'Living' : 'Passed away'}
                />
              </div>

              {/* Names & Bio Info */}
              <div className="flex-1 min-w-0">
                <h2 className="font-['Lobster_Two'] text-2xl font-bold text-[oklch(22%_0.03_55)] leading-tight">
                  {member.firstName} {member.lastName}
                </h2>
                {member.maidenName && (
                  <p className="text-xs text-[oklch(55%_0.025_55)] italic">
                    née {member.maidenName}
                  </p>
                )}
                {member.nickname && (
                  <p className="text-xs text-[oklch(50%_0.14_68)] font-medium mt-0.5">
                    "{member.nickname}"
                  </p>
                )}
                {ageText && (
                  <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-[oklch(95%_0.015_80)] text-[oklch(40%_0.02_55)]">
                    {ageText}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-1 gap-2.5 bg-white p-3.5 rounded-2xl border border-[oklch(90%_0.015_80)] shadow-xs text-xs text-[oklch(40%_0.02_55)]">
              {member.birthDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[oklch(74%_0.17_68)] shrink-0" />
                  <span>
                    Born: <strong>{member.birthDate}</strong>
                    {member.birthPlace ? ` in ${member.birthPlace}` : ''}
                  </span>
                </div>
              )}
              {!member.isLiving && member.deathDate && (
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[oklch(55%_0.02_60)] shrink-0" />
                  <span>
                    Passed: <strong>{member.deathDate}</strong>
                    {member.restingPlace ? ` • ${member.restingPlace}` : ''}
                  </span>
                </div>
              )}
              {member.occupation && (
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[oklch(60%_0.14_150)] shrink-0" />
                  <span>Occupation: <strong>{member.occupation}</strong></span>
                </div>
              )}
            </div>

            {/* Bio Story */}
            {member.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[oklch(55%_0.02_60)]">
                  Life Story & Notes
                </h4>
                <div className="p-3.5 rounded-2xl bg-white border border-[oklch(90%_0.015_80)] text-sm text-[oklch(30%_0.02_55)] leading-relaxed italic shadow-xs">
                  "{member.bio}"
                </div>
              </div>
            )}

            {/* Family Relationships */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[oklch(55%_0.02_60)]">
                  Family Lineage
                </h4>
                <button
                  onClick={() => onAddRelative(member)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[oklch(74%_0.17_68)] hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Relative</span>
                </button>
              </div>

              {/* Parents */}
              {parents.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[oklch(60%_0.02_55)]">
                    Parents:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {parents.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectMember(p)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[oklch(88%_0.02_80)] text-xs font-medium text-[oklch(25%_0.03_55)] hover:border-[oklch(74%_0.17_68)] hover:text-[oklch(74%_0.17_68)] transition-all shadow-xs"
                      >
                        {p.firstName} {p.lastName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spouses */}
              {spouses.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[oklch(60%_0.02_55)] flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[oklch(68%_0.18_28)]" />
                    <span>Spouse / Partner:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {spouses.map(({ member: sp, relation }) => (
                      <button
                        key={sp.id}
                        onClick={() => onSelectMember(sp)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[oklch(88%_0.02_80)] text-xs font-medium text-[oklch(25%_0.03_55)] hover:border-[oklch(68%_0.18_28)] hover:text-[oklch(68%_0.18_28)] transition-all shadow-xs"
                      >
                        {sp.firstName} {sp.lastName}
                        {relation.startDate && ` (m. ${relation.startDate.slice(0, 4)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Children */}
              {children.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-[oklch(60%_0.02_55)]">
                    Children:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {children.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => onSelectMember(c)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-[oklch(88%_0.02_80)] text-xs font-medium text-[oklch(25%_0.03_55)] hover:border-[oklch(74%_0.17_68)] hover:text-[oklch(74%_0.17_68)] transition-all shadow-xs"
                      >
                        {c.firstName} {c.lastName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Memories & Photos Section */}
            <div className="space-y-3 pt-2 border-t border-[oklch(90%_0.015_80)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[oklch(40%_0.02_55)]" />
                  <h4 className="text-xs uppercase font-bold tracking-wider text-[oklch(55%_0.02_60)]">
                    Memories ({memberMemories.length})
                  </h4>
                </div>
                <button
                  onClick={() => onAddMemory(member)}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-white border border-[oklch(88%_0.015_80)] text-[oklch(25%_0.03_55)] hover:bg-[oklch(96%_0.01_80)] active:scale-95 transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                  <span>Add Memory</span>
                </button>
              </div>

              {memberMemories.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-white border border-dashed border-[oklch(85%_0.02_80)]">
                  <Camera className="w-8 h-8 mx-auto text-[oklch(75%_0.02_60)] mb-2 stroke-[1.5]" />
                  <p className="text-sm font-semibold text-[oklch(40%_0.02_55)]">
                    No memories attached yet
                  </p>
                  <p className="text-xs text-[oklch(60%_0.02_55)] mt-1">
                    Upload photos and stories celebrating {member.firstName}'s life.
                  </p>
                  <button
                    onClick={() => onAddMemory(member)}
                    className="mt-3 text-xs font-semibold text-[oklch(25%_0.03_55)] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
                    <span>Attach first memory</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {memberMemories.map((mem) => (
                    <motion.div
                      key={mem.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onOpenMemoryLightbox(mem)}
                      className="group cursor-pointer relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all ring-1 ring-black/5 bg-black/5"
                    >
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {mem.dateTaken && (
                        <span className="absolute top-2 right-2 text-[9px] font-semibold bg-black/40 text-white/95 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                          {mem.dateTaken}
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 pt-8 pb-2.5 px-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end">
                        <h5 className="font-['Lobster_Two'] font-bold text-sm sm:text-base text-white leading-tight drop-shadow-xs truncate italic">
                          {mem.title}
                        </h5>
                        {mem.location && (
                          <span className="text-[10px] text-white/75 truncate mt-0.5">
                            {mem.location}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
