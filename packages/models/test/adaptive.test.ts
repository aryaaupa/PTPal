import { describe, it, expect } from 'vitest';
import { decideAdjustment } from '../src/index';

describe('adaptive engine', () => {
  it('reduces volume on high pain or poor form', () => {
    expect(decideAdjustment({ adherencePercent: 0.9, formQuality: 0.4, pain: 2, rpe: 3, timeToCompleteSec: 600 }).type).toBe('reduce_volume');
    expect(decideAdjustment({ adherencePercent: 0.9, formQuality: 0.9, pain: 8, rpe: 3, timeToCompleteSec: 600 }).type).toBe('reduce_volume');
  });
  it('adds rest on moderate pain', () => {
    expect(decideAdjustment({ adherencePercent: 0.9, formQuality: 0.7, pain: 5, rpe: 3, timeToCompleteSec: 600 }).type).toBe('add_rest');
  });
  it('progresses with great consistency', () => {
    expect(decideAdjustment({ adherencePercent: 0.95, formQuality: 0.85, pain: 2, rpe: 3, timeToCompleteSec: 400 }).type).toBe('progress_difficulty');
  });
});
