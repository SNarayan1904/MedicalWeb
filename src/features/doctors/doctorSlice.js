import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  doctors: [
    {
      id: 'doc001',
      name: 'Dr. Sarah Johnson',
      email: 'doctor@hospital.com', // Match the login credential
      specialty: 'Cardiology',
      phone: '+1-555-0123',
      status: 'approved',
      licenseNumber: 'MD123456',
      hospitalAffiliation: 'City General Hospital',
      experience: '10-15 years',
      qualifications: 'MD, FACC',
      clinicAddress: '123 Medical Center Dr, Healthcare District',
      availability: [
        { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'Tuesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'Wednesday', slots: ['09:00', '10:00', '11:00'] },
        { day: 'Thursday', slots: ['14:00', '15:00', '16:00'] },
        { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00'] }
      ],
      credentials: {
        email: 'doctor@hospital.com',
        password: 'doctor123'
      }
    },
    {
      id: 'doc002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      specialty: 'Neurology',
      phone: '+1-555-0124',
      status: 'approved',
      licenseNumber: 'MD789012',
      hospitalAffiliation: 'City General Hospital',
      experience: '15+ years',
      qualifications: 'MD, PhD, FAAN',
      clinicAddress: '456 Neurology Wing, Medical Center',
      availability: [
        { day: 'Monday', slots: ['10:00', '11:00', '15:00', '16:00'] },
        { day: 'Tuesday', slots: ['09:00', '10:00', '14:00', '15:00'] },
        { day: 'Wednesday', slots: ['11:00', '14:00', '15:00', '16:00'] },
        { day: 'Thursday', slots: ['09:00', '10:00', '11:00', '14:00'] },
        { day: 'Friday', slots: ['10:00', '11:00', '15:00', '16:00'] }
      ],
      credentials: {
        email: 'michael.chen@hospital.com',
        password: 'chen123'
      }
    },
    {
      id: 'doc003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      specialty: 'Pediatrics',
      phone: '+1-555-0125',
      status: 'approved',
      licenseNumber: 'MD345678',
      hospitalAffiliation: 'Children\'s Hospital Wing',
      experience: '5-10 years',
      qualifications: 'MD, Board Certified Pediatrics',
      clinicAddress: '789 Pediatrics Department, Medical Center',
      availability: [
        { day: 'Monday', slots: ['08:00', '09:00', '10:00', '11:00', '14:00'] },
        { day: 'Tuesday', slots: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
        { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'Thursday', slots: ['08:00', '09:00', '10:00', '11:00'] },
        { day: 'Friday', slots: ['08:00', '09:00', '14:00', '15:00'] }
      ],
      credentials: {
        email: 'emily.rodriguez@hospital.com',
        password: 'emily123'
      }
    }
  ],
  pendingRequests: [
    {
      id: 'req001',
      name: 'Dr. James Wilson',
      email: 'james.wilson@email.com',
      specialty: 'Orthopedics',
      phone: '+1-555-0126',
      licenseNumber: 'MD901234',
      hospitalAffiliation: 'Sports Medicine Center',
      experience: '10-15 years',
      qualifications: 'MD, Orthopedic Surgery Board Certified',
      clinicAddress: '321 Sports Medicine Dr, Athletic District',
      submittedAt: '2024-01-15T10:30:00Z',
      status: 'pending'
    },
    {
      id: 'req002',
      name: 'Dr. Lisa Thompson',
      email: 'lisa.thompson@email.com',
      specialty: 'Dermatology',
      phone: '+1-555-0127',
      licenseNumber: 'MD567890',
      hospitalAffiliation: 'Skin Care Clinic',
      experience: '5-10 years',
      qualifications: 'MD, Dermatology Board Certified',
      clinicAddress: '654 Dermatology Center, Medical Plaza',
      submittedAt: '2024-01-16T14:20:00Z',
      status: 'pending'
    }
  ],
  loading: false,
  error: null
}

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addDoctor: (state, action) => {
      state.doctors.push(action.payload)
    },
    addDoctorRequest: (state, action) => {
      state.pendingRequests.push(action.payload)
    },
    updateDoctorAvailability: (state, action) => {
      const { doctorId, availability } = action.payload
      const doctor = state.doctors.find(doc => doc.id === doctorId)
      if (doctor) {
        doctor.availability = availability
      }
    },
    approveDoctorRequest: (state, action) => {
      const { requestId, doctor } = action.payload
      
      console.log('Approving doctor request:', { requestId, doctor })
      
      // Remove from pending requests
      const requestIndex = state.pendingRequests.findIndex(req => req.id === requestId)
      if (requestIndex !== -1) {
        state.pendingRequests.splice(requestIndex, 1)
      }
      
      // Add to approved doctors
      state.doctors.push({
        ...doctor,
        status: 'approved',
        createdAt: new Date().toISOString()
      })
    },
    rejectDoctorRequest: (state, action) => {
      const requestId = action.payload
      const requestIndex = state.pendingRequests.findIndex(req => req.id === requestId)
      if (requestIndex !== -1) {
        state.pendingRequests.splice(requestIndex, 1)
      }
    }
  }
})

export const {
  setLoading,
  setError,
  addDoctor,
  addDoctorRequest,
  updateDoctorAvailability,
  approveDoctorRequest,
  rejectDoctorRequest
} = doctorSlice.actions

export default doctorSlice.reducer