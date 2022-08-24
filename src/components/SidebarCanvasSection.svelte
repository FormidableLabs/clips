<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import {
    canvasDimensions,
    canvasSizes,
    isRecording,
    recordingFPS,
  } from "../stores.js";
  import FormField from "./FormField.svelte";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Canvas">
  <div class="flex flex-col gap-2">
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

    <FormField
      title="Recording FPS"
      name="recordingFPS"
      placeholder="30"
      bind:value={$recordingFPS}
      isDisabled={$isRecording}
    />
  </div>
</SidebarSection>
