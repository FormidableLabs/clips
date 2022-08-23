<script lang="ts">
  import { webcamStream, webcamPreview, webcamDimensions } from "../stores";

  const promptWebcam = async (deviceId: string) => {
    $webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
      },
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

  const devices = navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => devices.filter((dev) => dev.kind === "videoinput"));

  const stopWebcam = () => {
    $webcamStream.getTracks().forEach((track) => track.stop());
    $webcamStream = null;
    $webcamPreview.srcObject = null;
  };
</script>

<div class="border">
  {#await devices}
    <p>... fetching devices</p>
  {:then devices}
    {#each devices as device}
      <button
        class="p-1 m-1 border"
        on:click={() => promptWebcam(device.deviceId)}
      >
        {device.label}
      </button>
    {/each}
  {/await}

  {#if $webcamStream}
    <button on:click={stopWebcam}>Stop video</button>
  {/if}

  <video
    class="w-full h-full"
    bind:this={$webcamPreview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</div>
