<script lang="ts">
  import { webcamStream, webcamPreview, webcamDimensions } from "../stores";

  const promptWebcam = async () => {
    $webcamStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    $webcamPreview.srcObject = $webcamStream;
    grabDimensions();
  };

  const grabDimensions = () => {
    if ($webcamStream?.getVideoTracks?.()?.[0]?.getSettings?.()) {
      const { width, height } = $webcamStream.getVideoTracks()[0].getSettings();
      $webcamDimensions.width = width;
      $webcamDimensions.height = height;
    }
  };
</script>

<div>
  <button class="w-full border p-3 rounded" on:click={promptWebcam}
    >Select Webcam</button
  >
  <video
    class="w-full h-full"
    bind:this={$webcamPreview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</div>
