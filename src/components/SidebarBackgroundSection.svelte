<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { backgrounds, activeBackground } from "../stores.js";
  import TextButton from "./TextButton.svelte";
</script>

<SidebarSection title="Background">
  <div class="flex flex-col gap-1">
    {#each backgrounds as bg}
      <TextButton
        on:click={() => ($activeBackground = bg)}
        extraClasses={bg === $activeBackground ? "bg-primary-200" : ""}
      >
        {bg.title}
      </TextButton>
    {/each}
  </div>
</SidebarSection>
