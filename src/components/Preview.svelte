<script lang="ts">
  import { onMount } from "svelte";
  import {
    canvasDimensions,
    displayPreview,
    displayDimensions,
    webcamPreview,
    webcamDimensions,
    canvasStream,
    webcamStream,
    displayStream,
    activeTheme,
    activeBackground,
    activeLayout,
    recordingFPS,
    micAnalyzer,
  } from "../stores";
  import type { DrawArgs } from "../stores";

  // Container measurements
  let wrapper: HTMLDivElement;
  let containerWidth = 0,
    containerHeight = 0;
  let scale = 0;

  // Canvas tracking
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

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

  /**
   * On mount:
   * - do initial measure
   * - grab context
   * - setup canvas streaming context
   * - Fix off render loop
   */
  onMount(() => {
    ctx ||= canvas.getContext("2d");
    draw();
  });

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
    displayStream: $displayStream,
    displayDimensions: $displayDimensions,
    displayPreview: $displayPreview,
    webcamStream: $webcamStream,
    webcamDimensions: $webcamDimensions,
    webcamPreview: $webcamPreview,
    micAnalyzer: $micAnalyzer,
  };
  $: {
    drawArgs.ctx = ctx;
    drawArgs.theme = $activeTheme;
    drawArgs.canvasSize = $canvasDimensions;
    drawArgs.displayStream = $displayStream;
    drawArgs.displayDimensions = $displayDimensions;
    drawArgs.displayPreview = $displayPreview;
    drawArgs.webcamStream = $webcamStream;
    drawArgs.webcamDimensions = $webcamDimensions;
    drawArgs.webcamPreview = $webcamPreview;
    drawArgs.micAnalyzer = $micAnalyzer;
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = "high";
    ctx.globalCompositeOperation = "source-over";

    if (drawArgs.ctx) {
      $activeLayout?.draw(drawArgs);

      // Background gets drawn last
      ctx.globalCompositeOperation = "destination-over";
      $activeBackground?.draw(drawArgs);
    }

    requestAnimationFrame(draw);
  };
</script>

<svelte:window on:resize={measure} />

<div class="w-full h-full flex justify-center items-center" bind:this={wrapper}>
  <div
    class="bg-gray-300 overflow-hidden rounded shadow-lg"
    style="aspect-ratio: {$canvasDimensions.width}/{$canvasDimensions.height}; width: {containerWidth}px; height: {containerHeight}px"
  >
    <canvas
      width="{$canvasDimensions.width}px"
      height="{$canvasDimensions.height}px"
      style="transform: scale({scale}); transform-origin: top left;"
      bind:this={canvas}
    />
  </div>
</div>
