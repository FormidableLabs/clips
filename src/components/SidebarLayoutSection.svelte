<script lang="ts">
  import { slide } from "svelte/transition";
  import SidebarSection from "./SidebarSection.svelte";
  import InputLabel from "./InputLabel.svelte";
  import AlignmentPicker from "./AlignmentPicker.svelte";
  import {
    screenLayoutState,
    webcamLayoutState,
    WebcamShape,
    webcamShapeOptions,
  } from "../stores.js";
  import { titleCase } from "../utils/titleCase.js";
  import NumberInput from "./NumberInput.svelte";
  import Select from "./Select.svelte";
</script>

<SidebarSection title="Layout">
  <div class="grid grid-cols-2 gap-4">
    <div>
      <InputLabel>Webcam Alignment</InputLabel>
      <div class="mb-1" />
      <AlignmentPicker
        bind:horizAlign={$webcamLayoutState.horizAlign}
        bind:vertAlign={$webcamLayoutState.vertAlign}
      />
    </div>
    <div>
      <InputLabel>Screen Alignment</InputLabel>
      <div class="mb-1" />
      <AlignmentPicker
        bind:horizAlign={$screenLayoutState.horizAlign}
        bind:vertAlign={$screenLayoutState.vertAlign}
      />
    </div>
    <!-- Webcam shape/width -->
    <Select
      title="Webcam shape"
      name="webcamShape"
      options={webcamShapeOptions.map((val) => ({
        title: titleCase(val),
        value: val,
      }))}
      bind:value={$webcamLayoutState.shape}
    />
    <NumberInput
      name="webcamWidth"
      title="Webcam width"
      bind:value={$webcamLayoutState.size}
      min={0}
      max={1}
      step={0.02}
    />
    {#if $webcamLayoutState.shape === WebcamShape.initial}
      <div transition:slide={{ duration: 150 }} class="col-span-2">
        <NumberInput
          name="webcamBorderRadius"
          title="Border radius"
          bind:value={$webcamLayoutState.borderRadius}
          min={0}
          max={1}
          step={0.02}
        />
      </div>
    {/if}
  </div>
</SidebarSection>
