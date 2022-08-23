<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import Camera from "./icons/camera.icon.svelte";
  import { webcamDimensions, webcamPreview, webcamStream } from "../stores";

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

<ActionButton
  hasPopupContent
  on:deactivate={stopWebcam}
  isActive={Boolean($webcamStream)}
>
  <!-- Popup content -->
  <div slot="popupContent" class="p-2">
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
  </div>

  <Camera />

  <video
    class="invisible absolute"
    bind:this={$webcamPreview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</ActionButton>
