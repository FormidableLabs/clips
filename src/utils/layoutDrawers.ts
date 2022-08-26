import type { DrawFn } from "../stores";
import { HorizAlign, VertAlign } from "../stores";
import { circleClip, roundedRectClip } from "../drawUtils";

export const drawWebcam: DrawFn = (args) => {
  if (args.webcamStream) {
    const {
      ctx,
      webcamDimensions,
      webcamPreview,
      theme,
      webcamLayoutState,
      canvasSize,
    } = args;
    const { horizAlign, vertAlign } = webcamLayoutState;

    const { width, height } = canvasSize;
    const m = Math.max(width, height);
    const pad = m / 75;
    const r = m / 100;

    // TODO: Make this ratio configurable...
    const _w = Math.max(width, height) / 3.5;
    const _h = (_w * webcamDimensions.height) / webcamDimensions.width;
    const webcamRadius = Math.min(_w, _h) / 2;

    // Anchor points (for circle). Might have to change with rectangles?
    let x0 = pad + webcamRadius;
    if (horizAlign === HorizAlign.center) {
      x0 = width / 2;
    } else if (horizAlign === HorizAlign.right) {
      x0 = width - pad - webcamRadius;
    }

    let y0 = pad + webcamRadius;
    if (vertAlign === VertAlign.center) {
      y0 = height / 2;
    } else if (vertAlign === VertAlign.bottom) {
      y0 = height - pad - webcamRadius;
    }

    // Accent ring around webcam feed?
    ctx.globalCompositeOperation = "destination-out";
    ctx.save();
    // ctx.lineWidth = webcamAccentWidth * Math.max(width, height);
    ctx.lineWidth = 2 * pad;
    ctx.strokeStyle = theme.accent;
    ctx.beginPath();
    ctx.arc(x0, y0, webcamRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    ctx.globalCompositeOperation = "source-over";

    circleClip(ctx, x0, y0, webcamRadius, () => {
      ctx.drawImage(webcamPreview, x0 - _w / 2, y0 - _h / 2, _w, _h);
    });
  }
};

/**
 * Drawing screen share
 */
export const drawScreenShare: DrawFn = (args) => {
  // Screen
  if (args.displayStream) {
    const {
      ctx,
      displayDimensions,
      displayPreview,
      screenLayoutState,
      canvasSize,
    } = args;
    const { width, height } = canvasSize;
    const { horizAlign, vertAlign } = screenLayoutState;
    const m = Math.max(width, height);
    const pad = m / 75;
    const r = m / 100;

    const displayAspectRatio =
      displayDimensions.height / displayDimensions.width;

    let x0 = 0,
      y0 = 0,
      w = 0,
      h = 0;

    // Landscape mode. Always fills width, so no adjustment on x0. Need to adjust y0.
    if (displayAspectRatio * (width - 2 * pad) <= height - 2 * pad) {
      x0 = pad;
      w = width - 2 * pad;
      h = w * displayAspectRatio;
      if (vertAlign === VertAlign.top) {
        y0 = pad;
      } else if (vertAlign === VertAlign.center) {
        y0 = (height - h) / 2;
      } else if (vertAlign === VertAlign.bottom) {
        y0 = height - pad - h;
      }
    }
    // Portrait mode. Fill height, need to adjust x0.
    else {
      y0 = pad;
      h = height - 2 * pad;
      w = h / displayAspectRatio;
      if (horizAlign === HorizAlign.left) {
        x0 = pad;
      } else if (horizAlign === HorizAlign.center) {
        x0 = (width - w) / 2;
      } else if (horizAlign === HorizAlign.right) {
        x0 = width - pad - w;
      }
    }

    roundedRectClip(ctx, x0, y0, w, h, r, () => {
      ctx.drawImage(displayPreview, x0, y0, w, h);
    });
  }
};

/**
 * Draw a simple grid so it's a bit easier to see where we're at.
 */
export const drawHelperGrid: DrawFn = ({ ctx, canvasSize }) => {
  const { width, height } = canvasSize;

  ctx.lineWidth = width / 200;
  ctx.strokeStyle = "white";

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  ctx.restore();
};
