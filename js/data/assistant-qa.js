/**
 * Canned conversations for the asset assistant demo. All data is fictional.
 * `trace` lists the agent's tool calls; `answer` is trusted HTML written here.
 */
export const ASSISTANT_QA = [
  {
    question: 'Which Plant B assets are overdue for verification?',
    trace: ['search asset_register(plant=B, last_verified>12mo)', 'retrieve Asset Policy §4.2', 'draft action'],
    answer: '<b>3 assets</b> at Plant B are past the 12-month window: a paint-shop robot arm (14 months), a stamping die set (13) and a forklift charger bank (15). <b>Draft action:</b> create 3 verification tasks. Waiting for your confirmation.',
    sources: 'asset_register · Asset Policy §4.2',
  },
  {
    question: 'What approval does a ¥2M tooling purchase need?',
    trace: ['retrieve Investment Policy §2.1', 'retrieve form CAPEX-01'],
    answer: 'Between ¥1M and ¥5M you need <b>two approvals</b>, department head and finance controller, plus a CAPEX-01 business case. Above ¥5M the plant director also signs.',
    sources: 'Investment Policy §2.1 · CAPEX-01',
  },
  {
    question: 'Summarise Q3 capex against budget',
    trace: ['query capex_ledger(Q3)', 'aggregate by plant'],
    answer: 'Q3 capex was <b>¥48.6M against ¥52.0M budget</b> (93%). Plant A is 4% over after an early press-line upgrade; Plants B and C deferred two projects to Q4.',
    sources: 'capex_ledger · Budget FY26',
  },
];
