import { UpdateDeduplicator } from '../../src/security/update-deduplicator';

describe('UpdateDeduplicator Unit Tests', () => {
  let deduplicator: UpdateDeduplicator;

  beforeEach(() => {
    deduplicator = new UpdateDeduplicator(null, 60);
  });

  it('should accept first occurrence of an update ID', async () => {
    const isNew = await deduplicator.isUnique(10001);
    expect(isNew).toBe(true);
  });

  it('should reject duplicate occurrences of the same update ID', async () => {
    await deduplicator.isUnique(10002);
    const isDuplicate = await deduplicator.isUnique(10002);
    expect(isDuplicate).toBe(false);
  });

  it('should handle multiple distinct updates', async () => {
    expect(await deduplicator.isUnique(20001)).toBe(true);
    expect(await deduplicator.isUnique(20002)).toBe(true);
    expect(await deduplicator.isUnique(20003)).toBe(true);
    expect(await deduplicator.isUnique(20001)).toBe(false);
  });
});
