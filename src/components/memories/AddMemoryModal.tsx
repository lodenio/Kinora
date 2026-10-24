import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Check } from 'lucide-react';
import type { FamilyMember } from '../../types/member';
import type { Memory } from '../../types/memory';
import { compressImage } from '../../utils/imageCompression';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMembers: FamilyMember[];
  initialMemberId?: string;
  onSaveMemory: (memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  allMembers,
  initialMemberId,
  onSaveMemory,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dateTaken, setDateTaken] = useState('');
  const [location, setLocation] = useState('');
  const [taggedMemberIds, setTaggedMemberIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCaption('');
      setImageUrl('');
      setDateTaken('');
      setLocation('');
      setTaggedMemberIds(initialMemberId ? [initialMemberId] : []);
    }
  }, [isOpen, initialMemberId]);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (.jpg, .png, .webp).');
      return;
    }
    try {
      const compressed = await compressImage(file, 1400, 1400, 0.85);
      setImageUrl(compressed);
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName);
      }
    } catch (err) {
      console.error('Failed to compress memory photo', err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const toggleTagMember = (id: string) => {
    setTaggedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please upload a photo for this memory.');
      return;
    }
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSaveMemory({
        title: title.trim(),
        caption: caption.trim() || undefined,
        imageUrl,
        dateTaken: dateTaken.trim() || undefined,
        location: location.trim() || undefined,
        taggedMemberIds,
        isFavorite: false,
      });
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
          className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[90vh] bg-[#fdfbf7] rounded-3xl border border-[oklch(88%_0.015_80)] shadow-[0_25px_60px_-15px_oklch(20%_0.03_55/0.3)] overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[oklch(90%_0.015_80)] bg-white/70 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[oklch(94%_0.03_28)] text-[oklch(68%_0.18_28)]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Lobster_Two'] text-xl sm:text-2xl font-bold text-[oklch(22%_0.03_55)]">
                  Add Family Memory
                </h2>
                <p className="text-[11px] sm:text-xs text-[oklch(55%_0.02_60)]">
                  Preserve a photo and story for generations to come
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[oklch(40%_0.02_55)] hover:bg-[oklch(96%_0.01_80)] transition-colors active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1.5">
                Memory Photo *
              </label>

              {imageUrl ? (
                <div className="relative group rounded-2xl overflow-hidden border border-[oklch(88%_0.015_80)] bg-black/5 aspect-16/9">
                  <img
                    src={imageUrl}
                    alt="Uploaded preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-white text-xs font-semibold text-[oklch(22%_0.03_55)] shadow-md hover:bg-[oklch(96%_0.01_80)] active:scale-95">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 active:scale-95"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center transition-all ${
                    isDragging
                      ? 'border-[oklch(74%_0.17_68)] bg-[oklch(96%_0.03_75)]'
                      : 'border-[oklch(85%_0.02_80)] bg-white hover:border-[oklch(74%_0.17_68)]'
                  }`}
                >
                  <Camera className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-[oklch(68%_0.18_28)] stroke-[1.5] mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-[oklch(25%_0.03_55)]">
                    Drag and drop your photo here, or
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 mt-2 px-3.5 py-1.5 rounded-xl bg-[oklch(95%_0.02_75)] hover:bg-[oklch(92%_0.04_75)] text-xs font-semibold text-[oklch(30%_0.05_75)] transition-colors active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
                      }}
                    />
                  </label>
                  <p className="text-[10px] sm:text-[11px] text-[oklch(60%_0.02_55)] mt-1.5">
                    JPG, PNG, WEBP (auto-compressed for fast loading on phones)
                  </p>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                Memory Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Golden Anniversary in the Rose Garden"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] font-medium text-base sm:text-sm"
              />
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Date / Year Taken
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer 1984 or 1984-07-20"
                  value={dateTaken}
                  onChange={(e) => setDateTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Highland Cottage, Scotland"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm"
                />
              </div>
            </div>

            {/* Story / Caption */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1">
                The Story Behind the Memory
              </label>
              <textarea
                rows={3}
                placeholder="What happened on this day? Who was there? Share what makes this moment special..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[oklch(88%_0.015_80)] focus:ring-2 focus:ring-[oklch(74%_0.17_68)] focus:outline-none text-[oklch(22%_0.03_55)] text-base sm:text-sm resize-none"
              />
            </div>

            {/* Tagged Family Members */}
            <div>
              <label className="block text-xs font-semibold text-[oklch(35%_0.03_55)] mb-1.5">
                Tag Family Members in this Photo:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 sm:max-h-36 overflow-y-auto p-2 rounded-2xl bg-white border border-[oklch(90%_0.015_80)]">
                {allMembers.map((m) => {
                  const isTagged = taggedMemberIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleTagMember(m.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:py-1 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                        isTagged
                          ? 'bg-[oklch(74%_0.17_68)] text-white shadow-xs'
                          : 'bg-[oklch(96%_0.01_80)] text-[oklch(40%_0.02_55)] hover:bg-[oklch(92%_0.02_80)]'
                      }`}
                    >
                      {isTagged && <Check className="w-3 h-3 stroke-[2.5]" />}
                      <span>{m.firstName} {m.lastName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

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
                disabled={isSubmitting || !imageUrl || !title.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[oklch(74%_0.17_68)] to-[oklch(68%_0.18_28)] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_-2px_oklch(74%_0.17_68/0.35)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
              >
                Save Memory
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
