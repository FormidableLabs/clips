import { ArrayBufferTarget, Muxer } from "mp4-muxer";
import {
  canvas,
  canvasDimensions,
  isPreparingForDownload,
  micState,
  recordingFPS,
  recordingStartTime,
} from "../stores";
import { get } from "svelte/store";
import { downloadBlob } from "./downloadBlob";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

// muxing
let muxer: Muxer<ArrayBufferTarget> | null = null;
let lastKeyFrame = -Infinity;
let framesGenerated = 0;
let videoEncoder: VideoEncoder | null = null;
let audioEncoder: AudioEncoder | null = null;
let audioTrack: MediaStreamTrack | undefined = undefined;
let intervalId: NodeJS.Timer;

let $canvas = get(canvas);
let $fps = get(recordingFPS);
let $recordingStartTime = get(recordingStartTime);

/**
 * Kick off the recording process.
 */
export const startRecording = () => {
  $fps = get(recordingFPS);
  $recordingStartTime = get(recordingStartTime);
  $canvas = get(canvas);

  // TODO: This doesn't necessarily exist
  audioTrack = get(micState).stream?.getAudioTracks?.()[0];
  const audioSampleRate = audioTrack?.getCapabilities()?.sampleRate?.max || 0;

  const { width, height } = get(canvasDimensions);
  muxer = new Muxer<ArrayBufferTarget>({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width, height },
    audio: audioTrack
      ? {
          codec: "aac",
          sampleRate: audioSampleRate,
          numberOfChannels: 1,
        }
      : undefined,
    firstTimestampBehavior: "offset",
  });

  videoEncoder = new VideoEncoder({
    output: (chunk, meta) => meta && muxer?.addVideoChunk(chunk, meta),
    error: (e) => console.error(e),
  });
  videoEncoder.configure({ codec: "avc1.420034", width, height });

  if (audioTrack) {
    audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer?.addAudioChunk(chunk, meta),
      error: (e) => console.error(e),
    });
    audioEncoder.configure({
      codec: "mp4a.40.2",
      numberOfChannels: 1,
      sampleRate: audioSampleRate,
      bitrate: 128000,
    });

    // Create a MediaStreamTrackProcessor to get AudioData chunks from the audio track
    // @ts-expect-error too tired to quiet TS
    const trackProcessor = new MediaStreamTrackProcessor({ track: audioTrack });
    const consumer = new WritableStream({
      write(audioData) {
        if (!$recordingStartTime) return;
        audioEncoder?.encode(audioData);
        audioData.close();
      },
    });
    trackProcessor.readable.pipeTo(consumer);
  }

  // Set some values to bootstrap recording process tracking
  recordingStartTime.set(performance.now());
  $recordingStartTime = get(recordingStartTime);
  lastKeyFrame = -Infinity;
  framesGenerated = 0;

  // Kick off the encoding process
  encodeVideoFrame();
  intervalId = setInterval(encodeVideoFrame, 1000 / $fps);
};

/**
 * Encode individual video frames.
 */
const encodeVideoFrame = () => {
  if (!$recordingStartTime) return;
  const elapsedTime = performance.now() - $recordingStartTime;
  const frame = new VideoFrame($canvas, {
    timestamp: (framesGenerated * 1e6) / $fps,
  });
  framesGenerated++;

  // Ensure a video key frame at least every 10 seconds for good scrubbing
  const needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
  if (needsKeyFrame) lastKeyFrame = elapsedTime;

  videoEncoder?.encode(frame, { keyFrame: needsKeyFrame });
  frame.close();
};

/**
 * Stop recording, download video, and tidy up a bit.
 */
export const stopRecording = async () => {
  isPreparingForDownload.set(true);
  try {
    recordingStartTime.set(null);

    clearInterval(intervalId);
    audioTrack?.stop();

    // Flush queues and finalize mux
    await videoEncoder?.flush();
    await audioEncoder?.flush();
    muxer?.finalize();

    // Close out the encoder to free up resources
    videoEncoder?.close();
    audioEncoder?.close();

    // Download the blob
    if (muxer) {
      const rawBlob = new Blob([muxer.target.buffer]);

      // Run blob through ffmpeg to compress the output.
      if (!ffmpeg.isLoaded()) await ffmpeg.load();
      await ffmpeg.FS("writeFile", "input.mp4", await fetchFile(rawBlob));
      await ffmpeg.run("-i", "input.mp4", "output.mp4");
      const data = await ffmpeg.FS("readFile", "output.mp4");

      await downloadBlob(new Blob([data.buffer]));
      isPreparingForDownload.set(false);
    }
  } catch {
    /* no-op */
  }

  videoEncoder = null;
  audioEncoder = null;
  muxer = null;
};