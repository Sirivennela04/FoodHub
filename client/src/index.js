import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root'); // Check this line
   if (!rootElement) {
       console.error("Target container is not a DOM element.");
   } else {
       const root = ReactDOM.createRoot(rootElement);
       root.render(
           <React.StrictMode>
               <App />
           </React.StrictMode>
       );
   }

reportWebVitals();
