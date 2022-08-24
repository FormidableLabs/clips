import type { Readable } from "svelte/store";
import { derived, writable } from "svelte/store";
import {
  createAudioWaveBackground,
  createLinearGradientBackground,
  createSolidBackground,
} from "./utils/backgroundDrawers";
import {
  createScreenAndCamLayout,
  screenshareOnlyLayout,
  webcamOnlyLayout,
} from "./utils/layoutDrawers";

/**
 * Recording state
 */
export const recordingStartTime = writable<Date | null>(null);
export const isRecording = derived(
  recordingStartTime,
  ($startTime) => $startTime !== null
);
export const recordingDuration = derived(
  recordingStartTime,
  ($startTime, set) => {
    if (!$startTime) return null;

    const setDuration = () => {
      const s = Math.floor(
        (new Date().getTime() - $startTime.getTime()) / 1000
      );

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
export const displayStream = writable<MediaStream>(null);
export const displayPreview = writable<HTMLVideoElement>(null);
export const displayDimensions = writable({ width: 0, height: 0 });

/**
 * Track webcam stream
 */
export const webcamStream = writable<MediaStream>(null);
export const webcamPreview = writable<HTMLVideoElement>(null);
export const webcamDimensions = writable({ width: 0, height: 0 });

/**
 * Mic stream
 */
export const micStream = writable<MediaStream>(null);

export const micAnalyzer = derived(micStream, ($stream) => {
  if (!$stream) return null;
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  analyser.fftSize = 64;
  const source = context.createMediaStreamSource($stream);
  source.connect(analyser);

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
  { title: "1080p", width: 1920, height: 1080 },
  { title: "Square", width: 1000, height: 1000 },
  { title: "Portrait", width: 1000, height: 1800 },
];

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
  {
    title: "Basic",
    primary: "#ff0000",
    secondary: "#ff00ff",
    accent: "#ffffff",
  },
  {
    title: "Green",
    primary: "#354735",
    secondary: "#acea88",
    accent: "#ffffff",
  },
  { title: "Sun", primary: "#e78e47", secondary: "#f7d570", accent: "#ffffff" },
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
  displayDimensions: { width: number; height: number } | null | undefined;
  displayStream: MediaStream | null | undefined;
  displayPreview: HTMLVideoElement | null | undefined;
  webcamDimensions: { width: number; height: number } | null | undefined;
  webcamStream: MediaStream | null | undefined;
  webcamPreview: HTMLVideoElement | null | undefined;
  micAnalyzer: null | { freqs: Uint8Array; analyser: AnalyserNode };
};
export type DrawFn = (args: DrawArgs) => void;

/**
 * Background
 */
type Background = {
  title: string;
  draw: DrawFn;
};

export const backgrounds: Background[] = [
  {
    title: "Audio Visualizer",
    draw: createAudioWaveBackground(),
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
    ) || backgrounds[0];
  const store = writable<Background>(initBackground);

  const _set = store.set;
  store.set = (background) => {
    localStorage.setItem("background", background.title);
    _set(background);
  };

  return store;
})();

/**
 * Layouts
 */

type Layout = Background;

export const layouts: Layout[] = [
  { title: "Webcam Only", draw: webcamOnlyLayout },
  {
    title: "Screenshare only",
    draw: screenshareOnlyLayout,
  },
  {
    title: "Screen+Cam (left/bottom)",
    draw: createScreenAndCamLayout({
      camAlignHoriz: "left",
      camAlignVert: "bottom",
    }),
  },
  {
    title: "Screen+Cam (left/top)",
    draw: createScreenAndCamLayout({
      camAlignHoriz: "left",
      camAlignVert: "top",
    }),
  },
  {
    title: "Screen+Cam (right/bottom)",
    draw: createScreenAndCamLayout({
      camAlignHoriz: "right",
      camAlignVert: "bottom",
    }),
  },
  {
    title: "Screen+Cam (right/top)",
    draw: createScreenAndCamLayout({
      camAlignHoriz: "right",
      camAlignVert: "top",
    }),
  },
];

export const activeLayout = (() => {
  const initLayoutTitle = localStorage.getItem("layout");
  const initLayout =
    layouts.find((layout) => layout.title === initLayoutTitle) || layouts[0];
  const store = writable<Layout>(initLayout);

  const _set = store.set;
  store.set = (layout) => {
    localStorage.setItem("layout", layout.title);
    _set(layout);
  };

  return store;
})();
