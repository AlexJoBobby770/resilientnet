import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Introduction from './pages/Introduction';
import Sidebar from './components/Sidebar';
import './App.css';

/* Authenticated shell — sidebar + scrollable content, NO topbar */
function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/introduction"
          element={
            <AppShell>
              <Introduction />
            </AppShell>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}