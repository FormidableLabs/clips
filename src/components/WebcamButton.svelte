<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import Camera from "./icons/camera.icon.svelte";
  import { webcamState } from "../stores";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";
  import Loader from "./Loader.svelte";

  let isPopupOpen = false;

  const promptWebcam = async (deviceId: string) => {
    isPopupOpen = false;

    $webcamState.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
      },
    });
    $webcamState.preview.srcObject = $webcamState.stream;
    grabDimensions();
  };

  const grabDimensions = () => {
    if ($webcamState.stream?.getVideoTracks?.()?.[0]?.getSettings?.()) {
      const { width, height } = $webcamState.stream
        .getVideoTracks()[0]
        .getSettings();
      $webcamState.width = width;
      $webcamState.height = height;
    }
  };

  let devices;
  let hasWebcamPermissions = false;
  $: {
    if (isPopupOpen) {
      const prom = hasWebcamPermissions
        ? Promise.resolve()
        : navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: false,
            })
            .then((stream) => {
              hasWebcamPermissions = true;
              stream.getTracks().forEach((track) => track.stop());
              return;
            });

      devices = prom
        .then(() => navigator.mediaDevices.enumerateDevices())
        .then((devices) => devices.filter((dev) => dev.kind === "videoinput"));
    }
  }

  const stopWebcam = () => {
    $webcamState.stream.getTracks().forEach((track) => track.stop());
    $webcamState.stream = null;
    $webcamState.preview.srcObject = null;
  };

  const handleActionButtonClick = () => {
    if ($webcamState.stream) {
      stopWebcam();
    } else {
      isPopupOpen = true;
    }
  };
</script>

<ActionButton
  isActive={Boolean($webcamState.stream)}
  {isPopupOpen}
  on:popupDismiss={() => (isPopupOpen = false)}
  on:click={handleActionButtonClick}
>
  <!-- Popup content -->
  <PopupContainer slot="popupContent" title="Select a webcam">
    {#await devices}
      <div class="flex justify-center p-3">
        <Loader>Fetching cams...</Loader>
      </div>
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
    bind:this={$webcamState.preview}
    autoplay
    playsinline
    muted
    on:resize={grabDimensions}
  />
</ActionButton>
