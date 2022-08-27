<script lang="ts">
  import ChevronRightIcon from "./icons/chevronRight.icon.svelte";
  import {
    HorizAlign,
    VertAlign,
    horizontalAlignmentOptions,
    verticalAlignmentOptions,
  } from "../stores";

  export let horizAlign: HorizAlign = HorizAlign.left;
  export let vertAlign: VertAlign = VertAlign.bottom;

  const getRotation = (h: HorizAlign, v: VertAlign) => {
    const deg =
      {
        "left/top": 225,
        "center/top": 270,
        "right/top": 315,
        "right/center": 0,
        "right/bottom": 45,
        "center/bottom": 90,
        "left/bottom": 135,
        "left/center": 180,
      }[`${h}/${v}`] || 0;

    return `${deg}deg`;
  };
</script>

<div
  class="grid grid-cols-3 grid-rows-3 w-full border border-fmd-gray_darker rounded overflow-hidden"
>
  {#each verticalAlignmentOptions as vertOp}
    {#each horizontalAlignmentOptions as horOp}
      <button
        class="h-6 rounded-sm border-fmd-gray_darker text-xs overflow-hidden hover:bg-fmd-yellow transition transition-colors duration-100 ease-in-out flex justify-center items-center {horizAlign ===
          horOp && vertAlign === vertOp
          ? 'bg-fmd-yellow'
          : 'bg-fmd-gray'}"
        on:click={() => {
          horizAlign = horOp;
          vertAlign = vertOp;
        }}
        aria-label="align {horOp} horizontally, {vertOp} vertically"
      >
        {#if !(horOp === HorizAlign.center && vertOp === VertAlign.center)}
          <div
            class="w-4"
            style="transform: rotate({getRotation(horOp, vertOp)})"
          >
            <ChevronRightIcon />
          </div>
        {/if}
      </button>
    {/each}
  {/each}
</div>
