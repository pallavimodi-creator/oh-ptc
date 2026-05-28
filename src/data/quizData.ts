export interface QuizQuestion {
  key: string;
  type: 'mcq' | 'short_answer';
  question: string;
  instruction?: string;
  options?: { label: string; value: string }[];
  correctAnswer?: string; // only for MCQ
  points?: number; // only for MCQ
  adminRubric?: string; // guidance for admin review
  sectionTitle?: string; // rendered as a divider before this question
}

export interface QuizDefinition {
  key: string;
  title: string;
  description: string;
  instructions: string;
  questions: QuizQuestion[];
  mcqTotal: number;
  passThreshold: number; // minimum MCQ score to pass
}

// ──────────────────────────────────────────────
// EDUCATOR QUIZ — combines Part 1 (PTC) & Part 2 (Experience Book)
// Single 30-minute timer, single identity entry
// ──────────────────────────────────────────────

export const QUIZ_EDUCATOR: QuizDefinition = {
  key: 'quiz_educator_onboarding',
  title: 'Educator Onboarding Quiz',
  description: 'Part 1 — About the Parent–Toddler Club & Part 2 — About the Experience Book.',
  instructions:
    'Passing this onboarding quiz is mandatory. You have 30 minutes for both parts combined. Passing requires 70% on MCQs.',
  mcqTotal: 9, // 4 from Part 1 + 5 from Part 2
  passThreshold: 7, // ~70% of 9
  questions: [
    // ── PART 1 — ABOUT THE PARENT–TODDLER CLUB ──
    {
      key: 'p1_q1',
      type: 'mcq',
      sectionTitle: 'Part 1 — About the Parent–Toddler Club',
      question:
        'A child attends Parent–Toddler Club regularly with a nanny, not a parent. What should you do?',
      options: [
        { label: 'Stop the child from attending', value: 'A' },
        { label: 'Ask the nanny to sit outside the room', value: 'B' },
        {
          label:
            'Allow the nanny to attend and stay in touch with the parent (calls / updates after sessions)',
          value: 'C',
        },
        { label: 'Ignore who attends as long as the child comes', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'p1_q2',
      type: 'short_answer',
      question:
        'Why do we let children attend sessions with other children instead of doing one-on-one sessions only?',
      instruction:
        'Give 2 examples of things a child learns faster or better when they are with other children.',
      adminRubric:
        'Approve if answer includes 2 concrete examples (e.g., copying actions, confidence, waiting/turn-taking, staying engaged, trying materials after seeing peers). Reject if vague ("social skills") or no examples.',
    },
    {
      key: 'p1_q3',
      type: 'short_answer',
      question:
        'What changes do you usually see in a child who comes regularly over time? Give 2 examples.',
      adminRubric:
        'Approve if examples are specific and observable (comfort with materials, longer attention, smoother transitions, participation, confidence, parent-child sync). Reject if vague.',
    },
    {
      key: 'p1_q4',
      type: 'mcq',
      question: 'Which statement is correct?',
      options: [
        { label: 'Goals change every few months as children grow', value: 'A' },
        {
          label:
            'Goals stay the same for ages 1–3, but children engage with them differently over time',
          value: 'B',
        },
        { label: 'Each child has different goals', value: 'C' },
        { label: 'Goals depend on the educator', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'p1_q5',
      type: 'mcq',
      question: 'When should you ideally review the session plan and goals?',
      options: [
        { label: 'Just before the session', value: 'A' },
        { label: 'During the opening circle', value: 'B' },
        { label: 'A day before the session', value: 'C' },
        { label: 'After the session', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'p1_q6',
      type: 'short_answer',
      question:
        "On a child's first session, they mostly watch and don't participate much. What would you say to the parent to encourage them to come again?",
      adminRubric:
        'Approve if reassures parent, normalises settling-in, encourages repeat visits, focuses on comfort/confidence building. Reject if blaming child/parent or overly rigid.',
    },
    {
      key: 'p1_q7',
      type: 'mcq',
      question:
        'If children are deeply engaged in one activity, is it okay to skip other planned activities?',
      options: [
        { label: 'No, all activities must be completed', value: 'A' },
        {
          label: 'Yes, it\'s okay to skip if engagement is strong',
          value: 'B',
        },
        { label: 'Only free play can be skipped', value: 'C' },
        { label: 'Only movement can be skipped', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'p1_q8',
      type: 'short_answer',
      question:
        'How would you set up free play so that children explore independently AND parents know how to participate?',
      adminRubric:
        'Approve if mentions simple zones, enough materials, clear visual setup, quick parent instruction, low-conflict setup, adult role as model + support. Reject if unclear or too abstract.',
    },

    // ── PART 2 — ABOUT THE EXPERIENCE BOOK ──
    {
      key: 'p2_q1',
      type: 'mcq',
      sectionTitle: 'Part 2 — About the Experience Book',
      question: 'How long does the Experience Book last for a parent?',
      options: [
        { label: 'One month', value: 'A' },
        { label: 'Till all goals are completed', value: 'B' },
        {
          label:
            'For the full duration of their Parent–Toddler Club journey',
          value: 'C',
        },
        { label: 'Till the child turns 2', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'p2_q2',
      type: 'mcq',
      question:
        'For a 2.5-year-old, where do you find the learning goals?',
      options: [
        { label: 'Separate goals for 2–3 years', value: 'A' },
        {
          label: 'Same goals used for all children aged 1–3',
          value: 'B',
        },
        { label: 'Parent decides', value: 'C' },
        { label: 'Educator decides', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'p2_q3',
      type: 'mcq',
      question: 'Which session helps a child learn counting?',
      options: [
        { label: 'Art', value: 'A' },
        { label: 'Sensory', value: 'B' },
        { label: 'Movement', value: 'C' },
        { label: 'None of the above', value: 'D' },
      ],
      correctAnswer: 'D',
      points: 1,
    },
    {
      key: 'p2_q4',
      type: 'short_answer',
      question:
        'In a sensory session, one goal is "Help understand differences in food & nature." What does this look like in a child? Give one example.',
      adminRubric:
        'Approve if example is concrete (noticing rough/smooth, wet/dry, smell differences, comparing seeds/leaves/fruit textures, etc.). Reject if vague.',
    },
    {
      key: 'p2_q5',
      type: 'mcq',
      question:
        'In an art session, you teach a technique like spreading watercolour using water. Where should this be recorded in the Experience Book?',
      options: [
        { label: 'Under an art goal', value: 'A' },
        { label: 'Under fine motor skills', value: 'B' },
        { label: 'Under creativity', value: 'C' },
        {
          label:
            'Nowhere — this is not a defined goal in the Experience Book',
          value: 'D',
        },
      ],
      correctAnswer: 'D',
      points: 1,
    },
    {
      key: 'p2_q6',
      type: 'short_answer',
      question:
        'For a special session (e.g., a Saturday playdate), what goals do you keep in mind while facilitating AND where do you record them?',
      adminRubric:
        'Approve if they say they still follow session intent/goals broadly but do NOT record in Experience Book (since special playdates are exceptions). Reject if they say they will record it in the Experience Book.',
    },
    {
      key: 'p2_q7',
      type: 'mcq',
      question:
        'Is it compulsory for a child to attend 3 sessions of a type before progress can be seen?',
      options: [
        { label: 'Yes, always', value: 'A' },
        {
          label:
            'No — confidence builds differently for every child',
          value: 'B',
        },
        { label: 'Only for art sessions', value: 'C' },
        { label: 'Only for sensory sessions', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'p2_q8',
      type: 'short_answer',
      question:
        'Activity: making red marks on red paper. If a child is already doing this easily, what would you do next to keep them engaged?',
      adminRubric:
        'Approve if they propose a reasonable extension (new tool, bigger/smaller marks, patterning, new surface, two colours, target shapes, etc.). Reject if they repeat same instruction or say "move on" only.',
    },
    {
      key: 'p2_q9',
      type: 'short_answer',
      question:
        'Name 3 read-aloud books you would choose outside the prescribed list and briefly say why.',
      instruction: 'Answer in 3 bullet points.',
      adminRubric:
        'Approve if books are age-appropriate (short, repetitive, engaging) and reasons are sensible (rhythm, repetition, pictures, theme fit). Reject if choices are too long/advanced or no rationale.',
    },
  ],
};

// ──────────────────────────────────────────────
// CENTRE TEAM QUIZ
// ──────────────────────────────────────────────

export const QUIZ_3_CENTRE_TEAM: QuizDefinition = {
  key: 'quiz_3_centre_team',
  title: 'Quiz — Centre Team Onboarding',
  description: 'Test your understanding of PTC operations, parent FAQs, WhatsApp & app protocol, fees, and program pitching.',
  instructions: 'Passing this onboarding quiz is mandatory. Passing requires 70%.',
  mcqTotal: 21,
  passThreshold: 15,
  questions: [
    // SECTION 1 — PROGRAM & PARENT FAQs
    {
      key: 'q1',
      type: 'mcq',
      question: 'Can a child attend Parent–Toddler Club with a nanny?',
      options: [
        { label: 'No, only parents are allowed', value: 'A' },
        { label: 'Yes, but only for the first session', value: 'B' },
        { label: 'Yes — but the centre team must stay in regular touch with the parent', value: 'C' },
        { label: 'Yes — no follow-up is needed', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q2',
      type: 'mcq',
      question: 'If a parent says, "My child is too young for this program", what is the best response?',
      options: [
        { label: 'Suggest waiting for 6 months', value: 'A' },
        { label: 'Say the program is only for older toddlers', value: 'B' },
        { label: 'Explain that many children of this age attend; activities are age-appropriate, low-pressure, and the parent is always present', value: 'C' },
        { label: 'Offer a refund', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q3',
      type: 'short_answer',
      question: 'What kind of activities happen in the Parent–Toddler Club?\n\nGive one clear example each for:\n• Art\n• Sensory\n• Movement\n\n(Write as you would explain to a parent.)',
      adminRubric: 'Approve if answer includes one concrete, age-appropriate example for each of Art, Sensory, and Movement. Reject if any category is missing or examples are vague.',
    },
    {
      key: 'q4',
      type: 'mcq',
      question: 'If a parent says, "These activities are not advanced enough for my child", what should you say?',
      options: [
        { label: 'Activities change every week', value: 'A' },
        { label: 'We will make worksheets', value: 'B' },
        { label: 'If the CD and educator feel the child is confident and independent, suggest preschool; otherwise, plan slight advancement within sessions', value: 'C' },
        { label: 'Ask the parent to continue anyway', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q5',
      type: 'mcq',
      question: 'If a parent asks whether this is a drop-off program, what should you say?',
      options: [
        { label: 'Yes, if the child is settled', value: 'A' },
        { label: 'Yes, for short durations', value: 'B' },
        { label: 'No — this is a caregiver-participation program', value: 'C' },
        { label: 'Only on weekdays', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    // SECTION 2 — WHATSAPP PROTOCOL
    {
      key: 'q6',
      type: 'mcq',
      question: 'Who must be added to the Parent–Toddler Club WhatsApp group?',
      options: [
        { label: 'Only subscribers', value: 'A' },
        { label: 'Every parent who attends a session', value: 'B' },
        { label: 'Only weekday attendees', value: 'C' },
        { label: 'Only parents who ask', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q7',
      type: 'mcq',
      question: 'How should booking-related questions be handled on WhatsApp?',
      options: [
        { label: 'Answer in the group', value: 'A' },
        { label: 'Ignore them', value: 'B' },
        { label: 'Move the conversation to DM only', value: 'C' },
        { label: 'Ask other parents to help', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q8',
      type: 'mcq',
      question: 'When should session reminders be shared?',
      options: [
        { label: 'Friday 3 PM only', value: 'A' },
        { label: 'Saturday 3 PM (for the coming week) AND Friday 1 PM (Saturday playdate reminder)', value: 'B' },
        { label: 'Monday morning', value: 'C' },
        { label: 'Daily', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    // SECTION 3 — APP PROTOCOL
    {
      key: 'q9',
      type: 'mcq',
      question: 'Can a parent attend a session without booking and without showing a ticket?',
      options: [
        { label: 'Yes, if space is available', value: 'A' },
        { label: 'Yes, for first-time parents', value: 'B' },
        { label: 'No — under any circumstance (except technical issues)', value: 'C' },
        { label: 'Yes, if they arrive early', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q10',
      type: 'mcq',
      question: 'If a parent arrives without booking, what should you do?',
      options: [
        { label: 'Allow them to attend', value: 'A' },
        { label: 'Ask them to observe', value: 'B' },
        { label: 'Help them book another session; do not allow entry', value: 'C' },
        { label: 'Mark attendance anyway', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q11',
      type: 'mcq',
      question: 'When should attendance be marked on the dashboard?',
      options: [
        { label: 'Before the session', value: 'A' },
        { label: 'After seeing the ticket', value: 'B' },
        { label: 'At the end of the day', value: 'C' },
        { label: 'Automatically', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q12',
      type: 'mcq',
      question: 'If attendance is marked without viewing the ticket, what should be done?',
      options: [
        { label: 'Nothing', value: 'A' },
        { label: 'Fix silently', value: 'B' },
        { label: 'Raise a ticket', value: 'C' },
        { label: 'Delete the entry', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q13',
      type: 'short_answer',
      question: 'Write simple steps you would tell a parent to:\n1) Download the Openhouse app\n2) Book a Parent–Toddler Club session',
      adminRubric: 'Approve if steps are clear, sequential, and parent-friendly. Reject if incomplete, overly technical, or missing either part.',
    },
    // SECTION 4 — FEES, SUBSCRIPTION & PAUSE
    {
      key: 'q14',
      type: 'mcq',
      question: 'What is the price of a single Parent–Toddler Club session?',
      options: [
        { label: '₹750 inclusive of GST', value: 'A' },
        { label: '₹750 + GST', value: 'B' },
        { label: '₹12,000 + GST', value: 'C' },
        { label: 'Depends on centre', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q15',
      type: 'mcq',
      question: 'Which of the following is included in the ₹12,000 + GST membership?',
      options: [
        { label: '3 sessions per week', value: 'A' },
        { label: '5 sessions per week', value: 'B' },
        { label: 'Unlimited sessions for 3 months', value: 'C' },
        { label: 'Fixed number of sessions', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q16',
      type: 'mcq',
      question: 'If a parent says, "We will only come twice a week — can the fee be adjusted?", what should you say?',
      options: [
        { label: 'Yes, fee changes based on attendance', value: 'A' },
        { label: 'No — membership fee does not change based on frequency', value: 'B' },
        { label: 'Offer a refund', value: 'C' },
        { label: 'Suggest a shorter membership', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q17',
      type: 'mcq',
      question: 'If a parent says they are travelling, what should you offer?',
      options: [
        { label: 'Refund', value: 'A' },
        { label: 'Make-up sessions after 3 months', value: 'B' },
        { label: 'Pause option (as per policy)', value: 'C' },
        { label: 'Extend membership automatically', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q18',
      type: 'mcq',
      question: 'If a parent says, "I only want a 1-month subscription", what should you say?',
      options: [
        { label: 'We offer a 1-month plan', value: 'A' },
        { label: 'Book pay-per-session first; once confident, take the 3-month membership', value: 'B' },
        { label: 'Refuse immediately', value: 'C' },
        { label: 'Discount membership', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q19',
      type: 'mcq',
      question: 'If a parent misses sessions and asks to attend after 3 months, what should you say?',
      options: [
        { label: 'Yes, sessions can be made up', value: 'A' },
        { label: 'Only half can be made up', value: 'B' },
        { label: 'No — there are no make-ups; the program is already economical and flexible', value: 'C' },
        { label: 'Depends on centre', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    // SECTION 5 — PROGRAM PITCH & EXPERIENCE BOOK
    {
      key: 'q20',
      type: 'short_answer',
      question: 'Describe the Parent–Toddler Club program in 3 words.',
      instruction: 'Expected idea: Exposure · Routine Building · One-hour playtime with other children',
      adminRubric: 'Approve if the 3 words capture the essence of exposure, routine, and social play. Reject if generic or unrelated to the program.',
    },
    {
      key: 'q21',
      type: 'mcq',
      question: 'If a parent says, "I work and can\'t come regularly", what should you suggest?',
      options: [
        { label: 'Membership anyway', value: 'A' },
        { label: 'No program for them', value: 'B' },
        { label: 'Pay-per-session booking', value: 'C' },
        { label: 'Drop-off option', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
    {
      key: 'q22',
      type: 'short_answer',
      question: 'How would you explain Parent–Toddler Club as a high-exposure program using the Experience Book?\n\n(Mention variety of sessions, resources, or learning goals.)',
      adminRubric: 'Approve if answer links PTC to high-exposure by referencing variety of session types, breadth of learning goals, and/or the Experience Book as evidence. Reject if vague or doesn\'t mention the Experience Book.',
    },
    {
      key: 'q23',
      type: 'mcq',
      question: 'What are the 4 kinds of Parent–Toddler Club sessions?',
      options: [
        { label: 'Art, Sensory, Music & Storytelling, Movement', value: 'A' },
        { label: 'Art, Math, Language, Science', value: 'B' },
        { label: 'Free play only', value: 'C' },
        { label: 'Worksheets and tests', value: 'D' },
      ],
      correctAnswer: 'A',
      points: 1,
    },
    {
      key: 'q24',
      type: 'mcq',
      question: 'Who receives the Experience Book, and why?',
      options: [
        { label: 'Every attendee — it is free', value: 'A' },
        { label: 'Only subscribers — because it tracks learning over time', value: 'B' },
        { label: 'Educators only', value: 'C' },
        { label: 'Anyone who asks', value: 'D' },
      ],
      correctAnswer: 'B',
      points: 1,
    },
    {
      key: 'q25',
      type: 'mcq',
      question: 'If a parent wants to move to preschool midway, what is the correct process?',
      options: [
        { label: 'Admin decides immediately', value: 'A' },
        { label: 'Educator decides', value: 'B' },
        { label: 'Raise with CD; CD raises a ticket for coin adjustment as per policy', value: 'C' },
        { label: 'Ask parent to continue PTC', value: 'D' },
      ],
      correctAnswer: 'C',
      points: 1,
    },
  ],
};

// Legacy aliases for backward compatibility with existing DB records
export const QUIZ_1_PTC = QUIZ_EDUCATOR; // old quiz_1_ptc attempts will show under admin review
export const QUIZ_2_EXPERIENCE_BOOK = QUIZ_EDUCATOR; // old quiz_2_experience_book attempts too

export const ALL_QUIZZES: QuizDefinition[] = [QUIZ_EDUCATOR, QUIZ_3_CENTRE_TEAM];
export const EDUCATOR_QUIZZES: QuizDefinition[] = [QUIZ_EDUCATOR];
export const CENTRE_TEAM_QUIZZES: QuizDefinition[] = [QUIZ_3_CENTRE_TEAM];

export function getQuizByKey(key: string): QuizDefinition | undefined {
  // Handle legacy keys
  if (key === 'quiz_1_ptc' || key === 'quiz_2_experience_book') {
    return QUIZ_EDUCATOR;
  }
  return ALL_QUIZZES.find((q) => q.key === key);
}
