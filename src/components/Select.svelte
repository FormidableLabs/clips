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
      "border border-fmd-gray dark:border-fmd-blue rounded bg-fmd-white dark:bg-fmd-navy"
    )}
    style="grid-template-columns: repeat({options.length}, 1fr);"
  >
    {#each options as op, i}
      <div
        class={clsx(
          "block relative w-full text-center",
          i !== 0 && "border-l border-fmd-gray dark:border-fmd-blue"
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
            "transition transition-all duration-150",
            "peer-hover:cursor-pointer peer-hover:text-fmd-red-600 ",
            "peer-checked:border-fmd-red/5 peer-checked:text-fmd-red-600 peer-checked:bg-fmd-red-background"
          )}
        >
          {op.title}
        </label>
        <div
          class={clsx(
            "transition transition-all duration-150",
            "absolute top-0 left-0 h-full w-full pointer-events-none",
            "border border-transparent peer-checked:border-fmd-red"
          )}
        />
      </div>
    {/each}
  </div>
</div>
