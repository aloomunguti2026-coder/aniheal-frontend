export function notifyContentUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aniheal_content_updated'));
  }
}
