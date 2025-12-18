/**
 * Onboarding Constants
 * Product types, focus goals, and other onboarding-related constants
 */

// Product Selection
export const PRODUCTS = [
  { id: "cold-plunge", name: "Cold Plunge", type: "cold-plunge" },
  { id: "hot-tub", name: "Hot Tub", type: "hot-tub" },
  { id: "sauna", name: "Sauna", type: "sauna" },
] as const;

export type ProductType = (typeof PRODUCTS)[number]["type"];

// Focus Goals
export const FOCUS_GOALS = [
  {
    key: "stress-relief",
    label: "Stress Relief",
    description: "Reduce stress and find calm",
  },
  {
    key: "training-recovery",
    label: "Training Recovery",
    description: "Optimize recovery after workouts",
  },
  {
    key: "traveler-balance",
    label: "Traveler Balance",
    description: "Combat jet lag and travel fatigue",
  },
  {
    key: "muscle-recovery",
    label: "Muscle Recovery",
    description: "Speed up muscle repair and reduce soreness",
  },
  {
    key: "relax-rebalance",
    label: "Relax & Rebalance",
    description: "Find balance and relaxation",
  },
  { key: "other", label: "Other", description: "Custom wellness goal" },
] as const;

export type FocusGoalKey = (typeof FOCUS_GOALS)[number]["key"];
