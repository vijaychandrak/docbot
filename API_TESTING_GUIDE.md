# API Testing Guide & Examples

This guide provides example requests and responses for testing the application APIs using tools like Postman, Insomnia, or curl.

## API Base URL

```
Development: http://localhost:3000
Production: https://api.yourdomain.com (update as needed)
```

---

## File Upload Endpoints

### 1. Upload a File

**Endpoint**: `POST /api/files/upload`

**Content-Type**: `multipart/form-data`

#### Using curl:
```bash
curl -X POST \
  -F "file=@/path/to/file.pdf" \
  http://localhost:3000/api/files/upload
```

#### Using Postman:
1. Set Method: POST
2. URL: `http://localhost:3000/api/files/upload`
3. Body → form-data
4. Key: `file` (type: File)
5. Value: Select your file
6. Click Send

#### Expected Response (200 OK):
```json
{
  "id": "file_123e4567-e89b-12d3-a456-426614174000",
  "fileName": "document.pdf",
  "fileExtension": ".pdf",
  "uploadedAt": "2024-04-14T10:30:00.000Z",
  "fileSize": 102400
}
```

#### Error Response (400):
```json
{
  "error": true,
  "message": "No file provided"
}
```

---

### 2. Get All Files

**Endpoint**: `GET /api/files`

**Content-Type**: `application/json`

#### Using curl:
```bash
curl -X GET http://localhost:3000/api/files
```

#### Using Postman:
1. Set Method: GET
2. URL: `http://localhost:3000/api/files`
3. Click Send

#### Expected Response (200 OK):
```json
[
  {
    "id": "file_123e4567-e89b-12d3-a456-426614174000",
    "fileName": "document.pdf",
    "fileExtension": ".pdf",
    "uploadedAt": "2024-04-14T10:30:00.000Z",
    "fileSize": 102400
  },
  {
    "id": "file_987e6543-e89b-54d3-a456-426614174999",
    "fileName": "image.jpg",
    "fileExtension": ".jpg",
    "uploadedAt": "2024-04-14T11:00:00.000Z",
    "fileSize": 204800
  }
]
```

#### Empty Response (200 OK):
```json
[]
```

---

### 3. Get Specific File

**Endpoint**: `GET /api/files/{fileId}`

**Content-Type**: `application/json`

**Path Parameters**:
- `fileId` (string, required) - The file ID from upload response

#### Using curl:
```bash
curl -X GET http://localhost:3000/api/files/file_123e4567-e89b-12d3-a456-426614174000
```

#### Using Postman:
1. Set Method: GET
2. URL: `http://localhost:3000/api/files/file_123e4567-e89b-12d3-a456-426614174000`
3. Click Send

#### Expected Response (200 OK):
```json
{
  "id": "file_123e4567-e89b-12d3-a456-426614174000",
  "fileName": "document.pdf",
  "fileExtension": ".pdf",
  "uploadedAt": "2024-04-14T10:30:00.000Z",
  "fileSize": 102400
}
```

#### Error Response (404):
```json
{
  "error": true,
  "message": "File not found"
}
```

---

### 4. Delete File

**Endpoint**: `DELETE /api/files/{fileId}`

**Content-Type**: `application/json`

**Path Parameters**:
- `fileId` (string, required) - The file ID to delete

#### Using curl:
```bash
curl -X DELETE http://localhost:3000/api/files/file_123e4567-e89b-12d3-a456-426614174000
```

#### Using Postman:
1. Set Method: DELETE
2. URL: `http://localhost:3000/api/files/file_123e4567-e89b-12d3-a456-426614174000`
3. Click Send

#### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

#### Error Response (404):
```json
{
  "error": true,
  "message": "File not found"
}
```

---

## Chat Endpoints

### 1. Send Chat Message

**Endpoint**: `POST /api/chat`

**Content-Type**: `application/json`

**Request Body**:
```json
{
  "fileId": "file_123e4567-e89b-12d3-a456-426614174000",
  "message": "What is the main topic of this document?"
}
```

#### Using curl:
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "file_123e4567-e89b-12d3-a456-426614174000",
    "message": "What is the main topic?"
  }' \
  http://localhost:3000/api/chat
```

#### Using Postman:
1. Set Method: POST
2. URL: `http://localhost:3000/api/chat`
3. Headers tab → Add: `Content-Type: application/json`
4. Body → raw → JSON:
```json
{
  "fileId": "file_123e4567-e89b-12d3-a456-426614174000",
  "message": "What is the main topic of this document?"
}
```
5. Click Send

#### Expected Response (200 OK):
```json
{
  "response": "Based on the document content, the main topic appears to be...",
  "timestamp": "2024-04-14T10:35:00.000Z"
}
```

#### Validation Error (400):
```json
{
  "error": true,
  "message": "Missing fileId or message"
}
```

#### File Not Found (404):
```json
{
  "error": true,
  "message": "File not found"
}
```

---

### 2. Get Chat History

**Endpoint**: `GET /api/chat/history/{fileId}`

**Content-Type**: `application/json`

**Path Parameters**:
- `fileId` (string, required) - The file ID to get chat history for

#### Using curl:
```bash
curl -X GET http://localhost:3000/api/chat/history/file_123e4567-e89b-12d3-a456-426614174000
```

#### Using Postman:
1. Set Method: GET
2. URL: `http://localhost:3000/api/chat/history/file_123e4567-e89b-12d3-a456-426614174000`
3. Click Send

#### Expected Response (200 OK):
```json
[
  {
    "id": "msg_001",
    "sender": "user",
    "message": "What is the main topic?",
    "timestamp": "2024-04-14T10:30:00.000Z"
  },
  {
    "id": "msg_002",
    "sender": "bot",
    "message": "The main topic is analysis of...",
    "timestamp": "2024-04-14T10:30:05.000Z"
  },
  {
    "id": "msg_003",
    "sender": "user",
    "message": "Can you summarize it?",
    "timestamp": "2024-04-14T10:31:00.000Z"
  },
  {
    "id": "msg_004",
    "sender": "bot",
    "message": "Sure! Here's a summary: ...",
    "timestamp": "2024-04-14T10:31:05.000Z"
  }
]
```

#### Empty Response (200 OK):
```json
[]
```

#### Error Response (404):
```json
{
  "error": true,
  "message": "File not found"
}
```

---

## Health Check Endpoint

### Check Server Health

**Endpoint**: `GET /api/health`

**Content-Type**: `application/json`

#### Using curl:
```bash
curl -X GET http://localhost:3000/api/health
```

#### Expected Response (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-04-14T10:30:00.000Z"
}
```

With OpenAI configured:
```json
{
  "status": "healthy",
  "timestamp": "2024-04-14T10:30:00.000Z",
  "hasOpenAIKey": true
}
```

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid input/missing fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Error | Server error |
| 503 | Unavailable | Service down |

---

## Error Response Format

All errors follow this format:

```json
{
  "error": true,
  "message": "Human-readable error message",
  "details": "Additional error details (if available)"
}
```

---

## Testing Workflow

### Complete Testing Flow

1. **Start Backend**
   ```bash
   node SAMPLE_BACKEND.js
   ```

2. **Upload a File**
   - Use Test 1: Upload File
   - Save the returned `fileId`

3. **Verify Upload**
   - Use Test 2: Get All Files
   - Confirm your file is in the list

4. **Get File Details**
   - Use Test 3: Get Specific File
   - Use the `fileId` from step 2

5. **Send Chat Message**
   - Use Test 1: Send Chat Message
   - Use the `fileId` from step 2

6. **View Chat History**
   - Use Test 2: Get Chat History
   - See all messages for that file

7. **Test Delete**
   - Use Delete File
   - Use the `fileId` from step 2
   - Verify deletion with Get All Files

8. **Verify Health**
   - Use Health Check
   - Confirm server is running

---

## Using Postman Collections

### Import These Steps as a Collection

1. Create new Postman Collection
2. Add requests following the examples above
3. Use variables for `fileId`:
   - Set in one request
   - Use: `{{fileId}}` in others

### Variable Example

After uploading a file, extract `id`:
```
Tests tab of upload request:
var jsonData = pm.response.json();
pm.environment.set("fileId", jsonData.id);
```

Then use in other requests:
```
GET http://localhost:3000/api/files/{{fileId}}
```

---

## cURL Testing Script

Save as `test-api.sh`:

```bash
#!/bin/bash

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
TEST_FILE="test.txt"

# Create test file
echo "This is a test file for upload" > $TEST_FILE

echo "=== Testing API Endpoints ==="

# Test 1: Health Check
echo -e "\n${GREEN}Test 1: Health Check${NC}"
curl -s -X GET $API_URL/api/health | jq .

# Test 2: Upload File
echo -e "\n${GREEN}Test 2: Upload File${NC}"
UPLOAD_RESPONSE=$(curl -s -X POST \
  -F "file=@$TEST_FILE" \
  $API_URL/api/files/upload)
echo $UPLOAD_RESPONSE | jq .

# Extract FILE_ID
FILE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.id')
echo "File ID: $FILE_ID"

# Test 3: Get All Files
echo -e "\n${GREEN}Test 3: Get All Files${NC}"
curl -s -X GET $API_URL/api/files | jq .

# Test 4: Get Specific File
echo -e "\n${GREEN}Test 4: Get Specific File${NC}"
curl -s -X GET $API_URL/api/files/$FILE_ID | jq .

# Test 5: Send Chat Message
echo -e "\n${GREEN}Test 5: Send Chat Message${NC}"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileId":"'$FILE_ID'","message":"What is in this file?"}' \
  $API_URL/api/chat | jq .

# Test 6: Get Chat History
echo -e "\n${GREEN}Test 6: Get Chat History${NC}"
curl -s -X GET $API_URL/api/chat/history/$FILE_ID | jq .

# Test 7: Delete File
echo -e "\n${GREEN}Test 7: Delete File${NC}"
curl -s -X DELETE $API_URL/api/files/$FILE_ID | jq .

# Cleanup
rm $TEST_FILE

echo -e "\n${GREEN}All tests completed!${NC}"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Performance Testing

### Test Upload Speed
```bash
time curl -F "file=@large-file.zip" http://localhost:3000/api/files/upload
```

### Test Chat Response Time
```bash
time curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileId":"test-id","message":"Test"}' \
  http://localhost:3000/api/chat
```

### Concurrent Requests
```bash
# Upload 5 files concurrently
for i in {1..5}; do
  (curl -F "file=@file$i.txt" http://localhost:3000/api/files/upload) &
done
wait
```

---

## Troubleshooting API Issues

### Issue: CORS Error
**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Verify backend CORS configuration includes frontend URL

### Issue: 404 Not Found
**Problem**: Endpoint returns 404

**Solution**: 
- Check endpoint URL spelling
- Verify backend is running
- Check path parameters are correct

### Issue: 400 Bad Request
**Problem**: Invalid request

**Solution**:
- Check Content-Type header
- Verify JSON is valid
- Check required fields are present

### Issue: 500 Internal Server Error
**Problem**: Backend crashed or error

**Solution**:
- Check backend console for error message
- Verify database connection
- Restart backend server

---

## Data Validation

### File Upload Validation
- Maximum size: 50 MB (configurable)
- Allowed types: Any
- Required: File field

### Chat Message Validation
- Maximum length: No limit (set on backend)
- Required: fileId and message
- fileId must exist

---

## Response Time Benchmarks

Expected response times (on local machine):
- File upload: 100-500ms
- Get all files: 50-200ms
- Get specific file: 50-100ms
- Chat message: 1-3 seconds (with AI)
- Get chat history: 100-300ms
- Delete file: 50-150ms

---

## API Rate Limiting (Recommended)

Implement rate limiting on backend:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Validate input on backend**
3. **Implement authentication**
4. **Add rate limiting**
5. **Sanitize file uploads**
6. **Set proper CORS headers**
7. **Log all API access**
8. **Monitor for abuse**

---

## Additional Resources

- [REST API Best Practices](https://restfulapi.net/)
- [Postman Documentation](https://www.postman.com/downloads/)
- [cURL Documentation](https://curl.se/docs/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

**Ready to test? Start with the Health Check endpoint!** ✅
