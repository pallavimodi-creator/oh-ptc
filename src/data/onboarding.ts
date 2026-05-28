export interface ResourceLink {
  label: string;
  url: string;
}

export interface OnboardingSection {
  key: string;
  title: string;
  description: string;
  resourceLinks?: ResourceLink[];
  isPrimary?: boolean;
}

export const ONBOARDING_SECTIONS: OnboardingSection[] = [
  // PRIMARY RULES
  {
    key: 'primary_rules',
    title: 'Primary Rules for Experience',
    isPrimary: true,
    description: `These are the non-negotiable rules for every session:

1) Plans must be followed — exactly as shared with parents.

2) Every session must include ALL parts of the experience:
   • All planned activities
   • Opening Circle
   • Read Aloud
   • Closing Circle

3) The Experience Book must be used in every session. It is non-negotiable.`,
  },

  // OTHER RULES
  {
    key: 'space_permanent_setup',
    title: 'Space + Permanent Setup',
    description: `1) Space Rule (includes parent rule)
• Run the session in more than 1 space whenever possible.
• Keep one fixed Opening + Closing Circle spot.
• During circle: all parents sit down and keep phones away — no standing and watching.

2) Permanent Setup Rule
• The circle spot must be pre-set with mats + cushions + permanent display.
• Share 1 photo of this setup on the internal WhatsApp group.
• Permanent display must include: Session Calendar (colour print), Session Goals poster, Parent Tips poster, Books set-up + Books poster.`,
  },
  {
    key: 'opening_closing_circle',
    title: 'Opening + Closing Circle Rules',
    description: `Opening Circle:
• Place — pre-decide the plan/place for Opening Circle.
• Cushions & Mat — cushions = number of participants, mat is mandatory.
• Song — sing from Hello Song list; cover at least 2 songs in the month. It is unacceptable to play all music and not sing.
• Program Introduction — parent introduction script before every session is mandatory.
• Use the Experience Book — show to parents before every session; maintain teacher copy; point to Goals poster so parents watch for goals.

Closing Circle:
• Reflections — ask parents:
  - What was one wow moment you saw today?
  - Which one was your favorite activity?
  - Did you feel your child was working on the goals of ___ (mention one goal)
• Goodbye song — use at least 2 songs in a month.`,
  },
  {
    key: 'read_aloud_rules',
    title: 'Read Aloud (Rules)',
    description: `Mandatory: A read aloud must be done in every session.

Prescribed / Approved books only: Use only the prescribed or approved book selection.

If you are not using the prescribed books, you must get the books approved in advance.

Props are required: Use props as mentioned in the prescribed guidance (or approved alternatives).`,
  },
  {
    key: 'transitions_rituals',
    title: 'Transition Rituals (Rules)',
    description: `Transitions Rituals are mandatory. Use songs during key transitions.

Moving from one place to another:
Use transition songs such as Ants Go Marching, Choo Choo Train, or other approved movement songs.

Hand washing:
The Hand Wash Song must be sung.

Cleaning up toys:
The Clean-Up Song must be sung.`,
  },
  {
    key: 'experience_book',
    title: 'Using the Experience Book',
    description: `Coming soon.`,
  },
  {
    key: 'guide_parent',
    title: 'How to Guide a Parent',
    description: `Follow these 4 key rules when guiding parents during sessions:

1. Only one teacher speaks and other person assists.
   → Avoid confusion by having a single voice lead; the assistant supports silently.

2. Don't try to speak while the music is on — pause music & speak.
   → Ensures parents can hear instructions clearly without competing audio.

3. If a child is unable to do — guide them to do a variation.
   → Offer an easier alternative so every child can participate successfully.

4. If a child is already able to do — guide them to a slight advancement.
   → Challenge capable children with a next-level version to keep them engaged.`,
  },
  {
    key: 'whatsapp_uploads',
    title: 'WhatsApp Sharing (Rules & Frequency)',
    description: `Daily Preview:
Share a short preview of the next day's session on WhatsApp.

Tiny Tip — Daily:
Share one simple parent tip on WhatsApp.
(Monthly Tip Table — 20 tips of the month — coming soon.)

Club Moments — After every session:
Share one group image after the session as the Club Moment.

This Week's Club Pick — Weekly:
Click photos of 3–4 activities in the week and run a poll for the Week's Club Pick.`,
  },

  // RESOURCE SECTIONS
  {
    key: 'opening_circle_songs',
    title: 'Recommended Opening Circle Songs',
    description: `Use at least 2 songs in a month. Teams must share a video of their circle time including the songs being sung.`,
    resourceLinks: [
      { label: 'Hello Songs Playlist', url: 'https://www.youtube.com/watch?v=3-n2qdMNCps' },
      { label: 'Hello to All the Children of the World', url: 'https://www.youtube.com/watch?v=CpuHmDbJAiU' },
      { label: 'Make A Circle - Super Simple Songs', url: 'https://www.youtube.com/watch?v=Hg1SB4XAnEk' },
      { label: 'Hello Hello - Noodle & Pals', url: 'https://www.youtube.com/watch?v=tVlcKp3bWH8' },
      { label: 'Hello Song with Bella', url: 'https://www.youtube.com/watch?v=gghDRJVxFxU' },
    ],
  },
  {
    key: 'closing_circle_songs',
    title: 'Recommended Closing Circle Songs',
    description: `Use at least 2 songs in a month and share those songs.`,
    resourceLinks: [
      { label: 'Goodbye, So Long, Farewell', url: 'https://www.youtube.com/watch?v=E3f5OPNVxPA' },
      { label: 'See You Later Alligator - Kiboomers', url: 'https://www.youtube.com/watch?v=bWpK0wsnitc' },
      { label: 'Goodbye Song - Singing Walrus', url: 'https://www.youtube.com/watch?v=Lcr2whnGnrA' },
    ],
  },
  {
    key: 'book_recommendations',
    title: 'Book Recommendations',
    description: `Only prescribed books may be used for Read Alouds. Here are the recommended books for each session type:`,
    resourceLinks: [
      { label: 'Art: Open Up! Open Up! by Tomoko Suzuki', url: 'https://www.amazon.in/Open-Up-Tomoko-Suzuki/dp/0316539368' },
      { label: 'Art: Press Here by Herve Tullet', url: 'https://www.amazon.in/Press-Here-Herve-Tullet/dp/0811879542' },
      { label: 'Music: Baa, Baa, Black Sheep', url: 'https://www.amazon.in/Baa-Black-Sheep-Finger-Puppet/dp/1452118698' },
      { label: 'Music: Old MacDonald Had a Farm', url: 'https://www.amazon.in/Sing-Along-Old-MacDonald-Farm/dp/1839037482' },
      { label: 'Movement: From Head to Toe by Eric Carle', url: 'https://www.amazon.in/Head-Toe-Eric-Carle/dp/0694013013' },
      { label: 'Movement: Ten Little Fingers, Ten Little Toes', url: 'https://www.amazon.in/Little-Fingers-Toes-Mem-Fox/dp/0547581041' },
      { label: 'Sensory: The Very Hungry Caterpillar', url: 'https://www.amazon.in/Very-Hungry-Caterpillar-Eric-Carle/dp/0241003008' },
      { label: 'Sensory: Yummy Yucky by Leslie Patricelli', url: 'https://www.amazon.in/Yummy-Yucky-Leslie-Patricelli/dp/0763619035' },
    ],
  },
];
