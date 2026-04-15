import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { FileService } from '../../services/file.service';
import { ChatMessage, ChatRequest } from '../../models/chat.model';
import { UploadedFile } from '../../models/file.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  fileId: string = '';
  file: UploadedFile | null = null;
  messages: ChatMessage[] = [];
  messageInput: string = '';
  isLoading = false;
  isLoadingHistory = false;
  error: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['fileId']) {
          this.fileId = params['fileId'];
          this.loadFileInfo();
          this.loadChatHistory();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load file information
   */
  loadFileInfo(): void {
    this.fileService.getFileById(this.fileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (file) => {
          this.file = file;
        },
        error: (error) => {
          this.error = 'Error loading file information';
          console.error(error);
        }
      });
  }

  /**
   * Load chat history for the file
   */
  loadChatHistory(): void {
    this.isLoadingHistory = true;
    this.chatService.getChatHistory(this.fileId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (history) => {
          this.messages = history;
          this.isLoadingHistory = false;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          this.isLoadingHistory = false;
          console.error('Error loading chat history:', error);
        }
      });
  }

  /**
   * Send a chat message
   */
  sendMessage(): void {
    if (!this.messageInput.trim() || !this.fileId) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: this.messageInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.messageInput = '';
    this.isLoading = true;
    this.error = '';

    const request: ChatRequest = {
      fileId: this.fileId,
      message: userMessage.message
    };

    this.chatService.sendMessage(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            message: response.response,
            timestamp: new Date(response.timestamp)
          };
          this.messages.push(botMessage);
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Error sending message: ' + (error.error?.message || error.message);
          console.error(error);
        }
      });
  }

  /**
   * Scroll chat to bottom
   */
  private scrollToBottom(): void {
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  /**
   * Handle enter key in input
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  /**
   * Format date for display
   */
  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
