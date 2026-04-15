# Backend API Implementation Guide

This guide provides example implementations for the REST APIs that the Angular application expects.

## Tech Stack Examples

Choose one of the following for your backend:
- Node.js/Express
- Python/Flask or FastAPI
- Java/Spring Boot
- C#/.NET
- Go/Gin

## API Endpoints Implementation

### 1. File Upload Endpoint

**POST** `/api/files/upload`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with `file` field

**Response (200 OK):**
```json
{
  "id": "file_123456",
  "fileName": "document.pdf",
  "fileExtension": ".pdf",
  "uploadedAt": "2024-04-14T10:30:00Z",
  "fileSize": 1024000
}
```

**Node.js/Express Example:**
```javascript
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileId = 'file_' + Date.now();
  const fileExtension = path.extname(req.file.originalname);
  
  res.json({
    id: fileId,
    fileName: req.file.originalname,
    fileExtension: fileExtension,
    uploadedAt: new Date(),
    fileSize: req.file.size
  });
});
```

### 2. Get All Files Endpoint

**GET** `/api/files`

**Response (200 OK):**
```json
[
  {
    "id": "file_123456",
    "fileName": "document.pdf",
    "fileExtension": ".pdf",
    "uploadedAt": "2024-04-14T10:30:00Z",
    "fileSize": 1024000
  },
  {
    "id": "file_123457",
    "fileName": "image.jpg",
    "fileExtension": ".jpg",
    "uploadedAt": "2024-04-14T11:00:00Z",
    "fileSize": 2048000
  }
]
```

**Node.js/Express Example:**
```javascript
app.get('/api/files', (req, res) => {
  // Query your database for all files
  const files = database.getAllFiles();
  res.json(files);
});
```

### 3. Get File by ID Endpoint

**GET** `/api/files/:fileId`

**Response (200 OK):**
```json
{
  "id": "file_123456",
  "fileName": "document.pdf",
  "fileExtension": ".pdf",
  "uploadedAt": "2024-04-14T10:30:00Z",
  "fileSize": 1024000
}
```

### 4. Delete File Endpoint

**DELETE** `/api/files/:fileId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 5. Chat Endpoint (Send Message)

**POST** `/api/chat`

**Request:**
```json
{
  "fileId": "file_123456",
  "message": "Summarize the content of this file"
}
```

**Response (200 OK):**
```json
{
  "response": "This file contains a detailed analysis of...",
  "timestamp": "2024-04-14T10:35:00Z"
}
```

**Implementation Notes:**
- Process the user message with your AI/LLM service
- You can use OpenAI API, Hugging Face, or any other AI service
- Retrieve file content from storage based on fileId
- Pass file context to your AI service

**Node.js/Express + OpenAI Example:**
```javascript
app.post('/api/chat', async (req, res) => {
  const { fileId, message } = req.body;
  
  try {
    // Retrieve file content
    const fileContent = await storage.getFile(fileId);
    
    // Call OpenAI or your AI service
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an AI assistant. Here is the file content:\n${fileContent}` },
        { role: "user", content: message }
      ]
    });
    
    // Save message to database
    await database.saveChatMessage(fileId, 'user', message);
    await database.saveChatMessage(fileId, 'bot', response.choices[0].message.content);
    
    res.json({
      response: response.choices[0].message.content,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing message' });
  }
});
```

### 6. Get Chat History Endpoint

**GET** `/api/chat/history/:fileId`

**Response (200 OK):**
```json
[
  {
    "id": "msg_1",
    "sender": "user",
    "message": "What is this file about?",
    "timestamp": "2024-04-14T10:30:00Z"
  },
  {
    "id": "msg_2",
    "sender": "bot",
    "message": "This file appears to be...",
    "timestamp": "2024-04-14T10:30:05Z"
  }
]
```

## CORS Configuration

The backend must enable CORS for the Angular frontend:

**Node.js/Express:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

## Database Schema (Optional Reference)

### Files Table
```
CREATE TABLE files (
  id VARCHAR(255) PRIMARY KEY,
  fileName VARCHAR(255) NOT NULL,
  fileExtension VARCHAR(50) NOT NULL,
  uploadedAt TIMESTAMP,
  fileSize BIGINT,
  filePath VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Chat Messages Table
```
CREATE TABLE chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  fileId VARCHAR(255) REFERENCES files(id),
  sender VARCHAR(50),
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

All endpoints should return appropriate HTTP status codes:

- **200**: Success
- **400**: Bad request (missing fields, invalid format)
- **404**: Resource not found
- **500**: Server error

Error Response Format:
```json
{
  "error": true,
  "message": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

## Authentication (Optional)

For production, add authentication:

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Use middleware on protected routes
app.post('/api/files/upload', authenticateToken, ...);
```

## Rate Limiting (Optional)

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## File Storage

Choose one of the following for file storage:
- Local file system
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

## Testing the API

Use Postman, Insomnia, or curl to test endpoints:

```bash
# Upload file
curl -X POST -F "file=@path/to/file.pdf" http://localhost:3000/api/files/upload

# Get all files
curl http://localhost:3000/api/files

# Send chat message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"fileId":"file_123456","message":"Summarize this"}'
```

---

For more details on setting up a specific backend framework, refer to its official documentation.
