import { derived, writable } from "svelte/store";

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
};
export const themes: Theme[] = [
  { title: "Basic", primary: "#ff0000", secondary: "#ff00ff" },
  { title: "Green", primary: "#354735", secondary: "#acea88" },
  { title: "Sun", primary: "#e78e47", secondary: "#f7d570" },
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
type DrawFn = (args: {}) => void;

/**
 * Background
 */
type Background = {
  title: string;
  draw: () => void;
};
