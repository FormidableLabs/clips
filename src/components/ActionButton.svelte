<script lang="ts">
  import clsx from "clsx";
  import { clickOutside } from "../directives/clickOutside";
  import { createEventDispatcher } from "svelte";

  export let isActive: boolean = false;
  export let isPopupOpen: boolean = false;
  export let extraClasses = "";
  export let isSquareVariant: boolean = true;
  export let isTextVariant: boolean = false;
  export let showPopupUnder: boolean = false;
  export let rightAlignPopup: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<div class="relative action_button h-full group">
  {#if isPopupOpen}
    <div
      class="w-64 z-20 absolute bg-white dark:bg-transparent {showPopupUnder
        ? 'top-8'
        : 'bottom-20'} {rightAlignPopup
        ? '-right-2'
        : '-left-2'} rounded shadow-xl action_button_popup z-20"
      use:clickOutside
      on:outclick={() => dispatch("popupDismiss")}
    >
      <slot name="popupContent" />
    </div>
  {/if}

  <button
    class={clsx(
      "w-full flex items-center p-1.5 dark:border-fmd-white/20 dark:hover:bg-fmd-white-background",
      "hover:text-fmd-red dark:text-fmd-white dark:hover:text-fmd-white dark:hover:border-fmd-white",
      "transition transition-all duration-100",
      extraClasses,
      isSquareVariant ? "h-full rounded" : "rounded-full aspect-square",
      isTextVariant
        ? "text-black hover:bg-fmd-white-background justify-start dark:hover:underline"
        : "text-fmd-gray-600 border border-fmd-gray hover:bg-fmd-red-background justify-center"
    )}
    on:click
  >
    <slot />
  </button>

</div>
