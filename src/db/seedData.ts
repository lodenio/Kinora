import { FamilyMember } from '../types/member';
import { Relationship } from '../types/relationship';
import { Memory } from '../types/memory';

// Helper to create beautiful embedded SVG placeholder photos
function createPhotoSvg(bgColor: string, accentColor: string, iconType: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="${accentColor}" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="600" height="400" fill="url(#grad)" />
    <circle cx="300" cy="180" r="70" fill="white" opacity="0.25" filter="url(#shadow)" />
    <text x="300" y="195" font-family="'Raleway', sans-serif" font-size="54" text-anchor="middle" fill="white" font-weight="700">${iconType}</text>
    <rect x="100" y="290" width="400" height="44" rx="22" fill="white" opacity="0.3" />
    <text x="300" y="320" font-family="'Raleway', sans-serif" font-size="20" text-anchor="middle" fill="white" font-weight="600" letter-spacing="1">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_MEMBERS: FamilyMember[] = [
  // Generation 1: Grandparents
  {
    id: 'm-arthur-vance',
    firstName: 'Arthur',
    lastName: 'Vance',
    gender: 'male',
    birthDate: '1938-05-14',
    deathDate: '2019-11-03',
    isLiving: false,
    birthPlace: 'Edinburgh, Scotland',
    restingPlace: 'Highland Meadow Cemetery',
    occupation: 'Clockmaker & Historian',
    bio: 'Arthur was a master horologist who could fix any mechanical watch by ear. He cherished Sunday picnics, classical jazz records, and telling vivid stories of the old countryside.',
    generation: 1,
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 1000000,
  },
  {
    id: 'm-clara-vance',
    firstName: 'Clara',
    lastName: 'Vance',
    maidenName: 'Fairchild',
    nickname: 'Nana Clara',
    gender: 'female',
    birthDate: '1942-09-28',
    isLiving: true,
    birthPlace: 'Bristol, England',
    occupation: 'Botanist & Painter',
    bio: 'Clara spent four decades teaching botany and cultivating rare garden roses. Her kitchen always smells like cinnamon tea and freshly baked lavender shortbread.',
    generation: 1,
    createdAt: Date.now() - 950000,
    updatedAt: Date.now() - 950000,
  },

  // Generation 2: Parents & Uncle
  {
    id: 'm-julian-vance',
    firstName: 'Julian',
    lastName: 'Vance',
    gender: 'male',
    birthDate: '1968-03-19',
    isLiving: true,
    birthPlace: 'London, England',
    occupation: 'Architectural Restorer',
    bio: 'Passionate about preserving historic stone homes and vintage woodwork. Julian inherited his father\'s love for craftsmanship and his mother\'s gentle humor.',
    generation: 2,
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 900000,
  },
  {
    id: 'm-eleanor-ross',
    firstName: 'Eleanor',
    lastName: 'Vance',
    maidenName: 'Ross',
    nickname: 'Ellie',
    gender: 'female',
    birthDate: '1971-11-05',
    isLiving: true,
    birthPlace: 'Dublin, Ireland',
    occupation: 'Cellist & Music Teacher',
    bio: 'Eleanor performs with regional chamber ensembles and conducts the youth youth orchestra. She loves mountain hikes, acoustic sessions, and photography.',
    generation: 2,
    createdAt: Date.now() - 850000,
    updatedAt: Date.now() - 850000,
  },
  {
    id: 'm-marcus-vance',
    firstName: 'Marcus',
    lastName: 'Vance',
    gender: 'male',
    birthDate: '1974-08-12',
    isLiving: true,
    birthPlace: 'London, England',
    occupation: 'Marine Wildlife Biologist',
    bio: 'Marcus spends months studying coastal marine migrations and loves sending handwritten postcards from sea research vessels across the Atlantic.',
    generation: 2,
    createdAt: Date.now() - 800000,
    updatedAt: Date.now() - 800000,
  },

  // Generation 3: Children
  {
    id: 'm-leo-vance',
    firstName: 'Leo',
    lastName: 'Vance',
    gender: 'male',
    birthDate: '1998-07-22',
    isLiving: true,
    birthPlace: 'Oxford, England',
    occupation: 'Landscape Designer',
    bio: 'Leo designs sustainable urban gardens and rooftop native meadows, carrying forward Clara\'s deep botanical reverence in modern cities.',
    generation: 3,
    createdAt: Date.now() - 750000,
    updatedAt: Date.now() - 750000,
  },
  {
    id: 'm-maya-vance',
    firstName: 'Maya',
    lastName: 'Vance',
    gender: 'female',
    birthDate: '2003-01-14',
    isLiving: true,
    birthPlace: 'Oxford, England',
    occupation: 'Literature Student & Writer',
    bio: 'Curious storyteller and avid book collector. Maya is actively researching the family\'s letters and preserving ancestral archives for Kinora.',
    generation: 3,
    createdAt: Date.now() - 700000,
    updatedAt: Date.now() - 700000,
  },
];

export const INITIAL_RELATIONSHIPS: Relationship[] = [
  // Spouses: Arthur & Clara
  {
    id: 'rel-arthur-clara',
    type: 'spouse',
    sourceId: 'm-arthur-vance',
    targetId: 'm-clara-vance',
    startDate: '1964-06-20',
    notes: 'Married in St. Mary’s Meadow Chapel',
    createdAt: Date.now() - 900000,
  },
  // Arthur & Clara -> Julian
  {
    id: 'rel-arthur-julian',
    type: 'parent-child',
    sourceId: 'm-arthur-vance',
    targetId: 'm-julian-vance',
    createdAt: Date.now() - 890000,
  },
  {
    id: 'rel-clara-julian',
    type: 'parent-child',
    sourceId: 'm-clara-vance',
    targetId: 'm-julian-vance',
    createdAt: Date.now() - 890000,
  },
  // Arthur & Clara -> Marcus
  {
    id: 'rel-arthur-marcus',
    type: 'parent-child',
    sourceId: 'm-arthur-vance',
    targetId: 'm-marcus-vance',
    createdAt: Date.now() - 880000,
  },
  {
    id: 'rel-clara-marcus',
    type: 'parent-child',
    sourceId: 'm-clara-vance',
    targetId: 'm-marcus-vance',
    createdAt: Date.now() - 880000,
  },

  // Spouses: Julian & Eleanor
  {
    id: 'rel-julian-eleanor',
    type: 'spouse',
    sourceId: 'm-julian-vance',
    targetId: 'm-eleanor-ross',
    startDate: '1995-09-16',
    notes: 'Wedding in High Glen',
    createdAt: Date.now() - 870000,
  },
  // Julian & Eleanor -> Leo
  {
    id: 'rel-julian-leo',
    type: 'parent-child',
    sourceId: 'm-julian-vance',
    targetId: 'm-leo-vance',
    createdAt: Date.now() - 860000,
  },
  {
    id: 'rel-eleanor-leo',
    type: 'parent-child',
    sourceId: 'm-eleanor-ross',
    targetId: 'm-leo-vance',
    createdAt: Date.now() - 860000,
  },
  // Julian & Eleanor -> Maya
  {
    id: 'rel-julian-maya',
    type: 'parent-child',
    sourceId: 'm-julian-vance',
    targetId: 'm-maya-vance',
    createdAt: Date.now() - 850000,
  },
  {
    id: 'rel-eleanor-maya',
    type: 'parent-child',
    sourceId: 'm-eleanor-ross',
    targetId: 'm-maya-vance',
    createdAt: Date.now() - 850000,
  },
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'The Golden Wedding Anniversary',
    caption: 'Arthur and Clara celebrating 50 years of companionship in the rose cottage garden, surrounded by three generations.',
    imageUrl: createPhotoSvg('#78350f', '#f59e0b', '❧', 'Golden Anniversary 2014'),
    dateTaken: '2014-06-20',
    location: 'Highland Rose Cottage, Scotland',
    taggedMemberIds: ['m-arthur-vance', 'm-clara-vance', 'm-julian-vance', 'm-eleanor-ross', 'm-leo-vance', 'm-maya-vance'],
    isFavorite: true,
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 500000,
  },
  {
    id: 'mem-2',
    title: 'Summer Solstice by the Lake',
    caption: 'Julian teaching young Leo and Maya how to row the old timber boat on Lake Windermere as twilight set in.',
    imageUrl: createPhotoSvg('#047857', '#10b981', '⛵', 'Windermere Twilight 2008'),
    dateTaken: '2008-06-21',
    location: 'Lake Windermere, Cumbria',
    taggedMemberIds: ['m-julian-vance', 'm-leo-vance', 'm-maya-vance'],
    isFavorite: true,
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 400000,
  },
  {
    id: 'mem-3',
    title: 'Eleanor\'s Autumn Solitary Recital',
    caption: 'Eleanor tuning her cello backstage at the Oxford Symphony Hall before performing Bach Cello Suite No. 1.',
    imageUrl: createPhotoSvg('#9f1239', '#fb7185', '𝄞', 'Bach Recital 2017'),
    dateTaken: '2017-10-18',
    location: 'Sheldonian Theatre, Oxford',
    taggedMemberIds: ['m-eleanor-ross'],
    isFavorite: false,
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 300000,
  },
];
