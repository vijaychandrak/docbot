// Sample Node.js/Express Backend Implementation
// This is a basic reference implementation of the required API endpoints

/**
 * Install dependencies:
 * npm install express cors multer uuid dotenv axios
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage (replace with database in production)
const filesDatabase = [];
const chatDatabase = {};

// Helper function to format file response
function formatFileResponse(fileData) {
  return {
    id: fileData.id,
    fileName: fileData.fileName,
    fileExtension: fileData.fileExtension,
    uploadedAt: fileData.uploadedAt,
    fileSize: fileData.fileSize
  };
}

// ============ FILE ENDPOINTS ============

/**
 * POST /api/files/upload
 * Upload a new file
 */
app.post('/api/files/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: true,
        message: 'No file provided' 
      });
    }

    const fileId = 'file_' + uuidv4();
    const fileName = req.file.originalname;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    const fileData = {
      id: fileId,
      fileName: fileName,
      fileExtension: fileExtension,
      uploadedAt: new Date(),
      fileSize: req.file.size,
      buffer: req.file.buffer // Store file content in memory
    };

    filesDatabase.push(fileData);
    chatDatabase[fileId] = [];

    console.log(`File uploaded: ${fileName} (${fileId})`);

    res.status(200).json(formatFileResponse(fileData));
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
 * Get all uploaded files
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
 * Get a specific file by ID
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

    res.status(200).json(formatFileResponse(file));
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
 * Delete a file
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
 * Mock AI response generator
 * Replace with actual AI service (OpenAI, Hugging Face, etc.)
 */
async function generateAIResponse(fileId, message, fileData) {
  // For this example, we'll use a simple mock response
  // In production, integrate with OpenAI, Azure OpenAI, or similar
  
  const mockResponses = [
    'This is an interesting question about the file. Based on the content, I can help you analyze it.',
    'The file appears to contain important information. Let me help you understand it better.',
    'I\'ve analyzed the file content related to your query. Here are my insights...',
    'Great question! The file data suggests that...',
    'Based on what I see in this file, I can provide the following analysis...'
  ];

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return a random mock response
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
}

/**
 * POST /api/chat
 * Send a chat message and get AI response
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

    // Generate AI response
    const aiResponse = await generateAIResponse(fileId, message, file);

    // Save bot message
    const botMessage = {
      id: 'msg_' + uuidv4(),
      sender: 'bot',
      message: aiResponse,
      timestamp: new Date()
    };

    chatDatabase[fileId].push(botMessage);

    console.log(`Chat message processed for file ${fileId}`);

    res.status(200).json({
      response: aiResponse,
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
 * Get chat history for a file
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
    timestamp: new Date()
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
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API Endpoints:');
  console.log(`  POST   /api/files/upload`);
  console.log(`  GET    /api/files`);
  console.log(`  GET    /api/files/:fileId`);
  console.log(`  DELETE /api/files/:fileId`);
  console.log(`  POST   /api/chat`);
  console.log(`  GET    /api/chat/history/:fileId`);
});

module.exports = app;
