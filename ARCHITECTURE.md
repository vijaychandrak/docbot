# Application Architecture

## System Overview

This document describes the architecture of the File Upload & AI Chat Application.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (Angular)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │   File Upload Page   │         │    Chat Interface    │      │
│  │                      │         │                      │      │
│  │ • File Selection     │         │ • Message Input      │      │
│  │ • Drag & Drop        │         │ • Message Display    │      │
│  │ • File List Table    │         │ • Typing Indicator   │      │
│  │ • Delete Action      │         │ • Auto-scroll        │      │
│  └──────────────────────┘         └──────────────────────┘      │
│           ▲                                 ▲                     │
│           │                                 │                     │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            │ HTTP/REST                       │ HTTP/REST
            │ (FormData, JSON)                │ (JSON)
            │                                 │
┌───────────▼─────────────────────────────────▼───────────────────┐
│                    HTTP CLIENT LAYER                             │
│            (Services: FileService, ChatService)                 │
└────────────────────────┬──────────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         │
┌────────────────────────▼──────────────────────────────────────────┐
│                   API GATEWAY / BACKEND SERVER                    │
├────────────────────────┬──────────────────────────────────────────┤
│                                                                    │
│  REST API Routes:                                                 │
│  • POST   /api/files/upload      (Upload file)                   │
│  • GET    /api/files              (Get all files)                │
│  • GET    /api/files/:fileId      (Get file by ID)               │
│  • DELETE /api/files/:fileId      (Delete file)                  │
│  • POST   /api/chat               (Send message)                 │
│  • GET    /api/chat/history/:id   (Get history)                  │
│                                                                    │
└────────────────────────┬──────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│  File Store  │  │  Database   │  │  AI Service │
│              │  │             │  │  (OpenAI)   │
│ • Uploads    │  │ • Files     │  │             │
│ • Metadata   │  │ • Messages  │  │ • GPT-3.5   │
│              │  │ • Chat Logs │  │ • Analysis  │
└──────────────┘  └─────────────┘  └─────────────┘
```

## Component Architecture

### Frontend Components

#### 1. FileUploadComponent
- **Location**: `src/app/components/file-upload/`
- **Responsibilities**:
  - File selection (input or drag-drop)
  - File upload to backend
  - Display list of uploaded files
  - Delete file functionality
- **Inputs**: None
- **Outputs**: None
- **Services Used**: FileService

#### 2. ChatComponent
- **Location**: `src/app/components/chat/`
- **Responsibilities**:
  - Display chat interface
  - Load chat history from backend
  - Send user messages
  - Display AI responses
  - Show typing indicator
- **Inputs**: fileId (from route params)
- **Outputs**: None
- **Services Used**: ChatService, FileService

### Services

#### FileService
```typescript
Methods:
- uploadFile(file: File): Observable<UploadedFile>
- getUploadedFiles(): Observable<UploadedFile[]>
- getFileById(fileId: string): Observable<UploadedFile>
- deleteFile(fileId: string): Observable<any>

HTTP Endpoints:
- POST /api/files/upload
- GET /api/files
- GET /api/files/{fileId}
- DELETE /api/files/{fileId}
```

#### ChatService
```typescript
Methods:
- sendMessage(request: ChatRequest): Observable<ChatResponse>
- getChatHistory(fileId: string): Observable<ChatMessage[]>

HTTP Endpoints:
- POST /api/chat
- GET /api/chat/history/{fileId}
```

## Data Models

### UploadedFile
```typescript
interface UploadedFile {
  id: string;              // Unique identifier
  fileName: string;        // Original filename
  fileExtension: string;   // File extension (e.g., .pdf)
  uploadedAt: Date;        // Upload timestamp
  fileSize: number;        // File size in bytes
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;              // Unique message ID
  sender: 'user' | 'bot';  // Message sender
  message: string;         // Message content
  timestamp: Date;         // Message timestamp
}
```

### ChatRequest
```typescript
interface ChatRequest {
  fileId: string;          // File being discussed
  message: string;         // User's message
}
```

### ChatResponse
```typescript
interface ChatResponse {
  response: string;        // AI's response
  timestamp: Date;         // Response timestamp
}
```

## Data Flow

### File Upload Flow

```
User selects file
        │
        ▼
FileUploadComponent validates
        │
        ▼
Calls FileService.uploadFile()
        │
        ▼
HttpClient sends FormData to backend
        │
        ▼
Backend processes file
        │
        ├─► Saves to storage
        ├─► Saves metadata to DB
        └─► Generates ID
        │
        ▼
Response with file metadata
        │
        ▼
Component updates file list
        │
        ▼
UI re-renders with new file
```

### Chat Message Flow

```
User types message
        │
        ▼
User presses Enter
        │
        ▼
ChatComponent validates input
        │
        ▼
Saves user message locally
        │
        ▼
Calls ChatService.sendMessage()
        │
        ▼
HttpClient sends POST request
        │
        ▼
Backend receives request
        │
        ├─► Retrieves file content
        ├─► Calls AI service (OpenAI)
        ├─► Saves messages to DB
        └─► Generates response
        │
        ▼
Response with AI message
        │
        ▼
Component displays bot message
        │
        ▼
UI updates with new message
```

## Technology Stack

### Frontend
- **Framework**: Angular 17
- **Language**: TypeScript 5.2
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **Forms**: Angular FormsModule
- **CSS**: CSS3 with Flexbox/Grid
- **Styling**: Custom CSS (no external framework)

### Backend (Reference Implementation)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (optional)
- **File Storage**: Local filesystem or cloud storage
- **Database**: Any SQL/NoSQL (optional)
- **AI Service**: OpenAI API
- **CORS**: Express CORS middleware

## Networking

### API Communication

All communication uses HTTP/HTTPS with REST principles:

- **Upload**: POST with multipart/form-data
- **Download/Fetch**: GET with query parameters
- **Create/Update**: POST with JSON body
- **Delete**: DELETE with resource ID
- **Response Format**: JSON

### Request/Response Headers

**Request**:
```
Content-Type: application/json
Authorization: Bearer <token> (if using auth)
```

**Response**:
```
Content-Type: application/json
Status-Code: 200, 400, 404, 500, etc.
```

## State Management

### Frontend State
- **Component State**: Using @Component class properties
- **Reactive Programming**: RxJS Observables and Subjects
- **Error Handling**: Try-catch and error callbacks

### Backend State
- **In-Memory**: For demo purposes
- **Database**: For production
- **Cache**: Optional, for performance

## Security Considerations

### Frontend
- Input validation before sending
- XSS protection (Angular built-in)
- CSRF tokens (if needed)
- Content Security Policy

### Backend
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Authentication/Authorization
- File upload validation
- API key management (for external services)

## Error Handling

### Frontend
- HTTP error interceptors
- User-friendly error messages
- Console logging for debugging
- Error boundaries

### Backend
- Try-catch blocks
- Proper HTTP status codes
- Detailed error responses
- Server logging

## Performance Optimization

### Frontend
- Lazy loading components
- Async/defer script loading
- CSS optimization
- Change detection optimization

### Backend
- Connection pooling
- Caching strategies
- Database indexing
- Load balancing
- CDN for static assets

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancing
- Distributed file storage
- Database replication

### Vertical Scaling
- Optimize database queries
- Reduce file sizes
- Cache responses
- Compress data

## Deployment Architecture

```
┌──────────────────────────────────┐
│      CDN/Static Hosting           │
│   (Angular dist files)            │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│     Load Balancer                 │
└──────────────────────────────────┘
           │
    ┌──────┴──────┬──────────┐
    ▼             ▼          ▼
┌────────┐   ┌────────┐   ┌────────┐
│Backend │   │Backend │   │Backend │
│Server1 │   │Server2 │   │Server3 │
└────────┘   └────────┘   └────────┘
    │             │          │
    └──────┬──────┴──────┬───┘
           ▼
    ┌──────────────────┐
    │  Database Pool   │
    └──────────────────┘
           │
    ┌──────┴──────────┐
    ▼                ▼
┌────────┐      ┌───────────┐
│ Primary│◄────►│ Secondary │
│ DB     │      │ DB        │
└────────┘      └───────────┘
```

## Monitoring and Logging

### Metrics to Track
- API response times
- File upload success rate
- Chat message processing time
- Error rates
- User engagement

### Logging Points
- API request/response
- File operations
- Chat interactions
- Error events
- Database queries

---

This architecture provides a scalable, maintainable foundation for the file upload and chat application.
