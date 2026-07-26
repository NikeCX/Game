export const STORAGE_VERSION = 1;

/** Zustand `persist` migrate hook. Only v1 exists today; future schema bumps
 * add cases here instead of silently discarding older saves. */
export function migrate(persistedState, version) {
  if (version === STORAGE_VERSION) return persistedState;
  return undefined; // unknown/corrupt schema — fall back to store defaults
}
