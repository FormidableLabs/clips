import type { DrawFn } from "../stores";
import { circleClip, roundedRectClip } from "../drawUtils";

/**
 * Webcam only
 */
export const webcamOnlyLayout: DrawFn = ({
  ctx,
  canvasSize,
  theme,
  webcamStream,
  webcamPreview,
  webcamDimensions,
}) => {
  if (!webcamStream) return;

  const { width, height } = canvasSize;
  const webcamAspectRatio = webcamDimensions.height / webcamDimensions.width;

  const pad = Math.max(width, height) / 75;
  const r = Math.max(width, height) / 100;

  let x0 = 0,
    y0 = 0,
    w = 0,
    h = 0;
  // Landscape mode
  if (webcamAspectRatio * (width - 2 * pad) <= height - 2 * pad) {
    x0 = pad;
    w = width - 2 * pad;
    h = w * webcamAspectRatio;
    y0 = (height - h) / 2;
  }
  // Portrait mode
  else {
    y0 = pad;
    h = height - 2 * pad;
    w = h / webcamAspectRatio;
    x0 = (width - w) / 2;
  }

  // TODO: Would like to add a drop shadow to the display, but that's hard
  roundedRectClip(ctx, x0, y0, w, h, r, () => {
    ctx.drawImage(webcamPreview, x0, y0, w, h);
  });
};

/**
 * Screenshare only
 */
export const screenshareOnlyLayout: DrawFn = ({
  ctx,
  canvasSize,
  displayStream,
  displayDimensions,
  displayPreview,
  theme,
}) => {
  if (!displayStream) return;

  const { width, height } = canvasSize;
  const displayAspectRatio = displayDimensions.height / displayDimensions.width;

  const pad = Math.max(width, height) / 75;
  const r = Math.max(width, height) / 100;

  let x0 = 0,
    y0 = 0,
    w = 0,
    h = 0;
  // Landscape mode
  if (displayAspectRatio * (width - 2 * pad) <= height - 2 * pad) {
    x0 = pad;
    w = width - 2 * pad;
    h = w * displayAspectRatio;
    y0 = (height - h) / 2;
  }
  // Portrait mode
  else {
    y0 = pad;
    h = height - 2 * pad;
    w = h / displayAspectRatio;
    x0 = (width - w) / 2;
  }

  // TODO: Would like to add a drop shadow to the display, but that's hard
  roundedRectClip(ctx, x0, y0, w, h, r, () => {
    ctx.drawImage(displayPreview, x0, y0, w, h);
  });
};

export const createScreenAndCamLayout = ({
  camAlignHoriz,
  camAlignVert,
}: {
  camAlignHoriz: "left" | "right";
  camAlignVert: "top" | "bottom";
}): DrawFn => {
  return (args) => {
    const { width, height } = args.canvasSize;
    const pad = Math.max(width, height) / 75;
    const r = Math.max(width, height) / 100;

    // Screen
    if (args.displayStream) {
      const { ctx, displayDimensions, displayPreview } = args;
      const displayAspectRatio =
        displayDimensions.height / displayDimensions.width;

      let x0 = 0,
        y0 = 0,
        w = 0,
        h = 0;

      // Landscape mode. Always fills width, so no adjustment on x0
      if (displayAspectRatio * (width - 2 * pad) <= height - 2 * pad) {
        x0 = pad;
        w = width - 2 * pad;
        h = w * displayAspectRatio;
        y0 = (height - h) / 2;
      }
      // Portrait mode. Need to adjust x0 based on camAlignHoriz
      else {
        y0 = pad;
        h = height - 2 * pad;
        w = h / displayAspectRatio;
        x0 = camAlignHoriz === "right" ? pad : width - pad - w;
      }

      roundedRectClip(ctx, x0, y0, w, h, r, () => {
        ctx.drawImage(displayPreview, x0, y0, w, h);
      });
    }

    // Webcam
    if (args.webcamStream) {
      const { ctx, webcamDimensions, webcamPreview, theme } = args;

      // TODO: Make this ratio configurable...
      const _w = Math.max(width, height) / 4;
      const _h = (_w * webcamDimensions.height) / webcamDimensions.width;
      const webcamRadius = Math.min(_w, _h) / 2;

      const x0 =
        camAlignHoriz === "left"
          ? pad + webcamRadius
          : width - pad - webcamRadius;
      const y0 =
        camAlignVert === "top"
          ? pad + webcamRadius
          : height - pad - webcamRadius;

      // Accent ring around webcam feed?
      ctx.globalCompositeOperation = "destination-out";
      ctx.save();
      ctx.lineWidth = Math.max(width, height) / 100;
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
};
