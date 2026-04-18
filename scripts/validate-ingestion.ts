import { PlantApiService } from '../src/services/PlantApiService';

async function run() {
  const noisyCases = [
    { title: 'Power plant', snippet: 'An industrial facility for electric power generation' },
    { title: 'Plant milk', snippet: 'A milk substitute made from plants' },
    { title: 'Human', snippet: 'A species of primate' },
  ];

  for (const item of noisyCases) {
    const res = PlantApiService.isCandidateRelevant(item.title, item.snippet);
    if (res.accepted) {
      throw new Error(`Expected rejection for noisy case: ${item.title}`);
    }
  }

  const botanicalCase = { title: 'Rosa canina', snippet: 'A species of rose native to Europe' };
  const botanicalPrefilter = PlantApiService.isCandidateRelevant(botanicalCase.title, botanicalCase.snippet);
  if (!botanicalPrefilter.accepted) {
    throw new Error('Expected botanical case to pass prefilter');
  }

  const validation = await PlantApiService.validateBotanicalCandidate(botanicalCase.title);
  if (!validation.accepted || !validation.taxonomy) {
    throw new Error('Expected Rosa canina to pass GBIF botanical validation');
  }

  if ((validation.taxonomy.kingdom || '').toLowerCase() !== 'plantae') {
    throw new Error('Expected Plantae kingdom for Rosa canina');
  }

  console.log('Validation checks passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
