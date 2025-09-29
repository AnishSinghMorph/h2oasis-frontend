/**
 * ROOK Service for Health Data Integration
 * This service handles all ROOK SDK operations for H2Oasis
 */
export class RookService {
  private static instance: RookService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): RookService {
    if (!RookService.instance) {
      RookService.instance = new RookService();
    }
    return RookService.instance;
  }

  /**
   * Check if ROOK is properly initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Mark ROOK as initialized (called after RookSyncGate setup)
   */
  markAsInitialized(): void {
    this.isInitialized = true;
    console.log("✅ ROOK Service marked as initialized");
  }

  /**
   * Get current initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export const rookService = RookService.getInstance();
