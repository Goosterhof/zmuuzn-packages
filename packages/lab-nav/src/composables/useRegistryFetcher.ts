import {ref, type Ref} from 'vue';

import type {RegistryExperiment} from '../types';

import {experiments as bundledExperiments} from '../experiments';

const REGISTRY_URL = 'https://auth.zmuuzn.nl/api/experiments';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Bundled fallback registry — projected from the canonical TS registry in `experiments.ts`.
 * This is the single source of truth for the laboratory's experiment count. If the live
 * registry endpoint goes dark or returns an empty list, every consumer falls back to this
 * snapshot. Keeping it derived from the TS registry (instead of a parallel JSON file)
 * makes drift between the type union, the registry, and the fallback physically impossible.
 */
const fallbackData: readonly RegistryExperiment[] = bundledExperiments.map((exp) => ({
    id: exp.id,
    label: exp.label,
    url: exp.url,
    accentColor: exp.accentColor,
}));

/** In-memory cache — shared across all LabMap instances in the same page. */
let cachedExperiments: RegistryExperiment[] | null = null;
let cacheTimestamp = 0;

export const useRegistryFetcher = (): {
    experiments: Ref<RegistryExperiment[]>;
    loading: Ref<boolean>;
    error: Ref<string | null>;
    fetch: () => Promise<void>;
} => {
    const experiments = ref<RegistryExperiment[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchRegistry = async (): Promise<void> => {
        /* Cache hit — skip network */
        if (cachedExperiments !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
            experiments.value = cachedExperiments;
            return;
        }

        loading.value = true;
        error.value = null;

        try {
            const response = await globalThis.fetch(REGISTRY_URL);
            if (!response.ok) throw new Error(`Registry returned ${String(response.status)}`);

            const data = (await response.json()) as {data?: RegistryExperiment[]} | RegistryExperiment[];

            /* Handle both wrapped { data: [...] } and raw [...] responses */
            const list = Array.isArray(data) ? data : (data.data ?? []);

            /* Empty registry means seeder hasn't run — use fallback instead of caching nothing */
            if (list.length === 0) {
                experiments.value = [...fallbackData];
                return;
            }

            cachedExperiments = list;
            cacheTimestamp = Date.now();
            experiments.value = list;
        } catch (fetchError: unknown) {
            const message = fetchError instanceof Error ? fetchError.message : 'Unknown error';
            error.value = message;

            /* Fallback to the bundled snapshot of the canonical TS registry */
            experiments.value = [...fallbackData];
        } finally {
            loading.value = false;
        }
    };

    return {experiments, loading, error, fetch: fetchRegistry};
};

/**
 * Reset the in-memory cache. Exposed for testing.
 */
export const _resetRegistryCache = (): void => {
    cachedExperiments = null;
    cacheTimestamp = 0;
};
