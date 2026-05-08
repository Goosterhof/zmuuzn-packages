import type {ExperimentId, VisitRecord} from '../types';

const STORAGE_KEY = 'lab-nav-visits';

// Partial<Record<...>> is the runtime-truthful shape: parsed JSON may be
// missing keys for unvisited experiments. Plain Record<...> claims every
// key is present, which trips type-aware no-unnecessary-condition on the
// downstream defensive checks. The library has no injected storage
// service, so direct localStorage use is intentional — see eslint-disable
// at each call site below.
type VisitStore = Partial<Record<string, VisitRecord>>;

const readStore = (): VisitStore => {
    try {
        // eslint-disable-next-line no-restricted-globals -- lab-nav is self-contained and has no injected storage service
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return {};
        return JSON.parse(raw) as VisitStore;
    } catch {
        return {};
    }
};

const writeStore = (store: VisitStore): void => {
    try {
        // eslint-disable-next-line no-restricted-globals -- lab-nav is self-contained and has no injected storage service
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
        /* localStorage full or unavailable — degrade silently */
    }
};

const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diffMs = now - timestamp;

    if (diffMs < 0) return 'just now';

    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? '1 minute ago' : `${String(minutes)} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? '1 hour ago' : `${String(hours)} hours ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? '1 day ago' : `${String(days)} days ago`;

    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${String(months)} months ago`;
};

export const useVisitHistory = () => {
    const recordVisit = (id: ExperimentId): void => {
        const store = readStore();
        const existing = store[id];
        store[id] = {count: (existing?.count ?? 0) + 1, lastVisited: Date.now()};
        writeStore(store);
    };

    const getLastVisited = (id: ExperimentId): string => {
        const store = readStore();
        const record = store[id];
        if (record === undefined) return 'Not yet visited';
        return formatRelativeTime(record.lastVisited);
    };

    const getVisitCount = (id: ExperimentId): number => {
        const store = readStore();
        return store[id]?.count ?? 0;
    };

    return {recordVisit, getLastVisited, getVisitCount};
};
