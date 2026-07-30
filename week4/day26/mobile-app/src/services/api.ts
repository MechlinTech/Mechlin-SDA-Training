import { API_CONFIG } from "../constants/config";

class APIService {
  private baseUrl = API_CONFIG.BASE_URL;

  private async request(
    endpoint: string,
    method: string = "GET",
    body?: any
  ) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async chat(message: string, conversationHistory: any[]) {
    return this.request("/chat", "POST", {
      message,
      conversation_history: conversationHistory,
    });
  }

  async generateContent(data: {
    content_type: string;
    topic: string;
    tone: string;
    length: string;
    keywords: string[];
  }) {
    return this.request("/generate-content", "POST", data);
  }

  async getRecommendations(profile: any) {
    return this.request("/recommendations", "POST", {
      preferences: [
        ...profile.interests,
        profile.experience,
        profile.goal,
      ],
    });
  }

  async submitFeedback(
    rating: number,
    recommendations: any[],
    profile: any
  ) {
    return this.request("/feedback", "POST", {
      rating,
      recommendations,
      user_profile: profile,
    });
  }

  async health() {
    return this.request("/health");
  }
}

export default new APIService();