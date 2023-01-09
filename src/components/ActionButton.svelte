<script lang="ts">
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
      class="w-[256px] absolute bg-white bottom-20 -left-2 rounded shadow-xl action_button_popup"
      use:clickOutside
      on:outclick={() => dispatch("popupDismiss")}
    >
      <slot name="popupContent" />
    </div>
  {/if}

  <button
    class="border border-fmd-gray_darker w-full green text-fmd-gray_darker hover:text-fmd-black flex items-center justify-center p-1.5 hover:bg-fmd-yellow transition transition-all duration-150  {extraClasses} {isVideo
      ? 'h-full rounded'
      : 'rounded-full aspect-square'}"
    on:click
  >
    <slot />
  </button>

  {#if isActive}<div class="w-1.5 h-1.5 bg-fmd-red rounded-full absolute left-0 right-0 m-auto -bottom-3" />{/if}
</div>
