<script lang="ts">
  import { onMount } from "svelte";
  import {
    canvasDimensions,
    webcamState,
    canvasStream,
    displayStream,
    activeTheme,
    activeBackground,
    recordingFPS,
    micAnalyzer,
    webcamLayoutState,
    screenLayoutState,
    generalLayoutState,
    activeShare,
    WebcamShape,
  } from "../stores";
  import type { DrawArgs } from "../stores";
  import {
    drawHelperGrid,
    drawScreenShare,
    drawWebcam,
  } from "../utils/layoutDrawers";

  // Container measurements
  let wrapper: HTMLDivElement;
  let containerWidth = 0,
    containerHeight = 0;
  let scale = 0;

  // Canvas tracking
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Position values
  let isMovingWebcam = false;
  let webcamX = 0;
  let webcamY = 0;

  // Track container sizing, so we can scale accordingly.
  const measure = () => {
    const { width, height } = wrapper.getBoundingClientRect();
    if (($canvasDimensions.height / $canvasDimensions.width) * width > height) {
      containerHeight = height;
      containerWidth =
        height / ($canvasDimensions.height / $canvasDimensions.width);
    } else {
      containerWidth = width;
      containerHeight =
        width * ($canvasDimensions.height / $canvasDimensions.width);
    }

    scale = containerWidth / $canvasDimensions.width;
  };

  $: if (wrapper && $canvasDimensions) {
    measure();
  }

  // On mount, get canvas render context
  onMount(() => {
    ctx ||= canvas.getContext("2d");
  });

  // Kick off drawing process based on recordingFPS
  $: if (drawArgs.ctx) startDraw($recordingFPS);

  // Setting up canvas capture stream
  $: if (canvas) {
    if ($canvasStream) {
      $canvasStream.getTracks().forEach((track) => track.stop());
    }
    $canvasStream = canvas.captureStream($recordingFPS);
  }

  // Track drawArgs
  let drawArgs: DrawArgs = {
    ctx,
    theme: $activeTheme,
    canvasSize: $canvasDimensions,
    activeShare: $activeShare,
    webcamState: $webcamState,
    micAnalyzer: $micAnalyzer,
    webcamLayoutState: $webcamLayoutState,
    screenLayoutState: $screenLayoutState,
    generalLayoutState: $generalLayoutState,
  };
  $: {
    drawArgs.ctx = ctx;
    drawArgs.theme = $activeTheme;
    drawArgs.canvasSize = $canvasDimensions;
    drawArgs.micAnalyzer = $micAnalyzer;
    drawArgs.activeShare = $activeShare;
  }

  /**
   * Some internal state for raf loop and FPS.
   */
  let then: number,
    startTime: number,
    now: number,
    elapsed: number,
    fpsInterval: number;

  // Kick off the drawing process with a desired FPS
  const startDraw = (desiredFps: number) => {
    fpsInterval = 1000 / desiredFps;
    then = performance.now();
    startTime = then;

    draw();
    requestAnimationFrame(loop);
  };

  // raf loop
  const loop = (newTime: number) => {
    // Handle FPS stuff
    now = newTime;
    elapsed = now - then;
    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval);
      draw();
    }

    requestAnimationFrame(loop);
  };

  // Actual draw fn
  const draw = () => {
    // Note: this is a bit of a hack, but avoids Svelte's reactivity from triggering
    //  reactive block above that calls `startDraw`.
    const c = drawArgs.ctx;

    // Draw
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.imageSmoothingQuality = "high";
    c.globalCompositeOperation = "source-over";
    drawScreenShare(drawArgs);
    drawWebcam(drawArgs, webcamX, webcamY);

    // Background gets drawn last
    c.globalCompositeOperation = "destination-over";
    $activeBackground?.draw(drawArgs, 0, 0);
  };
</script>

<svelte:window on:resize={measure} />

<div class="w-full h-full flex justify-center items-center" bind:this={wrapper}>
  <div
    on:mousemove={(e) => {
      if (isMovingWebcam) {
        webcamX += e.movementX / containerWidth;
        webcamY += e.movementY / containerHeight;
      }
    }}
    class="bg-gray-300 overflow-hidden rounded shadow-lg relative"
    style="aspect-ratio: {$canvasDimensions.width}/{$canvasDimensions.height}; width: {containerWidth}px; height: {containerHeight}px"
  >
    <canvas
      width="{$canvasDimensions.width}px"
      height="{$canvasDimensions.height}px"
      style="transform: scale({scale}); transform-origin: top left;"
      bind:this={canvas}
    />
    <div
      class="absolute"
      style="top: {webcamY * containerHeight}px; left: {webcamX *
        containerWidth}px; height:{$webcamState.height *
        $webcamLayoutState.size}px; width: {$webcamLayoutState.shape ===
      WebcamShape.circle
        ? $webcamState.height * $webcamLayoutState.size
        : $webcamState.width * $webcamLayoutState.size}px;"
      on:mousedown={() => (isMovingWebcam = true)}
      on:mouseup={() => (isMovingWebcam = false)}
    />
  </div>
</div>
