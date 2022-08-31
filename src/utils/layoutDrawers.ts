import type { DrawFn } from "../stores";
import { HorizAlign, VertAlign, WebcamShape } from "../stores";
import { circleClip, roundedRectClip } from "./drawUtils";

export const drawWebcam: DrawFn = (args) => {
  if (args.webcamState.stream) {
    const {
      ctx,
      webcamState,
      theme,
      webcamLayoutState,
      canvasSize,
      generalLayoutState,
    } = args;
    const { horizAlign, vertAlign, size, shape } = webcamLayoutState;
    const { padding } = generalLayoutState;

    const { width, height } = canvasSize;
    const pad = (padding * Math.min(width, height)) / 4;

    // Circle webcam
    if (shape === WebcamShape.circle) {
      // Determine diameter of resulting circle
      const maxD = Math.min(width, height) - 2 * pad;
      const diam = size * maxD;
      const aR = webcamState.height / webcamState.width;

      let _w = diam,
        _h = _w * aR;
      if (webcamState.width > webcamState.height) {
        _h = diam;
        _w = _h / aR;
      }

      const webcamRadius = diam / 2;

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
      ctx.lineWidth = 2 * pad; // TODO: Make this a setting, padding in general probably ought to be a setting.
      ctx.strokeStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(x0, y0, webcamRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";

      circleClip(ctx, x0, y0, webcamRadius, () => {
        ctx.drawImage(webcamState.preview, x0 - _w / 2, y0 - _h / 2, _w, _h);
      });
    }
    // Rectangular webcam
    else if (shape === WebcamShape.initial) {
      const aR = webcamState.height / webcamState.width;

      let x0 = 0,
        y0 = 0,
        w = 0,
        h = 0;

      // Will max out the width
      if (aR * (width - 2 * pad) <= height - 2 * pad) {
        w = size * (width - 2 * pad);
        h = w * aR;
      }
      // Will max out the height
      else {
        h = size * (height - 2 * pad);
        w = h / aR;
      }

      // x0
      if (horizAlign === HorizAlign.left) {
        x0 = pad;
      } else if (horizAlign === HorizAlign.center) {
        x0 = (width - w) / 2;
      } else if (horizAlign === HorizAlign.right) {
        x0 = width - pad - w;
      }

      if (vertAlign === VertAlign.top) {
        y0 = pad;
      } else if (vertAlign === VertAlign.center) {
        y0 = (height - h) / 2;
      } else if (vertAlign === VertAlign.bottom) {
        y0 = height - pad - h;
      }

      const r = (webcamLayoutState.borderRadius * Math.min(w, h)) / 2;

      // Accent ring around webcam feed?
      ctx.globalCompositeOperation = "destination-out";
      roundedRectClip(
        ctx,
        x0 - pad / 2,
        y0 - pad / 2,
        w + pad,
        h + pad,
        r,
        () => {
          ctx.fillRect(x0 - pad / 2, y0 - pad / 2, w + pad, h + pad);
        }
      );
      ctx.globalCompositeOperation = "source-over";

      roundedRectClip(ctx, x0, y0, w, h, r, () => {
        ctx.drawImage(webcamState.preview, x0, y0, w, h);
      });
    } // End initial
  }
};

/**
 * Drawing screen share
 */
export const drawScreenShare: DrawFn = (args) => {
  // Screen
  if (args.activeShare && args.activeShare.stream && args.activeShare.preview) {
    const {
      ctx,
      activeShare,
      screenLayoutState,
      canvasSize,
      generalLayoutState,
    } = args;
    const { width, height } = canvasSize;
    const { horizAlign, vertAlign } = screenLayoutState;
    const { padding } = generalLayoutState;
    const m = Math.max(width, height);
    const pad = (padding * Math.min(width, height)) / 4;
    const r = m / 100;

    const displayAspectRatio = activeShare.height / activeShare.width;

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
      ctx.drawImage(activeShare.preview, x0, y0, w, h);
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
