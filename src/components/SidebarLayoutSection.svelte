<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { layouts, activeLayout } from "../stores.js";
  import TextButton from "./TextButton.svelte";
</script>

<SidebarSection title="Layout">
  <div class="flex flex-col gap-1">
    {#each layouts as layout}
      <TextButton
        on:click={() => ($activeLayout = layout)}
        extraClasses={layout === $activeLayout ? "bg-primary-200" : ""}
      >
        {layout.title}
      </TextButton>
    {/each}
  </div>
</SidebarSection>
