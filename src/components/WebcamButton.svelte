<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import Camera from "./icons/camera.icon.svelte";
  import { webcamDimensions, webcamPreview, webcamStream } from "../stores";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";

  let isPopupOpen = false;

  const promptWebcam = async (deviceId: string) => {
    isPopupOpen = false;

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

  const handleActionButtonClick = () => {
    if ($webcamStream) {
      stopWebcam();
    } else {
      isPopupOpen = true;
    }
  };
</script>

<ActionButton
  isActive={Boolean($webcamStream)}
  {isPopupOpen}
  on:popupDismiss={() => (isPopupOpen = false)}
  on:click={handleActionButtonClick}
>
  <!-- Popup content -->
  <PopupContainer slot="popupContent" title="Select a webcam">
    {#await devices}
      <p>... fetching devices</p>
    {:then devices}
      <div class="flex flex-col gap-1">
        {#each devices as device}
          <TextButton on:click={() => promptWebcam(device.deviceId)}>
            {device.label}
          </TextButton>
        {/each}
      </div>
    {/await}
  </PopupContainer>

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
