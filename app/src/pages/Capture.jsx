import { useNavigate, useParams } from 'react-router-dom'
import { useVisit } from '../state/VisitContext'
import { outcomeOptions, productCatalog, simulateEngageSync } from '../lib/mockData'

export default function Capture() {
  const { patientId } = useParams()
  const { getVisit, updateSection, advanceMaxStep } = useVisit()
  const navigate = useNavigate()
  const visit = getVisit(patientId)
  if (!visit) return null

  const { capture } = visit

  function setCapture(patch) {
    updateSection(patientId, 'capture', patch)
  }

  function toggleMode(mode) {
    setCapture({ mode })
  }

  function toggleProduct(id) {
    const has = capture.productsDemonstrated.includes(id)
    setCapture({
      productsDemonstrated: has
        ? capture.productsDemonstrated.filter((p) => p !== id)
        : [...capture.productsDemonstrated, id],
    })
  }

  function runEngageSync() {
    const data = simulateEngageSync(patientId)
    setCapture({
      engageSynced: true,
      engageAutoData: data,
      productsDemonstrated: data.productsDemonstrated,
      environmentsTested: data.environmentsTested.join(', '),
      patientResponse: data.patientResponseRaw,
    })
  }

  function continueToDocumentation() {
    // Carry capture data forward as a starting point for the coding screen.
    const startMinutes = capture.engageAutoData?.startedAt
    const endMinutes = capture.engageAutoData?.endedAt
    let duration = ''
    if (startMinutes && endMinutes) {
      const mins = Math.round((new Date(endMinutes) - new Date(startMinutes)) / 60000)
      if (mins > 0) duration = String(mins)
    }
    updateSection(patientId, 'documentation', {
      productsDemonstrated: capture.productsDemonstrated,
      patientResponseSummary: capture.patientResponse,
      visitDurationMinutes: visit.documentation.visitDurationMinutes || duration,
    })
    advanceMaxStep(patientId, 3)
    navigate(`/visit/${patientId}/documentation`)
  }

  return (
    <div className="screen">
      <div className="screen-head">
        <h1>Capture</h1>
        <p className="screen-sub">
          Record what happened during the demonstration. Enable doesn't run the demo — if the
          clinic uses Engage, its session data can populate this screen automatically; otherwise,
          enter it manually.
        </p>
      </div>

      <section className="card">
        <h2>Capture Source</h2>
        <div className="mode-toggle">
          <button
            className={'mode-toggle-btn' + (capture.mode === 'engage' ? ' is-active' : '')}
            onClick={() => toggleMode('engage')}
          >
            Auto-populate from Engage
          </button>
          <button
            className={'mode-toggle-btn' + (capture.mode === 'manual' ? ' is-active' : '')}
            onClick={() => toggleMode('manual')}
          >
            Manual entry
          </button>
        </div>
        {!visit.patient.engageEnabled && capture.mode === 'engage' && (
          <p className="hint hint-warn">
            This clinic profile is marked as not using Engage. In production this option would be
            hidden or disabled; it's left available here so you can see both paths in the prototype.
          </p>
        )}
      </section>

      {capture.mode === 'engage' ? (
        <section className="card">
          <h2>Engage Session Data</h2>
          <p className="placeholder-note">
            Placeholder integration — in production this would sync automatically when the Engage
            session ends. Here, trigger it manually.
          </p>
          {!capture.engageSynced ? (
            <button className="btn btn-secondary" onClick={runEngageSync}>
              Simulate Engage sync
            </button>
          ) : (
            <div className="engage-synced">
              <span className="badge badge-engage">Synced from Engage · session {capture.engageAutoData.sessionId}</span>
              <div className="field-grid">
                <div className="field">
                  <span className="field-label">Session start</span>
                  <span className="field-value">{capture.engageAutoData.startedAt.replace('T', ' ')}</span>
                </div>
                <div className="field">
                  <span className="field-label">Session end</span>
                  <span className="field-value">{capture.engageAutoData.endedAt.replace('T', ' ')}</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={runEngageSync}>
                Re-sync
              </button>
            </div>
          )}
        </section>
      ) : null}

      <section className="card">
        <h2>What Was Demonstrated</h2>
        <div className="product-checklist">
          {productCatalog.map((p) => (
            <label key={p.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={capture.productsDemonstrated.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
              />
              {p.name} <span className="muted">· {p.category}</span>
            </label>
          ))}
        </div>
        <label className="field-input field-input-wide">
          Environments / conditions tested
          <input
            type="text"
            value={capture.environmentsTested}
            onChange={(e) => setCapture({ environmentsTested: e.target.value })}
            placeholder="e.g. Quiet office, restaurant noise simulation"
          />
        </label>
      </section>

      <section className="card">
        <h2>Patient Response &amp; Outcome</h2>
        <label className="field-input field-input-wide">
          Patient response
          <textarea
            rows={3}
            value={capture.patientResponse}
            onChange={(e) => setCapture({ patientResponse: e.target.value })}
            placeholder="What did the patient say or indicate about the demonstrated product(s)?"
          />
        </label>
        <label className="field-input field-input-wide">
          Outcome
          <select value={capture.outcome} onChange={(e) => setCapture({ outcome: e.target.value })}>
            <option value="">Select an outcome…</option>
            {outcomeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field-input field-input-wide">
          Additional demo notes
          <textarea
            rows={2}
            value={capture.demoNotes}
            onChange={(e) => setCapture({ demoNotes: e.target.value })}
            placeholder="Optional"
          />
        </label>
      </section>

      <div className="screen-actions">
        <button className="btn btn-primary" onClick={continueToDocumentation}>
          Continue to Documentation &rarr;
        </button>
      </div>
    </div>
  )
}
