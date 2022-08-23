

type AccordionOptions = {
isOpen: boolean;
duration?: number;
}

export function accordion(node: HTMLDivElement, { isOpen } : AccordionOptions) {
  let initialHeight = node.offsetHeight;
  node.style.height = isOpen ? 'auto' : '0';
  node.style.overflow = "hidden";

  return {
    update({ isOpen, duration }: AccordionOptions) {
      let animation = node.animate(
        [
          {
            height: initialHeight + 'px',
            overflow: 'hidden'
          },
          {
            height: 0,
            overflow: 'hidden'
          }
        ],
        { duration, fill: 'both' }
      );
      animation.pause();
      if (!isOpen) {
        animation.play();
      } else {
        animation.reverse();
      }
    }
  };
}
