<script lang="ts">
  export let title: string;
</script>

<div class="p-2 flex flex-col gap-2">
  <div class="font-bold text-gray-700 px-2">{title}</div>
  <div class=""><slot /></div>
</div>
