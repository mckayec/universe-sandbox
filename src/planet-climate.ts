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
  { atmosphere: .03, water: .02, albedo: .16, greenhouse: 0 },
  { atmosphere: .12, water: .01, albedo: .2, greenhouse: 9 },
  { atmosphere: 7.5, water: .05, albedo: .72, greenhouse: 185 },
  { atmosphere: 1, water: .78, albedo: .31, greenhouse: 32 },
  { atmosphere: .7, water: .64, albedo: .69, greenhouse: 8 },
  { atmosphere: .18, water: 0, albedo: .11, greenhouse: 14 },
  { atmosphere: .45, water: .02, albedo: .13, greenhouse: 18 },
  { atmosphere: .09, water: .03, albedo: .24, greenhouse: 4 },
  { atmosphere: .8, water: .25, albedo: .27, greenhouse: 28 },
  { atmosphere: .52, water: .57, albedo: .58, greenhouse: 12 },
] as const;

export function planetClimate(input: PlanetClimateInput): PlanetClimate {
  const profile = PROFILE[input.variant % PROFILE.length];
  const retention = Math.max(.08, Math.min(1.7, Math.pow(Math.max(.1, input.mass) / 8, .42)));
  const atmosphere = Math.max(0, profile.atmosphere * retention * (1 - input.impactShock * .58));
  const albedo = Math.max(.05, Math.min(.85, profile.albedo + input.impactShock * .06));
  const equilibrium = 278 * Math.pow(Math.max(.015, input.stellarFlux), .25) * Math.pow((1 - albedo) / .7, .25);
  const temperature = Math.max(35, equilibrium + profile.greenhouse * Math.min(1.6, atmosphere));
  const radiationLoss = Math.max(0, Math.min(.9, input.radiationHazard * .72));
  const water = Math.max(0, Math.min(1, profile.water * (1 - radiationLoss) * (temperature > 390 ? .2 : temperature < 185 ? .68 : 1)));
  const magnetosphere = Math.max(0, Math.min(1, .22 + Math.log2(Math.max(.4, input.mass)) * .16 - input.impactShock * .18));
  let summary = 'Temperate surface with retained volatiles';
  if (input.impactShock > .55) summary = 'Atmosphere disrupted by a recent impact';
  else if (temperature > 520) summary = 'Molten or runaway-greenhouse surface';
  else if (temperature > 345) summary = 'Hot greenhouse climate';
  else if (temperature < 150) summary = 'Deep-frozen volatile world';
  else if (temperature < 235) summary = 'Frozen surface with possible subsurface water';
  else if (water < .05) summary = atmosphere < .1 ? 'Airless and dry surface' : 'Dry atmosphere with scarce surface water';
  else if (input.radiationHazard > .45) summary = 'Temperate but exposed to hazardous radiation';
  return { temperature, atmosphere, water, albedo, magnetosphere, summary };
}
