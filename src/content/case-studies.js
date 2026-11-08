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
  /* AI for FOREX Analyzing */
  "ai-for-forex-analyzing": {
    role:     "Sole developer — data pipeline, model, and visual layer.",
    problem:  "Raw OHLC currency data is unreadable on its own. Traders see tables of numbers, not direction, and a trend that was obvious in hindsight gets missed in the moment.",
    approach: "Fetch historical FX series, clean and resample it into consistent windows, fit scikit-learn models on the technical features, then render the predictions with matplotlib so the output is a chart a human reads rather than a matrix of coefficients.",
    outcome:  "Produces a repeatable pipeline rather than a one-off script: new currency pairs plug in without rewriting the cleaning or plotting stages, and the output is legible enough to inform a trade decision.",
    highlights: [
      "Fetched and resampled multi-pair FX history into consistent analysis windows",
      "Built the technical-indicator feature set the models train on",
      "Trained scikit-learn models and checked them against held-out data",
      "Plotted predictions and actuals side by side with matplotlib",
    ],
    learned:  "The hard part was never the model — it was cleaning the input so a held-out split was honest. I would version the feature set from the start so old runs stay reproducible.",
  },

  /* Amharic Offline-Chat AI */
  "amharic-offline-chat-ai": {
    role:     "Sole developer — language handling, model wiring, and the chat UI.",
    problem:  "Most assistants assume reliable connectivity and English input. In low-connectivity regions both assumptions fail, and questions people actually ask are rarely in English.",
    approach: "Build the Amharic handling and response pipeline in Python, run the model locally so no query ever leaves the device, and wire it to a lightweight JavaScript chat interface that works with no network at all.",
    outcome:  "A working assistant that answers natural-language Amharic questions with no connection and no data leaving the machine — the privacy property is architectural, not a setting.",
    highlights: [
      "Handled Amharic input end to end, including tokenisation and normalisation",
      "Ran inference fully locally so the app works with no connection",
      "Built the chat interface in JavaScript against a local backend",
      "Kept user data on-device — nothing is sent to a third-party API",
    ],
    learned:  "Amharic morphology forced a different tokenisation approach than Latin-script assumptions allow. I would build the evaluation set before the model, so quality is measured rather than guessed.",
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
    role:     "Sole developer — Next.js app, AI orchestration, Supabase schema, and deployment pipeline.",
    problem:  "Outbound sales is four disconnected jobs: finding prospects, writing a message each one will actually read, handling the replies, and giving each converted lead somewhere to look. Done by hand it is slow, and done with one automation script it still breaks at the reply step.",
    approach:  "Build it as one Next.js application over a Supabase backend, with an AI step at each point that needs judgement rather than rules — lead scoring, message personalisation, and reply handling. Each closed client gets a site deployed automatically, so the pipeline ends in something the prospect can open.",
    outcome:  "A single tool that runs the loop end to end: discover, reach out, converse, and deploy. The reply-handling step is the part that makes it usable, because that is where most automations stall.",
    highlights: [
      "Built the Next.js front end against a Supabase data layer",
      "AI-generated outreach personalised per lead instead of one template",
      "Automated reply handling so conversations continue without manual handoff",
      "Per-client site deployment triggered automatically on conversion",
    ],
    learned:  "Automating the boring middle of a funnel is worthless if the reply step is manual. I would instrument the funnel from the first commit so I could see where prospects actually drop.",
  },

  /* Network Management Suite */
  "network-management-suite": {
    role:     "Full-stack developer — device data collection, live dashboard, and alerting.",
    problem:  "Network problems get reported by users before anyone notices them. Ops teams are reading stale snapshots of a network that has already changed, and an outage becomes the detection mechanism.",
    approach:  "Collect device health and traffic continuously, push it to the dashboard as it arrives rather than on a refresh, and rank what surfaces by severity so an operator sees the device that matters instead of a wall of equal tiles.",
    outcome:  "Live device health, alerts, and traffic in one view, so problems surface on a dashboard rather than through a customer complaint.",
    highlights: [
      "Continuous device health and traffic collection",
      "Live updates without a manual page refresh",
      "Severity-ranked alerting so real problems are not buried",
      "Unified view across devices instead of per-device log checking",
    ],
    learned:  "A live dashboard that updates constantly is still slow if it re-renders the whole tree. I would measure render cost before adding the next panel.",
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

  /* SignalPulse AI */
  "signalpulse-ai": {
    role:     "Developer — signal detection, AI evaluation, and the subscriber dashboard.",
    problem:  "Trading signals arrive faster than a person can read them. A subscriber watching a price feed can miss the exact moment a setup triggered, and a signal buried in a chat message is a signal acted on too late.",
    approach:  "Detect candidate setups as the market moves, pass them through an AI step that judges context rather than firing on every threshold, and route the surviving signals straight to a live dashboard so the subscriber sees them at the moment they matter.",
    outcome:  "Signals reach the dashboard as they trigger rather than waiting for a refresh, and noise is filtered before the subscriber ever sees it.",
    highlights: [
      "Candidate setups detected as the market moves, not on a poll cycle",
      "AI context check that filters signals before delivery",
      "Live dashboard so signals appear the moment they trigger",
      "Alert routing that reaches subscribers without manual relay",
    ],
    learned:  "In signal work, the false positive is the expensive mistake, not the missed one. I would build the filter threshold against recorded market data before shipping any live alerts.",
  },

  /* Wolaita-Sodo Water Monitor */
  "wolaita-sodo-water-monitor": {
    role:     "Developer — GIS mapping layer, water-point data model, and the public monitoring view.",
    problem:  "Water-point coverage in the city is tracked in spreadsheets and in people's heads, so nobody can answer a simple question like which neighbourhoods lack a working source, and broken points stay broken because no one knows they exist.",
    approach:  "Map every water point on a GIS layer and attach coverage, quality readings, and maintenance status to each one, so the public view answers the coverage question directly and a broken point becomes visible to whoever can fix it.",
    outcome:  "A map that shows coverage, water quality, and maintenance status for the city — turning a spreadsheet nobody maintains into a live civic reference.",
    highlights: [
      "GIS map layer placing every water point in the city",
      "Coverage, quality, and maintenance status attached per point",
      "Public view that answers the coverage question without a spreadsheet",
      "Broken points surfaced instead of silently going unreported",
    ],
    learned:  "Field data collection is the hard part, not the mapping. I would design the mobile entry form around a weak connection before building the map view.",
  },

  /* DU EvaSUE Fellowship */
  "du-evasue-fellowship": {
    role:     "Frontend developer — responsive layout, schedules, programmes, and gallery.",
    problem:  "A fellowship community is scattered across chat groups, so schedules and programme updates get lost and people miss sessions. The site had to stay useful without a developer on hand for every edit.",
    approach:  "Put the schedule and programme details at the top where returning members look first, keep the markup lean so the site loads fast on a campus connection, and structure the content so a non-developer can update it without breaking the layout.",
    outcome:  "A live site the fellowship actually maintains — schedules, programmes, and a gallery in one place instead of scattered across chat threads.",
    highlights: [
      "Schedules and programmes surfaced first for returning members",
      "Lean markup and CSS so it loads fast on a campus connection",
      "Fully responsive across phone, tablet, and desktop",
      "Content structured for non-developer updates",
    ],
    learned:  "A site only stays current if the people who own the content can update it. Designing for that from the start saved more time than any effect I could have added.",
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
