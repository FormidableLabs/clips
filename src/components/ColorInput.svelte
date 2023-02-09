<script lang="ts">
  import InputLabel from "./InputLabel.svelte";

  export let name: string;
  export let placeholder = "#848484";
  export let title: string;
  export let value: string;
</script>

<div>
  <InputLabel {name}>{title}</InputLabel>
  <div class="mt-1 grid grid-cols-[1fr_auto_auto] bg-fmd-white overflow-hidden">
    <input
      type="color"
      {name}
      id={name}
      class="focus:ring-0 focus:border-fmd-red hover:border-b-fmd-yellow focus:border-r-fmd-gray block w-full sm:text-sm -md bg-transparent border-0 border-r-[1px] border-b-2 border-b-transparent border-r-fmd-gray transition transition-border"
      {placeholder}
      bind:value
    />
  </div>
</div>
