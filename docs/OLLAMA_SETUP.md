# Ollama Setup Guide

This project uses **Ollama** with the **Gemma 2B** model for AI-powered features instead of OpenAI. This means:
- ✅ **Free** - No API costs
- ✅ **Private** - All data stays on your machine
- ✅ **Fast** - Local inference
- ✅ **Offline** - Works without internet

## Installation

### Step 1: Install Ollama

**Windows:**
1. Download Ollama from: https://ollama.com/download/windows
2. Run the installer (`OllamaSetup.exe`)
3. Follow the installation wizard
4. Ollama will start automatically

**Verify Installation:**
```powershell
ollama --version
```

### Step 2: Pull the Gemma 2B Model

```powershell
ollama pull gemma2:2b
```

This will download the Gemma 2B model (~1.6GB). It may take a few minutes depending on your internet speed.

### Step 3: Test the Model

```powershell
ollama run gemma2:2b "Hello, how are you?"
```

You should see a response from the model. Press `Ctrl+D` or type `/bye` to exit.

### Step 4: Verify Ollama is Running

Ollama runs as a background service on `http://localhost:11434`. Test it:

```powershell
curl http://localhost:11434/api/tags
```

You should see a list of installed models including `gemma2:2b`.

## Configuration

The backend is already configured to use Ollama. Check `packages/backend/.env`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma2:2b
```

## Testing the AI Service

Once Ollama is installed and the model is pulled, you can test the AI service:

```powershell
# Start the backend (if not already running)
npm run dev:backend
```

The AI service will be used for:
- 📄 **Resume parsing** - Extract structured data from resumes
- 🎯 **Job analysis** - Analyze job descriptions and extract requirements
- ✨ **Content optimization** - Optimize resume content for ATS
- 💼 **Interview questions** - Generate relevant interview questions

## Available Models

You can use different models by changing `OLLAMA_MODEL` in `.env`:

**Recommended models:**
- `gemma2:2b` - Fast, good for most tasks (1.6GB) ⭐ **Default**
- `gemma2:9b` - Better quality, slower (5.5GB)
- `llama3.2:3b` - Alternative, good balance (2GB)
- `phi3:mini` - Very fast, smaller (2.3GB)

**To switch models:**
1. Pull the new model: `ollama pull llama3.2:3b`
2. Update `.env`: `OLLAMA_MODEL=llama3.2:3b`
3. Restart the backend

## Troubleshooting

### Ollama not responding

**Check if Ollama is running:**
```powershell
# Windows - Check if Ollama service is running
Get-Process ollama
```

**Restart Ollama:**
- Close Ollama from system tray
- Start Ollama from Start menu

### Model not found

**List installed models:**
```powershell
ollama list
```

**Pull the model again:**
```powershell
ollama pull gemma2:2b
```

### Slow responses

**Try a smaller model:**
```powershell
ollama pull phi3:mini
```

Update `.env`:
```env
OLLAMA_MODEL=phi3:mini
```

### Connection refused

**Check Ollama URL:**
```powershell
curl http://localhost:11434/api/tags
```

If this fails, Ollama is not running. Start it from the Start menu.

## Performance Tips

1. **Use GPU acceleration** - Ollama automatically uses your GPU if available (NVIDIA/AMD)
2. **Close other applications** - Free up RAM for better performance
3. **Use smaller models** - `gemma2:2b` is fast and sufficient for most tasks
4. **Adjust temperature** - Lower temperature (0.3) for more consistent outputs

## API Usage Examples

### Generate Text

```typescript
import { aiService } from './services/ai.service';

const response = await aiService.generateCompletion(
  'Extract the key skills from this resume: ...',
  'You are a helpful resume parser.'
);
```

### Generate JSON

```typescript
const data = await aiService.generateJSON<{ skills: string[] }>(
  'Extract skills from: "5 years of JavaScript, React, Node.js"',
  'You are a resume parser. Return JSON only.'
);

console.log(data.skills); // ['JavaScript', 'React', 'Node.js']
```

### Check Connection

```typescript
const isConnected = await aiService.checkConnection();
if (!isConnected) {
  console.error('Ollama is not running!');
}
```

## Comparison: Ollama vs OpenAI

| Feature | Ollama (Gemma 2B) | OpenAI (GPT-4) |
|---------|-------------------|----------------|
| Cost | Free | $0.03 per 1K tokens |
| Privacy | 100% local | Data sent to OpenAI |
| Speed | Fast (local) | Depends on API |
| Quality | Good | Excellent |
| Internet | Not required | Required |
| Setup | Install + Download | API key only |

For this project, **Ollama is the better choice** because:
- Resume data is sensitive and should stay private
- No ongoing costs
- Fast enough for resume parsing and analysis
- Works offline

## Resources

- **Ollama Website**: https://ollama.com
- **Ollama GitHub**: https://github.com/ollama/ollama
- **Model Library**: https://ollama.com/library
- **Gemma 2B**: https://ollama.com/library/gemma2:2b

## Next Steps

After installing Ollama:
1. ✅ Install Ollama
2. ✅ Pull `gemma2:2b` model
3. ✅ Verify it's running
4. 🚀 Continue building features (Task 4: User Profile Management)

The AI service is ready to use for resume parsing, job analysis, and content optimization!
