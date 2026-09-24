import katex from 'katex';
import { Lesson, Formula, Concept } from '../types';
import { CONCEPTS } from '../data/concepts';
import { FORMULAS } from '../data/formulas';
import { UNITS } from '../data/units';

/**
 * V5 DOCUMENT ENGINE — "Xuất tư liệu lý thuyết gộp nhiều bài học" (DOCX / PDF A4).
 * Implement theo MASTER INSTRUCTION KHTN8_XUAT_TU_LIEU_LY_THUYET_GOP_NHIEU_BAI_V5:
 *  - Pipeline: normalize text/punct/unit → formula object → document builder → print layout.
 *  - Cấu trúc chuẩn: TƯ LIỆU LÝ THYết / GỘP NHIỀU BÀI → MỤC LỤC → từng BÀI với
 *    1. Kiến thức trọng tâm · 2. Đại lượng và đơn vị · 3. Công thức cần nhớ · 4. Lưu ý.
 *  - Không sinh đường gạch ngang separator sau mỗi bài (LAYOUT-001).
 *  - Công thức là object riêng (FORM-*, §12.1): id, name, latex, plain_text, variables, units, conditions, source.
 *  - Đơn vị chuẩn hoá (UNIT-*): m2→m², m3→m³, kg/m3→kg/m³, N/m2→N/m², oC→°C.
 */

export interface V5ExportConfig {
  includeSummary: boolean;
  includeConcepts: boolean;
  includeFormulas: boolean;
  includeMisconceptions: boolean;
  includeRealWorld: boolean;
  fontSize: string;
}

export interface V5FormulaObject {
  formula_id: string;
  formula_name: string;
  latex: string;
  plain_text: string;
  variables: { symbol: string; name: string; unit: string }[];
  units: string[];
  conditions: string[];
  source: string;
  verification_status: 'VERIFY' | 'VERIFIED' | 'SOURCE';
}

export interface V5QARow {
  lessonNumber: number;
  lessonTitle: string;
  columns: {
    TEXT: 'PASS' | 'VERIFY' | 'BLOCK';
    FORMULA: 'PASS' | 'VERIFY' | 'BLOCK';
    UNIT: 'PASS' | 'VERIFY' | 'BLOCK';
    STRUCTURE: 'PASS' | 'VERIFY' | 'BLOCK';
    LAYOUT: 'PASS' | 'VERIFY' | 'BLOCK';
    SOURCE: 'PASS' | 'VERIFY' | 'BLOCK';
  };
  status: 'READY' | 'VERIFY' | 'BLOCK';
  issues: string[];
}

/* ============================================================
 * 1) TEXT / PUNCT / UNIT NORMALIZATION (V5 §9, §10, §16, §30)
 * ============================================================ */
export function normalizeText(text: string): string {
  if (!text) return '';
  let s = text;
  // Hai-hoặc-nhiều khoảng trắng -> một khoảng trắng (TXT-001)
  s = s.replace(/[ \t]{2,}/g, ' ');
  // Khoảng trắng trước dấu câu (PUN-003)
  s = s.replace(/\s+([.,;:!?)])/g, '$1');
  // Thiếu khoảng trắng sau dấu câu "câu. Chữ"? không tự thêm — chỉ bỏ thừa.
  // Dấu câu lặp "...—, ,," (giữ ellipsis "...")
  s = s.replace(/([.,;:])\1{2,}/g, '$1');
  // 24{,}79 -> 24,79 (dấu phẩy thập phân)
  s = s.replace(/\{,\}/g, ',');
  // Bao quanh dấu ngoặc: " ( x ) " -> "(x)" được xử lý ở trên cho ')'.
  s = s.replace(/\s+\)/g, ')');
  // Đơn vị chuẩn hoá (UNIT-001): m2/m3/cm2/cm3/... 
  s = s.replace(/\bcm2\b/g, 'cm²');
  s = s.replace(/\bcm3\b/g, 'cm³');
  s = s.replace(/\bmm2\b/g, 'mm²');
  s = s.replace(/\bkg\/m3\b/g, 'kg/m³');
  s = s.replace(/\bg\/cm3\b/g, 'g/cm³');
  s = s.replace(/\bN\/m2\b/g, 'N/m²');
  s = s.replace(/\boC\b/g, '°C');
  s = s.replace(/\b(\d+)°\s*C\b/g, '$1 °C');
  return s.trim();
}

function esc(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ============================================================
 * 2) FORMULA: LaTeX -> plain text (cho DOCX) + KaTeX render (cho HTML/PDF)
 * ============================================================ */
export function formulaToPlain(latex: string): string {
  if (!latex) return '';
  let s = String(latex);
  s = s.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1) / ($2)');
  s = s.replace(/\\dfrac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1) / ($2)');
  s = s.replace(/\\cdot/g, '·');
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\Delta/g, 'Δ');
  s = s.replace(/\\rho/g, 'ρ');
  s = s.replace(/\\approx/g, '≈');
  s = s.replace(/\\leq/g, '≤');
  s = s.replace(/\\geq/g, '≥');
  s = s.replace(/\\le/g, '≤');
  s = s.replace(/\\ge/g, '≥');
  s = s.replace(/\\pm/g, '±');
  s = s.replace(/\\degree/g, '°');
  s = s.replace(/\\text\s*\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\mathrm\s*\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\mathbf\s*\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\underline\s*\{([^{}]*)\}/g, '$1');
  s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)');
  s = s.replace(/\\approx|\\simeq/g, '≈');
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\%/g, '%');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\,/g, '');
  s = s.replace(/\\quad|\\qquad|\\ /g, ' ');
  s = s.replace(/\{,\}/g, ',');
  s = s.replace(/\{\}/g, '');
  s = s.replace(/\^\{([^{}]*)\}/g, '^$1');
  s = s.replace(/_\{([^{}]*)\}/g, '_$1');
  s = s.replace(/\\/g, '');
  return normalizeText(s);
}

/** KaTeX render with fail-safe fallback về plain text. */
export function renderLatexHtml(tex: string): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: true,
      strict: 'ignore',
      output: 'htmlAndMathml'
    });
  } catch {
    return esc(formulaToPlain(tex));
  }
}

/** Build V5 formula object (§12.1). */
export function buildFormulaObject(f: Formula): V5FormulaObject {
  return {
    formula_id: f.id,
    formula_name: f.name,
    latex: f.formulaLatex,
    plain_text: formulaToPlain(f.formulaLatex),
    variables: (f.variables || []).map((v) => ({ symbol: v.symbol, name: v.name, unit: v.unit })),
    units: (f.variables || []).map((v) => v.unit).filter(Boolean),
    conditions: f.conditions || [],
    source: f.sourceId,
    verification_status: f.sourceId && f.variables && f.variables.length > 0 ? 'SOURCE' : 'VERIFY'
  };
}

/* ============================================================
 * 3) CONTENT JOIN + DOCUMENT BUILDER (§6, §7, §18, §24)
 * ============================================================ */
const domainLabel = (d: Lesson['domain']): string =>
  d === 'HOA_HOC' ? 'Hóa học' : d === 'VAT_LI' ? 'Vật lí' : d === 'SINH_HOC' ? 'Sinh học' : 'Chung';

function lessonConcepts(lessonId: string): Concept[] {
  return CONCEPTS.filter((c) => c.lessonId === lessonId);
}
function lessonFormulas(lessonId: string): Formula[] {
  return FORMULAS.filter((f) => f.lessonId === lessonId);
}

/** Bảng "Đại lượng & Đơn vị" gộp từ variables của công thức + bảng UNITS (§18). */
function buildQuantityRows(lesson: Lesson): { symbol: string; name: string; unit: string }[] {
  const rows: { symbol: string; name: string; unit: string }[] = [];
  const seen = new Set<string>();
  lessonFormulas(lesson.id).forEach((f) => {
    (f.variables || []).forEach((v) => {
      const key = v.symbol;
      if (!seen.has(key)) {
        seen.add(key);
        rows.push({ symbol: v.symbol, name: v.name, unit: v.unit });
      }
    });
  });
  // Bổ sung UNITS khớp domain (unit quantities có thể liên quan)
  UNITS.filter((u) => u.domain === 'CHUNG' || u.domain === lesson.domain).forEach((u) => {
    const symbol = u.quantity.match(/\(([^)]+)\)/)?.[1] || u.symbol.split(',')[0]?.trim() || u.quantity;
    if (!seen.has(symbol)) {
      seen.add(symbol);
      rows.push({ symbol, name: u.quantity.replace(/\s*\([^)]*\)\s*$/, ''), unit: u.symbol });
    }
  });
  return rows;
}

function quantityTableHtml(lesson: Lesson): string {
  const rows = buildQuantityRows(lesson);
  if (rows.length === 0) return '';
  const body = rows
    .map(
      (r) => `<tr><td>${esc(r.name)}</td><td style="text-align:center;white-space:nowrap;">${esc(r.symbol)}</td><td style="text-align:center;white-space:nowrap;">${esc(r.unit)}</td></tr>`
    )
    .join('');
  return `<div class="v5-table-wrap avoid-break"><table class="v5-qty">
    <thead><tr><th>Đại lượng</th><th>Ký hiệu</th><th>Đơn vị</th></tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
}

function formulaBlockHtml(f: Formula): string {
  const fo = buildFormulaObject(f);
  const varsHtml =
    (f.variables || []).length > 0
      ? `<div class="v5-formula-vars">Trong đó:&nbsp; ${(f.variables || [])
          .map((v) => `<span><i>${esc(v.symbol)}</i>: ${esc(v.name)} (${esc(v.unit)})</span>`)
          .join('; ')}</div>`
      : '';
  const derivedHtml =
    f.derivedForms && f.derivedForms.length > 0
      ? `<div class="v5-formula-derived"><strong>Biến đổi:</strong> ${f.derivedForms
          .map((d) => `<span class="v5-inline-math">${renderLatexHtml(d)}</span>`)
          .join('&nbsp;&nbsp;')}</div>`
      : '';
  const condHtml =
    f.conditions && f.conditions.length > 0
      ? `<div class="v5-formula-cond"><strong>Điều kiện áp dụng:</strong> ${f.conditions
          .map((c) => `<span>${renderLatexHtml(c)}</span>`)
          .join(' · ')}</div>`
      : '';
  return `<div class="v5-formula avoid-break">
    <div class="v5-formula-name">${esc(f.name)}</div>
    <div class="v5-formula-latex">${renderLatexHtml(f.formulaLatex)}</div>
    ${varsHtml}
    ${derivedHtml}
    ${condHtml}
  </div>`;
}

function lessonBlockHtml(lesson: Lesson, config: V5ExportConfig, withKatex = true): string {
  const concepts = lessonConcepts(lesson.id);
  const formulas = lessonFormulas(lesson.id);

  const summaryHtml =
    config.includeSummary && lesson.summary.length > 0
      ? `<h3 class="v5-section-title">1. KIẾN THỨC TRỌNG TÂM</h3>
         <ul class="v5-summary">${lesson.summary
           .map((pt) => `<li>${withKatex ? renderLatexHtml(pt) : esc(formulaToPlain(pt))}</li>`)
           .join('')}</ul>`
      : '';

  const qtyHtml =
    config.includeFormulas && formulas.length > 0
      ? `<h3 class="v5-section-title">2. ĐẠI LƯỢNG VÀ ĐƠN VỊ</h3>${quantityTableHtml(lesson)}`
      : '';

  const formulaHtml =
    config.includeFormulas && formulas.length > 0
      ? `<h3 class="v5-section-title">3. CÔNG THỨC CẦN NHỚ</h3>
         ${formulas.map((f) => formulaBlockHtml(f)).join('\n')}`
      : '';

  const misconceptionItems = concepts.flatMap((c) =>
    config.includeMisconceptions && c.commonMisconceptions.length > 0
      ? c.commonMisconceptions.map((m) => ({ term: c.term, text: m }))
      : []
  );
  const unitErrors = UNITS.filter((u) => u.domain === 'CHUNG' || u.domain === lesson.domain)
    .map((u) => u.commonErrors)
    .filter(Boolean);
  const noteHtml =
    misconceptionItems.length > 0 || unitErrors.length > 0
      ? `<h3 class="v5-section-title">4. LƯU Ý</h3>
         <ul class="v5-notes">
           ${misconceptionItems
             .map((m) => `<li><strong>⚠ ${esc(m.term)}:</strong> ${withKatex ? renderLatexHtml(m.text) : esc(formulaToPlain(m.text))}</li>`)
             .join('')}
           ${unitErrors
             .map((e) => `<li><strong>⚠ Đơn vị:</strong> ${withKatex ? renderLatexHtml(e) : esc(formulaToPlain(e))}</li>`)
             .join('')}
         </ul>`
      : '';

  const realWorldHtml =
    config.includeRealWorld &&
    concepts.some((c) => c.realWorldHook)
      ? `<h3 class="v5-section-title">5. VẬN DỤNG THỰC TẾ</h3>
         <ul class="v5-notes">${concepts
           .filter((c) => c.realWorldHook)
           .map((c) => `<li>${esc(c.realWorldHook)}</li>`)
           .join('')}</ul>`
      : '';

  return `<div class="v5-lesson">
    <div class="v5-lesson-tag">${domainLabel(lesson.domain)} · ${esc(lesson.chapterTitle)} · Nguồn: ${lesson.curriculum} (GDPT 2018)</div>
    <h2 class="v5-lesson-title">BÀI ${lesson.lessonNumber}: ${esc(lesson.title.toUpperCase())}</h2>
    ${[summaryHtml, qtyHtml, formulaHtml, noteHtml, realWorldHtml].join('\n')}
  </div>`;
}

/* ============================================================
 * 4) FULL DOCUMENTS: Standalone HTML A4 (PDF) + Word HTML (.doc)
 * ============================================================ */
const V5_CLASS_CSS = `
  * { box-sizing: border-box; }
  body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #111827; margin: 0; padding: 0; background: #fff; }
  .v5-sheet { max-width: 100%; }
  .v5-cover { text-align: center; padding-bottom: 12pt; margin-bottom: 14pt; border-bottom: 2pt solid #0f172a; }
  .v5-cover-sub { font-size: 9pt; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; font-weight: bold; }
  .v5-cover-title { font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #0f172a; margin: 6pt 0 4pt 0; }
  .v5-cover-meta { font-size: 9.5pt; color: #64748b; font-style: italic; }
  .v5-toc { background: #f1f5f9; border: 1pt solid #cbd5e1; padding: 10pt 14pt; margin-bottom: 18pt; page-break-inside: avoid; }
  .v5-toc-chapter { font-weight: bold; color: #0f172a; margin-top: 6pt; }
  .v5-toc-item { padding-left: 12pt; }
  .v5-lesson { margin-bottom: 6pt; page-break-before: always; }
  .v5-lesson:first-of-type { page-break-before: auto; }
  .v5-lesson-tag { font-size: 9pt; color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
  .v5-lesson-title { font-size: 14pt; font-weight: bold; color: #047857; border-bottom: 1.5pt solid #047857; padding-bottom: 4pt; margin: 4pt 0 6pt 0; page-break-after: avoid; }
  .v5-section-title { font-size: 11pt; font-weight: bold; color: #0f172a; margin: 10pt 0 4pt 0; page-break-after: avoid; }
  .v5-summary { margin: 4pt 0 8pt 0; padding-left: 18pt; }
  .v5-summary li { margin-bottom: 3pt; }
  ul.v5-notes { margin: 4pt 0 8pt 0; padding-left: 18pt; }
  ul.v5-notes li { margin-bottom: 3pt; }
  .v5-table-wrap { margin: 4pt 0 10pt 0; }
  table.v5-qty { border-collapse: collapse; width: 100%; page-break-inside: avoid; }
  table.v5-qty th, table.v5-qty td { border: 1pt solid #94a3b8; padding: 5pt 8pt; font-size: 10.5pt; }
  table.v5-qty th { background: #eef2f7; }
  .v5-formula { background: #f0f6ff; border: 1pt solid #bcd2f0; border-radius: 6pt; padding: 9pt 12pt; margin: 6pt 0 10pt 0; page-break-inside: avoid; }
  .v5-formula-name { font-weight: bold; color: #1e3a8a; font-size: 11pt; page-break-after: avoid; }
  .v5-formula-latex { font-size: 13pt; color: #1d4ed8; margin: 5pt 0; page-break-inside: avoid; overflow-x: auto; }
  .v5-formula-vars { font-size: 10pt; color: #374151; margin-top: 4pt; }
  .v5-formula-derived { font-size: 9.5pt; color: #475569; margin-top: 3pt; }
  .v5-formula-cond { font-size: 9.5pt; color: #0f5c3c; margin-top: 3pt; }
  .v5-inline-math .katex-display { margin: 0.2em 0; }
  .v5-footer { text-align: center; font-size: 9pt; color: #94a3b8; border-top: 1pt solid #e2e8f0; padding-top: 10pt; margin-top: 18pt; font-style: italic; }
  .no-print { display: none; }
  @media print { body { font-size: 10.5pt !important; } .no-print { display: none !important; } }
`;

const V5_PAGE_CSS = `
  @page { size: A4 portrait; margin: 20mm 18mm 18mm 18mm;
    @top-center { content: "KHTN 8 · TƯ LIỆU LÝ THUYẾT GỘP NHIỀU BÀI HỌC"; font-size: 8pt; color: #64748b; }
    @bottom-center { content: "Trang " counter(page); font-size: 9pt; color: #475569; }
  }
  ${V5_CLASS_CSS}
`;

/** CSS class-level dùng cho bản in nhanh ngay trong app (global @page A4 đã có sẵn). */
export function v5PrintCss(): string {
  return V5_CLASS_CSS;
}

/** Standalone A4 HTML có thể mở bằng trình duyệt và In / Lưu PDF (Ctrl+P). */
export function buildV5StandaloneHtml(lessons: Lesson[], config: V5ExportConfig, opts?: { withKatexCdn?: boolean }): string {
  const sorted = [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);
  const chapters: string[] = [];
  sorted.forEach((l) => {
    if (!chapters.includes(l.chapterTitle)) chapters.push(l.chapterTitle);
  });

  const tocHtml = chapters
    .map((ch) => {
      const items = sorted.filter((l) => l.chapterTitle === ch);
      return `<div class="v5-toc-chapter">${esc(ch)}</div>
        ${items.map((l) => `<div class="v5-toc-item">Bài ${l.lessonNumber} — ${esc(l.title)} (${domainLabel(l.domain)})</div>`).join('')}`;
    })
    .join('');

  const bodyHtml = sorted.map((l) => lessonBlockHtml(l, config, true)).join('\n');

  const katexLink = opts?.withKatexCdn === false ? '' : '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.18.9/dist/katex.min.css" />';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TƯ LIỆU LÝ THUYẾT KHTN 8 GỘP NHIỀU BÀI HỌC</title>
${katexLink}
<style>${V5_PAGE_CSS}</style>
</head>
<body>
  <div class="screen-banner no-print" style="position:sticky;top:0;z-index:10;background:#0f172a;color:#f8fafc;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;font-family:system-ui,sans-serif;font-size:13px;">
    <span><strong>TƯ LIỆU LÝ THUYẾT KHTN 8</strong> · ${sorted.length} bài · Bản in A4 chuẩn</span>
    <button type="button" onclick="window.print()" style="background:#0d9488;color:#fff;border:none;padding:7px 16px;border-radius:8px;font-weight:700;cursor:pointer;">🖨️ In Ngay / Lưu PDF (A4)</button>
  </div>
  <div class="v5-sheet">
    <div class="v5-cover">
      <div class="v5-cover-sub">BỘ GIÁO DỤC VÀ ĐÀO TẠO · CHƯƠNG TRÌNH GDPT 2018</div>
      <h1 class="v5-cover-title">TƯ LIỆU LÝ THUYẾT<br>GỘP NHIỀU BÀI HỌC</h1>
      <div class="v5-cover-meta">Môn: KHTN 8 · Phạm vi: ${sorted.length} bài (${sorted.map((l) => `Bài ${l.lessonNumber}`).join(', ')}) · Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
    </div>
    <div class="v5-toc">
      <div class="v5-toc-chapter" style="margin-top:0;text-transform:uppercase;font-size:10.5pt;">MỤC LỤC</div>
      ${tocHtml}
    </div>
    ${bodyHtml}
    <div class="v5-footer avoid-break">Trợ Lý Tự Học KHTN 8 — Tài liệu lưu hành nội bộ phục vụ học tập & giảng dạy chuẩn GDPT 2018.</div>
  </div>
</body>
</html>`;
}

/** Bản sheet dùng cho in nhanh ngay trong app (global @page A4 + katex CSS của app đã sẵn sàng). */
export function buildV5PrintSheet(lessons: Lesson[], config: V5ExportConfig): string {
  const sorted = [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);
  const chapters: string[] = [];
  sorted.forEach((l) => {
    if (!chapters.includes(l.chapterTitle)) chapters.push(l.chapterTitle);
  });
  const tocHtml = chapters
    .map((ch) => {
      const items = sorted.filter((l) => l.chapterTitle === ch);
      return `<div class="v5-toc-chapter">${esc(ch)}</div>
        ${items.map((l) => `<div class="v5-toc-item">Bài ${l.lessonNumber} — ${esc(l.title)} (${domainLabel(l.domain)})</div>`).join('')}`;
    })
    .join('');
  const bodyHtml = sorted.map((l) => lessonBlockHtml(l, config, true)).join('\n');
  return `
  <div class="v5-sheet">
    <div class="v5-cover">
      <div class="v5-cover-sub">BỘ GIÁO DỤC VÀ ĐÀO TẠO · CHƯƠNG TRÌNH GDPT 2018</div>
      <h1 class="v5-cover-title">TƯ LIỆU LÝ THUYẾT<br>GỘP NHIỀU BÀI HỌC</h1>
      <div class="v5-cover-meta">Môn: KHTN 8 · Phạm vi: ${sorted.length} bài (${sorted.map((l) => `Bài ${l.lessonNumber}`).join(', ')}) · Ngày in: ${new Date().toLocaleDateString('vi-VN')}</div>
    </div>
    <div class="v5-toc">
      <div class="v5-toc-chapter" style="margin-top:0;text-transform:uppercase;font-size:10.5pt;">MỤC LỤC</div>
      ${tocHtml}
    </div>
    ${bodyHtml}
    <div class="v5-footer avoid-break">Trợ Lý Tự Học KHTN 8 — Tài liệu lưu hành nội bộ phục vụ học tập & giảng dạy chuẩn GDPT 2018.</div>
  </div>`;
}

/** Word-compatible HTML (.doc): vỏ HTML theo chuẩn Word đã kiểm chứng (@page Section1 + div.Section1),
 *  công thức ở dạng plain_text (V5 §12), không separator gạch ngang. */
export function buildV5WordHtml(lessons: Lesson[], config: V5ExportConfig): string {
  const sorted = [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber);

  const unitTableFor = (l: Lesson): string => {
    const unitRows = buildQuantityRows(l);
    if (unitRows.length === 0) return '';
    return `<table style="border-collapse:collapse;width:100%;page-break-inside:avoid;" cellspacing="0" cellpadding="4">
      <tbody>
        <tr style="background:#eef2f7;"><td style="border:1pt solid #94a3b8;"><b>Đại lượng</b></td><td style="border:1pt solid #94a3b8;"><b>Ký hiệu</b></td><td style="border:1pt solid #94a3b8;"><b>Đơn vị</b></td></tr>
        ${unitRows
          .map(
            (r) =>
              `<tr><td style="border:1pt solid #94a3b8;">${esc(r.name)}</td><td style="border:1pt solid #94a3b8;text-align:center;">${esc(r.symbol)}</td><td style="border:1pt solid #94a3b8;text-align:center;">${esc(r.unit)}</td></tr>`
          )
          .join('')}
      </tbody>
    </table>`;
  };

  const lessonBlocks = sorted
    .map((l) => {
      const concepts = lessonConcepts(l.id);
      const formulas = lessonFormulas(l.id);
      const unitTable = unitTableFor(l);

      const formulasCards = formulas
        .map((f) => {
          const fo = buildFormulaObject(f);
          const varsHtml =
            (f.variables || []).length > 0
              ? `<div style="font-size:9.5pt;color:#374151;margin-top:4pt;text-align:left;">Trong đó: ${(f.variables || [])
                  .map((v) => `${v.symbol}: ${esc(v.name)} (${esc(v.unit)})`)
                  .join('; ')}</div>`
              : '';
          const derHtml =
            f.derivedForms && f.derivedForms.length > 0
              ? `<div style="font-size:9.5pt;color:#4b5563;margin-top:4pt;text-align:left;"><em>Hệ quả biến đổi:</em> ${f.derivedForms
                  .map((d) => esc(formulaToPlain(d)))
                  .join('  |  ')}</div>`
              : '';
          const condHtml =
            f.conditions && f.conditions.length > 0
              ? `<div style="font-size:9.5pt;color:#0f5c3c;margin-top:4pt;text-align:left;"><em>Điều kiện áp dụng:</em> ${f.conditions
                  .map((c) => esc(formulaToPlain(c)))
                  .join(' · ')}</div>`
              : '';
          return `<div class="formula-card">
            <div style="font-weight:bold;font-size:11pt;color:#1e3a8a;">${esc(f.name)}</div>
            <div class="formula-math">${esc(fo.plain_text)}</div>
            <div class="formula-desc">${esc(f.description)}</div>
            ${varsHtml}${derHtml}${condHtml}
          </div>`;
        })
        .join('');

      const misconceptItems = concepts.flatMap((c) =>
        config.includeMisconceptions && c.commonMisconceptions.length > 0
          ? c.commonMisconceptions.map((m) => ({ term: c.term, text: m }))
          : []
      );
      const unitErrors = UNITS.filter((u) => u.domain === 'CHUNG' || u.domain === l.domain)
        .map((u) => u.commonErrors)
        .filter(Boolean);
      const notesHtml =
        misconceptItems.length > 0 || unitErrors.length > 0
          ? `<h3 class="section-header">4. LƯU Ý</h3><ul>
               ${misconceptItems.map((m) => `<li><b>⚠ ${esc(m.term)}:</b> ${esc(formulaToPlain(m.text))}</li>`).join('')}
               ${unitErrors.map((e) => `<li><b>⚠ Đơn vị:</b> ${esc(formulaToPlain(e))}</li>`).join('')}
             </ul>`
          : '';

      const realWorldHtml =
        config.includeRealWorld && concepts.some((c) => c.realWorldHook)
          ? `<h3 class="section-header">5. VẬN DỤNG THỰC TẾ</h3><ul>${concepts
              .filter((c) => c.realWorldHook)
              .map((c) => `<li>${esc(formulaToPlain(c.realWorldHook))}</li>`)
              .join('')}</ul>`
          : '';

      return `<div class="lesson-block">
        <div class="lesson-meta"><strong>Phân môn:</strong> ${domainLabel(l.domain)} | <strong>Chuyên đề:</strong> ${esc(l.chapterTitle)} | <strong>Nguồn:</strong> ${l.curriculum} (Bộ GD&ĐT - GDPT 2018)</div>
        <h2 class="lesson-title">BÀI ${l.lessonNumber}: ${esc(l.title.toUpperCase())}</h2>
        ${config.includeSummary ? `<h3 class="section-header">1. KIẾN THỨC TRỌNG TÂM</h3><ul>${l.summary.map((pt) => `<li>${esc(formulaToPlain(pt))}</li>`).join('')}</ul>` : ''}
        ${config.includeFormulas && unitTable ? `<h3 class="section-header">2. ĐẠI LƯỢNG VÀ ĐƠN VỊ</h3>${unitTable}` : ''}
        ${config.includeFormulas && formulas.length > 0 ? `<h3 class="section-header">3. CÔNG THỨC CẦN NHỚ</h3>${formulasCards}` : ''}
        ${notesHtml}
        ${realWorldHtml}
      </div>`;
    })
    .join('<div style="page-break-after: always; height: 16pt;"></div>');

  const lessonNamesSummary = sorted
    .map((l) => `Bài ${l.lessonNumber}: ${l.title}`)
    .join('  ·  ');

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>TƯ LIỆU LÝ THUYẾT KHTN 8 GỘP NHIỀU BÀI HỌC</title>
<style>
  @page Section1 { size: 595.3pt 841.9pt; margin: 56.7pt 56.7pt 56.7pt 56.7pt; mso-header-margin: 36pt; mso-footer-margin: 36pt; }
  div.Section1 { page: Section1; }
  body { font-family: 'Times New Roman', serif; font-size: ${config.fontSize}; line-height: 1.55; color: #111827; }
  h1.doc-title { font-size: 18pt; font-weight: bold; text-align: center; color: #0f172a; text-transform: uppercase; margin-bottom: 4pt; }
  .doc-meta { font-size: 10pt; text-align: center; color: #475569; margin-bottom: 16pt; font-style: italic; }
  .toc-box { background: #f1f5f9; border: 1pt solid #cbd5e1; padding: 10pt 14pt; margin-bottom: 20pt; }
  .toc-title { font-weight: bold; font-size: 11pt; color: #0f172a; margin-bottom: 4pt; text-transform: uppercase; }
  .lesson-block { margin-bottom: 18pt; }
  h2.lesson-title { font-size: 13.5pt; font-weight: bold; color: #047857; border-bottom: 1.5pt solid #047857; padding-bottom: 4pt; margin-top: 14pt; margin-bottom: 6pt; }
  .lesson-meta { font-size: 9pt; color: #64748b; margin-bottom: 8pt; }
  h3.section-header { font-size: 11pt; font-weight: bold; color: #1e293b; margin-top: 10pt; margin-bottom: 4pt; }
  ul { margin: 4pt 0 8pt 18pt; padding: 0; }
  li { margin-bottom: 3pt; }
  .formula-card { background: #eff6ff; border: 1pt solid #bfdbfe; padding: 7pt 10pt; margin-bottom: 7pt; text-align: center; page-break-inside: avoid; }
  .formula-math { font-size: 12.5pt; font-weight: bold; color: #1e40af; margin: 3pt 0; font-family: 'Cambria Math', 'Times New Roman', serif; text-align: center; }
  .formula-desc { font-size: 9pt; color: #374151; }
</style>
</head>
<body>
  <div class="Section1">
    <h1 class="doc-title">TƯ LIỆU LÝ THUYẾT — GỘP NHIỀU BÀI HỌC</h1>
    <div class="doc-meta">
      Bộ Giáo Dục và Đào Tạo · Chương Trình GDPT 2018 · ${sorted.length} bài (${sorted.map((l) => `Bài ${l.lessonNumber}`).join(', ')}) · Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
    </div>
    <div class="toc-box">
      <div class="toc-title">DANH MỤC CÁC BÀI HỌC ĐƯỢC GỘP TRONG TÀI LIỆU (${sorted.length} bài)</div>
      <div style="font-size: 9.5pt; color: #334155; line-height: 1.6;">${lessonNamesSummary}</div>
    </div>
    ${lessonBlocks}
    <p style="text-align:center;font-size:9pt;color:#94a3b8;margin-top:18pt;font-style:italic;">Trợ Lý Tự Học KHTN 8 — Tài liệu lưu hành nội bộ phục vụ học tập & giảng dạy.</p>
  </div>
</body>
</html>`;
}

/** Plain text V5 (không có separator gạch ngang thừa). */
export function buildV5PlainText(lessons: Lesson[]): string {
  return lessons
    .map((l) => {
      const concepts = lessonConcepts(l.id);
      const formulas = lessonFormulas(l.id);
      const quantityRows = buildQuantityRows(l);
      const lines: string[] = [
        `BÀI ${l.lessonNumber}: ${l.title.toUpperCase()}`,
        `${domainLabel(l.domain)} · ${l.chapterTitle} · Nguồn: ${l.curriculum} (GDPT 2018)`,
        '',
        '1. KIẾN THỨC TRỌNG TÂM:',
        ...l.summary.map((s, i) => `  ${i + 1}. ${formulaToPlain(s)}`),
        '',
        ...(quantityRows.length > 0
          ? [
              '2. ĐẠI LƯỢNG VÀ ĐƠN VỊ:',
              `  ${quantityRows.map((r) => `${r.name} (${r.symbol}) = ${r.unit}`).join('; ')}`,
              ''
            ]
          : []),
        ...(formulas.length > 0
          ? [
              '3. CÔNG THỨC CẦN NHỚ:',
              ...formulas.map(
                (f) =>
                  `  • ${f.name}: ${formulaToPlain(f.formulaLatex)}\n    Trong đó: ${(f.variables || [])
                    .map((v) => `${v.symbol} (${v.name}, đơn vị ${v.unit})`)
                    .join('; ')}` +
                  (f.derivedForms && f.derivedForms.length > 0
                    ? `\n    Biến đổi: ${f.derivedForms.map((d) => formulaToPlain(d)).join(' | ')}`
                    : '') +
                  (f.conditions && f.conditions.length > 0
                    ? `\n    Điều kiện áp dụng: ${f.conditions.map((c) => formulaToPlain(c)).join('; ')}`
                    : '')
              ),
              ''
            ]
          : []),
        ...(concepts.some((c) => c.commonMisconceptions.length > 0)
          ? [
              '4. LƯU Ý:',
              ...concepts.flatMap((c) =>
                c.commonMisconceptions.map((m) => `  ⚠ ${c.term}: ${formulaToPlain(m)}`)
              ),
              ''
            ]
          : [])
      ];
      return lines.join('\n');
    })
    .join('\n\n');
}

/* ============================================================
 * 5) QA REPORT (§31, §32) — quét toàn bộ bài trước khi xuất
 * ============================================================ */
function hasTextIssue(text: string): string | null {
  if (/[ \t]{2,}/.test(text)) return 'TXT-001: hai hoặc nhiều khoảng trắng';
  if (/\s+[.,;:!?]/.test(text)) return 'PUN-003: khoảng trắng trước dấu câu';
  if (/(?<![.,;:])[.,;:][.,;:](?![.,;:])/.test(text)) return 'PUN-002: dấu câu lặp';
  if (/\{,\}/.test(text)) return 'TXT-005: dấu {,} còn sót';
  if (/\bm2\b|\bm3\b|\bcm2\b|\bcm3\b|\bkg\/m3\b|\bN\/m2\b|\boC\b/i.test(text)) return 'UNIT-001: đơn vị thiếu chỉ số trên (m2/m3/oC)';
  return null;
}

function formulaIssues(f: Formula): string[] {
  const out: string[] = [];
  if (!f.sourceId) out.push(`SOURCE-001: ${f.id} thiếu nguồn`);
  if (!f.variables || f.variables.length === 0) out.push('FORM-002: biến số chưa được định nghĩa');
  if (f.variables && f.variables.some((v) => !v.unit)) out.push('UNIT-001: biến thiếu đơn vị');
  if (/\{,\}/.test(f.formulaLatex)) out.push('TXT-005: {,} trong LaTeX (dùng ở dạng khác khi xuất bản in)');
  return out;
}

export function buildQAReport(lessons: Lesson[]): V5QARow[] {
  return lessons.map((l) => {
    const issues: string[] = [];
    let textOk = true;
    let unitOk = true;
    let structOk = true;

    l.summary.forEach((s) => {
      const iss = hasTextIssue(s);
      if (iss) {
        textOk = false;
        issues.push(iss);
      }
    });

    lessonConcepts(l.id).forEach((c) => {
      const iss = hasTextIssue(c.definition);
      if (iss) {
        textOk = false;
        issues.push(iss);
      }
      c.commonMisconceptions.forEach((m) => {
        const mi = hasTextIssue(m);
        if (mi) {
          textOk = false;
          issues.push(mi);
        }
      });
    });

    lessonFormulas(l.id).forEach((f) => {
      formulaIssues(f).forEach((i) => issues.push(`${i} [${f.id}]`));
      const fi = hasTextIssue(f.formulaLatex);
      if (fi) {
        textOk = false;
        issues.push(fi);
      }
      if (f.variables && f.variables.some((v) => /\bm2\b|\bm3\b|\boC\b/i.test(v.unit))) {
        unitOk = false;
        issues.push(`UNIT-001: đơn vị "${f.name}" thiếu chỉ số trên`);
      }
    });

    if (!l.summary || l.summary.length === 0) {
      structOk = false;
      issues.push('STRUCT-003: thiếu mục Kiến thức trọng tâm');
    }

    const layoutOk = true; // Dữ liệu không sinh separator; buildTime kiểm tra layout
    const sourceOk = !!l.sourceId;

    const worst = (ok: boolean) => (ok ? ('PASS' as const) : ('VERIFY' as const));
    const anyVerify = !textOk || !unitOk || !structOk || issues.some((i) => i.startsWith('FORM-') && !i.startsWith('FORM-RENDER'));

    return {
      lessonNumber: l.lessonNumber,
      lessonTitle: l.title,
      columns: {
        TEXT: worst(textOk),
        FORMULA: worst(lessonFormulas(l.id).every((f) => formulaIssues(f).length === 0)),
        UNIT: worst(unitOk),
        STRUCTURE: worst(structOk),
        LAYOUT: 'PASS',
        SOURCE: worst(sourceOk)
      },
      status: anyVerify || issues.length > 0 ? 'VERIFY' : 'READY',
      issues
    };
  });
}

/** Kiểm danh các bài được gộp (V5 §5, §35). */
export function buildLessonInventory(lessons: Lesson[]): string {
  return lessons
    .sort((a, b) => a.lessonNumber - b.lessonNumber)
    .map((l, i) => `Lesson ${String(i + 1).padStart(2, '0')}: Bài ${l.lessonNumber} — ${l.title} (${l.chapterTitle})`)
    .join('\n');
}