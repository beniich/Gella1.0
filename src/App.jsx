import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import AdminProductCreate from './pages/AdminProductCreate';
import Preview from './pages/Preview';
import './App.css';

function DashboardLayout({ children }) {
  return (
    <div className="app">
      <Sidebar />
      {children}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboard (Home) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MainContent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Marketplace */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="main-content" style={{ padding: '2rem', width: '100%' }}>
                    <Marketplace />
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Product Detail */}
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="main-content" style={{ padding: '2rem', width: '100%' }}>
                    <ProductDetail />
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Create Product */}
          <Route
            path="/admin/products/create"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="main-content" style={{ padding: '2rem', width: '100%' }}>
                    <AdminProductCreate />
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Preview */}
          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <Preview />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
