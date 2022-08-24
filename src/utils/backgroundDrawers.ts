import type { DrawFn, Theme } from "../stores";

/**
 * Solid background
 */
export const createSolidBackground = (key: keyof Theme): DrawFn => {
  return ({ ctx, theme, canvasSize }) => {
    ctx.save();

    ctx.fillStyle = theme[key];
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.restore();
  };
};

/**
 * Gradient background
 */
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
    lingrad.addColorStop(0, theme.secondary);
    lingrad.addColorStop(1, theme.primary);

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.restore();
  };
};

/**
 * Audio wave background
 */
export const createAudioWaveBackground = (): DrawFn => {
  return ({ ctx, micAnalyzer, theme, canvasSize }) => {
    ctx.save();
    const { width, height } = canvasSize;

    const lingrad = ctx.createLinearGradient(0, 0, 0, height);
    lingrad.addColorStop(0, theme.secondary);
    lingrad.addColorStop(1, theme.primary);

    if (micAnalyzer) {
      let { freqs, analyser } = micAnalyzer;
      analyser.getByteFrequencyData(freqs);
      const p = new Path2D();
      p.moveTo(0, height);

      const dx = width / freqs.length;

      let nextValue: [number, number] = [0, height],
        thisValue: [number, number];
      for (let i = 0; i < freqs.length - 1; i++) {
        thisValue = nextValue;
        nextValue = [(i + 1) * dx, (1 - freqs[i + 1] / 255) * height];

        const x_mid = (thisValue[0] + nextValue[0]) / 2;
        const y_mid = (thisValue[1] + nextValue[1]) / 2;
        const cp_x1 = (x_mid + thisValue[0]) / 2;
        const cp_x2 = (x_mid + nextValue[0]) / 2;

        p.quadraticCurveTo(cp_x1, thisValue[1], x_mid, y_mid);
        p.quadraticCurveTo(cp_x2, nextValue[1], nextValue[0], nextValue[1]);
      }
      p.lineTo(width, height);

      ctx.fillStyle = lingrad;
      ctx.fill(p);
    }

    ctx.fillStyle = theme.primary;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    ctx.restore();
  };
};
