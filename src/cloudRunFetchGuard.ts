/*
 * Google AI Studio / Cloud Run preview sometimes turns an /api/* POST into an
 * HTML cookie-check / preview page. DAVID's workbench expects JSON, so that
 * becomes the ugly "Unexpected token '<'" failure.
 *
 * This guard keeps the recovery deliberately boring:
 * - no URL constructor / arbitrary redirect parsing
 * - no replaying preview-provided URLs into an iframe
 * - use redirect:'manual' first so we can notice the auth hop before fetch
 *   follows it into HTML
 * - execute only the literal Studio cookie-check path
 * - retry the original API request once
 */

const nativeFetch = window.fetch.bind(window);
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isLocalApiRequest(input: RequestInfo | URL): boolean {
  if (typeof input === 'string') return input.startsWith('/api/');
  if (typeof URL !== 'undefined' && input instanceof URL) return input.pathname.startsWith('/api/');
  try {
    return typeof (input as Request)?.url === 'string' && (input as Request).url.includes('/api/');
  } catch {
    return false;
  }
}

async function looksLikeHtml(response: Response): Promise<boolean> {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('text/html')) return true;
  try {
    const head = (await response.clone().text()).slice(0, 256).trim().toLowerCase();
    return head.startsWith('<!doctype') || head.startsWith('<html') || head.startsWith('<head');
  } catch {
    return false;
  }
}

async function executeCookieHandshake(): Promise<void> {
  await new Promise<void>((resolve) => {
    const iframe = document.createElement('iframe');
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      try { iframe.remove(); } catch {}
      resolve();
    };

    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.position = 'fixed';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.onload = () => window.setTimeout(finish, 250);
    iframe.onerror = finish;

    try {
      iframe.setAttribute('src', '/__cookie_check.html');
      document.body.appendChild(iframe);
    } catch (error) {
      console.warn('[DAVID] Studio cookie handshake could not be opened:', error);
      finish();
    }

    window.setTimeout(finish, 3000);
  });
  await sleep(120);
}

async function firstPass(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    return await nativeFetch(input, { ...init, redirect: 'manual' });
  } catch {
    return nativeFetch(input, init);
  }
}

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (!isLocalApiRequest(input)) return nativeFetch(input, init);

  let response = await firstPass(input, init);
  const redirected = response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400);
  const html = await looksLikeHtml(response);

  if (!redirected && !html) return response;

  console.warn('[DAVID] Studio preview intercepted an API request; repairing preview session and retrying once.');
  await executeCookieHandshake();

  try {
    const retry = await nativeFetch(input, { ...init, redirect: 'follow' });
    return retry;
  } catch {
    return response;
  }
};
