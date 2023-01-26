<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import type { Share } from "../stores";
  import { screenShareState } from "../stores.js";
  import { onMount } from "svelte";
  import LoadingDots from "./icons/loadingDots.icon.svelte";
  import CloseIcon from "./icons/close.icon.svelte";

  export let share: Share;
  export let index: number;
  let preview: HTMLVideoElement;
  let isActive: boolean = false;

  onMount(async () => {
    try {
      share.stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      share.preview.srcObject = share.stream;
      grabDimensions();
      makeActive();
      share.stream.getVideoTracks()[0].onended = stopSharing;
    } catch {
      removeShare(index);
    }
  });

  const removeShare = async (removingItemIndex) => {
    const filteredShares = $screenShareState.shares.filter(
      (item, i) => i !== removingItemIndex
    );
    let newActiveIndex = null;
    if (
      removingItemIndex === $screenShareState.activeIndex &&
      filteredShares.length &&
      removingItemIndex === 0
    ) {
      newActiveIndex = 0;
    }

    if (
      removingItemIndex === $screenShareState.activeIndex &&
      filteredShares.length &&
      removingItemIndex !== 0
    ) {
      newActiveIndex = removingItemIndex - 1;
    }
    if (
      removingItemIndex !== $screenShareState.activeIndex &&
      filteredShares.length &&
      removingItemIndex > $screenShareState.activeIndex
    ) {
      newActiveIndex = $screenShareState.activeIndex;
    }
    if (
      removingItemIndex !== $screenShareState.activeIndex &&
      filteredShares.length &&
      removingItemIndex < $screenShareState.activeIndex
    ) {
      newActiveIndex = $screenShareState.activeIndex - 1;
    }
    $screenShareState = { activeIndex: newActiveIndex, shares: filteredShares };
  };

  const stopSharing = (event, index) => {
    if ($screenShareState.shares[index]) {
      $screenShareState.shares[index].stream
        .getTracks()
        .forEach((track) => track.stop());
      $screenShareState.shares = $screenShareState.shares;
      removeShare(index);
    }
  };

  const grabDimensions = () => {
    const { videoWidth, videoHeight } = share.preview;
    share.width = videoWidth;
    share.height = videoHeight;
  };

  const makeActive = () => {
    const shareIndex = $screenShareState.shares.indexOf(share);
    $screenShareState.activeIndex = shareIndex;
    setTimeout(() => {
      $screenShareState.shares[shareIndex].width = share.preview.videoWidth;
      $screenShareState.shares[shareIndex].height = share.preview.videoHeight;
    }, 100);
  };

  $: {
    if (preview && $screenShareState.shares[index]) {
      preview.srcObject = $screenShareState.shares[index].stream;
    }
    isActive = $screenShareState.activeIndex === index;
  }
</script>

<div class="w-20 h-14 relative">
  <ActionButton {isActive} isSquareVariant isVideo on:click={makeActive}>
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
        on:click={(event) => stopSharing(event, index)}
        class="absolute w-5 -top-2 -right-1.5 p-1.5 rounded-full border border-fmd-red bg-fmd-gray_lighter text-fmd-red hover:bg-fmd-red hover:text-fmd-white transition-all duration-200 ease-in-out"
      >
        <CloseIcon />
      </button>
    {:else}
      <LoadingDots />
    {/if}
  </ActionButton>
</div>
