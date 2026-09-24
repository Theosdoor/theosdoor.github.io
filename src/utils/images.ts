import type { ImageMetadata } from 'astro';

// Content YAML references raster images by site path (/images/projects/x.png), but the
// files live under src/assets/ so Astro resizes them and emits webp instead of copying
// multi-megabyte originals into dist/. Animated and video media stay in public/.
const assets = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

export function resolveImage(path: string): ImageMetadata {
  const image = assets[`/src/assets${path}`]?.default;
  if (!image) throw new Error(`Image ${path} not found under src/assets${path}`);
  return image;
}

export const isVideo = (path: string) => /\.(mp4|webm)$/i.test(path);
// GIFs bypass the pipeline, which would flatten them to a single webp frame.
export const isPassthrough = (path: string) => isVideo(path) || /\.gif$/i.test(path);
