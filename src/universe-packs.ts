import { EXHIBITS, type ExhibitId } from './exhibits.ts';

export type UniversePackId = 'museum-sandbox' | 'sun-eater' | 'red-rising' | 'cosmere' | 'star-wars' | 'hyperion';
export type UniversePackStatus = 'ready' | 'source-required';
export type LocationScale = 'universe' | 'galaxy' | 'cluster' | 'system' | 'world' | 'surface';

export type SourceReference = {
  sourceId: string;
  locator: string;
  note: string;
};

export type UniverseLocation = {
  id: string;
  name: string;
  scale: LocationScale;
  parentId?: string;
  summary: string;
  sources: readonly SourceReference[];
};

export type JourneyWaypoint = {
  order: number;
  locationId: string;
  label: string;
  sources: readonly SourceReference[];
};

export type CharacterJourney = {
  id: string;
  characterName: string;
  waypoints: readonly JourneyWaypoint[];
};

export type UniversePackDefinition = {
  id: UniversePackId;
  title: string;
  eyebrow: string;
  description: string;
  accent: string;
  status: UniversePackStatus;
  scenarioIds: readonly ExhibitId[];
  locations: readonly UniverseLocation[];
  journeys: readonly CharacterJourney[];
  sourceHint: string;
};

const plannedPack = (
  id: Exclude<UniversePackId, 'museum-sandbox'>,
  title: string,
  eyebrow: string,
  description: string,
  accent: string,
): UniversePackDefinition => ({
  id,
  title,
  eyebrow,
  description,
  accent,
  status: 'source-required',
  scenarioIds: [],
  locations: [],
  journeys: [],
  sourceHint: 'Add authorized source files, then build a cited location hierarchy, event timeline, and character journeys before publishing this pack.',
});

export const UNIVERSE_PACKS: readonly UniversePackDefinition[] = [
  {
    id: 'museum-sandbox',
    title: 'Gravity Lab Sandbox',
    eyebrow: 'Ready to explore',
    description: 'The educational astrophysics engine and its guided experiments.',
    accent: '#8eb7ff',
    status: 'ready',
    scenarioIds: EXHIBITS.map(exhibit => exhibit.id),
    locations: [
      { id: 'deep-space', name: 'Deep Space', scale: 'universe', summary: 'The open construction field.', sources: [] },
      { id: 'milky-way', name: 'Milky Way analogue', scale: 'galaxy', parentId: 'deep-space', summary: 'A procedural galaxy-scale frame.', sources: [] },
      { id: 'solar-system', name: 'Solar System', scale: 'system', parentId: 'milky-way', summary: 'The built-in Solar System preset.', sources: [] },
    ],
    journeys: [],
    sourceHint: 'Built from the museum simulation model and its documented educational simplifications.',
  },
  plannedPack('sun-eater', 'Sun Eater', 'Literary universe', 'Systems, empires, worlds, and character routes reconstructed from cited source material.', '#f2a35c'),
  plannedPack('red-rising', 'Red Rising', 'Literary universe', 'A tourable Solar System with eras, factions, habitats, and character journeys.', '#d95b54'),
  plannedPack('cosmere', 'Cosmere', 'Literary universe', 'Connected planetary systems with world-specific physics, cultures, and timelines.', '#9b83f5'),
  plannedPack('star-wars', 'Star Wars', 'Licensed universe', 'A galaxy-scale atlas designed for systems, planets, eras, and character routes.', '#7fc9ff'),
  plannedPack('hyperion', 'Hyperion', 'Literary universe', 'A source-backed network of worlds, travel links, eras, and pilgrim journeys.', '#d7b26d'),
] as const;

export function universePackById(id: UniversePackId): UniversePackDefinition {
  const pack = UNIVERSE_PACKS.find(candidate => candidate.id === id);
  if (!pack) throw new Error(`Unknown universe pack: ${id}`);
  return pack;
}

export function validateUniversePack(pack: UniversePackDefinition): string[] {
  const errors: string[] = [];
  const locationIds = new Set<string>();
  for (const location of pack.locations) {
    if (locationIds.has(location.id)) errors.push(`Duplicate location id: ${location.id}`);
    locationIds.add(location.id);
  }
  for (const location of pack.locations) if (location.parentId && !locationIds.has(location.parentId)) errors.push(`Missing parent location: ${location.parentId}`);
  for (const journey of pack.journeys) {
    const orders = new Set<number>();
    for (const waypoint of journey.waypoints) {
      if (!locationIds.has(waypoint.locationId)) errors.push(`Unknown journey location: ${waypoint.locationId}`);
      if (orders.has(waypoint.order)) errors.push(`Duplicate waypoint order in ${journey.id}: ${waypoint.order}`);
      orders.add(waypoint.order);
    }
  }
  if (pack.status === 'ready' && !pack.scenarioIds.length) errors.push('Ready packs must expose at least one scenario.');
  return errors;
}
