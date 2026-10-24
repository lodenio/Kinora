import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User } from 'lucide-react';
import type { FamilyMember, Gender } from '../../types/member';
import { compressImage } from '../../utils/imageCompression';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Partial<FamilyMember>) => Promise<void>;
  initialData?: FamilyMember | null;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [maidenName, setMaidenName] = useState(initialData?.maidenName || '');
  const [nickname, setNickname] = useState(initialData?.nickname || '');
  const [gender, setGender] = useState<Gender>(initialData?.gender || 'female');
  const [isLiving, setIsLiving] = useState<boolean>(initialData?.isLiving ?? true);
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [deathDate, setDeathDate] = useState(initialData?.deathDate || '');
  const [birthPlace, setBirthPlace] = useState(initialData?.birthPlace || '');
  const [restingPlace, setRestingPlace] = useState(initialData?.restingPlace || '');
  const [occupation, setOccupation] = useState(initialData?.occupation || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
      setMaidenName(initialData.maidenName || '');
      setNickname(initialData.nickname || '');
      setGender(initialData.gender);
      setIsLiving(initialData.isLiving);
      setBirthDate(initialData.birthDate || '');
      setDeathDate(initialData.deathDate || '');
      setBirthPlace(initialData.birthPlace || '');
      setRestingPlace(initialData.restingPlace || '');
      setOccupation(initialData.occupation || '');
      setBio(initialData.bio || '');
      setAvatarUrl(initialData.avatarUrl || '');
    } else {
      setFirstName('');
      setLastName('');
      setMaidenName('');
      setNickname('');
      setGender('female');
      setIsLiving(true);
      setBirthDate('');
      setDeathDate('');
      setBirthPlace('');
      setRestingPlace('');
      setOccupation('');
      setBio('');
      setAvatarUrl('');
    }
  }, [initialData, isOpen]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.85);
        setAvatarUrl(compressed);
      } catch (err) {
        console.error('Failed to compress avatar image', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        maidenName: maidenName.trim() || undefined,
        nickname: nickname.trim() || undefined,
        gender,
        isLiving,
        birthDate: birthDate || undefined,
        deathDate: isLiving ? undefined : deathDate || undefined,
        birthPlace: birthPlace.trim() || undefined,
        restingPlace: isLiving ? undefined : restingPlace.trim() || undefined,
        occupation: occupation.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-[#fdfbf7] rounded-3xl border border-[oklch(88%_0.015_80)] shadow-[0_25px_60px_-15px_oklch(20%_0.03_55/0.3)] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[oklch(90%_0.015_80)] bg-white/70 backdrop-blur-sm flex items-center justify-between">
            <div>
              <h2 className="font-['Lobster_Two'] text-xl sm:text-2xl font-bold text-[oklch(22%_0.03_55)]">
                {initialData ? 'Edit Profile' : 'Add Family Member'}
              </h2>
              <p className="text-[11px] sm:text-xs text-[oklch(55%_0.02_60)]">
                {initialData
                  ? `Update details for ${initialData.firstName} ${initialData.lastName}`
                  : 'Add a new member to the Kinora family canvas'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[oklch(40%_0.02_55)] hover:bg-[oklch(96%_0.01_80)] transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Avatar Picker */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 bg-white rounded-2xl border border-[oklch(90%_0.015_80)]">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-black/5"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[oklch(95%_0.015_80)] flex items-center justify-center text-[oklch(60%_0.02_55)] border-2 border-white shadow-sm">
                    <User className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[oklch(95%_0.02_75)] hover:bg-[oklch(92%_0.04_75)] text-xs font-semibold text-[oklch(30%_0.05_75)] transition-colors active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-xs text-[oklch(55%_0.16_28)] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Names Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clara"
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

            {/* Maiden & Nickname */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Maiden / Birth Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fairchild"
                  value={maidenName}
                  onChange={(e) => setMaidenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Nickname / Known As
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nana Clara"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Gender & Living Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
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
                  <option value="other">Other / Not specified</option>
                </select>
              </div>

              <div className="pt-1 sm:pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isLiving}
                    onChange={(e) => setIsLiving(e.target.checked)}
                    className="w-5 h-5 sm:w-4 sm:h-4 rounded text-[oklch(74%_0.17_68)] focus:ring-[oklch(74%_0.17_68)]"
                  />
                  <span className="text-xs font-semibold text-[oklch(35%_0.03_55)]">
                    This person is living
                  </span>
                </label>
              </div>
            </div>

            {/* Birth Date & Place */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Birth Date / Year
                </label>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD or Year (e.g. 1942)"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Birthplace
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bristol, England"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Passing Date & Resting Place if deceased */}
            {!isLiving && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-[oklch(96%_0.01_80)] border border-[oklch(90%_0.015_80)]">
                <div>
                  <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                    Date of Passing
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD or Year"
                    value={deathDate}
                    onChange={(e) => setDeathDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                    Resting Place
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Highland Meadow"
                    value={restingPlace}
                    onChange={(e) => setRestingPlace(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Occupation */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                Profession / Life Calling
              </label>
              <input
                type="text"
                placeholder="e.g. Master Clockmaker, Botanist, Teacher"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
              />
            </div>

            {/* Bio Story */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                Life Story, Memories & Anecdotes
              </label>
              <textarea
                rows={3}
                placeholder="Share warm memories, personality traits, and anecdotes about their journey..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm resize-none"
              />
            </div>

            {/* Submit Buttons */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[oklch(74%_0.17_68)] to-[oklch(68%_0.18_28)] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_-2px_oklch(74%_0.17_68/0.35)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {initialData ? 'Save Changes' : 'Add to Family Tree'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
