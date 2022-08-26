<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import AlignmentPicker from "./AlignmentPicker.svelte";
  import { screenLayoutState } from "../stores.js";
</script>

<SidebarSection title="Screenshare Layout">
  <AlignmentPicker
    bind:horizAlign={$screenLayoutState.horizAlign}
    bind:vertAlign={$screenLayoutState.vertAlign}
  />
</SidebarSection>
