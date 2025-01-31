<script lang="ts">
  import clsx from "clsx";
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let title: string;
  export let value: number;
  export let isDisabled = false;
  export let showPercentage = true;
  export let min = 0;
  export let max = 1;
  export let step = 0.05;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <div
    class={clsx(
      "mt-1",
      showPercentage && "grid grid-cols-[1fr_32px] gap-3 items-center"
    )}
  >
    <div class="relative flex items-center">
      <input
        type="range"
        {name}
        id={name}
        class={clsx(
          "z-20 block border-fmd-gray rounded-md bg-transparent appearance-none my-2.5 w-full border-0",
          isDisabled ? "opacity-30" : ""
        )}
        bind:value
        disabled={isDisabled}
        {min}
        {max}
        {step}
      />
      <div
        class="absolute left-0 h-1 bg-fmd-red z-10"
        style={`width: ${Math.ceil((value / max) * 100)}%`}
      />
      <div class="absolute left-0 h-1 w-full bg-fmd-red/20 dark:bg-fmd-white/30 z-0" />
    </div>
    {#if showPercentage}
      <div class="text-xs dark:text-white text-right">
        {Math.floor((value / max) * 100)}%
      </div>
    {/if}
  </div>
</div>

<style>
  input[type="range"]::-webkit-slider-thumb {
    border: 2px solid #f04d21;
    height: 14px;
    width: 14px;
    border-radius: 100%;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
  }

  input[type="range"]::-moz-range-thumb {
    border: 2px solid #f04d21;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: #ffffff;
    cursor: pointer;
  }
</style>
