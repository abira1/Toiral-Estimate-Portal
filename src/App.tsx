import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate } from
'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Landing } from './pages/Landing';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ClientDashboard } from './pages/client/Dashboard';
import { ClientManagement } from './pages/admin/ClientManagement';
import { ClientProfile } from './pages/admin/ClientProfile';
import { ClientOnboarding } from './pages/admin/ClientOnboarding';
import { ProjectsList } from './pages/admin/ProjectsList';
import { ProjectDetails } from './pages/admin/ProjectDetails';
import { Invoices } from './pages/admin/Invoices';
import { Settings } from './pages/admin/Settings';
import { QuotationReview } from './pages/client/QuotationReview';
import { Reports } from './pages/client/Reports';
import { MyProject } from './pages/client/MyProject';
import { ProjectTracking } from './pages/ProjectTracking';
import { Notifications } from './pages/Notifications';
import { LoadingDemo } from './pages/LoadingDemo';
export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<ClientManagement />} />
            <Route path="/admin/clients/new" element={<ClientOnboarding />} />
            <Route path="/admin/clients/:id" element={<ClientProfile />} />
            <Route path="/admin/projects" element={<ProjectsList />} />
            <Route path="/admin/projects/:id" element={<ProjectDetails />} />
            <Route path="/admin/invoices" element={<Invoices />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route
              path="/admin/notifications"
              element={<Notifications userRole="admin" />} />


            <Route
              path="/admin/*"
              element={<Navigate to="/admin/dashboard" replace />} />


            {/* Client Routes */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/quotation/:id" element={<QuotationReview />} />
            <Route path="/client/reports" element={<Reports />} />
            <Route
              path="/client/notifications"
              element={<Notifications userRole="client" />} />

            <Route path="/client/project/:id" element={<ProjectTracking />} />
            <Route
              path="/client/*"
              element={<Navigate to="/client/dashboard" replace />} />


            {/* Legacy shared route - redirect based on referrer or default to client */}
            <Route
              path="/notifications"
              element={<Navigate to="/client/notifications" replace />} />

            <Route path="/project/:id" element={<ProjectTracking />} />

            {/* Demo Route */}
            <Route path="/loading-demo" element={<LoadingDemo />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>);

}