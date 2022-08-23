<script lang="ts">
  export let extraClasses: string = "";
</script>

<button
  on:click
  class="rounded hover:bg-primary-200 px-3 py-2 text-left transition transition-colors duration-150 ease-in-out {extraClasses}"
>
  <slot />
</button>
