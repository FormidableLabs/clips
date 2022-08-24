import type { DrawFn } from "../stores";

export const createLinearGradientBackground = (
  direction: "bottom_right" | "top" | "bottom" | "left" | "right"
): DrawFn => {
  return ({ ctx, canvasSize, theme }) => {
    ctx.save();

    let gradVals = [0, 0, canvasSize.width, canvasSize.height] as [
      number,
      number,
      number,
      number
    ];
    switch (direction) {
      case "top":
        gradVals = [0, canvasSize.height, 0, 0];
        break;
      case "bottom":
        gradVals = [0, 0, 0, canvasSize.height];
        break;
      case "bottom_right":
        gradVals = [0, 0, canvasSize.width, canvasSize.height];
        break;
      case "left":
        gradVals = [canvasSize.width, 0, 0, 0];
        break;
      case "right":
        gradVals = [0, 0, canvasSize.width, 0];
        break;
    }

    const lingrad = ctx.createLinearGradient(...gradVals);
    lingrad.addColorStop(0, theme.primary);
    lingrad.addColorStop(1, theme.secondary);

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.restore();
  };
};
