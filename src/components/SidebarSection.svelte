<script lang="ts">
  export let title: string;
</script>

<div class="flex flex-col gap-4">
  <div class="font-bold text-lg text-fmd-navy dark:text-white">{title}</div>
  <div class="">
    <slot />
  </div>
</div>
