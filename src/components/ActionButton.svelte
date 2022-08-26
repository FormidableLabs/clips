<script lang="ts">
  import { fade } from "svelte/transition";
  import { clickOutside } from "../directives/clickOutside";
  import { createEventDispatcher } from "svelte";

  export let isActive: boolean = false;
  export let isPopupOpen: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<div class="relative action_button">
  {#if isPopupOpen}
    <div
      class="w-64 absolute bg-white bottom-14 -left-24 rounded shadow-xl action_button_popup"
      transition:fade={{ duration: 150 }}
      use:clickOutside
      on:outclick={() => dispatch("popupDismiss")}
    >
      <slot name="popupContent" />
    </div>
  {/if}

  <button
    class="border border-fmd-gray_darker rounded-full w-full aspect-square flex items-center justify-center p-1.5 hover:bg-fmd-yellow hover:shadow transition transition-colors transition-shadow duration-200 ease-in-out {isActive
      ? 'bg-fmd-yellow'
      : ''}"
    on:click
  >
    <slot />
  </button>
</div>
