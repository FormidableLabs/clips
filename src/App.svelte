<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import { canvasStream, micStream } from "./stores";
  import ActionBar from "./components/ActionBar.svelte";

  let isRecording = false;
  let recorder: MediaRecorder;
  const chunks: Blob[] = [];
  const onDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };

  const onRecorderStop = () => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    const data = URL.createObjectURL(completeBlob);

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
    isRecording = true;
    chunks.length = 0;

    const combinedStream = new MediaStream([
      ...($canvasStream?.getTracks() || []),
      ...($micStream?.getTracks() || []),
    ]);
    recorder = new MediaRecorder(combinedStream, {
      mimeType: "video/webm; codecs=vp9",
    });
    recorder.ondataavailable = onDataAvailable;
    recorder.onstop = onRecorderStop;

    recorder.start();
  };
  const stopRecording = () => {
    isRecording = false;
    recorder.stop();
  };
  const onRecordButtonPress = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };
</script>

<div
  class="w-screen h-screen overflow-hidden bg-gray-100 p-0 sm:p-3 md:p-6 flex items-center"
>
  <div class="container flex gap-3">
    <div class="flex-grow relative overflow-hidden flex flex-col gap-3">
      <div class="flex-grow">
        <Preview />
      </div>
      <ActionBar {isRecording} on:record={onRecordButtonPress} />
    </div>
    <div class="bg-gray-200 w-64 flex-shrink-0 rounded overflow-auto">
      Configuration...
    </div>
  </div>
</div>

<style>
  .container {
    max-height: 800px;
  }
</style>
