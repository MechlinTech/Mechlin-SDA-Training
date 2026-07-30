export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  }
  
  export interface ChatRequest {
    message: string;
    conversation_history: {
      role: string;
      content: string;
    }[];
  }
  
  export interface ChatResponse {
    success: boolean;
    response: string;
  }