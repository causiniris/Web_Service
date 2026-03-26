import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- 新增：引入路由上下文
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 新增：用 BrowserRouter 包裹 App */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);