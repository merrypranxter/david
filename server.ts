import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MissingApiKeyError, resolveApiKey, simulateTarget, synthesize, extractErrorInfo } from './lib/david';
import { decomposeConcept } from './lib/decompositionBackend';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Utility to safely stringify objects avoiding circular reference crashes
function safeJsonStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  });
}

// Ensure API responses are never cached by intermediate Cloud Run / nginx proxies
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Endpoint: Synthesize Prompt
app.post('/api/synthesize', async (req, res) => {
  try {
    const result = await synthesize(req.body);
    const jsonStr = safeJsonStringify(result.body);
    res.status(result.status).setHeader('Content-Type', 'application/json').send(jsonStr);
  } catch (err: any) {
    console.error('Synthesis error:', err);
    if (err instanceof MissingApiKeyError) {
      return res.status(500).json({ success: false, error: err.message });
    }
    const info = extractErrorInfo(err);
    const statusCode = info.isRateLimit ? 429 : info.isTransient ? 503 : 500;
    const errBody = {
      success: false,
      error: info.message,
      isRateLimit: info.isRateLimit,
      isTransient: info.isTransient,
      retryAfterSeconds: info.retryAfterSeconds,
    };
    res.status(statusCode).setHeader('Content-Type', 'application/json').send(safeJsonStringify(errBody));
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
    const statusCode = info.isRateLimit ? 429 : info.isTransient ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      error: info.message,
      isRateLimit: info.isRateLimit,
      isTransient: info.isTransient,
      retryAfterSeconds: info.retryAfterSeconds,
    });
  }
});

// Endpoint: Decompose Concept (Structural Dismemberment - Job 3)
app.post('/api/decompose', async (req, res) => {
  try {
    const { concept, useLLM, anchorThreshold, modelPreference } = req.body || {};
    const decomposed = await decomposeConcept(concept || '', {
      useLLM: Boolean(useLLM),
      anchorThreshold,
      modelPreference,
    });
    res.json({ success: true, decomposed });
  } catch (err: any) {
    console.error('Decomposition error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Decomposition failed' });
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

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`David 8 Synthetic Core Server running on http://0.0.0.0:${PORT}`);
  });

  // Cloud Run proxy keep-alive alignment to prevent ECONNRESET
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
  server.timeout = 120000;
}

startServer();
