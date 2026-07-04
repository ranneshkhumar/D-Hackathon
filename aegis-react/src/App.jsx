import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AegisProvider } from './context/AegisContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Boardroom from './pages/Boardroom';
import Architecture from './pages/Architecture';

export default function App() {
  return (
    <AegisProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/boardroom" element={<Boardroom />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </main>
      </div>
    </AegisProvider>
  );
}
