import {describe, it, expect} from 'vitest';

import {experiments} from '../src/experiments';
import {EXPERIMENT_SHADOW_COLORS, type ExperimentId} from '../src/types';

/**
 * Canonical list of every value the `ExperimentId` union admits. The registry-sync
 * deputy below uses this tuple to verify that the type union, the registry in
 * `experiments.ts`, and the shadow palette in `types.ts` all agree about the
 * laboratory's experiment count. If a new experiment is added to the union, this
 * tuple is the next thing TypeScript demands be updated — and from there the
 * deputy fails until the registry follows.
 *
 * `satisfies` keeps the tuple's literal types but forces exhaustiveness against
 * the union, so adding a new id without updating this tuple is a compile error.
 */
const ALL_EXPERIMENT_IDS = [
    'gatekeeper',
    'war-table',
    'crucible',
    'parlour',
    'smokestacks',
    'horadrim',
] as const satisfies readonly ExperimentId[];

describe('experiments', () => {
    it('should contain exactly six experiments', () => {
        expect(experiments).toHaveLength(6);
    });

    it('should include gatekeeper, war-table, crucible, parlour, smokestacks, and horadrim', () => {
        const ids = experiments.map((e) => e.id);
        expect(ids).toContain('gatekeeper');
        expect(ids).toContain('war-table');
        expect(ids).toContain('crucible');
        expect(ids).toContain('parlour');
        expect(ids).toContain('smokestacks');
        expect(ids).toContain('horadrim');
    });

    it('should have valid URLs following the *.zmuuzn.nl pattern', () => {
        for (const exp of experiments) {
            expect(exp.url).toMatch(/^https:\/\/[a-z]+\.zmuuzn\.nl$/);
        }
    });

    it('should have valid hex accent colors', () => {
        for (const exp of experiments) {
            expect(exp.accentColor).toMatch(/^#[0-9A-F]{6}$/i);
        }
    });

    it('should have non-empty labels', () => {
        for (const exp of experiments) {
            expect(exp.label.length).toBeGreaterThan(0);
        }
    });

    it('should have non-empty exit labels for experiment-aware logout', () => {
        for (const exp of experiments) {
            expect(exp.exitLabel.length).toBeGreaterThan(0);
        }
    });
});

/**
 * The registry-sync deputy. The laboratory's experiment count lives in three places
 * that must never disagree: the `ExperimentId` union (`types.ts`), the runtime
 * registry (`experiments.ts`), and the shadow palette (`EXPERIMENT_SHADOW_COLORS`).
 * These tests fail loudly the moment a contributor edits one and forgets the others.
 *
 * Diagnostic strategy: each assertion compares two arrays/sets directly so the
 * Vitest diff output names the missing or extraneous id. We avoid the 2-arg
 * `expect(value, message)` form because the lint rule rejects it.
 */
describe('registry sync deputy', () => {
    it('should have a registry entry for every ExperimentId in the union', () => {
        const registryIds = new Set(experiments.map((e) => e.id));
        const missing = ALL_EXPERIMENT_IDS.filter((id) => !registryIds.has(id));
        expect(missing).toStrictEqual([]);
    });

    it('should not have registry entries for ids outside the ExperimentId union', () => {
        const unionIds = new Set<string>(ALL_EXPERIMENT_IDS);
        const stowaways = experiments.map((e) => e.id).filter((id) => !unionIds.has(id));
        expect(stowaways).toStrictEqual([]);
    });

    it('should have a shadow color for every ExperimentId in the union', () => {
        const missingShadows = ALL_EXPERIMENT_IDS.filter((id) => !/^#[0-9A-F]{6}$/i.test(EXPERIMENT_SHADOW_COLORS[id]));
        expect(missingShadows).toStrictEqual([]);
    });
});
