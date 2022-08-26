<script lang="ts">
  export let name: string;
  export let title: string;
  export let value: string | number;
  export let isDisabled = false;
  export let min = 0;
  export let max = 1;
  export let step = 0.05;
</script>

<div>
  <label for={name} class="block text-sm font-medium text-fmd-navy">
    {title}
  </label>
  <div class="mt-1">
    <input
      type="range"
      {name}
      id={name}
      class="shadow-sm focus:ring-fmd-blue focus:border-fmd-blue block w-full sm:text-sm border-fmd-gray rounded-md bg-fmd-gray border-2 border-fmd-blue {isDisabled
        ? 'opacity-30'
        : ''}"
      bind:value
      disabled={isDisabled}
      {min}
      {max}
      {step}
    />
  </div>
</div>
