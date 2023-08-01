<script lang="ts">
  import InputLabel from "./InputLabel.svelte";
  import clsx from "clsx";

  export let name: string;
  export let title: string;
  export let value: unknown;
  export let isDisabled: boolean;
  export let options: { title: string; value: unknown; ariaLabel?: string }[];
</script>

<div class={isDisabled ? "pointer-events-none": ""}>
  <InputLabel {name}>{title}</InputLabel>
  <div
    class="select-parent"
    style="grid-template-columns: repeat({options.length}, 1fr);"
  >
    {#each options as op, i}
      <div class={clsx("select-child-wrapper", i !== 0 && "not-first")}>
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
          aria-label={op.ariaLabel || op.title}
          class={clsx(
            "block pt-3 pb-2",
            "transition-default",
            "peer-hover:cursor-pointer peer-hover:text-fmd-red-600 dark:peer-hover:text-fmd-white dark:peer-hover:underline",
            "peer-checked:text-fmd-red-600 dark:peer-checked:text-fmd-white"
          )}
        >
          {op.title}
        </label>
        <div class="select-child-overlay" />
      </div>
    {/each}
  </div>
</div>
