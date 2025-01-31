<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import type { Share } from "../stores";
  import DesktopIcon from "./icons/desktop.icon.svelte";
  import ShareButton from "./ShareButton.svelte";
  import WebcamButton from "./WebcamButton.svelte";
  import MicButton from "./MicButton.svelte";
  import newUniqueId from "locally-unique-id-generator";
  import {
    isRecording,
    recordingDuration,
    screenShareState,
  } from "../stores.js";
  import ActionButton from "./ActionButton.svelte";
  import RecordingOptionsBar from "./RecordingOptionsBar.svelte";

  const dispatch = createEventDispatcher();
  let shares:Share[]=[];

  const handleAddScreenShare = () => {
    $screenShareState.shares.push({ width: 0, height: 0,id:newUniqueId() });
    $screenShareState.shares = $screenShareState.shares;
  };
  $:{
    shares = [...$screenShareState.shares];
  }
</script>

<div class="grid grid-cols-[auto_auto_1fr_auto] gap-x-4 gap-y-10 items-center pb-4">
  <div class="flex gap-2">
    <div class="w-14 h-14">
      <MicButton />
    </div>
    <div class="w-14 h-14">
      <WebcamButton />
    </div>
  </div>

  <div class="w-px h-16 bg-fmd-gray dark:bg-fmd-blue" />

  <div class="flex gap-3 items-center">
    <!-- Existing screen shares -->
    {#each shares as share,index (share.id)}
      <ShareButton share={share} {index}/>
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
        class="w-24 bg-white rounded px-3 py-1 shadow flex justify-center items-center font-medium text-lg text-gray-600"
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
        class="bg-fmd-red transition-all duration-300 ease-in-out {$isRecording
          ? 'w-1/2 h-1/2 rounded-lg group-hover:shadow-xl'
          : 'w-full h-full rounded-full'}"
      />
    </button>
  </div>

  <RecordingOptionsBar />
</div>
