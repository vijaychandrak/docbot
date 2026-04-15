# Getting Started Guide

This guide will help you get the Angular file upload and chat application up and running.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Backend Setup](#backend-setup)
6. [Testing the Application](#testing-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** v9 or higher (comes with Node.js)
- **Git** (optional, for version control)

### Verify Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

## Installation

### Step 1: Navigate to Project Directory
```bash
cd c:\AIWorkspace\UIProject\file-upload-app
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Angular 17
- TypeScript
- RxJS
- And other dependencies

**Expected time**: 2-5 minutes (depending on internet speed)

### Step 3: Verify Installation
```bash
npm audit
```

If there are any vulnerabilities, run:
```bash
npm audit fix
```

## Configuration

### Step 1: Create Environment File
```bash
cp .env.example .env
```

### Step 2: Update API Endpoints (if needed)
Edit `.env`:
```
UPLOAD_API_URL=http://localhost:3000/api/files/upload
CHAT_API_URL=http://localhost:3000/api/chat
```

### Step 3: Update Service Configuration
The services are configured to use `http://localhost:3000/api` by default.

If your backend is running on a different URL, update:
- `src/app/services/file.service.ts` - Line 11
- `src/app/services/chat.service.ts` - Line 10

## Running the Application

### Option 1: Development Mode (Recommended for First Time)
```bash
npm start
```

This will:
- Compile the Angular application
- Start a development server
- Automatically open the app in your browser
- Enable hot reload (changes are reflected immediately)

**Access the app**: `http://localhost:4200`

### Option 2: Using Angular CLI Directly
```bash
ng serve
```

Then navigate to `http://localhost:4200` in your browser.

### Option 3: Build and Serve Production
```bash
npm run build
ng serve --prod
```

## Backend Setup

The Angular application requires a backend API server. You have several options:

### Option A: Use Sample Node.js Backend (Quickest)

1. **Create a new directory**
   ```bash
   mkdir backend
   cd backend
   ```

2. **Initialize npm project**
   ```bash
   npm init -y
   ```

3. **Install dependencies**
   ```bash
   npm install express cors multer uuid dotenv axios
   ```

4. **Copy sample backend code**
   - Find `SAMPLE_BACKEND.js` in the project root
   - Copy it to your backend directory as `server.js`

5. **Create .env file**
   ```bash
   echo "PORT=3000" > .env
   ```

6. **Start the backend server**
   ```bash
   node server.js
   ```

   You should see:
   ```
   Server is running on http://localhost:3000
   ```

### Option B: Use Your Own Backend

If you have an existing backend, ensure it:
1. Implements all required endpoints (see `BACKEND_API_GUIDE.md`)
2. Has CORS enabled for `http://localhost:4200`
3. Is running on the configured API URL

### Option C: Use Mock Backend

For development without a real backend:
1. Update services to use mock data
2. Create mock implementations of API calls
3. See [Backend Setup Guide](BACKEND_API_GUIDE.md) for details

## Testing the Application

### Test 1: File Upload
1. Open `http://localhost:4200` in browser
2. Click "Choose File" or drag-and-drop a file
3. Click "Upload"
4. Verify file appears in the table below

### Test 2: File Listing
1. After uploading files, verify they appear in table with:
   - Correct file name
   - Correct file extension
   - Upload date and time
   - File size

### Test 3: Delete File
1. Click "Delete" button on any file
2. Confirm deletion in the dialog
3. Verify file is removed from table

### Test 4: Chat Feature
1. Click "Chat" button on any file
2. Type a message about the file
3. Press Enter or click "Send"
4. Verify bot responds

### Test 5: Chat History
1. Refresh the page
2. Click "Chat" on the same file
3. Verify previous chat messages are still visible

## Troubleshooting

### Issue 1: npm command not found
**Problem**: npm is not installed or not in PATH

**Solution**:
```bash
# Install Node.js from https://nodejs.org/
# Then restart terminal/PowerShell
node --version
npm --version
```

### Issue 2: Angular CLI not found
**Problem**: `ng: The term 'ng' is not recognized`

**Solution**:
```bash
# Install Angular CLI globally
npm install -g @angular/cli@17

# Verify installation
ng version
```

### Issue 3: Cannot connect to backend API
**Problem**: Files fail to upload, error mentions "failed to fetch"

**Solution**:
- Verify backend is running: `http://localhost:3000/api/health`
- Check backend console for errors
- Verify CORS is enabled on backend
- Check browser console (F12) for detailed error messages

### Issue 4: Module not found errors
**Problem**: Error like "Cannot find module '@angular/core'"

**Solution**:
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install

# Or on Windows:
rmdir /s /q node_modules
npm install
```

### Issue 5: Port 4200 already in use
**Problem**: `Port 4200 is already in use`

**Solution**:
```bash
# Use different port
ng serve --port 4300
```

### Issue 6: Port 3000 already in use (Backend)
**Problem**: Backend won't start, port 3000 in use

**Solution**:
```bash
# Use different port
PORT=3001 node server.js

# Then update frontend to use http://localhost:3001/api
```

### Issue 7: Blank page or errors in browser console
**Problem**: App loads but shows blank page or console errors

**Solution**:
1. Press F12 to open DevTools
2. Check Console and Network tabs for errors
3. Verify backend is running
4. Clear browser cache (Ctrl+Shift+Delete)
5. Restart development server: `npm start`

### Issue 8: TypeScript errors
**Problem**: TS compilation errors

**Solution**:
```bash
# Check for type errors
npx tsc --noEmit

# Fix common issues
npm install --save-dev @types/node

# Restart dev server
npm start
```

## Development Workflow

### 1. Make Changes to Source Code
```bash
# Edit files in src/app/
# Changes auto-reload in browser
```

### 2. Check for Errors
- **Browser Console** (F12): Runtime errors
- **Terminal**: Compilation errors
- **Problems Panel**: In VS Code

### 3. Debug Issues
```bash
# Use Chrome DevTools (F12)
# Set breakpoints in Source tab
# Use Angular DevTools extension
```

### 4. Build for Production
```bash
ng build --configuration production
# Output: dist/file-upload-app/
```

## File Structure After Installation

```
file-upload-app/
├── src/
│   ├── app/
│   ├── environments/
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── dist/                    # (Created after build)
├── node_modules/            # (Created after npm install)
├── angular.json
├── package.json
├── tsconfig.json
├── README.md
├── BACKEND_API_GUIDE.md
├── DEVELOPMENT.md
├── GETTING_STARTED.md
└── SAMPLE_BACKEND.js
```

## Next Steps

1. **Explore the Application**
   - Try uploading different file types
   - Test the chat feature
   - Check table sorting and filtering

2. **Customize the Application**
   - Modify colors in `src/app/app.component.css`
   - Add new features to services
   - Create new components as needed

3. **Set Up Backend**
   - Implement full API with database
   - Add authentication
   - Integrate with AI service (OpenAI, etc.)

4. **Deploy Application**
   - Build production version
   - Configure production API URLs
   - Deploy to hosting platform

## Resources

- [Angular Official Documentation](https://angular.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

## Getting Help

If you encounter issues:

1. **Check the console for errors** (F12 in browser)
2. **Review the troubleshooting section** above
3. **Check backend logs** if API errors occur
4. **Consult Angular documentation** for framework-specific issues
5. **Check network requests** in browser DevTools

## Quick Reference

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
ng test

# Check TypeScript errors
npx tsc --noEmit

# Install a new package
npm install package-name --save

# Update all packages
npm update
```

---

**You're all set!** The application is now ready to use. Start with `npm start` and enjoy!
