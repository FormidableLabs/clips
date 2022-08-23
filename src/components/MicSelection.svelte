<script lang="ts">
  import { micStream } from "../stores";

  const onPromptDevice = async (deviceId: string) => {
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
</script>

<div class="border p-2">
  {#await audioDevices}
    <p>... fetching audio devices</p>
  {:then devices}
    {#each devices as device}
      <button
        class="w-full p-1 border rounded mb-1"
        on:click={() => onPromptDevice(device.deviceId)}
        >{device.label}
        {#if device.deviceId === "default"}<span>(Default)</span>{/if}</button
      >
    {/each}
  {/await}

  {#if $micStream}
    <button class="w-full p-1 border rounded" on:click={stopMic}
      >Stop mic</button
    >
  {/if}
</div>
