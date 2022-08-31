import fixWebmDuration from "fix-webm-duration";

/**
 * MediaRecorder produces a garbage blob that doesn't have duration metadata.
 * Have to use a custom library to patch that problem.
 */
export const patchBlob = (blob: Blob, duration: number): Promise<Blob> => {
  return new Promise((resolve) => {
    fixWebmDuration(blob, duration, (newBlob) => resolve(newBlob), {
      logger: false,
    });
  });
};
