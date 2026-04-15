import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  /**
   * Send a chat message with file context
   * @param request - The chat request containing fileId and message
   * @returns Observable of the chat response
   */
  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}`, request);
  }

  /**
   * Get chat history for a specific file
   * @param fileId - The ID of the file
   * @returns Observable array of chat messages
   */
  getChatHistory(fileId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${fileId}`);
  }
}
