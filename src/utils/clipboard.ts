export async function copyTextToClipboard(text: string): Promise<void> {
  let clipboardError: unknown;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (error) {
      clipboardError = error;
    }
  }

  if (typeof document === 'undefined' || typeof document.execCommand !== 'function') {
    throw new Error('Przeglądarka nie udostępnia funkcji kopiowania do schowka.', {
      cause: clipboardError,
    });
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.tabIndex = -1;
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  let copied: boolean;
  try {
    textarea.focus();
    textarea.select();
    copied = document.execCommand('copy');
  } finally {
    textarea.remove();
  }

  if (!copied) {
    throw new Error('Przeglądarka odmówiła skopiowania tekstu do schowka.', {
      cause: clipboardError,
    });
  }
}
