# Development Guide

## Setting Up the Angular Application

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI 17+
- A backend API server running on http://localhost:3000

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open in browser**
   Navigate to `http://localhost:4200`

The app will automatically reload when you edit source files.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── file-upload/          # File upload & listing
│   │   │   ├── file-upload.component.ts
│   │   │   ├── file-upload.component.html
│   │   │   └── file-upload.component.css
│   │   └── chat/                 # Chat interface
│   │       ├── chat.component.ts
│   │       ├── chat.component.html
│   │       └── chat.component.css
│   ├── services/
│   │   ├── file.service.ts       # File API service
│   │   └── chat.service.ts       # Chat API service
│   ├── models/
│   │   ├── file.model.ts         # File interfaces
│   │   └── chat.model.ts         # Chat interfaces
│   ├── app.component.ts          # Root component
│   ├── app.routes.ts             # Routes configuration
│   └── app.config.ts             # App configuration
├── environments/
│   ├── environment.ts            # Dev config
│   └── environment.prod.ts       # Prod config
├── main.ts                       # Bootstrap file
├── index.html                    # HTML template
└── styles.css                    # Global styles
```

## Environment Configuration

### Development
- API URL: `http://localhost:3000/api`
- App URL: `http://localhost:4200`
- File in: `src/environments/environment.ts`

### Production
- Update API URL in `src/environments/environment.prod.ts`
- File in: `src/environments/environment.prod.ts`

## Services

### FileService
Located: `src/app/services/file.service.ts`

Methods:
- `uploadFile(file: File)` - Upload a file
- `getUploadedFiles()` - Get all files
- `getFileById(fileId: string)` - Get specific file
- `deleteFile(fileId: string)` - Delete file

### ChatService
Located: `src/app/services/chat.service.ts`

Methods:
- `sendMessage(request: ChatRequest)` - Send chat message
- `getChatHistory(fileId: string)` - Get chat history

## Components

### FileUploadComponent
- **Location**: `src/app/components/file-upload/`
- **Purpose**: Handle file upload and display uploaded files
- **Features**:
  - Drag-and-drop file upload
  - File validation
  - Error handling
  - Files table with actions

### ChatComponent
- **Location**: `src/app/components/chat/`
- **Purpose**: Provide chat interface for AI interaction
- **Features**:
  - Real-time messaging
  - Chat history
  - Typing indicator
  - Auto-scroll to latest message

## Styling

### Global Styles
- `src/styles.css` - Global CSS
- `src/app/app.component.css` - App-level styles

### Component Styles
Each component has its own CSS file:
- `file-upload.component.css`
- `chat.component.css`

### CSS Variables (in app.component.css)
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success-color: #4caf50;
--danger-color: #dc3545;
```

## Common Tasks

### Adding a New Component
```bash
ng generate component components/my-component
```

### Adding a New Service
```bash
ng generate service services/my-service
```

### Running Tests
```bash
ng test
```

### Building for Production
```bash
ng build --configuration production
```

Output will be in `dist/file-upload-app/`

## Debugging

### Browser DevTools
- Open Chrome DevTools (F12)
- Check Console tab for errors
- Inspect Network tab for API calls

### Angular DevTools Extension
- Install from Chrome Web Store
- Inspect component tree
- Check change detection

### VS Code Debugging
Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMaps": true
    }
  ]
}
```

## Common Issues

### Issue: Module not found
**Solution**: Run `npm install` to ensure dependencies are installed

### Issue: API endpoints not working
**Solution**: 
- Check backend server is running
- Verify API URLs in services
- Check browser console for CORS errors

### Issue: Styles not loading
**Solution**:
- Verify CSS files are imported
- Check for CSS syntax errors
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Angular CLI not found
**Solution**: 
```bash
npm install -g @angular/cli@17
```

## Performance Tips

1. **Lazy Loading**: Routes can be lazy-loaded
2. **Change Detection**: Use OnPush strategy for performance
3. **Unsubscribe**: Use takeUntil to prevent memory leaks
4. **Tree Shaking**: Standalone components reduce bundle size

## File Upload Handling

The file upload component:
1. Accepts files via input or drag-drop
2. Validates file selection
3. Sends to backend via FormData
4. Updates file list on success
5. Shows error on failure

**Supported File Types**: All file types
**Max File Size**: Depends on backend configuration

## Chat Features

The chat component:
1. Loads chat history on initialization
2. Sends messages to backend
3. Displays bot responses
4. Shows loading state while waiting
5. Auto-scrolls to latest message

**Message Format**:
```typescript
{
  sender: 'user' | 'bot',
  message: string,
  timestamp: Date
}
```

## Build & Deployment

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

### Serve Locally
```bash
ng serve
```

### Deploy to Server
1. Build production version
2. Copy `dist/file-upload-app/` to your web server
3. Configure web server to serve `index.html` for all routes

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist/file-upload-app /usr/share/nginx/html
```

## Environment Variables

Create `.env` file:
```
UPLOAD_API_URL=http://localhost:3000/api/files/upload
CHAT_API_URL=http://localhost:3000/api/chat
```

## Resources

- [Angular Docs](https://angular.io/docs)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [RxJS Docs](https://rxjs.dev/)
- [Angular Router](https://angular.io/guide/router)

## Contributing

1. Follow Angular style guide
2. Use TypeScript strict mode
3. Add appropriate error handling
4. Test components thoroughly
5. Document complex logic

---

For backend setup, refer to `BACKEND_API_GUIDE.md`
