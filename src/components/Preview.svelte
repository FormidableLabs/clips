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
  } from "../stores";
  import { roundedRectClip } from "../drawUtils";

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
    // const { width, height } = container.getBoundingClientRect();
    // [containerWidth, containerHeight] = [width, height];
    // scale = containerWidth / $canvasDimensions.width;

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

    // if (wrapper) {
    //   const { width, height } = wrapper.getBoundingClientRect();
    //   fillClass =
    //     ($canvasDimensions.height / $canvasDimensions.width) * width > height
    //       ? "h-full"
    //       : "w-full";
    // }
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
    $canvasStream = canvas.captureStream(15);
    draw();
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    DrawBackground: {
      ctx.save();

      const lingrad = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      lingrad.addColorStop(0, $activeTheme.primary);
      lingrad.addColorStop(1, $activeTheme.secondary);

      ctx.fillStyle = lingrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    }

    if ($displayStream) {
      const pad = 100;
      const { width, height } = $displayDimensions;

      const x0 = pad,
        y0 = pad,
        w = (width / height) * canvas.height - 2 * pad,
        h = canvas.height - 2 * pad;

      roundedRectClip(ctx, x0, y0, w, h, 20, () => {
        ctx.drawImage($displayPreview, x0, y0, w, h);
      });
    }

    if ($webcamStream) {
      const pad = 100;
      const { width, height } = $webcamDimensions;

      const _w = 1200;
      const _h = (height / width) * _w;
      const r = Math.min(_w, _h) / 2;

      // Center of where video should go
      const x0 = canvas.width - pad - r;
      const y0 = canvas.height - pad - r;

      // Clip to a circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(x0, y0, r, 0, 2 * Math.PI);
      ctx.clip();

      ctx.globalCompositeOperation = "source-atop";

      // Draw in the image
      ctx.drawImage($webcamPreview, x0 - _w / 2, y0 - _h / 2, _w, _h);
      // And restore.
      ctx.restore();

      // Draw a circle around the image to hide lack of antialiasing
      ctx.save();
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(x0, y0, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  };
</script>

<svelte:window on:resize={measure} />

<div class="w-full h-full flex justify-center items-center" bind:this={wrapper}>
  <div
    class="bg-green-400 overflow-hidden rounded shadow-lg"
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
