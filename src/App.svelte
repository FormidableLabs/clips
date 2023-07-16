<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import { isPreparingForDownload, isRecording } from "./stores";
  import ActionBar from "./components/ActionBar.svelte";
  import SidebarThemeSection from "./components/SidebarThemeSection.svelte";
  import FormidableIcon from "./components/icons/formidable.icon.svelte";
  import GithubIcon from "./components/icons/github.icon.svelte";
  import LoadingDotsIcon from "./components/icons/loadingDots.icon.svelte";
  import { startRecording, stopRecording } from "./utils/recording";

  const onRecordButtonPress = () => {
    if ($isRecording) stopRecording();
    else startRecording();
  };
</script>

<div
  class="w-screen h-screen overflow-hidden bg-fmd-white p-0 sm:p-3 md:pr-0 sm:p-3 md:pr-0 flex items-center relative dark:bg-fmd-navy"
>
  <div class="w-full flex gap-12 mr-0 ml-9 h-full">
    <div
      class="relative flex flex-col gap-4 flex-grow max-w-[calc(100%-350px)]"
    >
      <div class="flex-grow overflow-hidden">
        <Preview />
      </div>
      <ActionBar on:record={onRecordButtonPress} />
    </div>
    <div
      class="border-l-[1px] border-fmd-gray w-1/3 flex flex-col gap-10 px-6 dark:border-fmd-blue"
    >
      <SidebarThemeSection />
    </div>
  </div>

  <div
    class="absolute bottom-0 right-0 p-4 flex gap-4 items-center text-fmd-navy dark:text-fmd-white"
  >
    <a
      class="w-10 hover:text-fmd-red transition transition-colors duration-100 ease-in-out"
      aria-label="Formidable logo"
      href="https://formidable.com"
      target="_blank"
      rel="noreferrer"
    >
      <FormidableIcon />
    </a>
    <a
      class="w-7 hover:text-fmd-sky transition transition-colors duration-100 ease-in-out"
      aria-label="GitHub logo"
      href="https://github.com/FormidableLabs/clips"
      target="_blank"
      rel="noreferrer"
    >
      <GithubIcon />
    </a>
  </div>
</div>

{#if $isPreparingForDownload}
  <div
    class="fixed inset-0 bg-white dark:bg-gray-800 bg-opacity-90 flex items-center justify-center"
  >
    <div class="text-center flex flex-col items-center">
      <div class="w-24">
        <LoadingDotsIcon />
      </div>
      <h2 class="text-xl font-bold mb-1">Hold tight!</h2>
      <h2>Compressing for download...</h2>
    </div>
  </div>
{/if}
