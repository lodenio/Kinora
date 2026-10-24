import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { FamilyMember, Gender } from '../../types/member';

export type RelativeCategory = 'parent' | 'spouse' | 'child' | 'sibling';

interface AddRelativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetMember: FamilyMember | null;
  existingMembers: FamilyMember[];
  onAddRelative: (
    targetMemberId: string,
    category: RelativeCategory,
    newMemberData?: Partial<FamilyMember>,
    existingMemberId?: string
  ) => Promise<void>;
}

export const AddRelativeModal: React.FC<AddRelativeModalProps> = ({
  isOpen,
  onClose,
  targetMember,
  existingMembers,
  onAddRelative,
}) => {
  const [category, setCategory] = useState<RelativeCategory>('child');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [existingSelectedId, setExistingSelectedId] = useState<string>('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [birthDate, setBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (targetMember) {
      setLastName(targetMember.lastName);
      setFirstName('');
      setBirthDate('');
      setCategory('child');
      setGender('female');
      setMode('new');
    }
  }, [targetMember, isOpen]);

  if (!isOpen || !targetMember) return null;

  const candidateMembers = existingMembers.filter((m) => m.id !== targetMember.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === 'existing') {
        if (!existingSelectedId) return;
        await onAddRelative(targetMember.id, category, undefined, existingSelectedId);
      } else {
        if (!firstName.trim() || !lastName.trim()) return;
        await onAddRelative(targetMember.id, category, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          gender,
          birthDate: birthDate.trim() || undefined,
          isLiving: true,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[90vh] bg-[#fdfbf7] rounded-3xl border border-[oklch(88%_0.015_80)] shadow-[0_25px_60px_-15px_oklch(20%_0.03_55/0.3)] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[oklch(90%_0.015_80)] bg-white/70 backdrop-blur-sm flex items-center justify-between">
            <div>
              <h2 className="font-['Lobster_Two'] text-xl sm:text-2xl font-bold text-[oklch(22%_0.03_55)]">
                Add Relative
              </h2>
              <p className="text-[11px] sm:text-xs text-[oklch(55%_0.02_60)]">
                Connecting to{' '}
                <strong className="text-[oklch(25%_0.03_55)]">
                  {targetMember.firstName} {targetMember.lastName}
                </strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[oklch(40%_0.02_55)] hover:bg-[oklch(96%_0.01_80)] transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Relationship Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-2">
                What is this person's relationship to {targetMember.firstName}?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'parent', label: 'Parent', desc: 'Father / Mother' },
                    { id: 'spouse', label: 'Spouse', desc: 'Partner' },
                    { id: 'child', label: 'Child', desc: 'Son / Daughter' },
                    { id: 'sibling', label: 'Sibling', desc: 'Brother / Sister' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id);
                      if (item.id === 'parent') setGender('female');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all active:scale-95 ${
                      category === item.id
                        ? 'border-[oklch(74%_0.17_68)] bg-[oklch(96%_0.03_75)] text-[oklch(30%_0.05_75)] font-bold shadow-xs'
                        : 'border-[oklch(88%_0.015_80)] bg-white text-[oklch(45%_0.02_55)] hover:border-[oklch(80%_0.03_75)]'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-semibold">{item.label}</div>
                    <div className="text-[10px] text-[oklch(55%_0.02_60)] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mode: Create New vs Link Existing */}
            <div className="flex rounded-xl bg-[oklch(94%_0.015_80)] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('new')}
                className={`flex-1 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95 ${
                  mode === 'new'
                    ? 'bg-white shadow-xs text-[oklch(22%_0.03_55)]'
                    : 'text-[oklch(50%_0.02_55)] hover:text-[oklch(22%_0.03_55)]'
                }`}
              >
                Create New Member
              </button>
              <button
                type="button"
                onClick={() => setMode('existing')}
                className={`flex-1 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95 ${
                  mode === 'existing'
                    ? 'bg-white shadow-xs text-[oklch(22%_0.03_55)]'
                    : 'text-[oklch(50%_0.02_55)] hover:text-[oklch(22%_0.03_55)]'
                }`}
              >
                Link Existing Member
              </button>
            </div>

            {mode === 'new' ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vance"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                      Birth Year / Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1999"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)]">
                  Choose a member to link:
                </label>
                <select
                  required
                  value={existingSelectedId}
                  onChange={(e) => setExistingSelectedId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                >
                  <option value="">-- Select Member --</option>
                  {candidateMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} {m.birthDate ? `(b. ${m.birthDate.slice(0, 4)})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[oklch(90%_0.015_80)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[oklch(40%_0.02_55)] hover:bg-[oklch(95%_0.01_80)] transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (mode === 'existing' && !existingSelectedId)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[oklch(74%_0.17_68)] to-[oklch(68%_0.18_28)] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_-2px_oklch(74%_0.17_68/0.35)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Connect Relative
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
