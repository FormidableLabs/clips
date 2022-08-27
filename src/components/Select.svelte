<script lang="ts">
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let title: string;
  export let value: unknown;
  export let options: { title: string; value: unknown }[];
  export let isDisabled = false;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <select
    id={name}
    {name}
    class="bg-fmd-gray border-fmd-blue border-2 mt-1 block w-full pl-3 pr-10 py-2 text-base border-fmd-gray focus:outline-none focus:ring-fmd-blue focus:border-fmd-blue sm:text-sm rounded-md"
    bind:value
    disabled={isDisabled}
  >
    {#each options as op}
      <option value={op.value}>{op.title}</option>
    {/each}
  </select>
</div>
