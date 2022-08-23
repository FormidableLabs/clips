<script lang="ts">
  import { fade } from "svelte/transition";
  import { clickOutside } from "../directives/clickOutside";
  import { createEventDispatcher } from "svelte";

  export let isActive: boolean = false;
  export let hasPopupContent: boolean = false;

  let isModalActive = false;
  const dispatch = createEventDispatcher();

  const handleClick = () => {
    if (isActive) {
      dispatch("deactivate");
    } else if (hasPopupContent) {
      isModalActive = !isModalActive;
    } else {
      dispatch("activate");
    }
  };
</script>

<div class="relative action_button">
  {#if isModalActive && hasPopupContent}
    <div
      class="w-64 absolute bg-white bottom-14 -left-24 rounded shadow-xl"
      transition:fade={{ duration: 150 }}
      use:clickOutside
      on:outclick={() => (isModalActive = false)}
    >
      <slot name="popupContent" />
    </div>
  {/if}
  <button
    class="border rounded-full aspect-square h-12 flex items-center justify-center p-1 {isActive
      ? 'bg-primary-600'
      : ''}"
    on:click={handleClick}
  >
    <slot />
  </button>
</div>
