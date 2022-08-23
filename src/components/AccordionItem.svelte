<script lang="ts">
  import { accordion } from "../directives/accordion";

  export let title: string;
  export let isOpen: boolean = false;

  const toggleVisibility = () => {
    isOpen = !isOpen;
  };

</script>

<div>
  <button class="w-full p-2" on:click={toggleVisibility} aria-expanded={String(isOpen)}>{title}</button>
  <div use:accordion={{isOpen, duration: 200}}>
    <slot />
  </div>
</div>
