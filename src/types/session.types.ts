/**
 * Session Types
 * Types for H2Oasis guided wellness sessions
 */

/**
 * A single step within a wellness session
 */
export interface SessionStep {
  StepNumber: number;
  Activity: string; // e.g., "spa", "meditation", "breathing", "hotTub", "sauna"
  DurationMinutes: number;
  Instructions: string;
  Message: string;
  TimerStartMessage: string;
  TimerEndMessage: string;
}

/**
 * A complete wellness session with multiple steps
 */
export interface Session {
  SessionId: string;
  SessionName: string;
  TotalDurationMinutes: number;
  RecommendedFor: string;
  Steps: SessionStep[];
  StartMessage: string;
  CompletionMessage: string;
  Tips: string[];
  CreatedAt: string;
}

/**
 * Request body for creating a new session
 */
export interface CreateSessionRequest {
  tags: string[]; // Product types: ["Spa", "Hot Tub", "Sauna", etc.]
  goals?: string[]; // Wellness goals: ["relaxation", "stress relief", "recovery"]
  mood?: string; // Current mood: "stressed", "tired", "energetic", "relaxed"
  message?: string; // User message/request
  customPrompt?: string; // Additional context
}

/**
 * API response for session creation
 */
export interface CreateSessionResponse {
  success: boolean;
  message?: string;
  session?: Session;
  error?: string;
}

/**
 * Session state for active session tracking
 */
export interface SessionState {
  currentSession: Session | null;
  currentStepIndex: number;
  isActive: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
}
