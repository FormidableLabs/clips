<script lang="ts">
  export let name: string = "";
</script>

<label for={name} class="block text-sm font-medium text-fmd-navy dark:text-white">
  <slot />
</label>
