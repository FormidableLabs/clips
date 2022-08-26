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

    const lingrad = ctx.createLinearGradient(0, -height / 4, 0, height);
    lingrad.addColorStop(0, theme.secondary);
    lingrad.addColorStop(1, theme.primary);

    if (micAnalyzer) {
      let { freqs, analyser } = micAnalyzer;
      analyser.getByteFrequencyData(freqs);

      // Let's only take every-other frequency?
      let modFreqs = [];
      const N = 16;
      let acc = 0;
      for (let i = 0; i < freqs.length; i++) {
        acc += freqs[i];

        if ((i + 1) % N === 0) {
          modFreqs.push(acc / N);
          acc = 0;
        }
      }

      const dx = width / modFreqs.length;

      const p = new Path2D();
      p.moveTo(0, height - modFreqs[0] / 255);

      let nextValue: [number, number], thisValue: [number, number];
      for (let i = 0; i < modFreqs.length - 1; i++) {
        thisValue = nextValue;
        nextValue = [i * dx, (1 - modFreqs[i] / 255) * height];

        if (!thisValue) continue;

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

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, theme.secondary);
    bgGrad.addColorStop(1, theme.primary);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  };
};

/**
 * Audio bar background
 */
export const createAudioBarBackground = ({ N }: { N: number }): DrawFn => {
  return ({ ctx, canvasSize, theme, micAnalyzer }) => {
    ctx.save();
    const { width, height } = canvasSize;

    const lingrad = ctx.createLinearGradient(0, -height / 3, 0, height);
    lingrad.addColorStop(0, theme.secondary);
    lingrad.addColorStop(1, theme.primary);

    if (micAnalyzer) {
      let { freqs, analyser } = micAnalyzer;
      analyser.getByteFrequencyData(freqs);

      // Let's only take every-other frequency?
      let modFreqs = [];
      let acc = 0;
      for (let i = 0; i < freqs.length; i++) {
        acc += freqs[i];

        if ((i + 1) % N === 0) {
          modFreqs.push(acc / N);
          acc = 0;
        }
      }

      const gap = width / 100;
      const barWidth = (width - (modFreqs.length + 1) * gap) / modFreqs.length;

      const dx = width / modFreqs.length;

      ctx.fillStyle = lingrad;
      let x0, y0, w, h;
      for (let i = 0; i < modFreqs.length - 1; i++) {
        x0 = gap + (barWidth + gap) * i;
        h = (modFreqs[i] / 255) * height;
        y0 = height - h;

        ctx.fillRect(x0, y0, barWidth, h);
      }
    }

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, theme.secondary);
    bgGrad.addColorStop(1, theme.primary);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  };
};
