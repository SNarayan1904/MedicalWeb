import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginStart, loginSuccess, loginFailure } from '../../features/auth/authSlice'
import FormInput from '../../components/FormInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Shield, Stethoscope, ArrowLeft } from 'lucide-react'
import { validateEmail, validateRequired } from '../../utils/validators'

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formErrors, setFormErrors] = useState({})

  const mockCredentials = {
    email: 'admin@admin.com',
    password: 'admin123',
    name: 'System Administrator'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!validateRequired(formData.password)) {
      errors.password = 'Password is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    dispatch(loginStart())

    try {
      if (mockCredentials.email === formData.email && 
          mockCredentials.password === formData.password) {
        
        setTimeout(() => {
          dispatch(loginSuccess({
            user: { 
              email: mockCredentials.email, 
              name: mockCredentials.name,
              id: 'admin001'
            },
            role: 'admin'
          }))
          navigate('/admin-dashboard')
        }, 1000)
      } else {
        setTimeout(() => {
          dispatch(loginFailure('Invalid admin credentials'))
        }, 1000)
      }
    } catch (error) {
      dispatch(loginFailure('Login failed. Please try again.'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Administrator Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter admin email"
              required
              error={formErrors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              required
              error={formErrors.password}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:cursor-pointer"
            >
              {loading ? <LoadingSpinner size="sm" text="" /> : 'Sign In as Admin'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not an admin?{' '}
              <Link to="/doctor/login" className="text-green-600 hover:text-green-500 font-medium">
                Doctor Login
              </Link>
              {' '}or{' '}
              <Link to="/patient/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Patient Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin