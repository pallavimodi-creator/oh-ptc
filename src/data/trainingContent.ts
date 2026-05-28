export interface TrainingModule {
  key: string;
  title: string;
  description: string;
  hasContent: boolean; // true if video/deck is uploaded, false if placeholder
  type: 'video' | 'deck' | 'document';
}

// Centre Team training modules
export const CENTRE_TEAM_MODULES: TrainingModule[] = [
  {
    key: 'about_ptc',
    title: 'About the Parent Toddler Club',
    description: 'Interactive presentation about the Parent-Toddler Club program.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'experience_book',
    title: 'The Experience Book',
    description: 'Learn about the Experience Book and its role in the program.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'subscription_pricing',
    title: 'Subscription & Pricing',
    description: 'Understanding the subscription model and pricing structure.',
    hasContent: true,
    type: 'document',
  },
  {
    key: 'whatsapp_protocol_centre',
    title: 'WhatsApp Protocol',
    description: 'Guidelines for WhatsApp communication with parents and team.',
    hasContent: true,
    type: 'document',
  },
  {
    key: 'register_subscriber',
    title: 'How to Register a Parent as a Subscriber',
    description: 'Step-by-step video guide to registering new parent subscribers.',
    hasContent: true,
    type: 'video',
  },
  {
    key: 'app_protocol_centre',
    title: 'App Protocol',
    description: 'Booking, ticket verification, and attendance guidelines.',
    hasContent: true,
    type: 'document',
  },
  {
    key: 'booking_session',
    title: 'Booking a Session on the App',
    description: 'How to book and manage sessions using the app.',
    hasContent: true,
    type: 'deck',
  },
];

// Educator training modules
export const EDUCATOR_MODULES: TrainingModule[] = [
  {
    key: 'about_ptc',
    title: 'About the Parent Toddler Club',
    description: 'Interactive presentation about the Parent-Toddler Club program.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'experience_book',
    title: 'The Experience Book',
    description: 'Learn about the Experience Book and its role in the program.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'how_to_use_experience_book',
    title: 'How to Use the Experience Book',
    description: 'Practical guide on using the Experience Book during sessions.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'thinking_beyond_plan',
    title: 'Thinking Beyond the Plan',
    description: 'Creative approaches to adapt and enhance session plans.',
    hasContent: true,
    type: 'deck',
  },
  {
    key: 'experience_feedback_protocol',
    title: 'Experience Feedback Protocol',
    description: 'Weekly acknowledgment process for upcoming session plans.',
    hasContent: true,
    type: 'document',
  },
  {
    key: 'whatsapp_protocol_educator',
    title: 'WhatsApp Protocol',
    description: 'Guidelines for WhatsApp communication with parents and team.',
    hasContent: true,
    type: 'document',
  },
];
