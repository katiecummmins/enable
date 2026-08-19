import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useVisit } from '../state/VisitContext'
import { productCatalog } from '../lib/mockData'

const REQUIRED_FIELDS = [
  { key: 'visitDurationMinutes', label: 'Visit duration', check: (d) => Boolean(d.visitDurationMinutes) },
  { key: 'productsDemonstrated', label: 'Products demonstrated', check: (d) => d.productsDemonstrated.length > 0 },
  { key: 'attestedBy', label: 'Clinician name', check: (d) => Boolean(d.attestedBy.trim()) },
  { key: 'attested', label: 'Clinician attestation', check: (d) => d.attested },
  { key: 'patientResponseSummary', label: 'Patient response summary', check: (d) => Boolean(d.patientResponseSummary.trim()) },
]

export default function Documentation() {
  const { patientId } = useParams()
  const { getVisit, updateSection, advanceMaxStep } = useVisit()
  const navigate = useNavigate()
  const visit = getVisit(patientId)
  const documentation = visit?.documentation

  const missing = useMemo(
    () => (documentation ? REQUIRED_FIELDS.filter((f) => !f.check(documentation)) : []),
    [documentation],
  )

  if (!visit) return null

  function setDoc(patch) {
    updateSection(patientId, 'documentation', patch)
  }

  function toggleProduct(id) {
    const has = documentation.productsDemonstrated.includes(id)
    setDoc({
      productsDemonstrated: has
        ? documentation.productsDemonstrated.filter((p) => p !== id)
        : [...documentation.productsDemonstrated, id],
    })
  }

  function continueToFollowUp() {
    advanceMaxStep(patientId, 4)
    navigate(`/visit/${patientId}/followup`)
  }

  return (
    <div className="screen">
      <div className="screen-head">
        <h1>Documentation &amp; Coding</h1>
        <p className="screen-sub">
          Structured fields mapping this visit to an insurance billing code. The actual code
          requirements aren't finalized — everything below is a placeholder standing in for what
          will eventually be required.
        </p>
        <span className="placeholder-flag">⚠ Placeholder fields — pending final insurance code requirements</span>
      </div>

      {missing.length > 0 ? (
        <div className="banner banner-warn">
          <strong>{missing.length} required field{missing.length === 1 ? '' : 's'} missing</strong>
          <ul>
            {missing.map((f) => (
              <li key={f.key}>{f.label}</li>
            ))}
          </ul>
          <span className="banner-note">Resolve these before the visit can be marked coding-complete.</span>
        </div>
      ) : (
        <div className="banner banner-ok">
          <strong>All required fields complete</strong> — ready to mark this visit coding-complete.
        </div>
      )}

      <section className="card">
        <h2>Visit Duration <span className="required-mark">*</span></h2>
        <label className="field-input">
          Minutes spent on demonstration &amp; consultation
          <input
            type="number"
            min="0"
            value={documentation.visitDurationMinutes}
            onChange={(e) => setDoc({ visitDurationMinutes: e.target.value })}
            placeholder="e.g. 25"
            className={!REQUIRED_FIELDS[0].check(documentation) ? 'is-missing' : ''}
          />
        </label>
      </section>

      <section className="card">
        <h2>Products Demonstrated <span className="required-mark">*</span></h2>
        <div className="product-checklist">
          {productCatalog.map((p) => (
            <label key={p.id} className="checkbox-row">
              <input
                type="checkbox"
                checked={documentation.productsDemonstrated.includes(p.id)}
                onChange={() => toggleProduct(p.id)}
              />
              {p.name} <span className="muted">· {p.category}</span>
            </label>
          ))}
        </div>
        {!REQUIRED_FIELDS[1].check(documentation) && (
          <p className="hint hint-warn">At least one product must be recorded.</p>
        )}
      </section>

      <section className="card">
        <h2>Clinician Attestation <span className="required-mark">*</span></h2>
        <label className="field-input">
          Clinician name
          <input
            type="text"
            value={documentation.attestedBy}
            onChange={(e) => setDoc({ attestedBy: e.target.value })}
            placeholder="e.g. Dr. Sarah Kim, AuD"
            className={!REQUIRED_FIELDS[2].check(documentation) ? 'is-missing' : ''}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={documentation.attested}
            onChange={(e) => setDoc({ attested: e.target.checked })}
          />
          I attest this documentation accurately reflects the visit
        </label>
      </section>

      <section className="card">
        <h2>Patient Response Summary <span className="required-mark">*</span></h2>
        <label className="field-input field-input-wide">
          <textarea
            rows={3}
            value={documentation.patientResponseSummary}
            onChange={(e) => setDoc({ patientResponseSummary: e.target.value })}
            placeholder="Carried over from Capture — edit as needed for the billing record"
            className={!REQUIRED_FIELDS[4].check(documentation) ? 'is-missing' : ''}
          />
        </label>
      </section>

      <section className="card">
        <h2>Coding Notes <span className="optional-mark">(optional)</span></h2>
        <label className="field-input field-input-wide">
          <textarea
            rows={2}
            value={documentation.codeNotes}
            onChange={(e) => setDoc({ codeNotes: e.target.value })}
            placeholder="Anything relevant to the eventual billing code that doesn't fit above"
          />
        </label>
      </section>

      <div className="screen-actions">
        <button className="btn btn-primary" onClick={continueToFollowUp}>
          Continue to Follow-Up &rarr;
        </button>
      </div>
    </div>
  )
}
