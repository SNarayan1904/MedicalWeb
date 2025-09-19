import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Pages
import HomePage from "./pages/HomePage"
import AdminLogin from './pages/auth/AdminLogin'
import DoctorLogin from './pages/auth/DoctorLogin'
import PatientLogin from './pages/auth/PatientLogin'
import PatientSignup from './pages/auth/PatientSignup'
import AdminDashboard from './pages/AdminDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard'
import DoctorSignup from './pages/auth/DoctorSignup'

// Components
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth)

  // Redirect authenticated users to their dashboard
  const getAuthenticatedRedirect = () => {
    if (isAuthenticated && role) {
      return `/${role}-dashboard`
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to={getAuthenticatedRedirect()} /> : 
            <HomePage />
          } 
        />
        
        {/* Auth Routes */}
        <Route 
          path="/admin/login" 
          element={
            isAuthenticated && role === 'admin' ? 
            <Navigate to="/admin-dashboard" /> : 
            <AdminLogin />
          } 
        />
        <Route 
          path="/doctor/login" 
          element={
            isAuthenticated && role === 'doctor' ? 
            <Navigate to="/doctor-dashboard" /> : 
            <DoctorLogin />
          } 
        />
        <Route 
          path="/patient/login" 
          element={
            isAuthenticated && role === 'patient' ? 
            <Navigate to="/patient-dashboard" /> : 
            <PatientLogin />
          } 
        />
        <Route 
          path="/patient/signup" 
          element={
            isAuthenticated && role === 'patient' ? 
            <Navigate to="/patient-dashboard" /> : 
            <PatientSignup />
          } 
        />

        {/* Protected Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/doctor/signup" 
          element={
            isAuthenticated && role === 'doctor' ? 
            <Navigate to="/doctor-dashboard" /> : 
            <DoctorSignup />
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App