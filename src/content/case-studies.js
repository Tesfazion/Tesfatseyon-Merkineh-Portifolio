/**
 * case-studies.js — the long-form half of every project.
 *
 * Split from config.js on purpose. config.js is imported by the
 * eagerly-loaded command palette (see CommandPalette.jsx), so anything left
 * in it lands in the entry chunk and is downloaded before the landing page
 * paints. The identity fields a card needs — title, blurb, tags, category,
 * links — stay in config.js; the problem/approach/outcome narrative only
 * matters inside the case-study dialog, and that dialog only exists in the
 * lazily-loaded portfolio chunk.
 *
 * Each project carries a `study:` id in config.js that keys into this map.
 * A project without an id simply has no case study, and ProjectModal falls
 * back to the card summary.
 *
 * Every field is optional except `role`; ProjectModal skips the rest.
 */
export const caseStudies = {
  /* VisionSpeak AI */
  "visionspeak-ai": {
    role:     "Product engineer — browser-side analysis, scoring, reporting, API routes, and persistence.",
    status:   "Public demo. Latest CI run is blocked by missing TEST_DATABASE_URL configuration; scores are practice heuristics, not validated assessments.",
    problem:  "People practicing a presentation need useful feedback on delivery, but camera and microphone recordings are sensitive and should not have to leave the device.",
    approach: "Run face, pose, and hand analysis with MediaPipe in the browser, derive voice and speech cues from browser APIs, and send session samples—not raw media—to Next.js route handlers backed by PostgreSQL.",
    outcome:  "A public sample report demonstrates the complete practice-to-report flow. The project documents what signals are measured, how scores are derived, and where the heuristics can be misleading.",
    highlights: [
      "Ran face, pose, and hand inference locally with MediaPipe Tasks Vision and WebAssembly",
      "Combined visual, voice, and speech cues into explainable practice feedback",
      "Persisted session reports through Next.js APIs and PostgreSQL",
      "Documented account ownership, data integrity, tests, and browser limitations",
    ],
    evidence: [
      { label: "Automated test suite", href: "https://github.com/Tesfazion/visionspeak-ai/tree/main/tests" },
      { label: "CI workflow", href: "https://github.com/Tesfazion/visionspeak-ai/actions/workflows/ci.yml" },
      { label: "Technical documentation", href: "https://github.com/Tesfazion/visionspeak-ai/tree/main/docs" },
    ],
    learned:  "Keeping inference on-device protects private media but makes results depend on browser and device conditions. I would validate the coaching heuristics with users before using scores for decisions beyond practice.",
    stack: ["Next.js", "TypeScript", "MediaPipe", "Web APIs", "PostgreSQL"],
  },

  /* Hotel Design Website */
  "hotel-design-website": {
    role:     "Frontend developer — layout, responsive behaviour, and visual design.",
    problem:  "A hotel site has one job: get the visitor to enquire or book. Generic templates bury the booking action and make a premium property look like every other listing.",
    approach:  "Design the page around the booking path — put the reservation action where a scanning visitor reaches it, then build outward to rooms, amenities, and location. Mobile-first throughout, so the compact layout is the primary one rather than an afterthought.",
    outcome:  "A marketing-ready site that reads as a premium property on any screen, with a booking-first structure instead of a brochure layout.",
    highlights: [
      "Built mobile-first, so the phone layout is designed rather than squeezed",
      "Put the booking action on the critical path instead of in a footer",
      "Kept the file structure compact and the CSS maintainable",
      "Verified cross-device behaviour on real breakpoints",
    ],
    learned:  "Structuring around the conversion action first made every later styling decision easier. I would set the type scale and spacing tokens before building sections.",
  },

  /* LeadForge AI */
  "leadforge-ai": {
    role:     "Product developer — Next.js interface, lead workflows, provider integrations, and website delivery.",
    status:   "In development. Provider setup is required; inbox sync, team access, and billing are not active.",
    problem:  "Small teams often manage prospect discovery, outreach, conversations, and project delivery across disconnected tools, making handoffs and follow-up difficult to track.",
    approach: "Built a workspace around lead records, human-reviewed outreach, conversation history, requirements capture, and generated website files. Optional discovery, AI, email, and deployment depend on provider configuration.",
    outcome:  "The repository documents a working lead-management and website-delivery workflow, with explicit limitations: inbound email sync is not implemented, replies entered in the UI are simulated, and billing is scaffolding only.",
    highlights: [
      "Separated prospect, outreach, conversation, project, and analytics workflows",
      "Made outreach review and approval explicit before sending",
      "Documented provider-dependent capabilities and incomplete workflows",
      "Added website generation and Vercel deployment when configured",
    ],
    evidence: [
      { label: "Architecture and limitations", href: "https://github.com/Tesfazion/LeadForge-AI#architecture" },
      { label: "Product screenshots", href: "https://github.com/Tesfazion/LeadForge-AI#screenshots" },
      { label: "Development and tests", href: "https://github.com/Tesfazion/LeadForge-AI#development-and-tests" },
    ],
    stack: ["Next.js", "Node.js", "Supabase", "Prisma"],
  },

  /* Network Management Suite */
  "network-management-suite": {
    role:     "Full-stack developer — Express application, PostgreSQL workflows, monitoring, and team access.",
    status:   "Public source repository; no hosted demo is linked.",
    problem:  "Infrastructure teams need one place to document devices, physical connections, IP/VLAN assignments, and operational issues across their network.",
    approach: "Built a Node.js and Express application with PostgreSQL-backed organization and inventory workflows, monitoring routes, access middleware, and a WebSocket layer for live updates.",
    outcome:  "The repository includes network inventory and monitoring features, API tests, security tests, and setup documentation for a self-hosted application.",
    highlights: [
      "Organized the server into route, middleware, and test modules",
      "Covered API behavior, rate limits, and security with Node's test runner",
      "Documented PostgreSQL setup and self-hosted deployment",
      "Included a WebSocket layer for live dashboard updates",
    ],
    evidence: [
      { label: "OpenAPI specification", href: "https://github.com/Tesfazion/network-management-suite/blob/main/openapi.yaml" },
      { label: "Server test suite", href: "https://github.com/Tesfazion/network-management-suite/tree/main/server/test" },
      { label: "CI workflow", href: "https://github.com/Tesfazion/network-management-suite/actions/workflows/ci.yml" },
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "WebSockets"],
  },

  /* Hospital Management System */
  "hospital-management-system": {
    role:     "Full-stack developer — database schema, CRUD backend, and the front-office dashboard.",
    problem:  "Patient records, staff rosters, and appointments live in different places, so reception retypes the same information several times per patient and scheduling conflicts surface only when a patient is already at the desk.",
    approach:  "Design the database around the patient record as the single source of truth, then build the four workflows that generate it — registration, appointment booking, staff assignment, and record history — onto one dashboard so each step writes to the same row.",
    outcome:  "One clean interface for patients, staff, appointments, and records, removing duplicate entry and making schedule conflicts visible before the appointment, not during it.",
    highlights: [
      "Normalised schema with the patient record as the single source of truth",
      "Registration, booking, staff assignment, and record history in one dashboard",
      "Conflict checks at booking time rather than at the front desk",
      "Full CRUD backend with validation on every write",
    ],
    learned:  "Modelling the record correctly mattered more than any screen. I would design the schema with whoever works at reception, because they know where the duplicate entry actually happens.",
  },

  /* Sunshine Tech Solution — the studio's own site.
     Every claim below is verifiable in the public repository: the stack is
     React + TypeScript + Vite + Tailwind, the six locales and the Arabic RTL
     direction are declared in src/i18n.tsx, and `npm run build` typechecks
     before it bundles. The previous version of this entry said Next.js,
     which the codebase has never used. */
  "ethio-sunshine-tech-solution": {
    role:     "Founder — product direction, design system, front-end engineering, and deployment.",
    status:   "Live site with a public source repository.",
    problem:  "Sunshine Tech Solution sells web, software, infrastructure, IoT and security work, but the site has to do that selling to two audiences at once: Ethiopian clients, and international ones who will not read English-only copy. A single-language marketing page quietly disqualifies half the market before anyone reads the services list.",
    approach:  "Built the site in React, TypeScript, Vite and Tailwind, then treated language as a first-class feature rather than a later bolt-on: one message table keyed by locale, a language switcher in the header, and Arabic served right-to-left so the layout mirrors instead of just translating. Company details and projects live in typed data modules (`src/data/site.ts`, `src/data/projects.ts`), so a content edit is checked by the compiler, and `npm run build` typechecks before it bundles.",
    outcome:  "A live site that presents the same company to six audiences — English, አማርኛ, Afaan Oromoo, Français, Español and العربية — from one codebase, with typed content and documented setup so another engineer can pick it up without being walked through it.",
    highlights: [
      "Six locales behind one switcher, with Arabic rendered right-to-left",
      "React + TypeScript + Vite + Tailwind — typed end to end",
      "Typed content modules, so a bad copy edit fails the build, not the page",
      "Typecheck wired into the build; Vercel previews on every push",
      "Repo carries its own docs (quick start, contributing, technical reference), CI, and a code of conduct",
      "Five service lines — web, software, infrastructure, IoT, security — under one narrative",
    ],
    evidence: [
      { label: "Repository overview", href: "https://github.com/Tesfazion/Ethio-Sunshine-Tech-Solution" },
      { label: "Homepage screenshot", href: "https://github.com/Tesfazion/Ethio-Sunshine-Tech-Solution/blob/main/README-screenshot.png" },
      { label: "Services screenshot", href: "https://github.com/Tesfazion/Ethio-Sunshine-Tech-Solution/blob/main/README-services-screenshot.png" },
      { label: "Localization implementation", href: "https://github.com/Tesfazion/Ethio-Sunshine-Tech-Solution/blob/main/src/i18n.tsx" },
    ],
    scenario: {
      text: "Hana, a prospective visitor in Addis Ababa, switches the site to Amharic to review the services before deciding whether to contact the company.",
      disclosure: "Fictional example only—not a real customer, testimonial, or usage claim.",
    },
    learned:  "Translating the marketing copy was the easy half; the layout had to be built for mirroring from the start, and retrofitting RTL afterwards would have cost far more. Next time I would design one screen in Arabic before the other five.",
  },

  /* Abol Garden Café */
  "abol-garden-caf": {
    role:     "Full-stack developer — typed front end, menu data, and the reservation flow.",
    problem:  "A café needs its site to sell the atmosphere and produce reservations. A generic template makes it look like every other venue, and a reservation path that is hard to find on a phone loses the booking before it starts.",
    approach:  "Warm, on-brand visual design with the menu and gallery doing the selling, then a reservation path short enough to complete on a phone in one hand. TypeScript types the menu and booking data so the two can never drift out of sync.",
    outcome:  "A café site that carries the brand and turns visitors into reservations, with a booking flow short enough to complete on a phone.",
    highlights: [
      "Warm on-brand design and typography for the venue's character",
      "Typed menu data shared between display and booking",
      "Reservation path short enough to finish on a phone",
      "Gallery and menu built to do the selling without long copy",
    ],
    learned:  "Testing the booking path on a real phone first changed the whole layout. I would treat mobile as the design target for any local-business site.",
  },

  /* Shorts Batch — Hooks, Captions & B-Roll */
  "shorts-batch-hooks-captions-b-roll": {
    role:     "Editor — full edit from raw footage to platform-ready export.",
    problem:  "Clients sending footage in bulk get the same edit every time: a slow open, captions added at the end, and a cut that loses people in the first three seconds. Retention is treated as a delivery step rather than a decision made at the start.",
    approach:  "Choose the hook first, before any cut is locked, and let it decide the structure. Build captions as part of the edit rather than a later pass, cut b-roll in to reset attention at the right beats, and mix sound so the pacing is felt as well as seen.",
    outcome:  "A repeatable monthly process where every video in the batch opens on a deliberate hook and carries captions, b-roll, and sound design as standard — consistent output at volume, not one good cut and a queue behind it.",
    highlights: [
      "Hook selected before the cut is locked, driving the whole structure",
      "Animated captions built into the edit rather than added afterward",
      "B-roll cutaways placed at retention drop-off points",
      "Sound design and music sync matched to the visual pacing",
    ],
    learned:  "Picking the hook first is what makes batch work consistent — it turns a creative decision into a repeatable step instead of something re-litigated per video.",
  },

  /* Cinematic Travel Cut — Graded for Reels */
  "cinematic-travel-cut-graded-for-reels": {
    role:     "Editor — re-cut, grade, and vertical delivery.",
    problem:  "Long-form travel footage is shot horizontally for one platform and then squeezed into vertical, so the subject lands half out of frame, the grade is flat, and the ending just stops instead of looping.",
    approach:  "Re-frame rather than crop — find the subject in each shot and choose or reframe the composition for vertical. Build one consistent grade across the batch so the Reels read as one series, and end on a shot that can loop cleanly into the opening frame.",
    outcome:  "Horizontal footage re-cut into vertical Reels that hold the frame properly, share a single grade, and loop — built to earn the profile visit rather than a one-time view.",
    highlights: [
      "Vertical re-framing so the subject stays in frame on every shot",
      "One consistent grade applied across the batch",
      "Loop-friendly endings designed into the cut",
      "Platform-correct export settings for Reels",
    ],
    learned:  "Squeezing horizontal footage is what makes repurposed content look cheap. Re-framing shot by shot takes longer and is the entire difference.",
  },

  /* Launch Promo — 45s */
  "launch-promo-45s": {
    role:     "Editor and motion — cut, beat mapping, animated text, and grade.",
    problem:  "A 45-second product drop is the worst case for lazy editing. There is no room for a slow build, every second has to earn its place, and text that arrives after the beat it describes feels disconnected from the music.",
    approach:  "Map the track first and cut to the beat grid rather than placing clips and trimming later, so pacing is built in from the first pass. Animate the text on the beat rather than fading it in, and grade for contrast so the product reads in a fast cut.",
    outcome:  "A 45-second spot with energy that matches the track — cuts on the beat, text that lands with them, and a product that stays legible through a deliberately fast pace.",
    highlights: [
      "Beat-mapped first so cuts land on the track from the start",
      "On-beat animated text in After Effects",
      "High-contrast grade so the product reads through fast cuts",
      "Delivered inside a tight turnaround for a fixed launch date",
    ],
    learned:  "Cutting to a pre-mapped grid is faster than trimming to music afterwards, and it removes the drift that makes a music edit feel loose.",
  },

  /* Repeatable Short-Form Workflow */
  "repeatable-short-form-workflow": {
    role:     "Editor — template system, trend adaptation, and batch delivery.",
    problem:  "Chasing trends one at a time does not scale. Every video is rebuilt from zero, turnaround depends on how fast I type, and a trending format that works for three videos gets abandoned before it is learned properly.",
    approach:  "Build reusable template edits in CapCut where the structure, caption styling, and sound treatment are fixed, so adapting a new video to a trending hook is swapping content into a known-good shape. Standardise the export settings and delivery naming too, so batches ship without rework.",
    outcome:  "A template system where a trending hook becomes a finished edit in a fraction of the time — the format is learned once, then reused, which is what makes volume sustainable.",
    highlights: [
      "Reusable template edits with structure and caption styling pre-built",
      "Trending hooks adapted into a known-good shape rather than rebuilt",
      "Standardised export settings and delivery naming across batches",
      "Shorter turnaround per video as the format is reused",
    ],
    learned:  "Consistency came from the template, not from working faster. Fixing the shape first meant the creative energy went into the hook instead of re-deriving the structure each time.",
  },
};
