<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import {
    canvasDimensions,
    canvasSizes,
    isRecording,
    recordingFPS,
    recordingFPSOptions,
  } from "../stores.js";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Recording Options">
  <div class="grid grid-rows-2 gap-4">
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
</SidebarSection>
