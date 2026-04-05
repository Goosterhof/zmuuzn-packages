import { ref, type Ref } from "vue";
import type { RegistryExperiment } from "../types";
import fallbackData from "../experiments-fallback.json";

const REGISTRY_URL = "https://auth.zmuuzn.nl/api/experiments";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

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

  const isCacheValid = (): boolean =>
    cachedExperiments !== null && Date.now() - cacheTimestamp < CACHE_TTL_MS;

  const fetchRegistry = async (): Promise<void> => {
    /* Cache hit — skip network */
    if (isCacheValid()) {
      experiments.value = cachedExperiments!;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await globalThis.fetch(REGISTRY_URL);
      if (!response.ok) throw new Error(`Registry returned ${String(response.status)}`);

      const data = (await response.json()) as
        | { data?: RegistryExperiment[] }
        | RegistryExperiment[];

      /* Handle both wrapped { data: [...] } and raw [...] responses */
      const list = Array.isArray(data) ? data : (data.data ?? []);

      cachedExperiments = list;
      cacheTimestamp = Date.now();
      experiments.value = list;
    } catch (fetchError: unknown) {
      const message = fetchError instanceof Error ? fetchError.message : "Unknown error";
      error.value = message;

      /* Fallback to bundled static registry */
      experiments.value = fallbackData as RegistryExperiment[];
    } finally {
      loading.value = false;
    }
  };

  return { experiments, loading, error, fetch: fetchRegistry };
};

/**
 * Reset the in-memory cache. Exposed for testing.
 */
export const _resetRegistryCache = (): void => {
  cachedExperiments = null;
  cacheTimestamp = 0;
};
