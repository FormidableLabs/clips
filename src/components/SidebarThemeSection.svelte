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
        class="select-parent justify-center"
        style="grid-template-columns: repeat({themes.length}, 1fr) 1.5fr;"
      >
        {#each themes as theme, i}
          <button
            class={clsx(
              "select-child-wrapper pt-2 pb-1 group",
              i !== 0 && "not-first"
            )}
            on:click={() => ($activeTheme = theme)}
          >
            <div
              class={clsx(
                "inline-block relative w-7 h-7 overflow-hidden rounded-full border-2 border-fmd-gray dark:border-fmd-white/20",
                "transition-default",
                "group-hover:border-fmd-red dark:group-hover:border-fmd-white"
              )}
              style="background-color: {theme.primary};"
            >
              <div
                class="w-[200%] aspect-square absolute top-0 left-1/2 rotate-45"
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
          class={clsx(
            "select-child-wrapper not-first transition-default hover:text-fmd-red dark:text-white",
            $customTheme === $activeTheme && "text-fmd-red-600"
          )}
          on:click={() => ($activeTheme = $customTheme)}
        >
          <div class="transition-default text-sm">Custom</div>
          <div
            class={clsx(
              "select-child-overlay",
              $customTheme === $activeTheme && "select-child-overlay-selected"
            )}
          />
        </button>
      </div>

      {#if $activeTheme === $customTheme}
        <div class="mt-4" transition:slide={{ duration: 150 }}>
          <div class="pb-2">
            <InputLabel name="customTheme">Custom Theme</InputLabel>
          </div>
          <div class="grid grid-cols-[1fr_1fr_auto]">
            <ColorInput
              title="Primary Color"
              bind:value={$customTheme.primary}
            />
            <ColorInput
              title="Secondary Color"
              bind:value={$customTheme.secondary}
              rightAlignPopup={true}
            />
            <div
              class={clsx(
                "justify-self-end relative w-8 h-8 overflow-hidden rounded-full border-2 border-fmd-gray dark:border-fmd-white/20",
                "transition-default",
                "group-hover:border-fmd-red dark:group-hover:border-fmd-white"
              )}
              style="background-color: {$customTheme.primary};"
            >
              <div
                class="w-[200%] aspect-square absolute top-0 left-1/2 rotate-45"
                style="background-color: {$customTheme.secondary};"
              />
            </div>
          </div>
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

<div class="w-full h-px bg-fmd-gray dark:bg-fmd-blue" />

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
