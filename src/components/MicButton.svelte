<script lang="ts">
  import { slide } from "svelte/transition";
  import ActionButton from "./ActionButton.svelte";
  import Mic from "./icons/mic.icon.svelte";
  import { micStream } from "../stores";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";
  import Loader from "./Loader.svelte";

  let isPopupOpen = false;

  const onPromptDevice = async (deviceId: string) => {
    stopMic();
    isPopupOpen = false;

    $micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
      },
    });
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
    if ($micStream) {
      $micStream.getTracks().forEach((track) => track.stop());
      $micStream = null;
    }
  };

  const handleActionButtonClick = () => {
    isPopupOpen = true;
  };
</script>

<ActionButton
  isActive={Boolean($micStream)}
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
        {#each devices as device}
          <TextButton on:click={() => onPromptDevice(device.deviceId)}
            >{device.label}
            {#if device.deviceId === "default"}<span>(Default)</span>{/if}
          </TextButton>
        {/each}

        {#if $micStream}
          <div transition:slide={{ duration: 150 }} class="w-full block">
            <TextButton on:click={stopMic} extraClasses="bg-fmd-gray w-full"
              >Stop Mic</TextButton
            >
          </div>
        {/if}
      </div>
    {/await}
  </PopupContainer>

  <Mic />
</ActionButton>
