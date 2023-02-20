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
  import RecordingOptionsBar from "./RecordingOptionsBar.svelte";

  const dispatch = createEventDispatcher();

  const handleAddScreenShare = () => {
    $screenShareState.shares.push({ width: 0, height: 0 });
    $screenShareState.shares = $screenShareState.shares;
    // $screenShareState.shares = $screenShareState.shares;
  };
</script>

<div class="grid grid-cols-[auto_auto_1fr_auto] gap-x-4 gap-y-10 items-center pb-4">
  <div class="flex gap-2">
    <div class="w-12">
      <MicButton />
    </div>
    <div class="w-12">
      <WebcamButton />
    </div>
  </div>

  <div class="w-[1px] h-16 bg-fmd-gray_darker dark:bg-fmd-blue" />

  <div class="flex gap-3 items-center">
    <!-- Existing screen shares -->
    {#each $screenShareState.shares as share}
      <ShareButton {share} />
    {/each}

    <div class="w-20 h-14">
      <ActionButton
        on:click={handleAddScreenShare}
        extraClasses="p-2.5"
        isSquareVariant
      >
        <div class="w-10">
          <DesktopIcon />
        </div>
      </ActionButton>
    </div>
  </div>

  <!-- Recording button -->
  <div class="flex justify-end items-center gap-2">
    {#if $recordingDuration !== null}
      <div
        class="w-[100px] bg-white rounded px-3 py-1 shadow flex justify-center items-center font-medium text-lg text-gray-600"
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

  <RecordingOptionsBar />
</div>
