<script lang="ts">
  export let name: string;
  export let title: string;
  export let value: unknown;
  export let options: { title: string; value: unknown }[];
  export let isDisabled = false;
</script>

<div>
  <label for={name} class="block text-sm font-medium text-gray-700">
    {title}
  </label>
  <select
    id={name}
    {name}
    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
    bind:value
    disabled={isDisabled}
  >
    {#each options as op}
      <option value={op.value}>{op.title}</option>
    {/each}
  </select>
</div>
