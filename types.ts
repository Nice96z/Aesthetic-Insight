
export type ProfileAttribute = {
  ethnicity: string;
  ageGroup: string;
  bodyType: string;
  eyeColor: string;
  hairColor: string;
  hairType: string;
  style: string;
};

export interface Profile extends ProfileAttribute {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
}

export type AttributeWeights = {
  [K in keyof ProfileAttribute]: {
    [value: string]: number;
  };
};

export interface Hotspot {
  city: string;
  country: string;
  reason: string;
  matchScore: number;
}

export interface InsightReport {
  summary: string;
  dominantTraits: string[];
  psychologicalProfile: string;
}

export interface AppState {
  profiles: Profile[];
  currentIndex: number;
  weights: AttributeWeights;
  interactionCount: number;
  refiningQuestion: string | null;
  hotspots: Hotspot[];
  report: InsightReport | null;
  isGenerating: boolean;
}
