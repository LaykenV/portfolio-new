from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "Layken-Varholdt-Software-Engineer-Resume.pdf"

NAVY = colors.HexColor("#102A43")
BLUE = colors.HexColor("#1565C0")
INK = colors.HexColor("#17202A")
MUTED = colors.HexColor("#52606D")
RULE = colors.HexColor("#BCCCDC")


def register_fonts() -> tuple[str, str, str]:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    regular = font_dir / "Arial.ttf"
    bold = font_dir / "Arial Bold.ttf"
    italic = font_dir / "Arial Italic.ttf"
    if regular.exists() and bold.exists() and italic.exists():
        pdfmetrics.registerFont(TTFont("ResumeSans", regular))
        pdfmetrics.registerFont(TTFont("ResumeSans-Bold", bold))
        pdfmetrics.registerFont(TTFont("ResumeSans-Italic", italic))
        pdfmetrics.registerFontFamily(
            "ResumeSans",
            normal="ResumeSans",
            bold="ResumeSans-Bold",
            italic="ResumeSans-Italic",
            boldItalic="ResumeSans-Bold",
        )
        return "ResumeSans", "ResumeSans-Bold", "ResumeSans-Italic"
    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"


FONT, FONT_BOLD, FONT_ITALIC = register_fonts()


def p(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text, style)


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    "Name",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=19,
    leading=21,
    alignment=TA_CENTER,
    textColor=NAVY,
    spaceAfter=1,
)
title_style = ParagraphStyle(
    "Title",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=10.5,
    leading=12,
    alignment=TA_CENTER,
    textColor=BLUE,
    spaceAfter=2,
)
contact_style = ParagraphStyle(
    "Contact",
    parent=styles["Normal"],
    fontName=FONT,
    fontSize=8.2,
    leading=10,
    alignment=TA_CENTER,
    textColor=MUTED,
    spaceAfter=5,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Normal"],
    fontName=FONT_BOLD,
    fontSize=10,
    leading=11.5,
    textColor=NAVY,
    spaceBefore=5,
    spaceAfter=2.5,
    borderWidth=0,
    borderPadding=0,
)
body_style = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName=FONT,
    fontSize=9,
    leading=11.2,
    textColor=INK,
    spaceAfter=2,
)
role_style = ParagraphStyle(
    "Role",
    parent=body_style,
    fontName=FONT_BOLD,
    fontSize=9.2,
    leading=11,
    spaceAfter=0,
)
subtle_style = ParagraphStyle(
    "Subtle",
    parent=body_style,
    fontName=FONT_ITALIC,
    textColor=MUTED,
    spaceAfter=1,
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=body_style,
    leftIndent=11,
    firstLineIndent=-7,
    bulletIndent=0,
    spaceAfter=1.8,
)
project_style = ParagraphStyle(
    "Project",
    parent=body_style,
    fontSize=8.85,
    leading=11,
    spaceAfter=2.5,
)
skills_style = ParagraphStyle(
    "Skills",
    parent=body_style,
    fontSize=8.75,
    leading=10.6,
    spaceAfter=0,
)


def section_heading(label: str):
    return KeepTogether(
        [
            Spacer(1, 1),
            p(label.upper(), section_style),
            Table(
                [[""]],
                colWidths=[7.5 * inch],
                rowHeights=[1],
                style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), RULE)]),
            ),
            Spacer(1, 2),
        ]
    )


def bullet(text: str) -> Paragraph:
    return p(f"&#8226;&nbsp; {text}", bullet_style)


def project(name: str, url: str, stack: str, description: str) -> Paragraph:
    return p(
        f'<b><link href="{url}" color="#1565C0">{name}</link></b> '
        f'<font color="#52606D">| {stack}</font><br/>{description}',
        project_style,
    )


def build_resume() -> None:
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.52 * inch,
        leftMargin=0.52 * inch,
        topMargin=0.42 * inch,
        bottomMargin=0.38 * inch,
        title="Layken Varholdt - Software Engineer Resume",
        author="Layken Varholdt",
        subject="Software engineering resume",
    )

    story = [
        p("LAYKEN VARHOLDT", name_style),
        p("SOFTWARE ENGINEER", title_style),
        p(
            'Lafayette, LA &nbsp;|&nbsp; (337) 858-2973 &nbsp;|&nbsp; '
            '<link href="mailto:laykenv@gmail.com" color="#1565C0">laykenv@gmail.com</link> &nbsp;|&nbsp; '
            '<link href="https://www.linkedin.com/in/layken-varholdt-a78687230/" color="#1565C0">LinkedIn</link> &nbsp;|&nbsp; '
            '<link href="https://github.com/laykenV" color="#1565C0">GitHub</link> &nbsp;|&nbsp; '
            '<link href="https://www.laykenvarholdt.com" color="#1565C0">Portfolio</link>',
            contact_style,
        ),
        section_heading("Summary"),
        p(
            "Software engineer with production experience building full-stack features for U.S. Department of Labor applications and shipping independent products with React, TypeScript, Java, Convex, and Next.js. Led a React 15-to-18 migration and built document workflows, multi-tenant SaaS, and applied AI systems. First-place winner of the Convex Modern Stack Hackathon ($10K).",
            body_style,
        ),
        section_heading("Professional experience"),
        Table(
            [[p("Software Engineer - Zyxware Technologies", role_style), p("Sep 2023 - Present", role_style)]],
            colWidths=[5.8 * inch, 1.7 * inch],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("ALIGN", (1, 0), (1, 0), "RIGHT"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            ),
        ),
        p("Remote | Client: U.S. Department of Labor", subtle_style),
        bullet(
            "Build and ship React/Redux frontend and Java backend features for large-scale federal web applications in an Agile team with Jenkins CI/CD."
        ),
        bullet(
            "Designed full-stack bulk-transfer and PDF-upload workflows across React, Java, and PHP/Drupal, reducing processing time for DOL users."
        ),
        bullet(
            "Led a critical React 15-to-18 migration, refactoring 50+ class components to functional components with hooks and improving runtime performance."
        ),
        section_heading("Selected projects"),
        project(
            "Atlas Outbound",
            "https://atlasoutbound.app",
            "TypeScript, Convex, TanStack, AI SDK, Twilio",
            "Built an end-to-end prospecting and calling platform in 14 days. Won 1st place in the Convex Modern Stack Hackathon ($10K) among hundreds of teams. Integrated real-time Twilio voice calls and structured agent workflows on Convex.",
        ),
        project(
            "OmniBid",
            "https://omnibid.vercel.app",
            "React, TanStack Start, Convex, Gemini, SAM.gov API",
            "Built a document workflow that converts long federal solicitations into compliance matrices and pulls source documents directly from SAM.gov. Replaced a multi-service parser with direct multimodal extraction, cutting per-document cost by roughly 10x.",
        ),
        project(
            "Acadiana Web Design",
            "https://acadianawebdesign.com",
            "Next.js, TypeScript, Convex, Stripe, Twilio",
            "Built a multi-tenant SaaS platform with client portals, subscriptions, lead management, and clickwrap agreements. Drove Twilio A2P 10DLC approval through repeated compliance rejections.",
        ),
        project(
            "Mesh Mind",
            "https://meshmind.chat",
            "TypeScript, Convex, AI SDK",
            "Built a multi-model research interface with inspectable critic-and-synthesizer stages, scheduled jobs, retries, and structured handoffs between independent services.",
        ),
        section_heading("Technical skills"),
        p(
            "<b>Languages:</b> TypeScript, JavaScript, Java, SQL &nbsp;|&nbsp; "
            "<b>Frontend:</b> React, Next.js, TanStack, Redux, Tailwind CSS<br/>"
            "<b>Backend and data:</b> Convex, Java, PHP/Drupal, PostgreSQL, MySQL, REST APIs &nbsp;|&nbsp; "
            "<b>Tools:</b> Git, Jenkins, Vercel, Stripe, Twilio<br/>"
            "<b>Applied AI:</b> Gemini, Claude API, AI SDK, RAG, structured extraction, tool calling, model orchestration",
            skills_style,
        ),
        section_heading("Military service"),
        p(
            "<b>U.S. Air Force - Munitions Systems (2W0X1)</b> | 4 years active duty. Worked in high-stakes environments where accuracy, accountability, and clear handoffs mattered.",
            body_style,
        ),
    ]

    doc.build(story)


if __name__ == "__main__":
    build_resume()
    print(OUTPUT)
