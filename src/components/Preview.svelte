<script lang="ts">
  import { onMount } from "svelte";
  import {
    canvasDimensions,
    webcamState,
    canvasStream,
    activeTheme,
    activeBackground,
    recordingFPS,
    micAnalyzer,
    webcamLayoutState,
    screenLayoutState,
    generalLayoutState,
    activeShare,
    webcamShapeOptions,
    WebcamShape,
  } from "../stores";
  import type { DrawArgs } from "../stores";
  import { drawScreenShare, drawWebcam } from "../utils/layoutDrawers";
  import Select from "./Select.svelte";
  import { titleCase } from "../utils/titleCase";
  import { clickOutside } from "../directives/clickOutside";
  import RangeInput from "./RangeInput.svelte";

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
  let isWebcamFocused = false;
  let webcamX = 0;
  let webcamY = 0;
  let webcamWidth = 0;
  let webcamHeight = 0;

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

  $: if (containerWidth / containerHeight <= 1) {
    webcamWidth = containerWidth * $webcamLayoutState.size;
    webcamHeight =
      $webcamLayoutState.shape === WebcamShape.circle
        ? webcamWidth
        : webcamWidth * ($webcamState.height / $webcamState.width);
  } else {
    webcamHeight = containerHeight * $webcamLayoutState.size;
    webcamWidth =
      $webcamLayoutState.shape === WebcamShape.circle
        ? webcamHeight
        : webcamHeight * ($webcamState.width / $webcamState.height);
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
    drawScreenShare(drawArgs, 0, 0);
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
      if (isMovingWebcam && isWebcamFocused) {
        webcamX = Math.min(
          Math.max(webcamX + e.movementX / containerWidth, 0),
          1 -
            (webcamWidth - (webcamWidth * $generalLayoutState.padding) / 2) /
              containerWidth
        );
        webcamY = Math.min(
          Math.max(webcamY + e.movementY / containerHeight, 0),
          1 -
            (webcamWidth - (webcamHeight * $generalLayoutState.padding) / 2) /
              containerHeight
        );
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
    {#if $webcamState.stream}
      <div
        class="absolute"
        style="top: {webcamY * containerHeight}px; left: {webcamX *
          containerWidth}px;"
        on:mousedown={() => (isWebcamFocused = true)}
        use:clickOutside
        on:outclick={() => (isWebcamFocused = false)}
      >
        <div class="relative">
          <div
            class="self-start {isMovingWebcam && isWebcamFocused
              ? 'cursor-grabbing'
              : 'cursor-grab'} {isWebcamFocused
              ? 'border-2 border-fmd-sky/80'
              : ''}"
            style="height: {webcamHeight -
              ($generalLayoutState.padding / 2) *
                webcamHeight}px; width: {webcamWidth -
              ($generalLayoutState.padding / 2) * webcamWidth}px;"
            on:mousedown={() => (isMovingWebcam = true)}
            on:mouseup={() => (isMovingWebcam = false)}
          />

          {#if isWebcamFocused}
            <div
              class="w-[140px] absolute"
              style="top: {webcamY < 0.2 ? webcamHeight : -120}px"
            >
              <RangeInput
                name="webcamWidth"
                title="Size"
                bind:value={$webcamLayoutState.size}
                min={0}
                max={1}
                step={0.02}
              />
              {#if $webcamLayoutState.shape === WebcamShape.initial}
                <RangeInput
                  name="webcamBorderRadius"
                  title="Border radius"
                  bind:value={$webcamLayoutState.borderRadius}
                  min={0}
                  max={1}
                  step={0.02}
                />
              {/if}
              <Select
                title=""
                name="webcamShape"
                options={webcamShapeOptions.map((val) => ({
                  title: titleCase(val),
                  value: val,
                }))}
                bind:value={$webcamLayoutState.shape}
                isDropdown={false}
              />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
