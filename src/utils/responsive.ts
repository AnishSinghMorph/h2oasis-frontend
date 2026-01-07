/**
 * Responsive Scaling Utility
 *
 * Provides consistent scaling across different device sizes.
 * Base design is iPhone 14 Pro (393 x 852)
 */

import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (iPhone 14 Pro design)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * Scale a value based on screen width
 * Use for: horizontal paddings, margins, widths, font sizes
 */
export const wp = (size: number): number => {
  return Math.round(size * widthScale);
};

/**
 * Scale a value based on screen height
 * Use for: vertical paddings, margins, heights
 */
export const hp = (size: number): number => {
  return Math.round(size * heightScale);
};

/**
 * Moderate scale - less aggressive scaling
 * Use for: font sizes to prevent extreme scaling
 * @param size - base size
 * @param factor - scaling factor (0-1), default 0.5
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (widthScale - 1) * size * factor);
};

/**
 * Font scaling with Android accessibility consideration
 * Respects system font scaling up to a reasonable limit
 */
export const fontScale = (size: number): number => {
  const scaledSize = moderateScale(size, 0.4);

  // Limit font scaling on Android to prevent layout breaks
  if (Platform.OS === "android") {
    const pixelRatio = PixelRatio.getFontScale();
    // Limit scaling to 1.3x to prevent overflow
    const maxScale = Math.min(pixelRatio, 1.3);
    return Math.round(scaledSize / pixelRatio) * maxScale;
  }

  return scaledSize;
};

/**
 * Get percentage of screen width
 */
export const widthPercent = (percent: number): number => {
  return Math.round((SCREEN_WIDTH * percent) / 100);
};

/**
 * Get percentage of screen height
 */
export const heightPercent = (percent: number): number => {
  return Math.round((SCREEN_HEIGHT * percent) / 100);
};

/**
 * Check if device is a small screen (< 375 width)
 */
export const isSmallDevice = SCREEN_WIDTH < 375;

/**
 * Check if device is a large screen (> 414 width)
 */
export const isLargeDevice = SCREEN_WIDTH > 414;

/**
 * Check if device has a short height (< 700)
 */
export const isShortDevice = SCREEN_HEIGHT < 700;

/**
 * Screen dimensions
 */
export const screenWidth = SCREEN_WIDTH;
export const screenHeight = SCREEN_HEIGHT;

/**
 * Normalize size for consistent cross-platform sizing
 */
export const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export default {
  wp,
  hp,
  moderateScale,
  fontScale,
  widthPercent,
  heightPercent,
  isSmallDevice,
  isLargeDevice,
  isShortDevice,
  screenWidth,
  screenHeight,
  normalize,
};
