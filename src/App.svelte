<script lang="ts">
  import { Muxer, ArrayBufferTarget } from "mp4-muxer";
  import Preview from "./components/Preview.svelte";
  import {
    canvas,
    canvasDimensions,
    canvasStream,
    isRecording,
    micState, recordingFPS,
    recordingStartTime
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

  // muxing
  let muxer!: Muxer<ArrayBufferTarget>;
  let lastKeyFrame = -Infinity;
  let framesGenerated = 0;
  let videoEncoder: VideoEncoder;
  let audioEncoder: AudioEncoder;
  let audioTrack: MediaStreamTrack;
  let intervalId = -Infinity;

  const onRecorderStop = async () => {

    // const duration = performance.now() - $recordingStartTime;
    // $recordingStartTime = null;
    //
    // const completeBlob = new Blob(chunks, { type: chunks[0].type });
    // const newBlob = await patchBlob(completeBlob, duration);
    // const data = URL.createObjectURL(newBlob);
    //
    // // return;
    //
    // const link = document.createElement("a");
    // link.href = data;
    // link.download = `video.${ext}`;
    // link.dispatchEvent(
    //   new MouseEvent("click", {
    //     bubbles: true,
    //     cancelable: false,
    //     view: window,
    //   })
    // );
    //
    // setTimeout(() => {
    //   URL.revokeObjectURL(data);
    //   link.remove();
    // }, 500);
  };

  const startRecording = () => {
    // TODO: This doesn't necessarily exist
    audioTrack = $micState.stream?.getAudioTracks?.()[0];
    const audioSampleRate = audioTrack?.getCapabilities().sampleRate.max;

    muxer = new Muxer<ArrayBufferTarget>({
      target: new ArrayBufferTarget(),
      video: {
        codec: "avc",
        width: $canvasDimensions.width,
        height: $canvasDimensions.height
      },
      audio: audioTrack ? {
        codec: "aac",
        sampleRate: audioSampleRate,
        numberOfChannels: 1
      } : undefined,
      firstTimestampBehavior: "offset"
    });

    videoEncoder = new VideoEncoder({
      output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
      error: e => console.error(e)
    });
    videoEncoder.configure({
      codec: "avc1.420034",
      width: $canvasDimensions.width,
      height: $canvasDimensions.height
    });

    if (audioTrack) {
      audioEncoder = new AudioEncoder({
        output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
        error: e => console.error(e)
      });
      audioEncoder.configure({
        codec: "mp4a.40.2",
        numberOfChannels: 1,
        sampleRate: audioSampleRate,
        bitrate: 128000
      });

      // Create a MediaStreamTrackProcessor to get AudioData chunks from the audio track
      // @ts-expect-error don't have types for MediaStreamTrackProcessor yet
      let trackProcessor = new MediaStreamTrackProcessor({ track: audioTrack });
      let consumer = new WritableStream({
        write(audioData) {
          if (!$isRecording) return;
          audioEncoder.encode(audioData);
          audioData.close();
        }
      });
      trackProcessor.readable.pipeTo(consumer);
    }

    $recordingStartTime = performance.now();
    lastKeyFrame = -Infinity;
    framesGenerated = 0;

    encodeVideoFrame()
    intervalId = setInterval(encodeVideoFrame, 1000 / $recordingFPS);
  };

  const encodeVideoFrame = () => {
    console.log("ENCODING");
    let elapsedTime = document.timeline.currentTime - $recordingStartTime;
    let frame = new VideoFrame($canvas, {
      timestamp: framesGenerated * 1e6 / $recordingFPS
    });
    framesGenerated++;

    // Ensure a video key frame at least every 10 seconds for good scrubbing
    let needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
    if (needsKeyFrame) lastKeyFrame = elapsedTime;

    videoEncoder.encode(frame, { keyFrame: needsKeyFrame });
    frame.close();

  };

  const stopRecording =async () => {
    console.log("STOPPING");
    $recordingStartTime = null;

    clearInterval(intervalId);
    audioTrack?.stop();

    await videoEncoder?.flush();
    await audioEncoder?.flush();
    muxer.finalize();

    // TODO: Download
    const blob = new Blob([muxer.target.buffer])
    const data = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = data;
    link.download = `video.mp4`;
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

    videoEncoder = null;
    audioEncoder = null;
    muxer = null;
  };
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
