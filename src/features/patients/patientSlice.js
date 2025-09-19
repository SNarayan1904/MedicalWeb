import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  patients: [
    {
      id: 'PAT001',
      name: 'John Smith',
      email: 'patient@email.com',
      password: 'patient123',
      phone: '+1-555-0101',
      dateOfBirth: '1985-06-15',
      address: '123 Main St, City, State 12345',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '+1-555-0102',
        relation: 'Spouse'
      },
      medicalHistory: [
        {
          date: '2024-01-10',
          diagnosis: 'Hypertension',
          doctor: 'Dr. Sarah Johnson',
          notes: 'Blood pressure elevated, prescribed medication. Patient should monitor BP daily.'
        },
        {
          date: '2024-01-08',
          diagnosis: 'Tension Headaches',
          doctor: 'Dr. Michael Chen',
          notes: 'Stress-related headaches. Recommended stress management and regular sleep schedule.'
        }
      ]
    },
    {
      id: 'PAT002',
      name: 'Mary Wilson',
      email: 'mary.wilson@email.com',
      password: 'mary123',
      phone: '+1-555-0201',
      dateOfBirth: '1978-03-22',
      address: '456 Oak Avenue, Downtown, State 54321',
      emergencyContact: {
        name: 'Robert Wilson',
        phone: '+1-555-0202',
        relation: 'Spouse'
      },
      medicalHistory: [
        {
          date: '2024-01-12',
          diagnosis: 'Routine Check-up',
          doctor: 'Dr. Sarah Johnson',
          notes: 'All vitals normal. Continue current heart medication.'
        }
      ]
    },
    {
      id: 'PAT003',
      name: 'David Brown',
      email: 'david.brown@email.com',
      password: 'david123',
      phone: '+1-555-0301',
      dateOfBirth: '1965-11-08',
      address: '789 Pine Street, Suburb, State 67890',
      emergencyContact: {
        name: 'Sarah Brown',
        phone: '+1-555-0302',
        relation: 'Daughter'
      },
      medicalHistory: [
        {
          date: '2024-01-05',
          diagnosis: 'Vitamin B12 Deficiency',
          doctor: 'Dr. Michael Chen',
          notes: 'Started B12 supplements. Memory concerns resolved with treatment.'
        }
      ]
    }
  ],
  currentPatient: null,
  prescriptions: [
    {
      id: 'presc001',
      patientId: 'PAT001',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      appointmentId: 'apt005',
      date: '2024-01-10',
      medicines: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with water, preferably in the morning. Monitor blood pressure.',
          timings: ['09:00']
        },
        {
          name: 'Amlodipine',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take in the evening with or without food.',
          timings: ['20:00']
        }
      ]
    },
    {
      id: 'presc002',
      patientId: 'PAT001',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      appointmentId: 'apt006',
      date: '2024-01-08',
      medicines: [
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'As needed',
          duration: '14 days',
          instructions: 'Take with food. Maximum 3 times daily for headache relief.',
          timings: ['08:00', '14:00', '20:00']
        }
      ]
    },
    {
      id: 'presc003',
      patientId: 'PAT002',
      doctorId: 'doc001',
      doctorName: 'Dr. Sarah Johnson',
      appointmentId: 'apt007',
      date: '2024-01-12',
      medicines: [
        {
          name: 'Metoprolol',
          dosage: '25mg',
          frequency: 'Twice daily',
          duration: '60 days',
          instructions: 'Take with meals. Do not stop suddenly.',
          timings: ['08:00', '20:00']
        }
      ]
    },
    {
      id: 'presc004',
      patientId: 'PAT003',
      doctorId: 'doc002',
      doctorName: 'Dr. Michael Chen',
      appointmentId: 'apt008',
      date: '2024-01-05',
      medicines: [
        {
          name: 'Vitamin B12',
          dosage: '1000mcg',
          frequency: 'Once daily',
          duration: '90 days',
          instructions: 'Take with breakfast. Continue for 3 months then recheck levels.',
          timings: ['08:00']
        }
      ]
    }
  ],
  medicineTracker: {
    'PAT001': {
      [new Date().toISOString().split('T')[0]]: { // Today
        'Lisinopril-09:00': { taken: true, time: '09:15' },
        'Amlodipine-20:00': { taken: false, time: null }
      },
      '2024-01-15': {
        'Lisinopril-09:00': { taken: true, time: '09:10' },
        'Amlodipine-20:00': { taken: true, time: '20:30' },
        'Ibuprofen-08:00': { taken: false, time: null },
        'Ibuprofen-14:00': { taken: true, time: '14:15' },
        'Ibuprofen-20:00': { taken: false, time: null }
      },
      '2024-01-14': {
        'Lisinopril-09:00': { taken: true, time: '09:05' },
        'Amlodipine-20:00': { taken: true, time: '20:00' },
        'Ibuprofen-08:00': { taken: true, time: '08:30' },
        'Ibuprofen-14:00': { taken: false, time: null },
        'Ibuprofen-20:00': { taken: true, time: '21:00' }
      }
    },
    'PAT002': {
      [new Date().toISOString().split('T')[0]]: { // Today
        'Metoprolol-08:00': { taken: true, time: '08:00' },
        'Metoprolol-20:00': { taken: false, time: null }
      }
    },
    'PAT003': {
      [new Date().toISOString().split('T')[0]]: { // Today
        'Vitamin B12-08:00': { taken: true, time: '08:15' }
      }
    }
  },
  loading: false,
  error: null
}

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload)
    },
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload
    },
    updateMedicineTracker: (state, action) => {
      const { patientId, date, medicineKey, taken, time } = action.payload
      
      if (!state.medicineTracker[patientId]) {
        state.medicineTracker[patientId] = {}
      }
      
      if (!state.medicineTracker[patientId][date]) {
        state.medicineTracker[patientId][date] = {}
      }
      
      state.medicineTracker[patientId][date][medicineKey] = { taken, time }
    },
    addPrescription: (state, action) => {
      state.prescriptions.push(action.payload)
    }
  }
})

export const {
  setLoading,
  setError,
  addPatient,
  setCurrentPatient,
  updateMedicineTracker,
  addPrescription
} = patientSlice.actions

export default patientSlice.reducer