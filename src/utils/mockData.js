export const generatePatientId = () => {
  const prefix = 'PAT'
  const number = Math.floor(Math.random() * 9000) + 1000 // 4-digit number
  return `${prefix}${number}`
}

export const generateDoctorId = () => {
  const prefix = 'doc'
  const number = Math.floor(Math.random() * 900) + 100 // 3-digit number
  return `${prefix}${number}`
}

export const generateAppointmentId = () => {
  const prefix = 'apt'
  const number = Math.floor(Math.random() * 9000) + 1000 // 4-digit number
  return `${prefix}${number}`
}

export const generatePrescriptionId = () => {
  const prefix = 'presc'
  const number = Math.floor(Math.random() * 9000) + 1000 // 4-digit number
  return `${prefix}${number}`
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

export const getTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 60) {
      if (hour === 17 && minute > 0) break // Don't go past 17:00
      if (hour === 13) continue // Skip 1 PM (lunch break)
      
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push(timeString)
    }
  }
  return slots
}

export const getDaysOfWeek = () => {
  return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
}