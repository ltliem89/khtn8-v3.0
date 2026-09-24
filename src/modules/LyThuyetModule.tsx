import React, { useState, useMemo } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { useLearningState } from '../context/LearningStateContext';
import { LESSONS } from '../data/curriculum';
import { CONCEPTS } from '../data/concepts';
import { FORMULAS } from '../data/formulas';
import { SubjectDomain, Lesson } from '../types';
import { MathView } from '../components/MathView';
import {
  BookOpen,
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  PlayCircle,
  FlaskConical,
  Binary,
  ArrowRight,
  Download,
  Printer,
  CheckSquare,
  Square,
  Eye,
  X,
  Sparkles,
  Check,
  Share2,
  Plus,
  Minus,
  FileText,
  Copy
} from 'lucide-react';
import { downloadFile, copyTextToClipboard, triggerPrintSafely } from '../utils/exportHelpers';

interface ExportConfig {
  includeSummary: boolean;
  includeConcepts: boolean;
  includeFormulas: boolean;
  includeMisconceptions: boolean;
  includeRealWorld: boolean;
  fontSize: '10pt' | '11pt' | '12pt';
}

/**
 * Utility to convert basic LaTeX math expressions to legible text for Word/DOCX
 */
function latexToPlainText(latex: string): string {
  if (!latex) return '';
  let s = latex;
  s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)');
  s = s.replace(/\\cdot/g, '·');
  s = s.replace(/\\times/g, '×');
  s = s.replace(/\\Delta/g, 'Δ');
  s = s.replace(/\\rho/g, 'ρ');
  s = s.replace(/\\approx/g, '≈');
  s = s.replace(/\\le/g, '≤');
  s = s.replace(/\\ge/g, '≥');
  s = s.replace(/\\pm/g, '±');
  s = s.replace(/\\degree/g, '°');
  s = s.replace(/\\text\{([^}]+)\}/g, '$1');
  s = s.replace(/\\mathrm\{([^}]+)\}/g, '$1');
  s = s.replace(/\\mathbf\{([^}]+)\}/g, '$1');
  s = s.replace(/\\%/g, '%');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\,/g, ' ');
  s = s.replace(/\\/g, '');
  s = s.replace(/_\{([^}]+)\}/g, '_$1');
  s = s.replace(/\^\{([^}]+)\}/g, '^$1');
  return s;
}

/**
 * Generates standalone HTML document that can be downloaded, opened directly in any browser,
 * and printed / saved as PDF via Ctrl+P with full A4 styling and zero iframe restrictions.
 */
function generateStandaloneHtml(lessons: Lesson[], config: ExportConfig): string {
  const lessonNamesSummary = lessons.map((l) => `Bài ${l.lessonNumber}: ${l.title}`).join(' · ');

  const lessonsContent = lessons
    .map((lesson) => {
      const concepts = CONCEPTS.filter((c) => c.lessonId === lesson.id);
      const formulas = FORMULAS.filter((f) => f.lessonId === lesson.id);

      return `
        <div class="lesson-section avoid-break">
          <div class="lesson-tag">Phân môn: ${
            lesson.domain === 'HOA_HOC' ? 'Hóa học' : lesson.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'
          } · ${lesson.chapterTitle}</div>
          <h2 class="lesson-title">BÀI ${lesson.lessonNumber}: ${lesson.title.toUpperCase()}</h2>
          <div class="lesson-curriculum">Nguồn chuẩn: ${lesson.curriculum} (Bộ GD&ĐT - Chương trình GDPT 2018)</div>

          ${
            config.includeSummary
              ? `
            <div class="section-box">
              <h3 class="section-title">1. Em cần biết (Kiến thức cốt lõi)</h3>
              <ul class="summary-list">
                ${lesson.summary.map((pt) => `<li>${latexToPlainText(pt)}</li>`).join('')}
              </ul>
            </div>
          `
              : ''
          }

          ${
            config.includeConcepts && concepts.length > 0
              ? `
            <div class="section-box">
              <h3 class="section-title">2. Khái niệm then chốt & Bản chất khoa học</h3>
              ${concepts
                .map(
                  (c) => `
                <div class="concept-item">
                  <div class="concept-term">✦ ${c.term}</div>
                  <div class="concept-def">"${latexToPlainText(c.definition)}"</div>
                  ${
                    config.includeMisconceptions && c.commonMisconceptions.length > 0
                      ? `
                    <div class="misconception-box">
                      <strong>⚠️ Điểm học sinh rất dễ nhầm lẫn:</strong><br>
                      ${c.commonMisconceptions.map((m) => `• ${latexToPlainText(m)}`).join('<br>')}
                    </div>
                  `
                      : ''
                  }
                  ${
                    config.includeRealWorld && c.realWorldHook
                      ? `
                    <div class="realworld-box">
                      <strong>🌍 Vận dụng đời sống:</strong> ${latexToPlainText(c.realWorldHook)}
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }

          ${
            config.includeFormulas && formulas.length > 0
              ? `
            <div class="section-box">
              <h3 class="section-title">3. Bảng công thức trọng tâm cần nhớ</h3>
              ${formulas
                .map(
                  (f) => `
                <div class="formula-item">
                  <div class="formula-name">${f.name}</div>
                  <div class="formula-expr">${latexToPlainText(f.formulaLatex)}</div>
                  <div class="formula-desc">${f.description}</div>
                  ${
                    f.derivedForms && f.derivedForms.length > 0
                      ? `
                    <div class="formula-derived">
                      <strong>Hệ quả:</strong> ${f.derivedForms.map((df) => latexToPlainText(df)).join('  |  ')}
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>
        <div class="page-break"></div>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tài Liệu Lý Thuyết KHTN 8 Gộp Các Bài Học</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: ${config.fontSize};
      line-height: 1.6;
      color: #1e293b;
      margin: 0;
      padding: 0;
      background: #f8fafc;
    }
    @media screen {
      .screen-wrapper {
        max-width: 860px;
        margin: 20px auto;
        padding: 0 16px;
      }
      .action-banner {
        position: sticky;
        top: 12px;
        z-index: 1000;
        background: #0f172a;
        color: #f8fafc;
        padding: 12px 18px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 20px;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .action-btn-print {
        background: #0d9488;
        color: #fff;
        font-weight: 700;
        border: none;
        padding: 8px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        transition: background 0.15s;
      }
      .action-btn-print:hover { background: #0f766e; }
      .action-btn-copy {
        background: #334155;
        color: #fff;
        border: 1px solid #475569;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
      }
      .paper-sheet {
        background: #fff;
        padding: 40px 48px;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        border: 1px solid #e2e8f0;
      }
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm 15mm 15mm 15mm;
      }
      body {
        background: #fff;
        color: #000;
        font-size: 10.5pt;
      }
      .no-print { display: none !important; }
      .screen-wrapper { max-width: 100%; margin: 0; padding: 0; }
      .paper-sheet { padding: 0; border: none; box-shadow: none; }
      .page-break { page-break-after: always; break-after: page; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }
    .header-block { text-align: center; border-bottom: 2pt solid #0f172a; padding-bottom: 14pt; margin-bottom: 18pt; }
    .header-sub { font-size: 9.5pt; text-transform: uppercase; letter-spacing: 1.5px; color: #475569; font-weight: bold; }
    .header-title { font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #0f172a; margin: 6pt 0 4pt 0; }
    .header-date { font-size: 9.5pt; color: #64748b; font-style: italic; }
    .toc-card { background: #f1f5f9; border: 1pt solid #cbd5e1; padding: 10pt 14pt; border-radius: 6pt; margin-bottom: 20pt; }
    .toc-title { font-weight: bold; font-size: 10.5pt; text-transform: uppercase; color: #0f172a; margin-bottom: 4pt; }
    .lesson-section { margin-bottom: 20pt; }
    .lesson-tag { font-size: 9pt; color: #0d9488; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .lesson-title { font-size: 14pt; font-weight: bold; color: #047857; border-bottom: 1.5pt solid #047857; padding-bottom: 4pt; margin: 4pt 0 4pt 0; }
    .lesson-curriculum { font-size: 9pt; color: #64748b; font-style: italic; margin-bottom: 10pt; }
    .section-box { margin-bottom: 12pt; }
    .section-title { font-size: 11pt; font-weight: bold; color: #0f172a; margin: 8pt 0 4pt 0; }
    .summary-list { margin: 4pt 0 8pt 18pt; padding: 0; }
    .summary-list li { margin-bottom: 4pt; }
    .concept-item { background: #f8fafc; border: 1pt solid #e2e8f0; border-radius: 6pt; padding: 8pt 12pt; margin-bottom: 8pt; }
    .concept-term { font-weight: bold; color: #0f172a; font-size: 11pt; }
    .concept-def { font-style: italic; color: #334155; margin-top: 3pt; font-size: 10pt; }
    .misconception-box { background: #fff1f2; border: 1pt solid #fecdd3; border-radius: 4pt; padding: 6pt 10pt; margin-top: 6pt; color: #9f1239; font-size: 9.5pt; }
    .realworld-box { background: #fffbeb; border: 1pt solid #fde68a; border-radius: 4pt; padding: 6pt 10pt; margin-top: 6pt; color: #92400e; font-size: 9.5pt; }
    .formula-item { background: #eff6ff; border: 1pt solid #bfdbfe; border-radius: 6pt; padding: 8pt 12pt; margin-bottom: 8pt; text-align: center; }
    .formula-name { font-weight: bold; color: #1e3a8a; font-size: 11pt; }
    .formula-expr { font-size: 13pt; font-weight: bold; color: #1d4ed8; margin: 4pt 0; font-family: 'Cambria Math', 'Times New Roman', serif; }
    .formula-desc { font-size: 9.5pt; color: #374151; }
    .formula-derived { font-size: 9pt; color: #475569; margin-top: 4pt; }
    .doc-footer { text-align: center; font-size: 9pt; color: #94a3b8; border-top: 1pt solid #e2e8f0; padding-top: 12pt; margin-top: 24pt; font-style: italic; }
  </style>
</head>
<body>
  <div class="screen-wrapper">
    <div class="action-banner no-print">
      <div>
        <div style="font-weight: 700; font-size: 14px;">Tài Liệu Lý Thuyết KHTN 8 (${lessons.length} bài học)</div>
        <div style="font-size: 12px; color: #94a3b8;">Bản in chuẩn khổ giấy A4 · Không lỗi font tiếng Việt</div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button type="button" class="action-btn-print" onclick="window.print()">🖨️ In Ngay / Lưu PDF (A4)</button>
        <button type="button" class="action-btn-copy" onclick="navigator.clipboard.writeText(document.querySelector('.paper-sheet').innerText); alert('Đã sao chép toàn bộ văn bản vào bộ nhớ tạm!');">📋 Sao chép</button>
      </div>
    </div>

    <div class="paper-sheet">
      <div class="header-block">
        <div class="header-sub">BỘ GIÁO DỤC VÀ ĐÀO TẠO · CHƯƠNG TRÌNH GDPT 2018</div>
        <h1 class="header-title">TÀI LIỆU LÝ THUYẾT CỐT LÕI KHOA HỌC TỰ NHIÊN 8</h1>
        <div class="header-date">
          Bộ sách chuẩn hóa: Kết Nối Tri Thức & Cánh Diều · Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      <div class="toc-card avoid-break">
        <div class="toc-title">DANH MỤC CÁC BÀI HỌC ĐƯỢC GỘP (${lessons.length} bài):</div>
        <div style="font-size: 9.5pt; color: #334155;">${lessonNamesSummary}</div>
      </div>

      ${lessonsContent}

      <div class="doc-footer avoid-break">
        Trợ Lý Tự Học KHTN 8 — Tài liệu lưu hành nội bộ phục vụ học tập & giảng dạy chuẩn GDPT 2018.
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generates clean plain text / markdown for fast clipboard copying
 */
function generatePlainText(lessons: Lesson[]): string {
  return lessons
    .map((l) => {
      const concepts = CONCEPTS.filter((c) => c.lessonId === l.id);
      const formulas = FORMULAS.filter((f) => f.lessonId === l.id);

      return [
        `============================================================`,
        `BÀI ${l.lessonNumber}: ${l.title.toUpperCase()}`,
        `Chuyên đề: ${l.chapterTitle} | Phân môn: ${
          l.domain === 'HOA_HOC' ? 'Hóa học' : l.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'
        }`,
        `Nguồn: ${l.curriculum} (GDPT 2018)`,
        `------------------------------------------------------------`,
        `1. KIẾN THỨC CỐT LÕI:`,
        ...l.summary.map((s, i) => `  ${i + 1}. ${latexToPlainText(s)}`),
        ...(concepts.length > 0
          ? [
              `\n2. KHÁI NIỆM THEN CHỐT:`,
              ...concepts.map(
                (c) =>
                  `  ✦ ${c.term}: "${latexToPlainText(c.definition)}"\n` +
                  (c.commonMisconceptions.length > 0
                    ? `    ⚠️ Nhầm lẫn: ${c.commonMisconceptions.map((m) => latexToPlainText(m)).join('; ')}\n`
                    : '') +
                  (c.realWorldHook ? `    🌍 Thực tế: ${latexToPlainText(c.realWorldHook)}\n` : '')
              )
            ]
          : []),
        ...(formulas.length > 0
          ? [
              `\n3. BẢNG CÔNG THỨC:`,
              ...formulas.map(
                (f) =>
                  `  • ${f.name}: ${latexToPlainText(f.formulaLatex)}\n    Giải thích: ${f.description}` +
                  (f.derivedForms && f.derivedForms.length > 0
                    ? `\n    Hệ quả: ${f.derivedForms.map((df) => latexToPlainText(df)).join(' | ')}`
                    : '')
              )
            ]
          : [])
      ].join('\n');
    })
    .join('\n\n\n');
}

export const LyThuyetModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const { state, markLessonComplete } = useLearningState();

  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'ALL'>(
    (context.domain as SubjectDomain) || 'ALL'
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    context.lessonId || LESSONS[0].id
  );

  // Multi-selected lesson IDs for combined export.
  // Defaults to the currently viewed lesson so user has something ready.
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([
    context.lessonId || LESSONS[0].id
  ]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [modalActiveTab, setModalActiveTab] = useState<'SELECT' | 'PREVIEW'>('SELECT');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Export configuration options
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    includeSummary: true,
    includeConcepts: true,
    includeFormulas: true,
    includeMisconceptions: true,
    includeRealWorld: true,
    fontSize: '11pt'
  });

  // Printing state (which lessons are rendered into print DOM)
  const [printLessons, setPrintLessons] = useState<Lesson[]>([]);

  // Filter lessons based on selected domain for display in left list
  const filteredLessons = useMemo(() => {
    return LESSONS.filter((l) => {
      if (selectedDomain !== 'ALL' && l.domain !== selectedDomain) return false;
      return true;
    });
  }, [selectedDomain]);

  const activeLesson = LESSONS.find((l) => l.id === selectedLessonId) || filteredLessons[0] || LESSONS[0];
  const relatedConcepts = CONCEPTS.filter((c) => c.lessonId === activeLesson.id);
  const relatedFormulas = FORMULAS.filter((f) => f.lessonId === activeLesson.id);
  const isCompleted = state.completedLessons.includes(activeLesson.id);

  // Selected lessons objects for export (sorted by lessonNumber)
  const selectedLessonsForExport = useMemo(() => {
    return LESSONS.filter((l) => selectedLessonIds.includes(l.id)).sort(
      (a, b) => a.lessonNumber - b.lessonNumber
    );
  }, [selectedLessonIds]);

  // Handle toggling a lesson selection
  const toggleLessonSelection = (id: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add specific lesson to selection
  const addLessonToSelection = (id: string) => {
    setSelectedLessonIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Remove specific lesson from selection
  const removeLessonFromSelection = (id: string) => {
    setSelectedLessonIds((prev) => prev.filter((item) => item !== id));
  };

  // Select all or by domain
  const handleSelectDomainBatch = (domain: SubjectDomain | 'ALL') => {
    if (domain === 'ALL') {
      setSelectedLessonIds(LESSONS.map((l) => l.id));
    } else {
      setSelectedLessonIds(LESSONS.filter((l) => l.domain === domain).map((l) => l.id));
    }
  };

  // Select preset pairs like Bai 3 + Bai 4
  const handleSelectPresetPair = (ids: string[]) => {
    setSelectedLessonIds(ids);
  };

  const handleSelectCurrentOnly = () => {
    setSelectedLessonIds([activeLesson.id]);
  };

  const handleClearSelection = () => {
    setSelectedLessonIds([]);
  };

  // Check if all or some filtered lessons are currently selected
  const isAllFilteredSelected =
    filteredLessons.length > 0 && filteredLessons.every((l) => selectedLessonIds.includes(l.id));
  const isSomeFilteredSelected =
    filteredLessons.some((l) => selectedLessonIds.includes(l.id)) && !isAllFilteredSelected;

  // Toggle selection for all lessons in the active filter
  const toggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIds = new Set(filteredLessons.map((l) => l.id));
      setSelectedLessonIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedLessonIds, ...filteredLessons.map((l) => l.id)]);
      setSelectedLessonIds(Array.from(newIds));
    }
  };

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Open the Export Center Modal with preloaded lessons
  const handleOpenExportCenter = (lessonsToExport: Lesson[]) => {
    const targets = lessonsToExport.length > 0 ? lessonsToExport : [activeLesson];
    if (lessonsToExport.length === 0) {
      setSelectedLessonIds([activeLesson.id]);
    }
    setPrintLessons(targets);
    setModalActiveTab('PREVIEW');
    setIsExportModalOpen(true);
  };

  // Generate DOCX file for download (merging all selected lessons)
  const handleExportDocx = (lessonsToExport: Lesson[]) => {
    const targets = lessonsToExport.length > 0 ? lessonsToExport : [activeLesson];
    if (targets.length === 0) return;

    const lessonsHtml = targets
      .map((lesson) => {
        const concepts = CONCEPTS.filter((c) => c.lessonId === lesson.id);
        const formulas = FORMULAS.filter((f) => f.lessonId === lesson.id);

        return `
          <div class="lesson-block">
            <h2 class="lesson-title">BÀI ${lesson.lessonNumber}: ${lesson.title.toUpperCase()}</h2>
            <div class="lesson-meta">
              <strong>Chuyên đề:</strong> ${lesson.chapterTitle} | <strong>Phân môn:</strong> ${
          lesson.domain === 'HOA_HOC' ? 'Hóa học' : lesson.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'
        } | <strong>Nguồn:</strong> ${lesson.curriculum} (Bộ GD&ĐT - GDPT 2018)
            </div>

            ${
              exportConfig.includeSummary
                ? `
              <h3 class="section-header">1. Em cần biết (Kiến thức cốt lõi)</h3>
              <ul>
                ${lesson.summary.map((pt) => `<li>${latexToPlainText(pt)}</li>`).join('')}
              </ul>
            `
                : ''
            }

            ${
              exportConfig.includeConcepts && concepts.length > 0
                ? `
              <h3 class="section-header">2. Khái niệm then chốt & Bản chất khoa học</h3>
              ${concepts
                .map(
                  (c) => `
                <div class="concept-card">
                  <div class="concept-term">✦ ${c.term}</div>
                  <div class="concept-def">"${latexToPlainText(c.definition)}"</div>
                  ${
                    exportConfig.includeMisconceptions && c.commonMisconceptions.length > 0
                      ? `
                    <div class="misconception-card">
                      <strong>⚠️ Điểm học sinh rất dễ nhầm lẫn:</strong><br>
                      ${c.commonMisconceptions.map((m) => `• ${latexToPlainText(m)}`).join('<br>')}
                    </div>
                  `
                      : ''
                  }
                  ${
                    exportConfig.includeRealWorld && c.realWorldHook
                      ? `
                    <div class="realworld-card">
                      <strong>🌍 Vận dụng đời sống:</strong> ${latexToPlainText(c.realWorldHook)}
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            `
                : ''
            }

            ${
              exportConfig.includeFormulas && formulas.length > 0
                ? `
              <h3 class="section-header">3. Bảng công thức trọng tâm cần nhớ</h3>
              ${formulas
                .map(
                  (f) => `
                <div class="formula-card">
                  <div style="font-weight: bold; font-size: 11pt; color: #1e3a8a;">${f.name}</div>
                  <div class="formula-math">${latexToPlainText(f.formulaLatex)}</div>
                  <div class="formula-desc">${f.description}</div>
                  ${
                    f.derivedForms && f.derivedForms.length > 0
                      ? `
                    <div style="font-size: 9.5pt; color: #4b5563; margin-top: 4pt;">
                      <em>Hệ quả biến đổi:</em> ${f.derivedForms.map((df) => latexToPlainText(df)).join('  |  ')}
                    </div>
                  `
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            `
                : ''
            }
          </div>
          <div style="page-break-after: always; height: 16pt;"></div>
          <hr style="border: 0; border-top: 1.5pt dashed #cbd5e1; margin: 18pt 0;" />
        `;
      })
      .join('');

    const lessonNamesSummary = targets
      .map((l) => `Bài ${l.lessonNumber}: ${l.title}`)
      .join('  ·  ');

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Tài Liệu Lý Thuyết KHTN 8 Gộp Các Bài Học</title>
        <style>
          @page Section1 { size: 595.3pt 841.9pt; margin: 56.7pt 56.7pt 56.7pt 56.7pt; mso-header-margin: 36pt; mso-footer-margin: 36pt; }
          div.Section1 { page: Section1; }
          body { font-family: 'Times New Roman', serif; font-size: ${exportConfig.fontSize}; line-height: 1.55; color: #111827; }
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
          .concept-card { background: #f8fafc; border: 1pt solid #cbd5e1; padding: 7pt 10pt; margin-bottom: 7pt; }
          .concept-term { font-weight: bold; color: #0f172a; font-size: 10.5pt; }
          .concept-def { font-style: italic; color: #334155; margin-top: 2pt; font-size: 10pt; }
          .formula-card { background: #eff6ff; border: 1pt solid #bfdbfe; padding: 7pt 10pt; margin-bottom: 7pt; text-align: center; }
          .formula-math { font-size: 12.5pt; font-weight: bold; color: #1e40af; margin: 3pt 0; font-family: 'Cambria Math', 'Times New Roman', serif; }
          .formula-desc { font-size: 9pt; color: #374151; }
          .misconception-card { background: #fff1f2; border: 1pt solid #fecdd3; padding: 5pt 8pt; margin: 4pt 0; color: #9f1239; font-size: 9.5pt; }
          .realworld-card { background: #fffbeb; border: 1pt solid #fde68a; padding: 5pt 8pt; margin: 4pt 0; color: #92400e; font-size: 9.5pt; }
        </style>
      </head>
      <body>
        <div class="Section1">
          <h1 class="doc-title">TÀI LIỆU LÝ THUYẾT CỐT LÕI KHOA HỌC TỰ NHIÊN 8</h1>
          <div class="doc-meta">
            Bộ Giáo Dục và Đào Tạo · Chương Trình GDPT 2018 · Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}
          </div>
          <div class="toc-box">
            <div class="toc-title">DANH MỤC CÁC BÀI HỌC ĐƯỢC GỘP TRONG TÀI LIỆU (${targets.length} bài)</div>
            <div style="font-size: 9.5pt; color: #334155; line-height: 1.6;">${lessonNamesSummary}</div>
          </div>
          ${lessonsHtml}
        </div>
      </body>
      </html>
    `;

    const lessonNums = targets.map((l) => l.lessonNumber).join('_');
    const fileName =
      targets.length === 1
        ? `KHTN8_Bai_${targets[0].lessonNumber}_LyThuyet.doc`
        : targets.length <= 4
        ? `KHTN8_Gop_Bai_${lessonNums}_LyThuyet.doc`
        : `KHTN8_TuLieu_Gop_${targets.length}Bai_${new Date().toISOString().slice(0, 10)}.doc`;

    const ok = downloadFile(docContent, fileName, 'application/msword');
    if (ok) {
      showToast(`✅ Đã tải file Word: ${fileName}`);
    } else {
      showToast(`⚠️ Không thể tự tải file Word. Hãy thử Sao chép toàn bộ!`);
    }
  };

  // Generate Standalone HTML file for download (Can be opened in any browser & printed to PDF)
  const handleExportHtmlPrint = (lessonsToExport: Lesson[]) => {
    const targets = lessonsToExport.length > 0 ? lessonsToExport : [activeLesson];
    if (targets.length === 0) return;

    const htmlContent = generateStandaloneHtml(targets, exportConfig);
    const lessonNums = targets.map((l) => l.lessonNumber).join('_');
    const fileName =
      targets.length === 1
        ? `KHTN8_BanIn_Bai_${targets[0].lessonNumber}.html`
        : targets.length <= 4
        ? `KHTN8_BanIn_Gop_Bai_${lessonNums}.html`
        : `KHTN8_BanIn_Gop_${targets.length}Bai_${new Date().toISOString().slice(0, 10)}.html`;

    const ok = downloadFile(htmlContent, fileName, 'text/html');
    if (ok) {
      showToast(`✅ Đã tải file Bản in A4 (PDF): ${fileName}`);
    } else {
      showToast(`⚠️ Không thể tự tải file HTML.`);
    }
  };

  // Copy full merged content as plain text / markdown
  const handleCopyAllContent = async (lessonsToExport: Lesson[]) => {
    const targets = lessonsToExport.length > 0 ? lessonsToExport : [activeLesson];
    if (targets.length === 0) return;

    const text = generatePlainText(targets);
    const ok = await copyTextToClipboard(text);
    if (ok) {
      showToast(`✅ Đã sao chép nội dung ${targets.length} bài học vào bộ nhớ tạm!`);
    } else {
      showToast(`⚠️ Không thể sao chép tự động. Hãy xem trước để bôi đen văn bản.`);
    }
  };

  // Trigger browser print directly with safe fallback
  const handleDirectPrint = (lessonsToExport: Lesson[]) => {
    const targets = lessonsToExport.length > 0 ? lessonsToExport : [activeLesson];
    setPrintLessons(targets);

    setTimeout(() => {
      const res = triggerPrintSafely();
      if (!res.success || res.isIframe) {
        showToast('💡 Đang mở lệnh in... Nếu trình duyệt chặn khung in, bạn hãy chọn "Tải Bản In A4 (.html)"!');
      } else {
        showToast('🖨️ Đã gửi lệnh in tài liệu tới trình duyệt!');
      }
    }, 150);
  };

  // Dedicated 'Xuất tổng hợp' handler - opens Export Center modal with options
  const handleExportTongHopPdf = (lessonsToExport: Lesson[]) => {
    handleOpenExportCenter(lessonsToExport);
  };

  // Copy quick summary to clipboard for a single lesson
  const handleCopySummary = (lesson: Lesson) => {
    const text =
      `Bài ${lesson.lessonNumber}: ${lesson.title}\n\nKiến thức cốt lõi:\n` +
      lesson.summary.map((s, i) => `${i + 1}. ${latexToPlainText(s)}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
    showToast(`✅ Đã sao chép tóm tắt Bài ${lesson.lessonNumber}!`);
  };

  const isCurrentLessonSelected = selectedLessonIds.includes(activeLesson.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter Bar & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              Kiến Thức Chuẩn Hóa
            </span>
            <span className="text-2xs text-slate-500 font-medium">
              SGK KNTT & Cánh Diều · GDPT 2018
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Lý Thuyết Cốt Lõi (CORE)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kiến thức trọng tâm bám sát SGK/SGV, súc tích, dễ nhớ, có nguồn gốc rõ ràng.
          </p>
        </div>

        {/* Action Group: Domain Filters & Export CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'HOA_HOC', label: 'Hóa học' },
              { id: 'VAT_LI', label: 'Vật lí' },
              { id: 'SINH_HOC', label: 'Sinh học' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id as any)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                  selectedDomain === d.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Export Central CTA Button: Xuất tổng hợp */}
          <button
            type="button"
            onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-sm ring-2 ring-teal-400/40 cursor-pointer"
            title="Gộp nội dung các bài đã chọn và xuất ra 1 tài liệu PDF duy nhất"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>Xuất tổng hợp ({selectedLessonIds.length} bài PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xem trước và cấu hình chi tiết tài liệu xuất"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Tùy chọn...</span>
          </button>
        </div>
      </div>

      {/* Global Quick Banner when multiple lessons are selected */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border border-teal-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Danh sách bài chọn gộp để xuất tư liệu:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-2xs font-extrabold">
              {selectedLessonIds.length} bài
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap text-2xs text-teal-900">
            {selectedLessonsForExport.length === 0 ? (
              <span className="text-slate-400 italic">Chưa chọn bài nào. Hãy tick chọn Bài 3, Bài 4... ở danh sách bên dưới.</span>
            ) : (
              selectedLessonsForExport.map((l) => (
                <span
                  key={l.id}
                  className="bg-white px-2 py-0.5 rounded-md border border-teal-200 font-semibold text-teal-900 flex items-center gap-1 shadow-2xs"
                >
                  <span>Bài {l.lessonNumber}</span>
                  <button
                    type="button"
                    onClick={() => removeLessonFromSelection(l.id)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer ml-0.5"
                    title={`Bỏ chọn Bài ${l.lessonNumber}`}
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Quick Export CTAs from Global Banner */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick presets for common user requests like Bài 3 & 4 */}
          <button
            type="button"
            onClick={() => handleSelectPresetPair(['L_HOA_03', 'L_HOA_04'])}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-teal-900 border border-teal-300 rounded-lg text-2xs font-bold transition-colors cursor-pointer"
            title="Chọn nhanh cặp Bài 3 & Bài 4 (Hóa học)"
          >
            + Chọn Bài 3 & 4
          </button>

          <button
            type="button"
            onClick={() => handleExportDocx(selectedLessonsForExport)}
            disabled={selectedLessonIds.length === 0}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-indigo-400 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-40"
            title="Xuất file Word (.docx) gộp tất cả các bài đã chọn"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Xuất Word gộp ({selectedLessonIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
            disabled={selectedLessonIds.length === 0}
            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-40"
            title="Gộp nội dung các bài đã chọn vào một tài liệu PDF duy nhất"
          >
            <Printer className="w-3.5 h-3.5 text-amber-200" />
            <span>Xuất tổng hợp PDF ({selectedLessonIds.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Directory with ALWAYS-VISIBLE checkboxes */}
        <div className="lg:col-span-5 space-y-3 bg-white rounded-xl border border-slate-200 p-3 max-h-[800px] overflow-y-auto">
          {/* Directory Header with Quick Batch Actions & Master Checkbox */}
          <div className="space-y-2 border-b border-slate-100 pb-2.5">
            {/* Master Select All Checkbox + Direct 'Xuất tổng hợp' Button */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/80 border border-teal-200">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeFilteredSelected;
                  }}
                  onChange={toggleSelectAllFiltered}
                  className="w-4.5 h-4.5 rounded border-teal-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                />
                <span className="text-xs font-bold text-teal-950">
                  Chọn tất cả ({filteredLessons.length} bài)
                </span>
              </label>

              <button
                type="button"
                onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
                disabled={selectedLessonIds.length === 0}
                className="px-2.5 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg text-2xs font-extrabold flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-40 transition-all"
                title="Gộp nội dung các bài đã tick chọn thành 1 tài liệu PDF duy nhất"
              >
                <Printer className="w-3 h-3 text-amber-200" />
                <span>Xuất tổng hợp ({selectedLessonIds.length})</span>
              </button>
            </div>

            {/* Quick Filter & Preset Selection Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap text-2xs">
              <span className="text-slate-400 font-medium">Gợi ý:</span>
              <button
                type="button"
                onClick={() => handleSelectPresetPair(['L_HOA_03', 'L_HOA_04'])}
                className="px-2 py-0.5 bg-teal-100/70 text-teal-950 border border-teal-200 rounded font-bold hover:bg-teal-200 cursor-pointer"
                title="Chọn nhanh cặp Bài 3 & Bài 4 (Hóa học)"
              >
                + Gộp Bài 3 & 4
              </button>
              <button
                type="button"
                onClick={() => handleSelectDomainBatch('HOA_HOC')}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium hover:bg-slate-200 cursor-pointer"
              >
                Hóa học (5 bài)
              </button>
              <button
                type="button"
                onClick={() => handleSelectDomainBatch('VAT_LI')}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium hover:bg-slate-200 cursor-pointer"
              >
                Vật lí (5 bài)
              </button>
              <button
                type="button"
                onClick={() => handleSelectDomainBatch('SINH_HOC')}
                className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium hover:bg-slate-200 cursor-pointer"
              >
                Sinh học (5 bài)
              </button>
              {selectedLessonIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2 py-0.5 text-rose-600 hover:text-rose-800 font-semibold cursor-pointer ml-auto"
                >
                  Bỏ chọn ({selectedLessonIds.length})
                </button>
              )}
            </div>
          </div>

          {/* Lesson List Items with Native Checkboxes and View Details */}
          <div className="space-y-1.5">
            {filteredLessons.map((lesson) => {
              const isActive = lesson.id === activeLesson.id;
              const isSelected = selectedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`w-full p-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2.5 border ${
                    isSelected
                      ? 'bg-teal-50/95 border-teal-400 text-teal-950 font-medium shadow-2xs ring-1 ring-teal-300'
                      : isActive
                      ? 'bg-slate-50 border-slate-300 text-slate-900 ring-1 ring-slate-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {/* Left: Native Checkbox with explicit label */}
                  <label
                    htmlFor={`lesson-cb-${lesson.id}`}
                    className="p-1 -m-1 rounded hover:bg-teal-100/70 transition-colors cursor-pointer shrink-0 flex items-center select-none"
                    onClick={(e) => e.stopPropagation()}
                    title={isSelected ? `Bỏ chọn Bài ${lesson.lessonNumber}` : `Tick chọn Bài ${lesson.lessonNumber} để gộp vào PDF`}
                  >
                    <input
                      id={`lesson-cb-${lesson.id}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLessonSelection(lesson.id)}
                      className="w-4.5 h-4.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer accent-teal-600"
                    />
                  </label>

                  {/* Middle: Lesson Details (clicks to view on the right pane) */}
                  <div
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className="flex-1 min-w-0 cursor-pointer text-left py-0.5"
                    title="Bấm để xem nội dung chi tiết bài này bên phải"
                  >
                    <div className="flex items-center gap-1.5 text-2xs font-mono">
                      <span className="font-bold text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded">
                        Bài {lesson.lessonNumber}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500 font-sans truncate font-medium">
                        {lesson.chapterTitle}
                      </span>
                    </div>
                    <div className="font-bold truncate text-slate-900 mt-0.5">
                      {lesson.title}
                    </div>
                  </div>

                  {/* Right: Quick Action Badge */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isSelected ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonSelection(lesson.id);
                        }}
                        className="text-2xs font-extrabold text-teal-800 bg-teal-100/90 hover:bg-teal-200 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                        title="Bấm để bỏ chọn bài này khỏi danh sách gộp"
                      >
                        ✓ Đã chọn
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addLessonToSelection(lesson.id);
                        }}
                        className="text-2xs text-slate-600 hover:text-teal-700 hover:bg-teal-50 px-2 py-0.5 rounded-md border border-slate-200 cursor-pointer transition-colors"
                        title="Thêm bài này vào danh sách gộp"
                      >
                        + Gộp
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary Bar in Left Column with Prominent 'Xuất tổng hợp' */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 pt-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-teal-900">
                <CheckSquare className="w-4 h-4 text-teal-600" />
                <span>Đã chọn: {selectedLessonIds.length} bài</span>
              </span>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="text-2xs text-teal-700 hover:underline font-bold cursor-pointer"
              >
                Cấu hình & xem trước →
              </button>
            </div>

            {/* Main Primary Action: 'Xuất tổng hợp' */}
            <button
              type="button"
              onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
              disabled={selectedLessonIds.length === 0}
              className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-40 transition-all"
              title="Gộp nội dung các bài đã chọn vào một tài liệu PDF duy nhất"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>Xuất tổng hợp ({selectedLessonIds.length} bài PDF)</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-2xs">
              <button
                type="button"
                onClick={() => handleExportDocx(selectedLessonsForExport)}
                disabled={selectedLessonIds.length === 0}
                className="py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
                title="Xuất file Word (.docx) gộp tất cả bài đã chọn"
              >
                <Download className="w-3 h-3 text-indigo-600" />
                <span>Xuất Word (.doc)</span>
              </button>
              <button
                type="button"
                onClick={handleClearSelection}
                disabled={selectedLessonIds.length === 0}
                className="py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg font-medium flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Bỏ chọn hết</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: CORE Knowledge Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Header info with zero-pill metadata discipline & quick export */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2 text-2xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-teal-700">
                    {activeLesson.domain === 'HOA_HOC' ? 'Hóa học' : activeLesson.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeLesson.chapterTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>Nguồn: {activeLesson.curriculum} (SGK / SGV)</span>
                </div>

                {/* Quick lesson action buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopySummary(activeLesson)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    title="Sao chép tóm tắt bài học"
                  >
                    {copiedNotification ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportDocx([activeLesson])}
                    className="px-2.5 py-1 text-2xs font-semibold text-slate-700 hover:text-indigo-900 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    title="Xuất riêng file Word (.docx) bài học này"
                  >
                    <Download className="w-3 h-3 text-indigo-600" />
                    <span>Word riêng bài này</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrintPdf([activeLesson])}
                    className="px-2.5 py-1 text-2xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    title="In riêng PDF A4 bài học này"
                  >
                    <Printer className="w-3 h-3 text-teal-600" />
                    <span>In PDF riêng</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Bài {activeLesson.lessonNumber}: {activeLesson.title}
                </h2>
                <button
                  type="button"
                  onClick={() => markLessonComplete(activeLesson.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu đã học'}</span>
                </button>
              </div>

              {/* Dedicated Combined Export Banner for Active Lesson */}
              <div
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors ${
                  isCurrentLessonSelected
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLessonSelection(activeLesson.id)}
                    className="cursor-pointer"
                  >
                    {isCurrentLessonSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <span className="font-semibold">
                    {isCurrentLessonSelected
                      ? `✓ Bài ${activeLesson.lessonNumber} ĐÃ ĐƯỢC CHỌN vào bộ tài liệu gộp.`
                      : `Chưa chọn Bài ${activeLesson.lessonNumber} vào danh sách gộp.`}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => toggleLessonSelection(activeLesson.id)}
                    className={`px-2.5 py-1 rounded text-2xs font-bold cursor-pointer transition-colors ${
                      isCurrentLessonSelected
                        ? 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isCurrentLessonSelected ? 'Bỏ chọn bài này' : '+ Thêm bài này vào gộp'}
                  </button>
                </div>
              </div>
            </div>

            {/* 1. Em cần biết (Key Points) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span>1. Em Cần Biết (Kiến thức cốt lõi)</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {activeLesson.summary.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                    <span className="leading-relaxed"><MathView math={point} /></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Em cần hiểu (Scientific Concepts & Misconceptions) */}
            {relatedConcepts.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>2. Khái Niệm Then Chốt & Bản Chất Khoa Học</span>
                </h3>
                <div className="space-y-3">
                  {relatedConcepts.map((concept) => (
                    <div key={concept.id} className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-950">{concept.term}</span>
                        <span className="text-2xs text-amber-700 font-medium">Bản quyền SGK</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-serif">
                        "<MathView math={concept.definition} />"
                      </p>

                      {/* Common Misconceptions */}
                      {concept.commonMisconceptions.length > 0 && (
                        <div className="pt-2 border-t border-amber-200/40 text-2xs space-y-1">
                          <span className="font-semibold text-rose-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Điểm học sinh rất dễ nhầm lẫn:</span>
                          </span>
                          {concept.commonMisconceptions.map((misc, mIdx) => (
                            <p key={mIdx} className="text-slate-600 pl-4 list-disc">
                              • <MathView math={misc} />
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Real world hook */}
                      <div className="text-2xs text-slate-500 pt-1">
                        <span className="font-semibold text-slate-700">Trong đời sống: </span>
                        <MathView math={concept.realWorldHook} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Công thức liên quan */}
            {relatedFormulas.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-indigo-600" />
                  <span>3. Công Thức Trọng Tâm Cần Nhớ</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedFormulas.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => navigate({ tab: 'cong_thuc', id: f.id })}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group space-y-2"
                    >
                      <div className="flex items-center justify-between text-2xs text-slate-500">
                        <span className="font-semibold text-slate-700">{f.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="text-base font-bold text-indigo-950 py-1 overflow-x-auto">
                        <MathView math={f.formulaLatex} />
                      </div>
                      {f.derivedForms && f.derivedForms.length > 0 && (
                        <div className="text-2xs text-slate-500 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-slate-600">Hệ quả:</span>
                          {f.derivedForms.map((df, dfIdx) => (
                            <span key={dfIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-medium">
                              <MathView math={df} />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Action Bar: Practice & Experiment shortcuts */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                Sẵn sàng kiểm tra năng lực bài này?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate({ tab: 'bai_tap', context: { lessonId: activeLesson.id } })}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Luyện bài tập</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ tab: 'thi_nghiem', context: { lessonId: activeLesson.id } })}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Xem thí nghiệm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FIXED FLOATING ACTION BAR FOR BATCH EXPORT ================= */}
      {selectedLessonIds.length > 0 && !isExportModalOpen && (
        <div className="fixed bottom-4 inset-x-3 sm:inset-x-6 max-w-4xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-200 print:hidden">
          <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-teal-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-teal-200 flex items-center gap-2">
                  <span>Đã chọn {selectedLessonIds.length} bài học gộp:</span>
                  <span className="text-2xs bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30 font-bold">
                    Sẵn sàng xuất PDF
                  </span>
                </div>
                <div className="text-2xs text-slate-300 truncate mt-0.5 font-medium">
                  {selectedLessonsForExport.map((l) => `Bài ${l.lessonNumber}`).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
                className="px-4 py-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="Gộp nội dung các bài đã chọn vào một tài liệu PDF duy nhất"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Xuất tổng hợp (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportDocx(selectedLessonsForExport)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Xuất file Word DOCX gộp"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Xuất</span> Word
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalActiveTab('PREVIEW');
                  setIsExportModalOpen(true);
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Xem trước nội dung gộp"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem trước</span>
              </button>

              <button
                type="button"
                onClick={handleClearSelection}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Bỏ chọn tất cả"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XUẤT TƯ LIỆU GỘP DOCX / PDF ================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Xuất Tư Liệu Lý Thuyết Gộp Nhiều Bài Học (Word DOCX / PDF A4)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tick chọn bất kỳ bài học nào (Bài 3, Bài 4...) để gộp chung vào 1 file tài liệu duy nhất.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-white text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalActiveTab('SELECT')}
                className={`py-3 px-3 border-b-2 transition-colors cursor-pointer ${
                  modalActiveTab === 'SELECT'
                    ? 'border-teal-600 text-teal-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Chọn Bài Học & Cấu Hình Gộp ({selectedLessonIds.length} bài đã chọn)
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab('PREVIEW')}
                className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  modalActiveTab === 'PREVIEW'
                    ? 'border-teal-600 text-teal-800 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Xem Trước Tài Liệu Gộp ({selectedLessonsForExport.length} bài)</span>
              </button>
            </div>

            {/* Modal Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {modalActiveTab === 'SELECT' ? (
                <div className="space-y-6">
                  {/* Selected Lessons Chips Display */}
                  <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-teal-950">
                      <span>Các bài sẽ gộp trong tài liệu ({selectedLessonsForExport.length} bài):</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectPresetPair(['L_HOA_03', 'L_HOA_04'])}
                          className="text-2xs bg-white px-2 py-0.5 rounded border border-teal-300 text-teal-900 font-bold hover:bg-teal-100 cursor-pointer"
                        >
                          + Gộp Bài 3 & 4
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectDomainBatch('HOA_HOC')}
                          className="text-2xs bg-white px-2 py-0.5 rounded border border-teal-300 text-teal-900 font-semibold hover:bg-teal-100 cursor-pointer"
                        >
                          Cả bộ Hóa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectDomainBatch('ALL')}
                          className="text-2xs bg-teal-600 px-2 py-0.5 rounded text-white font-bold hover:bg-teal-500 cursor-pointer"
                        >
                          Tất cả 15 bài
                        </button>
                        <button
                          type="button"
                          onClick={handleClearSelection}
                          className="text-2xs text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Bỏ chọn hết
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedLessonsForExport.length === 0 ? (
                        <div className="text-xs text-rose-600 font-medium">
                          ⚠️ Chưa chọn bài nào! Vui lòng tick chọn ít nhất 1 bài bên dưới để xuất tư liệu.
                        </div>
                      ) : (
                        selectedLessonsForExport.map((l) => (
                          <span
                            key={l.id}
                            className="bg-white px-2.5 py-1 rounded-md border border-teal-300 text-xs font-semibold text-teal-950 flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>Bài {l.lessonNumber}: {l.title}</span>
                            <button
                              type="button"
                              onClick={() => removeLessonFromSelection(l.id)}
                              className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                              title="Bỏ bài này"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Lesson Checklist Grid */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Bấm vào từng bài để thêm hoặc bớt khỏi danh sách gộp:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                      {LESSONS.map((l) => {
                        const checked = selectedLessonIds.includes(l.id);
                        return (
                          <div
                            key={l.id}
                            onClick={() => toggleLessonSelection(l.id)}
                            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                              checked
                                ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-400'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-0.5 w-4 h-4 text-teal-600 rounded cursor-pointer shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-2xs text-teal-800 font-mono">
                                Bài {l.lessonNumber} · {l.domain === 'HOA_HOC' ? 'Hóa học' : l.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'}
                              </div>
                              <div className="truncate font-semibold text-slate-900 mt-0.5">
                                {l.title}
                              </div>
                              <div className="text-2xs text-slate-400 truncate mt-0.5">
                                {l.chapterTitle}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Content Configuration */}
                  <div className="space-y-3 pt-2 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Nội dung bao gồm trong tài liệu gộp:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeSummary}
                          onChange={(e) =>
                            setExportConfig({ ...exportConfig, includeSummary: e.target.checked })
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">1. Kiến thức cốt lõi (Em cần biết)</div>
                          <div className="text-2xs text-slate-500">Các gạch đầu dòng trọng tâm nhất bài</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeConcepts}
                          onChange={(e) =>
                            setExportConfig({ ...exportConfig, includeConcepts: e.target.checked })
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">2. Khái niệm & Bản chất khoa học</div>
                          <div className="text-2xs text-slate-500">Định nghĩa chuẩn SGK và từ khóa chính</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeFormulas}
                          onChange={(e) =>
                            setExportConfig({ ...exportConfig, includeFormulas: e.target.checked })
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">3. Bảng công thức & Biến đổi đại lượng</div>
                          <div className="text-2xs text-slate-500">Công thức chính và hệ quả chuyển vế</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeMisconceptions}
                          onChange={(e) =>
                            setExportConfig({
                              ...exportConfig,
                              includeMisconceptions: e.target.checked
                            })
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">4. Cảnh báo ngộ nhận & sai lầm</div>
                          <div className="text-2xs text-slate-500">Các bẫy đề thi và lỗi học sinh hay mắc</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={exportConfig.includeRealWorld}
                          onChange={(e) =>
                            setExportConfig({ ...exportConfig, includeRealWorld: e.target.checked })
                          }
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">5. Vận dụng thực tế đời sống</div>
                          <div className="text-2xs text-slate-500">Liên hệ hiện tượng tự nhiên và đời sống thực tế</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Print Typography Size */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-slate-600 font-medium">Cỡ chữ văn bản tài liệu:</span>
                    <div className="flex items-center gap-2">
                      {(['10pt', '11pt', '12pt'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setExportConfig({ ...exportConfig, fontSize: size })}
                          className={`px-2.5 py-1 rounded text-2xs font-semibold cursor-pointer border ${
                            exportConfig.fontSize === size
                              ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {size} {size === '11pt' ? '(Chuẩn A4)' : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* LIVE PREVIEW TAB */
                <div className="space-y-4">
                  <div className="bg-amber-50 text-amber-900 border border-amber-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Xem trước nội dung gộp của {selectedLessonsForExport.length} bài. Mỗi bài học được phân mục rõ ràng, công thức toán học hiển thị chuẩn xác.
                    </span>
                  </div>

                  <div className="bg-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-inner">
                    <div className="bg-white p-6 sm:p-10 rounded-xl shadow-md border border-slate-200 max-w-2xl mx-auto font-serif text-slate-800 space-y-6">
                      <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                        <div className="text-2xs uppercase tracking-widest text-slate-500">
                          Bộ Giáo Dục và Đào Tạo · Chương Trình GDPT 2018
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 uppercase">
                          Tài Liệu Lý Thuyết Cốt Lõi KHTN 8 (Gộp Các Bài)
                        </h2>
                        <div className="text-2xs text-slate-500 italic">
                          Tổng số bài: {selectedLessonsForExport.length} bài ({selectedLessonsForExport.map((l) => `Bài ${l.lessonNumber}`).join(', ')}) · Ngày tạo: {new Date().toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      {selectedLessonsForExport.length === 0 ? (
                        <div className="text-center py-10 text-rose-500 text-xs italic">
                          Chưa có bài học nào được chọn. Vui lòng quay lại tab 1 để chọn các bài (Bài 3, Bài 4...).
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {selectedLessonsForExport.map((lesson) => {
                            const concepts = CONCEPTS.filter((c) => c.lessonId === lesson.id);
                            const formulas = FORMULAS.filter((f) => f.lessonId === lesson.id);
                            return (
                              <div key={lesson.id} className="space-y-3 border-b-2 border-slate-200 pb-6 last:border-0">
                                <div>
                                  <div className="text-2xs text-teal-800 font-sans font-bold">
                                    {lesson.domain === 'HOA_HOC' ? 'Hóa học' : lesson.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'} · {lesson.chapterTitle}
                                  </div>
                                  <h3 className="text-base font-bold text-slate-900">
                                    BÀI {lesson.lessonNumber}: {lesson.title}
                                  </h3>
                                </div>

                                {exportConfig.includeSummary && (
                                  <div className="space-y-1.5 text-xs text-slate-700">
                                    <div className="font-sans font-bold text-2xs uppercase text-slate-500">
                                      1. Em cần biết:
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {lesson.summary.map((pt, pIdx) => (
                                        <li key={pIdx}>
                                          <MathView math={pt} />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {exportConfig.includeConcepts && concepts.length > 0 && (
                                  <div className="space-y-2 text-xs">
                                    <div className="font-sans font-bold text-2xs uppercase text-slate-500">
                                      2. Khái niệm then chốt:
                                    </div>
                                    {concepts.map((c) => (
                                      <div key={c.id} className="bg-amber-50/50 p-2.5 rounded border border-amber-200/50 space-y-1">
                                        <div className="font-sans font-bold text-slate-900">✦ {c.term}</div>
                                        <p className="italic text-slate-700">"{c.definition}"</p>
                                        {exportConfig.includeMisconceptions && c.commonMisconceptions.length > 0 && (
                                          <div className="text-2xs text-rose-700 pt-1 font-sans">
                                            ⚠️ Cần tránh: {c.commonMisconceptions.join(' ')}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {exportConfig.includeFormulas && formulas.length > 0 && (
                                  <div className="space-y-2 text-xs">
                                    <div className="font-sans font-bold text-2xs uppercase text-slate-500">
                                      3. Công thức trọng tâm:
                                    </div>
                                    {formulas.map((f) => (
                                      <div key={f.id} className="bg-indigo-50/50 p-2.5 rounded border border-indigo-200/50 text-center">
                                        <div className="font-sans font-bold text-slate-800 text-2xs">{f.name}</div>
                                        <div className="font-bold text-indigo-950 py-1 font-sans">
                                          <MathView math={f.formulaLatex} />
                                        </div>
                                        <div className="text-2xs text-slate-500">{f.description}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-teal-900">
                  Đã chọn {selectedLessonsForExport.length} bài học:
                </span>{' '}
                <span className="text-slate-500">
                  {selectedLessonsForExport.map((l) => `Bài ${l.lessonNumber}`).join(', ') || 'Chưa chọn'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="button"
                  onClick={() => handleExportDocx(selectedLessonsForExport)}
                  disabled={selectedLessonsForExport.length === 0}
                  className="px-4 py-2 bg-white hover:bg-indigo-50 text-slate-800 hover:text-indigo-950 border border-slate-300 hover:border-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  title="Tải về file Microsoft Word (.docx) gộp tất cả các bài đã chọn"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Xuất File Word Gộp ({selectedLessonsForExport.length} bài)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleExportTongHopPdf(selectedLessonsForExport)}
                  disabled={selectedLessonsForExport.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  title="Gộp nội dung các bài đã chọn vào một tài liệu PDF duy nhất"
                >
                  <Printer className="w-4 h-4 text-amber-200" />
                  <span>Xuất tổng hợp PDF ({selectedLessonsForExport.length} bài)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= DEDICATED PRINT CONTAINER (HIDDEN ON SCREEN, SHOWN IN PRINT) ================= */}
      {(() => {
        const lessonsForPrint = printLessons.length > 0 ? printLessons : selectedLessonsForExport;
        return (
          <div id="printable-theory-area" className="hidden print:block font-serif text-slate-900 leading-relaxed">
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6 space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-600 font-sans font-semibold">
                BỘ GIÁO DỤC VÀ ĐÀO TẠO · CHƯƠNG TRÌNH GDPT 2018
              </div>
              <h1 className="text-2xl font-bold uppercase text-slate-950 font-sans">
                TÀI LIỆU LÝ THUYẾT CỐT LÕI KHOA HỌC TỰ NHIÊN 8
              </h1>
              <div className="text-xs text-slate-600 italic">
                Bộ sách chuẩn hóa: Kết Nối Tri Thức & Cánh Diều · Ngày in: {new Date().toLocaleDateString('vi-VN')}
                <br />
                <strong>Danh sách bài học được gộp ({lessonsForPrint.length} bài):</strong>{' '}
                {lessonsForPrint.map((l) => `Bài ${l.lessonNumber}: ${l.title}`).join(' · ')}
              </div>
            </div>

            <div className="space-y-8">
              {lessonsForPrint.map((lesson) => {
            const concepts = CONCEPTS.filter((c) => c.lessonId === lesson.id);
            const formulas = FORMULAS.filter((f) => f.lessonId === lesson.id);

            return (
              <div key={lesson.id} className="avoid-break space-y-4 border-b-2 border-slate-300 pb-8 mb-8 print-page-break">
                <div>
                  <div className="text-xs font-sans font-bold text-teal-800 uppercase">
                    Bài {lesson.lessonNumber} · {lesson.domain === 'HOA_HOC' ? 'Hóa học' : lesson.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'} · {lesson.chapterTitle}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 font-sans mt-0.5 uppercase">
                    BÀI {lesson.lessonNumber}: {lesson.title}
                  </h2>
                </div>

                {exportConfig.includeSummary && (
                  <div className="space-y-1.5 text-xs">
                    <div className="font-sans font-bold text-xs uppercase text-slate-800">
                      1. Kiến thức cốt lõi (Em cần biết):
                    </div>
                    <ul className="list-disc pl-5 space-y-1">
                      {lesson.summary.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <MathView math={pt} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exportConfig.includeConcepts && concepts.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <div className="font-sans font-bold text-xs uppercase text-slate-800">
                      2. Khái niệm then chốt & Bản chất khoa học:
                    </div>
                    {concepts.map((c) => (
                      <div key={c.id} className="p-3 bg-slate-50 border border-slate-300 rounded space-y-1">
                        <div className="font-sans font-bold text-slate-900">✦ {c.term}</div>
                        <p className="italic text-slate-800">"{c.definition}"</p>
                        {exportConfig.includeMisconceptions && c.commonMisconceptions.length > 0 && (
                          <div className="text-2xs text-rose-800 pt-1 font-sans font-medium">
                            ⚠️ Cần tránh nhầm lẫn: {c.commonMisconceptions.join(' ')}
                          </div>
                        )}
                        {exportConfig.includeRealWorld && c.realWorldHook && (
                          <div className="text-2xs text-amber-900 font-sans">
                            🌍 Đời sống: {c.realWorldHook}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {exportConfig.includeFormulas && formulas.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <div className="font-sans font-bold text-xs uppercase text-slate-800">
                      3. Bảng công thức trọng tâm:
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {formulas.map((f) => (
                        <div key={f.id} className="p-3 bg-slate-50 border border-slate-300 rounded text-center">
                          <div className="font-sans font-bold text-xs text-slate-800">{f.name}</div>
                          <div className="font-bold text-indigo-950 py-1 font-sans text-sm">
                            <MathView math={f.formulaLatex} />
                          </div>
                          <div className="text-2xs text-slate-600 font-sans">{f.description}</div>
                          {f.derivedForms && f.derivedForms.length > 0 && (
                            <div className="text-2xs text-slate-500 font-sans pt-1">
                              Biến đổi: {f.derivedForms.join(' | ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center text-2xs text-slate-500 border-t border-slate-300 pt-3 mt-6 font-sans">
          Trợ Lý Tự Học KHTN 8 — Tài liệu lưu hành nội bộ phục vụ học tập & giảng dạy.
        </div>
      </div>
    );
  })()}
    </div>
  );
};
