<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { layouts, activeLayout } from "../stores.js";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Layout">
  <Select
    title="Layout type"
    name="layout"
    options={layouts.map((l) => ({ title: l.title, value: l }))}
    bind:value={$activeLayout}
  />
</SidebarSection>
