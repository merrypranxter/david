import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MissingApiKeyError, resolveApiKey, simulateTarget, synthesize, extractErrorInfo } from './lib/david';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure API responses are never cached by intermediate Cloud Run / nginx proxies
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Endpoint: Synthesize Prompt
app.post('/api/synthesize', async (req, res) => {
  try {
    const result = await synthesize(req.body);
    res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Synthesis error:', err);
    if (err instanceof MissingApiKeyError) {
      return res.status(500).json({ success: false, error: err.message });
    }
    const info = extractErrorInfo(err);
    res.status(info.isRateLimit ? 429 : 500).json({
      success: false,
      error: info.message,
      isRateLimit: info.isRateLimit,
      retryAfterSeconds: info.retryAfterSeconds,
    });
  }
});

// Endpoint: Simulate execution on target engine
app.post('/api/simulate-target', async (req, res) => {
  try {
    const result = await simulateTarget(req.body);
    res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Simulation error:', err);
    if (err instanceof MissingApiKeyError) {
      return res.status(500).json({ success: false, error: err.message });
    }
    const info = extractErrorInfo(err);
    res.status(info.isRateLimit ? 429 : 500).json({
      success: false,
      error: info.message,
      isRateLimit: info.isRateLimit,
      retryAfterSeconds: info.retryAfterSeconds,
    });
  }
});

// Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    entity: 'DAVID',
    protocol: 'david-8',
    syntheticCore: 'unlobotomized',
    runtime: 'express',
    apiKeyConfigured: Boolean(resolveApiKey()),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`David 8 Synthetic Core Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
