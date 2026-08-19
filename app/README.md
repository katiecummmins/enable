# Enable — Clickable Prototype

A click-through prototype of **Enable**, a sales-enablement tool for hearing
clinics. Enable wraps around a separate demonstration product, **Engage** —
Enable owns pre-visit setup, capture, and insurance-billing documentation
around a demo; it does not run the demonstration itself. Clinics can use
Enable without Engage, so the capture step supports both a manual-entry path
and an auto-populated (Engage) path.

This is a prototype: fidelity is "click through and understand the workflow,"
not production-ready software. There's no real backend, no auth, and no real
patient data — just seeded mock data held in memory / localStorage.

## The flow

From the home screen, pick a seeded patient (or create a new one) and click
**Start visit**. That walks you through four screens, connected by a stepper
at the top:

1. **Pre-Visit Setup** — patient profile, hearing test results, relevant
   history.
2. **Capture** — what was demonstrated, patient response, outcome. Toggle
   between **Manual entry** (for clinics not using Engage) and **Auto-populate
   from Engage** (a simulated sync button stands in for a real Engage
   integration — click it to see canned session data populate the screen).
3. **Documentation & Coding** — structured fields standing in for an
   eventual insurance billing code (visit duration, products demonstrated,
   clinician attestation, patient response). These fields are explicitly
   labeled as **placeholders** — the real code requirements aren't finalized
   yet. A banner flags any required field that's still missing.
4. **Follow-Up** — next steps, follow-up date, notes, and a summary of the
   whole visit.

You can click backward through the stepper to any screen you've already
reached; screens you haven't gotten to yet are locked until you advance.
Visit data for each patient is kept in `localStorage`, so refreshing the page
won't lose your place.

Two of the seeded patients are marked as "Engage-enabled clinic" (Capture
defaults to the auto-populate path) and one is "Manual capture clinic"
(Capture defaults to manual entry) — this is to make both paths easy to find
without digging through the UI.

## Run it locally

Requires Node.js 18+.

```bash
cd app
npm install
npm run dev
