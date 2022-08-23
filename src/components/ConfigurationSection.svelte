<script lang="ts">
  export let title: string;
</script>


<div>
  <div class="text-lg p-1">{title}</div>
  <div class="p-1">
    <slot />
  </div>
</div>
