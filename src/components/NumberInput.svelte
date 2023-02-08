<script lang="ts">
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let placeholder = "";
  export let title: string;
  export let value: string | number;
  export let isDisabled = false;
  export let min = 0;
  export let max = 1;
  export let step = 0.02;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <div class="mt-1 grid grid-cols-[1fr_auto_auto] bg-fmd-white overflow-hidden">
    <input
      type="number"
      {name}
      {min}
      {max}
      {step}
      id={name}
      class="focus:ring-0 focus:border-fmd-red hover:border-b-fmd-yellow focus:border-r-fmd-gray block w-full sm:text-sm -md bg-transparent border-0 border-r-[1px] border-b-2 border-b-transparent border-r-fmd-gray transition transition-border {isDisabled
        ? 'opacity-30'
        : ''}"
      {placeholder}
      bind:value
      disabled={isDisabled}
    />
    <button
      class="h-full px-3 bg-transparent hover:bg-fmd-yellow border-r-[1px] border-fmd-gray transition transition-bg"
      on:click={() =>
        (value = value
          ? Number.parseFloat((Number(value) + step).toFixed(2))
          : (0 + step).toFixed(2))}>+</button
    >
    <button
      class="h-full px-3 bg-transparent hover:bg-fmd-yellow transition transition-bg"
      on:click={() =>
        (value = value
          ? Number.parseFloat((Number(value) - step).toFixed(2))
          : (0 - step).toFixed(2))}>&#8211;</button
    >
  </div>
</div>

<style>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
