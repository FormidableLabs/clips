<script lang="ts">
  import {
    HorizAlign,
    VertAlign,
    horizontalAlignmentOptions,
    verticalAlignmentOptions,
  } from "../stores";

  export let horizAlign: HorizAlign = HorizAlign.left;
  export let vertAlign: VertAlign = VertAlign.bottom;
</script>

<div class="grid grid-cols-3 grid-rows-3 gap-1 w-full">
  {#each verticalAlignmentOptions as vertOp}
    {#each horizontalAlignmentOptions as horOp}
      <button
        class="h-6 rounded-sm border-fmd-gray_darker border text-xs overflow-hidden hover:bg-fmd-yellow transition transition-colors duration-100 ease-in-out {horizAlign ===
          horOp && vertAlign === vertOp
          ? 'bg-fmd-yellow'
          : 'bg-fmd-gray'}"
        on:click={() => {
          horizAlign = horOp;
          vertAlign = vertOp;
        }}
      >
        {horOp}/{vertOp}
      </button>
    {/each}
  {/each}
</div>
