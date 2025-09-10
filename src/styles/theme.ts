export const colors = {
  primary: "#1DA1F2",
  primaryDark: "#0891D1",
  primaryLight: "#4DB8F5",

  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Background colors
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    overlay: "rgba(0, 0, 0, 0.3)",
  },

  // Text colors
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    inverse: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.9)",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  ms: 15,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Standard screen padding for consistent layout
  screenVertical: 24,
  screenHorizontal: 16,
  // Safe area padding for notches and home indicators
  screenTop: 64,
  screenBottom: 24,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

export const fontWeight = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};
