import { z } from "zod";
import { type Readable, type Writable, derived, writable } from "svelte/store";
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
export const recordingDuration: Readable<string | null> = derived<
  Writable<number | null>,
  string | null
>(
  recordingStartTime,
  ($startTime, set) => {
    if ($startTime === null) {
      set(null);
      return;
    }

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
export type Share = {
  id: string;
  stream?: MediaStream;
  preview?: HTMLVideoElement;
  width: number;
  height: number;
};

export type ScreenShareState = {
  activeIndex: null | number;
  shares: Share[];
};
export const screenShareState = writable<ScreenShareState>({
  activeIndex: 0,
  shares: [],
});

export const activeShare: Readable<Share | undefined> = derived(
  screenShareState,
  ($state) => {
    return $state.activeIndex === null
      ? undefined
      : $state.shares[$state.activeIndex];
  }
);

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

export const micAnalyzer: Readable<MicAnalyzerData | null> = derived<
  typeof micState,
  MicAnalyzerData | null
>(micState, ($micState, set) => {
  if (!$micState.stream) {
    set(null);
    return;
  }
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

  const freqs: Uint8Array<ArrayBuffer> = new Uint8Array(
    analyser.frequencyBinCount
  );

  set({ freqs, analyser });

  return () => {
    source.disconnect();
    context.close();
  };
});

/**
 * Canvas stream
 */
export const canvasStream = writable<MediaStream | null>(null);

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

export const recordingFPSOptions: number[] = [30, 60];

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
const themeSchema: z.ZodType<Theme> = z.object({
  title: z.string(),
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
});
export const themes: Theme[] = [
  {
    title: "Closed Eyes in the Sun",
    primary: "#FF3F2A",
    secondary: "#ff7328",
    accent: "#FFFFFF",
  },
  {
    title: "Tange-orange",
    primary: "#FF952A",
    secondary: "#FFD452",
    accent: "#FFFFFF",
  },
  {
    title: "Jungle-Chic",
    primary: "#69C647",
    secondary: "#38BC7F",
    accent: "#FFFFFF",
  },
  {
    title: "World's Most Generic Blues",
    primary: "#299FD2",
    secondary: "#2956D2",
    accent: "#FFFFFF",
  },
  {
    title: "Irises with Lavenders",
    primary: "#3A29D2",
    secondary: "#8029D2",
    accent: "#FFFFFF",
  },
  {
    title: "(Un)Opinionatedly-Blue Grays",
    primary: "#1d1e21",
    secondary: "#34373d",
    accent: "#FFFFFF",
  },
  {
    title: "Steam-Pressed Shirt",
    primary: "#edf0f9",
    secondary: "#f7f8fc",
    accent: "#FFFFFF",
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

export const customTheme = (() => {
  const storedCustomTheme = localStorage.getItem("customTheme");
  let initCustomTheme: Theme = {
    ...(themes.find(
      (theme) => theme.title === localStorage.getItem("theme")
    ) || themes[0]),
  };
  if (storedCustomTheme) {
    try {
      initCustomTheme = themeSchema.parse(JSON.parse(storedCustomTheme));
    } catch {}
  }

  const store = writable<Theme>(initCustomTheme);

  const _set = store.set;

  store.set = (theme) => {
    localStorage.setItem(
      "customTheme",
      JSON.stringify({ ...theme, title: "customTheme" })
    );
    _set(theme);
    activeTheme.set(theme);
  };
  return store;
})();

/**
 * ------------------------------
 * Background/layout drawing stuff
 * ------------------------------
 */
export type MicAnalyzerData = {
  freqs: Uint8Array<ArrayBuffer>;
  analyser: AnalyserNode;
};

export type DrawArgs = {
  ctx: CanvasRenderingContext2D | undefined;
  theme: Theme;
  canvasSize: CanvasSize;
  activeShare: ScreenShareState["shares"][number] | null | undefined;
  webcamState: WebcamState;
  micAnalyzer: MicAnalyzerData | null;
  generalLayoutState: GeneralLayoutState;
  webcamLayoutState: WebcamLayoutState;
  screenLayoutState: ScreenState;
};
export type DrawFn = (
  args: DrawArgs,
  webcamX?: number,
  webcamY?: number
) => void;

export type BackgroundCategories = "Audio" | "Gradient" | "Solid";

/**
 * Background
 */
type Background = {
  title: string;
  category: BackgroundCategories;
  ariaLabel: string;
  draw: DrawFn;
};

export const backgrounds: Background[] = [
  {
    title: "Thin",
    ariaLabel: "Thin bars",
    category: "Audio",
    draw: createAudioBarBackground({ N: 2 }),
  },
  {
    title: "Medium",
    ariaLabel: "Medium bars",
    category: "Audio",
    draw: createAudioBarBackground({ N: 4 }),
  },
  {
    title: "Thick",
    ariaLabel: "Thick bars",
    category: "Audio",
    draw: createAudioBarBackground({ N: 8 }),
  },
  {
    title: "Wave",
    ariaLabel: "Wave",
    category: "Audio",
    draw: createAudioWaveBackground(),
  },
  {
    title: "Rainbow",
    category: "Audio",
    ariaLabel: "Rainbow bars",
    draw: createRainbowAudioBarBackground({
      N: 2,
      initHue: 0,
      gapPercent: 0.003,
    }),
  },
  {
    title: "↘",
    ariaLabel: "Gradient to bottom right",
    category: "Gradient",
    draw: createLinearGradientBackground("bottom_right"),
  },
  {
    title: "↑",
    ariaLabel: "Gradient to top",
    category: "Gradient",
    draw: createLinearGradientBackground("top"),
  },
  {
    title: "↓",
    ariaLabel: "Gradient to bottom",
    category: "Gradient",
    draw: createLinearGradientBackground("bottom"),
  },
  {
    title: "←",
    ariaLabel: "Gradient to left",
    category: "Gradient",
    draw: createLinearGradientBackground("left"),
  },
  {
    title: "→",
    ariaLabel: "Gradient to right",
    category: "Gradient",
    draw: createLinearGradientBackground("right"),
  },
  {
    title: "Primary",
    ariaLabel: "Solid primary color",
    category: "Solid",
    draw: createSolidBackground("primary"),
  },
  {
    title: "Secondary",
    ariaLabel: "Solid secondary color",
    category: "Solid",
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
  let initGeneralLayoutState: GeneralLayoutState =
    generalLayoutStateSchema.parse({});
  try {
    const storedGeneralLayoutState = localStorage.getItem(
      "generalLayoutState"
    );
    if (storedGeneralLayoutState) {
      initGeneralLayoutState = generalLayoutStateSchema.parse(
        JSON.parse(storedGeneralLayoutState)
      );
    }
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
  let initWebcamState: WebcamLayoutState = webcamStateSchema.parse({});
  try {
    const storedWebcamState = localStorage.getItem("webcamState");
    if (storedWebcamState) {
      initWebcamState = webcamStateSchema.parse(JSON.parse(storedWebcamState));
    }
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
type ScreenState = z.infer<typeof screenStateSchema>;

export const screenLayoutState = (() => {
  const defaultState: ScreenState = {
    horizAlign: HorizAlign.left,
    vertAlign: VertAlign.bottom,
  };
  let initScreenState: ScreenState = defaultState;
  try {
    const storedScreenState = localStorage.getItem("screenState");
    if (storedScreenState) {
      const parsed = screenStateSchema.parse(JSON.parse(storedScreenState));
      initScreenState = { ...defaultState, ...parsed };
    }
  } catch {}

  const store = writable<ScreenState>(initScreenState);

  const _set = store.set;
  store.set = (screenState) => {
    try {
      localStorage.setItem("screenState", JSON.stringify(screenState));
    } catch {}
    _set(screenState);
  };

  return store;
})();
