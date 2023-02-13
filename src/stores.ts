import { z } from "zod";
import { derived, writable } from "svelte/store";
import {
  createAudioBarBackground,
  createAudioWaveBackground,
  createLinearGradientBackground,
  createRainbowAudioBarBackground,
  createSolidBackground,
} from "./utils/backgroundDrawers";

/**
 * Recording state
 */
export const recordingStartTime = writable<number | null>(null);
export const isRecording = derived(
  recordingStartTime,
  ($startTime) => $startTime !== null
);
export const recordingDuration = derived(
  recordingStartTime,
  ($startTime, set) => {
    if (!$startTime) return null;

    const setDuration = () => {
      const s = Math.floor((performance.now() - $startTime) / 1000);

      const numMins = Math.floor(s / 60);
      const numSecs = s % 60;

      set(`${numMins}:${String(numSecs).padStart(2, "0")}`);
    };

    setDuration();
    const interval = setInterval(setDuration, 500);

    return () => {
      set(null);
      clearInterval(interval);
    };
  },
  null
);

export const recordingFPS = (() => {
  const initFps = localStorage.getItem("recordingFps");
  const store = writable(Number(initFps) || 30);

  const _set = store.set;
  store.set = (fps) => {
    localStorage.setItem("recordingFps", String(fps));
    _set(fps);
  };

  return store;
})();

/**
 * Track video stream
 */
export type ScreenShareState = {
  activeIndex: null | number;
  shares: {
    stream?: MediaStream;
    preview?: HTMLVideoElement;
    width: number;
    height: number;
  }[];
};
export const screenShareState = writable<ScreenShareState>({
  activeIndex: 0,
  shares: [],
});

export const activeShare = derived(screenShareState, ($state) => {
  return $state.shares[$state.activeIndex];
});

export const displayStream = derived(screenShareState, ($state) => {
  if ($state.activeIndex === null || $state.shares.length === 0) return null;
  return $state.shares[$state.activeIndex].stream;
});
export const displayPreview = derived(screenShareState, ($state) => {
  if ($state.activeIndex === null || $state.shares.length === 0) return null;
  return $state.shares[$state.activeIndex].preview;
});
export const displayDimensions = derived(screenShareState, ($state) => {
  if ($state.activeIndex === null || $state.shares.length === 0) return null;
  return {
    width: $state.shares[$state.activeIndex].width,
    height: $state.shares[$state.activeIndex].height,
  };
});

/**
 * Track webcam stream
 */
type WebcamState = {
  deviceId?: string | null;
  stream?: MediaStream | null;
  preview?: HTMLVideoElement | null;
  width: number;
  height: number;
};
export const webcamState = writable<WebcamState>({ width: 0, height: 0 });

/**
 * Mic stream
 */
export const micState = writable<{
  stream?: MediaStream | null;
  deviceId?: string | null;
}>({});

export const micAnalyzer = derived(micState, ($micState) => {
  if (!$micState.stream) return null;
  const $stream = $micState.stream;
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  analyser.fftSize = 128;
  // Set min/max decibels so bars aren't going too far over 100% of height
  analyser.minDecibels = -90;
  analyser.maxDecibels = -15;

  const source = context.createMediaStreamSource($stream);
  source.connect(analyser);

  // analyser.connect(context.destination);

  let freqs = new Uint8Array(analyser.frequencyBinCount);

  return { freqs, analyser };
});

/**
 * Canvas stream
 */
export const canvasStream = writable<MediaStream>(null);

/**
 * Canvas sizes
 */
export type CanvasSize = {
  title: string;
  width: number;
  height: number;
};

export const canvasSizes: CanvasSize[] = [
  { title: "4K", width: 3840, height: 2160 },
  { title: "2K", width: 2560, height: 1440 },
  { title: "1080p", width: 1920, height: 1080 },
  { title: "Square", width: 1920, height: 1920 },
  { title: "Portrait", width: 1000, height: 1800 },
];

export const recordingFPSOptions: number[] = [24, 30, 60];

export const canvasDimensions = (() => {
  const initSizeName = localStorage.getItem("canvasSize");
  const initSize =
    canvasSizes.find((size) => size.title === initSizeName) || canvasSizes[0];
  const store = writable<CanvasSize>(initSize);

  const _set = store.set;
  store.set = (size) => {
    localStorage.setItem("canvasSize", size.title);
    _set(size);
  };

  return store;
})();

/**
 * Theming
 */
export type Theme = {
  title: string;
  primary: string;
  secondary: string;
  accent: string;
};
export const themes: Theme[] = [
  { title: "Sun", primary: "#e78e47", secondary: "#f7d570", accent: "#ffffff" },
  {
    title: "Green",
    primary: "#15a356",
    secondary: "#9dF06c",
    accent: "#ffffff",
  },
  {
    title: "Basic",
    primary: "#32056f",
    secondary: "#7139e6",
    accent: "#ffffff",
  },
  {
    title: "White and Blue",
    primary: "#ffffff",
    secondary: "#3638dc",
    accent: "#ffffff",
  },
  {
    title: "Black-ish",
    primary: "#232323",
    secondary: "#434343",
    accent: "#959595",
  },
];

export const activeTheme = (() => {
  const initThemeTitle = localStorage.getItem("theme");
  const initTheme =
    themes.find((theme) => theme.title === initThemeTitle) || themes[0];
  const store = writable<Theme>(initTheme);

  const _set = store.set;

  store.set = (theme) => {
    localStorage.setItem("theme", theme.title);
    _set(theme);
  };

  return store;
})();

/**
 * ------------------------------
 * Background/layout drawing stuff
 * ------------------------------
 */
export type DrawArgs = {
  ctx: CanvasRenderingContext2D;
  theme: Theme;
  canvasSize: CanvasSize;
  activeShare: ScreenShareState["shares"][number] | null | undefined;
  webcamState: WebcamState;
  micAnalyzer: null | { freqs: Uint8Array; analyser: AnalyserNode };
  generalLayoutState: GeneralLayoutState;
  webcamLayoutState: WebcamLayoutState;
  screenLayoutState: ScreenState;
};
export type DrawFn = (args: DrawArgs, webcamX: number, webcamY: number) => void;

/**
 * Background
 */
type Background = {
  title: string;
  draw: DrawFn;
};

export const backgrounds: Background[] = [
  {
    title: "Audio Bars (Thin)",
    draw: createAudioBarBackground({ N: 2 }),
  },
  {
    title: "Audio Bars (Medium)",
    draw: createAudioBarBackground({ N: 4 }),
  },
  {
    title: "Audio Bars (Thick)",
    draw: createAudioBarBackground({ N: 8 }),
  },
  {
    title: "Audio Wave",
    draw: createAudioWaveBackground(),
  },
  {
    title: "Rainbow Bars",
    draw: createRainbowAudioBarBackground({
      N: 2,
      initHue: 0,
      gapPercent: 0.003,
    }),
  },
  {
    title: "Gradient (to bottom right)",
    draw: createLinearGradientBackground("bottom_right"),
  },
  {
    title: "Gradient (to top)",
    draw: createLinearGradientBackground("top"),
  },
  {
    title: "Gradient (to bottom)",
    draw: createLinearGradientBackground("bottom"),
  },
  {
    title: "Gradient (to left)",
    draw: createLinearGradientBackground("left"),
  },
  {
    title: "Gradient (to right)",
    draw: createLinearGradientBackground("right"),
  },
  {
    title: "Solid (primary)",
    draw: createSolidBackground("primary"),
  },
  {
    title: "Solid (secondary)",
    draw: createSolidBackground("secondary"),
  },
];

export const activeBackground = (() => {
  const initBackgroundTitle = localStorage.getItem("background");
  const initBackground =
    backgrounds.find(
      (background) => background.title === initBackgroundTitle
    ) || backgrounds[1];
  const store = writable<Background>(initBackground);

  const _set = store.set;
  store.set = (background) => {
    localStorage.setItem("background", background.title);
    _set(background);
  };

  return store;
})();

/**
 * General layout state
 */
const generalLayoutStateSchema = z.object({
  padding: z.number().min(0).max(1).optional().default(0.1),
});
type GeneralLayoutState = z.infer<typeof generalLayoutStateSchema>;

export const generalLayoutState = (() => {
  let initGeneralLayoutState: GeneralLayoutState = {};
  try {
    const storedWebcamState = localStorage.getItem("generalLayoutState");
    initGeneralLayoutState = generalLayoutStateSchema.parse(
      storedWebcamState
        ? JSON.parse(storedWebcamState)
        : generalLayoutStateSchema.parse({})
    );
  } catch {}

  const store = writable<GeneralLayoutState>(initGeneralLayoutState);

  const _set = store.set;
  store.set = (layoutState) => {
    try {
      localStorage.setItem("generalLayoutState", JSON.stringify(layoutState));
    } catch {}
    _set(layoutState);
  };

  return store;
})();

/**
 * Webcam state
 */
export enum HorizAlign {
  left = "left",
  center = "center",
  right = "right",
}

export enum VertAlign {
  top = "top",
  center = "center",
  bottom = "bottom",
}

export enum WebcamShape {
  initial = "initial",
  circle = "circle",
}

export const horizontalAlignmentOptions = [
  HorizAlign.left,
  HorizAlign.center,
  HorizAlign.right,
] as const;
export const verticalAlignmentOptions = [
  VertAlign.top,
  VertAlign.center,
  VertAlign.bottom,
] as const;
export const webcamShapeOptions = [
  WebcamShape.circle,
  WebcamShape.initial,
] as const;

const webcamStateSchema = z.object({
  horizAlign: z
    .enum(horizontalAlignmentOptions)
    .optional()
    .default(HorizAlign.right),
  vertAlign: z
    .enum(verticalAlignmentOptions)
    .optional()
    .default(VertAlign.bottom),
  shape: z.enum(webcamShapeOptions).optional().default(WebcamShape.circle),
  size: z.number().min(0).max(1).optional().default(0.4),
  borderRadius: z.number().min(0).max(1).optional().default(0.05),
});
type WebcamLayoutState = z.infer<typeof webcamStateSchema>;

export const webcamLayoutState = (() => {
  let initWebcamState: WebcamLayoutState = {};
  try {
    const storedWebcamState = localStorage.getItem("webcamState");
    initWebcamState = webcamStateSchema.parse(
      storedWebcamState
        ? JSON.parse(storedWebcamState)
        : webcamStateSchema.parse({})
    );
  } catch {}

  const store = writable<WebcamLayoutState>(initWebcamState);

  const _set = store.set;
  store.set = (webcamState) => {
    try {
      localStorage.setItem("webcamState", JSON.stringify(webcamState));
    } catch {}
    _set(webcamState);
  };

  return store;
})();

/**
 * Screen/display state
 */
const screenStateSchema = z.object({
  horizAlign: z
    .enum(horizontalAlignmentOptions)
    .optional()
    .default(HorizAlign.left),
  vertAlign: z
    .enum(verticalAlignmentOptions)
    .optional()
    .default(VertAlign.bottom),
  // TODO: border radius?
});
type ScreenState = z.infer<typeof webcamStateSchema>;

export const screenLayoutState = (() => {
  let initScreenState: WebcamLayoutState = {
    horizAlign: HorizAlign.left,
    vertAlign: VertAlign.bottom,
  };
  try {
    const storedScreenState = localStorage.getItem("screenState");
    initScreenState = webcamStateSchema.parse(JSON.parse(storedScreenState));
  } catch {}

  const store = writable<WebcamLayoutState>(initScreenState);

  const _set = store.set;
  store.set = (screenState) => {
    try {
      localStorage.setItem("screenState", JSON.stringify(screenState));
    } catch {}
    _set(screenState);
  };

  return store;
})();
