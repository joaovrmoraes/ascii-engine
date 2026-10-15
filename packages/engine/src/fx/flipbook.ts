/**
 * ASCII flipbooks (§3.3): a sprite sheet, a GIF or a video becomes frames of
 * letters, one per cell — brightness picks the letter's density, the image
 * gives its colour. The result is plain data (`FlipbookData`) for the
 * `flipbook` render kind and can be saved as a preset.
 */
type RGB = [number, number, number]
export interface FlipbookData {
  frames: string[][]
  colors: RGB[][][]
  fps: number
}
export interface GlyphConversion {
  /** Letters per row and rows per frame. */
  cols: number
  rows: number
  /** Sparse to dense; the first is used for empty cells. */
  alphabet?: string
  /** Pixels darker than this (0–1) are empty. */
  threshold?: number
  /** Colour gain (fire wants > 1). */
  gain?: number
}
export interface PixelSource {
  data: Uint8ClampedArray | number[]
  width: number
  height: number
}

/** One frame of pixels → rows of letters and their colours (linear 0–1). */
export function imageToGlyphFrame(image: PixelSource, options: GlyphConversion) {
  const { cols, rows } = options,
    alphabet = options.alphabet ?? ' .:-=+*#%@',
    threshold = options.threshold ?? 0.06,
    gain = options.gain ?? 1
  const text: string[] = [],
    colors: RGB[][] = []
  const cw = image.width / cols,
    ch = image.height / rows
  for (let row = 0; row < rows; row++) {
    let line = ''
    const lineColors: RGB[] = []
    for (let col = 0; col < cols; col++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        n = 0
      for (
        let y = Math.floor(row * ch);
        y < Math.max(Math.floor(row * ch) + 1, Math.floor((row + 1) * ch));
        y++
      )
        for (
          let x = Math.floor(col * cw);
          x < Math.max(Math.floor(col * cw) + 1, Math.floor((col + 1) * cw));
          x++
        ) {
          const i = (y * image.width + x) * 4
          r += image.data[i]
          g += image.data[i + 1]
          b += image.data[i + 2]
          a += image.data[i + 3]
          n++
        }
      r /= n * 255
      g /= n * 255
      b /= n * 255
      a /= n * 255
      const light = (r * 0.2126 + g * 0.7152 + b * 0.0722) * a
      if (light < threshold) {
        line += ' '
        lineColors.push([0, 0, 0])
        continue
      }
      const index =
        1 +
        Math.min(
          alphabet.length - 2,
          Math.floor(((light - threshold) / (1 - threshold)) * (alphabet.length - 1)),
        )
      line += alphabet[index]
      // sRGB → linear-ish, normalised so the letter keeps the hue at full value.
      const peak = Math.max(r, g, b, 1e-3)
      lineColors.push([(r / peak) * gain, (g / peak) * gain, (b / peak) * gain])
    }
    text.push(line)
    colors.push(lineColors)
  }
  return { text, colors }
}

function pixelsOf(
  source: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  width: number,
  height: number,
): PixelSource {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}

/** A sprite sheet laid out in a grid of `across` × `down` frames. */
export function spriteSheetToFlipbook(
  image: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
  across: number,
  down: number,
  options: GlyphConversion & { fps?: number; count?: number },
): FlipbookData {
  const fw = image.width / across,
    fh = image.height / down,
    count = options.count ?? across * down
  const frames: string[][] = [],
    colors: RGB[][][] = []
  for (let i = 0; i < count; i++) {
    const px = pixelsOf(
      image,
      (i % across) * fw,
      Math.floor(i / across) * fh,
      fw,
      fh,
      options.cols * 4,
      options.rows * 4,
    )
    const frame = imageToGlyphFrame(px, options)
    frames.push(frame.text)
    colors.push(frame.colors)
  }
  return { frames, colors, fps: options.fps ?? 12 }
}

/** An animated GIF (or WebP/APNG) through `ImageDecoder` where the browser has it. */
export async function gifToFlipbook(
  data: ArrayBuffer,
  type: string,
  options: GlyphConversion & { fps?: number; maxFrames?: number },
): Promise<FlipbookData> {
  const Decoder = (
    globalThis as unknown as {
      ImageDecoder?: new (init: { data: ArrayBuffer; type: string }) => {
        tracks: { ready: Promise<void>; selectedTrack?: { frameCount: number } }
        decode(o: { frameIndex: number }): Promise<{ image: VideoFrame }>
        close(): void
      }
    }
  ).ImageDecoder
  if (!Decoder)
    throw new Error('ImageDecoder unavailable in this browser: use a sprite sheet or video')
  const decoder = new Decoder({ data, type })
  await decoder.tracks.ready
  const count = Math.min(options.maxFrames ?? 120, decoder.tracks.selectedTrack?.frameCount ?? 1)
  const frames: string[][] = [],
    colors: RGB[][][] = []
  for (let i = 0; i < count; i++) {
    const { image } = await decoder.decode({ frameIndex: i })
    const px = pixelsOf(
      image,
      0,
      0,
      image.displayWidth,
      image.displayHeight,
      options.cols * 4,
      options.rows * 4,
    )
    image.close()
    const frame = imageToGlyphFrame(px, options)
    frames.push(frame.text)
    colors.push(frame.colors)
  }
  decoder.close()
  return { frames, colors, fps: options.fps ?? 12 }
}

/** A video sampled at `fps` (up to `maxFrames`). */
export async function videoToFlipbook(
  video: HTMLVideoElement,
  options: GlyphConversion & { fps?: number; maxFrames?: number },
): Promise<FlipbookData> {
  const fps = options.fps ?? 12
  if (video.readyState < 1)
    await new Promise(ok => video.addEventListener('loadedmetadata', ok, { once: true }))
  const count = Math.min(options.maxFrames ?? 90, Math.floor(video.duration * fps))
  const frames: string[][] = [],
    colors: RGB[][][] = []
  for (let i = 0; i < count; i++) {
    video.currentTime = i / fps
    await new Promise(ok => video.addEventListener('seeked', ok, { once: true }))
    const px = pixelsOf(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
      options.cols * 4,
      options.rows * 4,
    )
    const frame = imageToGlyphFrame(px, options)
    frames.push(frame.text)
    colors.push(frame.colors)
  }
  return { frames, colors, fps }
}
