<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import type { Share } from "../stores";
  import { screenShareState } from "../stores.js";
  import { onMount } from "svelte";
  import LoadingDots from "./icons/loadingDots.icon.svelte";
  import CloseIcon from "./icons/close.icon.svelte";
  import clsx from "clsx";

  export let share: Share;
  export let index: number;
  let preview: HTMLVideoElement;

  onMount(async () => {
    try {
      share.stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (share.preview && share.stream) {
        share.preview.srcObject = share.stream;
      }
      grabDimensions();
      makeActive();
    } catch {
      removeShare(index);
    }
  });

  const removeShare = async (removingItemIndex: number) => {
    const filteredShares = $screenShareState.shares.filter(
      (_, i) => i !== removingItemIndex
    );
    const current = $screenShareState.activeIndex;
    let newActiveIndex: number | null = current;

    if (current !== null) {
      if (current === removingItemIndex) {
        newActiveIndex = filteredShares.length
          ? Math.min(removingItemIndex, filteredShares.length - 1)
          : null;
      } else if (current > removingItemIndex) {
        newActiveIndex = current - 1;
      }
    }

    $screenShareState = { activeIndex: newActiveIndex, shares: filteredShares };
  };

  const stopSharing = (_event: MouseEvent, idx: number) => {
    const target = $screenShareState.shares[idx];
    if (target?.stream) {
      target.stream.getTracks().forEach((track) => track.stop());
      $screenShareState.shares = $screenShareState.shares;
      removeShare(idx);
    }
  };

  const grabDimensions = () => {
    if (share.preview) {
      share.width = share.preview.videoWidth;
      share.height = share.preview.videoHeight;
    }
  };

  const makeActive = () => {
    const shareIndex = $screenShareState.shares.indexOf(share);
    $screenShareState.activeIndex = shareIndex === -1 ? null : shareIndex;
    setTimeout(() => {
      const target = $screenShareState.shares[shareIndex];
      if (target && share.preview) {
        target.width = share.preview.videoWidth;
        target.height = share.preview.videoHeight;
      }
    }, 100);
  };

  $: {
    const shareState = $screenShareState.shares[index];
    if (preview && shareState?.stream) {
      preview.srcObject = shareState.stream;
    }
  }
</script>

<div class="w-20 h-14 relative">
  <ActionButton isSquareVariant on:click={makeActive}>
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
        class="absolute w-5 -top-2 -right-1.5 p-1.5 rounded-full bg-fmd-red text-white hover:bg-fmd-red-600 transition-default"
      >
        <CloseIcon />
      </button>
    {:else}
      <LoadingDots />
    {/if}
    <div
      class={clsx(
        "w-1.5 h-1.5 bg-fmd-red rounded-full absolute left-0 right-0 m-auto -bottom-3",
        $screenShareState.activeIndex === index
          ? "block"
          : "hidden group-hover:block"
      )}
    />
  </ActionButton>
</div>
