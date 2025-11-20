#!/usr/bin/env pwsh
# Script to revert theme changes

Write-Host "🔄 Reverting to original theme..." -ForegroundColor Yellow

# Checkout the backup branch
git checkout backup/before-theme-redesign

Write-Host "✅ Theme reverted successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Original UI restored. To go back to new theme:" -ForegroundColor Cyan
Write-Host "  git checkout main" -ForegroundColor White
