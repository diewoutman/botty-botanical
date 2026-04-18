import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlantApiService, WikipediaTemporarilyUnavailableError } from './PlantApiService';

describe('PlantApiService ingestion filters', () => {
  it('rejects known noisy terms', () => {
    const noisyCases = [
      { title: 'Power plant', snippet: 'An industrial facility for electric power generation' },
      { title: 'Plant milk', snippet: 'A milk substitute made from plants' },
      { title: 'Human', snippet: 'A species of primate' },
    ];

    noisyCases.forEach((item) => {
      const res = PlantApiService.isCandidateRelevant(item.title, item.snippet);
      expect(res.accepted).toBe(false);
    });
  });

  it('accepts botanical-sounding candidate in prefilter', () => {
    const res = PlantApiService.isCandidateRelevant('Rosa canina', 'A species of rose native to Europe');
    expect(res.accepted).toBe(true);
  });
});

describe('PlantApiService Wikipedia resilience', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('paces rapid Wikipedia calls with rate limiting', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ query: { search: [] } }),
    } as Response);

    const first = PlantApiService.searchWikipedia('rose');
    await vi.runAllTimersAsync();
    await first;

    const second = PlantApiService.searchWikipedia('orchid');
    await vi.advanceTimersByTimeAsync(999);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    await second;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries on 429 and throws temporary-unavailable after retry exhaustion', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    const promise = PlantApiService.searchWikipedia('rose');
    const assertion = expect(promise).rejects.toBeInstanceOf(WikipediaTemporarilyUnavailableError);
    await vi.runAllTimersAsync();
    await assertion;
  });

  it('returns empty external results when Wikipedia is temporarily unavailable', async () => {
    vi.spyOn(PlantApiService, 'searchWikipedia').mockRejectedValue(new WikipediaTemporarilyUnavailableError());

    await expect(PlantApiService.searchExternalPlants('rose')).resolves.toEqual([]);
  });
});
