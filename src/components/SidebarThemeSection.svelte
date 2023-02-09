<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { activeTheme, customTheme, themes } from "../stores";
  import Select from "./Select.svelte";
  import {
    activeBackground,
    backgrounds,
    generalLayoutState,
  } from "../stores.js";
  import InputLabel from "./InputLabel.svelte";
  import RangeInput from "./RangeInput.svelte";
  import ColorInput from "./ColorInput.svelte";
  import { custom } from "zod";
</script>

<SidebarSection title="Theme">
  <div class="grid grid-cols-2 gap-6">
    <!-- Color Theme -->
    <div class="col-span-2 grid grid-cols-6 gap-y-3">
      <div class="col-span-6">
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

      <button
        class="group transition transition-bg duration-150 focus:outline-none border-l-[1px] border-fmd-gray {$customTheme ===
        $activeTheme
          ? 'bg-fmd-red/5 focus:bg-fmd-red/5'
          : 'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10'}"
        on:click={() => ($activeTheme = $customTheme)}
      >
        <div class="grid grid-cols-2 gap-1 p-2">
          <div
            class="w-full aspect-square"
            style="background-color: {$customTheme.primary};"
          />
          <div
            class="w-full aspect-square"
            style="background-color: {$customTheme.secondary};"
          />
        </div>
        <div
          class="transition transition-all duration-150 {$customTheme ===
          $activeTheme
            ? 'bg-fmd-red group-focus:bg-fmd-red'
            : 'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow'} h-1 "
        />
      </button>
    </div>

    {#if $activeTheme === $customTheme}
      <ColorInput
        name="customPrimary"
        placeholder="#848484"
        title="Primary Color"
        bind:value={$customTheme.primary}
      />
      <ColorInput
        name="customSecondary"
        placeholder="#848484"
        title="Secondary Color"
        bind:value={$customTheme.secondary}
      />
    {/if}

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
      max={0.4}
      step={0.004}
    />
  </div>
</SidebarSection>
