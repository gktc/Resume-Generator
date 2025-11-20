# Fix PowerShell Execution Policy for npm

If you're getting the error "npm.ps1 cannot be loaded because running scripts is disabled", follow these steps:

## Quick Fix (Recommended)

Run PowerShell **as Administrator** and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

This allows scripts to run for your current user account.

## Alternative Solutions

### Option 1: Use Command Prompt Instead

Instead of PowerShell, use Command Prompt (cmd.exe):
- Press `Win + R`, type `cmd`, press Enter
- Navigate to your project: `cd C:\Users\user\Learning\Portfolio`
- Run: `npm install` and `npm run dev`

### Option 2: Bypass for Current Session Only

If you don't want to change the policy permanently:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

This only works for the current PowerShell session.

### Option 3: Use npx directly

You can also try using the full path or calling node directly:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## Verify the Fix

After setting the policy, verify it worked:

```powershell
npm --version
```

If this works without errors, you're all set!

## Why This Happens

Windows PowerShell has execution policies to prevent malicious scripts from running. npm uses PowerShell scripts, so it needs permission to execute them. The `RemoteSigned` policy allows local scripts (like npm) to run while requiring remote scripts to be signed.

