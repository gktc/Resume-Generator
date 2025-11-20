# LaTeX Compiler Service Guide

## Overview

The LaTeX Compiler Service handles the compilation of LaTeX templates into PDF resumes. It uses a Docker container with TeXLive to provide a secure, isolated compilation environment.

## Architecture

### Docker-Based Compilation

The service uses Docker to run LaTeX compilation in an isolated container:

- **Container**: `ats-latex` (texlive/texlive:latest)
- **Security**: Isolated execution prevents LaTeX injection attacks
- **Timeout**: 30 seconds maximum compilation time
- **Working Directory**: `/work` (tmpfs for performance and security)

### Compilation Flow

```
1. Create temporary directory on host
2. Render LaTeX template with user data
3. Sanitize LaTeX content (remove dangerous commands)
4. Copy .tex file to Docker container
5. Execute pdflatex in container (twice for references)
6. Copy generated PDF back to host
7. Clean up temporary files
```

## Security Features

### 1. LaTeX Content Sanitization

The service removes potentially dangerous LaTeX commands:

- `\input` - Prevents file inclusion
- `\include` - Prevents file inclusion
- `\write` - Prevents file writing
- `\immediate` - Prevents immediate execution
- `\openout`, `\closeout` - Prevents file operations
- `\read`, `\openin`, `\closein` - Prevents file reading
- `\csname`, `\expandafter` - Prevents command construction
- `\catcode` - Prevents category code manipulation

### 2. Special Character Escaping

All user input is escaped to prevent LaTeX injection:

- `\` → `\textbackslash{}`
- `&`, `%`, `$`, `#`, `_`, `{`, `}` → Escaped with backslash
- `~` → `\textasciitilde{}`
- `^` → `\textasciicircum{}`

### 3. Docker Isolation

- Container runs with `no-new-privileges` security option
- Uses tmpfs for `/work` directory (memory-based, auto-cleanup)
- No network access required
- Limited resource usage

### 4. Timeout Protection

- Maximum compilation time: 30 seconds
- Prevents infinite loops or resource exhaustion
- User-friendly timeout error messages

## Configuration

### Environment Variables

```env
# LaTeX compilation timeout in milliseconds (default: 30000)
LATEX_TIMEOUT=30000

# Docker image for LaTeX compilation
LATEX_DOCKER_IMAGE=texlive/texlive:latest

# Docker container name
LATEX_CONTAINER_NAME=ats-latex
```

### Docker Setup

Ensure the LaTeX container is running:

```bash
# Start all services including LaTeX
docker-compose up -d

# Check LaTeX container status
docker ps | grep ats-latex

# Test LaTeX compilation
docker exec ats-latex pdflatex --version
```

## Usage

### Basic Usage

```typescript
import { LaTeXCompilerService } from './services/latex-compiler.service';

const compiler = new LaTeXCompilerService();

// Compile resume
const result = await compiler.compileResume(
  latexTemplate,
  optimizedContent,
  userId,
  'Company Name',
  'Position Title'
);

console.log('PDF generated:', result.fileName);
console.log('File path:', result.filePath);
```

### Template Variables

The service supports the following template variables:

**Personal Information:**
- `{{name}}` - Full name
- `{{email}}` - Email address
- `{{phone}}` - Phone number
- `{{location}}` - Location
- `{{linkedin}}` - LinkedIn URL
- `{{github}}` - GitHub URL
- `{{website}}` - Personal website

**Content Sections:**
- `{{summary}}` - Professional summary
- `{{experience}}` - Work experience (auto-formatted)
- `{{education}}` - Education (auto-formatted)
- `{{skills}}` - Skills grouped by category
- `{{projects}}` - Projects (auto-formatted)

### Template Format

Experience entries are formatted as:

```latex
\experience{Position}{Company}{Start Date -- End Date}{
\begin{itemize}
\item Achievement 1
\item Achievement 2
\end{itemize}
}
```

Education entries are formatted as:

```latex
\education{Degree}{Institution}{Start Date -- End Date}{Field of Study (GPA: X.X)}
```

Projects are formatted as:

```latex
\project{Title}{Technologies}{
\begin{itemize}
\item Highlight 1
\item Highlight 2
\end{itemize}
}
```

## Error Handling

### User-Friendly Error Messages

The service translates technical LaTeX errors into user-friendly messages:

| LaTeX Error | User Message |
|-------------|--------------|
| Undefined control sequence | Invalid LaTeX command detected |
| Missing $ inserted | Mathematical expression formatting error |
| File not found | Required template file is missing |
| Emergency stop | Critical error in template |
| Timeout | Compilation timed out after 30 seconds |
| Container not found | LaTeX service is not available |

### Error Recovery

```typescript
try {
  const result = await compiler.compileResume(...);
} catch (error) {
  console.error('Compilation failed:', error.message);
  // Error message is already user-friendly
  // Can be displayed directly to users
}
```

## File Management

### Directory Structure

```
packages/backend/
├── latex-temp/           # Temporary compilation directory
│   └── resume_<timestamp>_<hash>/
│       ├── resume.tex
│       ├── resume.pdf
│       └── resume.log
└── uploads/
    └── resumes/          # Final PDF storage
        └── Company_Position_<timestamp>_<hash>.pdf
```

### Cleanup

- Temporary directories are automatically cleaned up after compilation
- Failed compilations also trigger cleanup
- Container `/work` directory uses tmpfs (auto-cleanup on restart)

## Performance

### Optimization Strategies

1. **Two-Pass Compilation**: Runs pdflatex twice for proper references
2. **Tmpfs Storage**: Container uses memory-based storage for speed
3. **Parallel Processing**: Multiple compilations can run concurrently
4. **Efficient Cleanup**: Async cleanup doesn't block response

### Expected Performance

- Simple resume: 2-5 seconds
- Complex resume: 5-10 seconds
- Maximum timeout: 30 seconds

## Troubleshooting

### Container Not Running

```bash
# Check container status
docker ps -a | grep ats-latex

# Start container
docker-compose up -d latex

# View container logs
docker logs ats-latex
```

### Compilation Failures

```bash
# Check LaTeX installation
docker exec ats-latex pdflatex --version

# Test manual compilation
docker exec ats-latex pdflatex --version

# Check container resources
docker stats ats-latex
```

### Permission Issues

```bash
# Ensure directories exist and are writable
mkdir -p packages/backend/latex-temp
mkdir -p packages/backend/uploads/resumes
chmod 755 packages/backend/latex-temp
chmod 755 packages/backend/uploads/resumes
```

### Timeout Issues

If compilations frequently timeout:

1. Increase `LATEX_TIMEOUT` in .env
2. Simplify LaTeX templates
3. Check container resource limits
4. Review LaTeX log files for infinite loops

## Testing

### Manual Testing

```bash
# Create test LaTeX file
echo '\documentclass{article}\begin{document}Hello World\end{document}' > test.tex

# Copy to container
docker cp test.tex ats-latex:/work/

# Compile
docker exec ats-latex pdflatex -interaction=nonstopmode -output-directory=/work test.tex

# Copy PDF back
docker cp ats-latex:/work/test.pdf ./
```

### Integration Testing

```typescript
// Test compilation with sample data
const testContent: OptimizedContent = {
  personalInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0100',
    location: 'San Francisco, CA',
  },
  summary: 'Experienced software engineer...',
  experience: [...],
  education: [...],
  skills: [...],
  projects: [...],
};

const result = await compiler.compileResume(
  templateContent,
  testContent,
  'test-user-id',
  'Test Company',
  'Software Engineer'
);

expect(result.fileName).toMatch(/Test_Company_Software_Engineer_\d+_[a-f0-9]+\.pdf/);
expect(fs.existsSync(result.filePath)).toBe(true);
```

## Best Practices

1. **Always sanitize user input** - Even though the service sanitizes, validate at API level too
2. **Monitor compilation times** - Track average times to detect issues
3. **Log compilation errors** - Keep detailed logs for debugging
4. **Test templates thoroughly** - Validate all templates before deployment
5. **Set appropriate timeouts** - Balance between complex resumes and resource usage
6. **Regular container updates** - Keep TeXLive image updated for security
7. **Monitor disk usage** - Clean up old PDFs periodically
8. **Use queue system** - Don't compile synchronously in API requests

## Future Enhancements

- [ ] Support for additional LaTeX packages
- [ ] Template validation before compilation
- [ ] Compilation caching for identical content
- [ ] Multi-language support
- [ ] Custom fonts and styling
- [ ] PDF metadata injection
- [ ] Watermarking support
- [ ] A/B testing different templates
