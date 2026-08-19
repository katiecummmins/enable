import { useNavigate, useParams } from 'react-router-dom'
import { useVisit } from '../state/VisitContext'

export default function Setup() {
  const { patientId } = useParams()
  const { getVisit, updateSection, advanceMaxStep } = useVisit()
  const navigate = useNavigate()
  const visit = getVisit(patientId)
  if (!visit) return null

  const { patient, hearingTest, history } = visit

  function setHearingTest(patch) {
    updateSection(patientId, 'hearingTest', patch)
  }
  function setHistory(patch) {
    updateSection(patientId, 'history', patch)
  }

  function continueToCapture() {
    advanceMaxStep(patientId, 2)
    navigate(`/visit/${patientId}/capture`)
  }

  return (
    <div className="screen">
      <div className="screen-head">
        <h1>Pre-Visit Setup</h1>
        <p className="screen-sub">
          Confirm the patient profile and prior clinical context before the demonstration. This is
          what Enable prepares — nothing here runs the demo.
        </p>
      </div>

      <section className="card">
        <h2>Patient Profile</h2>
        <div className="field-grid">
          <div className="field">
            <span className="field-label">Name</span>
            <span className="field-value">{patient.name}</span>
          </div>
          <div className="field">
            <span className="field-label">Date of birth</span>
            <span className="field-value">{patient.dob || '—'}</span>
          </div>
          <div className="field">
            <span className="field-label">Phone</span>
            <span className="field-value">{patient.phone || '—'}</span>
          </div>
          <div className="field">
            <span className="field-label">Clinic demo mode</span>
            <span className="field-value">
              {patient.engageEnabled ? 'Engage enabled' : 'Manual capture (no Engage)'}
            </span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Hearing Test Results</h2>
        <div className="field-grid">
          <label className="field-input">
            Test date
            <input
              type="date"
              value={hearingTest.date}
              onChange={(e) => setHearingTest({ date: e.target.value })}
            />
          </label>
          <label className="field-input">
            Test type
            <input
              type="text"
              value={hearingTest.testType}
              onChange={(e) => setHearingTest({ testType: e.target.value })}
              placeholder="e.g. Comprehensive audiometric evaluation"
            />
          </label>
          <label className="field-input">
            Right ear PTA (dB)
            <input
              type="text"
              value={hearingTest.rightPTA}
              onChange={(e) => setHearingTest({ rightPTA: e.target.value })}
              placeholder="e.g. 42"
            />
          </label>
          <label className="field-input">
            Left ear PTA (dB)
            <input
              type="text"
              value={hearingTest.leftPTA}
              onChange={(e) => setHearingTest({ leftPTA: e.target.value })}
              placeholder="e.g. 47"
            />
          </label>
          <label className="field-input">
            Speech discrimination (%)
            <input
              type="text"
              value={hearingTest.speechDiscrimination}
              onChange={(e) => setHearingTest({ speechDiscrimination: e.target.value })}
              placeholder="e.g. 88"
            />
          </label>
        </div>
        <label className="field-input field-input-wide">
          Audiologist notes
          <textarea
            rows={3}
            value={hearingTest.notes}
            onChange={(e) => setHearingTest({ notes: e.target.value })}
            placeholder="Summary of loss type, severity, and configuration"
          />
        </label>
      </section>

      <section className="card">
        <h2>Relevant History</h2>
        <div className="checkbox-group">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={history.priorHearingAidUse}
              onChange={(e) => setHistory({ priorHearingAidUse: e.target.checked })}
            />
            Prior hearing aid use
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={history.tinnitus}
              onChange={(e) => setHistory({ tinnitus: e.target.checked })}
            />
            Reports tinnitus
          </label>
        </div>
        <label className="field-input field-input-wide">
          Other relevant conditions
          <input
            type="text"
            value={history.otherConditions}
            onChange={(e) => setHistory({ otherConditions: e.target.value })}
            placeholder="e.g. Dexterity or vision considerations"
          />
        </label>
        <label className="field-input field-input-wide">
          Notes for this visit
          <textarea
            rows={3}
            value={history.notes}
            onChange={(e) => setHistory({ notes: e.target.value })}
            placeholder="Anything the clinician should know going into the demo"
          />
        </label>
      </section>

      <div className="screen-actions">
        <button className="btn btn-primary" onClick={continueToCapture}>
          Continue to Capture &rarr;
        </button>
      </div>
    </div>
  )
}
