# File Upload & AI Chat Application

A modern Angular application that enables users to upload files and interact with them through an AI-powered chatbot interface.

## Features

- **File Upload**: Upload any file type with drag-and-drop support
- **File Management**: View all uploaded files in a structured table with details
- **File Processing**: Automatic file processing via REST API
- **AI Chat Interface**: Chat with an AI agent about your uploaded files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Project Structure

```
file-upload-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── file-upload/      # File upload and listing component
│   │   │   └── chat/             # Chat interface component
│   │   ├── services/
│   │   │   ├── file.service.ts   # File operations API service
│   │   │   └── chat.service.ts   # Chat API service
│   │   ├── models/
│   │   │   ├── file.model.ts     # File interfaces
│   │   │   └── chat.model.ts     # Chat interfaces
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Application routing
│   │   └── app.config.ts         # Application configuration
│   ├── main.ts                   # Application bootstrap
│   ├── index.html                # HTML entry point
│   └── styles.css                # Global styles
├── package.json                  # Dependencies
├── angular.json                  # Angular configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. **Clone or extract the project**
   ```bash
   cd file-upload-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Configuration

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your API endpoints**
   ```
   UPLOAD_API_URL=http://localhost:3000/api/files/upload
   CHAT_API_URL=http://localhost:3000/api/chat
   ```

## API Endpoints

The application expects the following REST API endpoints:

### File Upload & Management
- **POST** `/api/files/upload` - Upload a file
  - Request: FormData with `file` field
  - Response: `{ id, fileName, fileExtension, uploadedAt, fileSize }`

- **GET** `/api/files` - Get all uploaded files
  - Response: `UploadedFile[]`

- **GET** `/api/files/{fileId}` - Get file by ID
  - Response: `UploadedFile`

- **DELETE** `/api/files/{fileId}` - Delete a file
  - Response: `{ success: boolean }`

### Chat API
- **POST** `/api/chat` - Send a chat message
  - Request: `{ fileId: string, message: string }`
  - Response: `{ response: string, timestamp: date }`

- **GET** `/api/chat/history/{fileId}` - Get chat history
  - Response: `ChatMessage[]`

### Example Chat Message Structure
```json
{
  "id": "msg_123",
  "sender": "bot",
  "message": "This is a response from the AI agent",
  "timestamp": "2024-01-14T10:30:00Z"
}
```

## Running the Application

### Development Server
```bash
npm start
```
or
```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Build for Production
```bash
npm run build
```
or
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Key Components

### File Upload Component
- Handles file selection via input or drag-and-drop
- Displays upload progress and status messages
- Shows table of all uploaded files with details:
  - ID
  - File Name
  - Extension
  - Upload Date & Time
  - File Size
  - Actions (Chat, Delete)

### Chat Component
- Real-time chat interface with AI agent
- Loads and displays chat history
- Sends messages to backend for processing
- Shows typing indicator while waiting for response
- Auto-scrolls to latest message

## Services

### FileService
Handles all file-related API calls:
- `uploadFile(file: File)` - Upload a file
- `getUploadedFiles()` - Fetch all files
- `getFileById(fileId: string)` - Get specific file
- `deleteFile(fileId: string)` - Delete a file

### ChatService
Handles chat-related API calls:
- `sendMessage(request: ChatRequest)` - Send a chat message
- `getChatHistory(fileId: string)` - Fetch chat history

## Usage Guide

### Uploading a File
1. Navigate to the home page
2. Click "Choose File" or drag-and-drop a file into the drop zone
3. Click "Upload" to submit the file
4. The file will appear in the table below

### Chatting with AI Agent
1. Click the "Chat" button next to any file in the table
2. Type your message in the input field
3. Press Enter or click "Send"
4. View the AI agent's response in the chat area
5. Click "← Back to Files" to return to the file listing

## Styling

The application uses a clean, modern design with:
- Gradient headers
- Responsive tables
- Smooth animations and transitions
- Mobile-friendly layout
- Accessible color scheme

Customize colors by editing:
- `src/app/app.component.css` - CSS variables
- Individual component CSS files

## Technologies Used

- **Angular 17**: Modern web framework
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **CSS3**: Styling and animations
- **HTML5**: Markup

## Troubleshooting

### Issue: "Cannot find module '@angular/core'"
**Solution**: Run `npm install`

### Issue: API requests failing
**Solution**: 
- Ensure backend server is running
- Check API endpoint URLs in services
- Verify CORS settings on backend

### Issue: Chat not responding
**Solution**:
- Check browser console for error messages
- Verify chat API endpoint is correct
- Ensure file ID is valid

## Future Enhancements

- [ ] File preview functionality
- [ ] Multiple file upload
- [ ] File download capability
- [ ] Enhanced error handling and notifications
- [ ] User authentication
- [ ] Advanced analytics
- [ ] Integration with WebSockets for real-time updates

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the Angular documentation:
- [Angular Official Docs](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)

## Contributors

- Initial project setup and implementation

---

**Last Updated**: April 2024
