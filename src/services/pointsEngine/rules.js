
module.exports = [
  { eventType: 'PORTAL_LOGIN', points: 1, reasonTpl: 'Login' },
  { eventType: 'CONTENT_VIEW', points: 1, reasonTpl: 'Content View' },
  { eventType: 'CONTENT_SHARE', points: 3, reasonTpl: 'Content Share' },
  { eventType: 'TRAINING_COMPLETE', points: 20, reasonTpl: 'Training Complete: {{track}}' },
  { eventType: 'QUIZ_PASS', points: 5, reasonTpl: 'Quiz Passed: {{track}}' },
  { eventType: 'DEAL_REGISTERED', points: 10, reasonTpl: 'Deal Registered: {{dealId}}' },
  { eventType: 'DEAL_APPROVED', points: 15, reasonTpl: 'Deal Approved: {{dealId}}' },
  { eventType: 'DEAL_CLOSED', points: 50, reasonTpl: 'Deal Closed Won: {{dealId}}', condition: (payload)=>payload.stage==='ClosedWon' }
];
