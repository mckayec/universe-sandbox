import { EXHIBITS, type ExhibitId } from './exhibits.ts';

export type UniversePackId =
  | 'museum-sandbox'
  | 'solar-system'
  | 'red-rising'
  | 'sun-eater'
  | 'hyperion'
  | 'expanse'
  | 'dune'
  | 'foundation'
  | 'exoplanets'
  | 'powers-of-ten'
  | 'cosmere'
  | 'star-wars';
export type UniversePackStatus = 'ready' | 'atlas' | 'source-required';
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
  /** Relative URL of a standalone atlas page (status 'atlas'). */
  atlasPath?: string;
};

const atlasPack = (
  id: Exclude<UniversePackId, 'museum-sandbox'>,
  title: string,
  eyebrow: string,
  description: string,
  accent: string,
  atlasPath: string,
  sourceHint: string,
): UniversePackDefinition => ({
  id,
  title,
  eyebrow,
  description,
  accent,
  status: 'atlas',
  scenarioIds: [],
  locations: [],
  journeys: [],
  sourceHint,
  atlasPath,
});

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
  sourceHint:
    'Add authorized source files, then build a cited location hierarchy, event timeline, and character journeys before publishing this pack.',
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
      {
        id: 'milky-way',
        name: 'Milky Way analogue',
        scale: 'galaxy',
        parentId: 'deep-space',
        summary: 'A procedural galaxy-scale frame.',
        sources: [],
      },
      {
        id: 'solar-system',
        name: 'Solar System',
        scale: 'system',
        parentId: 'milky-way',
        summary: 'The built-in Solar System preset.',
        sources: [],
      },
    ],
    journeys: [],
    sourceHint: 'Built from the museum simulation model and its documented educational simplifications.',
  },
  atlasPack(
    'solar-system',
    'Solar System Atlas',
    'Real universe',
    'The Sun, planets, dwarf planets, moons, comets, the Kuiper Belt and the Oort Cloud, with cutaways of each world.',
    '#ffd57c',
    'atlas/solar.html',
    'Built from published planetary science data.',
  ),
  atlasPack(
    'red-rising',
    'The Society Atlas',
    'Red Rising',
    "Pierce Brown's terraformed Solar System, with its moons, colonies, factions and the Society's great ships.",
    '#d95b54',
    'atlas/society.html',
    'Reconstructed from the Red Rising books and cited fan references.',
  ),
  atlasPack(
    'sun-eater',
    'The Sun Eater Atlas',
    'Sun Eater',
    "Christopher Ruocchio's Sollan Empire, the Cielcin and Hadrian Marlowe's road across the galaxy.",
    '#e8cd8a',
    'atlas/?pack=sun-eater',
    'Reconstructed from the Sun Eater books, the published galaxy map and cited wiki summaries.',
  ),
  atlasPack(
    'hyperion',
    'The Hyperion Atlas',
    'Hyperion Cantos',
    "Dan Simmons's WorldWeb, the Pax and the Shrike, from Hyperion to The Rise of Endymion.",
    '#9db8ff',
    'atlas/?pack=hyperion',
    'Reconstructed from the four Hyperion Cantos novels and cited references.',
  ),
  atlasPack(
    'expanse',
    'The Expanse Atlas',
    'The Expanse',
    "James S. A. Corey's Sol system, the Ring and the gate worlds across all nine novels.",
    '#ffb27a',
    'atlas/?pack=expanse',
    'Reconstructed from the nine Expanse novels and cited references; gate-system positions are schematic.',
  ),
  atlasPack(
    'foundation',
    'The Foundation Atlas',
    'Foundation',
    "Isaac Asimov's falling Empire, the Seldon crises and the search for Earth.",
    '#a8d4f0',
    'atlas/?pack=foundation',
    'Reconstructed from the seven Foundation novels and cited references; most positions are estimated.',
  ),
  atlasPack(
    'dune',
    'The Dune Atlas',
    'Dune',
    "Frank Herbert's Imperium across all six novels, from Arrakis and the spice to the Scattering.",
    '#f0c47e',
    'atlas/?pack=dune',
    "Reconstructed from Frank Herbert's six Dune novels and their appendices; star placements from the glossary, with fan identifications marked estimated.",
  ),
  atlasPack(
    'exoplanets',
    'Nearby Worlds',
    'Real universe',
    'Every confirmed exoplanet system within about 100 light-years, placed at its real position, with worlds drawn from their measured size and temperature.',
    '#7fe0c4',
    'exoplanets/',
    'Built from the Open Exoplanet Catalogue, cross-checked against NASA exoplanet pages and discovery papers.',
  ),
  atlasPack(
    'powers-of-ten',
    'Powers of Ten',
    'Real universe',
    'One continuous zoom from inside a proton to the edge of the observable universe, a power of ten at a time.',
    '#c8b6ff',
    'powers/',
    'Sizes checked against published references; illustrative scenes are marked in the page.',
  ),
  atlasPack(
    'cosmere',
    'The Cosmere Atlas',
    'Cosmere',
    "Brandon Sanderson's Shardworlds, from Elantris to The Fires of December, with spoiler-gated reading order.",
    '#c9b8ff',
    'atlas/?pack=cosmere',
    'Reconstructed from the Cosmere books, the maps printed in them and cited Coppermind pages; star positions are schematic.',
  ),
  plannedPack(
    'star-wars',
    'Star Wars',
    'Planned fan pack',
    'A galaxy-scale atlas designed for systems, planets, eras, and character routes.',
    '#7fc9ff',
  ),
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
  for (const location of pack.locations)
    if (location.parentId && !locationIds.has(location.parentId))
      errors.push(`Missing parent location: ${location.parentId}`);
  for (const journey of pack.journeys) {
    const orders = new Set<number>();
    for (const waypoint of journey.waypoints) {
      if (!locationIds.has(waypoint.locationId)) errors.push(`Unknown journey location: ${waypoint.locationId}`);
      if (orders.has(waypoint.order)) errors.push(`Duplicate waypoint order in ${journey.id}: ${waypoint.order}`);
      orders.add(waypoint.order);
    }
  }
  if (pack.status === 'ready' && !pack.scenarioIds.length)
    errors.push('Ready packs must expose at least one scenario.');
  if (pack.status === 'atlas' && !pack.atlasPath) errors.push('Atlas packs must link to an atlas page.');
  if (pack.atlasPath && (/^[a-z]+:/i.test(pack.atlasPath) || pack.atlasPath.startsWith('/')))
    errors.push('Atlas paths must be relative to the site.');
  return errors;
}
