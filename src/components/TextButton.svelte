<script lang="ts">
  export let extraClasses: string = "";
  export let isDisabled = false;
</script>

<button
  on:click
  class="rounded {isDisabled
    ? 'bg-opacity-30'
    : 'hover:bg-primary-200'} px-3 py-2 text-left transition transition-colors duration-150 ease-in-out {extraClasses}"
  disabled={isDisabled}
>
  <slot />
</button>
