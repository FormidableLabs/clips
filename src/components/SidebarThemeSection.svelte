<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { activeTheme, themes } from "../stores";
  import Select from "./Select.svelte";
  import {
    activeBackground,
    backgrounds,
    generalLayoutState,
  } from "../stores.js";
  import RangeInput from "./RangeInput.svelte";
  import NumberInput from "./NumberInput.svelte";
  import InputLabel from "./InputLabel.svelte";
</script>

<SidebarSection title="Theme">
  <div class="grid grid-cols-2 gap-2">
    <Select
      title="Background Style"
      name="background"
      options={backgrounds.map((bg) => ({ title: bg.title, value: bg }))}
      bind:value={$activeBackground}
    />
    <NumberInput
      name="padding"
      title="Padding"
      bind:value={$generalLayoutState.padding}
      min={0}
      max={1}
      step={0.02}
    />

    <!-- Color Theme -->
    <div class="col-span-2 grid grid-cols-4 gap-1">
      <div class="col-span-4">
        <InputLabel>Color Theme</InputLabel>
      </div>
      {#each themes as theme}
        <button
          class="grid grid-cols-2 grid-rows-[3fr,1fr] gap-0.5 aspect-[3/2] border-2 p-0.5 rounded focus:outline-none focus:ring-fmd-blue focus:border-4 focus:border-fmd-blue {theme ===
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
  </div>
</SidebarSection>
