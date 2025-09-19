import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  appointments: [
    // Today's scheduled appointments
    {
      id: 'apt001',
      patientId: 'PAT001',
      patientName: 'John Smith',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      date: new Date().toISOString().split('T')[0], // Today
      time: '10:00',
      type: 'Consultation',
      status: 'scheduled',
      reason: 'Follow-up for hypertension medication',
      notes: ''
    },
    {
      id: 'apt002',
      patientId: 'PAT002',
      patientName: 'Mary Wilson',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      date: new Date().toISOString().split('T')[0], // Today
      time: '11:00',
      type: 'Consultation',
      status: 'scheduled',
      reason: 'Chest pain evaluation',
      notes: ''
    },
    // Upcoming appointments
    {
      id: 'apt003',
      patientId: 'PAT001',
      patientName: 'John Smith',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-01-25',
      time: '15:00',
      type: 'Consultation',
      status: 'scheduled',
      reason: 'Neurological consultation for headaches',
      notes: ''
    },
    {
      id: 'apt004',
      patientId: 'PAT003',
      patientName: 'David Brown',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-26',
      time: '09:00',
      type: 'Check-up',
      status: 'scheduled',
      reason: 'Annual cardiac screening',
      notes: ''
    },
    // Completed appointments (past dates)
    {
      id: 'apt005',
      patientId: 'PAT001',
      patientName: 'John Smith',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-10',
      time: '14:00',
      type: 'Consultation',
      status: 'completed',
      reason: 'Initial hypertension diagnosis',
      notes: 'Blood pressure 150/95. Prescribed Lisinopril 10mg daily. Follow-up in 2 weeks.'
    },
    {
      id: 'apt006',
      patientId: 'PAT001',
      patientName: 'John Smith',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-01-08',
      time: '16:00',
      type: 'Consultation',
      status: 'completed',
      reason: 'Persistent headaches',
      notes: 'Tension headaches. Prescribed Ibuprofen. Stress management recommended.'
    },
    {
      id: 'apt007',
      patientId: 'PAT002',
      patientName: 'Mary Wilson',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-01-12',
      time: '11:00',
      type: 'Check-up',
      status: 'completed',
      reason: 'Routine cardiac check-up',
      notes: 'Normal ECG. Blood pressure stable. Continue current medication.'
    },
    {
      id: 'apt008',
      patientId: 'PAT003',
      patientName: 'David Brown',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-01-05',
      time: '10:30',
      type: 'Consultation',
      status: 'completed',
      reason: 'Memory concerns',
      notes: 'Cognitive assessment normal. Vitamin B12 deficiency found. Started supplements.'
    },
    // Cancelled appointments
    {
      id: 'apt009',
      patientId: 'PAT002',
      patientName: 'Mary Wilson',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      date: '2024-01-15',
      time: '13:00',
      type: 'Consultation',
      status: 'cancelled',
      reason: 'Neurological consultation',
      notes: 'Patient cancelled due to scheduling conflict'
    },
    {
  id: 'apt010',
  patientId: 'PAT002',
  patientName: 'Mary Wilson',
  doctorId: 'doc002',
  doctorName: 'Dr. Michael Chen',
  date: new Date().toISOString().split('T')[0], // Today
  time: '14:00',
  type: 'Consultation',
  status: 'scheduled',
  reason: 'Follow-up neurological assessment',
  notes: ''
},
{
  id: 'apt011',
  patientId: 'PAT003',
  patientName: 'David Brown',
  doctorId: 'doc002',
  doctorName: 'Dr. Michael Chen',
  date: new Date().toISOString().split('T')[0], // Today
  time: '15:00',
  type: 'Check-up',
  status: 'scheduled',
  reason: 'Memory improvement follow-up',
  notes: ''
},
// Appointments for Dr. Emily Rodriguez (doc003)
{
  id: 'apt012',
  patientId: 'PAT001',
  patientName: 'John Smith',
  doctorId: 'doc003',
  doctorName: 'Dr. Emily Rodriguez',
  date: new Date().toISOString().split('T')[0], // Today
  time: '09:00',
  type: 'Consultation',
  status: 'scheduled',
  reason: 'General health consultation',
  notes: ''
},
// More completed appointments
{
  id: 'apt013',
  patientId: 'PAT002',
  patientName: 'Mary Wilson',
  doctorId: 'doc002',
  doctorName: 'Dr. Michael Chen',
  date: '2024-01-11',
  time: '11:00',
  type: 'Consultation',
  status: 'completed',
  reason: 'Neurological assessment',
  notes: 'No abnormalities found. Recommended lifestyle changes for stress management.'
},
{
  id: 'apt014',
  patientId: 'PAT003',
  patientName: 'David Brown',
  doctorId: 'doc003',
  doctorName: 'Dr. Emily Rodriguez',
  date: '2024-01-09',
  time: '14:00',
  type: 'Check-up',
  status: 'completed',
  reason: 'General wellness check',
  notes: 'All vitals normal for age. Continue current supplements.'
}
  ],
  loading: false,
  error: null
}

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload)
    },
    updateAppointmentStatus: (state, action) => {
      const { appointmentId, status, notes } = action.payload
      const appointment = state.appointments.find(apt => apt.id === appointmentId)
      if (appointment) {
        appointment.status = status
        if (notes) appointment.notes = notes
      }
    },
    cancelAppointment: (state, action) => {
      const appointmentId = action.payload
      const appointment = state.appointments.find(apt => apt.id === appointmentId)
      if (appointment) {
        appointment.status = 'cancelled'
      }
    }
  }
})

export const {
  setLoading,
  setError,
  addAppointment,
  updateAppointmentStatus,
  cancelAppointment
} = appointmentSlice.actions

export default appointmentSlice.reducer