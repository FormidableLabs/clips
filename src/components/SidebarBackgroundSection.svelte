<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { backgrounds, activeBackground } from "../stores.js";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Background">
  <Select
    title="Background Style"
    name="background"
    options={backgrounds.map((bg) => ({ title: bg.title, value: bg }))}
    bind:value={$activeBackground}
  />
</SidebarSection>
