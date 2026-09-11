/**
 * Safely copies text to the user's clipboard.
 * Supports modern Clipboard API with graceful fallback to document.execCommand('copy').
 * Never throws an uncaught error if clipboard permissions are denied in sandboxed iframes.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern navigator.clipboard first (must be while window still has focus)
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or lost focus, continue to textarea fallback
    }
  }

  // Fallback: document.execCommand('copy') with temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.setAttribute('readonly', '');

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    // If all fail, fail silently without throwing an uncaught exception
    return false;
  }
}
