import type { Action } from "svelte/action";

/**
 * Custom action/directive used to create menu-popups with click-outside behavior.
 * - Registers a window-level click listener, does a little DOM check, and
 *    invokes the callback if necessary.
 * - Registers a window-level keyup listener to dismiss on ESC-key as well.
 */
export const clickOutside: Action<HTMLElement, (() => void) | undefined> = (
  node,
  onOutclick
) => {
  const handleGlobalClick = (evt: Event) => {
    if (evt.target instanceof Node && evt.target instanceof Element) {
      if (!node.contains(evt.target)) {
        onOutclick?.();
      }

      // Stop event propagation when action button is pressed
      if (
        node.closest(".action_button_popup") !==
          evt.target.closest(".action_button_popup") &&
        node.closest(".action_button") === evt.target.closest(".action_button")
      ) {
        evt.stopPropagation();
      }
    }
  };
  document.addEventListener("click", handleGlobalClick, true);

  // Handle esc-key as well
  const handleEsc = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      onOutclick?.();
    }
  };
  document.addEventListener("keyup", handleEsc, true);

  return {
    update(next) {
      onOutclick = next;
    },
    destroy() {
      document.removeEventListener("click", handleGlobalClick, true);
      document.removeEventListener("keyup", handleEsc, true);
    },
  };
};
