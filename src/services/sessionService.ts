import { API_BASE_URL } from "../config/api";
import { Session } from "../types/session.types";

interface GetSessionsResponse {
  success: boolean;
  sessions: Session[];
  count: number;
}

interface UpdateSessionRequest {
  SessionName?: string;
  TotalDurationMinutes?: number;
  Steps?: any[];
  isCompleted?: boolean;
}

interface UpdateSessionResponse {
  success: boolean;
  session: Session;
}

interface SessionStatsResponse {
  success: boolean;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

export const sessionService = {
  /**
   * Get all sessions for the authenticated user
   */
  async getSessions(
    firebaseUID: string,
    filters?: { completed?: boolean },
  ): Promise<Session[]> {
    try {
      let url = `${API_BASE_URL}/api/sessions`;

      // Add query params if filters provided
      const params = new URLSearchParams();
      if (filters?.completed !== undefined) {
        params.append("completed", filters.completed.toString());
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": firebaseUID,
        },
      });

      const data: GetSessionsResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch sessions");
      }

      return data.sessions;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      throw error;
    }
  },

  /**
   * Update a session (favorite, complete, edit timers)
   */
  async updateSession(
    firebaseUID: string,
    sessionId: string,
    updates: UpdateSessionRequest,
  ): Promise<Session> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${sessionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
          body: JSON.stringify(updates),
        },
      );

      const data: UpdateSessionResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to update session");
      }

      return data.session;
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    }
  },

  /**
   * Mark session as completed
   */
  async markCompleted(
    firebaseUID: string,
    sessionId: string,
  ): Promise<Session> {
    return this.updateSession(firebaseUID, sessionId, { isCompleted: true });
  },

  /**
   * Delete a session
   */
  async deleteSession(firebaseUID: string, sessionId: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-firebase-uid": firebaseUID,
          },
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      throw error;
    }
  },

  /**
   * Get session statistics
   */
  async getStats(firebaseUID: string): Promise<SessionStatsResponse["stats"]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-firebase-uid": firebaseUID,
        },
      });

      const data: SessionStatsResponse = await response.json();

      if (!data.success) {
        throw new Error("Failed to fetch session stats");
      }

      return data.stats;
    } catch (error) {
      console.error("Error fetching session stats:", error);
      throw error;
    }
  },
};
