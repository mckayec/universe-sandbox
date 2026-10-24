export type PlanetClimateInput = {
  mass: number;
  variant: number;
  stellarFlux: number;
  radiationHazard: number;
  impactShock: number;
};

export type PlanetClimate = {
  temperature: number;
  atmosphere: number;
  water: number;
  albedo: number;
  magnetosphere: number;
  summary: string;
};

const PROFILE = [
  { atmosphere: 0.03, water: 0.02, albedo: 0.16, greenhouse: 0 },
  { atmosphere: 0.12, water: 0.01, albedo: 0.2, greenhouse: 9 },
  { atmosphere: 7.5, water: 0.05, albedo: 0.72, greenhouse: 185 },
  { atmosphere: 1, water: 0.78, albedo: 0.31, greenhouse: 32 },
  { atmosphere: 0.7, water: 0.64, albedo: 0.69, greenhouse: 8 },
  { atmosphere: 0.18, water: 0, albedo: 0.11, greenhouse: 14 },
  { atmosphere: 0.45, water: 0.02, albedo: 0.13, greenhouse: 18 },
  { atmosphere: 0.09, water: 0.03, albedo: 0.24, greenhouse: 4 },
  { atmosphere: 0.8, water: 0.25, albedo: 0.27, greenhouse: 28 },
  { atmosphere: 0.52, water: 0.57, albedo: 0.58, greenhouse: 12 },
] as const;

export function planetClimate(input: PlanetClimateInput): PlanetClimate {
  const profile = PROFILE[input.variant % PROFILE.length];
  const retention = Math.max(0.08, Math.min(1.7, Math.pow(Math.max(0.1, input.mass) / 8, 0.42)));
  const atmosphere = Math.max(0, profile.atmosphere * retention * (1 - input.impactShock * 0.58));
  const albedo = Math.max(0.05, Math.min(0.85, profile.albedo + input.impactShock * 0.06));
  const equilibrium = 278 * Math.pow(Math.max(0.015, input.stellarFlux), 0.25) * Math.pow((1 - albedo) / 0.7, 0.25);
  const temperature = Math.max(35, equilibrium + profile.greenhouse * Math.min(1.6, atmosphere));
  const radiationLoss = Math.max(0, Math.min(0.9, input.radiationHazard * 0.72));
  const water = Math.max(
    0,
    Math.min(1, profile.water * (1 - radiationLoss) * (temperature > 390 ? 0.2 : temperature < 185 ? 0.68 : 1)),
  );
  const magnetosphere = Math.max(
    0,
    Math.min(1, 0.22 + Math.log2(Math.max(0.4, input.mass)) * 0.16 - input.impactShock * 0.18),
  );
  let summary = 'Temperate surface with retained volatiles';
  if (input.impactShock > 0.55) summary = 'Atmosphere disrupted by a recent impact';
  else if (temperature > 520) summary = 'Molten or runaway-greenhouse surface';
  else if (temperature > 345) summary = 'Hot greenhouse climate';
  else if (temperature < 150) summary = 'Deep-frozen volatile world';
  else if (temperature < 235) summary = 'Frozen surface with possible subsurface water';
  else if (water < 0.05)
    summary = atmosphere < 0.1 ? 'Airless and dry surface' : 'Dry atmosphere with scarce surface water';
  else if (input.radiationHazard > 0.45) summary = 'Temperate but exposed to hazardous radiation';
  return { temperature, atmosphere, water, albedo, magnetosphere, summary };
}
