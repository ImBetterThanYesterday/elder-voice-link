import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Función para limpiar el caché
const clearCache = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active?.postMessage({ action: 'CLEAR_CACHE' });
    });
  }
  
  // Limpiar caché del navegador
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
  
  // Recargar la página
  window.location.reload();
};

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);
        
        // Escuchar actualizaciones del Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Hay una nueva versión disponible
                console.log('Nueva versión disponible');
                // Opcional: mostrar notificación al usuario
                if (confirm('Hay una nueva versión disponible. ¿Desea actualizar ahora?')) {
                  clearCache();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
  
  // Escuchar mensajes del Service Worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.action === 'CACHE_CLEARED') {
      console.log('Caché limpiado exitosamente');
    }
  });
}

// Exponer la función de limpiar caché globalmente
// @ts-ignore
window.clearAppCache = clearCache;

// Make sure React is imported and available globally
window.React = React;

// Create root and render app
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
