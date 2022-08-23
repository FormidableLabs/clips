export const clickOutside = (node: HTMLElement) => {
  const handleGlobalClick = (evt: Event) => {
    if (evt.target instanceof Node && evt.target instanceof Element) {
      if (!node.contains(evt.target)) {
        node.dispatchEvent(new CustomEvent("outclick"));
      }

      if (
        node.closest(".action_button") === evt.target.closest(".action_button")
      ) {
        evt.stopPropagation();
      }
    }
  };

  document.addEventListener("click", handleGlobalClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleGlobalClick, true);
    },
  };
};
