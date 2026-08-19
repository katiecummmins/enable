import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useVisit } from '../state/VisitContext'

const STEPS = [
  { step: 1, path: 'setup', label: 'Pre-Visit Setup' },
  { step: 2, path: 'capture', label: 'Capture' },
  { step: 3, path: 'documentation', label: 'Documentation & Coding' },
  { step: 4, path: 'followup', label: 'Follow-Up' },
]

export default function FlowLayout() {
  const { patientId } = useParams()
  const { getPatient, getVisit, ensureVisit } = useVisit()
  const navigate = useNavigate()
  const location = useLocation()
  const patient = getPatient(patientId)
  const visit = getVisit(patientId)

  useEffect(() => {
    if (patient && !visit) ensureVisit(patientId)
  }, [patient, visit, patientId, ensureVisit])

  if (!patient) {
    return (
      <div className="page">
        <p>Unknown patient.</p>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  if (!visit) return null

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
          <span className="brand-mark">EN</span>
          <span className="brand-name">Enable</span>
        </div>
        <div className="header-patient">
          <span className="header-patient-name">{patient.name}</span>
          <span className="header-patient-meta">DOB {patient.dob || '—'}</span>
        </div>
        <Link to="/" className="exit-link">Exit visit</Link>
      </header>

      <nav className="stepper" aria-label="Visit progress">
        {STEPS.map(({ step, path, label }) => {
          const reachable = step <= visit.maxStep
          const isCurrent = location.pathname.endsWith(path)
          return (
            <button
              key={path}
              type="button"
              className={
                'stepper-item' +
                (isCurrent ? ' is-current' : '') +
                (reachable ? ' is-reachable' : ' is-locked')
              }
              disabled={!reachable}
              onClick={() => navigate(`/visit/${patientId}/${path}`)}
            >
              <span className="stepper-index">{step}</span>
              <span className="stepper-label">{label}</span>
            </button>
          )
        })}
      </nav>

      <main className="page">
        <Outlet />
      </main>
    </div>
  )
}
