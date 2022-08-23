<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import TextButton from "./TextButton.svelte";
  import { canvasDimensions, canvasSizes } from "../stores.js";
</script>

<SidebarSection title="Canvas">
  <div class="flex flex-col gap-1">
    {#each canvasSizes as size}
      <TextButton
        on:click={() => ($canvasDimensions = size)}
        extraClasses={size === $canvasDimensions ? "bg-primary-200" : ""}
      >
        {size.title} ({size.width}x{size.height})
      </TextButton>
    {/each}
  </div>
</SidebarSection>
