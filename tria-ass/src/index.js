import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Our global styles
import App from './App';
import { Toaster } from 'react-hot-toast'; // For the "Undo" feature

// Get the root element from index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* The Toaster component listens for all 'toast()' calls 
      from anywhere in our app (like the useContacts hook) 
      and displays them.
    */}
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />

    {/* This is our main application component */}
    <App />
  </React.StrictMode>
);