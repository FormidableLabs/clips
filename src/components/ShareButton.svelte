<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import type { ScreenShareState } from "../stores";
  import { activeShare, screenShareState } from "../stores.js";
  import { onMount } from "svelte";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";
  import LoadingDots from "./icons/loadingDots.icon.svelte";

  export let share: ScreenShareState["shares"][number];

  let isPopupOpen = false;
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
    isPopupOpen = false;
  };

  $: {
    if (preview && share.stream) {
      preview.srcObject = share.stream;
    }
  }
</script>

<div class="w-20 h-14">
  <ActionButton
    isActive={share === $activeShare}
    isVideo
    {isPopupOpen}
    on:popupDismiss={() => (isPopupOpen = false)}
    on:click={() => (isPopupOpen = true)}
  >
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
    {:else}
      <LoadingDots />
    {/if}

    <PopupContainer slot="popupContent" title="Screenshare">
      <div class="flex flex-col gap-1">
        <TextButton on:click={stopSharing} hasClose>Stop sharing</TextButton>

        <TextButton on:click={makeActive}>Make Active</TextButton>
      </div>
    </PopupContainer>
  </ActionButton>
</div>
