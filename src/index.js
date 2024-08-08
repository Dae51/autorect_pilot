//Se importan los modulos de react
import React from 'react';
import ReactDOM from 'react-dom/client';
// Se importa el modulo de la aplicacion
import App from './App';
import reportWebVitals from './reportWebVitals';
// Se importa el css del login
import './style/admin/login.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
