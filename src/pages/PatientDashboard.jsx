import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAppointment } from '../features/appointments/appointmentSlice'
import { updateMedicineTracker } from '../features/patients/patientSlice'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Modal from '../components/Modal'
import FormInput from '../components/FormInput'
import { Calendar, Clock, Pill, User, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { generateAppointmentId, formatTime, formatDate, getTodayDate } from '../utils/mockData'

const PatientDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { doctors } = useSelector((state) => state.doctors)
  const { appointments } = useSelector((state) => state.appointments)
  const { prescriptions, medicineTracker } = useSelector((state) => state.patients)

  const [activeTab, setActiveTab] = useState('appointments')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  })

  // Get patient-specific data
  const patientAppointments = appointments.filter(apt => apt.patientId === user?.id)
  const patientPrescriptions = prescriptions.filter(presc => presc.patientId === user?.id)
  const todayDate = getTodayDate()
  const todayTracker = medicineTracker[user?.id]?.[todayDate] || {}

  // Filter appointments
  const upcomingAppointments = patientAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status === 'scheduled'
  )
  const pastAppointments = patientAppointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  )

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getAvailableSlots = () => {
    if (!bookingForm.doctorId || !bookingForm.date) return []
    
    const doctor = doctors.find(doc => doc.id === bookingForm.doctorId)
    if (!doctor?.availability) return []

    const selectedDate = new Date(bookingForm.date)
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
    
    const dayAvailability = doctor.availability.find(avail => avail.day === dayName)
    if (!dayAvailability) return []

    // Filter out already booked slots
    const bookedSlots = appointments
      .filter(apt => apt.doctorId === bookingForm.doctorId && apt.date === bookingForm.date)
      .map(apt => apt.time)

    return dayAvailability.slots.filter(slot => !bookedSlots.includes(slot))
  }

  const handleBookAppointment = () => {
    if (!bookingForm.doctorId || !bookingForm.date || !bookingForm.time || !bookingForm.reason) {
      alert('Please fill in all fields')
      return
    }

    const doctor = doctors.find(doc => doc.id === bookingForm.doctorId)
    const newAppointment = {
      id: generateAppointmentId(),
      patientId: user.id,
      patientName: user.name,
      doctorId: bookingForm.doctorId,
      doctorName: doctor.name,
      date: bookingForm.date,
      time: bookingForm.time,
      type: 'Consultation',
      status: 'scheduled',
      reason: bookingForm.reason,
      notes: '',
      bookedAt: new Date().toISOString()
    }

    dispatch(addAppointment(newAppointment))
    setShowBookingModal(false)
    setBookingForm({ doctorId: '', date: '', time: '', reason: '' })
  }

  const handleMedicineToggle = (medicine, timing, taken) => {
    const medicineKey = `${medicine.name}-${timing}`
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    dispatch(updateMedicineTracker({
      patientId: user.id,
      date: todayDate,
      medicineKey,
      taken,
      time: taken ? currentTime : null
    }))
  }

  const getTodayMedicines = () => {
    const todayMedicines = []
    patientPrescriptions.forEach(prescription => {
      prescription.medicines.forEach(medicine => {
        medicine.timings.forEach(timing => {
          const medicineKey = `${medicine.name}-${timing}`
          const trackerData = todayTracker[medicineKey] || { taken: false, time: null }
          
          todayMedicines.push({
            ...medicine,
            timing,
            medicineKey,
            taken: trackerData.taken,
            takenTime: trackerData.time,
            prescriptionDate: prescription.date,
            doctorName: prescription.doctorName
          })
        })
      })
    })
    
    return todayMedicines.sort((a, b) => a.timing.localeCompare(b.timing))
  }

  const getMissedCount = () => {
    const currentTime = new Date().toTimeString().slice(0, 5)
    return getTodayMedicines().filter(med => 
      !med.taken && med.timing < currentTime
    ).length
  }

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'tracker', label: 'Medicine Tracker', icon: CheckCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
          <p className="text-sm text-gray-500">Patient ID: {user?.id}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</h3>
            <p className="text-sm text-gray-600">Upcoming Appointments</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{patientPrescriptions.length}</h3>
            <p className="text-sm text-gray-600">Active Prescriptions</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {getTodayMedicines().filter(med => med.taken).length}
            </h3>
            <p className="text-sm text-gray-600">Medicines Taken Today</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{getMissedCount()}</h3>
            <p className="text-sm text-gray-600">Missed Doses</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-medical-500 text-medical-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">My Appointments</h2>
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Upcoming Appointments */}
            <Card title="Upcoming Appointments" subtitle={`${upcomingAppointments.length} scheduled`}>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="mt-4 btn btn-primary"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <Card title="Past Appointments" subtitle={`${pastAppointments.length} completed`}>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <Card title="My Prescriptions" subtitle={`${patientPrescriptions.length} active prescriptions`}>
            {patientPrescriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No prescriptions found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {patientPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-600">Prescribed by {prescription.doctorName}</p>
                        <p className="text-sm text-gray-500">Date: {formatDate(prescription.date)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                              <p className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</p>
                              <p className="text-sm text-gray-600">Duration: {medicine.duration}</p>
                              <p className="text-sm text-gray-500 mt-1">{medicine.instructions}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Timings:</p>
                              <div className="space-y-1">
                                {medicine.timings.map((timing, timingIndex) => (
                                  <span
                                    key={timingIndex}
                                    className="inline-block px-2 py-1 bg-medical-100 text-medical-800 text-xs rounded-full mr-1"
                                  >
                                    {formatTime(timing)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'tracker' && (
          <Card title="Today's Medicine Tracker" subtitle={`${formatDate(todayDate)} - Track your daily medicines`}>
            {getTodayMedicines().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medicines scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getTodayMedicines().map((medicine, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    medicine.taken ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                        <p className="text-sm text-gray-600">{medicine.dosage} at {formatTime(medicine.timing)}</p>
                        <p className="text-xs text-gray-500">Prescribed by {medicine.doctorName}</p>
                        <p className="text-xs text-gray-500">{medicine.instructions}</p>
                        {medicine.taken && medicine.takenTime && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Taken at {medicine.takenTime}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMedicineToggle(medicine, medicine.timing, !medicine.taken)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            medicine.taken 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {medicine.taken ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              <span>Taken</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              <span>Mark as Taken</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Appointment Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book New Appointment"
        size="lg"
      >
        <div className="space-y-4">
          <FormInput
            label="Select Doctor"
            name="doctorId"
            type="select"
            value={bookingForm.doctorId}
            onChange={handleBookingChange}
            placeholder="Choose a doctor"
            required
            options={doctors.map(doctor => ({
              value: doctor.id,
              label: `${doctor.name} - ${doctor.specialty}`
            }))}
          />

          <FormInput
            label="Appointment Date"
            name="date"
            type="date"
            value={bookingForm.date}
            onChange={handleBookingChange}
            required
            min={getTodayDate()}
          />

          {bookingForm.doctorId && bookingForm.date && (
            <FormInput
              label="Available Time Slots"
              name="time"
              type="select"
              value={bookingForm.time}
              onChange={handleBookingChange}
              placeholder="Choose a time slot"
              required
              options={getAvailableSlots().map(slot => ({
                value: slot,
                label: formatTime(slot)
              }))}
            />
          )}

          <FormInput
            label="Reason for Visit"
            name="reason"
            type="textarea"
            value={bookingForm.reason}
            onChange={handleBookingChange}
            placeholder="Describe your symptoms or reason for the appointment"
            required
            rows={3}
          />

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowBookingModal(false)}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleBookAppointment}
              className="flex-1 btn btn-primary"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PatientDashboard