/*
 * Google AI Studio / Cloud Run preview can occasionally redirect an API POST
 * to /__cookie_check.html. A normal fetch follows that redirect and receives
 * the cookie-check HTML, but it never executes the page, so retrying the POST
 * simply loops forever.
 *
 * This guard sits underneath DAVID's existing API helper. For same-origin
 * /api/* calls only, it detects the real Cloud Run cookie-check response,
 * loads that page in a hidden iframe so its handshake can execute, then
 * replays the original request with the newly-established preview session.
 */

const nativeFetch = window.fetch.bind(window);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isSameOriginApiRequest(input: RequestInfo | URL): boolean {
  try {
    const rawUrl =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const parsed = new URL(rawUrl, window.location.href);
    return parsed.origin === window.location.origin && parsed.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

async function isCloudRunCookieCheck(response: Response): Promise<boolean> {
  if (response.url.includes('__cookie_check')) return true;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return false;

  try {
    const html = await response.clone().text();
    const head = html.slice(0, 12000).toLowerCase();
    return (
      head.includes('<title>cookie check</title>') ||
      head.includes('__cookie_check') ||
      (head.includes('cookie') && head.includes('cloud run') && head.includes('redirect'))
    );
  } catch {
    return false;
  }
}

async function executeCookieHandshake(checkUrl: string): Promise<void> {
  await new Promise<void>((resolve) => {
    const iframe = document.createElement('iframe');
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      iframe.remove();
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

    iframe.onload = () => {
      // Give any cookie-setting / redirect script in the check page a moment
      // to finish before removing the frame and replaying the POST.
      window.setTimeout(finish, 350);
    };
    iframe.onerror = finish;

    document.body.appendChild(iframe);
    iframe.src = checkUrl;

    // Never let a broken preview handshake stall DAVID indefinitely.
    window.setTimeout(finish, 4500);
  });

  await sleep(250);
}

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (!isSameOriginApiRequest(input)) {
    return nativeFetch(input, init);
  }

  let response = await nativeFetch(input, init);

  // Two internal recoveries are enough; DAVID's higher-level apiPost helper
  // still owns ordinary network/transient retry behavior.
  for (let recovery = 0; recovery < 2; recovery++) {
    if (!(await isCloudRunCookieCheck(response))) break;

    const checkUrl = response.url || new URL('/__cookie_check.html', window.location.href).toString();
    console.warn('[DAVID] Cloud Run preview cookie handshake intercepted; repairing session and replaying API request.');

    await executeCookieHandshake(checkUrl);
    response = await nativeFetch(input, init);
  }

  return response;
};
