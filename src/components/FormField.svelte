<script lang="ts">
  export let name: string;
  export let placeholder: string;
  export let title: string;
  export let value: string | number;
  export let isDisabled = false;
</script>

<div>
  <label for={name} class="block text-sm font-medium text-fmd-navy">
    {title}
  </label>
  <div class="mt-1">
    <input
      type="number"
      {name}
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
