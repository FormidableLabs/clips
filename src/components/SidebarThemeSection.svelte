<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { activeTheme, themes } from "../stores";
  import Select from "./Select.svelte";
  import {
    activeBackground,
    backgrounds,
    generalLayoutState,
  } from "../stores.js";
  import InputLabel from "./InputLabel.svelte";
  import RangeInput from "./RangeInput.svelte";
</script>

<SidebarSection title="Theme">
  <div class="grid grid-cols-2 gap-4">
    <!-- Color Theme -->
    <div class="col-span-2 grid grid-cols-5 gap-y-3">
      <div class="col-span-5">
        <InputLabel>Color Theme</InputLabel>
      </div>
      {#each themes as theme, i}
        <button
          class="group transition transition-bg duration-150 focus:outline-none {i !==
            0 && 'border-l-[1px] border-fmd-gray'} {theme === $activeTheme
            ? 'bg-fmd-red/5 focus:bg-fmd-red/5'
            : 'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10'}"
          on:click={() => ($activeTheme = theme)}
        >
          <div class="grid grid-cols-2 gap-1 p-2">
            <div
              class="w-full aspect-square"
              style="background-color: {theme.primary};"
            />
            <div
              class="w-full aspect-square"
              style="background-color: {theme.secondary};"
            />
          </div>
          <div
            class="transition transition-all duration-150 {theme ===
            $activeTheme
              ? 'bg-fmd-red group-focus:bg-fmd-red'
              : 'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow'} h-1 "
          />
        </button>
      {/each}
    </div>

    <Select
      title="Background Style"
      name="background"
      options={backgrounds.map((bg) => ({ title: bg.title, value: bg }))}
      bind:value={$activeBackground}
    />
    <RangeInput
      name="padding"
      title="Padding"
      bind:value={$generalLayoutState.padding}
      min={0}
      max={1}
      step={0.02}
    />
  </div>
</SidebarSection>
