<script lang="ts">
  import InputLabel from "./InputLabel.svelte";
  import clsx from "clsx";

  export let name: string;
  export let title: string;
  export let value: unknown;
  export let options: { title: string; value: unknown; ariaLabel?: string }[];
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <div
    class={clsx(
      "grid justify-items-center mt-2 overflow-hidden",
      "dark:text-fmd-white",
      "border border-fmd-gray dark:border-fmd-white/20 rounded bg-fmd-white dark:bg-fmd-navy"
    )}
    style="grid-template-columns: repeat({options.length}, 1fr);"
  >
    {#each options as op, i}
      <div
        class={clsx(
          "block relative w-full text-center",
          i !== 0 && "border-l border-fmd-gray dark:border-fmd-white/20"
        )}
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
          aria-label={op.ariaLabel || op.title}
          class={clsx(
            "block pt-3 pb-2",
            "transition transition-all duration-100",
            "peer-hover:cursor-pointer peer-hover:text-fmd-red-600 dark:peer-hover:text-fmd-white dark:peer-hover:underline",
            "peer-checked:border-fmd-red/5 peer-checked:text-fmd-red-600 peer-checked:bg-fmd-red-background dark:peer-checked:bg-fmd-white-background dark:peer-checked:text-fmd-white"
          )}
        >
          {op.title}
        </label>
        <div
          class={clsx(
            "transition transition-all duration-100",
            "absolute top-0 left-0 h-full w-full pointer-events-none",
            "border border-transparent",
            "peer-checked:border-fmd-red dark:peer-checked:border-fmd-white"
          )}
        />
      </div>
    {/each}
  </div>
</div>
