// Robust multi-channel real-time event bus for AniHeal
let broadcastChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel('aniheal_content_channel');
  } catch (e) {
    broadcastChannel = null;
  }
}

export function notifyContentUpdated(details = {}) {
  if (typeof window === 'undefined') return;

  // 1. Same-window CustomEvent
  try {
    window.dispatchEvent(
      new CustomEvent('aniheal_content_updated', {
        detail: { timestamp: Date.now(), ...details },
      })
    );
  } catch (e) {}

  // 2. Cross-tab BroadcastChannel
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'CONTENT_UPDATED',
        timestamp: Date.now(),
        ...details,
      });
    } catch (e) {}
  }

  // 3. Cross-tab localStorage fallback
  try {
    localStorage.setItem(
      'aniheal_content_sync_timestamp',
      JSON.stringify({ timestamp: Date.now(), ...details })
    );
  } catch (e) {}
}

export function subscribeToContentUpdates(callback) {
  if (typeof window === 'undefined' || typeof callback !== 'function') {
    return () => {};
  }

  const handleCustomEvent = (e) => callback(e?.detail || {});
  window.addEventListener('aniheal_content_updated', handleCustomEvent);

  let bc = null;
  if ('BroadcastChannel' in window) {
    try {
      bc = new BroadcastChannel('aniheal_content_channel');
      bc.onmessage = (e) => {
        if (e.data && e.data.type === 'CONTENT_UPDATED') {
          callback(e.data);
        }
      };
    } catch (e) {}
  }

  const handleStorage = (e) => {
    if (e.key === 'aniheal_content_sync_timestamp' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (err) {
        callback({});
      }
    }
  };
  window.addEventListener('storage', handleStorage);

  const handleFocus = () => callback({ reason: 'window_focused' });
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      callback({ reason: 'tab_visible' });
    }
  });

  return () => {
    window.removeEventListener('aniheal_content_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('focus', handleFocus);
    if (bc) {
      try {
        bc.close();
      } catch (e) {}
    }
  };
}
