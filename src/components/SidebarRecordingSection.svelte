<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import {
    canvasDimensions,
    canvasSizes,
    isRecording,
    recordingFPS,
  } from "../stores.js";
  import NumberInput from "./NumberInput.svelte";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Recording Options">
  <div class="grid grid-cols-2 gap-2">
    <Select
      title="Canvas Size"
      name="canvasSize"
      options={canvasSizes.map((size) => ({
        title: `${size.title} (${size.width}x${size.height})`,
        value: size,
      }))}
      bind:value={$canvasDimensions}
      isDisabled={$isRecording}
    />

    <NumberInput
      title="Recording FPS"
      name="recordingFPS"
      placeholder="30"
      bind:value={$recordingFPS}
      min={1}
      max={60}
      step={1}
      isDisabled={$isRecording}
    />
  </div>
</SidebarSection>
