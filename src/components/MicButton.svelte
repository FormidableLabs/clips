<script lang="ts">
  import ActionButton from "./ActionButton.svelte";
  import Mic from "./icons/mic.icon.svelte";
  import { micStream } from "../stores";
  import PopupContainer from "./PopupContainer.svelte";
  import TextButton from "./TextButton.svelte";

  let isPopupOpen = false;

  const onPromptDevice = async (deviceId: string) => {
    isPopupOpen = false;

    $micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: deviceId },
      },
    });
  };

  const audioDevices = Promise.resolve().then(() =>
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => devices.filter((dev) => dev.kind === "audioinput"))
  );

  const stopMic = () => {
    $micStream.getTracks().forEach((track) => track.stop());
    $micStream = null;
  };

  const handleActionButtonClick = () => {
    if ($micStream) {
      stopMic();
    } else {
      isPopupOpen = true;
    }
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
      <p>... fetching audio devices</p>
    {:then devices}
      <div class="flex flex-col gap-1">
        {#each devices as device}
          <TextButton on:click={() => onPromptDevice(device.deviceId)}
            >{device.label}
            {#if device.deviceId === "default"}<span>(Default)</span>{/if}
          </TextButton>
        {/each}
      </div>
    {/await}
  </PopupContainer>

  <Mic />
</ActionButton>
