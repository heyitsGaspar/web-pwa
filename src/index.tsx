import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

// Asegúrate de que `rootElement` no sea nulo para evitar errores de TypeScript
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Para medir el rendimiento de la aplicación, puedes pasar una función
// a `reportWebVitals` para registrar resultados o enviarlos a un servicio de análisis
reportWebVitals();
