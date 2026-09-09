/*
 * Minimal Google AI Studio / Cloud Run preview fetch guard.
 *
 * Previous versions normalized preview redirect URLs with the URL constructor
 * and replayed the exact response URL into a hidden iframe. In some Studio /
 * browser combinations that path can throw the DOMException:
 * "The string did not match the expected pattern".
 *
 * This version deliberately avoids URL parsing for same-origin /api/* calls
 * and never assigns an arbitrary redirect URL to an iframe. If Cloud Run asks
 * for its cookie check, we execute only the known literal cookie-check path,
 * then replay the original request once.
 */

const nativeFetch = window.fetch.bind(window);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isLocalApiRequest(input: RequestInfo | URL): boolean {
  if (typeof input === 'string') return input.startsWith('/api/');
  try {
    const url = input instanceof URL ? input.pathname : new URL(input.url).pathname;
    return url.startsWith('/api/');
  } catch {
    return false;
  }
}

async function isCloudRunCookieCheck(response: Response): Promise<boolean> {
  if (response.url && response.url.includes('__cookie_check')) return true;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return false;

  try {
    const html = await response.clone().text();
    const head = html.slice(0, 12000).toLowerCase();
    return (
      head.includes('<title>cookie check</title>') ||
      head.includes('__cookie_check') ||
      (head.includes('cookie') && head.includes('cloud run'))
    );
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
    iframe.onload = () => window.setTimeout(finish, 300);
    iframe.onerror = finish;

    try {
      // Known literal path only. No URL constructor, no response URL replay.
      iframe.setAttribute('src', '/__cookie_check.html');
      document.body.appendChild(iframe);
    } catch (error) {
      console.warn('[DAVID] Studio cookie handshake unavailable; caller will receive the original response.', error);
      finish();
    }

    window.setTimeout(finish, 3500);
  });

  await sleep(150);
}

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (!isLocalApiRequest(input)) return nativeFetch(input, init);

  let response: Response;
  try {
    response = await nativeFetch(input, init);
  } catch (error) {
    // Preserve the real browser error for the workbench instead of creating a
    // second DOMException inside preview-repair code.
    throw error;
  }

  if (!(await isCloudRunCookieCheck(response))) return response;

  console.warn('[DAVID] Studio cookie check detected; executing known handshake and replaying request once.');
  await executeCookieHandshake();

  try {
    return await nativeFetch(input, init);
  } catch {
    return response;
  }
};
