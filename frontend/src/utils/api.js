import axios from 'axios'
import { getToken, logout } from './auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // 60s for AI operations
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Don't redirect if we're already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        logout()
      }
    }
    return Promise.reject(error)
  },
)

// --- Ambient Documentation ---

export async function transcribeAudio(file, language = 'en') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', language)
  const res = await api.post('/ambient/transcribe', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  })
  return res.data
}

export async function generateNote(transcript, patientId = null, encounterType = 'office_visit') {
  const res = await api.post('/ambient/generate-note', {
    transcript,
    patient_id: patientId,
    encounter_type: encounterType,
  })
  return res.data
}

export async function suggestCodes(noteText, encounterType = 'office_visit') {
  const res = await api.post('/ambient/suggest-codes', {
    note_text: noteText,
    encounter_type: encounterType,
  })
  return res.data
}

export async function getEncounters() {
  const res = await api.get('/ambient/encounters')
  return res.data
}

export async function getEncounter(encounterId) {
  const res = await api.get(`/ambient/encounters/${encounterId}`)
  return res.data
}

export async function updateNote(noteId, noteText, status = 'reviewed') {
  const res = await api.put(`/ambient/notes/${noteId}`, {
    note_text: noteText,
    status,
  })
  return res.data
}

// --- Virtual Nurse ---

export async function sendChatMessage(message, sessionId = null) {
  const res = await api.post('/nurse/chat', {
    message,
    session_id: sessionId,
  })
  return res.data
}

export async function getChatHistory(sessionId) {
  const res = await api.get(`/nurse/chat/${sessionId}/history`)
  return res.data
}

// --- Intake ---

export async function startIntake(patientId = null, appointmentReason = null) {
  const res = await api.post('/nurse/intake/start', {
    patient_id: patientId,
    appointment_reason: appointmentReason,
  })
  return res.data
}

export async function sendIntakeMessage(sessionId, message) {
  const res = await api.post(`/nurse/intake/${sessionId}/message`, { message })
  return res.data
}

// --- Triage ---

export async function assessTriage(symptoms, patientAge = null, patientSex = null, medicalHistory = [], currentMedications = []) {
  const res = await api.post('/nurse/triage', {
    symptoms,
    patient_age: patientAge,
    patient_sex: patientSex,
    medical_history: medicalHistory,
    current_medications: currentMedications,
  })
  return res.data
}

// --- Follow-up ---

export async function startFollowup(patientId, dischargeDate, followupType = '24hr', dischargeInstructions = null, medications = []) {
  const res = await api.post('/nurse/followup/start', {
    patient_id: patientId,
    discharge_date: dischargeDate,
    followup_type: followupType,
    discharge_instructions: dischargeInstructions,
    medications,
  })
  return res.data
}

export async function sendFollowupMessage(sessionId, message) {
  const res = await api.post(`/nurse/followup/${sessionId}/message`, { message })
  return res.data
}

// --- Dashboard ---

export async function getEscalations() {
  const res = await api.get('/nurse/dashboard/escalations')
  return res.data
}

export async function getActiveSessions() {
  const res = await api.get('/nurse/dashboard/active-sessions')
  return res.data
}

export async function getPatients() {
  const res = await api.get('/patients')
  return res.data
}

export async function healthCheck() {
  const res = await api.get('/health')
  return res.data
}

export async function seedDatabase() {
  const res = await api.post('/seed')
  return res.data
}

// --- Hospital Management (Super Admin) ---

export async function getHospitals() {
  const res = await api.get('/hospitals')
  return res.data
}

export async function createHospital(data) {
  const res = await api.post('/hospitals', data)
  return res.data
}

export async function getHospital(hospitalId) {
  const res = await api.get(`/hospitals/${hospitalId}`)
  return res.data
}

export async function updateHospital(hospitalId, data) {
  const res = await api.put(`/hospitals/${hospitalId}`, data)
  return res.data
}

export async function deleteHospital(hospitalId) {
  const res = await api.delete(`/hospitals/${hospitalId}`)
  return res.data
}

export async function getHospitalAdmins(hospitalId) {
  const res = await api.get(`/hospitals/${hospitalId}/admins`)
  return res.data
}

export async function createHospitalAdmin(hospitalId, data) {
  const res = await api.post(`/hospitals/${hospitalId}/admins`, data)
  return res.data
}

export default api
