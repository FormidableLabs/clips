export const getPreferredMimeType = () => {
  return MIME_TYPES.find(mimeType => MediaRecorder.isTypeSupported(mimeType.mimeType));
};

const MEDIA_TYPES = ["video"];
const FILE_EXTENSIONS = ["mp4", "webm", "ogg", "x-matroska"];
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
  "opus"
];

const MIME_TYPES: { mimeType: string; ext: string }[] = [...new Set(
  FILE_EXTENSIONS.flatMap(ext => CODECS.flatMap(codec => MEDIA_TYPES.flatMap(mediaType => [
    { mimeType: `${mediaType}/${ext};codecs:${codec}`, ext },
    { mimeType: `${mediaType}/${ext};codecs=${codec}`, ext },
    { mimeType: `${mediaType}/${ext};codecs:${codec.toUpperCase()}`, ext },
    { mimeType: `${mediaType}/${ext};codecs=${codec.toUpperCase()}`, ext },
    { mimeType: `${mediaType}/${ext}`, ext }
  ])))
)];
