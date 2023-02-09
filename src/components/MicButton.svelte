<script lang="ts">
  import { slide } from "svelte/transition";
  import ActionButton from "./ActionButton.svelte";
  import Mic from "./icons/mic.icon.svelte";
  import { micState } from "../stores";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";
  import Loader from "./Loader.svelte";

  let isPopupOpen = false;

  const onPromptDevice = async (deviceId: string) => {
    stopMic();
    isPopupOpen = false;

    try {
      $micState.deviceId = deviceId;
      $micState.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: deviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch {
      $micState = {};
    }
  };

  let audioDevices;
  let hasMicPermission = false;

  $: {
    if (isPopupOpen) {
      const prom = hasMicPermission
        ? Promise.resolve()
        : navigator.mediaDevices
            .getUserMedia({
              video: false,
              audio: true,
            })
            .then((stream) => {
              hasMicPermission = true;
              stream.getTracks().forEach((track) => track.stop());
              return;
            });

      audioDevices = prom
        .then(() => navigator.mediaDevices.enumerateDevices())
        .then((devices) => devices.filter((dev) => dev.kind === "audioinput"));
    }
  }

  const stopMic = () => {
    if ($micState.stream) {
      $micState.stream.getTracks().forEach((track) => track.stop());
      $micState.stream = null;
      $micState.deviceId = null;
    }
  };

  const handleActionButtonClick = () => {
    isPopupOpen = true;
  };
</script>

<ActionButton
  isActive={Boolean($micState.stream)}
  {isPopupOpen}
  on:popupDismiss={() => (isPopupOpen = false)}
  on:click={handleActionButtonClick}
>
  <!-- Popup content -->
  <PopupContainer slot="popupContent" title="Select a mic">
    {#await audioDevices}
      <div class="flex justify-center p-3">
        <Loader>Fetching mics...</Loader>
      </div>
    {:then devices}
      <div class="flex flex-col gap-1">
        {#each devices as device (device.deviceId)}
          <TextButton
            on:click={() => onPromptDevice(device.deviceId)}
            hasCheck={$micState.deviceId === device.deviceId}
          >
            {device.label}
            {#if device.deviceId === "default"}<span>(Default)</span>{/if}
          </TextButton>
        {/each}

        {#if $micState.stream}
          <div transition:slide={{ duration: 150 }} class="w-full block">
            <TextButton
              on:click={stopMic}
              extraClasses="bg-fmd-gray_lighter dark:bg-fmd-navy/30 dark:hover:bg-fmd-blue w-full"
              hasClose>Stop Mic</TextButton
            >
          </div>
        {/if}
      </div>
    {/await}
  </PopupContainer>

  <Mic />
</ActionButton>
