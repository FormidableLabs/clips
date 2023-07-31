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
  import clsx from "clsx";

  const backgroundOptions = ["Audio", "Gradient", "Solid"];
</script>

<SidebarSection title="Theme">
  <div class="flex flex-col gap-6">
    <!-- Color Theme -->
    <div>
      <InputLabel>Color Theme</InputLabel>
      <div
        class="select-parent"
        style="grid-template-columns: repeat({themes.length + 1}, 1fr);"
      >
        {#each themes as theme, i}
          <button
            class={clsx("select-child-wrapper", i !== 0 && "not-first")}
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
              class={clsx(
                "select-child-overlay",
                theme === $activeTheme && "select-child-overlay-selected"
              )}
            />
          </button>
        {/each}
        <button
          class="select-child-wrapper not-first"
          on:click={() => ($activeTheme = $customTheme)}
        >
          <div
            class=" m-auto h-[calc(100%-5px)] leading-[40px] align-middle text-xs transition transition-all duration-150 dark:text-white"
          >
            Custom
          </div>
          <div
            class={clsx(
              "select-child-overlay",
              $customTheme === $activeTheme && "select-child-overlay-selected"
            )}
          />
        </button>
      </div>

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
      />
    {/each}
  </div>
</SidebarSection>
