export type RelationshipType = 'parent-child' | 'spouse';

export interface Relationship {
  id: string;
  type: RelationshipType;
  // For parent-child: source is parent, target is child
  // For spouse: source is partner 1, target is partner 2
  sourceId: string;
  targetId: string;
  startDate?: string;   // e.g., Marriage date
  endDate?: string;     // e.g., Divorce date
  notes?: string;
  createdAt: number;
}
