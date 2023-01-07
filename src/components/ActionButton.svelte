<script lang="ts">
  import { fade } from "svelte/transition";
  import { clickOutside } from "../directives/clickOutside";
  import { createEventDispatcher } from "svelte";

  export let isActive: boolean = false;
  export let isPopupOpen: boolean = false;
  export let extraClasses = "";
  export let isVideo: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<div class="relative action_button {isVideo ? 'h-full' : ''}">
  {#if isPopupOpen}
    <div
      class="w-[256px] absolute bg-white bottom-14 -left-[104px] rounded shadow-xl action_button_popup"
      use:clickOutside
      on:outclick={() => dispatch("popupDismiss")}
    >
      <slot name="popupContent" />
    </div>
  {/if}

  <button
    class="border border-fmd-gray_darker w-full green text-fmd-gray_darker hover:border-fmd-yellow hover:text-fmd-black flex items-center justify-center p-1.5 hover:bg-fmd-yellow transition transition-all duration-150  {extraClasses} {isActive
      ? 'bg-fmd-red border-fmd-red text-fmd-white text-fmd-black'
      : ''} {isVideo ? 'h-full rounded' : 'rounded-full aspect-square'}"
    on:click
  >
    <slot />
  </button>
</div>
