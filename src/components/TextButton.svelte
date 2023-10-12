<script lang="ts">
  import clsx from "clsx";
  import CheckIcon from "./icons/check.icon.svelte";
  import StopIcon from "./icons/stop.icon.svelte";

  export let extraClasses: string = "";
  export let isDisabled = false;
  export let hasCheck = false;
  export let hasClose = false;
</script>

<button
  on:click
  class={clsx(
    "flex items-center justify-between gap-1",
    "rounded px-3 py-2 text-left transition-default border border-transparent",
    isDisabled
      ? "bg-opacity-30"
      : "hover:bg-fmd-red-background hover:border-fmd-red-600 dark:hover:bg-fmd-navy",
    extraClasses
  )}
  disabled={isDisabled}
>
  <div class="flex-grow">
    <slot />
  </div>

  {#if hasCheck || hasClose}
    <span class="w-6 flex-shrink-0 dark:fill-white">
      <svelte:component this={hasCheck ? CheckIcon : StopIcon} />
    </span>
  {/if}
</button>
