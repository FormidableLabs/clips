<script lang="ts">
  import { displayStream, displayPreview, displayDimensions } from "../stores";

  const promptDisplay = async () => {
    $displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    $displayPreview.srcObject = $displayStream;
    grabDimensions();

    $displayStream.getVideoTracks()[0].onended = () => {
      $displayPreview.srcObject = null;
      $displayStream = null;
    };
  };

  const grabDimensions = () => {
    const { videoWidth, videoHeight } = $displayPreview;
    $displayDimensions.width = videoWidth;
    $displayDimensions.height = videoHeight;
  };
</script>

<div>
  <button on:click={promptDisplay} class="border rounded p-2 block w-full"
    >Select Screen</button
  >
  <video
    class="w-full h-full"
    bind:this={$displayPreview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</div>
