import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVisit } from '../state/VisitContext'

export default function Home() {
  const { patientList, addPatient, ensureVisit } = useVisit()
  const navigate = useNavigate()
  const [showNewPatient, setShowNewPatient] = useState(false)
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [engageEnabled, setEngageEnabled] = useState(true)

  function startVisit(patientId) {
    ensureVisit(patientId)
    navigate(`/visit/${patientId}/setup`)
  }

  function createPatient(e) {
    e.preventDefault()
    if (!name.trim()) return
    const id = 'p-' + name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36)
    const patient = {
      id,
      name: name.trim(),
      dob,
      phone: '',
      engageEnabled,
      hearingTest: { date: '', testType: '', rightPTA: '', leftPTA: '', speechDiscrimination: '', notes: '' },
      history: { priorHearingAidUse: false, tinnitus: false, otherConditions: '', notes: '' },
    }
    addPatient(patient)
    startVisit(id)
  }

  return (
    <div className="page home">
      <div className="home-hero">
        <div className="brand brand-lg">
          <span className="brand-mark">EN</span>
          <span className="brand-name">Enable</span>
        </div>
        <p className="home-tagline">
          Sales enablement for hearing demonstration visits. Enable handles pre-visit setup,
          capture, and insurance-code documentation — it does not run the demo itself. That's
          Engage, a separate product. Clinics can use Enable with or without it.
        </p>
        <p className="home-subtagline">Prototype — click a patient below to walk through a full visit.</p>
      </div>

      <div className="patient-grid">
        {patientList.map((p) => (
          <div className="patient-card" key={p.id}>
            <div className="patient-card-top">
              <h3>{p.name}</h3>
              <span className={'badge ' + (p.engageEnabled ? 'badge-engage' : 'badge-manual')}>
                {p.engageEnabled ? 'Engage-enabled clinic' : 'Manual capture clinic'}
              </span>
            </div>
            <dl className="patient-card-meta">
              <div>
                <dt>DOB</dt>
                <dd>{p.dob || '—'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{p.phone || '—'}</dd>
              </div>
            </dl>
            <button className="btn btn-primary" onClick={() => startVisit(p.id)}>
              Start visit &rarr;
            </button>
          </div>
        ))}

        <div className="patient-card patient-card-new">
          {!showNewPatient ? (
            <button className="btn btn-ghost" onClick={() => setShowNewPatient(true)}>
              + New patient
            </button>
          ) : (
            <form onSubmit={createPatient} className="new-patient-form">
              <label>
                Patient name
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" autoFocus />
              </label>
              <label>
                Date of birth
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={engageEnabled}
                  onChange={(e) => setEngageEnabled(e.target.checked)}
                />
                This clinic uses Engage for demos
              </label>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowNewPatient(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create &amp; start
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
