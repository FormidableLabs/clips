<script lang="ts">
  export let title: string;
</script>

<div class="p-3 flex flex-col gap-3">
  <div class="font-bold text-lg text-fmd-navy">{title}</div>
  <div class="">
    <slot />
  </div>
</div>
