<script lang="ts">
  import { ColorPicker } from "@apsc/color";
  import "@apsc/color/color-picker.css";
  import ActionButton from "./ActionButton.svelte";
  import PopupContainer from "./PopupContainer.svelte";

  export let title: string;
  export let value: string;
  export let rightAlignPopup: boolean = false;

  let isPopupOpen = false;

  const handleColorInputButtonClick = () => {
    isPopupOpen = true;
  };
</script>

<ActionButton
  isActive={false}
  isSquareVariant={true}
  showPopupUnder={true}
  isTextVariant={true}
  {rightAlignPopup}
  {isPopupOpen}
  on:popupDismiss={() => (isPopupOpen = false)}
  on:click={handleColorInputButtonClick}
>
  <PopupContainer slot="popupContent" title="">
    <div class="transparent-input">
      <ColorPicker class="h-[256px] p-2" bind:color={value} />
    </div>
  </PopupContainer>

  <div class="flex items-center gap-2">
    <div class="h-6 w-6 rounded" style="background-color: {value};" />
    {title}
  </div>
</ActionButton>

<style>
  .transparent-input :global(input) {
    background-color: transparent;
  }
</style>
