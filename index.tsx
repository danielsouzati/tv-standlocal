
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Registro simples de Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      URL.createObjectURL(
        new Blob(
          [
            `self.addEventListener('fetch', function(event) {
              // Service worker básico para permitir instalação
            });`
          ],
          { type: 'text/javascript' }
        )
      )
    ).catch(err => console.log('SW registration failed:', err));
  });
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
