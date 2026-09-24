/**
 * Centralized Export & Download Utilities
 * Ensures bulletproof file downloads and printing in all browser environments,
 * including sandboxed iframes (e.g. AI Studio preview), web views, and mobile.
 */

/**
 * Downloads text/html/xml content as a file reliably.
 * Uses BOM \ufeff for Vietnamese Unicode NFC support in MS Word/Excel.
 * Delays URL revocation to prevent modern Chromium from canceling the download pipeline.
 */
export function downloadFile(content: string, fileName: string, mimeType: string): boolean {
  try {
    const withBom = content.startsWith('\ufeff') ? content : '\ufeff' + content;
    const blob = new Blob([withBom], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();

    // Delay cleanup to allow browser download manager to consume the blob stream
    setTimeout(() => {
      try {
        if (link.parentNode) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      } catch (cleanupErr) {
        console.warn('Download cleanup error:', cleanupErr);
      }
    }, 60000);

    return true;
  } catch (err) {
    console.error('downloadFile failed:', err);
    return false;
  }
}

/**
 * Copy text or HTML to clipboard safely across modern and legacy browsers
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (navErr) {
    console.warn('navigator.clipboard failed, using fallback:', navErr);
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (fallbackErr) {
    console.error('Clipboard fallback copy error:', fallbackErr);
    return false;
  }
}

/**
 * Trigger print safely with iframe-awareness
 */
export function triggerPrintSafely(): { success: boolean; isIframe: boolean; error?: string } {
  const isIframe = window.self !== window.top;
  try {
    window.print();
    return { success: true, isIframe };
  } catch (err: any) {
    console.warn('window.print() error (likely iframe sandbox):', err);
    return { success: false, isIframe, error: err?.message || 'Chặn lệnh in' };
  }
}
