<script lang="ts">
  import {
    HorizAlign,
    VertAlign,
    horizontalAlignmentOptions,
    verticalAlignmentOptions,
  } from "../stores";

  export let horizAlign: HorizAlign = HorizAlign.left;
  export let vertAlign: VertAlign = VertAlign.bottom;

  const DOT_SIZE = 14;
</script>

<div
  class="grid grid-cols-3 grid-rows-3 py-1 w-full border border-fmd-gray overflow-hidden rounded dark:border-fmd-blue"
>
  {#each verticalAlignmentOptions as vertOp}
    {#each horizontalAlignmentOptions as horOp}
      <button
        class="h-6 py-4 border-fmd-gray_darker text-xs overflow-hidden hover:fill-fmd-yellow dark:hover:fill-fmd-sky transition transition-colors duration-100 ease-in-out flex justify-center items-center {horizAlign ===
          horOp && vertAlign === vertOp
          ? 'fill-fmd-red'
          : 'fill-fmd-gray_darker/30 dark:fill-fmd-sky/10'}"
        on:click={() => {
          horizAlign = horOp;
          vertAlign = vertOp;
        }}
        aria-label="align {horOp} horizontally, {vertOp} vertically"
      >
        <svg height={DOT_SIZE} width={DOT_SIZE}>
          <circle cx={DOT_SIZE / 2} cy={DOT_SIZE / 2} r={DOT_SIZE / 2} />
        </svg>
      </button>
    {/each}
  {/each}
</div>
