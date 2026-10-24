import type { StellarStage } from './simulation-model.ts';

export type Kind =
  | 'asteroid'
  | 'comet'
  | 'moon'
  | 'dwarf'
  | 'rocky'
  | 'gas'
  | 'brown'
  | 'star'
  | 'protostar'
  | 'pulsar'
  | 'blackhole'
  | 'nebula';
export type Placeable = Exclude<Kind, 'protostar'>;
export type StageLook = {
  stage: StellarStage;
  duration: number;
  color: number;
  css: string;
  scale: number;
  temperature: number;
  granules: number;
  turbulence: number;
  spots: number;
  brightness: number;
  glowSize: number;
  glowOpacity: number;
  corona: number;
  prominences: number;
};
export type PaletteChoice = {
  id: string;
  kind: Placeable;
  label: string;
  detail: string;
  swatch: string;
  mass?: number;
  stage?: StellarStage;
};

export const TYPES: Record<
  Kind,
  { label: string; detail: string; color: number; css: string; radius: number; mass: number }
> = {
  asteroid: {
    label: 'Asteroid',
    detail: 'Irregular rocky minor body',
    color: 0x8f8579,
    css: '#aaa094',
    radius: 0.38,
    mass: 0.08,
  },
  comet: {
    label: 'Comet',
    detail: 'Icy body with an active tail',
    color: 0xb8dce5,
    css: '#c8f2ff',
    radius: 0.42,
    mass: 0.16,
  },
  moon: {
    label: 'Moon',
    detail: 'Natural planetary satellite',
    color: 0xa9a39b,
    css: '#c9c4bc',
    radius: 0.52,
    mass: 0.72,
  },
  dwarf: {
    label: 'Dwarf planet',
    detail: 'Rounded planetary minor world',
    color: 0xa97b65,
    css: '#c89578',
    radius: 0.72,
    mass: 2.2,
  },
  rocky: {
    label: 'Rocky planet',
    detail: 'Terrestrial building block',
    color: 0xb76e47,
    css: '#c98259',
    radius: 1.05,
    mass: 8,
  },
  gas: { label: 'Gas giant', detail: 'Growing hydrogen world', color: 0x77a5c8, css: '#78afd2', radius: 1.9, mass: 28 },
  brown: {
    label: 'Brown dwarf',
    detail: 'Substellar fusion candidate',
    color: 0xb85832,
    css: '#e07447',
    radius: 1.72,
    mass: 105,
  },
  star: {
    label: 'Main star',
    detail: 'Evolving stellar furnace',
    color: 0xffc96b,
    css: '#ffd278',
    radius: 2.15,
    mass: 210,
  },
  protostar: {
    label: 'Protostar',
    detail: 'Nebula-born stellar seed',
    color: 0xff8f68,
    css: '#ff9b76',
    radius: 0.65,
    mass: 42,
  },
  pulsar: {
    label: 'Pulsar',
    detail: 'Wobbling neutron remnant',
    color: 0xa9d8ff,
    css: '#b8e4ff',
    radius: 1.05,
    mass: 330,
  },
  blackhole: {
    label: 'Black hole',
    detail: 'Accreting event horizon',
    color: 0x161725,
    css: '#856dff',
    radius: 1.4,
    mass: 600,
  },
  nebula: {
    label: 'Nebula',
    detail: 'Protostar-forming cloud',
    color: 0xb46de0,
    css: '#c27ee8',
    radius: 8.2,
    mass: 260,
  },
};

export const STAGES: StageLook[] = [
  {
    stage: 'red dwarf',
    duration: 90,
    color: 0xd84332,
    css: '#ff604e',
    scale: 0.68,
    temperature: 3200,
    granules: 3.2,
    turbulence: 0.12,
    spots: 0.32,
    brightness: 0.78,
    glowSize: 5.2,
    glowOpacity: 0.35,
    corona: 0.09,
    prominences: 2,
  },
  {
    stage: 'yellow star',
    duration: 75,
    color: 0xffb83e,
    css: '#ffd36b',
    scale: 1,
    temperature: 5800,
    granules: 5.4,
    turbulence: 0.085,
    spots: 0.13,
    brightness: 1,
    glowSize: 6.4,
    glowOpacity: 0.48,
    corona: 0.12,
    prominences: 3,
  },
  {
    stage: 'white star',
    duration: 60,
    color: 0xdcecff,
    css: '#f5f9ff',
    scale: 1.1,
    temperature: 8200,
    granules: 7.8,
    turbulence: 0.055,
    spots: 0.045,
    brightness: 1.22,
    glowSize: 7.2,
    glowOpacity: 0.56,
    corona: 0.16,
    prominences: 2,
  },
  {
    stage: 'blue star',
    duration: 50,
    color: 0x6faaff,
    css: '#8fc5ff',
    scale: 1.3,
    temperature: 18000,
    granules: 10.5,
    turbulence: 0.04,
    spots: 0.015,
    brightness: 1.48,
    glowSize: 8.8,
    glowOpacity: 0.65,
    corona: 0.22,
    prominences: 2,
  },
  {
    stage: 'giant',
    duration: 45,
    color: 0xf16a35,
    css: '#ff8b4f',
    scale: 1.78,
    temperature: 4400,
    granules: 2.15,
    turbulence: 0.16,
    spots: 0.24,
    brightness: 1.12,
    glowSize: 7.5,
    glowOpacity: 0.5,
    corona: 0.17,
    prominences: 5,
  },
  {
    stage: 'hypergiant',
    duration: 30,
    color: 0xd9342b,
    css: '#ff5547',
    scale: 2.5,
    temperature: 3600,
    granules: 1.35,
    turbulence: 0.22,
    spots: 0.38,
    brightness: 1.3,
    glowSize: 9.2,
    glowOpacity: 0.6,
    corona: 0.25,
    prominences: 8,
  },
  {
    stage: 'white dwarf',
    duration: Infinity,
    color: 0xdcecff,
    css: '#eef7ff',
    scale: 0.48,
    temperature: 12000,
    granules: 12,
    turbulence: 0.025,
    spots: 0.01,
    brightness: 1.7,
    glowSize: 8.5,
    glowOpacity: 0.52,
    corona: 0.08,
    prominences: 0,
  },
];

export const PLACEABLES: Placeable[] = [
  'asteroid',
  'comet',
  'moon',
  'dwarf',
  'rocky',
  'gas',
  'brown',
  'star',
  'pulsar',
  'blackhole',
  'nebula',
];
export const PALETTE_CHOICES: PaletteChoice[] = [
  { id: 'asteroid', kind: 'asteroid', label: 'Asteroid', detail: 'Irregular rocky minor body', swatch: 'asteroid' },
  { id: 'comet', kind: 'comet', label: 'Comet', detail: 'Icy body with an active tail', swatch: 'comet' },
  { id: 'moon', kind: 'moon', label: 'Moon', detail: 'Natural planetary satellite', swatch: 'moon' },
  { id: 'dwarf', kind: 'dwarf', label: 'Dwarf planet', detail: 'Rounded minor world', swatch: 'dwarf' },
  { id: 'rocky', kind: 'rocky', label: 'Rocky planet', detail: 'Terrestrial building block', swatch: 'rocky' },
  { id: 'gas', kind: 'gas', label: 'Gas giant', detail: 'Hydrogen-rich giant planet', swatch: 'gas' },
  { id: 'brown', kind: 'brown', label: 'Brown dwarf', detail: 'Substellar fusion candidate', swatch: 'brown' },
  {
    id: 'red-star',
    kind: 'star',
    label: 'Red dwarf',
    detail: 'Cool, small M-class star',
    swatch: 'star-red',
    mass: 120,
    stage: 'red dwarf',
  },
  {
    id: 'yellow-star',
    kind: 'star',
    label: 'Yellow star',
    detail: 'Sun-like G-class star',
    swatch: 'star-yellow',
    mass: 210,
    stage: 'yellow star',
  },
  {
    id: 'white-star',
    kind: 'star',
    label: 'White star',
    detail: 'Hot A-class star',
    swatch: 'star-white',
    mass: 260,
    stage: 'white star',
  },
  {
    id: 'blue-star',
    kind: 'star',
    label: 'Blue star',
    detail: 'Very hot massive star',
    swatch: 'star-blue',
    mass: 360,
    stage: 'blue star',
  },
  {
    id: 'giant-star',
    kind: 'star',
    label: 'Red giant',
    detail: 'Expanded late-life star',
    swatch: 'star-giant',
    mass: 300,
    stage: 'giant',
  },
  {
    id: 'hypergiant-star',
    kind: 'star',
    label: 'Hypergiant',
    detail: 'Enormous unstable star',
    swatch: 'star-hyper',
    mass: 500,
    stage: 'hypergiant',
  },
  { id: 'pulsar', kind: 'pulsar', label: 'Pulsar', detail: 'Wobbling neutron remnant', swatch: 'pulsar' },
  { id: 'blackhole', kind: 'blackhole', label: 'Black hole', detail: 'Accreting event horizon', swatch: 'blackhole' },
  { id: 'nebula', kind: 'nebula', label: 'Nebula', detail: 'Diffuse star-forming cloud', swatch: 'nebula' },
];

export const ROCKY_VARIANTS = [
  'Airless silicate',
  'Iron-rich desert',
  'Clouded greenhouse',
  'Ocean world',
  'Frozen terrestrial',
  'Lava world',
  'Carbon world',
  'Rust desert',
  'Tidally locked world',
  'Salt-and-ice world',
];
export const GAS_VARIANTS = [
  'Banded gas giant',
  'Pale ringed giant',
  'Ice giant',
  'Stormy ice giant',
  'Hot Jupiter',
  'Cloud-rich giant',
  'Ultramarine giant',
  'Golden super-Jupiter',
  'Rose gas giant',
  'Cold methane giant',
];
export const BLACK_HOLE_VARIANTS = [
  'Quiet stellar black hole',
  'Hot stellar black hole',
  'Jetting black hole',
  'Massive active black hole',
];
export const NEBULA_VARIANTS = [
  'Emission nebula',
  'Reflection nebula',
  'Planetary nebula',
  'Dark molecular cloud',
  'Supernova remnant',
];
export const DWARF_VARIANTS = [
  'Ceres-like dwarf',
  'Pluto-like dwarf',
  'Haumea-like dwarf',
  'Eris-like dwarf',
  'Cryovolcanic dwarf',
  'Carbon-rich dwarf',
];
export const MOON_VARIANTS = [
  'Airless moon',
  'Icy moon',
  'Volcanic moon',
  'Ocean moon',
  'Captured moon',
  'Ring shepherd',
];
export const VARIANT_COUNTS: Partial<Record<Placeable, number>> = {
  moon: MOON_VARIANTS.length,
  dwarf: DWARF_VARIANTS.length,
  rocky: ROCKY_VARIANTS.length,
  gas: GAS_VARIANTS.length,
  blackhole: BLACK_HOLE_VARIANTS.length,
  nebula: NEBULA_VARIANTS.length,
};

export const G = 1.05;
export const PULSAR_LIMIT = 520;
export const ASTEROID_TO_DWARF = 0.85;
export const DWARF_TO_ROCKY = 5;
export const ROCKY_TO_GAS = 40;
export const GAS_TO_BROWN = 100;
