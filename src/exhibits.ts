export type ExhibitId =
  | 'build-star'
  | 'habitable-world'
  | 'binary-stars'
  | 'feed-black-hole'
  | 'slow-feast'
  | 'supernova-observatory'
  | 'collision-lab'
  | 'tidal-lab'
  | 'gododdin'
  | 'galaxy-tour'
  | 'galaxy-collision';

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
    id: 'slow-feast',
    title: 'A Slow Feast',
    eyebrow: 'Slow-accretion laboratory',
    description: 'A quiet black hole draws in a drifting gas cloud, then a Sun-like star on a plunging orbit.',
    objective:
      'At 1× in Exhibit mode, watch a gas cloud feed the disk, followed by a star on a close approach. Capture and stripping are paced for this demonstration, over seconds to minutes rather than physical astronomical times. Select the black hole to follow its mass. This simplified model does not resolve stellar disruption, disk viscosity or outflows.',
    accent: '#ffc27a',
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
    description:
      'Cielcin worldships come out of warp on the fleet massed around Gododdin, and one drops into the planet itself.',
    objective:
      'Keep time at 1×. Worldships tear through the fleet at warp, then drop out of warp around the planet; the last arrives inside Gododdin and time slows as the world breaks apart. From Shadows Upon Time (Sun Eater #7); the warp shock is the book’s fiction; the breakup follows real Roche-limit physics.',
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
  {
    id: 'galaxy-collision',
    title: 'Collide Two Galaxies',
    eyebrow: 'Galaxy-merger laboratory',
    description: 'Two spiral galaxies fall toward each other on an off-centre path.',
    objective:
      'Run at 5× or faster to explore a compressed galaxy encounter. Gravity redirects stellar orbits and can draw out tidal tails. A simplified drag rule brings these model cores together; their final replacement by one core is illustrative, not a calculation of black-hole binary evolution. Most stars miss one another, while real galactic gas can collide and shock.',
    accent: '#c9a6ff',
  },
] as const;

export function exhibitById(id: ExhibitId): ExhibitDefinition {
  const exhibit = EXHIBITS.find(candidate => candidate.id === id);
  if (!exhibit) throw new Error(`Unknown exhibit: ${id}`);
  return exhibit;
}
