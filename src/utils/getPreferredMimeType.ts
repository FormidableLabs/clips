export const getPreferredMimeType = () => {
  const mediaTypes = ["video", "audio"];
  const FILE_EXTENSIONS = ["webm", "ogg", "mp4", "x-matroska"];
  const CODECS = [
    "vp9",
    "vp9.0",
    "vp8",
    "vp8.0",
    "avc1",
    "av1",
    "h265",
    "h.265",
    "h264",
    "h.264",
    "opus",
  ];

  // Create a list of supported mimetypes with the original codec options
  var mimetypes = [
    ...new Set(
      FILE_EXTENSIONS.flatMap((ext) =>
        CODECS.flatMap((codec) =>
          mediaTypes.flatMap((mediaType) => [
            `${mediaType}/${ext};codecs:${codec}`,
            `${mediaType}/${ext};codecs=${codec}`,
            `${mediaType}/${ext};codecs:${codec.toUpperCase()}`,
            `${mediaType}/${ext};codecs=${codec.toUpperCase()}`,
            `${mediaType}/${ext}`,
          ])
        )
      )
    ),
  ].filter((variation) => MediaRecorder.isTypeSupported(variation));

  // Return the first mimetype from the list of supported mimetypes
  return mimetypes[0];
};
