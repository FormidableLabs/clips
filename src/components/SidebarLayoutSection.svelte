<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import InputLabel from "./InputLabel.svelte";
  import AlignmentPicker from "./AlignmentPicker.svelte";
  import { screenLayoutState } from "../stores.js";
</script>

<SidebarSection title="Layout">
  <div class="grid grid-cols-2 gap-x-4 gap-y-6">
    <div>
      <InputLabel>Screen Position</InputLabel>
      <div class="mb-1" />
      <AlignmentPicker
        bind:horizAlign={$screenLayoutState.horizAlign}
        bind:vertAlign={$screenLayoutState.vertAlign}
      />
    </div>
  </div>
</SidebarSection>
