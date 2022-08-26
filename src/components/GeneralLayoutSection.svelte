<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import RangeInput from "./RangeInput.svelte";
  import { generalLayoutState } from "../stores.js";
</script>

<SidebarSection title="General Layout">
  <RangeInput
    name="padding"
    title="Padding"
    bind:value={$generalLayoutState.padding}
    min={0}
    max={1}
    step={0.02}
  />
</SidebarSection>
