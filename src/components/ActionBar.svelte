<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import DesktopIcon from "./icons/desktop.icon.svelte";
  import ShareButton from "./ShareButton.svelte";
  import WebcamButton from "./WebcamButton.svelte";
  import MicButton from "./MicButton.svelte";
  import {
    isRecording,
    recordingDuration,
    screenShareState,
  } from "../stores.js";
  import ActionButton from "./ActionButton.svelte";

  const dispatch = createEventDispatcher();

  const handleAddScreenShare = () => {
    $screenShareState.shares.push({ width: 0, height: 0 });
    $screenShareState.shares = $screenShareState.shares;
    // $screenShareState.shares = $screenShareState.shares;
  };
</script>

<div
  class="flex-shrink-0 rounded bg-fmd-gray p-3 flex justify-center items-center gap-3"
>
  <div class="w-12">
    <MicButton />
  </div>
  <div class="w-12">
    <WebcamButton />
  </div>

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
      class="w-16 h-16 aspect-square shadow rounded-full cursor-pointer border-4 border-gray-500 p-1 flex items-center justify-center group"
      on:click={() => {
        dispatch("record");
      }}
    >
      <div
        class="bg-fmd-red transition transition-all duration-300 ease-in-out {$isRecording
          ? 'w-1/2 h-1/2 rounded-lg group-hover:shadow-xl'
          : 'w-full h-full rounded-[100%]'}"
      />
    </button>
  </div>

  <!-- Existing screen shares -->
  {#each $screenShareState.shares as share}
    <div class="w-12">
      <ShareButton {share} />
    </div>
  {/each}

  <div class="w-12">
    <ActionButton on:click={handleAddScreenShare} extraClasses="p-2.5">
      <DesktopIcon />
    </ActionButton>
  </div>
</div>
