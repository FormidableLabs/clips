import { writable } from "svelte/store";

// Track canvas dimensions
export const canvasDimensions = writable({ width: 3840, height: 2160 });

// Track video stream
export const displayStream = writable<MediaStream>(null);
export const displayPreview = writable<HTMLVideoElement>(null);
export const displayDimensions = writable({ width: 0, height: 0 });

// Track webcam stream
export const webcamStream = writable<MediaStream>(null);
export const webcamPreview = writable<HTMLVideoElement>(null);
export const webcamDimensions = writable({ width: 0, height: 0 });

// Canvas stream
export const canvasStream = writable<MediaStream>(null);
