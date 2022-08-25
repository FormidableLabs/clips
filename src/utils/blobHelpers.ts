import fixWebmDuration from "fix-webm-duration";

export const patchBlob = (blob: Blob, duration: number): Promise<Blob> => {
  return new Promise((resolve) => {
    fixWebmDuration(blob, duration, (newBlob) => resolve(newBlob), {
      logger: false,
    });
  });
};
