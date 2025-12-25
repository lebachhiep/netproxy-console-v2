export const copyToClipboard = async (text: string) => {
  try {
    // Guard cho SSR + browser cũ
    if (!navigator?.clipboard) {
      fallbackCopy(text);
      return;
    }

    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy:', err);
    fallbackCopy(text);
  }
};

const fallbackCopy = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
