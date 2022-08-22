<script lang="ts">
  import Preview from "./components/Preview.svelte";
  import ScreenSelection from "./components/ScreenSelection.svelte";
  import WebcamSelection from "./components/WebcamSelection.svelte";
  import { canvasStream } from "./stores";

  let isRecording = false;
  let recorder: MediaRecorder;
  let chunks: Blob[] = [];
  const onDataAvailable = (e: BlobEvent) => {
    chunks.push(e.data);
  };

  $: {
    if ($canvasStream) {
      console.log("SETTING")
      recorder ||= new MediaRecorder($canvasStream, {
        mimeType: "video/webm; codecs=vp9"
      });
      recorder.ondataavailable = onDataAvailable;
    }
  }

  const startRecording = () => {
    console.log("STARTING");
    isRecording = true;
    chunks = [];
    recorder.start();
  };

  const endRecording = () => {
    console.log("ENDING");
    isRecording = false;
    recorder.stop();

    console.log(chunks);

    const completeBlob = new Blob(chunks, { type: "video/webm" });
    const data = URL.createObjectURL(completeBlob);

    const link = document.createElement("a");
    link.href = data;
    link.download = "video.webm";
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: false,
        view: window
      })
    );

    setTimeout(() => {
      URL.revokeObjectURL(data);
      link.remove();
    }, 500);
  };

  const onRecordButtonPress = () => {
    if (isRecording) endRecording();
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
    ></div>
  </main>
  <div class="bg-blue-300 w-64 flex-shrink-0">
    <ScreenSelection />
    <WebcamSelection />
  </div>
</div>
