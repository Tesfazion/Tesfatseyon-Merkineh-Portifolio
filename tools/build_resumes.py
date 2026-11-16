"""Build the public resume PDFs from the content below.

This produces vector PDFs with selectable, searchable text rather than
rasterised images. Both CVs use one CONTACT block so their public details
stay in sync.

Usage:  python tools/build_resumes.py
"""
import os

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public")

INK = HexColor("#15181f")
INK_2 = HexColor("#4a5262")
INK_3 = HexColor("#7b8494")
HAIRLINE = HexColor("#d8dce6")

# Each CV is tinted with the accent its portfolio mode uses, so the document a
# visitor downloads matches the page they downloaded it from.
WEB_ACCENT = HexColor("#4f46e5")
VIDEO_ACCENT = HexColor("#00d3a7")

REG, BOLD, ITAL = "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"

# ── Shared content ──────────────────────────────────────────────────────
# Single source of truth for contact details. A wrong entry here is a dead
# email on a public document, so it is defined exactly once and used by both.
CONTACT = [
    "Wolaita-Sodo, South Ethiopia Region, Ethiopia",
    "+251 983 708 869   +251 950 030 794",
    "tesfatseyon16@gmail.com",
    "linkedin.com/in/tesfatseyon-merkinh-becho-a38626402",
]

WEB_EXPERIENCE = [
    (
        "Sunshine Tech Solution",
        "Founder & software engineer",
        "Live site",
        "Built and deployed a React, TypeScript, Vite, and Tailwind company site with "
        "six locales, including an Arabic right-to-left layout.",
    ),
    (
        "VisionSpeak AI",
        "Full-stack product engineer",
        "Public demo",
        "Built a Next.js and TypeScript speaking-practice app with browser-side "
        "MediaPipe analysis and PostgreSQL-backed reports. Scores are documented as "
        "coaching heuristics, not validated assessments.",
    ),
    (
        "NetVisor Suite",
        "Full-stack developer",
        "Public source",
        "Implemented network inventory and operations workflows with Node.js, Express, "
        "PostgreSQL, and WebSockets. The repository includes API and security tests; "
        "the app is self-hosted.",
    ),
    (
        "LeadForge AI",
        "Product developer",
        "In development",
        "Built a lead-management and website-delivery workspace with Next.js, Node.js, "
        "and Supabase. Provider-dependent inbox sync, team access, and billing are not "
        "active.",
    ),
]

WEB_SKILLS = [
    "Frontend: React, Next.js, TypeScript, responsive UI",
    "Backend: Node.js, Express, API and server workflows",
    "Data: PostgreSQL, Prisma, Supabase",
    "Quality: automated tests, GitHub Actions, CI, technical documentation",
]

WEB_PROFILE = (
    "Software engineer and founder focused on full-stack product delivery. Hands-on "
    "work spans product interfaces, API and data workflows, testing, and deployment. "
    "Selected work includes a multilingual live site, a browser-based speaking coach, "
    "and network operations software, with project status and limitations documented."
)

VIDEO_ROLE = "Video Editor | Short-Form & High-Retention Content"

VIDEO_PROFILE = (
    "Video editor focused on short-form, high-retention content for TikTok, Instagram "
    "Reels, and YouTube Shorts. Experienced cutting for a range of clients and niches, "
    "with an eye for pacing, hooks, and story structure that keep viewers watching to "
    "the end. Comfortable working end-to-end in CapCut and DaVinci Resolve \u2014 from raw "
    "footage to color, sound, captions, and export-ready delivery across formats. Brings "
    "a technical background in software development, which translates into fast tool "
    "adoption, organized project files, and a methodical approach to testing what "
    "actually improves watch time."
)

VIDEO_SKILLS = [
    "Short-form editing (TikTok / Reels / Shorts)",
    "Hook writing & retention-driven pacing",
    "CapCut & DaVinci Resolve",
    "Color correction & grading",
    "Sound design, music sync & captions",
    "Repurposing long-form into short clips",
    "Trend & platform-algorithm awareness",
    "Client communication & fast turnaround",
]

# Experience entries carry a list of bullets rather than a single paragraph,
# which is how the source .docx is written.
VIDEO_EXPERIENCE = [
    (
        "Freelance Video Editor \u2014 Short-Form Content",
        "Remote / Independent",
        "2024 \u2013 Present",
        [
            "Edit short-form videos for clients across a mix of niches, delivering "
            "content optimized for TikTok, Instagram Reels, and YouTube Shorts.",
            "Structure edits around strong opening hooks, tight pacing, and clean cuts "
            "to maximize watch-through and retention.",
            "Handle the full workflow in CapCut and DaVinci Resolve: rough cuts, color "
            "grading, audio sync, sound design, and platform-ready exports.",
            "Add captions, on-screen text, and simple motion elements to boost "
            "accessibility and scroll-stopping impact.",
            "Manage multiple client projects and turnaround deadlines, keeping "
            "organized, versioned project files.",
        ],
    ),
    (
        "Content Creator \u2014 Personal Short-Form Projects",
        "Independent",
        "2023 \u2013 Present",
        [
            "Plan, shoot, and edit personal short-form content, using it as a testing "
            "ground for hooks, pacing, and trend formats.",
            "Iterate on edits based on audience retention and engagement patterns to "
            "sharpen editing decisions over time.",
        ],
    ),
    (
        "Frontend & Web Developer",
        "Freelance / Independent Projects",
        "2023 \u2013 2024",
        [
            "Built and deployed a responsive hotel design site with a focus on clean UI "
            "and cross-device usability.",
            "Background in structured, detail-oriented technical work \u2014 a skillset "
            "that carries directly into organized editing workflows and fast adoption "
            "of new creative tools.",
        ],
    ),
]

VIDEO_HOBBIES = [
    "Short-form video trends",
    "Travelling",
    "Classic films",
    "Learning new languages",
]


# ── Styles ───────────────────────────────────────────────────
def styles(accent):
    return {
        "name": ParagraphStyle(
            "name", fontName=BOLD, fontSize=21, leading=25,
            textColor=INK, alignment=TA_LEFT,
        ),
        "role": ParagraphStyle(
            "role", fontName=REG, fontSize=10.5, leading=14,
            textColor=accent, spaceAfter=1,
        ),
        "section": ParagraphStyle(
            "section", fontName=BOLD, fontSize=10, leading=13,
            textColor=accent, spaceBefore=11, spaceAfter=5,
            ),
        "job": ParagraphStyle(
            "job", fontName=BOLD, fontSize=10.5, leading=13.5, textColor=INK,
        ),
        "meta": ParagraphStyle(
            "meta", fontName=ITAL, fontSize=8.6, leading=11,
            textColor=INK_3, spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "body", fontName=REG, fontSize=9.1, leading=12.6, textColor=INK_2,
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName=REG, fontSize=9.1, leading=12.6,
            textColor=INK_2, leftIndent=9, bulletIndent=1,
        ),
        "small": ParagraphStyle(
            "small", fontName=REG, fontSize=8.4, leading=11, textColor=INK_3,
        ),
    }


S = styles(WEB_ACCENT)


def header(role, accent):
    rows = [
        [Paragraph("Tesfatseyon Merkinh", S["name"])],
        [Paragraph(role, S["role"])],
        [Paragraph(" &nbsp;&bull;&nbsp; ".join(
            f"<link href='mailto:{v}' color='#4a5262'><u>{v}</u></link>" if "@" in v
            else f"<link href='https://{v}' color='#4a5262'><u>{v}</u></link>" if "/" in v
            else v
            for v in CONTACT
        ), S["small"])],
    ]
    t = Table(rows, colWidths=[176 * mm])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ("LINEBELOW", (0, 2), (0, 2), 0.7, HAIRLINE),
    ]))
    return t


def section(title):
    return Paragraph(title.upper(), S["section"])


def entry(title, role, dates, body):
    """One experience entry. `body` is a paragraph, or a list of bullets."""
    meta = " &nbsp;&bull;&nbsp; ".join(value for value in (role, dates) if value)
    parts = [Paragraph(escape(title), S["job"])]
    if meta:
        parts.append(Paragraph(meta, S["meta"]))
    if isinstance(body, str):
        parts.append(Paragraph(escape(body), S["body"]))
    else:
        parts += bullets(body)
    parts.append(Spacer(1, 6))
    return KeepTogether(parts)


def bullets(items):
    return [Paragraph(escape(i), S["bullet"], bulletText="\u2022") for i in items]


def escape(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def build(path, role, profile, skills, experience, hobbies=None, accent=WEB_ACCENT):
    global S
    S = styles(accent)
    doc = BaseDocTemplate(
        path, pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm,
        topMargin=14 * mm, bottomMargin=13 * mm,
        title=f"Tesfatseyon Merkinh - {role} Resume",
        author="Tesfatseyon Merkinh",
        subject=f"{role} resume",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f",
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="p", frames=[frame])])

    story = [header(role, accent), Spacer(1, 2)]

    story += [section("Profile"), Paragraph(escape(profile), S["body"]), Spacer(1, 2)]
    story += [section("Selected Work")]
    for e in experience:
        story.append(entry(*e))
    story += [section("Key Skills")] + bullets(skills) + [Spacer(1, 2)]
    if hobbies:
        story += [section("Hobbies & Interests")] + bullets(hobbies)

    doc.build(story)
    return path


if __name__ == "__main__":
    a = build(
        os.path.join(OUT, "CV-Tesfatseyon-Web-Developer.pdf"),
        "Software Engineer | Full-Stack Web",
        WEB_PROFILE, WEB_SKILLS, WEB_EXPERIENCE,
        accent=WEB_ACCENT,
    )
    print(f"wrote {os.path.relpath(a, ROOT)}  {os.path.getsize(a)} bytes")

    b = build(
        os.path.join(OUT, "CV_Tesfatseyon_VideoEditor.pdf"),
        VIDEO_ROLE,
        VIDEO_PROFILE, VIDEO_SKILLS, VIDEO_EXPERIENCE, VIDEO_HOBBIES,
        accent=VIDEO_ACCENT,
    )
    print(f"wrote {os.path.relpath(b, ROOT)}  {os.path.getsize(b)} bytes")
