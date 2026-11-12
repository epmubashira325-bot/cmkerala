import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LoadingSpinner } from './components/StateFeedback';

// Public Pages (Eagerly loaded for instant first paint)
import Home from './pages/Home';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Departments from './pages/Departments';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import TrackGrievance from './pages/TrackGrievance';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy Loaded Citizen Pages
const CitizenLayout = lazy(() => import('./pages/citizen/CitizenLayout'));
const CitizenDashboard = lazy(() => import('./pages/citizen/CitizenDashboard'));
const SubmitGrievance = lazy(() => import('./pages/citizen/SubmitGrievance'));
const MyGrievances = lazy(() => import('./pages/citizen/MyGrievances'));
const GrievanceDetail = lazy(() => import('./pages/citizen/GrievanceDetail'));
const CitizenProfile = lazy(() => import('./pages/citizen/Profile'));

// Lazy Loaded Officer Pages
const OfficerLayout = lazy(() => import('./pages/officer/OfficerLayout'));
const OfficerDashboard = lazy(() => import('./pages/officer/OfficerDashboard'));
const AssignedGrievances = lazy(() => import('./pages/officer/AssignedGrievances'));
const OfficerGrievanceDetail = lazy(() => import('./pages/officer/OfficerGrievanceDetail'));
const SubmitActionReport = lazy(() => import('./pages/officer/SubmitActionReport'));
const OfficerReports = lazy(() => import('./pages/officer/OfficerReports'));
const OfficerProfile = lazy(() => import('./pages/officer/OfficerProfile'));

// Lazy Loaded CMO Administrator Pages
const CMOLayout = lazy(() => import('./pages/cmo/CMOLayout'));
const CMODashboard = lazy(() => import('./pages/cmo/CMODashboard'));
const GrievanceRegistry = lazy(() => import('./pages/cmo/GrievanceRegistry'));
const CMOGrievanceDetail = lazy(() => import('./pages/cmo/CMOGrievanceDetail'));
const CMOReports = lazy(() => import('./pages/cmo/CMOReports'));
const CMODepartments = lazy(() => import('./pages/cmo/CMODepartments'));
const CMOProfile = lazy(() => import('./pages/cmo/CMOProfile'));

// Loading Fallback Component
function PageSuspenseFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8">
      <LoadingSpinner message="Loading application module..." />
    </div>
  );
}

// Layout wrapper for public pages (with Navbar and Footer)
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSuspenseFallback />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/departments" element={<PublicLayout><Departments /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/track" element={<PublicLayout><TrackGrievance /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

            {/* Protected Citizen Portal Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={['CITIZEN']}>
                  <CitizenLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/citizen/dashboard" replace />} />
              <Route path="dashboard" element={<CitizenDashboard />} />
              <Route path="submit" element={<SubmitGrievance />} />
              <Route path="grievances" element={<MyGrievances />} />
              <Route path="grievances/new" element={<SubmitGrievance />} />
              <Route path="grievances/:id" element={<GrievanceDetail />} />
              <Route path="profile" element={<CitizenProfile />} />
            </Route>

            {/* Protected Department Officer Portal Routes */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={['OFFICER']}>
                  <OfficerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/officer/dashboard" replace />} />
              <Route path="dashboard" element={<OfficerDashboard />} />
              <Route path="grievances" element={<AssignedGrievances />} />
              <Route path="grievances/:id" element={<OfficerGrievanceDetail />} />
              <Route path="grievances/:id/report" element={<SubmitActionReport />} />
              <Route path="reports" element={<OfficerReports />} />
              <Route path="profile" element={<OfficerProfile />} />
            </Route>

            {/* Protected Chief Minister's Office (CMO) Administrator Portal Routes */}
            <Route
              path="/cmo"
              element={
                <ProtectedRoute allowedRoles={['CMO_ADMIN']}>
                  <CMOLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/cmo/dashboard" replace />} />
              <Route path="dashboard" element={<CMODashboard />} />
              <Route path="grievances" element={<GrievanceRegistry />} />
              <Route path="grievances/:id" element={<CMOGrievanceDetail />} />
              <Route path="reports" element={<CMOReports />} />
              <Route path="departments" element={<CMODepartments />} />
              <Route path="profile" element={<CMOProfile />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
