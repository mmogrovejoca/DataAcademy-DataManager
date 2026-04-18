import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import ModuleDetail from './pages/ModuleDetail';
import Certificate from './pages/Certificate';

export default function App() {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('dm_userId'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('dm_userName'));

  const login = (id: string, name: string) => {
    localStorage.setItem('dm_userId', id);
    localStorage.setItem('dm_userName', name);
    setUserId(id);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('dm_userId');
    localStorage.removeItem('dm_userName');
    setUserId(null);
    setUserName(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen text-white font-sans">
        <Routes>
          <Route path="/" element={
            !userId ? <Welcome onLogin={login} /> : <Navigate to="/dashboard" replace />
          } />
          <Route path="/dashboard" element={
            userId ? <Dashboard userId={userId} userName={userName!} onLogout={logout} /> : <Navigate to="/" replace />
          } />
          <Route path="/module/:moduleId" element={
            userId ? <ModuleDetail userId={userId} /> : <Navigate to="/" replace />
          } />
          <Route path="/certificate" element={
            userId ? <Certificate userId={userId} userName={userName!} /> : <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
