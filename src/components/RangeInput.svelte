<script lang="ts">
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let title: string;
  export let value: number;
  export let isDisabled = false;
  export let min = 0;
  export let max = 1;
  export let step = 0.05;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <div class="mt-1 grid grid-cols-[1fr_auto] gap-3 items-center">
    <input
      type="range"
      {name}
      id={name}
      class="focus:ring-fmd-blue focus:border-fmd-blue block w-full sm:text-sm border-fmd-gray rounded-md bg-transparent border-2 border-fmd-blue {isDisabled
        ? 'opacity-30'
        : ''}"
      bind:value
      disabled={isDisabled}
      {min}
      {max}
      {step}
    />
    <div class="text-xs dark:text-white">
      {Math.floor((value / max) * 100)}%
    </div>
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
    border: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    border-radius: 10px;
    cursor: pointer;
    background: #ffc851b2;
  }
  input[type="range"]::-webkit-slider-thumb {
    border: none;
    height: 15px;
    width: 15px;
    border-radius: 15px;
    background: #f04d21;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #ffc851b2;
  }
  input[type="range"]::-moz-range-track {
    width: 100%;
    height: 4px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: none;
    background: #ffc851b2;
  }
  input[type="range"]::-moz-range-thumb {
    box-shadow: none;
    border: none;
    height: 15px;
    width: 15px;
    border-radius: 15px;
    background: #f04d21;
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      border-radius: 10px;
      cursor: pointer;
      background: #fff;
    }
    input[type="range"]:focus::-webkit-slider-runnable-track {
      background: #fff;
    }
    input[type="range"]::-moz-range-track {
      width: 100%;
      height: 4px;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: none;
      background: #fff;
    }
  }
</style>
