# Manual Node.js Installation Guide

Since automated downloads aren't working in your environment, follow these manual steps:

## Option 1: Download from Browser (Easiest)

1. **Open your web browser and go to**: https://nodejs.org/

2. **Download the LTS version for Windows (64-bit)**
   - Look for "LTS" (Long Term Support) version
   - Select: "Windows Installer (.msi)" or ".zip" (64-bit)
   - Current: v20.11.1 or later

3. **Install the .msi file**
   - Run the installer
   - Click "Next" through all screens
   - Accept defaults
   - Click "Install"
   - Wait for completion

4. **Close all PowerShell windows**

5. **Open a NEW PowerShell window and verify**:
   ```powershell
   node --version
   npm --version
   ```

   Should output something like:
   ```
   v20.11.1
   10.2.4
   ```

---

## Option 2: Using .zip Download (If .msi doesn't work)

1. **Download**: https://nodejs.org/dist/v20.11.1/node-v20.11.1-win-x64.zip

2. **Extract the zip file**:
   - Right-click the zip file
   - Select "Extract All..."
   - Extract to: `C:\nodejs`

3. **Add to PATH**:
   - Press `Win + X`, select "System Settings"
   - Search for "environment variables"
   - Click "Edit the system environment variables"
   - Click "Environment Variables..." button
   - Under "System variables", find and click "Path"
   - Click "Edit..."
   - Click "New" and type: `C:\nodejs`
   - Click "OK" on all dialogs

4. **Close all PowerShell windows and reopen**

5. **Verify**:
   ```powershell
   node --version
   npm --version
   ```

---

## Option 3: Portable Setup (No Installation)

1. **Download the .zip file** (same link as Option 2)

2. **Extract to** `C:\AIWorkspace\UIProject\file-upload-app\node-portable`

3. **Run npm using full path**:
   ```powershell
   cd C:\AIWorkspace\UIProject\file-upload-app
   .\node-portable\npm install
   .\node-portable\npm start
   ```

---

## Next Steps Once Node.js is Working

Verify installation:
```powershell
node --version
npm --version
```

Then run:
```powershell
cd C:\AIWorkspace\UIProject\file-upload-app
npm install
npm start
```

---

## Troubleshooting

**Q: Commands still not found after restart?**
A: Try restarting your computer, not just closing/opening PowerShell

**Q: "npm: command still not recognized"?**
A: The PATH variable wasn't updated. Use Option 3 (Portable) instead

**Q: Which version should I download?**
A: Look for the LTS (Long Term Support) version, v20 or higher

---

## Need Help?

Once you've downloaded Node.js manually, let me know and I can help you:
1. Verify the installation
2. Install project dependencies
3. Start the application

The download link is: **https://nodejs.org/**
