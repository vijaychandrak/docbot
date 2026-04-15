# Advanced Backend Implementation with OpenAI Integration

This guide provides a more advanced backend implementation with real AI capabilities using OpenAI API.

## Setup

### 1. Get OpenAI API Key
- Go to https://platform.openai.com/api-keys
- Create a new API key
- Save it securely

### 2. Install Dependencies

```bash
npm install express cors multer uuid dotenv axios openai
npm install --save-dev nodemon
```

### 3. Create .env File

```env
PORT=3000
OPENAI_API_KEY=your_api_key_here
NODE_ENV=development
```

### 4. Advanced Backend Implementation

Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// OpenAI imports
const OpenAI = require('openai').default;

const app = express();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:4200' : process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Configure file storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Databases
const filesDatabase = [];
const chatDatabase = {};

// ============ HELPER FUNCTIONS ============

/**
 * Extract text from various file types
 * This is a simplified version - use libraries like 'pdfparse', 'docx', etc. for full support
 */
async function extractFileContent(filePath, fileName) {
  try {
    const ext = path.extname(fileName).toLowerCase();
    
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    } else if (ext === '.json') {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.stringify(JSON.parse(content), null, 2);
    } else {
      // For other file types, return filename and size info
      const stats = fs.statSync(filePath);
      return `File: ${fileName}\nSize: ${stats.size} bytes\nNote: Full file content extraction not configured for ${ext} files`;
    }
  } catch (error) {
    console.error('Error extracting file content:', error);
    return `Unable to extract content from ${fileName}`;
  }
}

/**
 * Call OpenAI API to generate response
 */
async function generateAIResponse(fileContent, userMessage, conversationContext) {
  try {
    const systemPrompt = `You are a helpful AI assistant that analyzes files and answers questions about their content.
    
File Content:
${fileContent.substring(0, 4000)}...${fileContent.length > 4000 ? '(truncated)' : ''}

Please provide clear, concise answers based on the file content provided.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate AI response: ' + error.message);
  }
}

// ============ FILE ENDPOINTS ============

/**
 * POST /api/files/upload
 */
app.post('/api/files/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: true,
        message: 'No file provided' 
      });
    }

    const fileId = 'file_' + uuidv4();
    const fileName = req.file.originalname;
    const fileExtension = path.extname(fileName).toLowerCase();

    const fileData = {
      id: fileId,
      fileName: fileName,
      fileExtension: fileExtension,
      uploadedAt: new Date(),
      fileSize: req.file.size,
      filePath: req.file.path,
      content: null // Will be populated on demand
    };

    // Extract file content asynchronously
    try {
      fileData.content = await extractFileContent(req.file.path, fileName);
    } catch (error) {
      console.error('Error extracting content:', error);
    }

    filesDatabase.push(fileData);
    chatDatabase[fileId] = [];

    console.log(`File uploaded: ${fileName} (${fileId})`);

    res.status(200).json({
      id: fileData.id,
      fileName: fileData.fileName,
      fileExtension: fileData.fileExtension,
      uploadedAt: fileData.uploadedAt,
      fileSize: fileData.fileSize
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error uploading file',
      details: error.message
    });
  }
});

/**
 * GET /api/files
 */
app.get('/api/files', (req, res) => {
  try {
    const files = filesDatabase.map(f => ({
      id: f.id,
      fileName: f.fileName,
      fileExtension: f.fileExtension,
      uploadedAt: f.uploadedAt,
      fileSize: f.fileSize
    }));

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error fetching files'
    });
  }
});

/**
 * GET /api/files/:fileId
 */
app.get('/api/files/:fileId', (req, res) => {
  try {
    const file = filesDatabase.find(f => f.id === req.params.fileId);

    if (!file) {
      return res.status(404).json({ 
        error: true,
        message: 'File not found' 
      });
    }

    res.status(200).json({
      id: file.id,
      fileName: file.fileName,
      fileExtension: file.fileExtension,
      uploadedAt: file.uploadedAt,
      fileSize: file.fileSize
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error fetching file'
    });
  }
});

/**
 * DELETE /api/files/:fileId
 */
app.delete('/api/files/:fileId', (req, res) => {
  try {
    const index = filesDatabase.findIndex(f => f.id === req.params.fileId);

    if (index === -1) {
      return res.status(404).json({ 
        error: true,
        message: 'File not found' 
      });
    }

    const fileData = filesDatabase[index];

    // Delete file from disk
    if (fs.existsSync(fileData.filePath)) {
      fs.unlinkSync(fileData.filePath);
    }

    filesDatabase.splice(index, 1);
    delete chatDatabase[req.params.fileId];

    console.log(`File deleted: ${req.params.fileId}`);

    res.status(200).json({ 
      success: true,
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error deleting file'
    });
  }
});

// ============ CHAT ENDPOINTS ============

/**
 * POST /api/chat
 * Send message and get AI response
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { fileId, message } = req.body;

    if (!fileId || !message) {
      return res.status(400).json({ 
        error: true,
        message: 'Missing fileId or message' 
      });
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: true,
        message: 'OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.'
      });
    }

    const file = filesDatabase.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ 
        error: true,
        message: 'File not found' 
      });
    }

    // Save user message
    const userMessage = {
      id: 'msg_' + uuidv4(),
      sender: 'user',
      message: message,
      timestamp: new Date()
    };

    if (!chatDatabase[fileId]) {
      chatDatabase[fileId] = [];
    }
    chatDatabase[fileId].push(userMessage);

    // Get conversation context (last 5 messages for context)
    const conversationContext = chatDatabase[fileId].slice(-11).slice(0, -1);

    // Generate AI response using OpenAI
    const aiResponseText = await generateAIResponse(
      file.content || 'No file content available',
      message,
      conversationContext
    );

    // Save bot message
    const botMessage = {
      id: 'msg_' + uuidv4(),
      sender: 'bot',
      message: aiResponseText,
      timestamp: new Date()
    };

    chatDatabase[fileId].push(botMessage);

    console.log(`Chat message processed for file ${fileId}`);

    res.status(200).json({
      response: aiResponseText,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error processing chat message',
      details: error.message
    });
  }
});

/**
 * GET /api/chat/history/:fileId
 */
app.get('/api/chat/history/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;

    const file = filesDatabase.find(f => f.id === fileId);

    if (!file) {
      return res.status(404).json({ 
        error: true,
        message: 'File not found' 
      });
    }

    const history = chatDatabase[fileId] || [];

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ 
      error: true,
      message: 'Error fetching chat history'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date(),
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: true,
    message: 'Internal server error',
    details: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: true,
    message: 'Endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n=== File Upload & AI Chat Backend Server ===`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Configured ✓' : 'NOT configured ✗'}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(`  POST   /api/files/upload`);
  console.log(`  GET    /api/files`);
  console.log(`  GET    /api/files/:fileId`);
  console.log(`  DELETE /api/files/:fileId`);
  console.log(`  POST   /api/chat`);
  console.log(`  GET    /api/chat/history/:fileId`);
  console.log(`  GET    /api/health`);
  console.log(`====================================\n`);
});

module.exports = app;
```

### 5. Run the Advanced Backend

```bash
node server.js
```

## Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

Then run development mode with auto-reload:

```bash
npm run dev
```

## Features

1. **Real AI Integration**: Uses OpenAI GPT-3.5-turbo
2. **File Storage**: Saves files to disk
3. **Content Extraction**: Reads file content for AI analysis
4. **Conversation Context**: Maintains chat history for context
5. **Error Handling**: Comprehensive error handling and logging
6. **Environment Configuration**: Uses .env for sensitive data

## Supported File Types

- Text files (.txt)
- JSON files (.json)
- Other formats (basic support)

### Adding More File Type Support

Install additional packages:

```bash
npm install pdfparse xlsx mammoth
```

Then extend `extractFileContent()` function to handle these formats.

## Limitations and Considerations

1. **Token Limits**: OpenAI has token limits. Monitor usage.
2. **Cost**: OpenAI API calls cost money. Check pricing.
3. **File Size**: Large files need special handling.
4. **Security**: Keep API key secure, never commit to git.

## Production Deployment

For production:

1. Use a database instead of in-memory storage
2. Add authentication
3. Implement rate limiting
4. Use environment-specific configs
5. Add comprehensive logging
6. Implement proper error handling
7. Add input validation

---

This advanced implementation provides real AI capabilities while remaining relatively simple for learning purposes.
