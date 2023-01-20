<script lang="ts">
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let title: string;
  export let value: unknown;
  export let options: { title: string; value: unknown }[];
  export let isDisabled = false;
  export let isDropdown = true;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  {#if isDropdown}
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
  {:else}
    <div
      class="grid grid-cols-{options.length} justify-items-center border-fmd-gray_darker border-[1px] rounded mt-2"
    >
      {#each options as op, i}
        <div
          class="block {i !== 0 &&
            'border-l-[1px] border-fmd-gray_darker'} w-full text-center"
        >
          <input
            class="hidden peer"
            type="radio"
            bind:group={value}
            value={op.value}
            id={op.title}
            {name}
          />
          <label
            for={op.title}
            class="block transition transition-all duration-150 py-2 peer-checked:bg-fmd-blue peer-checked:text-fmd-white peer-hover:bg-fmd-yellow peer-hover:cursor-pointer peer-checked:peer-hover:bg-fmd-blue"
          >
            {op.title}
          </label>
        </div>
      {/each}
    </div>
  {/if}
</div>
