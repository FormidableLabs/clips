import type { DrawFn } from "../stores";
import { roundedRectClip } from "../drawUtils";
import { displayPreview } from "../stores";

export const webcamOnlyLayout: DrawFn = ({
  ctx,
  canvasSize,
  theme,
  displayDimensions,
}) => {};

export const screenshareOnlyLayout: DrawFn = ({
  ctx,
  canvasSize,
  displayStream,
  displayDimensions,
  displayPreview,
}) => {
  if (!displayStream) return;

  const pad = canvasSize.width / 100;
  const r = canvasSize.width / 100;
  const { width, height } = displayDimensions;

  const x0 = pad,
    y0 = pad,
    w = (width / height) * canvasSize.height - 2 * pad,
    h = canvasSize.height - 2 * pad;

  roundedRectClip(ctx, x0, y0, w, h, r, () => {
    ctx.drawImage(displayPreview, x0, y0, w, h);
  });
};
