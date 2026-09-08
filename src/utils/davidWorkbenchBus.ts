export type DavidIntentPriority = 'standard' | 'heavy';

export interface DavidWorkbenchIntent {
  id?: string;
  source: string;
  label: string;
  summary?: string;
  changes?: unknown;
  priority?: DavidIntentPriority;
  /**
   * If true, the originating section has finished its local editing pass and
   * explicitly asked DAVID to integrate the staged changes into MAIN PROMPT.
   */
  committed?: boolean;
  createdAt?: number;
}

export const DAVID_WORKBENCH_INTENT_EVENT = 'david:workbench-intent';

export function dispatchDavidIntent(intent: DavidWorkbenchIntent) {
  if (typeof window === 'undefined') return;
  const normalized: DavidWorkbenchIntent = {
    ...intent,
    id: intent.id || `intent-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    priority: intent.priority || 'standard',
    committed: intent.committed !== false,
    createdAt: intent.createdAt || Date.now(),
  };
  window.dispatchEvent(
    new CustomEvent<DavidWorkbenchIntent>(DAVID_WORKBENCH_INTENT_EVENT, {
      detail: normalized,
    })
  );
}

export function subscribeDavidIntents(handler: (intent: DavidWorkbenchIntent) => void) {
  if (typeof window === 'undefined') return () => undefined;
  const listener = (event: Event) => {
    const custom = event as CustomEvent<DavidWorkbenchIntent>;
    if (!custom.detail) return;
    handler(custom.detail);
  };
  window.addEventListener(DAVID_WORKBENCH_INTENT_EVENT, listener);
  return () => window.removeEventListener(DAVID_WORKBENCH_INTENT_EVENT, listener);
}
