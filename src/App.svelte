<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import {
    canvasStream,
    isRecording,
    micState,
    recordingStartTime,
  } from "./stores";
  import ActionBar from "./components/ActionBar.svelte";
  import SidebarThemeSection from "./components/SidebarThemeSection.svelte";
  import FormidableIcon from "./components/icons/formidable.icon.svelte";
  import GithubIcon from "./components/icons/github.icon.svelte";
  import { patchBlob } from "./utils/blobHelpers";
  import { getPreferredMimeType } from "./utils/getPreferredMimeType";

  let recorder: MediaRecorder;
  const chunks: Blob[] = [];
  let ext: string = "";
  const onDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };

  const onRecorderStop = async () => {
    const duration = performance.now() - $recordingStartTime;
    $recordingStartTime = null;

    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    const newBlob = await patchBlob(completeBlob, duration);
    const data = URL.createObjectURL(newBlob);

    // return;

    const link = document.createElement("a");
    link.href = data;
    link.download = `video.${ext}`;
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
    $recordingStartTime = performance.now();
    chunks.length = 0;

    const combinedStream = new MediaStream([
      ...($canvasStream?.getTracks() || []),
      ...($micState.stream?.getTracks() || []),
    ]);
    // TODO: dynamic bits per second based on resolution...
    const mime = getPreferredMimeType();
    ext = mime.ext;
    recorder = new MediaRecorder(combinedStream, {
      audioBitsPerSecond: 128000, // 128 kbps
      videoBitsPerSecond: 10 * 1000 * 1000, // N mbps
      mimeType: mime.mimeType,
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
  class="w-screen h-screen overflow-hidden bg-fmd-gray_lighter p-0 sm:p-3 md:pr-0 sm:p-3 md:pr-0 flex items-center relative dark:bg-fmd-navy"
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
