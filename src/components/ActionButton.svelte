<script lang="ts">
  import { clickOutside } from "../directives/clickOutside";
  import { createEventDispatcher } from "svelte";

  export let isActive = false;
  export let isPopupOpen = false;
  export let extraClasses = "";
  export let isSquareVariant = false;
  export let isTextVariant = false;
  export let showPopupUnder = false;
  export let rightAlignPopup = false;
  export let isDisabled = false;

  const dispatch = createEventDispatcher();
</script>

<div class="relative action_button {isSquareVariant ? 'h-full' : ''}">
  {#if isPopupOpen}
    <div
      class="w-[256px] absolute bg-white dark:bg-transparent {showPopupUnder
        ? 'top-8'
        : 'bottom-20'} {rightAlignPopup
        ? '-right-2'
        : '-left-2'} rounded shadow-xl action_button_popup z-10"
      use:clickOutside
      on:outclick={() => dispatch("popupDismiss")}
    >
      <slot name="popupContent" />
    </div>
  {/if}

  <button
    class="w-full green flex items-center p-1.5 transition transition-all duration-150 dark:text-fmd-white dark:border-fmd-blue {extraClasses} {isSquareVariant
      ? 'h-full rounded'
      : 'rounded-full aspect-square'}
      {isTextVariant
      ? 'text-black hover:bg-fmd-yellow justify-start'
      : 'text-fmd-gray_darker border border-fmd-gray_darker justify-center'} {isDisabled
      ? 'opacity-50'
      : 'dark:hover:text-fmd-white hover:text-fmd-black dark:hover:bg-fmd-blue'} {!isTextVariant &&
      !isDisabled &&
      'hover:bg-fmd-yellow'}"
    on:click
    disabled={isDisabled}
  >
    <slot />
  </button>

  {#if isActive}<div
      class="w-1.5 h-1.5 bg-fmd-red rounded-full absolute left-0 right-0 m-auto -bottom-3"
    />{/if}
</div>
