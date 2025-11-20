# Design Document

## Overview

This design enables the Express backend to serve static files (specifically template preview images) by configuring the Express static middleware. The solution is minimal and leverages Express's built-in capabilities to serve files from the `public` directory without requiring additional endpoints or custom file-serving logic.

## Architecture

### Current State
- Template preview images exist in `packages/backend/public/templates/`
- Express server is configured with routes, middleware, and security headers
- Frontend expects to load images from backend URLs
- No static file serving is configured

### Proposed Changes
- Add `express.static()` middleware to serve files from the `public` directory
- Configure middleware placement to work with existing security headers
- Update helmet CSP configuration if needed to allow image serving
- Maintain existing template controller endpoint for backward compatibility

## Components and Interfaces

### 1. Express Static Middleware Configuration

**Location:** `packages/backend/src/index.ts`

**Configuration:**
```typescript
import path from 'path';

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d', // Cache for 1 day
  etag: true,
  lastModified: true,
}));
```

**Placement:** After body parsers, before API routes

**Options:**
- `maxAge`: Set cache duration for browser caching
- `etag`: Enable ETag headers for cache validation
- `lastModified`: Include Last-Modified headers
- `index`: Disabled (we don't want directory listings)

### 2. Security Configuration Updates

**Helmet CSP Configuration:**
The existing helmet configuration already allows images:
```typescript
imgSrc: ["'self'", 'data:', 'https:']
```

This is sufficient for serving local images.

### 3. URL Structure

**Static File Access:**
- Direct access: `http://localhost:3000/templates/modern-preview.png`
- From frontend: `/templates/modern-preview.png` (proxied through Vite)

**Existing API Endpoint (maintained for compatibility):**
- `GET /api/templates/:id/preview` - Still works, redirects or serves file

### 4. Frontend Integration

**No changes required** - Frontend already expects images at:
```typescript
<img src={`/templates/${template.previewImageUrl}`} />
```

Or via API:
```typescript
<img src={`/api/templates/${template.id}/preview`} />
```

## Data Models

No database changes required. Existing Template model already stores `previewImageUrl` field.

## Error Handling

### File Not Found (404)
- Express static middleware automatically returns 404 for missing files
- No custom error handling needed

### Security Errors
- Path traversal attempts are blocked by Express static middleware
- Helmet headers remain active for all responses

### Logging
- Request logger middleware will log static file requests
- No additional logging configuration needed

## Testing Strategy

### Manual Testing
1. Start backend server
2. Access `http://localhost:3000/templates/modern-preview.png` directly
3. Verify image loads in browser
4. Check response headers (Cache-Control, ETag, Content-Type)
5. Test frontend template selector component
6. Verify images load in UI

### Verification Steps
1. Check that images load without CORS errors
2. Verify cache headers are present
3. Test 404 response for non-existent files
4. Confirm security headers are still applied
5. Test path traversal protection (e.g., `../../../etc/passwd`)

### Edge Cases
- Missing image files → 404 response
- Invalid file paths → 404 response
- Directory traversal attempts → Blocked by middleware
- Large image files → Served with appropriate streaming

## Implementation Notes

### Minimal Changes Required
Only one file needs modification: `packages/backend/src/index.ts`

### Backward Compatibility
The existing `/api/templates/:id/preview` endpoint can remain for API-based access, or be removed if not needed.

### Performance Considerations
- Static middleware is highly optimized
- Browser caching reduces server load
- ETag support enables efficient cache validation
- No database queries for static files

### Security Considerations
- Express static middleware has built-in path traversal protection
- Helmet headers apply to all responses including static files
- Only files in `public` directory are accessible
- No directory listing enabled

## Alternative Approaches Considered

### 1. CDN/Cloud Storage
**Pros:** Better performance, offloads server
**Cons:** Additional cost, complexity, external dependency
**Decision:** Not needed for MVP, can migrate later

### 2. Custom File Serving Endpoint
**Pros:** More control over headers and logic
**Cons:** Reinventing the wheel, more code to maintain
**Decision:** Express static middleware is sufficient

### 3. Nginx/Reverse Proxy
**Pros:** Better performance for production
**Cons:** Additional infrastructure, not needed for development
**Decision:** Can add in production deployment

## Deployment Considerations

### Development
- Static files served directly by Express
- Hot reload works with nodemon

### Production
- Consider using Nginx to serve static files
- Or use CDN for better performance
- Current solution works but may not be optimal at scale

## Success Criteria

1. Template preview images load in frontend without errors
2. Images are cached appropriately (verified in Network tab)
3. Security headers remain intact
4. No CORS errors
5. 404 responses for missing files work correctly
