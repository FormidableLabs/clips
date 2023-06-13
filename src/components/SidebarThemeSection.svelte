<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { slide } from "svelte/transition";
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

  const backgroundOptions = ["Audio", "Gradient", "Solid"];
</script>

<SidebarSection title="Theme">
  <div class="flex flex-col gap-6">
    <!-- Color Theme -->
    <div class="grid grid-cols-6 gap-y-3">
      <div class="col-span-6">
        <InputLabel>Color Theme</InputLabel>
      </div>
      {#each themes as theme, i}
        <button
          class="group transition transition-bg duration-150 focus:outline-none {i !==
            0 &&
            'border-l-[1px] border-fmd-gray dark:border-fmd-blue'} {theme ===
          $activeTheme
            ? 'bg-fmd-red/5 focus:bg-fmd-red/5 dark:bg-fmd-blue/50 dark:focus:bg-fmd-blue/50'
            : 'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10 dark:hover:bg-fmd-blue/20 dark:focus:bg-fmd-blue/20'}"
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
              : 'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow dark:group-hover:bg-fmd-sky dark:group-focus:bg-fmd-sky'} h-1 "
          />
        </button>
      {/each}

      <button
        class="group transition transition-bg duration-150 focus:outline-none border-l-[1px] border-fmd-gray dark:border-fmd-blue {$customTheme ===
        $activeTheme
          ? 'bg-fmd-red/5 focus:bg-fmd-red/5 dark:bg-fmd-blue/50 dark:focus:bg-fmd-blue/50'
          : 'hover:bg-fmd-yellow/10 focus:bg-fmd-yellow/10 dark:hover:bg-fmd-blue/20 dark:focus:bg-fmd-blue/20'}"
        on:click={() => ($activeTheme = $customTheme)}
      >
        <div
          class=" m-auto h-[calc(100%-5px)] leading-[40px] align-middle text-xs transition transition-all duration-150 dark:text-white"
        >
          Custom
        </div>
        <div
          class="transition transition-all duration-150 {$customTheme ===
          $activeTheme
            ? 'bg-fmd-red group-focus:bg-fmd-red'
            : 'group-hover:bg-fmd-yellow group-focus:bg-fmd-yellow dark:group-hover:bg-fmd-sky dark:group-focus:bg-fmd-sky'} h-1"
        />
      </button>

      {#if $activeTheme === $customTheme}
        <div
          class="col-span-6 grid grid-cols-2 gap-x-4"
          transition:slide={{ duration: 150 }}
        >
          <div class="col-span-2 pb-2">
            <InputLabel name="customTheme">Custom Theme</InputLabel>
          </div>
          <ColorInput title="Primary Color" bind:value={$customTheme.primary} />
          <ColorInput
            title="Secondary Color"
            bind:value={$customTheme.secondary}
            rightAlignPopup={true}
          />
        </div>
      {/if}
    </div>

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

<div class="w-full h-[1px] bg-fmd-gray dark:bg-fmd-blue" />

<SidebarSection title="Background Style">
  <div class="flex flex-col gap-6">
    {#each backgroundOptions as option}
      <Select
        title={option}
        name="background"
        options={backgrounds
          .filter((bg) => bg.category === option)
          .map((bg) => ({
            title: bg.title,
            value: bg,
            ariaLabel: bg.ariaLabel,
          }))}
        bind:value={$activeBackground}
        isDropdown={false}
      />
    {/each}
  </div>
</SidebarSection>
