import Dexie, { type EntityTable } from 'dexie';
import { FamilyMember } from '../types/member';
import { Relationship } from '../types/relationship';
import { Memory } from '../types/memory';
import { INITIAL_MEMBERS, INITIAL_RELATIONSHIPS, INITIAL_MEMORIES } from './seedData';

class KinoraDatabase extends Dexie {
  members!: EntityTable<FamilyMember, 'id'>;
  relationships!: EntityTable<Relationship, 'id'>;
  memories!: EntityTable<Memory, 'id'>;

  constructor() {
    super('KinoraDB');

    this.version(1).stores({
      members: '&id, firstName, lastName, isLiving, generation, createdAt',
      relationships: '&id, type, sourceId, targetId, [sourceId+targetId]',
      memories: '&id, title, *taggedMemberIds, dateTaken, isFavorite, createdAt',
    });
  }
}

export const db = new KinoraDatabase();

/**
 * Initializes the database with warm starter family tree data if it's empty
 */
export async function initializeDatabase(): Promise<void> {
  const memberCount = await db.members.count();
  if (memberCount === 0) {
    await db.transaction('rw', db.members, db.relationships, db.memories, async () => {
      await db.members.bulkAdd(INITIAL_MEMBERS);
      await db.relationships.bulkAdd(INITIAL_RELATIONSHIPS);
      await db.memories.bulkAdd(INITIAL_MEMORIES);
    });
  }
}

/**
 * Reset database back to default seed data
 */
export async function resetDatabaseToDefault(): Promise<void> {
  await db.transaction('rw', db.members, db.relationships, db.memories, async () => {
    await db.members.clear();
    await db.relationships.clear();
    await db.memories.clear();
    await db.members.bulkAdd(INITIAL_MEMBERS);
    await db.relationships.bulkAdd(INITIAL_RELATIONSHIPS);
    await db.memories.bulkAdd(INITIAL_MEMORIES);
  });
}

/**
 * Deletes a member and cleans up any relationships and memory tag references
 */
export async function deleteMemberCascade(memberId: string): Promise<void> {
  await db.transaction('rw', db.members, db.relationships, db.memories, async () => {
    // 1. Delete member record
    await db.members.delete(memberId);

    // 2. Delete relationships involving this member
    const relsToDelete = await db.relationships
      .filter((r) => r.sourceId === memberId || r.targetId === memberId)
      .toArray();
    await db.relationships.bulkDelete(relsToDelete.map((r) => r.id));

    // 3. Remove tag from memories
    const affectedMemories = await db.memories
      .filter((m) => m.taggedMemberIds.includes(memberId))
      .toArray();
    for (const mem of affectedMemories) {
      const updatedTags = mem.taggedMemberIds.filter((id) => id !== memberId);
      await db.memories.update(mem.id, { taggedMemberIds: updatedTags });
    }
  });
}

/**
 * Export full DB as a backup JSON object
 */
export async function exportDatabaseToJson(): Promise<string> {
  const members = await db.members.toArray();
  const relationships = await db.relationships.toArray();
  const memories = await db.memories.toArray();

  const exportPayload = {
    app: 'Kinora',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data: {
      members,
      relationships,
      memories,
    },
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Import a previously exported JSON backup
 */
export async function importDatabaseFromJson(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = JSON.parse(jsonString);
    if (!payload.data || !Array.isArray(payload.data.members)) {
      return { success: false, error: 'Invalid Kinora backup file format.' };
    }

    await db.transaction('rw', db.members, db.relationships, db.memories, async () => {
      await db.members.clear();
      await db.relationships.clear();
      await db.memories.clear();

      await db.members.bulkAdd(payload.data.members);
      if (Array.isArray(payload.data.relationships)) {
        await db.relationships.bulkAdd(payload.data.relationships);
      }
      if (Array.isArray(payload.data.memories)) {
        await db.memories.bulkAdd(payload.data.memories);
      }
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to parse JSON backup.' };
  }
}
