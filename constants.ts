
import { AttributeWeights, ProfileAttribute } from './types';

export const INITIAL_WEIGHT = 1.0;
export const WEIGHT_INCREMENT = 0.2;

export const ATTRIBUTE_KEYS: (keyof ProfileAttribute)[] = [
  'ethnicity',
  'ageGroup',
  'bodyType',
  'eyeColor',
  'hairColor',
  'hairType',
  'style'
];

export const INITIAL_WEIGHTS: AttributeWeights = {
  ethnicity: {},
  ageGroup: {},
  bodyType: {},
  eyeColor: {},
  hairColor: {},
  hairType: {},
  style: {}
};

export const PROBING_INTERVAL = 10;
