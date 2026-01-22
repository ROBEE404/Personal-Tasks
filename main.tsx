import React from 'react'
import ReactDOM from 'react-dom/client'
import ProgressBoard from './progress_board'
import './index.css'

// Polyfill for window.storage
if (!(window as any).storage) {
  (window as any).storage = {
    list: async (prefix: string) => {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys };
    },
    get: async (key: string) => {
      const value = localStorage.getItem(key);
      return value ? { value } : null;
    },
    set: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    delete: async (key: string) => {
      localStorage.removeItem(key);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProgressBoard />
  </React.StrictMode>,
)
