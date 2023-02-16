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
    HorizAlign,
    VertAlign,
    screenShareState,
  } from "../stores";
  import type { DrawArgs } from "../stores";
  import { drawScreenShare, drawWebcam } from "../utils/layoutDrawers";
  import Select from "./Select.svelte";
  import { clickOutside } from "../directives/clickOutside";
  import RangeInput from "./RangeInput.svelte";
  import BorderRadius from "./icons/borderRadius.icon.svelte";

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

  let isScreenFocused = false;

  $: displayAspectRatio = $activeShare?.width
    ? $activeShare.height / $activeShare.width
    : 1;

  $: isScreenLandscape =
    displayAspectRatio * $canvasDimensions.width <= $canvasDimensions.height;

  const getAlignmentCssValue = (alignment: string) => {
    switch (alignment) {
      case HorizAlign.left:
      case VertAlign.top:
        return "flex-start";
      case HorizAlign.center:
      case VertAlign.center:
        return "center";
      default:
        return "flex-end";
    }
  };
  $: console.log($activeShare?.width / $canvasDimensions.width);
  $: screenStyles = `
    width: ${
      isScreenLandscape
        ? 100
        : ($canvasDimensions.height /
            (displayAspectRatio * $canvasDimensions.width)) *
          100
    }%;
    height: ${
      isScreenLandscape
        ? ((displayAspectRatio * $canvasDimensions.width) /
            $canvasDimensions.height) *
          100
        : 100
    }%;
    ${
      isScreenLandscape
        ? `align-self: ${getAlignmentCssValue($screenLayoutState.vertAlign)};`
        : `justify-self: ${getAlignmentCssValue(
            $screenLayoutState.horizAlign
          )};`
    }
  `;

  const webcamShapeOptionsWithLabels = [
    { title: "●", value: webcamShapeOptions[0] },
    { title: "■", value: webcamShapeOptions[1] },
  ];

  const horizScreenAlignOptionsWithLabels = [
    { title: "◀", value: HorizAlign.left },
    { title: "●", value: HorizAlign.center },
    { title: "▶", value: HorizAlign.right },
  ];

  const vertScreenAlignOptionsWithLabels = [
    { title: "▲", value: VertAlign.top },
    { title: "●", value: VertAlign.center },
    { title: "▼", value: VertAlign.bottom },
  ];

  const sizeOptions = [
    { title: "S", value: 0.15 },
    { title: "M", value: 0.25 },
    { title: "L", value: 0.4 },
    { title: "XL", value: 0.8 },
  ];

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
    drawScreenShare(drawArgs);
    drawWebcam(drawArgs, webcamX, webcamY);

    // Background gets drawn last
    c.globalCompositeOperation = "destination-over";
    $activeBackground?.draw(drawArgs);
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
            (webcamHeight - (webcamHeight * $generalLayoutState.padding) / 2) /
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
    {#if $activeShare}
      <div class="absolute top-0 left-0 w-full h-full grid">
        <div
          class="flex items-center justify-center transition transition-all duration-150 hover:bg-fmd-black/50 {isScreenFocused
            ? 'bg-fmd-black/50'
            : ''}"
          style={screenStyles}
          on:mousedown={() => (isScreenFocused = true)}
          use:clickOutside
          on:outclick={() => (isScreenFocused = false)}
        >
          {#if isScreenFocused}
            <div class="w-[100px]">
              {#if isScreenLandscape}
                <Select
                  title=""
                  name="screenAlign"
                  options={vertScreenAlignOptionsWithLabels}
                  bind:value={$screenLayoutState.vertAlign}
                  isDropdown={false}
                />
              {:else}
                <Select
                  title=""
                  name="screenAlign"
                  options={horizScreenAlignOptionsWithLabels}
                  bind:value={$screenLayoutState.horizAlign}
                  isDropdown={false}
                />
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
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
              class="flex items-center absolute items-end gap-2"
              style="top: {webcamY < 0.2 ? webcamHeight : -60}px; {webcamX > 0.5
                ? 'right: 0;'
                : ''}"
            >
              <div class="w-[80px]">
                <Select
                  title=""
                  name="webcamShape"
                  options={webcamShapeOptionsWithLabels.map((val) => ({
                    title: val.title,
                    value: val.value,
                  }))}
                  bind:value={$webcamLayoutState.shape}
                  isDropdown={false}
                />
              </div>
              <div class="w-[150px]">
                <Select
                  title=""
                  name="webcamWidth"
                  options={sizeOptions}
                  isDropdown={false}
                  bind:value={$webcamLayoutState.size}
                />
              </div>
              {#if $webcamLayoutState.shape === WebcamShape.initial}
                <div
                  class="flex items-center w-[180px] border border-fmd-gray rounded mt-2 px-3 bg-fmd-gray_lighter"
                >
                  <div class="w-10 pr-3 py-3 border-r mr-2">
                    <BorderRadius />
                  </div>

                  <RangeInput
                    name="webcamBorderRadius"
                    title=""
                    bind:value={$webcamLayoutState.borderRadius}
                    min={0}
                    max={1}
                    step={0.02}
                    showPercentage={false}
                  />
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
