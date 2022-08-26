<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import {
    canvasStream,
    isRecording,
    micStream,
    recordingStartTime,
  } from "./stores";
  import ActionBar from "./components/ActionBar.svelte";
  import SidebarCanvasSection from "./components/SidebarCanvasSection.svelte";
  import SidebarThemeSection from "./components/SidebarThemeSection.svelte";
  import SidebarBackgroundSection from "./components/SidebarBackgroundSection.svelte";
  import FormidableIcon from "./components/icons/formidable.icon.svelte";
  import GithubIcon from "./components/icons/github.icon.svelte";
  import { patchBlob } from "./utils/blobHelpers";
  import WebcamLayoutSection from "./components/WebcamLayoutSection.svelte";
  import ScreenLayout from "./components/ScreenLayout.svelte";
  import GeneralLayoutSection from "./components/GeneralLayoutSection.svelte";

  let recorder: MediaRecorder;
  const chunks: Blob[] = [];
  const onDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };

  const onRecorderStop = async () => {
    const duration = Date.now() - $recordingStartTime;
    $recordingStartTime = null;

    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    const newBlob = await patchBlob(completeBlob, duration);
    const data = URL.createObjectURL(newBlob);

    // return;

    const link = document.createElement("a");
    link.href = data;
    link.download = "video.webm";
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
        view: window,
      })
    );

    setTimeout(() => {
      URL.revokeObjectURL(data);
      link.remove();
    }, 500);
  };

  const startRecording = () => {
    $recordingStartTime = Date.now();
    chunks.length = 0;

    const combinedStream = new MediaStream([
      ...($canvasStream?.getTracks() || []),
      ...($micStream?.getTracks() || []),
    ]);
    // TODO: dynamic bits per second based on resolution...
    recorder = new MediaRecorder(combinedStream, {
      audioBitsPerSecond: 128000, // 128 kbps
      videoBitsPerSecond: 10 * 1000 * 1000, // N mbps
      mimeType: "video/webm;codecs=vp9",
    });
    recorder.ondataavailable = onDataAvailable;
    recorder.onstop = onRecorderStop;

    recorder.start();
  };
  const stopRecording = () => {
    recorder.stop();
  };
  const onRecordButtonPress = () => {
    if ($isRecording) stopRecording();
    else startRecording();
  };
</script>

<div
  class="w-screen h-screen overflow-hidden bg-fmd-gray_lighter p-0 sm:p-3 md:p-6 flex items-center relative"
>
  <div class="container flex gap-4">
    <div
      class="relative flex flex-col gap-4 flex-grow max-w-[calc(100%-250px)]"
    >
      <div class="flex-grow overflow-hidden">
        <Preview />
      </div>
      <ActionBar on:record={onRecordButtonPress} />
    </div>
    <div
      class="bg-fmd-gray w-72 h-full flex-shrink-0 rounded overflow-auto flex flex-col gap-1"
    >
      <SidebarCanvasSection />
      <SidebarThemeSection />
      <SidebarBackgroundSection />
      <GeneralLayoutSection />
      <WebcamLayoutSection />
      <ScreenLayout />
    </div>
  </div>

  <div class="absolute top-0 left-0 p-4 flex gap-4 items-center text-fmd-navy">
    <a
      class="w-10 hover:text-fmd-sky transition transition-colors duration-100 ease-in-out"
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

<style>
  .container {
    height: 1000px;
    max-height: 100%;
  }
</style>
