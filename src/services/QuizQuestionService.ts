import type { Plant, QuizQuestion } from '../types';

type PropertyKey = 'family' | 'growthHabit' | 'nativeRange';

const PROPERTY_KEYS: PropertyKey[] = ['family', 'growthHabit', 'nativeRange'];

function getPropertyValue(plant: Plant, key: PropertyKey): string {
  if (key === 'family') return plant.taxonomy.family?.trim() || '';
  if (key === 'growthHabit') return plant.traits.growthHabit?.trim() || '';
  return plant.traits.nativeRange?.trim() || '';
}

function buildPropertyQuestion(
  plants: Plant[],
  plant: Plant,
  questionId: string
): QuizQuestion | null {
  const shuffledKeys = [...PROPERTY_KEYS].sort(() => Math.random() - 0.5);

  for (const key of shuffledKeys) {
    const propertyValue = getPropertyValue(plant, key);
    if (!propertyValue) continue;

    const candidates = plants.filter(p => p.id !== plant.id && getPropertyValue(p, key) && getPropertyValue(p, key) !== propertyValue);
    if (candidates.length < 3) continue;

    const others = [...candidates].sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [plant, ...others].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.findIndex(p => p.id === plant.id);

    if (correctIndex === -1) continue;

    return {
      id: questionId,
      type: 'PROPERTY_TO_NAME',
      plant,
      options: allOptions.map(p => p.id),
      correctIndex,
      propertyKey: key,
      propertyValue,
      prompt: `Which plant matches ${key}: ${propertyValue}?`,
    };
  }

  return null;
}

function canGeneratePropertyQuestion(plants: Plant[]): boolean {
  return plants.some(plant => !!buildPropertyQuestion(plants, plant, 'preview'));
}

export function generateQuestions(plants: Plant[], count: number): QuizQuestion[] {
  if (plants.length < 4) return [];

  const shuffled = [...plants].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  const hasPropertyCandidates = canGeneratePropertyQuestion(plants);

  return selected.map((plant, index) => {
    const questionId = `q_${index}`;
    const shouldForceProperty = hasPropertyCandidates && index === 0;
    const randomType = Math.random() > 0.5 ? 'IMAGE_TO_NAME' : 'NAME_TO_IMAGE';

    if (shouldForceProperty || Math.random() > 0.66) {
      const propertyQuestion = buildPropertyQuestion(plants, plant, questionId);
      if (propertyQuestion) return propertyQuestion;
    }

    const others = plants.filter(p => p.id !== plant.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [plant, ...others].sort(() => Math.random() - 0.5);
    const correctIndex = allOptions.findIndex(p => p.id === plant.id);

    return {
      id: questionId,
      type: randomType as 'IMAGE_TO_NAME' | 'NAME_TO_IMAGE',
      plant,
      options: randomType === 'IMAGE_TO_NAME'
        ? allOptions.map(p => p.latinName)
        : allOptions.map(p => p.id),
      correctIndex,
      imageUrl: plant.thumbnail || undefined,
    };
  });
}
