<script lang="ts">
  export let name: string;
  export let placeholder: string;
  export let title: string;
  export let value: string | number;
  export let isDisabled = false;
</script>

<div>
  <label for={name} class="block text-sm font-medium text-gray-700">
    {title}
  </label>
  <div class="mt-1">
    <input
      type="number"
      {name}
      id={name}
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md {isDisabled
        ? 'opacity-30'
        : ''}"
      {placeholder}
      bind:value
      disabled={isDisabled}
    />
  </div>
</div>
