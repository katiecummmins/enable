// Mock data layer for the Enable prototype.
// In a real product this would come from Enable's backend (and, where a clinic
// runs Engage, from an Engage integration). Here it's just seeded JS so the
// prototype is a single `npm run dev` away from clickable.

export const productCatalog = [
  { id: 'phonak-audeo-sphere', name: 'Phonak Audéo Sphere', category: 'Premium RIC' },
  { id: 'oticon-intent', name: 'Oticon Intent', category: 'Premium RIC' },
  { id: 'resound-nexia', name: 'ReSound Nexia', category: 'Premium RIC' },
  { id: 'widex-moment-sheer', name: 'Widex Moment Sheer', category: 'Slim RIC' },
  { id: 'signia-ix', name: 'Signia IX', category: 'Premium RIC' },
  { id: 'starkey-genesis-ai', name: 'Starkey Genesis AI', category: 'Premium RIC' },
]

export const outcomeOptions = [
  { value: 'proceeded_purchase', label: 'Proceeded to purchase' },
  { value: 'trial_period', label: 'Started a trial period' },
  { value: 'follow_up_needed', label: 'Interested — follow-up needed' },
  { value: 'declined', label: 'Declined at this time' },
]

export const nextStepOptions = [
  { value: 'schedule_fitting', label: 'Schedule fitting appointment' },
  { value: 'order_device', label: 'Order device' },
  { value: 'schedule_trial_checkin', label: 'Schedule trial check-in call' },
  { value: 'send_pricing', label: 'Send pricing / financing info' },
  { value: 'no_action', label: 'No further action' },
]

// Seed patients. "engageEnabled" simulates the clinic-level setting of whether
// this location runs Engage during demos, since Enable has to support both.
export const seedPatients = [
  {
    id: 'p-alvarez',
    name: 'Margaret Alvarez',
    dob: '1952-03-14',
    phone: '(555) 012-4478',
    engageEnabled: false,
    hearingTest: {
      date: '2026-08-12',
      testType: 'Comprehensive audiometric evaluation',
      rightPTA: '42',
      leftPTA: '47',
      speechDiscrimination: '88',
      notes: 'Mild-to-moderate sloping sensorineural loss, bilateral. Prior hearing aid wearer (8+ yrs, out of warranty).',
    },
    history: {
      priorHearingAidUse: true,
      tinnitus: true,
      otherConditions: 'Mild arthritis (dexterity may affect device handling preference).',
      notes: 'Returning patient, due for upgrade evaluation. Prefers rechargeable devices.',
    },
  },
  {
    id: 'p-whitfield',
    name: 'James Whitfield',
    dob: '1968-11-02',
    phone: '(555) 088-2231',
    engageEnabled: true,
    hearingTest: {
      date: '2026-08-15',
      testType: 'Comprehensive audiometric evaluation',
      rightPTA: '38',
      leftPTA: '35',
      speechDiscrimination: '92',
      notes: 'Mild sensorineural loss, bilateral, high-frequency. First-time hearing aid candidate.',
    },
    history: {
      priorHearingAidUse: false,
      tinnitus: false,
      otherConditions: '',
      notes: 'Referred by physician after annual physical flagged hearing concerns. Works in an open-plan office.',
    },
  },
  {
    id: 'p-nguyen',
    name: 'Linh Nguyen',
    dob: '1979-06-23',
    phone: '(555) 044-9910',
    engageEnabled: true,
    hearingTest: {
      date: '',
      testType: '',
      rightPTA: '',
      leftPTA: '',
      speechDiscrimination: '',
      notes: '',
    },
    history: {
      priorHearingAidUse: false,
      tinnitus: false,
      otherConditions: '',
      notes: '',
    },
  },
]

// Simulates a payload Engage would push to Enable once a demo session ends.
// Used on the Capture screen when the clinic has Engage enabled, so the
// prototype can show the "auto-populated" path without a real integration.
export function simulateEngageSync(patientId) {
  const byPatient = {
    'p-whitfield': {
      sessionId: 'engage-sess-88421',
      startedAt: '2026-08-19T14:02:00',
      endedAt: '2026-08-19T14:24:00',
      productsDemonstrated: ['oticon-intent', 'phonak-audeo-sphere'],
      environmentsTested: ['Quiet office', 'Simulated restaurant noise', 'Speech-in-noise'],
      patientResponseRaw: 'Patient rated Oticon Intent 4/5 in restaurant simulation, noted noticeable speech clarity improvement. Preferred it over Phonak Sphere in noise; comparable in quiet.',
    },
    'p-nguyen': {
      sessionId: 'engage-sess-88503',
      startedAt: '2026-08-19T15:10:00',
      endedAt: '2026-08-19T15:29:00',
      productsDemonstrated: ['resound-nexia'],
      environmentsTested: ['Quiet office', 'Phone call simulation'],
      patientResponseRaw: 'Patient noted improved clarity on phone calls. Some hesitation about price point.',
    },
  }
  return (
    byPatient[patientId] || {
      sessionId: 'engage-sess-00000',
      startedAt: '',
      endedAt: '',
      productsDemonstrated: [],
      environmentsTested: [],
      patientResponseRaw: '',
    }
  )
}
