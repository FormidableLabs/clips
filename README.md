# Clips

This repo is an active experiment. The primary goal of this app is to make it easy to create short screen recordings that are shareable to various platforms – such as LinkedIn and YouTube – all using web APIs. The app is intended to:

- be opinionated enough that a user can click a few buttons, and then have a nice-looking screen recording ready to go;
- be flexible enough that users can theme their screen recordings to their liking (to some extent);
- be sexy enough that the end result stands out from the rest of the screen recordings on the various platforms.

## Technology used

- The UI is built using [Svelte](https://svelte.dev/). Svelte rocks, and for an experimental UI like this, is a pleasure to use.
- Uses [`MediaDevice` API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) for capturing screen, webcam, and mic.
- Uses [`AudioContext` API](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) for audio visualizations.
- Uses HTML canvas for drawing the video and audio visualizations, and `CanvasRenderingContext2D`'s `captureStream` for capturing the canvas as a media stream.
- Uses [`MediaRecorder` API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) for recording the media stream as a WebM.

End result is an interface that looks something like this:

![Sample screenshot](./docs/sample.jpg)

(Still in progress, working on improving the UI and screen recording styling/layouts/presets.)
