import React from 'react'
import { Link } from 'react-router-dom'
import { Stethoscope, Shield, User, UserPlus, Calendar, Pill, Clock } from 'lucide-react'

const HomePage = () => {
  const userTypes = [
    {
      type: 'admin',
      title: 'Administrator',
      description: 'Manage doctors, oversee system operations',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      features: ['Doctor Management', 'System Oversight', 'User Approvals']
    },
    {
      type: 'doctor',
      title: 'Doctor',
      description: 'Manage appointments, view patient records',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      features: ['Appointment Management', 'Patient Records', 'Schedule Setting']
    },
    {
      type: 'patient',
      title: 'Patient',
      description: 'Book appointments, track medications',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      features: ['Book Appointments', 'Medicine Tracker', 'View Prescriptions']
    }
  ]

  const systemFeatures = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Advanced appointment booking with real-time availability'
    },
    {
      icon: Pill,
      title: 'Medicine Tracking',
      description: 'Track your daily medications with smart reminders'
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Access your health records and appointments anytime'
    }
  ]

  return (
    <div className="min-h-screen bg-[#00b4d8]">
      <header className="bg-[#90e0ef] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Stethoscope className="w-8 h-8 text-medical-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">SEEDHE HOSPITAL</h1>
            </div>
            <nav className="flex space-x-4">
              <Link to="/patient/signup" className="text-medical-600 hover:text-medical-700 font-medium">
                New Patient ?
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Health, Our <span className="text-medical-600">Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience seamless healthcare management with our comprehensive appointment system. 
            Connect with doctors, manage prescriptions, and take control of your health journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/patient/login" 
              className="bg-white text-medical-600 border-2 border-medical-600 px-8 py-4 rounded-lg font-semibold hover:bg-medical-50 transition-colors flex items-center justify-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Patient Login</span>
            </Link>
            <Link 
              to="/patient/signup" 
              className="bg-white text-medical-600 border-2 border-medical-600 px-8 py-4 rounded-lg font-semibold hover:bg-medical-50 transition-colors flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as Patient</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#00bbe1]">
        <div className="max-w-7xl mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Your Dashboard</h2>
            <p className="text-lg text-gray-600">Choose your role to access the appropriate dashboard</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((userType) => (
              <div key={userType.type} className="relative group">
                <div className={`bg-gradient-to-b ${userType.color}99 rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <userType.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{userType.title}</h3>
                  <p className="text-gray-600 mb-6">{userType.description}</p>
                  
                  <ul className="space-y-2 mb-8">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-medical-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={`/${userType.type}/login`}
                    className={`block w-full text-center bg-gradient-to-r ${userType.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    Login as {userType.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#d7d7d7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#871d1d] mb-4">Why Choose MedCare?</h2>
            <p className="text-lg text-gray-600">Powerful features designed for modern healthcare</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#000000] text-medical-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#000000] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="w-8 h-8 text-medical-400" />
            <h3 className="ml-2 text-xl font-bold">SEEDHE HOSPITAL</h3>
          </div>
          <p className="text-gray-400 mb-6">Transforming healthcare through technology</p>
          
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © 2025 SEEDHE HOSPITAL. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage