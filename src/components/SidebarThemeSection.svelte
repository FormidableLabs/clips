<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { activeTheme, themes } from "../stores";
</script>

<SidebarSection title="Theme">
  <div class="grid grid-cols-3 gap-1">
    {#each themes as theme}
      <button
        class="grid grid-cols-2 grid-rows-[3fr,1fr] gap-0.5 aspect-square border-2 p-0.5 rounded focus:outline-none focus:ring-fmd-blue focus:border-4 focus:border-fmd-blue {theme ===
        $activeTheme
          ? 'border-fmd-blue'
          : 'border-transparent'}"
        on:click={() => ($activeTheme = theme)}
      >
        <div class="h-full" style="background-color: {theme.primary};" />
        <div class="h-full" style="background-color: {theme.secondary};" />
        <div
          class="col-span-2 h-full"
          style="background-color: {theme.accent};"
        />
      </button>
    {/each}
  </div>
</SidebarSection>
