/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BLUR_MIN = 150;
const DOWNSCALE_WIDTH = 800;

export interface BlurCheckResult {
  passed: boolean;
  score: number;
  threshold: number;
  reason?: string;
}

/**
 * Pure mathematical calculation of Laplacian variance from a 2D grayscale pixel array.
 * Decoupled from HTML Canvas for high performance and unit testability.
 */
export function calculateLaplacianVariance(
  grayscale: Float32Array | Uint8Array | number[],
  width: number,
  height: number
): number {
  if (width < 3 || height < 3) return 0;

  // Standard 3x3 Laplacian convolution kernel:
  // [ 0,  1,  0 ]
  // [ 1, -4,  1 ]
  // [ 0,  1,  0 ]
  const laplacianValues: number[] = [];
  let sum = 0;

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width;
    const prevRowOffset = (y - 1) * width;
    const nextRowOffset = (y + 1) * width;

    for (let x = 1; x < width - 1; x++) {
      const center = grayscale[rowOffset + x];
      const top = grayscale[prevRowOffset + x];
      const bottom = grayscale[nextRowOffset + x];
      const left = grayscale[rowOffset + (x - 1)];
      const right = grayscale[rowOffset + (x + 1)];

      const laplacian = top + bottom + left + right - 4 * center;
      laplacianValues.push(laplacian);
      sum += laplacian;
    }
  }

  const count = laplacianValues.length;
  if (count === 0) return 0;

  const mean = sum / count;
  let varianceSum = 0;

  for (let i = 0; i < count; i++) {
    const diff = laplacianValues[i] - mean;
    varianceSum += diff * diff;
  }

  const variance = varianceSum / count;
  return Number(variance.toFixed(2));
}

/**
 * Converts ImageData or RGBA buffer to single-channel Grayscale values.
 */
export function rgbaToGrayscale(
  rgba: Uint8ClampedArray | Uint8Array | number[],
  pixelCount: number
): Float32Array {
  const grayscale = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    // Standard perceptual luminance formula
    grayscale[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return grayscale;
}

/**
 * Performs a strict Laplacian Variance Blur check on an image element or canvas.
 * Downscales to 800px width for fast execution.
 */
export async function checkBlur(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap
): Promise<BlurCheckResult> {
  if (typeof document === 'undefined') {
    return {
      passed: true,
      score: 200,
      threshold: BLUR_MIN,
    };
  }

  const sourceWidth = 'naturalWidth' in imageSource ? imageSource.naturalWidth : imageSource.width;
  const sourceHeight = 'naturalHeight' in imageSource ? imageSource.naturalHeight : imageSource.height;

  if (!sourceWidth || !sourceHeight) {
    return {
      passed: false,
      score: 0,
      threshold: BLUR_MIN,
      reason: 'Image is too blurry. Please hold your phone steady.',
    };
  }

  // Downscale to 800px width while preserving aspect ratio for fast edge detection
  const targetWidth = Math.min(DOWNSCALE_WIDTH, sourceWidth);
  const scale = targetWidth / sourceWidth;
  const targetHeight = Math.max(3, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to create canvas 2D rendering context');
  }

  ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const pixelCount = targetWidth * targetHeight;

  const grayscale = rgbaToGrayscale(imageData.data, pixelCount);
  const variance = calculateLaplacianVariance(grayscale, targetWidth, targetHeight);

  const passed = variance >= BLUR_MIN;

  return {
    passed,
    score: variance,
    threshold: BLUR_MIN,
    reason: passed
      ? undefined
      : 'Image is too blurry. Please hold your phone steady.',
  };
}
