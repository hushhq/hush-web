import { describe, it, expect, beforeEach } from 'vitest';
import {
  initCheckpoint,
  loadCheckpoint,
  markChunkCommitted,
  markCheckpointComplete,
  deleteCheckpoint,
  _clearAll,
  _internals,
} from './linkArchiveCheckpointStore';

describe('linkArchiveCheckpointStore', () => {
  beforeEach(async () => {
    await _clearAll();
  });

  it('initialises and loads a checkpoint by archiveId', async () => {
    const created = await initCheckpoint({
      archiveId: 'arch-A',
      role: 'import',
      instanceUrl: 'https://api.example.com',
      totalChunks: 5,
    });
    expect(created.archiveId).toBe('arch-A');
    expect(created.totalChunks).toBe(5);
    expect(created.highestContiguous).toBe(0);
    expect(created.chunkProgress).toBeInstanceOf(Uint8Array);
    expect(created.chunkProgress.byteLength).toBe(1); // 5 chunks => 1 byte

    const loaded = await loadCheckpoint('arch-A');
    expect(loaded?.archiveId).toBe('arch-A');
    expect(loaded?.totalChunks).toBe(5);
  });

  it('records committed chunks and recomputes highestContiguous', async () => {
    await initCheckpoint({ archiveId: 'arch-B', role: 'import', totalChunks: 4 });

    let res = await markChunkCommitted('arch-B', 0);
    expect(res.highestContiguous).toBe(1);

    res = await markChunkCommitted('arch-B', 2);
    // gap at idx=1 keeps highestContiguous at 1
    expect(res.highestContiguous).toBe(1);

    res = await markChunkCommitted('arch-B', 1);
    // 0,1,2 contiguous; 3 still missing
    expect(res.highestContiguous).toBe(3);

    res = await markChunkCommitted('arch-B', 3);
    expect(res.highestContiguous).toBe(4);

    const loaded = await loadCheckpoint('arch-B');
    for (let i = 0; i < 4; i++) {
      expect(_internals.isBitSet(loaded.chunkProgress, i)).toBe(true);
    }
  });

  it('marks complete and deletes the checkpoint', async () => {
    await initCheckpoint({ archiveId: 'arch-C', role: 'import', totalChunks: 1 });
    await markChunkCommitted('arch-C', 0);
    await markCheckpointComplete('arch-C');
    const completed = await loadCheckpoint('arch-C');
    expect(completed?.status).toBe('completed');
    await deleteCheckpoint('arch-C');
    const gone = await loadCheckpoint('arch-C');
    expect(gone).toBeNull();
  });

  it('rejects bad init params', async () => {
    await expect(initCheckpoint({ archiveId: '', totalChunks: 1, role: 'import' })).rejects.toThrow();
    await expect(initCheckpoint({ archiveId: 'x', totalChunks: 0, role: 'import' })).rejects.toThrow();
  });

  it('survives a reload by returning the same row from a fresh open', async () => {
    await initCheckpoint({ archiveId: 'arch-D', role: 'import', totalChunks: 2 });
    await markChunkCommitted('arch-D', 0);
    // simulate "reload" — fake-indexeddb persists across openDb calls within a test.
    const second = await loadCheckpoint('arch-D');
    expect(second?.highestContiguous).toBe(1);
  });
});
