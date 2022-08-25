<script lang="ts">
  // From here: https://github.com/Schum123/svelte-loading-spinners/blob/master/src/Rainbow.svelte
  export let unit: string = "px";
  export let size: string = "60";
</script>

<div class="flex flex-col items-center gap-0.5">
  <div class="wrapper" style="--size: {size}{unit}; --duration: 1.5s;">
    <div
      class="rainbow border-l-fmd-gray border-b-fmd-gray border-t-fmd-yellow border-r-primary-fmd-yellow"
    />
  </div>
  <div class="text-sm font-medium text-gray-700"><slot /></div>
</div>

<style>
  .wrapper {
    width: var(--size);
    height: calc(var(--size) / 2);
    overflow: hidden;
  }
  .rainbow {
    width: var(--size);
    height: var(--size);
    /*border-left-color: transparent;*/
    /*border-bottom-color: transparent;*/
    box-sizing: border-box;
    transform: rotate(-200deg);
    border-radius: 50%;
    border-style: solid;
    animation: var(--duration) ease-in-out 0s infinite normal none running
      rotate;
  }
  @keyframes rotate {
    0% {
      border-width: 10px;
    }
    25% {
      border-width: 3px;
    }
    50% {
      transform: rotate(115deg);
      border-width: 10px;
    }
    75% {
      border-width: 3px;
    }
    100% {
      border-width: 10px;
    }
  }
</style>
