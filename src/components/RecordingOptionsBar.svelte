<script lang="ts">
  import {
    canvasDimensions,
    canvasSizes,
    isRecording,
    recordingFPS,
    recordingFPSOptions,
  } from "../stores.js";
  import Select from "./Select.svelte";
</script>

<div class="grid grid-cols-[3fr_1fr] col-span-4 self-end gap-5">
  <Select
    title="Canvas Size"
    name="canvasSize"
    options={canvasSizes.map((size) => ({
      title: `${size.title}`,
      value: size,
    }))}
    bind:value={$canvasDimensions}
    isDisabled={$isRecording}
    isDropdown={false}
  />

  <Select
    title="Recording FPS"
    name="recordingFPS"
    options={recordingFPSOptions.map((fps) => ({
      title: fps.toString(),
      value: fps,
    }))}
    bind:value={$recordingFPS}
    isDisabled={$isRecording}
    isDropdown={false}
  />
</div>
