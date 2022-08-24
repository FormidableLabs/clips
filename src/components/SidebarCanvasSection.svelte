<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import TextButton from "./TextButton.svelte";
  import {
    canvasDimensions,
    canvasSizes,
    isRecording,
    recordingFPS,
  } from "../stores.js";
  import FormField from "./FormField.svelte";
</script>

<!-- TODO: Recording FPS -->
<SidebarSection title="Canvas">
  <div class="flex flex-col gap-1">
    {#each canvasSizes as size}
      <TextButton
        on:click={() => ($canvasDimensions = size)}
        extraClasses={size === $canvasDimensions ? "bg-primary-200" : ""}
        isDisabled={$isRecording}
      >
        {size.title} ({size.width}x{size.height})
      </TextButton>
    {/each}

    <FormField
      title="Recording FPS"
      name="recordingFPS"
      placeholder="30"
      bind:value={$recordingFPS}
      isDisabled={$isRecording}
    />
  </div>
</SidebarSection>
