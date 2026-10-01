/* ============================================================
   PORTFOLIO CONFIGURATION — single source of truth
   All content pulled from CV + GitHub @Tesfazion
   ============================================================ */

export const site = {
  url:         "https://tesfatseyon.dev",
  themeColor:  "#0a0a0b",
  seo: {
    title: "Tesfatseyon Merkinh — Full-Stack Developer & Video Editor",
    description:
      "Tesfatseyon Merkinh — full-stack web developer and short-form video editor based in Ethiopia. I build fast, modern websites and edit scroll-stopping short-form video.",
  },
};

// ── Profile ────────────────────────────────────────────────
export const profile = {
  name:         "Tesfatseyon Merkinh",
  firstName:    "Tesfatseyon",
  brand:        "Tesfatseyon",
  initials:     "TM",
  photo:        "/me.jpg",
  role:         "Full-Stack Developer & Video Editor",
  location:     "Wolaita-Sodo, South Ethiopia",
  email:        "tesfatseyon16@gmail.com",
  phone:        "+251983708869",
  availability: "Available for freelance & full-time",
  github:       "https://github.com/Tesfazion",
  linkedin:     "https://www.linkedin.com/in/tesfatseyon-merkinh-becho-a38626402",
  education:    "BSc Computer Science · Dilla University (graduating 2027)",
};

// ── Social links ───────────────────────────────────────────
export const socials = {
  telegram:  "https://t.me/Zizo1616",
  linkedin:  "https://www.linkedin.com/in/tesfatseyon-merkinh-becho-a38626402",
  github:    "https://github.com/Tesfazion",
  instagram: "https://www.instagram.com/nani161669/",
  x:         "https://x.com/tesfatseyo35302",
};

export const SOCIAL_KEYS = ["telegram", "linkedin", "github", "instagram", "x"];

// ── Nav ────────────────────────────────────────────────────
// Section links scroll within a portfolio page.
// Route links navigate to standalone pages (landing + blog).
export const navLinks = [
  { label: "About",    id: "about"    },
  { label: "Skills",   id: "skills"   },
  { label: "Services", id: "services" },
  { label: "Work",     id: "work"     },
  { label: "Résumé",   id: "resume"   },
  { label: "Contact",  id: "contact"  },
];

export const routeLinks = [
  { label: "Home", to: "/" },
  { label: "Blog", to: "/blog" },
];

// ── Modes ──────────────────────────────────────────────────
export const modes = {

  /* ──────────────────────────────────────────────────────────
     WEB DEVELOPER MODE
  ────────────────────────────────────────────────────────── */
  web: {
    key:        "web",
    label:      "Web Developer",
    shortLabel: "Web Development",
    route:      "/web",
    icon:       "code",
    accent:     "255, 77, 0",
    resumeUrl:  "/CV-Tesfatseyon-Web-Developer.pdf",
    resumeName: "CV-Tesfatseyon-Web-Developer.pdf",
    seo: {
      title: "Web Developer — Tesfatseyon Merkinh",
      description:
        "Full-stack web developer building fast, modern websites and AI-powered apps with React, Next.js, Python, and Tailwind CSS. Available for freelance and full-time work.",
    },
    heroTitle: {
      line1: "Websites engineered",
      emph:  "to convert.",
    },
    chips:      ["React & Next.js", "Full-Stack", "UI/UX Design", "SEO & Speed"],
    tagline:    "I build modern, fast, full-stack web apps — from pixel-perfect UI to scalable backend logic. Every screen is built to load quickly and move visitors toward one clear action.",
    roles:      ["Full-Stack Developer", "Frontend Developer", "UI/UX Designer"],
    shortBio:   "Full-stack developer turning ideas into clean, high-performance products.",
    about: [
      "I'm a freelance full-stack web developer and Video Editor with hands-on experience building responsive websites, AI-powered applications, and scalable project structures. Skilled in React, Next.js, Python, and modern UI/UX design.",
      "I focus on clean modular code and professional branding — making sure every project is fast, maintainable, and built to grow. I work in the open: every project below links to real code on GitHub.",
    ],
    highlights: [
      "React / Next.js / Vite",
      "Full-stack & REST APIs",
      "UI/UX & Figma design",
      "Python & AI/ML projects",
      "Git & CI/CD deployment",
      "Database design (SQL/NoSQL)",
      "SEO & performance tuning",
      "Responsive mobile-first",
    ],
    stats: [
      { value: 1,  suffix: "+", label: "Years Building"  },
      { value: 11, suffix: "+", label: "Projects Shipped" },
      { value: 5,  suffix: "+", label: "Happy Clients"    },
      { value: 7,  suffix: "",  label: "Core Technologies" },
    ],
    techStack: [
      { name: "React",       color: "#61dafb",  slug: "react" },
      { name: "Next.js",      color: "#94a3b8", slug: "nextdotjs" },
      { name: "TypeScript",   color: "#3178c6", slug: "typescript" },
      { name: "JavaScript",   color: "#eab308", slug: "javascript" },
      { name: "Python",       color: "#3776ab", slug: "python" },
      { name: "Tailwind",     color: "#38bdf8", slug: "tailwindcss" },
      { name: "Node.js",      color: "#8cc84b", slug: "nodedotjs" },
      { name: "Prisma",       color: "#5a67d8", slug: "prisma" },
      { name: "Supabase",     color: "#3ecf8e", slug: "supabase" },
      { name: "Figma",        color: "#f24e1e", slug: "figma" },
      { name: "Git",          color: "#f05032", slug: "git" },
      { name: "Vite",         color: "#bd34fe", slug: "vite" },
    ],
    skills: [
      {
        title: "Frontend",
        num:   "01",
        items: [
          "React, Next.js, Vite",
          "HTML5, CSS3, Tailwind",
          "JavaScript, TypeScript",
        ],
      },
      {
        title: "Backend & Data",
        num:   "02",
        items: [
          "Node.js, REST APIs",
          "Python, FastAPI",
          "SQL & NoSQL, Prisma, Supabase",
        ],
      },
      {
        title: "Design & Delivery",
        num:   "03",
        items: [
          "UI/UX design in Figma",
          "SEO & performance",
          "Git, CI/CD, Vercel",
        ],
      },
    ],
    services: [
      {
        icon:  "code",
        title: "Website Design & Development",
        desc:  "Business sites, portfolios, and landing pages designed around a clear goal — fast, responsive, and perfectly on-brand.",
      },
      {
        icon:  "monitor",
        title: "Full-Stack Web Apps",
        desc:  "End-to-end applications with a React/Next.js frontend and Node or Python backend — built so the next feature is easy to ship.",
      },
      {
        icon:  "palette",
        title: "UI/UX & Site Redesign",
        desc:  "A redesign that keeps what works and fixes what doesn't — clearer layout, better hierarchy, higher conversion.",
      },
      {
        icon:  "zap",
        title: "SEO & Performance",
        desc:  "Structure, metadata, and load speed tuned so your site ranks higher and opens in a blink — not a spinner.",
      },
    ],
    projectCategories: ["All", "AI & SaaS", "Full-Stack", "Websites"],
    workNote: "A curated selection of work I'm proud of. Every project below links to real code on GitHub — no mockups, no stock screenshots.",
    projects: [
      {
        category: "AI & SaaS",
        title:    "AI for FOREX Analyzing",
        desc:     "Turns raw market data into readable trend signals — a Python pipeline that fetches, cleans, models, and visualises FX movement for trading decisions.",
        tags:     ["Python", "scikit-learn", "pandas", "matplotlib"],
        gradient: ["#0ea5e9", "#6366f1"],
        accent:   "#0ea5e9",
        link:     null,
        github:   null,
        study:    "ai-for-forex-analyzing",
      },
      {
        category: "AI & SaaS",
        title:    "Amharic Offline-Chat AI",
        desc:     "A privacy-first Amharic assistant that understands natural-language questions and works fully offline — built for low-connectivity regions.",
        tags:     ["Python", "JavaScript", "NLP", "Amharic"],
        gradient: ["#8b5cf6", "#ec4899"],
        accent:   "#8b5cf6",
        link:     null,
        github:   null,
        study:    "amharic-offline-chat-ai",
      },
      {
        category: "Websites",
        title:    "Hotel Design Website",
        desc:     "A marketing-ready hotel site with a booking-first layout — modern UI, compact structure, and a premium feel on every device.",
        tags:     ["Responsive", "UI Design", "Frontend"],
        gradient: ["#f59e0b", "#ef4444"],
        accent:   "#f59e0b",
        link:     null,
        github:   null,
        study:    "hotel-design-website",
      },
      {
        category: "AI & SaaS",
        title:    "LeadForge AI",
        desc:     "Automates the whole outbound loop — discovers leads, sends personalised outreach, chats with prospects, and auto-deploys a website per client.",
        tags:     ["Next.js", "AI", "Automation", "Supabase"],
        gradient: ["#6366f1", "#818cf8"],
        accent:   "#6366f1",
        link:     "https://github.com/Tesfazion/LeadForge-AI",
        github:   "https://github.com/Tesfazion/LeadForge-AI",
        study:    "leadforge-ai",
      },
      {
        category: "Full-Stack",
        title:    "Network Management Suite",
        desc:     "Live dashboards that surface device health, alerts, and traffic in real time — so ops teams spot problems before users feel them.",
        tags:     ["JavaScript", "Dashboard", "Real-time"],
        gradient: ["#0ea5e9", "#6366f1"],
        accent:   "#0ea5e9",
        link:     null,
        github:   "https://github.com/Tesfazion/network-management-suite",
        study:    "network-management-suite",
      },
      {
        category: "Full-Stack",
        title:    "Hospital Management System",
        desc:     "Patients, staff, appointments, and medical records managed from one clean dashboard — built to cut admin load at every step.",
        tags:     ["JavaScript", "Full-Stack", "Database"],
        gradient: ["#06b6d4", "#3b82f6"],
        accent:   "#06b6d4",
        link:     null,
        github:   "https://github.com/Tesfazion/Hospital-Management-system",
        study:    "hospital-management-system",
      },
      {
        category: "Websites",
        title:    "Ethio-Sunshine Tech Solution",
        desc:     "A corporate site that positions the company for growth — modern, typed with TypeScript and Next.js, deployed on Vercel.",
        tags:     ["TypeScript", "Next.js", "Vercel"],
        gradient: ["#f59e0b", "#ef4444"],
        accent:   "#f59e0b",
        link:     "https://sunshinetechsolution.vercel.app",
        github:   "https://github.com/Tesfazion/Ethio-Sunshine-Tech-Solution",
        study:    "ethio-sunshine-tech-solution",
      },
      {
        category: "Websites",
        title:    "Abol Garden Café",
        desc:     "A café site built to earn reservations — warm on-brand design with menu, gallery, and a simple booking path.",
        tags:     ["TypeScript", "Full-Stack", "UI Design"],
        gradient: ["#10b981", "#84cc16"],
        accent:   "#10b981",
        link:     null,
        github:   "https://github.com/Tesfazion/Abol-garden-cafe",
        study:    "abol-garden-caf",
      },
      {
        category: "AI & SaaS",
        title:    "SignalPulse AI",
        desc:     "Real-time AI trading alerts routed straight to a dashboard — signal subscribers never miss a market move.",
        tags:     ["AI", "Trading", "Automation"],
        gradient: ["#8b5cf6", "#ec4899"],
        accent:   "#8b5cf6",
        link:     null,
        github:   "https://github.com/Tesfazion/SignalPulse-AI",
        study:    "signalpulse-ai",
      },
      {
        category: "Full-Stack",
        title:    "Wolaita-Sodo Water Monitor",
        desc:     "GIS-based civic monitoring for the city — water-point coverage, quality, and maintenance status mapped and kept current.",
        tags:     ["JavaScript", "GIS", "Civic Tech"],
        gradient: ["#06b6d4", "#0ea5e9"],
        accent:   "#06b6d4",
        link:     null,
        github:   "https://github.com/Tesfazion/Wolaita-Sodo-Water-Point-Monitoring-System",
        study:    "wolaita-sodo-water-monitor",
      },
      {
        category: "Websites",
        title:    "DU EvaSUE Fellowship",
        desc:     "A fellowship site that keeps the community together — schedules, programmes, and a photo gallery, built to be updated often.",
        tags:     ["CSS", "HTML", "Responsive"],
        gradient: ["#f43f5e", "#fb923c"],
        accent:   "#f43f5e",
        link:     "https://tesfazion.github.io/Du-EvaSUE-Fellowship",
        github:   "https://github.com/Tesfazion/Du-EvaSUE-Fellowship",
        study:    "du-evasue-fellowship",
      },
    ],
    formTopics: [
      "Website design",
      "Full-stack web app",
      "Site redesign",
      "UI/UX help",
      "SEO & performance",
      "Something else",
    ],
  },

  /* ──────────────────────────────────────────────────────────
     VIDEO EDITOR MODE
  ────────────────────────────────────────────────────────── */
  video: {
    key:        "video",
    label:      "Video Editor",
    shortLabel: "Video Editing",
    route:      "/video",
    icon:       "video",
    accent:     "0, 211, 167",
    resumeUrl:  "/CV_Tesfatseyon_VideoEditor.pdf",
    resumeName: "CV_Tesfatseyon_VideoEditor.pdf",
    seo: {
      title: "Video Editor — Tesfatseyon Merkinh",
      description:
        "Short-form video editor for TikTok, Instagram Reels, and YouTube Shorts. Hook writing, tight pacing, captions, sound design, and colour grading in CapCut and DaVinci Resolve.",
    },
    heroTitle: {
      line1: "Videos edited",
      emph:  "to retain.",
    },
    chips:      ["Short-Form & Reels", "Hook Writing", "Color Grading", "CapCut & DaVinci"],
    tagline:    "I edit short-form videos that hook viewers in the first three seconds and keep them watching to the very end — cut, captioned, graded, and platform-ready.",
    roles:      [
      "Short-Form Video Editor",
      "YouTube Shorts Editor",
      "Reels & TikTok Editor",
      "Color Grading & Sound Design",
    ],
    shortBio:   "Video editor focused on high-retention short-form content for TikTok, Reels, and YouTube Shorts.",
    about: [
      "I edit short-form, high-retention content for TikTok, Instagram Reels, and YouTube Shorts, with an eye for pacing, hooks, and story structure that keep viewers watching to the end.",
      "I work end-to-end in CapCut and DaVinci Resolve — from raw footage through colour, sound, captions, and export-ready delivery. My background in software development means fast tool adoption, organised project files, and a methodical approach to testing what actually improves watch time.",
    ],
    highlights: [
      "Short-form editing (TikTok / Reels / Shorts)",
      "Hook writing & retention pacing",
      "CapCut & DaVinci Resolve",
      "Color correction & grading",
      "Sound design, music sync & captions",
      "Repurposing long-form into shorts",
      "Platform-algorithm awareness",
      "Fast turnaround & communication",
    ],
    stats: [
      { value: 1,  suffix: "+", label: "Year Editing"    },
      { value: 20, suffix: "+", label: "Videos Edited"   },
      { value: 5,  suffix: "+", label: "Happy Creators"  },
      { value: 6,  suffix: "",  label: "Core Tools"      },
    ],
    techStack: [
      { name: "CapCut",          color: "#94a3b8", slug: "capcut" },
      { name: "DaVinci Resolve", color: "#f97316", slug: "davinciresolve" },
      { name: "Premiere Pro",    color: "#818cf8", slug: "adobepremierepro" },
      { name: "After Effects",   color: "#a78bfa", slug: "adobeaftereffects" },
      { name: "Photoshop",       color: "#31a8ff", slug: "adobephotoshop" },
      { name: "Audition",        color: "#2dd4bf", slug: "adobeaudition" },
    ],
    skills: [
      {
        title: "Editing",
        num:   "01",
        items: [
          "CapCut, DaVinci Resolve, Premiere Pro",
          "Retention-first cutting & pacing",
          "Repurposing long-form into shorts",
        ],
      },
      {
        title: "Motion & Captions",
        num:   "02",
        items: [
          "After Effects motion graphics",
          "Animated captions, on-screen text",
          "Transitions, B-roll, hook writing",
        ],
      },
      {
        title: "Sound & Color",
        num:   "03",
        items: [
          "Color correction & grading",
          "Sound design & music sync",
          "Audio cleanup, platform-ready export",
        ],
      },
    ],
    services: [
      {
        icon:  "video",
        title: "Short-Form Video Editing",
        desc:  "TikTok, Reels, and YouTube Shorts cut for retention — strong hooks, tight pacing, scroll-stopping visuals.",
      },
      {
        icon:  "zap",
        title: "Hook Writing & Structure",
        desc:  "Every edit is built around a hook that grabs in three seconds and a structure that earns the watch-through.",
      },
      {
        icon:  "sparkle",
        title: "Captions & Motion Elements",
        desc:  "Animated captions, on-screen text, and motion graphics that boost accessibility and viewer engagement.",
      },
      {
        icon:  "palette",
        title: "Color Grading & Sound Design",
        desc:  "Cinematic colour and clean, balanced audio — from rough cut to polished, platform-ready export.",
      },
      {
        icon:  "briefcase",
        title: "Hire Video Editors & Scale Output",
        desc:  "Need volume? I can bring in and manage additional editors for you — briefs, style guides, QC, and delivery all handled so every cut stays on-brand.",
      },
    ],
    projectCategories: ["All", "Shorts", "Reels", "Grading"],
    workNote: "The kinds of edits I deliver day to day — demonstrated in the workflow, not faked with mock stats. Recent client work and rates are available on request: message me on Telegram.",
    projects: [
      {
        category: "Shorts",
        title:    "Shorts Batch — Hooks, Captions & B-Roll",
        desc:     "A repeatable monthly batch: hook-first openers, animated captions, b-roll cutaways, and sound design that earn the watch-through.",
        tags:     ["Retention Editing", "Captions", "Sound Design"],
        gradient: ["#f43f5e", "#fb923c"],
        accent:   "#f43f5e",
        link:     null,
        github:   null,
        study:    "shorts-batch-hooks-captions-b-roll",
      },
      {
        category: "Reels",
        title:    "Cinematic Travel Cut — Graded for Reels",
        desc:     "Long travel footage re-cut and colour graded into vertical Reels — built to loop, and hold, and send people to the profile.",
        tags:     ["Color Grading", "Repurposing", "Reels"],
        gradient: ["#06b6d4", "#3b82f6"],
        accent:   "#06b6d4",
        link:     null,
        github:   null,
        study:    "cinematic-travel-cut-graded-for-reels",
      },
      {
        category: "Grading",
        title:    "Launch Promo — 45s",
        desc:     "A 45-second product-drop spot cut to the beat — animated text, punchy pacing, and music-synced edits for maximum energy.",
        tags:     ["After Effects", "Music Sync", "Fast Turnaround"],
        gradient: ["#8b5cf6", "#ec4899"],
        accent:   "#8b5cf6",
        link:     null,
        github:   null,
        study:    "launch-promo-45s",
      },
      {
        category: "Shorts",
        title:    "Repeatable Short-Form Workflow",
        desc:     "A template system that turns trending hooks into consistent, high-turnaround edits — batch-friendly and built for volume.",
        tags:     ["CapCut", "Trend Hooks", "Batch Editing"],
        gradient: ["#f59e0b", "#ef4444"],
        accent:   "#f59e0b",
        link:     null,
        github:   null,
        study:    "repeatable-short-form-workflow",
      },
    ],
    formTopics: [
      "Short-form video editing",
      "Reels / TikTok / YouTube Shorts",
      "Hook writing & structure",
      "Color grading & sound",
      "Batch editing package",
      "Hire video editors / scale output",
      "Something else",
    ],
  },
};

export const modesList = [modes.web, modes.video];