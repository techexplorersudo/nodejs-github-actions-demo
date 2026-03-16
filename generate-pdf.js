#!/usr/bin/env node
/**
 * Generates GH200_STUDY_PLAN.pdf from GH200_STUDY_PLAN.md
 * Run with: node generate-pdf.js  (or: npm run generate:pdf)
 *
 * The output PDF uses a two-column layout where every h2/h3 heading
 * is rendered as a visible "side heading" in the left margin, giving
 * readers a clear visual anchor for each section.
 */

const { mdToPdf } = require('md-to-pdf');
const path = require('path');

const INPUT  = path.join(__dirname, 'GH200_STUDY_PLAN.md');
const OUTPUT = path.join(__dirname, 'GH200_STUDY_PLAN.pdf');

// CSS that produces clear "side headings":
//
//  Layout principle
//  ────────────────
//  @page margins are kept normal (no wide left margin).
//  Instead, body gets padding-left: 55mm, which creates a virtual
//  "left gutter" INSIDE the content box.
//
//  h2 and h3 are floated left with margin-left: -55mm so they sit
//  in that 55 mm gutter.  Because the float is inside the body's
//  content box, Puppeteer never clips it.
//
//  Subsequent content (p, pre, table …) naturally flows into the
//  remaining right-hand column because the body padding already
//  starts them past the float's right edge.
//
//  • h1  – full-width dark title banner (spans both columns)
//  • h2  – blue side-heading label (left gutter, float: left)
//  • h3  – green sub-label         (left gutter, float: left)
//  • h4  – purple inline heading   (right content column)
const CSS = `
/* ── Page setup ─────────────────────────────────────────── */
@page {
  size: A4;
  margin: 15mm 18mm 15mm 15mm;
}

body {
  font-family: "Segoe UI", Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.6;
  color: #1a1a2e;
  /*
   * Create the sidebar gutter INSIDE the content box so floated
   * side-headings are never clipped by the @page margin boundary.
   */
  padding-left: 55mm;
}

/* ── h1 — full-width section banner ────────────────────── */
h1 {
  font-size: 18pt;
  font-weight: 700;
  color: #fff;
  background: #0d1117;
  /* Extend left to the page's left content edge, past body padding */
  margin: 0 0 16px -55mm;
  padding: 10px 16px 10px 12mm;
  border-left: 6px solid #2ea44f;
  /* Span full content width (body width + padding we removed) */
  width: calc(100% + 55mm);
  box-sizing: border-box;
  /* Clear any previous sidebar floats */
  clear: both;
  page-break-before: always;
}
h1:first-of-type {
  page-break-before: avoid;
}

/* ── h2 — blue side heading ─────────────────────────────── */
h2 {
  float: left;
  clear: left;
  /* Pull back into the 55 mm gutter */
  margin-left: -55mm;
  margin-top: 20px;
  margin-bottom: 0;
  margin-right: 0;
  /* Occupy 52 mm of the 55 mm gutter (3 mm gap to content column) */
  width: 52mm;
  box-sizing: border-box;
  padding: 6px 8px;
  font-size: 9.5pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
  word-break: break-word;
  color: #1e40af;
  background: #dbeafe;
  border-left: 5px solid #1d4ed8;
  border-radius: 0 3px 3px 0;
}

/* ── h3 — green sub-label ───────────────────────────────── */
h3 {
  float: left;
  clear: left;
  margin-left: -55mm;
  margin-top: 14px;
  margin-bottom: 0;
  margin-right: 0;
  width: 52mm;
  box-sizing: border-box;
  padding: 5px 8px;
  font-size: 9pt;
  font-weight: 600;
  font-style: italic;
  line-height: 1.3;
  word-break: break-word;
  color: #166534;
  background: #dcfce7;
  border-left: 4px solid #16a34a;
  border-radius: 0 3px 3px 0;
}

/* ── h4 — purple inline sub-heading ────────────────────── */
h4 {
  clear: left;
  font-size: 10.5pt;
  font-weight: 700;
  color: #6d28d9;
  margin: 14px 0 4px 0;
  padding-left: 8px;
  border-left: 3px solid #7c3aed;
}

/* ── Blockquote (tips / callouts) ────────────────────────── */
blockquote {
  clear: left;
  margin: 8px 0 8px 0;
  padding: 8px 12px;
  background: #fefce8;
  border-left: 4px solid #ca8a04;
  color: #713f12;
  font-style: italic;
}

/* ── Code blocks ─────────────────────────────────────────── */
pre {
  clear: left;
  background: #0d1117;
  color: #c9d1d9;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 8.5pt;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
}
code {
  font-family: "Cascadia Code", "Fira Code", Consolas, monospace;
  font-size: 9pt;
  background: #f3f4f6;
  padding: 1px 4px;
  border-radius: 3px;
  color: #be185d;
}
pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: 8.5pt;
}

/* ── Tables ──────────────────────────────────────────────── */
table {
  clear: left;
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  font-size: 9.5pt;
}
th {
  background: #1e3a5f;
  color: #fff;
  padding: 6px 10px;
  text-align: left;
}
td {
  padding: 5px 10px;
  border-bottom: 1px solid #e2e8f0;
}
tr:nth-child(even) td {
  background: #f8fafc;
}

/* ── Lists ───────────────────────────────────────────────── */
ul, ol {
  clear: left;
  padding-left: 20px;
  margin: 6px 0;
}
li {
  margin-bottom: 3px;
}

/* ── Horizontal rule ─────────────────────────────────────── */
hr {
  border: none;
  border-top: 2px solid #e2e8f0;
  margin: 18px 0;
  clear: both;
}

/* ── Paragraphs ──────────────────────────────────────────── */
p {
  clear: left;
  margin: 6px 0 10px 0;
}
`;

async function main() {
  console.log('Generating PDF…');

  const pdf = await mdToPdf(
    { path: INPUT },
    {
      dest: OUTPUT,
      launch_options: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
      css: CSS,
      pdf_options: {
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', right: '18mm', bottom: '15mm', left: '15mm' },
      },
    }
  );

  if (pdf) {
    console.log(`✅  PDF saved to: ${OUTPUT}`);
  } else {
    console.error('❌  PDF generation failed');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
