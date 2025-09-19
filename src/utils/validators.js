export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateDateOfBirth = (dateOfBirth) => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  const age = today.getFullYear() - birthDate.getFullYear()
  
  return age >= 0 && age <= 120
}

export const validateAppointmentDate = (date) => {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return selectedDate >= today
}