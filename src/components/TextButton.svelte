<script lang="ts">
  import CheckIcon from "./icons/check.icon.svelte";
  import CloseIcon from "./icons/close.icon.svelte";

  export let extraClasses: string = "";
  export let isDisabled = false;
  export let hasCheck = false;
  export let hasClose = false;
</script>

<button
  on:click
  class="rounded {isDisabled
    ? 'bg-opacity-30'
    : 'hover:bg-fmd-yellow'} px-3 py-2 text-left transition transition-colors duration-150 ease-in-out flex items-center justify-between gap-1 {extraClasses}"
  disabled={isDisabled}
>
  <div class="flex-grow">
    <slot />
  </div>

  {#if hasCheck || hasClose}
    <span class="w-6 flex-shrink-0">
      <svelte:component this={hasCheck ? CheckIcon : CloseIcon} />
    </span>
  {/if}
</button>
