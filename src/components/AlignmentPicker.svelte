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
        class="h-6 rounded-sm text-xs overflow-hidden {horizAlign === horOp &&
        vertAlign === vertOp
          ? 'bg-fmd-yellow'
          : 'bg-fmd-gray_darker'}"
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
