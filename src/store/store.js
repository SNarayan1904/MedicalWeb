import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/authSlice'
import doctorSlice from '../features/doctors/doctorSlice'
import patientSlice from '../features/patients/patientSlice'
import appointmentSlice from '../features/appointments/appointmentSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    doctors: doctorSlice,
    patients: patientSlice,
    appointments: appointmentSlice,
  },
})

export default store