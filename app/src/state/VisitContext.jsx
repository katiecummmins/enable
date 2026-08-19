import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedPatients } from '../lib/mockData'

const STORAGE_KEY = 'enable_prototype_state_v1'

const VisitContext = createContext(null)

function emptyVisit(patient) {
  return {
    patient: {
      id: patient.id,
      name: patient.name,
      dob: patient.dob,
      phone: patient.phone,
      engageEnabled: patient.engageEnabled,
    },
    hearingTest: { ...patient.hearingTest },
    history: { ...patient.history },
    capture: {
      mode: patient.engageEnabled ? 'engage' : 'manual',
      engageSynced: false,
      engageAutoData: null,
      productsDemonstrated: [],
      environmentsTested: '',
      patientResponse: '',
      outcome: '',
      demoNotes: '',
    },
    documentation: {
      visitDurationMinutes: '',
      productsDemonstrated: [],
      attestedBy: '',
      attested: false,
      patientResponseSummary: '',
      codeNotes: '',
    },
    followUp: {
      nextStep: '',
      followUpDate: '',
      notes: '',
    },
    maxStep: 1,
  }
}

function loadInitialState() {
  const patients = {}
  seedPatients.forEach((p) => {
    patients[p.id] = p
  })

  let visits = {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      visits = parsed.visits || {}
      if (parsed.patients) {
        Object.assign(patients, parsed.patients)
      }
    }
  } catch {
    // ignore corrupt storage in a prototype
  }

  return { patients, visits }
}

export function VisitProvider({ children }) {
  const [{ patients, visits }, setState] = useState(loadInitialState)

  useEffect(() => {
    const customPatients = {}
    Object.values(patients).forEach((p) => {
      if (!seedPatients.find((sp) => sp.id === p.id)) customPatients[p.id] = p
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ visits, patients: customPatients }))
  }, [visits, patients])

  const api = useMemo(
    () => ({
      patientList: Object.values(patients),

      getPatient(patientId) {
        return patients[patientId]
      },

      addPatient(patient) {
        setState((s) => ({ ...s, patients: { ...s.patients, [patient.id]: patient } }))
      },

      getVisit(patientId) {
        return visits[patientId]
      },

      ensureVisit(patientId) {
        setState((s) => {
          if (s.visits[patientId]) return s
          const patient = s.patients[patientId]
          if (!patient) return s
          return { ...s, visits: { ...s.visits, [patientId]: emptyVisit(patient) } }
        })
      },

      updateSection(patientId, section, patch) {
        setState((s) => {
          const visit = s.visits[patientId]
          if (!visit) return s
          return {
            ...s,
            visits: {
              ...s.visits,
              [patientId]: {
                ...visit,
                [section]: { ...visit[section], ...patch },
              },
            },
          }
        })
      },

      advanceMaxStep(patientId, step) {
        setState((s) => {
          const visit = s.visits[patientId]
          if (!visit || visit.maxStep >= step) return s
          return {
            ...s,
            visits: { ...s.visits, [patientId]: { ...visit, maxStep: step } },
          }
        })
      },

      resetVisit(patientId) {
        setState((s) => {
          const patient = s.patients[patientId]
          if (!patient) return s
          return { ...s, visits: { ...s.visits, [patientId]: emptyVisit(patient) } }
        })
      },
    }),
    [patients, visits],
  )

  return <VisitContext.Provider value={api}>{children}</VisitContext.Provider>
}

export function useVisit() {
  const ctx = useContext(VisitContext)
  if (!ctx) throw new Error('useVisit must be used within a VisitProvider')
  return ctx
}
