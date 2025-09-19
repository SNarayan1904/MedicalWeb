import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { LogOut, User, Stethoscope } from 'lucide-react'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, role } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'doctor': return 'Doctor'
      case 'patient': return 'Patient'
      default: return ''
    }
  }

  const getRoleIcon = () => {
    switch (role) {
      case 'admin': return <User className="w-5 h-5" />
      case 'doctor': return <Stethoscope className="w-5 h-5" />
      case 'patient': return <User className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Stethoscope className="w-8 h-8 text-medical-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">
              SEEDHE HOSPITAL
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              {getRoleIcon()}
              <span className="font-medium">{user?.name || user?.email}</span>
              <span className="text-gray-500">•</span>
              <span className="text-medical-600">{getRoleLabel()}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar