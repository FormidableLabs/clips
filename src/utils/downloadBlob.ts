export const downloadBlob = (blob: Blob) => {
  const data = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = data;
  link.download = `video.mp4`;
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: false,
      view: window
    })
  );

  setTimeout(() => {
    URL.revokeObjectURL(data);
    link.remove();
  }, 500);
};
