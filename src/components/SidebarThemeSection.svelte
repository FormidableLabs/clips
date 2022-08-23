<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { activeTheme, themes } from "../stores";
</script>

<SidebarSection title="Theme">
  <div class="grid grid-cols-3 gap-1">
    {#each themes as theme}
      <button
        class="grid grid-cols-2 gap-0.5 aspect-square border-4 border-transparent p-0.5 rounded"
        class:border-primary-200={theme === $activeTheme}
        on:click={() => ($activeTheme = theme)}
      >
        <div class="h-full" style="background-color: {theme.primary};" />
        <div class="h-full" style="background-color: {theme.secondary};" />
      </button>
    {/each}
  </div>
</SidebarSection>
