import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateQuestions } from './QuizQuestionService';
import type { Plant } from '../types';

function makePlant(id: string, family: string, growthHabit: string, nativeRange: string): Plant {
  return {
    id,
    latinName: `Plantus ${id}`,
    names: { en: `Plant ${id}` },
    taxonomy: {
      kingdom: 'Plantae',
      phylum: 'Tracheophyta',
      class: 'Magnoliopsida',
      order: 'Rosales',
      family,
      genus: 'Plantus',
      species: `Plantus ${id}`,
    },
    traits: {
      growthHabit,
      nativeRange,
    },
    thumbnail: null,
    category: 'flower',
    popularityScore: 0,
  };
}

describe('QuizQuestionService', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
  });

  it('generates at least one property question when data is sufficient', () => {
    const plants: Plant[] = [
      makePlant('1', 'Rosaceae', 'Shrub', 'Europe'),
      makePlant('2', 'Asteraceae', 'Herb', 'Asia'),
      makePlant('3', 'Fabaceae', 'Tree', 'Africa'),
      makePlant('4', 'Poaceae', 'Grass', 'Americas'),
      makePlant('5', 'Lamiaceae', 'Subshrub', 'Mediterranean'),
    ];

    const questions = generateQuestions(plants, 5);

    expect(questions.some(q => q.type === 'PROPERTY_TO_NAME')).toBe(true);
  });

  it('falls back to existing types when property data is insufficient', () => {
    const plants: Plant[] = [
      makePlant('1', '', '', ''),
      makePlant('2', '', '', ''),
      makePlant('3', '', '', ''),
      makePlant('4', '', '', ''),
    ];

    const questions = generateQuestions(plants, 4);

    expect(questions.every(q => q.type !== 'PROPERTY_TO_NAME')).toBe(true);
  });
});
