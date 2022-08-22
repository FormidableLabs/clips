<script lang="ts">
  import { onMount } from "svelte";
  import {
    canvasDimensions,
    displayPreview,
    displayDimensions,
    webcamPreview,
    webcamDimensions, canvasStream
  } from "../stores";
  import { roundedRectClip } from "../drawUtils";

  // Container measurements
  let container: HTMLDivElement;
  let containerWidth = 100,
    containerHeight = 100;
  let scale = 0;

  // Canvas tracking
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Track container sizing, so we can scale accordingly.
  const measure = () => {
    const { width, height } = container.getBoundingClientRect();
    [containerWidth, containerHeight] = [width, height];
    scale = containerWidth / $canvasDimensions.width;
  };

  /**
   * On mount:
   * - do initial measure
   * - grab context
   * - setup canvas streaming context
   * - Fix off render loop
   */
  onMount(() => {
    measure();
    ctx ||= canvas.getContext("2d");
    $canvasStream = canvas.captureStream(60);
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
      lingrad.addColorStop(0, "#ff0000");
      lingrad.addColorStop(1, "#ff00ff");

      ctx.fillStyle = lingrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    }

    DrawDisplay: {
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

    DrawWebcam: {
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

      const rg = ctx.createLinearGradient(0, 500, 0, 0);
      rg.addColorStop(0, "#ff0000");
      rg.addColorStop(1, "#00ff00");

      ctx.lineWidth = 20;
      ctx.strokeStyle = rg;
      ctx.beginPath();
      ctx.arc(x0, y0, r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  };
</script>

<svelte:window on:resize={measure} />

<div class="w-full h-full flex justify-center items-center p-3">
  <div
    class="bg-green-400 w-full overflow-hidden rounded shadow-lg"
    style="aspect-ratio: {$canvasDimensions.width}/{$canvasDimensions.height};"
    bind:this={container}
  >
    <canvas
      width="{$canvasDimensions.width}px"
      height="{$canvasDimensions.height}px"
      style="transform: scale({scale}); transform-origin: top left;"
      bind:this={canvas}></canvas>
  </div>
</div>
