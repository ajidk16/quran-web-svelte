import { isBrowser } from './environment';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser || !navigator.clipboard) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Gagal menyalin ke clipboard:', error);
    return false;
  }
}