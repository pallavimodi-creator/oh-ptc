export type SessionType = 'art' | 'music' | 'movement' | 'sensory' | 'special';

export interface Session {
  id: string;
  date: string;
  name: string;
  type: SessionType;
  excludedCentres?: string[];
  // Big playdate — marketed harder, more participation expected. Shown with
  // an asterisk on the calendar. Alternate Saturdays are big playdates.
  big?: boolean;
}

export const SESSION_TYPES: Record<SessionType, { label: string; color: string }> = {
  art: { label: 'Art', color: 'session-chip-art' },
  music: { label: 'Music & Storytelling', color: 'session-chip-music' },
  movement: { label: 'Movement', color: 'session-chip-movement' },
  sensory: { label: 'Sensory', color: 'session-chip-sensory' },
  special: { label: 'Special', color: 'session-chip-special' },
};

export const FEBRUARY_2026_SESSIONS: Session[] = [
  { id: '1', date: '2026-02-02', name: 'Dust & Swirl', type: 'art' },
  { id: '2', date: '2026-02-03', name: 'Messy Kitchen', type: 'sensory' },
  { id: '3', date: '2026-02-04', name: 'Brown Bear Beats', type: 'music' },
  { id: '4', date: '2026-02-05', name: 'Build it Big', type: 'movement' },
  { id: '5', date: '2026-02-07', name: 'Around the World', type: 'special', excludedCentres: ['Indiranagar', 'JP Nagar'] },
  { id: '6', date: '2026-02-09', name: 'Grains Table', type: 'sensory' },
  { id: '7', date: '2026-02-10', name: 'Bunny Grooves', type: 'music' },
  { id: '8', date: '2026-02-11', name: 'Follow the Tracks', type: 'movement' },
  { id: '9', date: '2026-02-12', name: 'Dust & Swirl', type: 'art' },
  { id: '10', date: '2026-02-14', name: 'Play Based Learning at Openhouse', type: 'special' },
  { id: '11', date: '2026-02-16', name: 'Sticky & Squishy', type: 'art' },
  { id: '12', date: '2026-02-17', name: 'Messy Kitchen', type: 'sensory' },
  { id: '13', date: '2026-02-18', name: 'Brown Bear Beats', type: 'music' },
  { id: '14', date: '2026-02-19', name: 'Build it Big', type: 'movement' },
  { id: '15', date: '2026-02-21', name: 'Grains Table', type: 'sensory' },
  { id: '16', date: '2026-02-23', name: 'Bunny Grooves', type: 'music' },
  { id: '17', date: '2026-02-24', name: 'Follow the Tracks', type: 'movement' },
  { id: '18', date: '2026-02-25', name: 'Grains Table', type: 'sensory' },
  { id: '19', date: '2026-02-26', name: 'Sticky & Squishy', type: 'art' },
  { id: '20', date: '2026-02-28', name: 'Brown Bear Beats', type: 'music' },
];

export const MARCH_2026_SESSIONS: Session[] = [
  { id: 'm1', date: '2026-03-02', name: 'Glow & Shadow', type: 'art' },
  { id: 'm3', date: '2026-03-04', name: 'Warm & Cold Splash', type: 'sensory' },
  { id: 'm4', date: '2026-03-05', name: 'Fly High', type: 'movement' },
  { id: 'm5', date: '2026-03-07', name: 'Smell & Sniff', type: 'sensory' },
  { id: 'm6', date: '2026-03-09', name: 'Spider Wiggle', type: 'music' },
  { id: 'm7', date: '2026-03-10', name: 'Smell & Sniff', type: 'sensory' },
  { id: 'm8', date: '2026-03-11', name: 'Tunnel Adventure', type: 'movement' },
  { id: 'm9', date: '2026-03-12', name: 'Muddy & Greeny', type: 'art' },
  { id: 'm11', date: '2026-03-14', name: 'Warm & Cold Splash', type: 'sensory' },
  { id: 'm12', date: '2026-03-16', name: 'Fly High', type: 'movement' },
  { id: 'm13', date: '2026-03-17', name: 'Bugs & Bee Sounds', type: 'music' },
  { id: 'm14', date: '2026-03-18', name: 'Glow & Shadow', type: 'art' },
  { id: 'm16', date: '2026-03-21', name: 'Messy Kitchen', type: 'sensory' },
  { id: 'm17', date: '2026-03-23', name: 'Spider Wiggle', type: 'music' },
  { id: 'm18', date: '2026-03-24', name: 'Tunnel Adventure', type: 'movement' },
  { id: 'm19', date: '2026-03-25', name: 'Glow & Shadow', type: 'art' },
  { id: 'm20', date: '2026-03-26', name: 'Bugs & Bee Sounds', type: 'music' },
  { id: 'm21', date: '2026-03-28', name: 'Grains Table', type: 'sensory' },
  { id: 'm22', date: '2026-03-30', name: 'Muddy & Greeny', type: 'art' },
  { id: 'm23', date: '2026-03-31', name: 'Fly High', type: 'movement' },
];

export const APRIL_2026_SESSIONS: Session[] = [
  { id: 'a1', date: '2026-04-01', name: 'Stars & Moon', type: 'art' },
  { id: 'a2', date: '2026-04-02', name: 'Little Bird Songs', type: 'music' },
  { id: 'a3', date: '2026-04-04', name: 'Rainbow Swirl', type: 'art', excludedCentres: ['WFH'] },
  { id: 'a4', date: '2026-04-06', name: 'Paint the Ocean Blue', type: 'special' },
  { id: 'a5', date: '2026-04-07', name: 'Glowing Fish Day', type: 'special' },
  { id: 'a6', date: '2026-04-08', name: 'Sea Animal Rescue Day', type: 'special' },
  { id: 'a7', date: '2026-04-09', name: 'Baby Turtles on the Shore', type: 'special' },
  { id: 'a8b', date: '2026-04-11', name: 'Rainbow Swirl', type: 'art' },
  { id: 'a9', date: '2026-04-13', name: 'Baby Beluga Sings', type: 'special' },
  { id: 'a10', date: '2026-04-15', name: 'Ocean Beats', type: 'music' },
  { id: 'a11', date: '2026-04-16', name: 'Soft Things Basket', type: 'sensory' },
  { id: 'a12', date: '2026-04-18', name: 'Stars & Moon', type: 'art' },
  { id: 'a13', date: '2026-04-20', name: 'Busy Builders', type: 'movement' },
  { id: 'a14', date: '2026-04-21', name: 'Bubble Pop Up', type: 'sensory' },
  { id: 'a15', date: '2026-04-22', name: 'Sticky & Squishy', type: 'art' },
  { id: 'a16', date: '2026-04-23', name: 'Little Bird Songs', type: 'music' },
  { id: 'a17', date: '2026-04-25', name: 'Dust & Swirl', type: 'art' },
  { id: 'a18', date: '2026-04-27', name: 'Soft Things Basket', type: 'sensory' },
  { id: 'a19', date: '2026-04-28', name: 'Ocean Beats', type: 'music' },
  { id: 'a20', date: '2026-04-29', name: 'Busy City Runners', type: 'movement' },
];

export const MAY_2026_SESSIONS: Session[] = [
  { id: 'my1', date: '2026-05-02', name: 'Busy Builders', type: 'movement' },
  { id: 'my2', date: '2026-05-04', name: 'Ocean Beats', type: 'music' },
  { id: 'my3', date: '2026-05-05', name: 'Bubble Pop Up', type: 'sensory' },
  { id: 'my4', date: '2026-05-06', name: 'Busy City Runners', type: 'movement' },
  { id: 'my5', date: '2026-05-07', name: 'Rainbow Swirl', type: 'art' },
  { id: 'my6', date: '2026-05-09', name: 'Warm & Cold Splash', type: 'sensory' },
  { id: 'my7', date: '2026-05-11', name: 'Butterfly Songs', type: 'music' },
  { id: 'my8', date: '2026-05-12', name: 'Nature Press', type: 'art' },
  { id: 'my9', date: '2026-05-13', name: 'Jungle Beats', type: 'music' },
  { id: 'my10', date: '2026-05-14', name: 'Traffic Light Movers', type: 'movement' },
  { id: 'my11', date: '2026-05-16', name: 'Mixing Bowls', type: 'sensory' },
  { id: 'my12', date: '2026-05-18', name: 'Butterfly Songs', type: 'music' },
  { id: 'my13', date: '2026-05-19', name: 'Paint the Ocean Blue', type: 'special' },
  { id: 'my14', date: '2026-05-20', name: 'Glowing Fish Day', type: 'special' },
  { id: 'my15', date: '2026-05-21', name: 'Sea Animal Rescue Day', type: 'special' },
  { id: 'my16', date: '2026-05-23', name: 'Baby Beluga Sings', type: 'special' },
  { id: 'my17', date: '2026-05-25', name: 'Rainbow Swirl', type: 'art' },
  { id: 'my18', date: '2026-05-26', name: 'Jungle Beats', type: 'music' },
  { id: 'my19', date: '2026-05-27', name: 'Push it Pull It', type: 'movement' },
  { id: 'my20', date: '2026-05-28', name: 'Traffic Light Movers', type: 'movement' },
  { id: 'my20a', date: '2026-05-29', name: 'Sticky & Squishy', type: 'art' },
  { id: 'my21', date: '2026-05-30', name: 'Rip & Stick', type: 'art' },
];

export const JUNE_2026_SESSIONS: Session[] = [
  { id: 'jn1', date: '2026-06-01', name: 'Dust & Swirl', type: 'art' },
  { id: 'jn2', date: '2026-06-02', name: 'Messy Kitchen', type: 'sensory' },
  { id: 'jn3', date: '2026-06-03', name: 'Brown Bear Beats', type: 'music' },
  { id: 'jn4', date: '2026-06-04', name: 'Build it Big', type: 'movement' },
  { id: 'jn5', date: '2026-06-05', name: 'Muddy & Greeny', type: 'sensory' },
  { id: 'jn6', date: '2026-06-06', name: 'Sticky & Squishy', type: 'art' },
  { id: 'jn7', date: '2026-06-08', name: 'Bunny Grooves', type: 'music' },
  { id: 'jn8', date: '2026-06-09', name: 'Follow the Tracks', type: 'movement' },
  { id: 'jn9', date: '2026-06-10', name: 'Grains Table', type: 'sensory' },
  { id: 'jn10', date: '2026-06-11', name: 'Dust & Swirl', type: 'art' },
  { id: 'jn11', date: '2026-06-13', name: 'Brown Bear Beats', type: 'music' },
  { id: 'jn12', date: '2026-06-15', name: 'Build it Big', type: 'movement' },
  { id: 'jn13', date: '2026-06-16', name: 'Sticky & Squishy', type: 'art' },
  { id: 'jn14', date: '2026-06-17', name: 'Messy Kitchen', type: 'sensory' },
  { id: 'jn15', date: '2026-06-18', name: 'Bunny Grooves', type: 'music' },
  { id: 'jn16', date: '2026-06-20', name: 'Follow the Tracks', type: 'movement' },
  { id: 'jn17', date: '2026-06-22', name: 'Grains Table', type: 'sensory' },
  { id: 'jn18', date: '2026-06-23', name: 'Dust & Swirl', type: 'art' },
  { id: 'jn19', date: '2026-06-24', name: 'Brown Bear Beats', type: 'music' },
  { id: 'jn20', date: '2026-06-25', name: 'Build it Big', type: 'movement' },
  { id: 'jn21', date: '2026-06-27', name: 'Muddy & Greeny', type: 'sensory' },
  { id: 'jn22', date: '2026-06-29', name: 'Sticky & Squishy', type: 'art' },
  { id: 'jn23', date: '2026-06-30', name: 'Bunny Grooves', type: 'music' },
];

// Fridays (03, 10, 17, 24, 31) and Sundays (05, 12, 19, 26) are holidays —
// no session, so those dates are simply absent. The same session runs at
// every centre each day.
export const JULY_2026_SESSIONS: Session[] = [
  { id: 'jl1', date: '2026-07-01', name: 'Glow & Shadow', type: 'art' },
  { id: 'jl2', date: '2026-07-02', name: 'Warm & Cold Splash', type: 'sensory' },
  { id: 'jl3', date: '2026-07-04', name: 'Fly High', type: 'movement' },
  { id: 'jl4', date: '2026-07-06', name: 'Smell & Sniff', type: 'sensory' },
  { id: 'jl5', date: '2026-07-07', name: 'Spider Wiggle', type: 'music' },
  { id: 'jl6', date: '2026-07-08', name: 'Mixing Bowls', type: 'sensory' },
  { id: 'jl7', date: '2026-07-09', name: 'Tunnel Adventure', type: 'movement' },
  { id: 'jl8', date: '2026-07-11', name: 'Rainbow Swirl', type: 'art' },
  { id: 'jl9', date: '2026-07-13', name: 'Bubble Pop Up', type: 'sensory' },
  { id: 'jl10', date: '2026-07-14', name: 'Busy City Runners', type: 'movement' },
  { id: 'jl11', date: '2026-07-15', name: 'Bugs & Bee Sounds', type: 'music' },
  { id: 'jl12', date: '2026-07-16', name: 'Stars & Moon', type: 'art' },
  { id: 'jl13', date: '2026-07-18', name: 'Mixing Bowls', type: 'sensory' },
  { id: 'jl14', date: '2026-07-20', name: 'Spider Wiggle', type: 'music' },
  { id: 'jl15', date: '2026-07-21', name: 'Busy City Runners', type: 'movement' },
  { id: 'jl16', date: '2026-07-22', name: 'Nature Press', type: 'art' },
  { id: 'jl17', date: '2026-07-23', name: 'Bugs & Bee Sounds', type: 'music' },
  { id: 'jl18', date: '2026-07-25', name: 'Warm & Cold Splash', type: 'sensory' },
  { id: 'jl19', date: '2026-07-27', name: 'Stars & Moon', type: 'art' },
  { id: 'jl20', date: '2026-07-28', name: 'Fly High', type: 'movement' },
  { id: 'jl21', date: '2026-07-29', name: 'Glow & Shadow', type: 'art' },
  { id: 'jl22', date: '2026-07-30', name: 'Smell & Sniff', type: 'sensory' },
];

// Fridays and Sundays are holidays (absent). Mon 14 Sep is also a holiday
// (day after Ganesh Chaturthi). Alternate Saturdays are BIG playdates:
// Ganesh Chaturthi (12th) and Taco Tuesday (26th).
export const SEPTEMBER_2026_SESSIONS: Session[] = [
  { id: 'sp1', date: '2026-09-01', name: 'Frost & Shine', type: 'art' },
  { id: 'sp2', date: '2026-09-02', name: 'Sand Dune Scoop', type: 'sensory' },
  { id: 'sp3', date: '2026-09-03', name: 'Barnyard Beats', type: 'music' },
  { id: 'sp4', date: '2026-09-05', name: 'Welcome to the Circus', type: 'movement' },
  { id: 'sp5', date: '2026-09-07', name: 'Cupcake Dots', type: 'art' },
  { id: 'sp6', date: '2026-09-08', name: 'Petal Bloom Basket', type: 'sensory' },
  { id: 'sp7', date: '2026-09-09', name: 'Gumboot Stomp', type: 'movement' },
  { id: 'sp8', date: '2026-09-10', name: 'Penguin Waddles', type: 'movement' },
  { id: 'sp9', date: '2026-09-12', name: 'Ganesh Chaturthi Special', type: 'special', big: true },
  { id: 'sp10', date: '2026-09-15', name: 'Paw Patrol', type: 'art' },
  { id: 'sp11', date: '2026-09-16', name: 'Sand Dune Scoop', type: 'sensory' },
  { id: 'sp12', date: '2026-09-17', name: 'Penguin Waddles', type: 'movement' },
  { id: 'sp13', date: '2026-09-19', name: 'The Tiger Who Came to Tea', type: 'music' },
  { id: 'sp14', date: '2026-09-21', name: 'Frost & Shine', type: 'art' },
  { id: 'sp15', date: '2026-09-22', name: 'Petal Bloom Basket', type: 'sensory' },
  { id: 'sp16', date: '2026-09-23', name: 'Barnyard Beats', type: 'music' },
  { id: 'sp17', date: '2026-09-24', name: 'Gumboot Stomp', type: 'movement' },
  { id: 'sp18', date: '2026-09-26', name: 'Taco Tuesday', type: 'sensory', big: true },
  { id: 'sp19', date: '2026-09-28', name: 'Cupcake Dots', type: 'art' },
  { id: 'sp20', date: '2026-09-29', name: 'Sand Dune Scoop', type: 'sensory' },
  { id: 'sp21', date: '2026-09-30', name: 'Barnyard Beats', type: 'music' },
];

export const ALL_SESSIONS: Record<string, Session[]> = {
  'February 2026': FEBRUARY_2026_SESSIONS,
  'March 2026': MARCH_2026_SESSIONS,
  'April 2026': APRIL_2026_SESSIONS,
  'May 2026': MAY_2026_SESSIONS,
  'June 2026': JUNE_2026_SESSIONS,
  'July 2026': JULY_2026_SESSIONS,
  'September 2026': SEPTEMBER_2026_SESSIONS,
};

export const AVAILABLE_MONTHS = [
  'February 2026',
  'March 2026',
  'April 2026',
  'May 2026',
  'June 2026',
  'July 2026',
  'September 2026',
];

export interface SessionActivity {
  name: string;
  description: string;
  setup: string[];
  whatToSay: string[];
  goal: string;
  // Optional differentiation, shown when present.
  ifNotReady?: string;
  ifReadyForMore?: string;
}

export interface SessionPlan {
  overview: string;
  // Optional session-level "big goals" line, shown under the overview.
  bigGoals?: string;
  freePlay: {
    purpose: string;
    setup: string[];
    teacherModels: string;
    whatToSay: string[];
  };
  activities: SessionActivity[];
  materials: string[];
}

export const SESSION_PLANS: Record<string, SessionPlan> = {
  'Penguin Waddles': {
    overview: `A movement playdate exploring four different ways to move like a penguin — dancing and freezing to music, waddling an egg to the nest, sliding on the ice, and chasing slippery fish. The energy builds and then winds down into a warm huddle.`,
    bigGoals: `move, climb and balance using the whole body · move to sounds and simple cues · practise little hand and finger control`,
    freePlay: {
      purpose: `To gently invite children into the penguin theme through cold and smooth polar textures before the big movement begins.`,
      setup: [
        `Lay out white fleece "snow", crinkly foil "ice", smooth blue satin "sea" and a sealed cold water bottle to touch`,
        `Scatter a few felt fish to find among them`,
        `All items large and safe; the cold bottle stays sealed`,
        `Parents describe the textures and temperatures as children explore`,
      ],
      teacherModels: `The teacher touches the cold bottle, says "brrr — cold ice," strokes the smooth "sea," and pauses. Parents watch first, copy once, then pause and let the child explore the textures.`,
      whatToSay: [`Cold.`, `Smooth.`, `Brrr.`, `Your turn.`],
    },
    activities: [
      {
        name: `Penguin Dance & Freeze`,
        description: `Children dance along to the penguin song, copying the growing set of moves, and freeze each time the music stops.`,
        setup: [
          `Open, clear floor space`,
          `Play Penguin Dance by Jack Hartmann (https://www.youtube.com/watch?v=uf0uKmKwnKs)`,
          `Parents dance beside their child and freeze with them so the stop is modelled`,
        ],
        whatToSay: [`Dance.`, `Waddle.`, `Freeze.`, `Again.`],
        goal: `Move to sounds and simple cues (start / stop)`,
        ifNotReady: `parent holds the child's hands and waddles with them; freezing is optional.`,
        ifReadyForMore: `the child leads a "March of the Penguins" line for the group to follow.`,
      },
      {
        name: `Waddle to the Nest`,
        description: `Children carry their egg, waddle like a penguin to the nest, tuck it in, and sit down gently to keep it warm.`,
        setup: [
          `One beanbag "egg" per child; a "nest" a short waddle away, with the path cleared`,
          `Children hold the egg in both hands or hug it to the tummy, waddle with flat penguin arms and little side-to-side steps, place it in the nest, then squat or sit beside it`,
          `No balancing on the feet — carrying and waddling is the task`,
        ],
        whatToSay: [`Egg.`, `Waddle.`, `Nest.`, `Sit.`, `Warm.`],
        goal: `Move, climb and balance using the whole body (waddling gait and squatting)`,
        ifNotReady: `parent waddles alongside holding the child's hand; just carrying and sitting is plenty.`,
        ifReadyForMore: `gently roll the egg along the floor to the nest with both hands (penguins roll their eggs!), then sit beside it.`,
      },
      {
        name: `Slide & Swim on the Ice`,
        description: `Children lie on the "ice" and slide on their tummies, then flap their wings and "dive in to swim."`,
        setup: [
          `A smooth mat or sheet as the ice; bare feet or grippy socks, no loose socks`,
          `Short slides on the soft mat only`,
          `Sing I'm a Little Penguin to the tune of I'm a Little Teapot (https://www.youtube.com/watch?v=eDHE6J9auSA): "I'm a little penguin, black and white… I can't fly but I love to swim, so I flap my wings and dive right in!"`,
        ],
        whatToSay: [`Slide.`, `Whoosh.`, `Flap.`, `Swim.`],
        goal: `Move the whole body (core and crawling)`,
        ifNotReady: `parent gently slides the child along the mat a short way.`,
        ifReadyForMore: `the child slides, then "swims" across the floor flapping both arms before standing up.`,
      },
      {
        name: `Slippery Fish Chase`,
        description: `The fish are swimming away across the ice! Children waddle and slide after them, scoop them up, and bring their catch home to the family huddle.`,
        setup: [
          `Scatter felt fish on the blue-cloth "sea"; a grown-up gently slides a fish along the floor by hand so it "swims away" for the child to chase and grab — no strings or ribbons (a trip and tangle risk at this age)`,
          `One shared basket as the "catch"`,
          `Part 2 (with parent): everyone huddles in close "to share the catch and keep warm," the child snuggling into the parent's lap for a gentle rock while they count the fish together`,
          `Finish with a water break "after all that waddling"`,
        ],
        whatToSay: [`Swim.`, `Chase.`, `Catch it!`, `Home.`, `Huddle.`],
        goal: `Move the whole body to chase and grasp, then wind down together`,
        ifNotReady: `the grown-up holds a fish still or slides it slowly for an easy grab.`,
        ifReadyForMore: `the child chases and catches two fish, or picks each one up with a neat pinch before dropping it in the basket.`,
      },
    ],
    materials: [
      `Beanbags or small soft balls (the "eggs" — one per child)`,
      `Smooth mat, gym mat or sheet (the sliding "ice")`,
      `Large felt fish`,
      `Blue cloth (the "sea")`,
      `A "nest" — cushion, basket or taped floor circle`,
      `Speaker for music`,
      `Icy-world touch materials for Free Play (white fleece "snow", crinkly foil "ice", smooth blue satin "sea", a sealed cold water bottle)`,
    ],
  },
  'Taco Tuesday': {
    overview: `A taco-kitchen sensory session moving through four different textures and senses — shredding the fillings, mashing pretend guacamole, building the taco, then smelling and tasting a real one. No child is ever pushed to touch or taste.`,
    bigGoals: `adapt to new tastes and smells · explore different textures · notice differences in food and nature`,
    freePlay: {
      purpose: `To gently invite children into the taco kitchen through lots of different textures and pretend cooking before structured activities begin.`,
      setup: [
        `Set up a few "stations" so children can move to whatever draws them in:`,
        `Dry corn tray — a shallow tray of dry polenta or cornmeal (the "flour") with scoops, cups and small pots to run hands through`,
        `Tissue "cheese" basket — yellow tissue paper to scrunch, tear and sprinkle, plus a couple of soft squishy "tomatoes" to squeeze`,
        `Taco stand — empty pots, pans, wooden spoons, small plates and felt vegetables to stir, "cook" and serve to a grown-up`,
        `Cool crinkle corner — smooth foil "wraps" and crinkly cellophane to crunch and fold`,
        `Keep quantities generous and everything larger than a mouth; damp cloth and wipes nearby`,
        `Invite, don't insist — a child who prefers to watch may simply look`,
      ],
      teacherModels: `The teacher moves slowly between two stations — runs a hand through the dry corn and lets it fall, then scrunches a piece of tissue close to the ear to hear it — and pauses. Parents watch first, copy once, then let the child explore whichever station draws them.`,
      whatToSay: [`Feel.`, `Soft.`, `Crunchy.`, `Cook.`, `Your turn.`],
    },
    activities: [
      {
        name: `Shred the Fillings`,
        description: `Children tear and shred soft coloured paper into "lettuce and cheese" to fill their taco.`,
        setup: [
          `Pre-snip the edges of each sheet so it tears easily`,
          `Children pull and shred strips into their bowl — yellow "cheese", green "lettuce"`,
          `Supervise so pieces stay out of mouths`,
        ],
        whatToSay: [`Rip.`, `Shred.`, `Small.`, `Fill.`],
        goal: `Explore different textures (dry, papery) & notice the colours are different`,
        ifNotReady: `parent holds the top edge so the child just pulls down to tear.`,
        ifReadyForMore: `the child shreds into two separate colour piles.`,
      },
      {
        name: `Mash the Guacamole`,
        description: `Children mash and squish soft light-green dough into pretend guacamole, pulling out the "stones" first and spreading it smooth for their taco.`,
        setup: [
          `A ball of soft light-green dough per child on an individual mat, with a small bowl and a child-safe masher or fork`,
          `Hide two or three "stones" (large wooden beads or smooth pebbles, all bigger than a mouth) in each ball to find and pull out first`,
          `Children squish with hands, mash with the fork, and spread it smooth`,
          `(Messier option: light-green cloud dough or a green cornflour-and-oil mash, made fresh — closer to the real squish)`,
        ],
        whatToSay: [`Squish.`, `Stone — out!`, `Mash.`, `Smooth.`],
        goal: `Explore different textures (soft, squishy, smooth)`,
        ifNotReady: `parent presses the child's hands into the dough to squish together; finding the stone is enough.`,
        ifReadyForMore: `the child mashes until fully smooth, then scoops a spoonful into their taco shell.`,
      },
      {
        name: `Build Your Taco`,
        description: `Children place their shredded fillings, guacamole and felt vegetables inside the folded taco shell and load it up, serving it on a plate.`,
        setup: [
          `Felt taco shells, plates, and all the gathered fillings`,
          `Children choose fillings, put them inside, and fold the shell over — a light "ssss" cooking sound as it goes on the plate to "warm through"`,
          `Fillings all larger than a mouth`,
        ],
        whatToSay: [`Inside.`, `More.`, `Fold.`, `Ssss — cook.`, `Serve.`],
        goal: `Notice differences in food and nature (sorting and choosing fillings)`,
        ifNotReady: `parent holds the shell open while the child drops fillings in.`,
        ifReadyForMore: `the child names each filling as it goes in.`,
      },
      {
        name: `Smell It & Taste It`,
        description: `Children smell and taste a real soft taco with their grown-up, meeting a new food gently.`,
        setup: [
          `A soft tortilla piece with a mild filling (grated cheese) per child — allergies checked`,
          `Children smell it first, then have a little taste with their grown-up if they'd like`,
          `Tasting is always optional — smelling and touching is a full turn`,
        ],
        whatToSay: [`Smell.`, `Mmm.`, `Taste.`, `Yummy.`],
        goal: `Adapt to new tastes and smells`,
        ifNotReady: `the child smells and touches the food; tasting is optional.`,
        ifReadyForMore: `the child names one thing they can smell or taste.`,
      },
    ],
    materials: [
      `Soft coloured paper or tissue (yellow, green, red) for shredding`,
      `Light-green soft playdough (the pretend guacamole), plus a few large wooden beads or smooth pebbles as "stones"`,
      `Child-safe mashers or forks`,
      `Folded felt taco shells`,
      `Large felt vegetables and cheese strips (all bigger than a mouth)`,
      `Small plates and bowls, wooden spoons, pretend pots and pans`,
      `Dry polenta or cornmeal, squishy "tomatoes", foil/cellophane (for Free Play)`,
      `Soft real tortilla pieces and a mild filling (grated cheese) for tasting — allergies checked first`,
    ],
  },
  'Paw Patrol': {
    overview: `An animal-tracks art studio where children make marks with different homemade tools — rolling bumpy tracks, stamping paw pads with cup rims, dotting claws with Q-tips, and walking animals through a muddy trail. Children's marks are left exactly as they make them.`,
    bigGoals: `spot colours through hands-on play · try simple art tools · create lines, dots and patterns`,
    freePlay: {
      purpose: `To gently invite children into the space through the DIY tools and tactile materials before structured activities begin.`,
      setup: [
        `Set out the DIY rollers, cups, bottle caps, Q-tips and dry animal figures on paper — no paint yet`,
        `Children handle the tools, roll them, and press them on the dry paper to feel the shapes`,
        `Materials spread out neatly so children can choose what draws them in`,
      ],
      teacherModels: `The teacher slowly rolls a bumpy DIY roller across the paper, presses a cup rim down to leave a ring, and pauses. Parents watch first, copy once, then pause and let the child try.`,
      whatToSay: [`Look.`, `Roll.`, `Bumpy.`, `Your turn.`],
    },
    activities: [
      {
        name: `Rolling Animal Tracks`,
        description: `Children dip a DIY textured roller in paint and roll it across their paper to make long bumpy "tracks."`,
        setup: [
          `Trays of paint and the homemade textured rollers (bubble-wrap or yarn-wrapped tubes)`,
          `One sheet of thick paper per child`,
          `Children dip and push the roller — a big whole-arm movement — leaving continuous tracks`,
        ],
        whatToSay: [`Dip.`, `Roll.`, `Track.`, `Again.`],
        goal: `Try simple art tools & create patterns`,
        ifNotReady: `parent puts a hand over the child's to push the roller together.`,
        ifReadyForMore: `the child rolls two different textured rollers and points to which tracks each one made.`,
      },
      {
        name: `Paw Pads with Cup Rims`,
        description: `Children dip cup rims and bottle caps in paint and stamp rings and circles to build up animal "paw pads."`,
        setup: [
          `Shallow plates of paint; plastic cups (dip the rim) and bottle caps (dip the open end) in a few sizes`,
          `Children press the rim down to leave a ring, and caps for small pads, grouping them into paw shapes`,
          `Wipe between colours`,
        ],
        whatToSay: [`Dip.`, `Press.`, `Ring.`, `Pad.`],
        goal: `Try simple art tools & spot colours through hands-on play`,
        ifNotReady: `parent holds the cup and the child presses it down together.`,
        ifReadyForMore: `the child stamps a big pad and small toe pads around it to make a whole paw.`,
      },
      {
        name: `Q-tip Claws & Spots`,
        description: `Children use Q-tips to dot claws, spots and dotty fur onto and around their paw prints.`,
        setup: [
          `Small pots of paint and bundles of Q-tips (several rubber-banded together makes bold dot clusters; singles for fine dots)`,
          `Children dab dots — sharp claws at the tips of pads, spots across the page`,
          `Fresh Q-tips as needed`,
        ],
        whatToSay: [`Dot.`, `Claws.`, `Spots.`, `More.`],
        goal: `Create lines, dots and patterns`,
        ifNotReady: `parent guides one Q-tip to make a few dots.`,
        ifReadyForMore: `the child makes a line of dots "walking" in one direction like a track.`,
      },
      {
        name: `The Muddy Paw Trail (group)`,
        description: `Children walk toy animals through paint and press them across a long shared "path," adding their own cup-rim and knuckle paw pads alongside to make one big muddy trail.`,
        setup: [
          `A long paper roll taped down the floor as the "path"`,
          `Trays of brown/earthy paint at intervals; plastic animals to dip feet and "walk," plus cups and fingers for extra pads`,
          `Children move along the roll adding tracks together; wipe station at the end`,
        ],
        whatToSay: [`Walk.`, `Muddy.`, `Tracks.`, `Together.`, `Stop.`],
        goal: `Create lines, dots and patterns & spot colours through hands-on play`,
        ifNotReady: `parent helps the child "walk" one animal a few steps along the path.`,
        ifReadyForMore: `the child follows the trail to the end and names which animal made which tracks.`,
      },
    ],
    materials: [
      `Non-toxic, taste-safe washable paint`,
      `Soft playdough (optional Free Play texture)`,
      `DIY textured rollers — cardboard tubes or an old rolling pin wrapped in bubble wrap, or with chunky yarn/foam shapes glued on and banded (make in advance)`,
      `Plastic cups and bottle caps (for stamping rims and circles)`,
      `Q-tips / cotton buds (bundles and singles)`,
      `Small plastic animal figures`,
      `Low trays / shallow plates for paint`,
      `Thick paper (one sheet per child)`,
      `One long paper roll for the group trail`,
      `Wipes, towel, smocks`,
    ],
  },
  'The Tiger Who Came to Tea': {
    overview: `A music and storytelling playdate built around a very hungry tiger and a special tea party. Children explore pouring, rhythm, pretend play, and movement through hands-on tea stations and crafting signature teacup shakers.`,
    freePlay: {
      purpose: `To gently invite children into music and storytelling through teatime props, tiger visuals, and simple sound-makers before structured activities begin.`,
      setup: [
        `Set up soft floor mats in a circle`,
        `Provide a low table or mat set up with empty teapots, cups, soft play food, one tiger puppet, and one pre-made teacup shaker`,
      ],
      teacherModels: `The teacher sits and quietly pours from an empty teapot into a cup, picks up the teacup shaker, shakes it once, and takes a pretend sip. Parents watch first, copy once, then pause and allow the child to respond.`,
      whatToSay: [`Pour.`, `Tea.`, `Shake.`, `Your turn.`],
    },
    activities: [
      {
        name: `Tiger's Tea Party (Water Pouring)`,
        description: `Children pour water from small teapots into cups, exploring the sensory feel and the everyday sounds of a bustling tea party.`,
        setup: [
          `One shallow water tray per child, small teapots with water, plastic teacups, and towels underneath`,
        ],
        whatToSay: [`Pour.`, `Splash.`, `Full.`, `Again.`],
        goal: `Copy everyday sounds`,
      },
      {
        name: `Signature Instrument: Teacup Shakers`,
        description: `Children scoop rice or beans into their teacups, seal them, and explore the new sounds they've created by shaking their "tea."`,
        setup: [
          `One teacup and lid per child, small bowls of dry rice, scoops, and tape to secure lids. Keep bowls half-filled so it doesn't spill instantly`,
        ],
        whatToSay: [`Scoop.`, `Fill.`, `Seal.`, `Shake.`, `Listen.`],
        goal: `Make sounds and hear what happens`,
      },
      {
        name: `Interactive Story with the Hungry Tiger`,
        description: `Read the story while bringing the tiger puppet around the circle. Children use their new teacup shakers to make chomping, gulping, and drinking sounds every time the tiger eats or drinks.`,
        setup: [
          `The Tiger Who Came to Tea book, tiger puppet handled by the teacher, children holding shakers in a circle`,
        ],
        whatToSay: [`Tiger.`, `Hungry.`, `Eat.`, `Gulp.`, `Shake.`],
        goal: `Sing and act familiar songs and rhymes`,
      },
      {
        name: `Tiger Prowl and Freeze Dance`,
        description: `Children move like tigers — creeping softly, stomping loudly, and freezing when the music stops, using their whole bodies to express the story.`,
        setup: [
          `Open movement space, speaker playing a playful prowling beat, parents standing beside their child`,
        ],
        whatToSay: [`Creep.`, `Soft.`, `Stomp.`, `Loud.`, `Freeze.`, `Again.`],
        goal: `Sing and act familiar songs and rhymes`,
      },
    ],
    materials: [
      `The Tiger Who Came to Tea book`,
      `Tiger hand puppet or soft toy`,
      `Plastic or sturdy paper teacups with secure lids`,
      `Dry rice or beans`,
      `Scoops and small bowls`,
      `Small, child-sized teapots or pouring jugs`,
      `Shallow water trays and towels`,
      `Soft play food (pretend cakes, buns, sandwiches)`,
      `Floor mats`,
      `Speaker for background music`,
    ],
  },
  'Dust & Swirl': {
    overview: 'An exploratory art session where toddlers discover textures through dust, powder, and swirling movements. Children use funnels, flour, and finger painting to create patterns and explore visual contrasts.',
    freePlay: {
      purpose: 'To spark curiosity and invite children into the space through abundant, attractive materials.',
      setup: [
        'Set up one large surface with wide bowls of dry flour, scoops, cups, funnels, sieves, shredded paper, and clear bottles.',
        'Materials should be spread out neatly so children can see everything and choose what draws them in.'
      ],
      teacherModels: 'The teacher sits inside the play space and slowly scoops, pours, and fills. The teacher moves hands clearly and calmly. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Look.', 'Pour.', 'Fill.', 'Your turn.', 'Again.', 'Slow.']
    },
    activities: [
      {
        name: 'Flour Funnel Table',
        description: 'Provide a bowl of dry flour, a funnel, and a container to each child. Children pour flour through the funnel.',
        setup: ['One funnel + one bowl + one container per child', 'Keep flour bowls half-filled so it doesn\'t spill instantly'],
        whatToSay: ['Wow! The flour falls downnnn.', '(Raise funnel) Up, up, up…', '(Pour) It falls downnnn.', '(Lower funnel) Down, down, down…'],
        goal: 'Try simple art tools'
      },
      {
        name: 'Flour & Colour Bowl Drip Play',
        description: 'Offer thick flour paste on paper. Children swirl, drag, and spread paste using fingers.',
        setup: ['One paper per child', 'One bowl of thick paste per child', 'Keep the paste thick, not watery'],
        whatToSay: ['Round and round.', 'Swirl.', 'Slow.'],
        goal: 'Create lines, dots, and patterns'
      },
      {
        name: 'Black & White Circle Marks',
        description: 'Provide two kinds of circle sheets — white sheet with bold black circle and black sheet with bold white circle. Children finger-paint along and around the circle.',
        setup: ['Two sheet types per child (one black, one white)', 'Draw circles using permanent marker', 'Paint bowls contain primary colours mixed with flour slurry', 'Fingers only'],
        whatToSay: ['Round.', 'Go around.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      },
      {
        name: 'Stuff the Bottle: Contrast Bits',
        description: 'Children pick up paper bits and push them into clear bottles. They stuff, shake, and watch patterns build inside.',
        setup: ['Clear bottles standing open', 'Shredded black and white paper bits in wide bowls', 'Coloured paper shred in separate bowls', 'Add coloured stickers on bottles for matching'],
        whatToSay: ['Match.', 'In.', 'More.'],
        goal: 'Spot colours through hands-on play'
      }
    ],
    materials: ['Dry flour', 'Funnels', 'Bowls & containers', 'Thick flour paste', 'Paper (black & white)', 'Permanent markers', 'Clear bottles', 'Shredded paper bits', 'Colour stickers']
  },
  'Messy Kitchen': {
    overview: 'A sensory-rich experience using kitchen materials for exploration and discovery. Children explore textures through pretend cooking, clay cutting, and soup-making activities.',
    freePlay: {
      purpose: 'To gently invite children into sensory exploration through familiar "kitchen-like" materials before structured activities begin.',
      setup: [
        'One large surface with: dry pasta, bowls, cups, ladles, spoons, soft clay lumps, empty pots and containers, pretend food toys',
        'Materials are spread out neatly with plenty of quantity so children can see, touch, and choose.'
      ],
      teacherModels: 'The teacher sits inside the space and quietly scoops, pours, taps, and stirs. Movements are slow and clear. Parents watch first, copy once, then pause and allow the child to explore.',
      whatToSay: ['Scoop.', 'Pour.', 'Stir.', 'Your turn.']
    },
    activities: [
      {
        name: 'Kitchen Prep Sensory Bin',
        description: 'Children pluck yarn pieces and pom poms using tongs or fingers and drop them into cups.',
        setup: ['One bin per child', 'Yarn pieces + pom poms mixed together', 'Tongs / tweezers', 'Empty cups or bowls'],
        whatToSay: ['Pick.', 'Drop.', 'Soft.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Pasta Painting with Spoons',
        description: 'Children dip pasta into paint using spoons and drop or spread it on paper like "cooking".',
        setup: ['Large paper sheets', 'Bowls of washable paint', 'Cooked pasta (large shapes)', 'Spoons only (no fingers here)'],
        whatToSay: ['Scoop.', 'Drop.', 'Spread.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Clay Carrot Cutting',
        description: 'Children press and "slice" soft clay carrots using safe cutters.',
        setup: ['Soft clay rolled into carrot shapes', 'Laminated boards', 'Safe plastic cutters'],
        whatToSay: ['Press.', 'Cut.', 'Hard.'],
        goal: 'Notice simple sensory differences (hard/soft)'
      },
      {
        name: 'Veggie Soup Sensory Pot',
        description: 'Children scoop, stir, pour, and "serve" pretend veggie soup.',
        setup: ['Large tub with coloured water', 'Pasta + plastic vegetables', 'Ladles, cups, bowls'],
        whatToSay: ['Stir.', 'Pour.', 'Hot.'],
        goal: 'Gently introduce new smells and tastes through pretend cooking'
      }
    ],
    materials: ['Dry pasta shapes', 'Bowls & cups', 'Ladles & spoons', 'Soft clay', 'Plastic cutters', 'Yarn pieces', 'Pom poms', 'Tongs', 'Washable paint', 'Plastic vegetables']
  },
  'Brown Bear Beats': {
    overview: 'A musical journey inspired by the classic book "Brown Bear, Brown Bear" with rhythm and movement. Children explore sound, story, and movement through puppets, tambourines, and freeze dancing.',
    freePlay: {
      purpose: 'To gently invite children into music and story through familiar animal pictures, sounds, and simple instruments before structured activities begin.',
      setup: [
        'Prepare and display Brown Bear animal pictures: Brown Bear, Red Bird, Yellow Duck, Blue Horse, Green Frog, Purple Cat, White Dog',
        'Print one clear picture of each animal (A4 or A5 size), use bold colours, simple illustrations, laminate if possible',
        'Soft floor mats in a circle',
        'One small basket with simple sound-makers (shakers / bells / one tambourine)'
      ],
      teacherModels: 'The teacher sits in the circle and quietly points to one animal picture, taps or shakes a sound-maker once. Movements are slow and repeated. Parents watch first, copy once, then pause and allow the child to respond.',
      whatToSay: ['Tap.', 'Shake.', 'Bear.', 'Your turn.']
    },
    activities: [
      {
        name: 'Puppet Story + I-Spy Match',
        description: 'Read Brown Bear, Brown Bear, What Do You See? using simple straw puppets. When an animal appears, children point to the matching animal picture.',
        setup: ['Brown Bear, Brown Bear book', 'Straw puppets for: Brown Bear, Red Bird, Yellow Duck, Blue Horse, Green Frog, Purple Cat, White Dog', 'Animal pictures from Free Play remain displayed'],
        whatToSay: ['Bear.', 'I see.', 'Where?', 'There!'],
        goal: 'Copy everyday sounds (animals)'
      },
      {
        name: 'Brown Bear Name Beats',
        description: 'Sing a fixed chant and tap the tambourine once when each child\'s name is said. Chant: "Brown Bear, Brown Bear, who do I see? I see [child name] looking at me!"',
        setup: ['One tambourine', 'Children seated in a circle'],
        whatToSay: ['Listen.', 'Tap.', 'Your name.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Brown Bear Feet Trail',
        description: 'Children colour big bear feet cutouts, then walk the trail across the room like Brown Bear.',
        setup: ['Large bear feet cutouts', 'Brown crayons or sponge dabbers', 'Feet placed in a simple straight or curved path on the floor'],
        whatToSay: ['Step.', 'Stomp.', 'Bear walk.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Brown Bear Walk, Freeze & Wiggle',
        description: 'Children move with scarves as they walk, freeze, and wiggle different body parts to "Walking, Walking" by Super Simple Songs.',
        setup: ['One light scarf per child', 'One open movement space', 'Speaker placed to one side'],
        whatToSay: ['Walk.', 'Freeze.', 'Wiggle feet.', 'Wiggle hands.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Brown Bear book', 'Animal pictures (A4/A5)', 'Straw puppets', 'Tambourine', 'Shakers & bells', 'Scarves', 'Bear feet cutouts', 'Brown crayons/dabbers', 'Floor mats']
  },
  'Build it Big': {
    overview: 'Gross motor movement session focused on building, stacking, and physical coordination. Children explore carrying, stacking, obstacle courses, and hammer play.',
    freePlay: {
      purpose: 'Construction Site Warm-Up — Children pick up large plastic balls from one "construction well" and carry them to another well placed far away.',
      setup: [
        'Mark 3 large shapes on the floor using tape (rectangle, circle, triangle)',
        'Put many large plastic balls inside each shape well',
        'Place shape wells far apart',
        'Keep buckets near wells (optional use)'
      ],
      teacherModels: 'Teacher picks one ball → walks → drops. Parents copy once. Parents then pause and let the child do.',
      whatToSay: ['Pick.', 'Carry.', 'Walk.', 'Drop.', 'Again.']
    },
    activities: [
      {
        name: 'Build the Towers',
        description: 'Parents and children build soft-block towers and roll balls through the tower. Parent can sit inside the tower and roll balls from inside → outside.',
        setup: ['Large soft foam blocks', 'Large plastic balls', 'One clear build zone'],
        whatToSay: ['Build.', 'Stack.', 'Roll.', 'In.', 'Out.', 'Crash!', 'Again.'],
        goal: 'Move the whole body'
      },
      {
        name: 'Crane Obstacle Course',
        description: 'Children complete a mini obstacle "site" using taped paths, tunnel crawl, step up/down, and pushing a cylinder block up/down a ramp.',
        setup: ['Straight taped line', 'Zig-zag taped line', 'Tunnel', 'Soft block step-up / step-down', 'Cylinder soft block (to push)', 'Triangular elevated soft block (ramp)'],
        whatToSay: ['Walk.', 'Slow.', 'Crawl.', 'Up.', 'Down.', 'Push.', 'Follow.'],
        goal: 'Move with music and simple cues (follow / slow)'
      },
      {
        name: 'Builder Slow Flow',
        description: 'Movement activity to Bob the Builder theme song. Crane arms up/down, sit/stand, parent lifts child (excavator stamp), build a soft-block truck together.',
        setup: ['Open space', 'Soft blocks nearby', 'Bob the Builder theme song'],
        whatToSay: ['Up.', 'Down.', 'Sit.', 'Stand.', 'Slow.', 'Again.'],
        goal: 'Move with music and simple cues (stop–go / slow)'
      },
      {
        name: 'Hammer & Build — Builder Tool Play',
        description: 'Children use safe wooden hammers to push large pegs/nails into soft sponge or clay boards, copying simple builder actions and rhythms.',
        setup: ['Soft sponge boards or thick foam blocks (one per child)', 'Large blunt pegs / plastic nails', 'Wooden toddler hammers', 'Children seated on floor in a semi-circle'],
        whatToSay: ['Tap.', 'Bang.', 'Push.', 'Soft.', 'Strong.', 'Again.'],
        goal: 'Move the whole body with controlled arm and wrist movement'
      }
    ],
    materials: ['Large plastic balls', 'Soft foam blocks', 'Tape', 'Tunnel', 'Cylinder blocks', 'Ramp blocks', 'Wooden toddler hammers', 'Soft sponge boards', 'Blunt pegs/nails']
  },
  'Around the World': {
    overview: 'A special cultural exploration session celebrating diversity through music, art, and stories. Children explore the Earth, build monuments, make pretend pizza, create Koinobori flying carp, and dance like penguins.',
    freePlay: {
      purpose: 'Earth Light Table Play — Children explore the Earth using colour, light and open-ended arrangement.',
      setup: [
        'One large taped circle on the light table',
        'Inside the circle place: green cellophane paper bits, blue cellophane paper bits, one clear picture of the Earth'
      ],
      teacherModels: 'Teacher places one blue piece, places one green piece, pauses. Parents copy once. Parents pause and let child explore.',
      whatToSay: ['Blue.', 'Green.', 'Earth.', 'Again.']
    },
    activities: [
      {
        name: 'Monuments Around the World',
        description: 'Children build and rebuild famous world monuments using blocks.',
        setup: ['Wooden or foam blocks', 'One open build zone'],
        whatToSay: ['Tall.', 'Short.', 'Build.', 'Again.'],
        goal: 'Explore shapes, size and spatial thinking'
      },
      {
        name: 'Make Pretend Pizza with Ratatouille',
        description: 'Children follow a simple pretend cooking story led by Ratatouille.',
        setup: ['Pretend pizza base', 'Felt / toy toppings', 'Bowls and spoons'],
        whatToSay: ['Put.', 'Mix.', 'Bake.', 'Eat.'],
        goal: 'Build listening, vocabulary and follow-the-steps focus'
      },
      {
        name: 'Koinobori Flying Carp',
        description: 'Children explore a cultural symbol from Asia through art and pattern.',
        setup: ['Hanging carp (Koinobori)', 'Colourful paper scales'],
        whatToSay: ['Red.', 'Blue.', 'Pattern.', 'Again.'],
        goal: 'Explore colour and cultural symbols'
      },
      {
        name: 'Dancing with Penguins',
        description: 'Children move like penguins in the snow to the Penguin Dance Song.',
        setup: ['Open movement space', 'Parents beside child', 'No props'],
        whatToSay: ['Waddle.', 'Slide.', 'Flap.', 'Freeze.'],
        goal: 'Build balance, coordination and stop–go control'
      }
    ],
    materials: ['Light table', 'Cellophane paper (blue & green)', 'Earth picture', 'Wooden/foam blocks', 'Pretend pizza base', 'Felt toppings', 'Koinobori carp', 'Paper scales']
  },
  'Grains Table': {
    overview: 'Deep sensory exploration with various grains and seeds. Children discover textures through rolling, pounding, pouring, and pretend cooking with rice, oats, flour, and pasta.',
    freePlay: {
      purpose: 'Grain Discovery Table — To gently invite children into sensory exploration through safe grain textures before structured activities begin.',
      setup: [
        'One large surface with: bowls of rice, oats, flour, and pasta',
        'Cups, scoops, funnels, spoons',
        'Empty bowls and containers',
        'Materials should be spread out neatly and in large quantities'
      ],
      teacherModels: 'The teacher sits inside the space and slowly scoops, pours, and lets grains fall. Movements are slow and clear. Parents watch first, copy once, then pause and allow the child to explore.',
      whatToSay: ['Pour.', 'Fall.', 'Slow.', 'Your turn.']
    },
    activities: [
      {
        name: 'Rolling Pin Sensory Bags',
        description: 'Children roll a pin over sealed sensory bags filled with grains and flour.',
        setup: ['Zip-lock or sealed bags with one material per bag (rice, oats, pasta, flour)', 'Rolling pins or cylinders', 'Bags taped securely to the table or floor'],
        whatToSay: ['Roll.', 'Push.', 'Crunch.', 'Soft.'],
        goal: 'Notice simple sensory differences (soft / hard)'
      },
      {
        name: 'Pound + Pour Bottles',
        description: 'Children pound grains in a bowl, then pour them into bottles using a funnel.',
        setup: ['Bowls with grains', 'Safe pounding tools (wooden pestle / thick spoon)', 'Funnels', 'Clear bottles'],
        whatToSay: ['Bang.', 'Pour.', 'Again.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Mini Chapati Dough',
        description: 'Children mix flour and water, squish and pat dough into flat shapes.',
        setup: ['Small bowls of flour', 'Water cups', 'Mats or plates for patting'],
        whatToSay: ['Squish.', 'Pat.', 'Soft.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Porridge for Mama',
        description: 'Children pretend-cook porridge, stir, scoop and serve.',
        setup: ['Bowls with oats / soft grain mix', 'Spoons and ladles', 'Empty cups and bowls', 'Pretend stove & other pretend utensils'],
        whatToSay: ['Stir.', 'Hot.', 'Serve.'],
        goal: 'Gently introduce new smells and tastes through pretend cooking'
      }
    ],
    materials: ['Rice', 'Oats', 'Flour', 'Pasta', 'Containers', 'Funnels', 'Scoops', 'Rolling pins', 'Zip-lock bags', 'Pounding tools', 'Clear bottles']
  },
  'Bunny Grooves': {
    overview: 'A bouncy music session with bunny-themed songs and movement. Children explore soft textures, interactive stories, shaker songs, and freeze dancing.',
    freePlay: {
      purpose: 'Fluffy Bunny Sensory Table — To gently invite children into the space through soft, familiar textures and quiet sound play before structured music activities begin.',
      setup: [
        'One large surface with: cotton balls, white pom poms, felt carrots, small finger bells (loose, not attached)',
        'Wide bowls and shallow trays',
        'Materials should be neatly spread out, soft-looking, and abundant'
      ],
      teacherModels: 'The teacher sits inside the space, quietly squeezes cotton, rolls pom poms, lifts one bell and shakes once. Movements are slow, calm, and minimal.',
      whatToSay: ['Soft.', 'Bell.', 'Shake.', 'Your turn.', 'Again.']
    },
    activities: [
      {
        name: 'Pat the Bunny — Interactive Story Moment',
        description: 'Read Pat the Bunny slowly, allowing children to touch, point, and respond to each page.',
        setup: ['Pat the Bunny board book', 'Children seated with parents in a close semi-circle', 'No extra props — book interaction only'],
        whatToSay: ['Pat.', 'Touch.', 'Bunny.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes (early story participation)'
      },
      {
        name: 'Ting-Ting Carrot Wand',
        description: 'Children use carrot shaker wands to sing, shake, move, and play a guided shaker song, followed by a parent–child bunny chase game.',
        setup: ['One carrot shaker wand per child', 'Open movement space', 'Parents stand beside their child'],
        whatToSay: ['Shake.', 'Up.', 'Down.', 'Fast.', 'Slow.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Rabbit Ears Freeze Dance',
        description: 'Children move like bunnies to "Hop Little Bunnies" — hopping, running, slowing down, freezing, and changing direction.',
        setup: ['Open movement space', 'Speaker placed to one side', 'Parents stand beside their child', 'No props needed'],
        whatToSay: ['Hop.', 'Run.', 'Slow.', 'Fast.', 'Freeze.', 'Circle.', 'Line.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Bunny Lullaby Close',
        description: 'End the session with a calm cuddle moment using a soft bunny song: "Sleepy bunny, sleepy bunny, time to rest now, close your eyes…"',
        setup: ['Children seated with parents', 'Dim lights if possible', 'No instruments'],
        whatToSay: ['Sleepy.', 'Calm.', 'Bunny.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Cotton balls', 'White pom poms', 'Felt carrots', 'Finger bells', 'Pat the Bunny book', 'Carrot shaker wands', 'Speaker', 'Bunny ear headbands (optional)']
  },
  'Follow the Tracks': {
    overview: 'Movement session following tracks, trails, and pathways. Children explore push-pull play, barefoot sensory paths, obstacle trails, and train games.',
    freePlay: {
      purpose: 'Wagon & Pulley Tracks — Children move wagons and pulley carts along a taped floor track, exploring push–pull movement freely.',
      setup: [
        'Tape one large looping track on the floor (train-style curve)',
        'Small wagons / carts',
        'Pulley toys or pull-along toys',
        'Keep space open and uncluttered'
      ],
      teacherModels: 'Teacher pushes wagon slowly along track. Parents copy once. Parents pause and let child explore.',
      whatToSay: ['Push.', 'Pull.', 'Go.', 'Slow.', 'Again.']
    },
    activities: [
      {
        name: 'Barefoot Sensory Path',
        description: 'Children walk barefoot across different textures using slow steps, stomps, and tiptoes.',
        setup: ['Create one straight path using: towel, yoga mat, scarf, cushion, bubble wrap', 'Shoes off', 'Parents beside child'],
        whatToSay: ['Step.', 'Soft.', 'Stomp.', 'Tiptoe.', 'Again.'],
        goal: 'Move the whole body'
      },
      {
        name: 'Follow the Trails',
        description: 'Children follow a taped trail with simple actions along the way: step in hoop, go around cone, step over cushion, jump over "river" line.',
        setup: ['Tape one continuous trail', 'Hoop (step inside)', 'Cone (go around)', 'Cushion (step over)', 'One taped "river" line (jump)'],
        whatToSay: ['Follow.', 'In.', 'Around.', 'Over.', 'Jump.', 'Freeze.'],
        goal: 'Move with simple cues (follow / stop–go)'
      },
      {
        name: 'Kick, Walk & Stand–Sit',
        description: 'Three-part activity: Balloon feet kicks, hand walking (parent holds child\'s legs), and stand up–sit down to "Stand Up, Sit Down" by Patty Shukla.',
        setup: ['Balloons tied at knee–waist height', 'Open mat space', 'Soft blocks to sit on'],
        whatToSay: ['Kick.', 'Up.', 'Walk.', 'Hands.', 'Stand.', 'Sit.', 'Again.'],
        goal: 'Move with music and simple cues (up–down, stop–go)'
      },
      {
        name: 'Choo-Choo Train: Red Light, Green Light',
        description: 'Children follow a taped train track, moving and stopping based on colour cues and music to "Choo Choo Train for Children".',
        setup: ['Tape train track path on floor (loop or long curve)', 'Red, yellow, and green circles', 'Open space'],
        whatToSay: ['Go.', 'Slow.', 'Stop.', 'Train.', 'Again.'],
        goal: 'Move with simple cues (stop–go, fast–slow, follow)'
      }
    ],
    materials: ['Tape', 'Wagons/carts', 'Pull-along toys', 'Towel', 'Yoga mat', 'Scarf', 'Cushion', 'Bubble wrap', 'Hoops', 'Cones', 'Balloons', 'Soft blocks', 'Coloured circles (red/yellow/green)']
  },
  'Play Based Learning at Openhouse': {
    overview: 'A special session showcasing our play-based learning philosophy to parents. Includes jungle storytime, wheel play, big art mural, and musical movement journey.',
    freePlay: {
      purpose: 'Rumble in the Jungle — Read the book and use animal toys to narrate the story. Children join in by pointing, roaring, and copying actions.',
      setup: [
        'Book: Rumble in the Jungle',
        'Jungle animal toys (lion, elephant, giraffe, monkey, etc.)',
        'Floor circle seating'
      ],
      teacherModels: 'Teacher reads + brings out matching animal toy page-by-page. Pause for children to respond with a sound/action.',
      whatToSay: ['Roar.', 'Stomp.', 'Look.', 'Your turn.']
    },
    activities: [
      {
        name: 'Wheel Magic',
        description: 'Children explore wheels through push–pull play using pulley carts, wagons, and rolling vehicles.',
        setup: ['Pulley carts / wagons / push-pull toys', 'Tape roads on the floor (straight + curvy)', 'Simple parking spots (shapes or marked bays)'],
        whatToSay: ['Push.', 'Pull.', 'Go.', 'Park.', 'One…two…three.'],
        goal: 'Explore movement and spatial awareness'
      },
      {
        name: 'Big Art, Big Emotions',
        description: 'A giant floor mural where children paint BIG using sponges and rollers, make balloon dot prints, and finish with supervised spray-splatter.',
        setup: ['Large paper mural taped to the floor', 'Washable paint + trays', 'Sponges + rollers + balloons', 'Spray bottle for splatter (adult-handled)'],
        whatToSay: ['Big.', 'Dot.', 'Roll.', 'More.'],
        goal: 'Express creativity on a large scale'
      },
      {
        name: 'Trains & Boats Around the Room',
        description: 'A moving music journey using "Wheels on the Bus" and "Row Row Row Your Boat" with ribbon wands and bubbles.',
        setup: ['Ribbon wands (one per child)', 'Bubbles (teacher uses)', 'Open movement space'],
        whatToSay: ['Go.', 'Stop.', 'Turn.', 'Row.', 'Wait.'],
        goal: 'Follow musical cues and movement instructions'
      },
      {
        name: 'Parachute Goodbye',
        description: 'Children sit/stand under the parachute while parents and teachers move it up/down and round/round to a closing song.',
        setup: ['Parachute toy', 'Children under / around parachute', 'One simple closing song'],
        whatToSay: ['Up.', 'Down.', 'Round.', 'Slow.', 'All done.'],
        goal: 'Celebrate together and close the session'
      }
    ],
    materials: ['Rumble in the Jungle book', 'Jungle animal toys', 'Display materials', 'Activity stations', 'Pulley carts/wagons', 'Large paper mural', 'Washable paint', 'Sponges & rollers', 'Balloons', 'Spray bottles', 'Ribbon wands', 'Parachute']
  },
  'Sticky & Squishy': {
    overview: 'Tactile art exploration with sticky and squishy materials. Children explore paper-mache, finger painting on stones, and collaborative newspaper collage.',
    freePlay: {
      purpose: 'Sensory Table: Newspaper Bits, Balls & Stones — To spark curiosity and invite children into the space through rich, tactile materials.',
      setup: [
        'One large surface with: torn newspaper bits, scrunched newspaper balls, smooth stones, scoops and bowls',
        'Materials should be spread out neatly, with plenty of quantity'
      ],
      teacherModels: 'The teacher sits inside the play space and slowly tears, scrunches, rolls, and scoops. The teacher moves hands clearly and calmly. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Tear.', 'Scrunch.', 'Roll.', 'Your turn.', 'Again.', 'Slow.']
    },
    activities: [
      {
        name: 'Baby-Style Paper-Mache Tubs',
        description: 'Offer tubs of water with torn newspaper. Children tear, soak, squeeze, and mash paper — exploring the change from dry to wet and squishy.',
        setup: ['One shallow tub per child', 'Pre-torn newspaper pieces', 'Water filled just enough to soak paper (not deep)'],
        whatToSay: ['Dip.', 'Squeeze.', 'Squishy.'],
        goal: 'Try simple art tools'
      },
      {
        name: 'Black & White Paper-Mache Mixing',
        description: 'Provide paper-mache in trays. Children drip black or white paint, mix with hands or simple tools, and spread the mixture.',
        setup: ['Paper-mache base prepared in trays', 'Black and white paint only', 'Paint offered in droppers or small cups', 'Hands or simple tools (spatula / spoon)'],
        whatToSay: ['Drip.', 'Mix.', 'Again.'],
        goal: 'Try simple art tools'
      },
      {
        name: 'Black & White Painted Stones',
        description: 'Children use fingers to mix black and white paint and paint directly onto smooth stones.',
        setup: ['Smooth stones (large, easy to hold)', 'Small bowls of black and white paint', 'One stone per child'],
        whatToSay: ['Mix.', 'Paint.', 'More.'],
        goal: 'Create lines, dots, and patterns'
      },
      {
        name: 'Roll & Stick — Painted Newspaper Collage',
        description: 'Children work together to roll long painted newspaper strips and stick the rolls in long paths, creating raised lines across a shared surface.',
        setup: ['Newspaper sheets pre-painted by teachers in primary colours (fully dried)', 'Tear or cut into long strips', 'Large shared base paper or board', 'Glue in bowls or glue sticks'],
        whatToSay: ['Roll.', 'Stick.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      }
    ],
    materials: ['Newspaper', 'Smooth stones', 'Shallow tubs', 'Water', 'Black & white paint', 'Droppers', 'Spatulas', 'Glue', 'Large base paper/board']
  },
  'Glow & Shadow': {
    overview: 'An art playdate exploring light, colour, and transparency. Children discover how colours glow, overlap, and transform using light tables, cellophane, sand, and Magna-Tiles.',
    freePlay: {
      purpose: 'To spark curiosity and invite children into the space through glowing, light-based materials.',
      setup: [
        'Set up one large light table / bright surface with: transparent coloured shapes (Magna-Tiles / acrylic shapes), coloured cellophane pieces, parchment / translucent sheets, clear cups / clear bottles',
        'Optional: small torches (teacher-held)',
        'Materials should be spread out neatly so children can see everything and choose what draws them in.'
      ],
      teacherModels: 'The teacher places one shape on light and pauses. The teacher overlaps two colours once and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Look.', 'Light.', 'Glow.', 'Again.', 'Your turn.']
    },
    activities: [
      {
        name: 'Light Table Colourful Sand Play',
        description: 'Children gently move colourful sand on a glowing light table to create paths, shapes and glowing colour patterns.',
        setup: [
          'Light table (or bright surface) with bowls of colourful sand (2–3 colours only)',
          'Scoops + small cups + Q-tips',
          'One defined space per child (so sand doesn\'t mix immediately)',
          'Keep bowls half-filled so it doesn\'t spill instantly'
        ],
        whatToSay: ['Pour.', 'Glow.', 'Make a path.', 'Again.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Parchment Paper Glowing Colour Windows',
        description: 'Stick colourful paper onto parchment and hold it up to the light to watch colours shine and glow through.',
        setup: [
          'One parchment sheet per child',
          'Pre-cut colourful translucent bits (cellophane / coloured paper)',
          'Glue sticks or tape',
          'A clear "window spot" (near lamp / light / window)'
        ],
        whatToSay: ['Stick.', 'Look.', 'Light.', 'More.'],
        goal: 'Spot colours through hands-on play'
      },
      {
        name: 'Cellophane Lamp Building',
        description: 'Wrap coloured cellophane around clear cups to create glowing lamps and see how light changes colour.',
        setup: [
          'One clear cup per child',
          'Cellophane strips (2–3 colours only)',
          'Tape (pre-torn pieces stuck on table edge for easy use)',
          'Optional: tea-light style torch underneath / teacher-held torch (no real candles)'
        ],
        whatToSay: ['Wrap.', 'Tape.', 'Glow.', 'Again.'],
        goal: 'Spot colours through hands-on play'
      },
      {
        name: 'Magna-Tile Light Tracing',
        description: 'Observe glowing Magna-Tile shapes in light, trace their outlines, and fill them with colour to capture the light shapes.',
        setup: [
          'Magna-Tiles',
          'One paper per child',
          'Crayons / oil pastels / thick markers',
          'If possible: keep tiles on light table while tracing (or trace on normal table after "look" moment)'
        ],
        whatToSay: ['Shape.', 'Around.', 'Trace.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      }
    ],
    materials: ['Light table / bright surface', 'Transparent coloured shapes (Magna-Tiles / acrylic)', 'Coloured cellophane', 'Parchment / translucent sheets', 'Clear cups & bottles', 'Colourful sand (2–3 colours)', 'Scoops, cups & Q-tips', 'Glue sticks / tape', 'Crayons / oil pastels / thick markers', 'Optional: small torches']
  },
  'Muddy & Greeny': {
    overview: 'An earthy art playdate exploring brown and green tones through nature-inspired sensory and art activities. Children scoop, paint, drip, and rub to create rich, textured artworks.',
    freePlay: {
      purpose: 'To spark curiosity and invite children into the space through rich, earthy sensory materials.',
      setup: [
        'Set up one large surface with: brown sensory materials (brown rice / beads / paper shreds), bowls + scoops + cups',
        'Optional: natural loose parts like twigs/leaves (only if safe + large)',
        'Materials should be spread out neatly with plenty of quantity.'
      ],
      teacherModels: 'The teacher scoops and pours slowly. Parents watch, copy once, then pause and let the child try.',
      whatToSay: ['Scoop.', 'Pour.', 'Again.', 'Slow.', 'Your turn.']
    },
    activities: [
      {
        name: 'Green & Brown Nature Table',
        description: 'Children pick up, move, and combine green and brown materials — placing green pieces into brown bases, filling cups, and creating simple "plant-in-soil" combinations.',
        setup: [
          'Brown base materials: brown rice / brown paper shreds / beads',
          'Green materials: green pompoms / green beads / artificial leaves / green paper pieces',
          'Small bowls filled with brown material (soil) and small cups kept empty',
          'Ensure clear visual separation initially: green on one side, brown on the other'
        ],
        whatToSay: ['Pick.', 'Put.', 'Inside.', 'Plant.', 'Again.', 'Your turn.'],
        goal: 'Try simple art tools'
      },
      {
        name: 'Cardboard Scrape Painting (Group Mat)',
        description: 'Use cardboard pieces to push, drag and spread brown paint across a large shared mat to create bold earthy marks.',
        setup: [
          'One large shared base sheet (taped down)',
          'Brown paint in wide bowls (thick, not watery)',
          'Cardboard scrapers (one per child)',
          'Aprons / wipe station nearby'
        ],
        whatToSay: ['Push.', 'Drag.', 'Big line.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      },
      {
        name: 'Coffee Drop and Spread Painting',
        description: 'Drop coffee-coloured liquid onto paper and spread it with fingers to create natural flowing textures.',
        setup: [
          'One paper per child',
          'Coffee-coloured paint/liquid (safe, washable)',
          'Droppers or spoons',
          'Keep liquid minimal so it doesn\'t flood'
        ],
        whatToSay: ['Drop.', 'Spread.', 'Slow.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      },
      {
        name: 'Brown Ring Crayon Rubbing',
        description: 'Rub crayons over paper placed on rings to reveal hidden circular textures and patterns.',
        setup: [
          'Rings under paper (secure so they don\'t roll)',
          'Crayons (brown/green/black — keep it earthy)',
          'One paper per child'
        ],
        whatToSay: ['Rub.', 'Circle.', 'Look.', 'Again.'],
        goal: 'Create lines, dots, and patterns'
      }
    ],
    materials: ['Brown rice / beads / paper shreds', 'Green pompoms / beads / artificial leaves', 'Bowls, scoops & cups', 'Cardboard scrapers', 'Brown paint (thick)', 'Large base sheets', 'Coffee-coloured paint/liquid (washable)', 'Droppers / spoons', 'Rings (for rubbing)', 'Crayons (brown/green/black)', 'Aprons']
  },
  'Warm & Cold Splash': {
    overview: 'A sensory playdate exploring temperature contrasts through water, ice, and textured materials. Children touch, drip, melt, paint, and scoop to discover warm, cold, hard, and soft sensory differences.',
    freePlay: {
      purpose: 'To gently invite children into sensory exploration through safe water + ice materials before structured activities begin.',
      setup: [
        'Set up one large surface with a shallow tub of water (room temp)',
        'A bowl of ice cubes',
        'Cups, scoops, spoons, pipettes',
        'Towels / wipes nearby',
        'Optional: a tray of soft textured items (pom poms / sponges) for dipping',
        'Materials are spread out neatly with plenty of quantity so children can see, touch, and choose'
      ],
      teacherModels: 'The teacher sits inside the space and slowly scoops water, drops one ice cube, and pauses. Movements are slow and clear. Parents watch first, copy once, then pause and allow the child to explore.',
      whatToSay: ['Cold.', 'Water.', 'Touch.', 'Slow.', 'Your turn.']
    },
    activities: [
      {
        name: 'Ice Cube Exploration (Pom-Pom Rescue + Pipettes)',
        description: 'Children explore ice cubes with frozen pom-poms inside and use pipettes to drip water and slowly melt the ice.',
        setup: [
          'One tray/bowl per child',
          'Ice cubes with pom-poms frozen inside (make in advance)',
          'Pipettes / droppers',
          'Small cup of water per child (for refilling pipette)',
          'Towel under each tray'
        ],
        whatToSay: ['Drip.', 'Melt.', 'Cold.', 'Again.'],
        goal: 'Notice simple sensory differences (hard/soft)'
      },
      {
        name: 'Lukewarm Feet Tray (Ice Melt Moment)',
        description: 'Children dip their feet into lukewarm water trays, then watch and feel as ice is added and melts over time.',
        setup: [
          '1 large shallow tray per child',
          'Lukewarm water (comfortable, not hot)',
          'Bowl of ice cubes nearby',
          'Towels + drying mat / rug',
          'Clear "turn-taking" spots so children don\'t crowd'
        ],
        whatToSay: ['Warm.', 'Cold.', 'Feet.', 'Slow.', 'Brrr.'],
        goal: 'Notice simple sensory differences (warm/cold)'
      },
      {
        name: 'Ice Painting (Brush + Ice-Stick Painting + Salt)',
        description: 'Paint onto ice with brushes, then use ice cubes with popsicle sticks like paint tools and sprinkle salt to watch colours spread and shift.',
        setup: [
          'Large tray per child (or pairs)',
          'Flat ice slab (freeze water in a tray) OR a pile of ice cubes in a tray',
          'Washable liquid colours/paint in bowls',
          'Brushes',
          'Ice cubes with popsicle sticks frozen into them (prep in advance)',
          'Salt in a small shaker / pinch bowl',
          'Aprons + wipes'
        ],
        whatToSay: ['Paint.', 'Cold.', 'Salt.', 'Watch.', 'Spread.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Cloud Dough Ice-Cream with Pretend Toppings',
        description: 'Scoop and shape cloud dough into ice-cream scoops and decorate with fun pretend toppings for open-ended sensory play.',
        setup: [
          'Cloud dough in big bowls (soft, crumbly)',
          'Scoops + small bowls/cups/cones',
          'Pretend toppings: pom poms / beads / buttons / paper bits (large + safe)',
          'Optional: a "menu" card on table (visual cue only)'
        ],
        whatToSay: ['Scoop.', 'Press.', 'Top.', 'Serve.', 'Again.'],
        goal: 'Explore textures with safe materials'
      }
    ],
    materials: ['Shallow tub of water', 'Ice cubes', 'Cups, scoops, spoons, pipettes', 'Towels / wipes', 'Pom poms / sponges', 'Ice cubes with frozen pom-poms', 'Pipettes / droppers', 'Lukewarm water trays', 'Drying mat / rug', 'Flat ice slabs', 'Washable paint/colours', 'Brushes', 'Popsicle sticks (frozen into ice)', 'Salt shaker', 'Cloud dough', 'Pretend toppings (pom poms, beads, buttons)', 'Aprons']
  },
  'Smell & Sniff': {
    overview: 'A sensory playdate exploring scent through safe, familiar smells. Children sniff, mix, stir, dig, and paint to discover a world of fragrance through hands-on exploration.',
    freePlay: {
      purpose: 'To gently invite children into sensory exploration through safe, familiar scents before structured activities begin.',
      setup: [
        'One large surface with small bowls/trays of: citrus peels, mint/herbs, whole spices (not powder), flowers/leaves',
        'Cups, spoons, scoops',
        'Empty containers for filling',
        'Optional: "smell jars" (cotton inside jars with 1 scent each — tightly closed)',
        'Keep quantities generous and layout neat so it looks inviting, not chaotic'
      ],
      teacherModels: 'The teacher picks one item, brings it near the nose, and pauses. The teacher puts it in a cup, stirs once, pauses. Parents copy once, then pause and allow the child to explore.',
      whatToSay: ['Smell.', 'Sniff.', 'Fresh.', 'Again.', 'Your turn.']
    },
    activities: [
      {
        name: 'DIY Spice Paint',
        description: 'Children mix ground spices with water to make thick scented paint and explore bold colours and smells while painting.',
        setup: [
          'Spice powders in small bowls (small amounts only) — e.g. turmeric, cinnamon, coffee powder',
          'Water cups + spoons for mixing',
          'Thick paper sheets',
          'Brushes (or fingers — pick ONE approach for the day)'
        ],
        whatToSay: ['Mix.', 'Paint.', 'Smell.', 'Again.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Nature Soup (Citrus + Herbs Mixing Tray)',
        description: 'Children scoop and stir sliced citrus peels, mint, and herbs to make a pretend "nature soup" full of fresh scents.',
        setup: [
          'Large trays with water (shallow)',
          'Citrus peels + mint/herbs',
          'Spoons, ladles, cups, bowls',
          'Optional: a few flower petals for extra fragrance'
        ],
        whatToSay: ['Stir.', 'Pour.', 'Smell.', 'Serve.'],
        goal: 'Gently introduce new smells (through pretend play)'
      },
      {
        name: 'Rotating Sensory Bins (3 Smell Stations)',
        description: 'Children rotate across three sensory bins that look different and smell different — exploring rice with mint, lemon zest, and vanilla while scooping and discovering hidden materials.',
        setup: [
          'Create 3 stations (each in a wide bin), clearly separated:',
          'Bin 1: rice + mint',
          'Bin 2: rice + lemon zest/peel',
          'Bin 3: rice + vanilla scent (vanilla essence on cotton balls OR vanilla-scented safe item)',
          'Scoops + cups at each station',
          'A few "hidden finds" in each bin (big safe objects: wooden shapes / big beads / plastic fruits)'
        ],
        whatToSay: ['Scoop.', 'Find.', 'Smell.', 'Next.'],
        goal: 'Explore textures with safe materials'
      },
      {
        name: 'Sensory Spring Flower Tray',
        description: 'Children find flowers hidden in sand, then touch, pull apart, and explore the texture and smell of petals and leaves.',
        setup: [
          'Tray with kinetic sand or dry sand (shallow)',
          'Flowers/leaves tucked inside (large pieces)',
          'Tweezers/tongs optional (or fingers)',
          'Small bowls for collecting petals/leaves'
        ],
        whatToSay: ['Find.', 'Soft.', 'Smell.', 'Again.'],
        goal: 'Explore textures with safe materials'
      }
    ],
    materials: ['Citrus peels', 'Mint / herbs', 'Whole spices (not powder)', 'Flowers / leaves', 'Smell jars (cotton + scent)', 'Spice powders (turmeric, cinnamon, coffee)', 'Thick paper', 'Brushes', 'Shallow water trays', 'Spoons, ladles, cups, bowls', 'Rice', 'Lemon zest', 'Vanilla essence / cotton balls', 'Kinetic sand / dry sand', 'Tweezers / tongs', 'Small collecting bowls', 'Scoops + cups']
  },
  'Spider Wiggle': {
    overview: 'A music and storytelling playdate built around the Itsy Bitsy Spider. Children explore rain sounds, spider movements, ribbons, and crawling to bring the beloved nursery rhyme to life.',
    freePlay: {
      purpose: 'To gently invite children into music and storytelling through rain sounds, spider visuals, and simple sound-makers before structured activities begin.',
      setup: [
        'Spider cutouts, ribbon "spout" strips hanging from a low surface, rain cloud pictures — printed, laminated if possible, placed at child eye level or flat on floor',
        'Soft floor mats in a circle',
        'One small basket with sound-makers (rainmaker, shakers, bells)',
        'Optional: speaker with soft rain sounds playing quietly',
        'Keep the space calm and uncluttered'
      ],
      teacherModels: 'The teacher sits and quietly shakes rainmaker once, points to spider picture, taps ribbon once. Movements are slow and repeated. Parents watch first, copy once, then pause and allow the child to respond.',
      whatToSay: ['Rain.', 'Spider.', 'Shake.', 'Your turn.']
    },
    activities: [
      {
        name: 'Rain Water Sensory Play',
        description: 'Children scoop, pour and squeeze water while listening to rainfall sounds and experiencing the spider\'s rainy world.',
        setup: [
          'One shallow tray per child',
          'Small cups, scoops, squeeze tools',
          'Towels underneath trays',
          'Rain sound playing softly in background'
        ],
        whatToSay: ['Rain.', 'Pour.', 'Drip.', 'Again.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Itsy Bitsy Spider Action Song with Rainmaker & Book',
        description: 'Sing the spider song with big hand movements while listening to rainmaker sounds and musical cues. Also use the book.',
        setup: [
          'One rainmaker instrument and Itsy Bitsy Spider book',
          'Children seated in circle',
          'Parents seated behind or beside child'
        ],
        whatToSay: ['Spider.', 'Climb.', 'Rain.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Spider Climbs the Ribbon Spout',
        description: 'Children move spider cutouts up ribbons to climb and slide down when rain sounds appear.',
        setup: [
          'One ribbon strip per child (secured safely)',
          'Spider cutouts (laminated if possible)',
          'Rainmaker nearby'
        ],
        whatToSay: ['Climb.', 'Up.', 'Down.', 'Spider.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Spider Crawl Tunnel Adventure',
        description: 'Children crawl through the tunnel "water spout," following the spider\'s journey through movement and imagination.',
        setup: [
          'One crawl tunnel',
          'Soft mats on both ends',
          'Spider visual near tunnel entrance'
        ],
        whatToSay: ['Crawl.', 'Spider.', 'Go.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Spider cutouts (laminated)', 'Ribbon strips', 'Rain cloud pictures', 'Rainmaker instrument', 'Shakers & bells', 'Shallow water trays', 'Cups, scoops, squeeze tools', 'Towels', 'Itsy Bitsy Spider book', 'Crawl tunnel', 'Soft mats', 'Optional: speaker for rain sounds']
  },
  'Bugs & Bee Sounds': {
    overview: 'A music and storytelling playdate exploring bee-themed sounds, movement, and rhythm. Children shake, buzz, crawl, and dance to discover the world of busy bees.',
    freePlay: {
      purpose: 'To gently invite children into music and storytelling through bee visuals, sound-makers, and soft movement before structured activities begin.',
      setup: [
        'Bee pictures, flower pictures, honeycomb pictures displayed',
        'Soft mats in a circle',
        'Basket with small rattles, bells, shakers',
        'Yellow scarves (folded neatly)',
        'Keep the space calm and inviting'
      ],
      teacherModels: 'The teacher quietly shakes shaker once, points to bee picture, buzzes softly "bzzz". Parents watch first, copy once, then pause.',
      whatToSay: ['Bee.', 'Buzz.', 'Shake.', 'Your turn.']
    },
    activities: [
      {
        name: 'Honeycomb Sensory Exploration',
        description: 'Children scoop, hide and retrieve bees and pollen from honeycomb sensory trays while exploring sound and texture.',
        setup: [
          'One tray per child',
          'Sensory base (rice / beads / safe filler)',
          'Bee toys hidden inside',
          'Scoops and cups'
        ],
        whatToSay: ['Find.', 'Bee.', 'Buzz.', 'Again.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Bee Sound Shaking & Listening Game + Story',
        description: 'Recite the bee story, shake rattles softly and loudly to match small and big bee sounds and explore sound differences.',
        setup: [
          'The Bee storybook',
          'One shaker per child',
          'Children seated in circle'
        ],
        whatToSay: ['Soft.', 'Loud.', 'Buzz.', 'Again.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Tunnel Hive Buzzing Crawl',
        description: 'Children crawl through the bee hive tunnel while buzzing and shaking rattles like busy bees.',
        setup: [
          'Crawl tunnel',
          'One shaker per child',
          'Mats placed safely'
        ],
        whatToSay: ['Buzz.', 'Crawl.', 'Bee.', 'Go.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Flower Garden Scarf Buzz Dance',
        description: 'Dance with yellow scarves like bee wings, moving fast, slow, high and low to buzzing rhythms.',
        setup: [
          'One yellow scarf per child',
          'Open movement space',
          'Speaker ready'
        ],
        whatToSay: ['Fly.', 'Buzz.', 'Fast.', 'Slow.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Bee pictures', 'Flower pictures', 'Honeycomb pictures', 'Rattles, bells, shakers', 'Yellow scarves', 'Sensory trays with rice/beads', 'Bee toys', 'Scoops & cups', 'The Bee storybook', 'Crawl tunnel', 'Soft mats', 'Speaker']
  },

  'Fly High': {
    overview: 'A movement playdate exploring sky and flight themes. Children develop hand control, balance, and whole-body movement through cloud drawing, scarf play, jumping, runway adventures, and spinning with bubbles.',
    freePlay: {
      purpose: 'Children explore clouds using chalk and water—scribbling, rubbing, and watching marks appear and change on paper clouds using dry and wet chalk.',
      setup: [
        'Large sheets of paper with cloud shapes pre-drawn and taped securely to the floor or table',
        'One thick chalk piece per child',
        'One small bowl of water per 2–3 children',
        'Cloth for wiping hands nearby',
        'Keep space uncluttered and calm'
      ],
      teacherModels: 'Teacher draws slowly on cloud once. Teacher dips chalk in water and draws again. Parents copy once. Parents pause and allow child to explore freely.',
      whatToSay: ['Draw.', 'Cloud.', 'Wet.', 'Again.', 'More.']
    },
    activities: [
      {
        name: 'Sky Sensory Play (Scarves + Ribbon Wands)',
        description: 'Children move rings through scarves and along a rope pathway under hanging clouds, developing hand control while interacting with sky elements.',
        setup: [
          'Part 1 — Scarf Ring Pull: One scarf per child, 3–5 large rings per child, open floor space',
          'Part 2 — Rope Cloud Pathway: Tie rope securely between two chairs, hang paper clouds along the rope, provide rings in a basket nearby'
        ],
        whatToSay: ['Pull.', 'Through.', 'Move.', 'Cloud.', 'Again.'],
        goal: 'Practice little hand & finger control'
      },
      {
        name: 'Cloud Jumping',
        description: 'Children walk, tiptoe, jump between floor clouds, reach wall clouds with ribbon wands, and use soft blocks to climb and touch higher clouds.',
        setup: [
          'Tape cloud shapes on floor in pathway',
          'Tape cloud shapes on wall at child height and slightly above reach',
          'Ribbon wand per child',
          'Soft blocks placed safely near wall clouds',
          'Play gentle movement music'
        ],
        whatToSay: ['Jump.', 'Reach.', 'Up.', 'Touch.', 'Cloud.'],
        goal: 'Move, climb & balance using whole body'
      },
      {
        name: 'Runway Takeoff & Landing',
        description: 'Children move like airplanes—walking, balancing, taking off, and landing—using runway paths, wobble boards, slant blocks, and toy planes.',
        setup: [
          'Create simple runway pathway using tape',
          'Place wobble board along pathway',
          'Slanting soft block along pathway',
          'Basket with small toy planes',
          'Landing cone at end'
        ],
        whatToSay: ['Go.', 'Balance.', 'Up.', 'Land.', 'Again.'],
        goal: 'Move to sounds & simple cues'
      },
      {
        name: 'Windy Day Spin (Spin + Stop)',
        description: 'Children spin inside a taped circle using ribbon wands and bubbles, stopping and watching bubbles land.',
        setup: [
          'Tape one clear circle on floor per child space',
          'One ribbon wand per child',
          'Bubble solution with adult',
          'Parents tie two ribbons loosely on child\'s wrists'
        ],
        whatToSay: ['Spin.', 'Stop.', 'Wait.', 'Bubble.', 'Again.'],
        goal: 'Move to sounds & simple cues'
      }
    ],
    materials: ['Large paper sheets with cloud shapes', 'Thick chalk', 'Bowls of water', 'Scarves', 'Large rings', 'Rope', 'Paper clouds (hanging)', 'Ribbon wands', 'Soft blocks', 'Tape (floor & wall clouds)', 'Wobble board', 'Slant block', 'Small toy planes', 'Landing cone', 'Bubble solution', 'Speaker for music']
  },

  'Tunnel Adventure': {
    overview: 'A movement playdate exploring tunnels and rolling. Children develop gross motor skills, hand control, and body awareness through crawling, rolling balls, threading rings, driving cars, and body rolling.',
    freePlay: {
      purpose: 'Children crawl through soft block tunnels and carry or guide plush toys through the tunnels, bringing them from one side to the other.',
      setup: [
        'Create 2–3 tunnels using soft blocks arranged to form tunnel openings large enough for crawling',
        'Place plush toys at tunnel entrances and inside tunnels',
        'Use soft mats underneath tunnels',
        'Keep space open and uncluttered'
      ],
      teacherModels: 'Teacher crawls through tunnel carrying plush toy once. Parents copy once. Parents pause and allow child to explore.',
      whatToSay: ['Crawl.', 'Through.', 'Bring.', 'Come.', 'Again.']
    },
    activities: [
      {
        name: 'Rolling Tunnels (Ball Through Tunnel Play)',
        description: 'Children roll balls through tunnel toys, drop balls through hula hoop tunnels held by parents, and throw balls through hoop tunnels.',
        setup: [
          'Tunnel toys placed safely on floor',
          'Balls in basket near tunnel entrance',
          'Hula hoops (one per parent) — held vertically to create tunnel opening',
          'Parents can change hoop height (low, medium, high) and hold hoops in sequence for a longer tunnel'
        ],
        whatToSay: ['Roll.', 'Drop.', 'Through.', 'Go.', 'Again.'],
        goal: 'Practice little hand & finger control'
      },
      {
        name: 'Rings Through Scarves',
        description: 'Children balance rings on their head, then move rings through a spiral tunnel pathway made with tubes and scarves.',
        setup: [
          'Part 1 — Balance warm-up: One ring per child, open walking space',
          'Part 2 — Spiral tunnel pathway: Lay cardboard tubes on floor in spiral or curved path, tie scarves between some tubes to create tunnel sections, place rings loosely on tubes and scarves, place 2–3 containers along the pathway'
        ],
        whatToSay: ['Balance.', 'Move.', 'Through.', 'Put.', 'Again.'],
        goal: 'Practice little hand & finger control'
      },
      {
        name: 'Little Tunnels for Little Cars',
        description: 'Children drive small cars through pop-up tunnels, exploring in-and-out movement.',
        setup: [
          'Pop-up tunnels',
          'Small cars'
        ],
        whatToSay: ['Go.', 'In.', 'Out.'],
        goal: 'Move with simple cues (follow / stop–go)'
      },
      {
        name: 'Roll Like a Tunnel',
        description: 'Children roll on yoga mats and explore rolling body movement.',
        setup: [
          'Yoga mats',
          'Round soft blocks nearby',
          'Open safe space'
        ],
        whatToSay: ['Roll.', 'Slow.', 'Stop.'],
        goal: 'Move with simple cues (stop–go, fast–slow)'
      }
    ],
    materials: ['Soft blocks (for tunnels)', 'Plush toys', 'Soft mats', 'Tunnel toys', 'Balls', 'Hula hoops', 'Rings', 'Cardboard tubes', 'Scarves', 'Containers', 'Pop-up tunnels', 'Small cars', 'Yoga mats', 'Round soft blocks']
  },
  'Stars & Moon': {
    overview: 'An art playdate exploring the night sky\'s textures and colours. Children discover deep blues, shimmering stars, and glowing moons through sensory play, sponges, collage, and resist painting.',
    freePlay: {
      purpose: 'To spark curiosity and invite children into a calm, night-sky atmosphere through highly tactile, contrasting materials.',
      setup: [
        'Set up a central dark blue fabric or mat on the floor with: crinkly foil shapes (stars), large soft sensory balls (moons)',
        'Materials should be spread out neatly so children can see everything and choose what draws them in.'
      ],
      teacherModels: 'The teacher scrunches a foil star once and pauses. The teacher rolls a moon ball once and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Touch.', 'Crinkle.', 'Moon.', 'Roll.', 'Your turn.']
    },
    activities: [
      {
        name: 'Night Sky Sensory Table',
        description: 'Children scoop and pour blue chia seeds and search for hidden foil stars.',
        setup: [
          'Sensory table (or deep trays) with blue chia seeds',
          'Hidden foil stars + scoops + small bowls',
          'One defined space per child (so materials don\'t mix immediately)',
          'Keep trays shallow so it doesn\'t spill instantly'
        ],
        whatToSay: ['Scoop.', 'Pour.', 'Feel.', 'Find.'],
        goal: 'Explore sensory textures through hands-on play'
      },
      {
        name: 'Star & Moon Sponge Painting',
        description: 'Children dab and drag blue, white, and black paint with star and moon sponges, then paint over stencils to reveal the shapes.',
        setup: [
          'Thick paper taped to the table',
          'Star and moon stencils + sponges',
          'Shallow plates with blue, white, and black paint',
          'Keep sponges separated by colour initially'
        ],
        whatToSay: ['Dip.', 'Dab.', 'Mix.', 'Lift.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Moon Collage with Blue Paper Bits',
        description: 'Children stick small blue paper bits inside a full moon stencil, filling the space to create a textured moon.',
        setup: [
          'One paper per child with a full moon stencil',
          'Bowls of pre-torn small blue paper bits',
          'Glue sticks',
          'A clear "drying spot"'
        ],
        whatToSay: ['Stick.', 'Press.', 'Fill.', 'More.'],
        goal: 'Spot colours and textures through hands-on play'
      },
      {
        name: 'Magic Moon & Stars Painting',
        description: 'Children drip paint with droppers and discover hidden moon and star shapes through a simple crayon-resist effect.',
        setup: [
          'One paper per child with stars and moons pre-drawn in white wax crayon',
          'Small cups of watered-down dark blue paint',
          'Droppers / pipettes',
          'Keep cups half-filled to avoid large spills'
        ],
        whatToSay: ['Squeeze.', 'Drip.', 'Look.', 'Magic.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      }
    ],
    materials: ['Sensory bins / deep trays', 'Blue chia seeds & foil stars', 'Star and moon sponges', 'Washable paint (blue, white, black)', 'Thick paper / cardstock', 'Moon and star stencils', 'Small blue paper bits & glue sticks', 'White wax crayons', 'Liquid watercolours & droppers', 'Dark blue fabric & crinkly shapes']
  },
  'Rainbow Swirl': {
    overview: 'A bright colour studio exploring rainbow shades. Children discover scooping, sorting, sticking, and light-filled art play through coloured rice, sponges, pom-poms, and cellophane.',
    freePlay: {
      purpose: 'To spark curiosity and invite children into a bright, colourful atmosphere through movement and soft textures.',
      setup: [
        'Set up a central open space on the floor with: colourful play silks or scarves (rainbow colours), soft colourful sensory balls',
        'Materials should be spread out neatly so children can see everything and choose what draws them in.'
      ],
      teacherModels: 'The teacher waves a red silk once and pauses. The teacher rolls a colourful ball once and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Wave.', 'Soft.', 'Colour.', 'Roll.', 'Your turn.']
    },
    activities: [
      {
        name: 'Rainbow Rice Sensory Table',
        description: 'Children scoop and pour coloured rice, then use blocks to sort and match rainbow colours.',
        setup: [
          'Sensory table (or deep trays) with mixed coloured rice',
          'Coloured blocks + scoops + small bowls',
          'One defined space per child (so materials don\'t mix immediately)',
          'Keep trays shallow so it doesn\'t spill instantly'
        ],
        whatToSay: ['Scoop.', 'Pour.', 'Match.', 'Red.'],
        goal: 'Explore sensory textures through hands-on play'
      },
      {
        name: 'Group Rainbow Sponge Paint',
        description: 'Children sponge colours along large rainbow arches on a shared mat, building one rainbow together.',
        setup: [
          'Large shared paper taped to the floor with pre-drawn rainbow arches',
          'Shallow plates with rainbow paint colours + sponges',
          'Keep sponges separated by colour initially'
        ],
        whatToSay: ['Dip.', 'Dab.', 'Together.', 'Colour.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Pom-Pom Rainbow Line',
        description: 'Children place pom-poms in rainbow order along a pre-drawn rainbow, noticing colour sequence and pattern.',
        setup: [
          'One paper per child with pre-drawn rainbow lines (covered in sticky contact paper)',
          'Bowls of sorted coloured pom-poms',
          'A clear workspace'
        ],
        whatToSay: ['Place.', 'Line.', 'Yellow.', 'More.'],
        goal: 'Spot colours and patterns through hands-on play'
      },
      {
        name: 'Cellophane Rainbow Window',
        description: 'Children place crinkled cellophane inside a rainbow stencil and hold it to the light to see glowing colours appear.',
        setup: [
          'One rainbow stencil per child (backed with sticky contact paper)',
          'Bowls of pre-cut colourful cellophane bits',
          'A clear "window spot" (near lamp / light / window)'
        ],
        whatToSay: ['Crinkle.', 'Stick.', 'Light.', 'Look.'],
        goal: 'Spot colours and light through hands-on play'
      }
    ],
    materials: ['Sensory bins / deep trays', 'Coloured rice (rainbow colours)', 'Coloured blocks for sorting', 'Scoops & small bowls', 'Large shared paper / mat', 'Washable paint (rainbow colours)', 'Sponges', 'Pom-poms (rainbow colours)', 'Clear contact paper / tape', 'Rainbow stencils', 'Pre-cut cellophane bits (rainbow colours)', 'Colourful play silks / scarves']
  },
  'Little Bird Songs': {
    overview: 'A music and storytelling playdate built around bird songs and sounds. Children explore pitch, rhythm, listening, and storytelling through bird props, shaking bird feeders, and passing games to bring the bird world to life.',
    freePlay: {
      purpose: 'To gently invite children into music and storytelling through bird sounds, colourful visuals, and simple sound-makers before structured activities begin.',
      setup: [
        'Bird cutouts and a low tree visual placed at child eye level or flat on the floor',
        'Soft floor mats in a circle',
        'One small basket with empty jars and soft balls',
        'Optional: speaker with soft bird songs playing quietly',
        'Keep the space calm and uncluttered'
      ],
      teacherModels: 'The teacher sits and quietly shakes a jar with a soft ball once, points to a bird picture, and taps a high spot on the tree once. Movements are slow and repeated. Parents watch first, copy once, then pause and allow the child to respond.',
      whatToSay: ['Bird.', 'Listen.', 'Shake.', 'Your turn.']
    },
    activities: [
      {
        name: 'Birdy Goes Up the Tree',
        description: 'Children place birds at different heights on a tree and explore fast and slow, loud and soft, and high and low sounds.',
        setup: [
          'Large tree visual placed safely at child level',
          'Bird cutouts with sticky tack or velcro',
          'A simple instrument (like a drum or shaker) nearby to model high/low and fast/slow sounds'
        ],
        whatToSay: ['Up.', 'Down.', 'Listen.', 'High.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'All the Colourful Birds Story',
        description: 'Children listen to All the Colourful Birds with colourful bird props, joining in through sound, movement, and story play.',
        setup: [
          'All the Colourful Birds book',
          'One colourful bird prop per child',
          'Children seated in circle',
          'Parents seated behind or beside child'
        ],
        whatToSay: ['Bird.', 'Fly.', 'Colour.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Bird Feeder Sound',
        description: 'Children fill jars or taped cups with seeds, grains, beads, and soft balls, then shake them to hear different bird-feeder sounds.',
        setup: [
          'One clear plastic jar/cup per child',
          'Small bowls of seeds, grains, large beads, and soft balls',
          'Tape to seal cups safely once filled',
          'Scoops and spoons',
          'Keep bowls half-filled so it doesn\'t spill instantly'
        ],
        whatToSay: ['Fill.', 'Shake.', 'Listen.', 'Loud.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Bird Song Passing Game — Mama Makes Sound',
        description: 'Children pass bird puppets in a circle. When the sound stops, the child holding one makes that bird\'s sound.',
        setup: [
          'One or two bird puppets',
          'Soft mats in a circle',
          'Parents help guide the passing motion hand-to-hand',
          'Teacher controls the pausing of the song or chant'
        ],
        whatToSay: ['Pass.', 'Stop.', 'Tweet.', 'Listen.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Colourful bird cutouts (laminated)', 'Large tree visual (felt or paper)', 'All the Colourful Birds book', 'Clear plastic jars or cups with lids/tape', 'Seeds, grains, large beads, and soft balls', 'Scoops and small bowls', 'Bird puppets or soft toy birds', 'Soft mats', 'Optional: speaker for bird songs']
  },
  'Ocean Beats': {
    overview: 'A lively music and storytelling playdate built around ocean beats. Children explore water, rhythm, puppets, and movement through sea-themed play, ocean drums, and shark chase games.',
    freePlay: {
      purpose: 'To gently invite children into music and storytelling through water sounds, sea visuals, and simple sound-makers before structured activities begin.',
      setup: [
        'Soft floor mats in a circle',
        'One shallow tray with a little water, a sieve, and a water resistant fish toy or rubber balls with fish drawn on them nearby',
        'Optional: speaker with soft ocean wave sounds playing quietly',
        'Keep the space calm and uncluttered'
      ],
      teacherModels: 'The teacher sits and quietly scoops water with a sieve once, letting it drip, and points to a fish. Movements are slow and repeated. Parents watch first, copy once, then pause and allow the child to respond.',
      whatToSay: ['Water.', 'Drip.', 'Fish.', 'Your turn.']
    },
    activities: [
      {
        name: 'Water Shower with Colander & Sieves',
        description: 'Children pour and watch water move through a colander and sieves, noticing how each tool changes the flow.',
        setup: [
          'One shallow water tray per child',
          'Colanders, sieves, and small pouring cups',
          'Towels underneath trays',
          'Ocean wave sounds playing softly in background'
        ],
        whatToSay: ['Scoop.', 'Pour.', 'Shower.', 'Look.'],
        goal: 'Explore sensory textures through hands-on play'
      },
      {
        name: 'Make Your Own Ocean Drum',
        description: 'Children make simple ocean drums using paper plates and rice, then shake and listen to the sea-like sound.',
        setup: [
          'Two paper plates per child',
          'Small bowls of rice or grains',
          'Tape (pre-torn on table edge for easy parent use)',
          'Keep bowls half-filled so it doesn\'t spill instantly'
        ],
        whatToSay: ['Pour.', 'Seal.', 'Shake.', 'Listen.'],
        goal: 'Make a sound and hear what happens'
      },
      {
        name: 'Machhli Jal Ki Rani Hai',
        description: 'Children join in a playful song-and-puppetry experience with fish characters, actions, and movement.',
        setup: [
          'One fish puppet or laminated cutout per child',
          'Children seated in circle',
          'Parents seated behind or beside child'
        ],
        whatToSay: ['Fish.', 'Swim.', 'Water.', 'Again.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      },
      {
        name: 'Jaws Game (Slippery Fish)',
        description: 'Children "swim" under arches made by parents\' arms. The teacher leads the "Slippery Fish" song, and on every "Gulp! Gulp! Gulp!", parents gently drop their arms to catch the children.',
        setup: [
          'Large open space with soft mats',
          'Parents pair up to form arm arches',
          'Teacher sings the verses: "A slippery fish... Swimming in the wa-ter... Gulp! Gulp! Gulp!"'
        ],
        whatToSay: ['Swim.', 'Under.', 'Gulp.', 'Caught.'],
        goal: 'Sing-and-act familiar songs and rhymes'
      }
    ],
    materials: ['Shallow water trays / sensory bins', 'Colanders, sieves, and small pouring cups', 'Towels', 'Sturdy paper plates', 'Rice or small grains', 'Tape (for sealing plates)', 'Fish puppets / cutouts', 'Shark toy / puppet', 'Soft mats', 'Optional: speaker for ocean sounds']
  },
  'Paint the Ocean Blue': {
    overview: 'A big ocean art studio exploring blue shades, flowing paint, and sea-inspired textures. Children discover dropping, spraying, rolling, collage, and sponge dabbing to create an underwater voyage.',
    freePlay: {
      purpose: 'To gently invite children into a flowing, ocean-like atmosphere through soft blue textures and simple shapes before structured activities begin.',
      setup: [
        'Set up a central open space on the floor with: blue play silks or sheer fabric spread like waves, soft sponge shapes (fish/turtles)',
        'Materials should be spread out neatly so children can see everything and choose what draws them in.'
      ],
      teacherModels: 'The teacher waves a blue silk slowly up and down once and pauses. The teacher squishes a soft sponge fish once and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Wave.', 'Blue.', 'Squish.', 'Your turn.']
    },
    activities: [
      {
        name: 'Drop & Spray',
        description: 'Children use brushes, droppers, spray bottles, and scrapers to spread different shades of blue on large paper.',
        setup: [
          'Large shared paper securely taped to the floor or tables',
          'Small spray bottles (half-filled with watered-down blue paint)',
          'Droppers, thick brushes, and scrapers spread out nearby',
          'Keep bottles easy to squeeze for little hands'
        ],
        whatToSay: ['Spray.', 'Drop.', 'Spread.', 'Blue.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Roller Painting & Paper Folding',
        description: 'Children roll blue paint on paper, then fold it to discover mirrored patterns.',
        setup: [
          'One thick paper per child (pre-folded in half, then opened flat)',
          'Small paint rollers',
          'Shallow trays with blue paint'
        ],
        whatToSay: ['Roll.', 'Fold.', 'Press.', 'Open.'],
        goal: 'Try simple art tools & create marks and patterns'
      },
      {
        name: 'Blue Bits Tissue Collage',
        description: 'Children tear blue paper and stick it over wave shapes, carefully leaving the pre-made fish visible.',
        setup: [
          'One paper per child with wave outlines and pre-stuck fish cutouts',
          'Bowls of blue tissue paper',
          'Glue sticks'
        ],
        whatToSay: ['Tear.', 'Stick.', 'Wave.', 'Fish.'],
        goal: 'Spot colours and textures through hands-on play'
      },
      {
        name: 'Sponge Dabbing',
        description: 'Children use sponges to dab paint over pre-made fish and turtle shapes, lifting the stencils to reveal the shapes left behind.',
        setup: [
          'Thick paper with pre-cut fish and turtle stencils lightly taped down',
          'Sponges',
          'Shallow plates of blue paint',
          'A clear workspace'
        ],
        whatToSay: ['Dip.', 'Dab.', 'Turtle.', 'Lift.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      }
    ],
    materials: ['Large shared paper / thick paper', 'Washable tempera paint (various shades of blue)', 'Paintbrushes, droppers, small spray bottles, paint scrapers', 'Small paint rollers', 'Blue tissue paper / paper bits', 'Glue sticks', 'Pre-cut wave shapes, fish, and turtle shapes', 'Sponges', 'Blue play silks / sheer blue fabric']
  },
  'Glowing Fish Day': {
    overview: 'A shimmering underwater studio filled with light reflection and tactile resistance. Children explore the textures of the deep sea through metallic foils, fluid movements, and a cozy underwater cave to create a vibrant underwater voyage.',
    freePlay: {
      purpose: 'To gently invite children into a soft "underwater cave" atmosphere using draped fabrics and flowing textures before structured activities begin.',
      setup: [
        'Set up a cozy "underwater cave" by draping blue and green sheer fabrics over a low table or frame',
        'Place soft pool noodles (standing like coral) and drape ribbons nearby',
        'Scatter "jellyfish" (paper bowls with trailing ribbons) for tactile exploration'
      ],
      teacherModels: 'The teacher slowly drapes a sheer blue fabric over a pool noodle and pauses. The teacher gently taps a jellyfish and watches it sway. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Soft.', 'Sway.', 'Blue.', 'Your turn.']
    },
    activities: [
      {
        name: 'Fish Stones & Pebbles',
        description: 'Children explore stones and pebbles to create fishy patterns, arrangements, and textured sea scenes.',
        setup: [
          'Large low-profile wooden trays filled with a thin layer of sand',
          'Smooth river stones and glass pebbles spread in small bowls'
        ],
        whatToSay: ['Smooth.', 'Hide.', 'Stone.', 'Line.'],
        goal: 'Spot colours and textures through hands-on play'
      },
      {
        name: 'Sparkly Fish Sensory Bags',
        description: 'Children press and move glitter, colour, and fish shapes inside sealed, taste-safe sensory bags.',
        setup: [
          'Large sensory bags filled with clear aloe gel and glitter',
          'Flat fish cutouts tucked inside the gel',
          'Bags securely taped to the floor or tables on all four sides'
        ],
        whatToSay: ['Push.', 'Squish.', 'Find.', 'Fish.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Textured Fins',
        description: 'Children decorate fish fins with layered textures, noticing shape, detail, and touch.',
        setup: [
          'Large cardboard fish silhouettes (one per child)',
          'Bowls of pre-cut textured "fins" (bubble wrap, felt, corduroy fabric)',
          'Kid-safe glue sticks'
        ],
        whatToSay: ['Bumpy.', 'Sticky.', 'Press.', 'Fin.'],
        goal: 'Spot colours and textures through hands-on play'
      },
      {
        name: 'Shiny Foil Fish',
        description: 'Children create fish art with shiny foil, exploring crinkle, reflection, and movement.',
        setup: [
          'Pre-cut fish shapes made of heavy-duty aluminum foil',
          'Brightly coloured tempera paint sticks',
          'Cotton swabs for smudging'
        ],
        whatToSay: ['Crinkle.', 'Shiny.', 'Draw.', 'Dots.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      }
    ],
    materials: ['Smooth river stones and blue/green glass pebbles', 'Large low trays and fine sand', 'Clear aloe vera gel (taste-safe)', 'Heavy-duty zip bags and silver glitter', 'Flat plastic fish cutouts and cardboard fish silhouettes', 'Textured materials (corrugated card, bubble wrap, corduroy fabric, felt)', 'Heavy-duty aluminum foil (pre-cut into fish shapes)', 'Brightly coloured tempera paint sticks and cotton swabs', 'Blue and green sheer fabrics, pool noodles, and ribbons']
  },
  'Sea Animal Rescue Day': {
    overview: 'A caring ocean rescue studio where children help sea animals through sorting, freeing, and matching play. Children explore the concepts of rescuing, cleaning, and caring for the ocean using their hands in a soft, engaging environment.',
    freePlay: {
      purpose: 'To gently invite children into a caring "ocean rescue" atmosphere through soft textures and simple sorting play before structured activities begin.',
      setup: [
        'Set up a central open space with a soft blue blanket or play silk acting as the ocean',
        'Place a few sea animals on the blanket and a soft "rescue boat" (a small shallow basket) nearby'
      ],
      teacherModels: 'The teacher slowly picks up a turtle, places it gently into the basket, and pauses. The teacher pats the turtle softly. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Turtle.', 'Rescue.', 'Gentle.', 'Your turn.']
    },
    activities: [
      {
        name: 'Sea Animals Stuck in Net',
        description: 'Children free sea animal toys caught in thick yarn, helping rescue them with careful hands.',
        setup: [
          'Small baskets loosely wrapped with thick, brightly coloured yarn or fabric strips (avoid thin threads for safety)',
          'Place plastic sea animals inside the baskets so children have to reach through or pull the yarn away to "free" them'
        ],
        whatToSay: ['Pull.', 'Help.', 'Out.', 'Free.'],
        goal: 'Develop fine motor skills and spatial awareness through hands-on play'
      },
      {
        name: 'Pull Out All Plastic Bottles',
        description: 'Children sort sea animals and plastic bottles into separate groups, exploring ocean clean-up through play.',
        setup: [
          'A large low tray filled with a blue play silk or a very shallow layer of water',
          'Place plastic sea animals and clean, empty plastic bottles inside',
          'Provide a separate "recycle" bin (a basket) next to the tray'
        ],
        whatToSay: ['Bottle.', 'Out.', 'Clean.', 'Basket.'],
        goal: 'Explore sorting and object permanence through hands-on play'
      },
      {
        name: 'Feed the Fishes',
        description: 'Children feed large cardboard fish the right items by pushing "food" into their open mouths.',
        setup: [
          'Sturdy cardboard boxes with large fish faces drawn on them, with mouths cut wide open',
          'Baskets of large coloured pompoms or soft fabric balls ("fish food") placed next to the boxes'
        ],
        whatToSay: ['Hungry.', 'Feed.', 'Push.', 'Eat.'],
        goal: 'Develop hand-eye coordination and spatial relationships'
      },
      {
        name: 'Baby Fish Mama Fish',
        description: 'Children find all the baby fish that match the colour of their mama fish.',
        setup: [
          'Large solid-coloured "Mama" fish mats (Red, Blue, Yellow) placed flat on the floor',
          'A basket of smaller "Baby" fish cutouts in matching solid colours placed nearby'
        ],
        whatToSay: ['Baby.', 'Mama.', 'Match.', 'Red.'],
        goal: 'Spot colours and shapes through hands-on play'
      }
    ],
    materials: ['Plastic sea animal toys (turtles, whales, dolphins, fish)', 'Thick yarn or soft fabric strips', 'Small open baskets or baking racks', 'Clean empty small plastic bottles', 'Large low trays and blue play silks or towels', 'Large sturdy cardboard boxes', 'Large pompoms or soft fabric balls', 'Large "Mama" fish mats in solid primary colours', 'Small "Baby" fish cutouts in matching colours']
  },
  'Baby Turtles on the Shore': {
    overview: 'A calm shoreline studio where children explore turtle shells, sandy textures, and simple sea-life art. Children discover pressing, rolling, patterning, and pulling to bring baby turtles to life on the shore.',
    freePlay: {
      purpose: 'To gently invite children into a calm "shoreline" atmosphere by exploring "turtle nests" and practicing spatial positioning before structured activities begin.',
      setup: [
        'Set up an open floor space scattered with shallow, soft woven baskets or round floor cushions with an indent (the "nests")',
        'Place a few large, soft white balls or large smooth wooden eggs ("turtle eggs") inside and around the nests'
      ],
      teacherModels: 'The teacher slowly picks up an "egg," places it gently inside a "nest," and pauses. The teacher pats the egg softly. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Egg.', 'Nest.', 'Safe.', 'Your turn.']
    },
    activities: [
      {
        name: 'Rock Turtle Sensory Table',
        description: 'Children decorate pre-drawn turtles and starfish with rocks, filling the shapes with texture and pattern.',
        setup: [
          'Large low trays filled with a thin layer of taste-safe sand',
          'Large laminated outlines of turtles and starfish placed in the trays',
          'Small bowls of large, smooth river stones'
        ],
        whatToSay: ['Stone.', 'Shell.', 'Place.', 'Sand.'],
        goal: 'Spot colours and textures through hands-on play'
      },
      {
        name: 'Turtle Shell Clay Dots',
        description: 'Children press clay dots onto a laminated sea turtle to build its shell design.',
        setup: [
          'One laminated sea turtle mat per child',
          'Small, pre-rolled balls of soft playdough (in greens and browns) placed in shallow bowls'
        ],
        whatToSay: ['Squish.', 'Press.', 'Dot.', 'Shell.'],
        goal: 'Develop fine motor skills and spatial awareness through hands-on play'
      },
      {
        name: 'Turtle Shell Impressions',
        description: 'Children make clay turtles and use tools like Q-tips and stampers to create shell impressions.',
        setup: [
          'Large lumps of soft playdough shaped into simple turtle bodies on individual mats',
          'Small baskets of safe impression tools (Q-tips, thick wooden dowels, or toy block edges)'
        ],
        whatToSay: ['Poke.', 'Press.', 'Mark.', 'Shell.'],
        goal: 'Try simple art tools & create lines, dots, and patterns'
      },
      {
        name: 'Baby Turtle Race',
        description: 'Children pull paper-cup turtles along a thread and slide them across the shore.',
        setup: [
          'Paper cups decorated to look like turtles, with a hole punched on each side',
          'Thick string or yarn threaded through the cups and securely taped at both ends to the floor or low furniture'
        ],
        whatToSay: ['Pull.', 'Slide.', 'Turtle.', 'Go.'],
        goal: 'Explore cause and effect and hand-eye coordination'
      }
    ],
    materials: ['Large low trays and taste-safe sand', 'Large smooth river stones', 'Laminated sea turtle and starfish outlines', 'Soft playdough or clay (green and brown)', 'Safe impression tools (Q-tips, thick wooden dowels)', 'Paper cups (decorated like turtles)', 'Thick string or yarn', 'Shallow woven baskets or round floor cushions', 'Large soft white balls or large wooden eggs']
  },
  'Baby Beluga Sings': {
    overview: 'A calm ocean world of songs, bubbles, and water play where children explore rhythm and gentle underwater movement. Children discover scooping, ringing, swaying, and popping as they move to the rhythm of the sea.',
    freePlay: {
      purpose: 'To gently invite children into an auditory "ocean wave" atmosphere using soft sounds and gentle rhythm before structured activities begin.',
      setup: [
        'Set up a soft, comfortable seating area on the floor using a large blue mat',
        'Scatter a few large "ocean drums" (or sealed wave shakers) and large, chunky bells around the mat'
      ],
      teacherModels: 'The teacher slowly tilts an ocean drum to make a "swoosh" wave sound and pauses. The teacher gently rings a chunky bell and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Listen.', 'Swoosh.', 'Ring.', 'Your turn.']
    },
    activities: [
      {
        name: 'Beluga Bay Water Play',
        description: 'Children scoop, pour, and float boats and sea animals, exploring how things move in water.',
        setup: [
          'Large, low water basins filled with a couple of inches of water',
          'Provide small plastic cups, scoops, floating boats, and plastic beluga whales or fish',
          'Keep thick towels nearby for spills'
        ],
        whatToSay: ['Scoop.', 'Pour.', 'Splash.', 'Float.'],
        goal: 'Explore cause and effect and fluid movement through hands-on play'
      },
      {
        name: 'Beluga Puppet Song with Bells',
        description: 'Children move beluga puppets while ringing bells and listening to the Baby Beluga song.',
        setup: [
          'One soft beluga puppet or plush toy per child, placed next to a chunky bell or ribbon bell',
          'Play the "Baby Beluga" track softly in the background'
        ],
        whatToSay: ['Swim.', 'Ring.', 'Listen.', 'Whale.'],
        goal: 'Develop auditory discrimination and hand-eye coordination'
      },
      {
        name: 'Parachute Ocean Waves',
        description: 'Children sit or lie under a parachute as it rises and falls like ocean waves, with pom-poms, ribbons, and music.',
        setup: [
          'A large blue parachute held by the teacher and parents',
          'Place soft white and blue pom-poms ("sea foam") in the center of the parachute to bounce around'
        ],
        whatToSay: ['Up.', 'Down.', 'Wave.', 'Under.'],
        goal: 'Develop gross motor skills and spatial awareness'
      },
      {
        name: 'Bubble-Pop Rhythm Play',
        description: 'Children watch bubbles pop and clap or shake ribbon bells to match the rhythm of each pop.',
        setup: [
          'Teacher holds a large bubble wand and non-toxic bubble solution',
          'Provide each child with a ribbon bell (or they can simply use their hands to clap)'
        ],
        whatToSay: ['Float.', 'Pop.', 'Clap.', 'Shake.'],
        goal: 'Develop hand-eye coordination and auditory rhythm'
      }
    ],
    materials: ['Large low water basins or water tables', 'Small plastic cups, scoops, floating boats, and plastic sea animals', 'Beluga whale hand puppets or soft beluga toys', 'Large, chunky toddler-safe bells or ribbon bells', 'Large blue parachute', 'Soft blue and white pom-poms', 'Non-toxic bubble solution and wands', 'Ocean drums (or sealed flat containers with beads inside)']
  },
  'Soft Things Basket': {
    overview: 'A soft, calming sensory space where children pull, thread, squish, and explore gentle textures with their hands. Children discover tactile resistance, fine motor manipulation, and colour mixing in a cozy, hands-on environment.',
    freePlay: {
      purpose: 'To gently invite children into a calming, tactile atmosphere by exploring softness and practicing "transporting" schemas before structured activities begin.',
      setup: [
        'Set up an open floor space with a few large, shallow baskets in the center',
        'Fill the main baskets with oversized soft items (giant yarn balls, fleece squares, large pom-poms)',
        'Place smaller, empty baskets nearby'
      ],
      teacherModels: 'The teacher slowly picks up a giant soft pom-pom, gently brushes it against their cheek or hand, places it into an empty basket, and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Soft.', 'Feel.', 'Move.', 'Your turn.']
    },
    activities: [
      {
        name: 'Sticky Yarn Wall',
        description: 'Children pull and place yarn on a taped wall, exploring stretch, stick, and movement.',
        setup: [
          'A low wall space or sturdy easel covered in clear contact paper (sticky side out)',
          'Small baskets of thick yarn pieces placed on the floor right below the sticky surface'
        ],
        whatToSay: ['Stick.', 'Press.', 'Pull.', 'Yarn.'],
        goal: 'Explore cause and effect and tactile resistance through hands-on play'
      },
      {
        name: 'Felt Flowers Yarn Tub',
        description: 'Children choose yarn and felt flowers, then thread the flowers onto the yarn.',
        setup: [
          'Low, shallow tubs containing large felt flowers with wide, pre-cut holes',
          'Provide thick, stiffened yarn (or yarn with ends tightly wrapped in tape to act as a "needle")'
        ],
        whatToSay: ['Push.', 'Pull.', 'Thread.', 'Flower.'],
        goal: 'Develop fine motor skills and hand-eye coordination'
      },
      {
        name: 'Colourful Cotton Bag',
        description: 'Children press cotton and foam inside a zip bag and add colour with droppers to make soft, squishy patterns.',
        setup: [
          'Heavy-duty zip bags pre-filled with dry cotton balls and soft foam pieces',
          'Small cups of coloured water and large toddler-safe droppers',
          'Note: Parents help the child drop the colour in, securely seal the bag, and then lay it flat for squishing'
        ],
        whatToSay: ['Drop.', 'Colour.', 'Squish.', 'Soft.'],
        goal: 'Develop fine motor skills and spatial awareness through hands-on play'
      },
      {
        name: 'Squishy Balloons',
        description: 'Children fill and explore balloons with different materials, then match what they feel to picture clues.',
        setup: [
          'Small bowls of filling materials (flour, dry beans, cornstarch) and wide funnels',
          'Uninflated heavy-duty balloons',
          'Laminated picture cards showing the different fillings',
          'Note: Parents hold the balloon and funnel securely while the child scoops and drops the materials in'
        ],
        whatToSay: ['Scoop.', 'Pour.', 'Squish.', 'Match.'],
        goal: 'Explore tactile discrimination and object permanence'
      }
    ],
    materials: ['Large, shallow woven baskets', 'Oversized soft items (giant yarn balls, fleece squares, large faux-fur pom-poms)', 'Clear contact paper (sticky side out) or wide painter\'s tape', 'Thick, brightly coloured yarn pieces', 'Large felt flower cutouts with wide pre-cut center holes', 'Thick stiffened yarn or shoelaces', 'Heavy-duty zip bags', 'Cotton balls and soft foam pieces', 'Large toddler-safe droppers and small cups of coloured water', 'Thick heavy-duty balloons and wide funnels', 'Filling materials (flour, dry beans, cornstarch)', 'Laminated picture cards']
  },
  'Busy Builders': {
    overview: 'A construction-themed movement zone where children lift, carry, stack, balance, and move like busy builders and machines. Children explore hand-eye coordination, heavy work, pushing, and scooping through hands-on physical play.',
    freePlay: {
      purpose: 'To gently invite children into a "construction site" atmosphere by exploring push-pull movements and heavy-work transporting before structured activities begin.',
      setup: [
        'Set up an open floor space cleared for movement',
        'Place large toy dump trucks or small wagons in the center',
        'Fill the trucks with soft foam blocks and place a few extra blocks on the floor nearby'
      ],
      teacherModels: 'The teacher slowly pushes a dump truck forward, picks up a soft block, places it inside the truck, and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Push.', 'Truck.', 'Block.', 'Your turn.']
    },
    activities: [
      {
        name: 'Pipe Play',
        description: 'Children fit small straw nut bolts into spaghetti pipes, working like little builders with careful hands.',
        setup: [
          'Thick straws or "spaghetti pipes" standing upright (securely poked into a low cardboard box or foam base)',
          'Large toddler-safe plastic nuts and bolts placed in shallow bowls nearby'
        ],
        whatToSay: ['Push.', 'Fit.', 'Build.', 'Turn.'],
        goal: 'Develop fine motor control and hand-eye coordination through hands-on play'
      },
      {
        name: 'Build the Towers',
        description: 'Children build towers with foam blocks on pre-taped triangle and square bases.',
        setup: [
          'Tape large triangles and squares securely on the floor',
          'Large soft foam blocks placed near the shapes to create an inviting build zone'
        ],
        whatToSay: ['Build.', 'Stack.', 'Up.', 'Crash.'],
        goal: 'Move the whole body and explore spatial relationships'
      },
      {
        name: 'Crane Walk on the Beam',
        description: 'Children carry a pool noodle like a crane load, walk along a beam, and place it down standing or lying.',
        setup: [
          'Tape one long, straight "beam" line on the floor',
          'Pool noodles cut in half provided as the "crane load" at the start of the line'
        ],
        whatToSay: ['Walk.', 'Carry.', 'Balance.', 'Drop.'],
        goal: 'Develop gross motor balance and move with simple physical cues'
      },
      {
        name: 'Slow Excavator Scoop',
        description: 'Children slowly scoop and transfer balls from tunnels and under baskets, finding ways to excavate and move them.',
        setup: [
          'Play tunnels and upside-down shallow baskets spread around the open space',
          'Large plastic balls hidden inside the tunnels and tucked under the baskets',
          'Toy scoops or small sturdy buckets placed nearby'
        ],
        whatToSay: ['Scoop.', 'Dig.', 'Find.', 'Move.'],
        goal: 'Develop core stability and cross the midline through full-body play'
      }
    ],
    materials: ['Large toy dump trucks or small wagons', 'Soft foam blocks', 'Thick straws or "spaghetti pipes"', 'Large toddler-safe plastic nuts and bolts', 'Wide painter\'s tape', 'Pool noodles (cut in half)', 'Large plastic balls', 'Play tunnels', 'Shallow baskets', 'Toy scoops or small buckets']
  },
  'Bubble Pop Up': {
    overview: 'A sensory playdate exploring bubbles, foam, and pop-up textures. Children discover blowing, popping, squishing, and scooping through bubbly, tactile play.',
    freePlay: {
      purpose: 'To gently invite children into a bubbly, playful atmosphere through safe bubble and foam materials before structured activities begin.',
      setup: [
        'Set up an open floor space with shallow trays of non-toxic bubble solution',
        'Provide bubble wands, whisks, and sponges',
        'Keep towels and wipes nearby'
      ],
      teacherModels: 'The teacher slowly dips a wand into bubble solution, blows gently, and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Bubble.', 'Pop.', 'Blow.', 'Your turn.']
    },
    activities: [
      {
        name: 'Bubble Foam Tray',
        description: 'Children scoop, squish, and spread coloured bubble foam in trays, exploring texture and colour mixing.',
        setup: [
          'Shallow trays with pre-made coloured bubble foam',
          'Scoops, cups, and spoons',
          'One tray per child'
        ],
        whatToSay: ['Scoop.', 'Squish.', 'Soft.', 'More.'],
        goal: 'Explore sensory textures through hands-on play'
      },
      {
        name: 'Bubble Wrap Stomp',
        description: 'Children walk, stomp, and jump on bubble wrap to hear and feel the pop.',
        setup: [
          'Large sheets of bubble wrap taped securely to the floor',
          'Open space for safe movement',
          'Soft mats around the edges'
        ],
        whatToSay: ['Pop.', 'Stomp.', 'Jump.', 'Again.'],
        goal: 'Move the whole body and explore cause and effect'
      },
      {
        name: 'Bubble Painting',
        description: 'Children blow coloured bubbles onto paper to create bubble-print art.',
        setup: [
          'Shallow cups with coloured bubble solution',
          'Straws (with holes for safety) or bubble wands',
          'White paper sheets',
          'Aprons and wipes nearby'
        ],
        whatToSay: ['Blow.', 'Pop.', 'Colour.', 'Print.'],
        goal: 'Try simple art tools & create patterns'
      },
      {
        name: 'Pop-Up Surprise Cups',
        description: 'Children lift cups to find hidden objects underneath, exploring object permanence and surprise.',
        setup: [
          'Opaque cups arranged upside down on a tray',
          'Small toys, pom-poms, or foam shapes hidden underneath',
          'One tray per child'
        ],
        whatToSay: ['Lift.', 'Find.', 'Surprise.', 'Again.'],
        goal: 'Explore object permanence and spatial awareness'
      }
    ],
    materials: ['Non-toxic bubble solution', 'Bubble wands and whisks', 'Shallow trays', 'Coloured bubble foam', 'Scoops, cups, and spoons', 'Bubble wrap', 'Straws (with safety holes)', 'White paper sheets', 'Opaque cups', 'Small toys and pom-poms', 'Aprons and towels']
  },
  'Busy City Runners': {
    overview: 'A busy city movement zone where children pack, drive, ride, and fly through playful road, rail, and air adventures. Children explore spatial awareness, gross motor transport, heavy work, and hand-eye coordination through hands-on physical play.',
    freePlay: {
      purpose: 'To gently invite children into a "busy city" atmosphere by exploring push-pull movements with vehicles and simple stacking before structured activities begin.',
      setup: [
        'Set up an open floor space with wide painter\'s tape laid out as simple intersecting "roads"',
        'Place large soft foam blocks or sturdy cardboard boxes near the roads to act as "buildings"',
        'Scatter large, toddler-safe toy cars and trucks along the roads'
      ],
      teacherModels: 'The teacher slowly pushes a toy car along the tape road, stops next to a foam block, places another block on top to "build," and pauses. Parents first watch the teacher, then copy the same action once, and then pause to let the child try.',
      whatToSay: ['Drive.', 'Stop.', 'Build.', 'Your turn.']
    },
    activities: [
      {
        name: 'Busy Busy Bag Pack',
        description: 'Children pack scarves, balls, and blocks into a bag, then solve small challenges like untangling, finding, and rebuilding.',
        setup: [
          'Small tote bags or backpacks for each child',
          'Shallow baskets containing a mix of items: play scarves loosely knotted around small soft blocks, and soft plastic balls'
        ],
        whatToSay: ['Pull.', 'Pack.', 'Heavy.', 'Carry.'],
        goal: 'Develop fine motor manipulation and heavy-work transporting'
      },
      {
        name: 'Reaching in Your Car',
        description: 'Children follow taped roads and crossings, pushing soft-block cars and pretending to steer them with hula hoop wheels.',
        setup: [
          'Wide painter\'s tape laid out in intersecting straight "roads" on the floor',
          'Provide large soft foam blocks (to push as cars) and small hula hoops (to hold as steering wheels)'
        ],
        whatToSay: ['Push.', 'Steer.', 'Drive.', 'Stop.'],
        goal: 'Move the whole body and navigate spatial pathways'
      },
      {
        name: 'Sitting in the Train',
        description: 'Children and parents arrange soft blocks on taped tracks to make a train, then sit, queue, and move together with train sounds.',
        setup: [
          'Tape a long, straight "train track" line on the floor',
          'Soft foam blocks placed along the track for seating',
          'Optional: simple train whistle or shaker'
        ],
        whatToSay: ['Sit.', 'Queue.', 'Choo-choo.', 'Go.'],
        goal: 'Develop gross motor coordination and social play'
      },
      {
        name: 'Fly the Plane',
        description: 'Children run along a runway path, balance on a wobble board, and launch soft foam gliders or paper planes.',
        setup: [
          'Tape a runway pathway on the floor',
          'Low slant board or indoor toddler slide at one end',
          'Low wobble board along pathway',
          'Soft foam gliders or pre-folded paper planes (with blunt/folded tips for safety)'
        ],
        whatToSay: ['Run.', 'Balance.', 'Fly.', 'Land.'],
        goal: 'Move the whole body with balance and coordination'
      }
    ],
    materials: ['Play scarves, soft plastic balls, and small soft blocks', 'Small sturdy tote bags or toddler-sized backpacks', 'Wide painter\'s tape', 'Large soft foam blocks or sturdy cardboard boxes', 'Large toddler-safe toy cars and trucks', 'Small hula hoops', 'Low slant board and low wobble board', 'Soft foam gliders or pre-folded paper planes', 'Shallow baskets']
  },
  'Mixing Bowls': {
    overview: 'A busy, kitchen-inspired sensory space where children progress from exploring dry textures to whisking foam, squeezing water into glasses, and following simple picture clues to make their own sensory soups.',
    freePlay: {
      purpose: 'To gently invite children into the kitchen theme by exploring the physical tools — focusing on sound, size, and containment — before introducing the messy sensory elements.',
      setup: [
        'A wide floor area with a variety of empty metal mixing bowls (nested and scattered), small pots, and wooden spoons.',
        'Materials are spread out so children can safely drum, stack, or carry the bowls around.'
      ],
      teacherModels: 'The teacher sits on the floor, gently taps a large bowl with a wooden spoon to listen to the sound, and then places a smaller bowl inside a larger one.',
      whatToSay: ['Tap.', 'Loud.', 'Inside.', 'Big bowl.']
    },
    activities: [
      {
        name: 'Dry Scoop and Fill',
        description: 'Children explore metal bowls of dry oats and pasta, using scoops to carefully transfer and fill small jars with crunchy textures.',
        setup: ['One tray per child containing a mix of dry oats and pasta.', 'Two to three small jars and one sturdy metal scoop.'],
        whatToSay: ['Fill.', 'Heavy.', 'Shhh (listen to the grains).', 'Again.'],
        goal: 'Explore textures with safe materials.'
      },
      {
        name: 'Whisking Foam and "Serving"',
        description: 'Children use small whisks to whip up soapy water into thick foam, then use large spoons to scoop and serve the bubbles onto plates.',
        setup: ['Deep metal bowls with a small amount of soapy water.', 'Small hand whisks.', 'Large serving spoons and flat plastic plates nearby.'],
        whatToSay: ['Whisk.', 'Bubbles.', 'Soft.', 'Serve.'],
        goal: 'Explore textures with safe materials.'
      },
      {
        name: 'Sponge Squeeze Juice Mixing',
        description: 'Children transfer primary-coloured water using large sponges, squeezing the wet sponges into clear plastic glasses to mix new juice colours.',
        setup: ['Three central bowls of water (Red, Yellow, Blue).', 'One large sponge per child.', 'Two clear plastic glasses for each child to experiment with mixing.'],
        whatToSay: ['Dip.', 'Squeeze.', 'Wet.', 'Change!'],
        goal: 'Notice simple sensory differences (colour/wetness).'
      },
      {
        name: 'Nature Soup Recipe Match',
        description: 'Children look at simple visual recipe cards and pick those specific natural items — like leaves, petals, and citrus — to mix into their personal water bowls.',
        setup: ['Individual water bowls for each child.', 'Trays containing separated natural items (citrus, mint, petals).', 'Laminated cards showing pictures of the items to be added.'],
        whatToSay: ['Find.', 'Match.', 'Stir.', 'Smell.'],
        goal: 'Gently introduce new smells through pretend play.'
      }
    ],
    materials: ['Empty metal bowls (various sizes), pots, and wooden spoons', 'Dry oats and pasta shapes', 'Small jars with lids', 'Metal and plastic scoops', 'Small whisks', 'Dish soap (child-safe/tear-free)', 'Large spoons and serving plates', 'Large sponges', 'Primary-coloured water (Red, Blue, Yellow)', 'Clear plastic glasses', 'Visual recipe cards (simple pictures)', 'Natural items: leaves, flower petals, citrus peels']
  },
  'The Hungry Caterpillar': {
    overview: 'A musical bug world of crawling, munching sounds, and stories where children explore rhythm, tempo, and listening through hands-on play and props.',
    freePlay: {
      purpose: 'To gently invite children into the space using gross motor movement (crawling like bugs) and open-ended percussive sound.',
      setup: [
        'A bright green play tunnel stretched out across the floor to represent the caterpillar.',
        'A scatter of flat hand drums and tambourines waiting at the exit of the tunnel.'
      ],
      teacherModels: 'The teacher crawls slowly through the tunnel, pops out at the end, and playfully taps a drum with their hands.',
      whatToSay: ['Crawl.', 'Through.', 'Pop out!', 'Tap.']
    },
    activities: [
      {
        name: 'Munching Rhythm Sticks',
        description: 'Children use wooden rhythm sticks to tap out the "crunch, crunch" sounds of the hungry caterpillar, exploring fast and slow beats as he eats.',
        setup: ['Open seating on the floor.', 'One pair of wooden rhythm sticks per child.'],
        whatToSay: ['Tap.', 'Crunch.', 'Fast.', 'Slow.'],
        goal: 'Explore rhythm and tempo through hands-on instrument play.'
      },
      {
        name: 'The Hungry Caterpillar Story',
        description: 'Children listen to The Hungry Caterpillar, actively joining in by feeding small fruit props to a large caterpillar puppet and making loud munching sounds.',
        setup: ['A cozy storytelling space.', 'The teacher holds the book and the large caterpillar puppet.', 'A central basket or tray containing the small fruit props for children to reach.'],
        whatToSay: ['Look.', 'Hungry.', 'Feed him.', 'Munch!'],
        goal: 'Engage in interactive storytelling and active listening.'
      },
      {
        name: 'Make Your Own Cocoon Shaker',
        description: 'Children fill small cardboard tubes with dry beans to create their own cocoon shakers, then shake them together to make gentle, rhythmic resting sounds.',
        setup: ['Individual stations or trays for each child.', 'A cardboard tube (sealed at the bottom), a small bowl of dry beans, and a small scoop.', 'Adults keep tape on hand to quickly seal the top once filled.'],
        whatToSay: ['Scoop.', 'Fill.', 'Seal.', 'Shake gently.'],
        goal: 'Develop fine motor control and explore cause-and-effect with self-made sound.'
      },
      {
        name: 'Sleeping Caterpillars, Flying Butterflies',
        description: 'Children hide under soft play silks while the music is slow and quiet, then throw the silks up to "fly" around the room when the butterfly music starts.',
        setup: ['Clear the floor space for movement.', 'Hand one bright play silk or scarf to each child.', 'Speaker ready with contrasting tracks (slow/quiet vs. fast/upbeat).'],
        whatToSay: ['Hide.', 'Shhh.', 'Up!', 'Fly.'],
        goal: 'Respond to musical cues (tempo/dynamics) using gross motor movement.'
      }
    ],
    materials: ['Bright green play tunnel (pop-up tunnel)', 'Flat hand drums or tambourines', 'Wooden rhythm sticks', 'The Very Hungry Caterpillar board book', 'Large caterpillar puppet (or a decorated box with a mouth hole)', 'Small felt or plastic fruit props', 'Small cardboard tubes (pre-sealed on one end)', 'Dry beans and small scoops', 'Tape (for adults to seal the shakers)', 'Soft play silks or lightweight scarves', 'Music player/speaker (slow/quiet music and upbeat "flying" music)']
  },
  'Butterfly Songs': {
    overview: 'A musical bug world of crawling, munching sounds, and stories where children explore rhythm, tempo, and listening through hands-on play and props.',
    freePlay: {
      purpose: 'To gently invite children into the space using gross motor movement (crawling like bugs) and open-ended percussive sound.',
      setup: [
        'A bright green play tunnel stretched out across the floor to represent the caterpillar.',
        'A scatter of flat hand drums and tambourines waiting at the exit of the tunnel.'
      ],
      teacherModels: 'The teacher crawls slowly through the tunnel, pops out at the end, and playfully taps a drum with their hands.',
      whatToSay: ['Crawl.', 'Through.', 'Pop out!', 'Tap.']
    },
    activities: [
      {
        name: 'Munching Rhythm Sticks',
        description: 'Children use wooden rhythm sticks to tap out the "crunch, crunch" sounds of the hungry caterpillar, exploring fast and slow beats as he eats.',
        setup: ['Open seating on the floor.', 'One pair of wooden rhythm sticks per child.'],
        whatToSay: ['Tap.', 'Crunch.', 'Fast.', 'Slow.'],
        goal: 'Explore rhythm and tempo through hands-on instrument play.'
      },
      {
        name: 'The Hungry Caterpillar Story',
        description: 'Children listen to The Hungry Caterpillar, actively joining in by feeding small fruit props to a large caterpillar puppet and making loud munching sounds.',
        setup: ['A cozy storytelling space.', 'The teacher holds the book and the large caterpillar puppet.', 'A central basket or tray containing the small fruit props for children to reach.'],
        whatToSay: ['Look.', 'Hungry.', 'Feed him.', 'Munch!'],
        goal: 'Engage in interactive storytelling and active listening.'
      },
      {
        name: 'Make Your Own Cocoon Shaker',
        description: 'Children fill small cardboard tubes with dry beans to create their own cocoon shakers, then shake them together to make gentle, rhythmic resting sounds.',
        setup: ['Individual stations or trays for each child.', 'A cardboard tube (sealed at the bottom), a small bowl of dry beans, and a small scoop.', 'Adults keep tape on hand to quickly seal the top once filled.'],
        whatToSay: ['Scoop.', 'Fill.', 'Seal.', 'Shake gently.'],
        goal: 'Develop fine motor control and explore cause-and-effect with self-made sound.'
      },
      {
        name: 'Sleeping Caterpillars, Flying Butterflies',
        description: 'Children hide under soft play silks while the music is slow and quiet, then throw the silks up to "fly" around the room when the butterfly music starts.',
        setup: ['Clear the floor space for movement.', 'Hand one bright play silk or scarf to each child.', 'Speaker ready with contrasting tracks (slow/quiet vs. fast/upbeat).'],
        whatToSay: ['Hide.', 'Shhh.', 'Up!', 'Fly.'],
        goal: 'Respond to musical cues (tempo/dynamics) using gross motor movement.'
      }
    ],
    materials: ['Bright green play tunnel (pop-up tunnel)', 'Flat hand drums or tambourines', 'Wooden rhythm sticks', 'The Very Hungry Caterpillar board book', 'Large caterpillar puppet (or a decorated box with a mouth hole)', 'Small felt or plastic fruit props', 'Small cardboard tubes (pre-sealed on one end)', 'Dry beans and small scoops', 'Tape (for adults to seal the shakers)', 'Soft play silks or lightweight scarves', 'Music player/speaker (slow/quiet music and upbeat "flying" music)']
  },
  'Jungle Beats': {
    overview: 'A lively jungle world of animal sounds, drum beats, and stories where children explore rhythm, volume, and movement through hands-on music play.',
    freePlay: {
      purpose: 'To gently invite children into the jungle environment using gross motor movement and ringing sounds.',
      setup: [
        'A "jungle vine" station: thick green yarn or rope strung safely between two low chairs, with large metal jingle bells securely tied along the line.',
        'A soft green mat underneath for children to sit, roll, or crawl under.'
      ],
      teacherModels: 'The teacher crawls under the "vine", reaches up, and gently bats a bell with an open hand to make it ring, smiling at the sound.',
      whatToSay: ['Reach.', 'Ring.', 'Crawl.', 'Ting!']
    },
    activities: [
      {
        name: 'Monkey Drum Rhythms',
        description: 'Children use their hands to pat large floor drums, making loud and soft monkey beats to explore fast, slow, and heavy rhythms.',
        setup: ['Open seating on the floor.', 'One large floor drum (or sturdy tub) per child, or a few extra-large gathering drums to share.'],
        whatToSay: ['Pat.', 'Loud.', 'Soft.', 'Fast.'],
        goal: 'Explore rhythm, tempo, and volume through hands-on instrument play.'
      },
      {
        name: 'The Noisy Jungle Story',
        description: 'Children listen to a jungle animal story, joining in by shaking colourful maracas and stomping their feet when their favourite animal appears.',
        setup: ['A cozy storytelling space.', 'The teacher holds the jungle picture book.', 'A central basket containing colourful maracas for children to grab.'],
        whatToSay: ['Listen.', 'Shake.', 'Stomp.', 'Roar!'],
        goal: 'Engage in interactive storytelling and active listening.'
      },
      {
        name: 'Crocodile Scrapers',
        description: 'Children use wooden craft sticks to rub across textured, corrugated cardboard "crocodiles", discovering a new scraping action to make rough, rhythmic jungle sounds.',
        setup: ['Individual stations or trays for each child.', 'One corrugated cardboard "crocodile" and one thick wooden craft stick per child.'],
        whatToSay: ['Rub.', 'Scrape.', 'Rough.', 'Listen.'],
        goal: 'Discover different ways to produce sound (scraping vs. hitting) and refine fine motor control.'
      },
      {
        name: 'Animal Action Freeze',
        description: 'Children hold soft jungle animal toys and jump, swing, or stomp as the music plays, then freeze in their animal pose when the music stops.',
        setup: ['Clear the floor space for safe movement.', 'A basket of soft jungle animal toys for children to choose from.', 'Speaker ready with upbeat music that has clear, distinct pauses.'],
        whatToSay: ['Jump.', 'Swing.', 'Stop!', 'Freeze.'],
        goal: 'Respond to musical cues (play/pause) using gross motor movement and practice self-regulation.'
      }
    ],
    materials: ['Large floor drums (or large, safe overturned tubs/buckets)', 'A jungle-themed picture book (e.g., Rumble in the Jungle)', 'Colourful maracas', 'Pre-cut corrugated cardboard pieces (shaped like crocodiles)', 'Thick wooden craft sticks', 'Soft jungle animal toys (monkeys, elephants, lions)', 'Speaker with upbeat "jungle" music with clear pauses', 'Thick green yarn or rope and large jingle bells', 'Low chairs or heavy furniture to anchor the yarn']
  },
  'Nature Press': {
    overview: 'A calm, natural art studio where children press, roll, rub, and stamp leaves and flowers, exploring shapes, textures, and natural colours through hands-on play.',
    freePlay: {
      purpose: 'To gently invite children into the nature theme by exploring the textures and shapes of natural items on a large-scale sticky surface, completely separate from the tabletop pressing, rolling, and painting activities.',
      setup: [
        'A large sheet of clear contact paper (sticky side out) securely taped to the wall at toddler height.',
        'A low, wide basket on the floor filled with light, dry natural items: soft grass, fluffy feathers, and crinkly dry autumn leaves.'
      ],
      teacherModels: 'The teacher takes a dry leaf, crinkles it slightly near their ear to hear the sound, then presses it flat onto the sticky wall, tapping it to make sure it stays.',
      whatToSay: ['Touch.', 'Sticky.', 'Press.', 'Stay.']
    },
    activities: [
      {
        name: 'Magic Leaf Rubbings',
        description: 'Children rub unwrapped wax crayons flat over paper with leaves hidden underneath, watching the "magic" leaf veins and shapes appear.',
        setup: ['Tape a few sturdy leaves flat onto the table, then tape a piece of white paper securely over them so nothing slides around.', 'Provide small baskets of chunky, unwrapped wax crayons for children to grasp with their whole hand.'],
        whatToSay: ['Rub.', 'Hard.', 'Look!', 'Magic.'],
        goal: 'Refine fine motor grasp and discover cause-and-effect through tool use.'
      },
      {
        name: 'Clay Leaf Impressions',
        description: 'Children use small wooden rollers or their hands to press sturdy leaves into soft playdough, then carefully peel them back to reveal the bumpy leaf lines left behind.',
        setup: ['Individual mats for each child with a pre-flattened, thick disc of soft playdough.', 'A selection of heavily veined leaves and small wooden hand-rollers.'],
        whatToSay: ['Press.', 'Roll.', 'Peel.', 'Bumpy.'],
        goal: 'Explore textures and the physical transfer of patterns using safe, moldable materials.'
      },
      {
        name: 'Painted Leaf Stamping',
        description: 'Children dab washable paint onto large, textured leaves using soft sponges, then flip and press them onto heavy paper to make colourful leaf prints.',
        setup: ['Shallow bowls or trays of washable paint.', 'Soft sponges to dab the paint (preventing the leaf from getting too slippery).', 'Large leaves and heavy paper ready for stamping.'],
        whatToSay: ['Dab.', 'Paint.', 'Flip.', 'Press.'],
        goal: 'Explore visual arts and colour transfer through hands-on, messy tool-based play.'
      },
      {
        name: 'Petal Pounding Press',
        description: 'Children place bright flower petals under a piece of cloth or heavy paper and use small wooden blocks or soft mallets to tap and pound them, squishing out the natural colours to make a print.',
        setup: ['Individual stations with a thick mat or wooden board.', 'A small bowl of bright flower petals.', 'Squares of cloth/heavy paper and small wooden blocks or soft mallets.'],
        whatToSay: ['Cover.', 'Tap.', 'Pound.', 'Colour!'],
        goal: 'Develop hand-eye coordination and physical force regulation while discovering natural pigment extraction.'
      }
    ],
    materials: ['Clear contact paper and masking tape', 'Light natural items: dry leaves, feathers, soft grass', 'Unwrapped, chunky wax crayons', 'A large variety of leaves (sturdy, deeply veined, large and small)', 'White paper (regular printer paper and heavy/watercolour paper)', 'Soft playdough or clay', 'Small wooden rollers', 'Washable liquid paint (earthy or bright colours)', 'Soft sponges or sponge dabbers', 'Bright flower petals (e.g., marigolds, roses)', 'Small squares of light cotton cloth or heavy paper', 'Small wooden blocks or soft toy mallets', 'Thick mats or individual wooden boards']
  },
  'Traffic Light Movers': {
    overview: 'A busy, traffic-themed movement space where children toss, drive, stretch, and freeze, exploring gross motor coordination, colour matching, and physical stop-and-go control through hands-on play.',
    freePlay: {
      purpose: 'To gently invite children into the movement space by exploring the physical concepts of "rolling" and "speed".',
      setup: [
        'A clear area with one or two low, sturdy ramps (wooden blocks with a flat board over them).',
        'A basket of large wooden wheels or thick cardboard discs resting at the top.'
      ],
      teacherModels: 'The teacher sits beside the ramp, gently places a large wheel at the top, and lets it go, watching it speed down and roll across the floor.',
      whatToSay: ['Roll.', 'Fast.', 'Down it goes.', 'Catch!']
    },
    activities: [
      {
        name: 'Traffic Light Toss',
        description: 'Children toss red, yellow, and green bean bags or soft balls into matching coloured hoops or baskets, exploring hand-eye coordination and colour sorting.',
        setup: ['Hoops or baskets spread out on the floor by colour.', 'A central bin overflowing with red, yellow, and green bean bags.'],
        whatToSay: ['Hold.', 'Look.', 'Toss.', 'Red in red!'],
        goal: 'Develop gross motor coordination (underhand tossing/releasing) and practice visual discrimination (colour matching).'
      },
      {
        name: 'Taped Road Shapes',
        description: 'Children walk along and push toy vehicles over large red, yellow, and green tape shapes on the floor, navigating physical pathways and tracing traffic light outlines.',
        setup: ['Large, simple shapes (circle, square, zig-zag) taped securely onto the floor using the coloured tape.', 'A basket of small, chunky toy vehicles nearby.'],
        whatToSay: ['Walk.', 'Stay on the line.', 'Drive.', 'Vroom.'],
        goal: 'Enhance dynamic balance and spatial awareness.'
      },
      {
        name: 'Transportation Yoga',
        description: 'Children explore body balance and gentle stretching by mimicking simple transport movements, like reaching tall like a rocket or sitting and rocking like a boat.',
        setup: ['Yoga mats laid out in a semi-circle so everyone has their own soft, defined space.'],
        whatToSay: ['Reach high.', 'Rocket.', 'Sit down.', 'Rock the boat.'],
        goal: 'Build core strength, practice static balance, and increase kinesthetic body awareness.'
      },
      {
        name: 'Stop and Go Dance',
        description: 'Children dance freely to a lively song and practice whole-body control by freezing in place when a red circle is held up, and moving again when they see the green circle.',
        setup: ['Clear the floor space completely so children can move without bumping into objects.', 'Teacher holds the red and green circle paddles, with the music ready to play.'],
        whatToSay: ['Dance.', 'Green means go.', 'Look!', 'Red means stop... freeze.'],
        goal: 'Develop inhibitory control (self-regulation) and practice responding rapidly to visual and auditory cues.'
      }
    ],
    materials: ['Low wooden ramps or sturdy cardboard inclines', 'Large wooden wheels or thick, sturdy cardboard discs', 'Red, yellow, and green bean bags (or soft balls)', 'Red, yellow, and green hula hoops or large baskets', 'Wide floor tape in red, yellow, and green', 'Small, chunky toy vehicles', 'Yoga mats', 'A lively, upbeat song and speaker', 'One large red cardboard circle and one large green cardboard circle (paddles)']
  }
};

export interface CentreTimings {
  name: string;
  days: string;
  weekdaySlots: string;
  weekendSlots: string;
  capacity: {
    weekend: string;
    weekday: string;
  };
}

export const CENTRES_TIMINGS: CentreTimings[] = [
  {
    name: 'Haralur',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Afternoon: 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'HRBR',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Tue & Thu: Morning 10:30 - 11:30, Afternoon 3:30 - 4:30\nMon & Wed: Afternoon 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'HSR',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Tue & Thu: Morning 10:30 - 11:30, Afternoon 3:30 - 4:30\nMon & Wed: Afternoon 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Indiranagar',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Tue & Thu: Morning 10:30 - 11:30, Afternoon 3:30 - 4:30\nMon & Wed: Afternoon 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Jayanagar',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Afternoon: 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'JP Nagar',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Morning: 10:30 - 11:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Sadashivnagar',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Morning: 10:30 - 11:30\nAfternoon: 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Sahakar Nagar',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Tue & Thu: Morning 10:30 - 11:30, Afternoon 3:30 - 4:30\nMon & Wed: Afternoon 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Sarjapur',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Afternoon: 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  },
  {
    name: 'Whitefield',
    days: 'Mon, Tue, Wed, Thu, Sat',
    weekdaySlots: 'Tue & Thu: Morning 10:30 - 11:30, Afternoon 3:30 - 4:30\nMon & Wed: Afternoon 3:30 - 4:30',
    weekendSlots: 'Sat: 10:00 - 11:30 & 12:00 - 1:00',
    capacity: { weekend: '10 (6 subscribers + 4 non-subscribers)', weekday: '9 (6 subscribers + 3 non-subscribers)' }
  }
];
