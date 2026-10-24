// Habitability and life progression on planets.
import { habitabilityQuality } from '../simulation-model.ts';
import { planetClimate } from '../planet-climate.ts';
import { STAGES } from '../celestial-catalog.ts';
import { updateBodyLabel } from '../bodies/registry.ts';
import { habitableRange, lifeFromScore } from './body-math.ts';
import { app, bodies } from '../state/app-state.ts';
import type { Body } from '../state/types.ts';
import { museumEvent } from '../ui/feed.ts';
import { updateInspector } from '../ui/inspector.ts';

export function updateLife(b: Body, dt: number) {
  if (b.kind !== 'rocky') return;
  let stellarQuality = 0,
    stellarHazard = 0,
    compactStarPenalty = 0,
    temperateStars = 0,
    stellarFlux = 0;
  for (const star of bodies) {
    if (star.kind === 'star') {
      const range = habitableRange(star),
        distance = Math.max(0.4, b.mesh.position.distanceTo(star.mesh.position)),
        stage = star.stage!,
        look = STAGES.find(candidate => candidate.stage === stage)!;
      stellarFlux += (Math.pow(look.temperature / 5800, 4) * look.scale * look.scale * 144) / (distance * distance);
      if (distance >= range.inner && distance <= range.outer) {
        const center = (range.inner + range.outer) / 2,
          half = (range.outer - range.inner) / 2;
        stellarQuality = Math.max(stellarQuality, 1 - Math.abs(distance - center) / half);
        temperateStars++;
      }
      stellarHazard +=
        stage === 'hypergiant'
          ? 0.58
          : stage === 'blue star'
            ? 0.34
            : stage === 'giant'
              ? 0.25
              : stage === 'white dwarf'
                ? 0.18
                : stage === 'red dwarf'
                  ? 0.12
                  : 0;
    } else if (star.kind === 'pulsar' || star.kind === 'blackhole') {
      const distance = b.mesh.position.distanceTo(star.mesh.position),
        reach = star.kind === 'pulsar' ? 26 : 16;
      if (distance < reach)
        compactStarPenalty = Math.max(
          compactStarPenalty,
          (1 - distance / reach) * (star.kind === 'pulsar' ? 0.9 : 0.55),
        );
    }
  }
  if (temperateStars > 1) stellarHazard += 0.12 * (temperateStars - 1);
  const totalHazard = Math.min(1, stellarHazard + compactStarPenalty),
    climate = planetClimate({
      mass: b.mass,
      variant: b.variant,
      stellarFlux,
      radiationHazard: totalHazard,
      impactShock: b.habitabilityShock,
    }),
    habitat = habitabilityQuality({
      planetMass: b.mass,
      variant: b.variant,
      stellarQuality,
      stellarHazard: Math.min(1, stellarHazard),
      compactStarPenalty,
      impactShock: b.habitabilityShock,
    });
  b.surfaceTemperature = climate.temperature;
  b.atmosphere = climate.atmosphere;
  b.water = climate.water;
  b.magnetosphere = climate.magnetosphere;
  b.habitatStatus = `${climate.summary}; ${habitat.summary.toLowerCase()}`;
  b.lifeScore =
    habitat.quality > 0.08
      ? Math.min(80, b.lifeScore + dt * (0.3 + habitat.quality * 1.05))
      : Math.max(0, b.lifeScore - dt * (0.3 + b.habitabilityShock * 0.55));
  const previous = b.lifeLevel,
    next = lifeFromScore(b.lifeScore);
  if (next !== previous) {
    b.lifeLevel = next;
    updateBodyLabel(b);
    if (app.selectedBody === b) updateInspector();
    if (next === 'microbial' || next === 'complex' || next === 'technological')
      museumEvent(
        'Life evolves',
        `${b.name} developed ${next} life under ${habitat.summary.toLowerCase()}.`,
        '#75dda4',
        b,
      );
    else if (previous !== 'none' && next === 'none')
      museumEvent(
        'Biosphere collapse',
        `${b.name} lost detectable life: ${habitat.summary.toLowerCase()}.`,
        '#ff8b72',
        b,
      );
  }
}
