export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export interface ChatRequest {
  fileId: string;
  message: string;
}

export interface ChatResponse {
  response: string;
  timestamp: Date;
}
