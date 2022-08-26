<script lang="ts">
  import SidebarSection from "./SidebarSection.svelte";
  import { webcamLayoutState, webcamShapeOptions } from "../stores";
  import AlignmentPicker from "./AlignmentPicker.svelte";
  import RangeInput from "./RangeInput.svelte";
  import Select from "./Select.svelte";
  import { titleCase } from "../utils/titleCase.js";
</script>

<SidebarSection title="Webcam Layout">
  <div class="flex flex-col gap-3">
    <AlignmentPicker
      bind:horizAlign={$webcamLayoutState.horizAlign}
      bind:vertAlign={$webcamLayoutState.vertAlign}
    />
    <Select
      title="Webcam shape"
      name="webcamShape"
      options={webcamShapeOptions.map((val) => ({
        title: titleCase(val),
        value: val,
      }))}
      bind:value={$webcamLayoutState.shape}
    />
    <RangeInput
      name="webcamWidth"
      title="Webcam width"
      bind:value={$webcamLayoutState.size}
      min={0}
      max={1}
      step={0.02}
    />
  </div>
</SidebarSection>
