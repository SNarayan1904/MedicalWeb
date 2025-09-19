import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addPatient } from '../../features/patients/patientSlice'
import { loginSuccess } from '../../features/auth/authSlice'
import FormInput from '../../components/FormInput'
import { User, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { generatePatientId } from '../../utils/mockData'
import { validateEmail, validatePhone, validateRequired, validateDateOfBirth, validatePassword } from '../../utils/validators'

const PatientSignup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!validateRequired(formData.name)) {
      errors.name = 'Full name is required'
    }

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!validateRequired(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Date of birth is required'
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      errors.dateOfBirth = 'Please enter a valid date of birth'
    }

    if (!validateRequired(formData.address)) {
      errors.address = 'Address is required'
    }

    if (!validateRequired(formData.emergencyContactName)) {
      errors.emergencyContactName = 'Emergency contact name is required'
    }

    if (!validatePhone(formData.emergencyContactPhone)) {
      errors.emergencyContactPhone = 'Please enter a valid emergency contact phone'
    }

    if (!validateRequired(formData.emergencyContactRelation)) {
      errors.emergencyContactRelation = 'Emergency contact relation is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Generate unique patient ID
      const patientId = generatePatientId()
      
      const newPatient = {
        id: patientId,
        name: formData.name,
        email: formData.email,
        password: formData.password, // Store password for login
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation
        },
        medicalHistory: [],
        createdAt: new Date().toISOString()
      }

      // Add patient to store
      dispatch(addPatient(newPatient))
      
      // Auto-login the new patient
      setTimeout(() => {
        dispatch(loginSuccess({
          user: {
            id: patientId,
            email: formData.email,
            name: formData.name
          },
          role: 'patient'
        }))
        
        // Show success message with login details
        alert(`Account created successfully!\n\nYour login credentials:\nEmail: ${formData.email}\nPassword: ${formData.password}\nPatient ID: ${patientId}\n\nPlease save these details for future logins.`)
        
        navigate('/patient-dashboard')
        setLoading(false)
      }, 1500)
      
    } catch (error) {
      setLoading(false)
      console.error('Signup error:', error)
    }
  }

  const relationOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Patient Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join MedCare to manage your appointments and health records
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  error={formErrors.name}
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  error={formErrors.email}
                />

                <div className="relative">
                  <FormInput
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    error={formErrors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    error={formErrors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <FormInput
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  required
                  error={formErrors.phone}
                />

                <FormInput
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  error={formErrors.dateOfBirth}
                />
              </div>

              <FormInput
                label="Address"
                name="address"
                type="textarea"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete address"
                required
                error={formErrors.address}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Emergency Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Emergency Contact Name"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  placeholder="Enter contact name"
                  required
                  error={formErrors.emergencyContactName}
                />

                <FormInput
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  placeholder="Enter contact phone"
                  required
                  error={formErrors.emergencyContactPhone}
                />

                <FormInput
                  label="Relation"
                  name="emergencyContactRelation"
                  type="select"
                  value={formData.emergencyContactRelation}
                  onChange={handleInputChange}
                  placeholder="Select relation"
                  required
                  error={formErrors.emergencyContactRelation}
                  options={relationOptions}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Password Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Use a combination of letters and numbers for better security</li>
                <li>• Avoid using easily guessable information</li>
              </ul>
            </div>

            <div className="flex space-x-4 pt-6">
              <Link
                to="/patient/login"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PatientSignup