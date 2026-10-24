import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  db,
  initializeDatabase,
  resetDatabaseToDefault,
  deleteMemberCascade,
  exportDatabaseToJson,
  importDatabaseFromJson,
} from './db/kinoraDb';
import { FamilyMember } from './types/member';
import { Relationship } from './types/relationship';
import { Memory } from './types/memory';
import { getTreeLayout } from './utils/layoutTree';
import { FamilyCanvas } from './components/canvas/FamilyCanvas';
import { CanvasToolbar } from './components/canvas/CanvasToolbar';
import { ProfileDrawer } from './components/profile/ProfileDrawer';
import { MemberFormModal } from './components/profile/MemberFormModal';
import { AddRelativeModal, RelativeCategory } from './components/profile/AddRelativeModal';
import { AddMemoryModal } from './components/memories/AddMemoryModal';
import { MemoryLightbox } from './components/memories/MemoryLightbox';
import { MemoriesFeedModal } from './components/memories/MemoriesFeedModal';

function KinoraApp() {
  // 1. Reactive queries to IndexedDB
  const members = useLiveQuery(() => db.members.toArray(), []) || [];
  const relationships = useLiveQuery(() => db.relationships.toArray(), []) || [];
  const memories = useLiveQuery(() => db.memories.toArray(), []) || [];

  // React Flow controller hooks
  const { zoomIn, zoomOut, fitView, setCenter } = useReactFlow();

  // 2. Local UI State
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isAddRelativeOpen, setIsAddRelativeOpen] = useState(false);
  const [relativeTargetMember, setRelativeTargetMember] = useState<FamilyMember | null>(null);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [memoryInitialMemberId, setMemoryInitialMemberId] = useState<string | undefined>();
  const [isMemoriesFeedOpen, setIsMemoriesFeedOpen] = useState(false);
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<Memory | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  // 3. Initialize DB on startup
  useEffect(() => {
    initializeDatabase().catch((err) => console.error('Database init error:', err));
  }, []);

  // 4. Compute Tree Layout (Nodes and Edges)
  const { nodes, edges } = useMemo(() => {
    return getTreeLayout(members, relationships);
  }, [members, relationships]);

  // Keep selectedMember up to date with DB changes
  useEffect(() => {
    if (selectedMember) {
      const updated = members.find((m) => m.id === selectedMember.id);
      setSelectedMember(updated || null);
    }
  }, [members, selectedMember]);

  // Auto-center on selected member
  const handleSelectMember = useCallback(
    (member: FamilyMember) => {
      setSelectedMember(member);
      const targetNode = nodes.find((n) => n.id === member.id);
      if (targetNode) {
        setCenter(targetNode.position.x + 48, targetNode.position.y + 48, {
          zoom: 1.2,
          duration: 500,
        });
      }
    },
    [nodes, setCenter]
  );

  // Quick Add Relative handler
  const handleOpenQuickAdd = useCallback((member: FamilyMember) => {
    setRelativeTargetMember(member);
    setIsAddRelativeOpen(true);
  }, []);

  // Save new member or update existing
  const handleSaveMember = async (memberData: Partial<FamilyMember>) => {
    if (editingMember) {
      await db.members.update(editingMember.id, {
        ...memberData,
        updatedAt: Date.now(),
      });
    } else {
      const newId = `m-${Date.now()}`;
      await db.members.add({
        id: newId,
        firstName: memberData.firstName || '',
        lastName: memberData.lastName || '',
        maidenName: memberData.maidenName,
        nickname: memberData.nickname,
        gender: memberData.gender || 'female',
        birthDate: memberData.birthDate,
        deathDate: memberData.deathDate,
        isLiving: memberData.isLiving ?? true,
        birthPlace: memberData.birthPlace,
        restingPlace: memberData.restingPlace,
        occupation: memberData.occupation,
        bio: memberData.bio,
        avatarUrl: memberData.avatarUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
    setTimeout(() => fitView({ duration: 500 }), 100);
  };

  // Add Relative Link
  const handleAddRelative = async (
    targetMemberId: string,
    category: RelativeCategory,
    newMemberData?: Partial<FamilyMember>,
    existingMemberId?: string
  ) => {
    let relativeId = existingMemberId;

    // 1. Create new member if not linking an existing one
    if (!relativeId && newMemberData) {
      relativeId = `m-${Date.now()}`;
      await db.members.add({
        id: relativeId,
        firstName: newMemberData.firstName || '',
        lastName: newMemberData.lastName || '',
        gender: newMemberData.gender || 'female',
        birthDate: newMemberData.birthDate,
        isLiving: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    if (!relativeId) return;

    // 2. Create the appropriate relationship
    const now = Date.now();
    if (category === 'parent') {
      // relative is parent of target
      await db.relationships.add({
        id: `rel-${now}`,
        type: 'parent-child',
        sourceId: relativeId,
        targetId: targetMemberId,
        createdAt: now,
      });
    } else if (category === 'child') {
      // target is parent of relative
      await db.relationships.add({
        id: `rel-${now}`,
        type: 'parent-child',
        sourceId: targetMemberId,
        targetId: relativeId,
        createdAt: now,
      });
    } else if (category === 'spouse') {
      // target and relative are spouses
      await db.relationships.add({
        id: `rel-${now}`,
        type: 'spouse',
        sourceId: targetMemberId,
        targetId: relativeId,
        createdAt: now,
      });
    } else if (category === 'sibling') {
      // Find target's parents and link the relative to them
      const targetParents = relationships.filter(
        (r) => r.type === 'parent-child' && r.targetId === targetMemberId
      );
      if (targetParents.length > 0) {
        for (const p of targetParents) {
          await db.relationships.add({
            id: `rel-${Date.now()}-${p.sourceId}`,
            type: 'parent-child',
            sourceId: p.sourceId,
            targetId: relativeId,
            createdAt: now,
          });
        }
      } else {
        // If target has no parents recorded, create an informal parent-child structure or note
        // or link them as a child of a common root
        await db.relationships.add({
          id: `rel-${now}`,
          type: 'parent-child',
          sourceId: targetMemberId,
          targetId: relativeId,
          createdAt: now,
        });
      }
    }

    setTimeout(() => fitView({ duration: 600 }), 150);
  };

  // Delete Member
  const handleDeleteMember = async (memberId: string) => {
    await deleteMemberCascade(memberId);
    if (selectedMember?.id === memberId) {
      setSelectedMember(null);
    }
    setTimeout(() => fitView({ duration: 500 }), 100);
  };

  // Save Memory
  const handleSaveMemory = async (
    memoryData: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newId = `mem-${Date.now()}`;
    await db.memories.add({
      id: newId,
      ...memoryData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  // JSON Export
  const handleExport = async () => {
    const json = await exportDatabaseToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kinora-Family-Tree-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Import
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const text = await file.text();
        const res = await importDatabaseFromJson(text);
        if (res.success) {
          alert('Family tree imported successfully!');
          setTimeout(() => fitView({ duration: 600 }), 200);
        } else {
          alert(`Import failed: ${res.error}`);
        }
      }
    };
    input.click();
  };

  // Reset to default
  const handleReset = async () => {
    await resetDatabaseToDefault();
    setSelectedMember(null);
    setTimeout(() => fitView({ duration: 600 }), 200);
  };

  // Lightbox Navigation
  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (!activeLightboxMemory) return;
    const currentIndex = memories.findIndex((m) => m.id === activeLightboxMemory.id);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveLightboxMemory(memories[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < memories.length - 1) {
      setActiveLightboxMemory(memories[currentIndex + 1]);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden font-sans">
      {/* Top and Bottom Floating Toolbars */}
      <CanvasToolbar
        members={members}
        memoryCount={memories.length}
        isMoving={isMoving}
        onFitView={() => fitView({ duration: 400 })}
        onAutoLayout={() => fitView({ duration: 600 })}
        onAddMember={() => {
          setEditingMember(null);
          setIsMemberFormOpen(true);
        }}
        onOpenMemoriesFeed={() => setIsMemoriesFeedOpen(true)}
        onSelectMember={handleSelectMember}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
      />

      {/* Interactive Family Tree Playground Canvas */}
      <FamilyCanvas
        initialNodes={nodes}
        initialEdges={edges}
        members={members}
        relationships={relationships}
        memories={memories}
        selectedMemberId={selectedMember?.id || null}
        onSelectMember={handleSelectMember}
        onQuickAdd={handleOpenQuickAdd}
        onInteractionChange={setIsMoving}
      />

      {/* Member Profile & Memories Slide-over Drawer */}
      <ProfileDrawer
        member={selectedMember}
        allMembers={members}
        relationships={relationships}
        memories={memories}
        onClose={() => setSelectedMember(null)}
        onEdit={(m) => {
          setEditingMember(m);
          setIsMemberFormOpen(true);
        }}
        onDelete={handleDeleteMember}
        onAddRelative={handleOpenQuickAdd}
        onAddMemory={(m) => {
          setMemoryInitialMemberId(m.id);
          setIsAddMemoryOpen(true);
        }}
        onSelectMember={handleSelectMember}
        onOpenMemoryLightbox={(mem) => setActiveLightboxMemory(mem)}
      />

      {/* Add / Edit Member Modal */}
      <MemberFormModal
        isOpen={isMemberFormOpen}
        onClose={() => {
          setIsMemberFormOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        initialData={editingMember}
      />

      {/* Add Relative Wizard Modal */}
      <AddRelativeModal
        isOpen={isAddRelativeOpen}
        onClose={() => {
          setIsAddRelativeOpen(false);
          setRelativeTargetMember(null);
        }}
        targetMember={relativeTargetMember}
        existingMembers={members}
        onAddRelative={handleAddRelative}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        allMembers={members}
        initialMemberId={memoryInitialMemberId}
        onSaveMemory={handleSaveMemory}
      />

      {/* Full Family Heritage Memories Gallery Modal */}
      <MemoriesFeedModal
        isOpen={isMemoriesFeedOpen}
        onClose={() => setIsMemoriesFeedOpen(false)}
        memories={memories}
        allMembers={members}
        onOpenMemory={(mem) => setActiveLightboxMemory(mem)}
        onAddNewMemory={() => {
          setIsMemoriesFeedOpen(false);
          setMemoryInitialMemberId(undefined);
          setIsAddMemoryOpen(true);
        }}
      />

      {/* Full-Screen Memory Lightbox (Rendered at top level to always float over all modals) */}
      <MemoryLightbox
        memory={activeLightboxMemory}
        memoriesList={memories}
        allMembers={members}
        onClose={() => setActiveLightboxMemory(null)}
        onSelectMember={(m) => {
          setActiveLightboxMemory(null);
          setIsMemoriesFeedOpen(false);
          handleSelectMember(m);
        }}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <KinoraApp />
    </ReactFlowProvider>
  );
}
