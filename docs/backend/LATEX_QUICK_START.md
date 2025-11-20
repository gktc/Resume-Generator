# LaTeX Compiler Quick Start

## Prerequisites

1. **Docker Desktop** must be installed and running
2. **LaTeX container** must be started

## Starting the LaTeX Container

```bash
# Start all services (including LaTeX)
docker-compose up -d

# Or start only LaTeX container
docker-compose up -d latex

# Verify container is running
docker ps | grep ats-latex
```

## Testing the Setup

```bash
cd packages/backend
node test-latex-compiler.js
```

Expected output:
```
🧪 LaTeX Compiler Service Test

1️⃣  Checking Docker availability...
   ✅ Docker is installed and running

2️⃣  Checking LaTeX container status...
   ✅ Container 'ats-latex' is running

3️⃣  Checking pdflatex in container...
   ✅ pdfTeX 3.141592653-2.6-1.40.25 (TeX Live 2023)

4️⃣  Testing LaTeX compilation...
   📝 Created test LaTeX file
   📤 Copied file to container
   ⚙️  Compiling LaTeX (pass 1)...
   ⚙️  Compiling LaTeX (pass 2)...
   📥 Copied PDF from container
   ✅ PDF generated successfully (XXXXX bytes)
   📄 Output: /path/to/latex-test-temp/test.pdf
   🧹 Cleaned up container work directory
   🧹 Cleaned up local temp directory

5️⃣  Testing LaTeX sanitization...
   ✅ Sanitization is implemented in LaTeXCompilerService

6️⃣  Testing special character escaping...
   ✅ Character escaping is implemented in LaTeXCompilerService

✨ All tests passed! LaTeX Compiler Service is working correctly.
```

## Using in Code

```typescript
import { LaTeXCompilerService } from './services/latex-compiler.service';

const compiler = new LaTeXCompilerService();

// Compile a resume
const result = await compiler.compileResume(
  latexTemplate,      // LaTeX template string
  optimizedContent,   // Resume content
  userId,            // User ID
  'Google',          // Company name
  'Software Engineer' // Position
);

console.log('Generated:', result.fileName);
console.log('Path:', result.filePath);
```

## Environment Variables

Add to your `.env` file:

```env
LATEX_TIMEOUT=30000
LATEX_CONTAINER_NAME=ats-latex
```

## Troubleshooting

### Container Not Running

```bash
# Check status
docker ps -a | grep ats-latex

# Start container
docker-compose up -d latex

# View logs
docker logs ats-latex
```

### Compilation Timeout

Increase timeout in `.env`:
```env
LATEX_TIMEOUT=60000  # 60 seconds
```

### Permission Errors

```bash
# Create directories with proper permissions
mkdir -p packages/backend/latex-temp
mkdir -p packages/backend/uploads/resumes
chmod 755 packages/backend/latex-temp
chmod 755 packages/backend/uploads/resumes
```

## Security Features

✅ **Isolated Execution** - Runs in Docker container  
✅ **Command Sanitization** - Removes dangerous LaTeX commands  
✅ **Character Escaping** - Escapes special characters  
✅ **Timeout Protection** - 30-second maximum  
✅ **Tmpfs Storage** - Memory-based, auto-cleanup  
✅ **No Privileges** - Container runs without escalation  

## Documentation

- **Comprehensive Guide**: `LATEX_COMPILER_GUIDE.md`
- **Implementation Details**: `TASK_8.6_IMPLEMENTATION.md`
- **Test Script**: `test-latex-compiler.js`

## Next Steps

1. ✅ LaTeX compiler is ready
2. ➡️ Implement resume generation API endpoints (Task 8.7)
3. ➡️ Test end-to-end resume generation workflow
4. ➡️ Monitor compilation times in production
