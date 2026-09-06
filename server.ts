import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MissingApiKeyError, simulateTarget, synthesize } from './lib/david';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Endpoint: Synthesize Prompt
app.post('/api/synthesize', async (req, res) => {
  try {
    const result = await synthesize(req.body);
    res.status(result.status).json(result.body);
  } catch (err: any) {
    console.error('Synthesis error:', err);
    if (err instanceof MissingApiKeyError) {
      return res.status(500).json({ error: err.message });
    }
    res.status(500).json({
      error: 'Failed to synthesize prompt: ' + (err?.message || 'Unknown error'),
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
      return res.status(500).json({ error: err.message });
    }
    res.status(500).json({ error: 'Simulation failed: ' + (err?.message || 'Unknown error') });
  }
});

// Endpoint: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    entity: 'DAVID',
    vibeCodeVersion: '1.1',
    runtime: 'express',
    apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.API_KEY),
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
    console.log(`David VibeCode Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
