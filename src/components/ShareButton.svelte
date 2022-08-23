<script lang="ts">
  import ShareIcon from "./icons/share.icon.svelte";
  import ActionButton from "./ActionButton.svelte";
  import { displayDimensions, displayPreview, displayStream } from "../stores";

  const stopSharing = () => {
    $displayPreview.srcObject = null;
    if ($displayStream) {
      $displayStream.getTracks().forEach((track) => track.stop());
      $displayStream = null;
    }
  };

  const promptDisplay = async () => {
    $displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    $displayPreview.srcObject = $displayStream;
    grabDimensions();

    $displayStream.getVideoTracks()[0].onended = stopSharing;
  };

  const handleActionButtonClick = () => {
    if ($displayStream) stopSharing();
    else promptDisplay();
  };

  const grabDimensions = () => {
    const { videoWidth, videoHeight } = $displayPreview;
    $displayDimensions.width = videoWidth;
    $displayDimensions.height = videoHeight;
  };
</script>

<ActionButton
  isActive={$displayStream !== null}
  on:activate={promptDisplay}
  on:deactivate={stopSharing}
>
  <ShareIcon />
  <video
    class="invisible absolute top-0 left-0"
    bind:this={$displayPreview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</ActionButton>
