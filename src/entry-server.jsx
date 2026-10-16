import React from 'react';
import { prerender } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import AppRoutes from './routes/AppRoutes';
import { ContentProvider } from './hooks/useContent';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';

// Polyfills for Node.js build-time prerender environment
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  };
}

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    scrollTo: () => {},
    scrollY: 0,
    innerHeight: 800,
    innerWidth: 1200,
    sessionStorage: globalThis.sessionStorage,
    localStorage: globalThis.localStorage,
  };
}

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    documentElement: { scrollHeight: 1000 },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {} }),
    head: { appendChild: () => {} },
  };
}

export async function render(url, initialContent) {
  const { prelude } = await prerender(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AuthProvider>
          <ConfirmProvider>
            <ContentProvider value={initialContent}>
              <div className="app">
                <AppRoutes />
              </div>
            </ContentProvider>
          </ConfirmProvider>
        </AuthProvider>
      </StaticRouter>
    </React.StrictMode>
  );

  const reader = prelude.getReader();
  let html = '';
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    html += decoder.decode(value);
  }

  return { html };
}
