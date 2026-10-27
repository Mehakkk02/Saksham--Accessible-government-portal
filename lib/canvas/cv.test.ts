import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLaplacianVariance,
  rgbaToGrayscale,
  BLUR_MIN,
} from './blur';
import {
  calculateMeanLuminance,
  BRIGHTNESS_MIN,
  BRIGHTNESS_MAX,
} from './brightness';

test('Laplacian variance on a blurry/flat surface is near 0 and below BLUR_MIN', () => {
  const width = 10;
  const height = 10;
  // Uniform flat grayscale image (no edges)
  const flatGrayscale = new Float32Array(width * height).fill(120);

  const variance = calculateLaplacianVariance(flatGrayscale, width, height);
  assert.equal(variance, 0);
  assert.ok(variance < BLUR_MIN);
});

test('Laplacian variance on sharp edge pattern exceeds BLUR_MIN', () => {
  const width = 10;
  const height = 10;
  const sharpEdges = new Float32Array(width * height);

  // Checkerboard pattern (maximum high frequency edges)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sharpEdges[y * width + x] = (x + y) % 2 === 0 ? 255 : 0;
    }
  }

  const variance = calculateLaplacianVariance(sharpEdges, width, height);
  assert.ok(variance >= BLUR_MIN, `Expected variance >= ${BLUR_MIN}, got ${variance}`);
});

test('Mean luminance identifies dark, balanced, and glare lighting', () => {
  // Dark: RGBA (25, 25, 25, 255)
  const darkRgba = new Uint8ClampedArray(4 * 4).fill(25);
  const darkScore = calculateMeanLuminance(darkRgba);
  assert.ok(darkScore < BRIGHTNESS_MIN, `Expected dark score < ${BRIGHTNESS_MIN}, got ${darkScore}`);

  // Normal: RGBA (140, 140, 140, 255)
  const normalRgba = new Uint8ClampedArray(4 * 4).fill(140);
  const normalScore = calculateMeanLuminance(normalRgba);
  assert.ok(
    normalScore >= BRIGHTNESS_MIN && normalScore <= BRIGHTNESS_MAX,
    `Expected normal score between 50 and 220, got ${normalScore}`
  );

  // Glare: RGBA (245, 245, 245, 255)
  const glareRgba = new Uint8ClampedArray(4 * 4).fill(245);
  const glareScore = calculateMeanLuminance(glareRgba);
  assert.ok(glareScore > BRIGHTNESS_MAX, `Expected glare score > ${BRIGHTNESS_MAX}, got ${glareScore}`);
});

test('rgbaToGrayscale correctly converts colors via luminance formula', () => {
  // Pure white (255, 255, 255) -> 255
  const whiteRgba = new Uint8ClampedArray([255, 255, 255, 255]);
  const whiteGray = rgbaToGrayscale(whiteRgba, 1);
  assert.equal(Math.round(whiteGray[0]), 255);

  // Pure black (0, 0, 0) -> 0
  const blackRgba = new Uint8ClampedArray([0, 0, 0, 255]);
  const blackGray = rgbaToGrayscale(blackRgba, 1);
  assert.equal(blackGray[0], 0);
});
