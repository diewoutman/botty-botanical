export interface Plant {
  id: string;
  latinName: string;
  names: Record<string, string>;
  taxonomy: Taxonomy;
  traits: PlantTraits;
  thumbnail: string | null;
  category: PlantCategory;
  popularityScore: number;
  isExternal?: boolean;
  wikiPageId?: number;
}

export interface PlantDetail {
  id: string;
  general: GeneralInfo;
  deep: DeepInfo | null;
  images: PlantImage[];
  sources: DataSource[];
}

export interface Taxonomy {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
}

export interface PlantTraits {
  sun?: string;
  water?: string;
  hardiness?: string;
  height?: string;
  growthHabit?: string;
  nativeRange?: string;
  bloomTime?: string;
}

export type PlantCategory = 'tree' | 'flower' | 'shrub' | 'herb' | 'grass' | 'fern' | 'other';

export interface GeneralInfo {
  description: Record<string, string>;
  family: string;
  nativeRange: string[];
  growthHabit: string;
  bloomTime?: string;
  height?: string;
}

export interface DeepInfo {
  history: Record<string, string>;
  etymology: Record<string, string>;
  culturalSignificance: Record<string, string>;
  usesTraditional: string[];
  usesModern: string[];
  conservationStatus: string;
}

export interface PlantImage {
  url: string;
  thumbnailUrl?: string;
  photographer: string;
  license: string;
  sourceUrl: string;
}

export interface DataSource {
  name: string;
  url: string;
}

export type QuestionType = 'IMAGE_TO_NAME' | 'NAME_TO_IMAGE' | 'PROPERTY_TO_NAME';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  plant: Plant;
  options: string[];
  correctIndex: number;
  imageUrl?: string;
  prompt?: string;
  propertyKey?: 'family' | 'growthHabit' | 'nativeRange';
  propertyValue?: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  plantId: string;
  type: QuestionType;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
}

export interface SearchIndexEntry {
  id: string;
  terms: string[];
  preview: {
    latin: string;
    thumbnail: string | null;
  };
}

export type Language = 'nl' | 'en' | 'de' | 'fr' | 'es';

export const SUPPORTED_LANGUAGES: Language[] = ['nl', 'en', 'de', 'fr', 'es'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Francais',
  es: 'Espanol',
};