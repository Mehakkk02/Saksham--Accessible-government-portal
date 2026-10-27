/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BRIGHTNESS_MIN = 50;
export const BRIGHTNESS_MAX = 220;
const DOWNSCALE_WIDTH = 400; // Smaller resolution is sufficient and extremely fast for mean luminance

export interface BrightnessCheckResult {
  passed: boolean;
  score: number;
  minThreshold: number;
  maxThreshold: number;
  reason?: string;
}

/**
 * Pure mathematical calculation of mean luminance across an RGBA buffer.
 * Formula: Y = 0.299*R + 0.587*G + 0.114*B
 */
export function calculateMeanLuminance(
  rgba: Uint8ClampedArray | Uint8Array | number[]
): number {
  const pixelCount = Math.floor(rgba.length / 4);
  if (pixelCount === 0) return 0;

  let totalLuminance = 0;
  for (let i = 0; i < pixelCount; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const mean = totalLuminance / pixelCount;
  return Number(mean.toFixed(1));
}

/**
 * Checks lighting conditions of an image:
 * - Score < 50: "Image is too dark. Please face a light source."
 * - Score > 220: "Image is too bright. Please reduce glare."
 */
export async function checkBrightness(
  imageSource: HTMLImageElement | HTMLCanvasElement | ImageBitmap
): Promise<BrightnessCheckResult> {
  if (typeof document === 'undefined') {
    return {
      passed: true,
      score: 135,
      minThreshold: BRIGHTNESS_MIN,
      maxThreshold: BRIGHTNESS_MAX,
    };
  }

  const sourceWidth = 'naturalWidth' in imageSource ? imageSource.naturalWidth : imageSource.width;
  const sourceHeight = 'naturalHeight' in imageSource ? imageSource.naturalHeight : imageSource.height;

  if (!sourceWidth || !sourceHeight) {
    return {
      passed: false,
      score: 0,
      minThreshold: BRIGHTNESS_MIN,
      maxThreshold: BRIGHTNESS_MAX,
      reason: 'Image is too dark. Please face a light source.',
    };
  }

  const targetWidth = Math.min(DOWNSCALE_WIDTH, sourceWidth);
  const scale = targetWidth / sourceWidth;
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Failed to create canvas 2D rendering context');
  }

  ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);

  const meanLuminance = calculateMeanLuminance(imageData.data);

  if (meanLuminance < BRIGHTNESS_MIN) {
    return {
      passed: false,
      score: meanLuminance,
      minThreshold: BRIGHTNESS_MIN,
      maxThreshold: BRIGHTNESS_MAX,
      reason: 'Image is too dark. Please face a light source.',
    };
  }

  if (meanLuminance > BRIGHTNESS_MAX) {
    return {
      passed: false,
      score: meanLuminance,
      minThreshold: BRIGHTNESS_MIN,
      maxThreshold: BRIGHTNESS_MAX,
      reason: 'Image is too bright. Please reduce glare.',
    };
  }

  return {
    passed: true,
    score: meanLuminance,
    minThreshold: BRIGHTNESS_MIN,
    maxThreshold: BRIGHTNESS_MAX,
  };
}
