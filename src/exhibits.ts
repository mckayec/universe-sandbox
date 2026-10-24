export type ExhibitId =
  | 'build-star'
  | 'habitable-world'
  | 'binary-stars'
  | 'feed-black-hole'
  | 'supernova-observatory'
  | 'collision-lab'
  | 'tidal-lab'
  | 'gododdin'
  | 'galaxy-tour';

export type ExhibitDefinition = {
  id: ExhibitId;
  title: string;
  eyebrow: string;
  description: string;
  objective: string;
  accent: string;
};

export const EXHIBITS: readonly ExhibitDefinition[] = [
  {
    id: 'build-star',
    title: 'Build a Star',
    eyebrow: 'Nebula laboratory',
    description: 'Watch dense knots compete for gas inside a massive stellar nursery.',
    objective: 'Feed a protostar until fusion begins. Its accumulated mass determines its color and future.',
    accent: '#da8cff',
  },
  {
    id: 'habitable-world',
    title: 'Create a Living World',
    eyebrow: 'Habitability laboratory',
    description: 'A young ocean world begins inside the temperate zone of a Sun-like star.',
    objective:
      'Keep the planet in a calm orbit and watch its biosphere develop—or disrupt it with impacts and radiation.',
    accent: '#63e4ac',
  },
  {
    id: 'binary-stars',
    title: 'Dance of Two Suns',
    eyebrow: 'Binary-star laboratory',
    description: 'Two unequal stars orbit their shared barycenter while one approaches its Roche lobe.',
    objective:
      'Turn on scientific overlays, watch their barycentric motion, and accelerate time until mass transfer begins.',
    accent: '#91bfff',
  },
  {
    id: 'feed-black-hole',
    title: 'Feed a Black Hole',
    eyebrow: 'Accretion laboratory',
    description: 'A build-locked black hole waits at the center of a compact system.',
    objective: 'Add or fling objects toward the event horizon and watch the disk, photon ring, and horizon grow.',
    accent: '#ff9c5f',
  },
  {
    id: 'supernova-observatory',
    title: 'Witness a Supernova',
    eyebrow: 'Stellar-death observatory',
    description: 'A massive hypergiant is seconds away from core collapse.',
    objective:
      'Watch the white flash, asymmetric ejecta, expanding shock front, lingering remnant, and pulsar birth at 1× speed.',
    accent: '#f4a6ff',
  },
  {
    id: 'collision-lab',
    title: 'Planetary Collision Lab',
    eyebrow: 'Impact laboratory',
    description: 'Two rocky worlds are placed on a destructive head-on trajectory.',
    objective: 'Change their paths to compare merging, grazing encounters, and high-speed fragmentation.',
    accent: '#ff765e',
  },
  {
    id: 'tidal-lab',
    title: 'Tidal Disruption Lab',
    eyebrow: 'Roche-limit laboratory',
    description: 'A rogue black hole is falling through a quiet planetary system.',
    objective:
      'Watch worlds stretch as they cross the Roche limit, then shear into debris streams. Fling the black hole again or drop a new one to repeat it.',
    accent: '#ffb36b',
  },
  {
    id: 'gododdin',
    title: 'The Fall of Gododdin',
    eyebrow: 'Sun Eater scenario · fiction',
    description: 'A Cielcin worldship tears past Gododdin at warp, its wake ripping the moon apart.',
    objective:
      'Keep time at 1×. As the worldship passes, time drops into slow motion so you can watch the moon stretch and shatter into a debris arc, while Gododdin holds together just outside the lethal zone. The warp-wake boost is fictional; the Roche-limit breakup is real physics.',
    accent: '#b79bff',
  },
  {
    id: 'galaxy-tour',
    title: 'Build a Galaxy',
    eyebrow: 'Deep-space laboratory',
    description: 'A central black hole anchors stars, stellar nurseries, and distinct navigable structures.',
    objective:
      'Use the named-structure navigator to move between the galaxy and local systems, then save the universe.',
    accent: '#ae8cff',
  },
] as const;

export function exhibitById(id: ExhibitId): ExhibitDefinition {
  const exhibit = EXHIBITS.find(candidate => candidate.id === id);
  if (!exhibit) throw new Error(`Unknown exhibit: ${id}`);
  return exhibit;
}
