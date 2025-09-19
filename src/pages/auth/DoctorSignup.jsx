import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../../components/FormInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Stethoscope, ArrowLeft, FileText, AlertCircle } from 'lucide-react'
import { validateEmail, validatePhone, validateRequired } from '../../utils/validators'
import { addDoctorRequest } from '../../features/doctors/doctorSlice'

const DoctorSignup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    experience: '',
    qualifications: '',
    clinicAddress: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const specialtyOptions = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'general_medicine', label: 'General Medicine' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'gynecology', label: 'Gynecology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'ophthalmology', label: 'Ophthalmology' },
    { value: 'ent', label: 'ENT (Ear, Nose & Throat)' }
  ]

  const experienceOptions = [
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10-15', label: '10-15 years' },
    { value: '15+', label: '15+ years' }
  ]

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

    if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    if (!validateRequired(formData.specialty)) {
      errors.specialty = 'Please select your specialty'
    }

    if (!validateRequired(formData.licenseNumber)) {
      errors.licenseNumber = 'Medical license number is required'
    }

    if (!validateRequired(formData.hospitalAffiliation)) {
      errors.hospitalAffiliation = 'Hospital/Clinic affiliation is required'
    }

    if (!validateRequired(formData.experience)) {
      errors.experience = 'Please select your experience level'
    }

    if (!validateRequired(formData.qualifications)) {
      errors.qualifications = 'Please list your qualifications'
    }

    if (!validateRequired(formData.clinicAddress)) {
      errors.clinicAddress = 'Clinic/Hospital address is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      // Generate unique request ID
      const requestId = `req${Math.floor(Math.random() * 1000) + 100}`
      
      const doctorApplication = {
        id: requestId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: specialtyOptions.find(s => s.value === formData.specialty)?.label || formData.specialty,
        licenseNumber: formData.licenseNumber,
        hospitalAffiliation: formData.hospitalAffiliation,
        experience: formData.experience,
        qualifications: formData.qualifications,
        clinicAddress: formData.clinicAddress,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }

      // Add to pending requests (in real app, this would be an API call)
      // For now, we'll simulate the submission
      setTimeout(() => {
        dispatch(addDoctorRequest(doctorApplication))
        console.log('Doctor application submitted:', doctorApplication)
        setLoading(false)
        setSubmitted(true)
      }, 2000)
      
    } catch (error) {
      setLoading(false)
      console.error('Application submission error:', error)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-green-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Your application will be reviewed by our admin team</li>
                    <li>• We'll verify your credentials and medical license</li>
                    <li>• You'll receive login credentials via email within 2-3 business days</li>
                    <li>• Once approved, you can access the doctor dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>Application ID:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-gray-600">
                Please save this ID for your records. You can check your application status by contacting our support team.
              </p>
              <div className="pt-6 space-y-3">
                <Link
                  to="/doctor/login"
                  className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Go to Doctor Login
                </Link>
                <Link
                  to="/"
                  className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/doctor/login" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctor Login
          </Link>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Doctor Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Apply to join our medical network. All applications are reviewed by our admin team.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Dr. John Smith"
                  required
                  error={formErrors.name}
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@email.com"
                  required
                  error={formErrors.email}
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1-555-0123"
                  required
                  error={formErrors.phone}
                />

                <FormInput
                  label="Medical License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="MD123456"
                  required
                  error={formErrors.licenseNumber}
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
                Professional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Medical Specialty"
                  name="specialty"
                  type="select"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="Select your specialty"
                  required
                  error={formErrors.specialty}
                  options={specialtyOptions}
                />

                <FormInput
                  label="Years of Experience"
                  name="experience"
                  type="select"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Select experience level"
                  required
                  error={formErrors.experience}
                  options={experienceOptions}
                />

                <FormInput
                  label="Hospital/Clinic Affiliation"
                  name="hospitalAffiliation"
                  value={formData.hospitalAffiliation}
                  onChange={handleInputChange}
                  placeholder="City General Hospital"
                  required
                  error={formErrors.hospitalAffiliation}
                />

                <FormInput
                  label="Medical Qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="MD, MBBS, etc."
                  required
                  error={formErrors.qualifications}
                />
              </div>

              <FormInput
                label="Clinic/Hospital Address"
                name="clinicAddress"
                type="textarea"
                rows={3}
                value={formData.clinicAddress}
                onChange={handleInputChange}
                placeholder="Enter complete address of your practice location"
                required
                error={formErrors.clinicAddress}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="border-t pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Important Notes</h4>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• All information will be verified before account approval</li>
                      <li>• You'll receive login credentials via email after verification</li>
                      <li>• Processing time is typically 2-3 business days</li>
                      <li>• Ensure all information is accurate and up-to-date</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <Link
                to="/doctor/login"
                className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                {loading ? (
                  <LoadingSpinner size="sm" text="Submitting Application..." />
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorSignup