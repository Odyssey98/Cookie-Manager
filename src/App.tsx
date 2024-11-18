import React from 'react';
import './App.css';
import Layout from './components/Layout';

function App() {
  return (
    <div className="fixed right-0 top-0 w-[600px] h-screen border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <Layout />
    </div>
  );
}

export default App;