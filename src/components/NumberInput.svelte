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
  <div class="mt-1">
    <input
      type="number"
      {name}
      {min}
      {max}
      {step}
      id={name}
      class="shadow-sm focus:ring-fmd-blue focus:border-fmd-blue block w-full sm:text-sm border-fmd-gray rounded-md bg-fmd-gray border-2 border-fmd-blue {isDisabled
        ? 'opacity-30'
        : ''}"
      {placeholder}
      bind:value
      disabled={isDisabled}
    />
  </div>
</div>
