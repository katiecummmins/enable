import { useNavigate, useParams } from 'react-router-dom'
import { useVisit } from '../state/VisitContext'
import { nextStepOptions, outcomeOptions, productCatalog } from '../lib/mockData'

function productName(id) {
  return productCatalog.find((p) => p.id === id)?.name || id
}

export default function FollowUp() {
  const { patientId } = useParams()
  const { getVisit, updateSection, resetVisit } = useVisit()
  const navigate = useNavigate()
  const visit = getVisit(patientId)
  if (!visit) return null

  const { followUp, capture, documentation, patient } = visit

  function setFollowUp(patch) {
    updateSection(patientId, 'followUp', patch)
  }

  function finish() {
    navigate('/')
  }

  function startNewVisit() {
    resetVisit(patientId)
    navigate(`/visit/${patientId}/setup`)
  }

  const outcomeLabel = outcomeOptions.find((o) => o.value === capture.outcome)?.label

  return (
    <div className="screen">
      <div className="screen-head">
        <h1>Follow-Up</h1>
        <p className="screen-sub">Decide next steps and review the full visit before closing it out.</p>
      </div>

      <section className="card">
        <h2>Next Step</h2>
        <label className="field-input field-input-wide">
          What happens next?
          <select value={followUp.nextStep} onChange={(e) => setFollowUp({ nextStep: e.target.value })}>
            <option value="">Select…</option>
            {nextStepOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-input">
          Follow-up date
          <input
            type="date"
            value={followUp.followUpDate}
            onChange={(e) => setFollowUp({ followUpDate: e.target.value })}
          />
        </label>
        <label className="field-input field-input-wide">
          Notes
          <textarea
            rows={3}
            value={followUp.notes}
            onChange={(e) => setFollowUp({ notes: e.target.value })}
            placeholder="Anything staff should know for the next touchpoint"
          />
        </label>
      </section>

      <section className="card summary-card">
        <h2>Visit Summary</h2>
        <div className="summary-grid">
          <div>
            <h3>Setup</h3>
            <p>{patient.name} · DOB {patient.dob || '—'}</p>
            <p className="muted">
              PTA R{visit.hearingTest.rightPTA || '—'} / L{visit.hearingTest.leftPTA || '—'} dB
            </p>
          </div>
          <div>
            <h3>Capture</h3>
            <p>
              {capture.productsDemonstrated.length > 0
                ? capture.productsDemonstrated.map(productName).join(', ')
                : 'No products recorded'}
            </p>
            <p className="muted">{outcomeLabel || 'No outcome recorded'}</p>
          </div>
          <div>
            <h3>Documentation</h3>
            <p>{documentation.visitDurationMinutes ? `${documentation.visitDurationMinutes} min` : 'Duration not set'}</p>
            <p className="muted">{documentation.attested ? 'Attested' : 'Not yet attested'}</p>
          </div>
          <div>
            <h3>Follow-up</h3>
            <p>{nextStepOptions.find((o) => o.value === followUp.nextStep)?.label || 'Not selected'}</p>
            <p className="muted">{followUp.followUpDate || 'No date set'}</p>
          </div>
        </div>
      </section>

      <div className="screen-actions screen-actions-split">
        <button className="btn btn-ghost" onClick={startNewVisit}>
          Start another visit for this patient
        </button>
        <button className="btn btn-primary" onClick={finish}>
          Finish &amp; return home
        </button>
      </div>
    </div>
  )
}
