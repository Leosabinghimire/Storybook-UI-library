import { useEffect, type RefObject } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab focus inside the container while active, moves focus into it on open and restores the
 * previously focused element on close. Elements with `data-autofocus` get initial focus.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    const initial = container.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? container;
    initial.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [ref, active]);
}
