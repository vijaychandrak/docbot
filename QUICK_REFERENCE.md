# Quick Reference Guide

## Essential Commands

### Installation & Setup
```bash
# Navigate to project
cd file-upload-app

# Install all dependencies
npm install

# Verify installation
npm audit
```

### Development
```bash
# Start development server (recommended)
npm start

# Alternative start command
ng serve

# Use different port if 4200 is busy
ng serve --port 4300

# Open in specific browser
ng serve --open
```

### Production
```bash
# Create production build
npm run build

# Build with configuration
ng build --configuration production

# Serve production build locally
ng serve --prod
```

### Testing
```bash
# Run unit tests
ng test

# Run end-to-end tests (if configured)
ng e2e

# Lint code for errors
ng lint
```

## Project Structure Quick Reference

```
src/app/
├── components/
│   ├── file-upload/      ← Main upload & list component
│   └── chat/             ← Chat interface component
├── services/
│   ├── file.service.ts   ← Handle file API calls
│   └── chat.service.ts   ← Handle chat API calls
├── models/
│   ├── file.model.ts     ← File data structure
│   └── chat.model.ts     ← Chat data structure
├── app.component.ts      ← Root component
├── app.routes.ts         ← URL routing
└── app.config.ts         ← App initialization
```

## Key Files to Know

| File | Purpose | Edit When |
|------|---------|-----------|
| `src/app/services/file.service.ts` | File API operations | Changing API URL |
| `src/app/services/chat.service.ts` | Chat API operations | Changing API URL |
| `src/app/app.routes.ts` | URL routing | Adding new pages |
| `src/app/components/file-upload/` | Upload UI | Modifying upload interface |
| `src/app/components/chat/` | Chat UI | Modifying chat interface |
| `src/styles.css` | Global styles | Changing global colors/fonts |
| `angular.json` | Build config | Changing build settings |
| `package.json` | Dependencies | Adding new packages |

## API Endpoints Checklist

Required backend endpoints:

```
File Upload:
[ ] POST   /api/files/upload
[ ] GET    /api/files
[ ] GET    /api/files/{fileId}
[ ] DELETE /api/files/{fileId}

Chat:
[ ] POST   /api/chat
[ ] GET    /api/chat/history/{fileId}

Optional:
[ ] GET    /api/health (health check)
```

## Common Tasks

### Change API URL
**File**: `src/app/services/file.service.ts`
```typescript
private apiUrl = 'http://localhost:3000/api/files'; // ← Change here
```

**File**: `src/app/services/chat.service.ts`
```typescript
private apiUrl = 'http://localhost:3000/api/chat'; // ← Change here
```

### Add a New Component
```bash
ng generate component components/my-component

# Or manually create:
# src/app/components/my-component/
#   ├── my-component.component.ts
#   ├── my-component.component.html
#   └── my-component.component.css
```

### Add a New Service
```bash
ng generate service services/my-service

# Or manually create:
# src/app/services/my-service.service.ts
```

### Add New Route
**File**: `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', component: FileUploadComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'my-page', component: MyPageComponent }, // ← Add here
];
```

### Add Package
```bash
npm install package-name --save
npm install package-name-dev --save-dev
```

## Styling Quick Reference

### Global Styles File
`src/styles.css` - Affects entire app

### Component Styles
- `file-upload.component.css` - Upload page styling
- `chat.component.css` - Chat page styling
- `app.component.css` - Root component styling

### CSS Classes to Know

```css
/* Upload page */
.file-upload-container
.drop-zone
.files-table
.btn-upload
.btn-chat
.btn-delete

/* Chat page */
.chat-container
.chat-messages
.message
.message-user
.message-bot
.chat-input-area
```

## Debugging Tips

### Browser Console (F12)
```javascript
// Check for errors
// Look at Network tab for API calls
// Use Application tab for storage
```

### Common Error Messages
| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module" | Missing dependency | Run `npm install` |
| "Port 4200 in use" | Another app using port | Use different port |
| "API connect failed" | Backend not running | Start backend server |
| "CORS error" | Backend CORS not configured | Enable CORS on backend |

### Debug in VS Code
1. Press F5 to start debugging
2. Set breakpoints by clicking line numbers
3. Step through code with F10 (over) or F11 (into)
4. View variables in Debug panel

## Package.json Quick Reference

```json
{
  "scripts": {
    "start": "ng serve",           // Dev server
    "build": "ng build",           // Build app
    "dev": "ng serve --open"       // Start with browser
  },
  "dependencies": {
    "@angular/core": "version",    // Core Angular
    "@angular/common": "version",  // Common utilities
    "@angular/forms": "version",   // Form handling
    "@angular/platform-browser": "version"  // Browser support
  }
}
```

## TypeScript Quick Tips

```typescript
// Type annotation
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;

// Array types
const items: string[] = [];
const list: Array<number> = [1, 2, 3];

// Interface
interface User {
  id: string;
  name: string;
}

// Function return type
function greet(name: string): string {
  return "Hello, " + name;
}

// Observable type
const data$: Observable<UploadedFile[]> = this.fileService.getUploadedFiles();
```

## RxJS Observable Quick Reference

```typescript
// Subscribe to observable
observable.subscribe({
  next: (data) => { /* Handle data */ },
  error: (error) => { /* Handle error */ },
  complete: () => { /* Handle complete */ }
});

// Pipe operators
observable.pipe(
  map(x => x * 2),           // Transform data
  filter(x => x > 5),        // Filter data
  takeUntil(this.destroy$),  // Auto unsubscribe
  catchError(error => of([]))  // Handle errors
);

// Common operators
- map()         - Transform values
- filter()      - Filter values
- takeUntil()   - Stop when another observable emits
- catchError()  - Handle errors
- tap()         - Side effects
```

## Useful Browser Extensions

For Chrome/Brave:
- Angular DevTools
- Redux DevTools
- Postman
- JSON Formatter

## File Size Reference

```
Typical Application Sizes:
- Uncompressed source: 2-3 MB
- After build: 500-700 KB  
- Minified: 200-300 KB
- Gzipped: 50-100 KB
```

## Performance Tips

1. **Lazy load routes** - Load pages on demand
2. **OnPush detection** - Optimize change detection
3. **Unsubscribe properly** - Prevent memory leaks
4. **Minify CSS/JS** - Reduce file size
5. **Use CDN** - Serve static files faster

## Security Checklist

- [ ] Update packages regularly (`npm update`)
- [ ] Check security issues (`npm audit`)
- [ ] Never commit `.env` with secrets
- [ ] Sanitize user input on backend
- [ ] Use HTTPS in production
- [ ] Enable CORS properly
- [ ] Validate all API requests
- [ ] Use secure headers

## Environment Setup Troubleshooting

```bash
# Clear Node cache
npm cache clean --force

# Reinstall node_modules
rm -r node_modules package-lock.json
npm install

# Update npm
npm install -g npm@latest

# Update Angular CLI
npm install -g @angular/cli@latest
```

## Git Commands (if using version control)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo
git pull origin main
git push -u origin main
```

## Rate Limiting Guidelines (for API design)

```
- Per user: 100 requests/minute
- Per IP: 1000 requests/minute
- File upload: 10 MB max
- Chat messages: 50/minute
```

## Documentation Files Reference

| Document | When to Read | Duration |
|----------|------------|----------|
| GETTING_STARTED.md | First time setup | 15 min |
| README.md | Project overview | 10 min |
| BACKEND_API_GUIDE.md | Implementing backend | 30 min |
| DEVELOPMENT.md | During development | As needed |
| ARCHITECTURE.md | Understanding design | 20 min |
| PROJECT_SUMMARY.md | Project overview | 10 min |

## Support Workflow

1. Check browser console (F12)
2. Check terminal output
3. Review relevant documentation
4. Check GETTING_STARTED.md troubleshooting
5. Review error handling in services
6. Check backend logs
7. Verify API endpoints with Postman

## Useful Links

- [Angular Docs](https://angular.io/docs) - Official Angular documentation
- [TypeScript Docs](https://www.typescriptlang.org/docs/) - TypeScript reference
- [RxJS Docs](https://rxjs.dev/) - Reactive programming guide
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [HTTP Status Codes](https://httpwg.org/) - HTTP reference

---

**Print this guide or keep it bookmarked for quick reference!**
