import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { lazy, Suspense } from 'react';

// 懒加载主组件
const Layout = lazy(() => import('./components/Layout'));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Suspense fallback={<div>加载中...</div>}>
    <Layout />
  </Suspense>
);
