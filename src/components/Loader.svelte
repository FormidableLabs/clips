<div class="flex flex-col items-center gap-2 w-full">
  <div class="h-0.5 w-full bg-fmd-gray relative">
    <div class="h-0.5 w-12 bg-fmd-red slide absolute" />
  </div>
  <div class="text-sm font-medium text-gray-700 dark:text-white"><slot /></div>
</div>

<style>
  .slide {
    animation: 1200ms linear slide infinite;
  }

  @keyframes slide {
    0% {
      left: 0;
    }

    50% {
      left: calc(100% - 48px);
    }

    100% {
      left: 0;
    }
  }
</style>
