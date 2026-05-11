import { useEffect, useState } from "react";

import {
  UPDATE_REQUIRED_EVENT,
  type UpdateRequiredDetail,
} from "@/lib/updateRequired";

interface UseUpdateRequiredState {
  /** True once any subsystem has raised the Update Required event. */
  open: boolean;
  /** Reason of the first event that opened the dialog (for telemetry). */
  reason: UpdateRequiredDetail["reason"] | null;
}

/**
 * Subscribe to the global `hush:update-required` event.
 *
 * The dialog is non-dismissible: once `open` flips true it never flips back.
 * Repeated events are folded into the first reason so the user sees a single
 * stable dialog regardless of how many subsystems flagged the upgrade.
 */
export function useUpdateRequired(): UseUpdateRequiredState {
  const [state, setState] = useState<UseUpdateRequiredState>({
    open: false,
    reason: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onUpdate(ev: Event) {
      const detail = (ev as CustomEvent<UpdateRequiredDetail>).detail;
      setState((prev) =>
        prev.open ? prev : { open: true, reason: detail?.reason ?? null },
      );
    }

    window.addEventListener(UPDATE_REQUIRED_EVENT, onUpdate);
    return () => window.removeEventListener(UPDATE_REQUIRED_EVENT, onUpdate);
  }, []);

  return state;
}
