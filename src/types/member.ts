export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  nickname?: string;
  gender: Gender;
  birthDate?: string;       // e.g. "1954-04-12" or "1954"
  deathDate?: string;       // null or undefined if living
  isLiving: boolean;
  birthPlace?: string;
  restingPlace?: string;
  occupation?: string;
  bio?: string;
  avatarUrl?: string;       // Data URL or URL
  accentColor?: string;     // optional custom node accent
  generation?: number;      // 0 = root, -1 = parents, 1 = children, etc.
  createdAt: number;
  updatedAt: number;
}
