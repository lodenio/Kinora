export interface Memory {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;         // Base64 data URL or Object URL
  thumbnailUrl?: string;
  dateTaken?: string;       // e.g. "Summer 1978" or "1978-07-20"
  location?: string;
  taggedMemberIds: string[];// IDs of members present in this memory
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}
