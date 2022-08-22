<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import ScreenSelection from "./components/ScreenSelection.svelte";
  import WebcamSelection from "./components/WebcamSelection.svelte";
  import { canvasStream } from "./stores";

  let isRecording = false;
  let recorder: MediaRecorder;
  const chunks: Blob[] = [];
  const onDataAvailable = (e: BlobEvent) => {
    console.log("ON DATA", e);
    chunks.push(e.data);
  };

  const onRecorderStop = () => {
    const completeBlob = new Blob(chunks, { type: chunks[0].type });
    const data = URL.createObjectURL(completeBlob);

    console.log(data);

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

  $: {
    if ($canvasStream) {
      console.log("SETTING");
      recorder ||= new MediaRecorder($canvasStream, {
        mimeType: "video/webm; codecs=vp9",
      });
      recorder.ondataavailable = onDataAvailable;
      recorder.onstop = onRecorderStop;
    }
  }

  const startRecording = () => {
    console.log("STARTING");
    isRecording = true;
    chunks.length = 0;
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

  /**
   * <button on:click={startStream}>Start</button>

   <!-- <canvas width="400px" height="400px" bind:this={canvas} /> -->
   <video bind:this={screenDisplay} autoplay style="display: none;" />
   <video bind:this={webcamDisplay} autoplay style="display: none;" />

   <canvas
   bind:this={canvas}
   width="3840px"
   height="2160px"
   style="transform: scale(0.15); transform-origin: top left;"
   />
   */
</script>

<div class="w-screen h-screen flex">
  <main class="bg-red-300 flex-grow relative overflow-hidden">
    <Preview />
    <div
      class="absolute bottom-4 right-4 w-12 h-12 bg-red-500 shadow rounded-full cursor-pointer"
      class:bg-red-500={isRecording}
      class:bg-gray-600={!isRecording}
      on:click={onRecordButtonPress}
    />
  </main>
  <div class="bg-blue-300 w-64 flex-shrink-0">
    <ScreenSelection />
    <WebcamSelection />
  </div>
</div>
