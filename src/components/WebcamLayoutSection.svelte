<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import {
    webcamLayoutState,
    horizontalAlignmentOptions,
    verticalAlignmentOptions,
  } from "../stores";
  import Select from "./Select.svelte";
  import AlignmentPicker from "./AlignmentPicker.svelte";
</script>

<SidebarSection title="Webcam Layout">
  <AlignmentPicker
    bind:horizAlign={$webcamLayoutState.horizAlign}
    bind:vertAlign={$webcamLayoutState.vertAlign}
  />
</SidebarSection>
