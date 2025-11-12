// Timer configuration
export const TIMER_CONFIG = {
  goalTime: 60,
  radius: 115,
  startColor: { r: 172, g: 224, b: 232 },
  endColor: { r: 0, g: 163, b: 199 },
};

// Helper function to format time as MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Helper function to calculate progress percentage
export const calculateProgress = (
  timeRemaining: number,
  goalTime: number,
): number => {
  return ((goalTime - timeRemaining) / goalTime) * 100;
};

// Helper function to interpolate color based on progress
export const getProgressColor = (progress: number): string => {
  const { startColor, endColor } = TIMER_CONFIG;
  const ratio = progress / 100;
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
};

// Helper function to calculate dot position on circle
export const getProgressDotPosition = (progress: number, radius: number) => {
  const angle = (progress / 100) * 360 - 90; // Start from top (-90 degrees)
  const angleRad = (angle * Math.PI) / 180;
  return {
    left: 120 + radius * Math.cos(angleRad) - 6,
    top: 120 + radius * Math.sin(angleRad) - 6,
  };
};
