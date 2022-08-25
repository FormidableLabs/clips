<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import ShareButton from "./ShareButton.svelte";
  import WebcamButton from "./WebcamButton.svelte";
  import MicButton from "./MicButton.svelte";
  import { isRecording, recordingDuration } from "../stores.js";

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex-shrink-0 rounded bg-gray-200 p-3 flex justify-center items-center"
>
  <div
    class="gap-4 grid grid-cols-[repeat(2,50px)_70px_repeat(2,50px)] items-center"
  >
    <div />
    <ShareButton />

    <!-- Recording button -->
    <div class="relative">
      {#if $recordingDuration !== null}
        <div
          class="absolute w-[100px] -left-[15px] bg-white bottom-[75px] rounded px-3 py-1 shadow flex justify-center items-center font-medium text-lg text-gray-600"
          transition:fade={{ duration: 300 }}
        >
          {$recordingDuration}
        </div>
      {/if}
      <button
        class="w-full aspect-square shadow rounded-full cursor-pointer border-4 border-gray-500 p-1 flex items-center justify-center group"
        on:click={() => {
          dispatch("record");
        }}
      >
        <div
          class="bg-red-500 transition transition-all duration-300 ease-in-out {$isRecording
            ? 'w-1/2 h-1/2 rounded-lg group-hover:shadow-xl'
            : 'w-full h-full rounded-[100%]'}"
        />
      </button>
    </div>

    <WebcamButton />
    <MicButton />
  </div>
</div>
