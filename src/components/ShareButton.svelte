<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import type { ScreenShareState } from "../stores";
  import { activeShare, screenShareState } from "../stores.js";
  import { onMount } from "svelte";
  import LoadingDots from "./icons/loadingDots.icon.svelte";
  import CloseIcon from "./icons/close.icon.svelte";

  export let share: ScreenShareState["shares"][number];

  let preview: HTMLVideoElement;

  onMount(async () => {
    try {
      share.stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      share.preview.srcObject = share.stream;
      grabDimensions();
      share.stream.getVideoTracks()[0].onended = stopSharing;
    } catch {
      removeShare();
    }
  });

  const removeShare = () => {
    $screenShareState.shares = $screenShareState.shares.filter(
      (s) => s !== share
    );
  };

  const stopSharing = () => {
    if (share.preview) share.preview.srcObject = null;
    if (share.stream) {
      share.stream.getTracks().forEach((track) => track.stop());
      share.stream = null;
    }
    removeShare();
  };

  const grabDimensions = () => {
    const { videoWidth, videoHeight } = share.preview;
    share.width = videoWidth;
    share.height = videoHeight;
  };

  const makeActive = () => {
    $screenShareState.activeIndex = $screenShareState.shares.indexOf(share);
  };

  $: {
    if (preview && share.stream) {
      preview.srcObject = share.stream;
    }
  }
</script>

<div class="w-20 h-14 relative">
  <ActionButton isActive={share === $activeShare} isVideo on:click={makeActive}>
    <video
      class="invisible absolute top-0 left-0"
      bind:this={share.preview}
      autoplay
      playsinline
      muted
      on:resize={grabDimensions}
    />

    {#if share.stream}
      <video class="h-full" autoplay playsinline muted bind:this={preview} />
      <button
        on:click={stopSharing}
        class="absolute w-5 -top-2 -right-1.5 p-1.5 rounded-full border border-fmd-red bg-fmd-gray_lighter text-fmd-red hover:bg-fmd-red hover:text-fmd-white transition-all duration-200 ease-in-out"
      >
        <CloseIcon />
      </button>
    {:else}
      <LoadingDots />
    {/if}
  </ActionButton>
</div>
