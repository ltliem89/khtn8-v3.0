import React, { useState, useMemo } from 'react';
import { LESSONS } from '../data/curriculum';
import { FORMULAS } from '../data/formulas';
import { EXERCISES } from '../data/exercises';
import { REAL_WORLD_ITEMS } from '../data/realWorld';
import { EXPERIMENTS } from '../data/experiments';
import { MathView } from '../components/MathView';
import { SubjectDomain } from '../types';
import {
  Printer,
  FileText,
  Download,
  Eye,
  Settings,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  BookOpen,
  Filter,
  Type,
  Layout,
  CheckSquare,
  Square
} from 'lucide-react';

type ExportPreset = 'KNOWLEDGE_SHEET' | 'REVISION_SHEET' | 'FULL_NOTEBOOK' | 'TEACHER_PACK';

export const XuatBanModule: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset>('REVISION_SHEET');
  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'ALL'>('ALL');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('ALL');

  // Options toggles
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [includeExercises, setIncludeExercises] = useState(true);
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [includeRealWorld, setIncludeRealWorld] = useState(true);
  const [includeExperiments, setIncludeExperiments] = useState(true);
  const [includeSources, setIncludeSources] = useState(true);
  const [printFontSize, setPrintFontSize] = useState<'10pt' | '11pt' | '12pt'>('11pt');

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return LESSONS.filter((l) => {
      if (selectedDomain !== 'ALL' && l.domain !== selectedDomain) return false;
      if (selectedLessonId !== 'ALL' && l.id !== selectedLessonId) return false;
      return true;
    });
  }, [selectedDomain, selectedLessonId]);

  const lessonIds = useMemo(() => new Set(filteredLessons.map((l) => l.id)), [filteredLessons]);

  const filteredFormulas = useMemo(() => {
    if (!includeFormulas) return [];
    return FORMULAS.filter((f) => {
      if (selectedDomain !== 'ALL' && f.domain !== selectedDomain) return false;
      if (selectedLessonId !== 'ALL') return f.lessonId === selectedLessonId;
      return lessonIds.has(f.lessonId);
    });
  }, [includeFormulas, selectedDomain, selectedLessonId, lessonIds]);

  const filteredExercises = useMemo(() => {
    if (!includeExercises) return [];
    return EXERCISES.filter((ex) => {
      if (selectedDomain !== 'ALL' && ex.domain !== selectedDomain) return false;
      if (selectedLessonId !== 'ALL') return ex.lessonId === selectedLessonId;
      return lessonIds.has(ex.lessonId);
    });
  }, [includeExercises, selectedDomain, selectedLessonId, lessonIds]);

  const filteredRealWorld = useMemo(() => {
    if (!includeRealWorld) return [];
    return REAL_WORLD_ITEMS.filter((rw) => {
      if (selectedDomain !== 'ALL' && rw.domain !== selectedDomain) return false;
      if (selectedLessonId !== 'ALL') return rw.connectedLessonIds.includes(selectedLessonId);
      return rw.connectedLessonIds.some((id) => lessonIds.has(id));
    });
  }, [includeRealWorld, selectedDomain, selectedLessonId, lessonIds]);

  const filteredExperiments = useMemo(() => {
    if (!includeExperiments) return [];
    return EXPERIMENTS.filter((exp) => {
      if (selectedDomain !== 'ALL' && exp.domain !== selectedDomain) return false;
      if (selectedLessonId !== 'ALL') return exp.lessonId === selectedLessonId;
      return lessonIds.has(exp.lessonId);
    });
  }, [includeExperiments, selectedDomain, selectedLessonId, lessonIds]);

  // Handle preset change
  const applyPreset = (preset: ExportPreset) => {
    setSelectedPreset(preset);
    if (preset === 'KNOWLEDGE_SHEET') {
      setIncludeFormulas(true);
      setIncludeExercises(false);
      setIncludeAnswers(false);
      setIncludeRealWorld(true);
      setIncludeExperiments(false);
      setIncludeSources(true);
    } else if (preset === 'REVISION_SHEET') {
      setIncludeFormulas(true);
      setIncludeExercises(true);
      setIncludeAnswers(false);
      setIncludeRealWorld(true);
      setIncludeExperiments(false);
      setIncludeSources(true);
    } else if (preset === 'FULL_NOTEBOOK') {
      setIncludeFormulas(true);
      setIncludeExercises(true);
      setIncludeAnswers(true);
      setIncludeRealWorld(true);
      setIncludeExperiments(true);
      setIncludeSources(true);
    } else if (preset === 'TEACHER_PACK') {
      setIncludeFormulas(true);
      setIncludeExercises(true);
      setIncludeAnswers(true);
      setIncludeRealWorld(true);
      setIncludeExperiments(true);
      setIncludeSources(true);
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Generate downloadable DOCX compatible HTML blob
  const handleDownloadDocx = () => {
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>KHTN 8 - Tai lieu on tap chuan A4</title>
        <style>
          body { font-family: 'Times New Roman', 'Noto Serif', serif; font-size: ${printFontSize}; line-height: 1.5; color: #000; }
          h1 { font-size: 18pt; text-align: center; color: #0f172a; margin-bottom: 6pt; }
          h2 { font-size: 14pt; color: #0f766e; border-bottom: 1pt solid #0f766e; margin-top: 14pt; padding-bottom: 3pt; }
          h3 { font-size: 12pt; color: #1e293b; margin-top: 10pt; }
          .meta { font-size: 10pt; text-align: center; color: #64748b; margin-bottom: 16pt; }
          .formula-box { background: #f8fafc; border: 1pt solid #cbd5e1; padding: 6pt 10pt; margin: 6pt 0; }
          .exercise-box { margin-bottom: 10pt; padding-bottom: 6pt; border-bottom: 0.5pt dashed #cbd5e1; }
          .answer { color: #047857; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>TÀI LIỆU KHOA HỌC TỰ NHIÊN 8</h1>
        <div class="meta">Bộ Giáo Dục và Đào Tạo · Chương Trình GDPT 2018 · Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</div>
        ${document.getElementById('printable-preview-area')?.innerHTML || ''}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KHTN8_TaiLieu_${selectedPreset}_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Controller Panel - Hidden in Print */}
      <div className="no-print space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                Chuẩn A4 & Unicode NFC
              </span>
              <span className="text-xs text-slate-500 font-medium">
                17_DOCUMENT_EXPORT_RENDER_DEEP
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Trung Tâm Xuất Bản & In Ấn Tài Liệu KHTN 8
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-4xl">
              Tạo tài liệu học tập, phiếu ôn tập, sổ tay công thức chuẩn khổ giấy A4, không lỗi font tiếng Việt, công thức KaTeX sắc nét, hỗ trợ in trực tiếp hoặc tải file DOCX.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>In Ngay (Khổ A4)</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadDocx}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Tải file Word (.doc)</span>
            </button>
          </div>
        </div>

        {/* 4 Presets Selector */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Chọn mẫu tài liệu in ấn (Preset):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'KNOWLEDGE_SHEET' as ExportPreset,
                title: 'A. Tờ kiến thức cốt lõi',
                desc: 'Định nghĩa, công thức, đơn vị, sơ đồ, lỗi thường gặp và ví dụ thực tế.'
              },
              {
                id: 'REVISION_SHEET' as ExportPreset,
                title: 'B. Phiếu ôn tập & bài tập',
                desc: 'Kiến thức cốt lõi kèm ngân hàng câu hỏi tự luyện cho học sinh (ẩn đáp án).'
              },
              {
                id: 'FULL_NOTEBOOK' as ExportPreset,
                title: 'C. Sổ tay khoa học đầy đủ',
                desc: 'Toàn bộ bài học, tình huống thực tế, thí nghiệm ảo và lời giải bài tập.'
              },
              {
                id: 'TEACHER_PACK' as ExportPreset,
                title: 'D. Gói giáo viên chuyên sâu',
                desc: 'Mục tiêu YCCD, bài tập kèm đáp án chi tiết và phân tích bẫy nhận thức.'
              }
            ].map((p) => {
              const isActive = selectedPreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50/90 border-teal-500 text-teal-950 font-bold shadow-2xs ring-1 ring-teal-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{p.title}</div>
                  <div className="text-2xs text-slate-500 mt-1 font-normal leading-relaxed">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Options Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Domain & Lesson Filters */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Phạm vi nội dung:
            </span>
            <div className="space-y-2">
              <div>
                <label className="text-2xs text-slate-500 block mb-1">Phân môn:</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    setSelectedDomain(e.target.value as any);
                    setSelectedLessonId('ALL');
                  }}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">Tất cả phân môn (Hóa, Lí, Sinh)</option>
                  <option value="HOA_HOC">Hóa học (Chất & Biến đổi)</option>
                  <option value="VAT_LI">Vật lí (Năng lượng & Lực)</option>
                  <option value="SINH_HOC">Sinh học (Cơ thể người & Môi trường)</option>
                </select>
              </div>

              <div>
                <label className="text-2xs text-slate-500 block mb-1">Bài học cụ thể:</label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">Tất cả các bài trong phạm vi</option>
                  {LESSONS.filter((l) => selectedDomain === 'ALL' || l.domain === selectedDomain).map((l) => (
                    <option key={l.id} value={l.id}>
                      Bài {l.lessonNumber}: {l.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Component Toggles */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Thành phần xuất bản:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeFormulas}
                  onChange={(e) => setIncludeFormulas(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Bảng công thức</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeExercises}
                  onChange={(e) => setIncludeExercises(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Ngân hàng bài tập</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeAnswers}
                  onChange={(e) => setIncludeAnswers(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className={includeAnswers ? 'font-bold text-emerald-700' : ''}>
                  Đáp án & Lời giải
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeRealWorld}
                  onChange={(e) => setIncludeRealWorld(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Tình huống thực tế</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeExperiments}
                  onChange={(e) => setIncludeExperiments(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Thí nghiệm mô phỏng</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeSources}
                  onChange={(e) => setIncludeSources(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Nguồn SGK / SGV</span>
              </label>
            </div>
          </div>

          {/* Typography & Stats */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              3. Cỡ chữ in & Thống kê:
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600">Cỡ chữ văn bản:</span>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
                {(['10pt', '11pt', '12pt'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPrintFontSize(sz)}
                    className={`px-2 py-1 rounded font-semibold cursor-pointer ${
                      printFontSize === sz ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Số bài học được chọn:</span>
                <strong className="text-slate-900 font-bold">{filteredLessons.length} bài</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Công thức khoa học:</span>
                <strong className="text-slate-900 font-bold">{filteredFormulas.length} công thức</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Bài tập tự luyện:</span>
                <strong className="text-slate-900 font-bold">{filteredExercises.length} bài</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tình huống thực tế:</span>
                <strong className="text-slate-900 font-bold">{filteredRealWorld.length} tình huống</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Preview Container (Standard A4 Paper Sheet) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-6 sm:p-10 max-w-4xl mx-auto print-container">
        <div id="printable-preview-area" className="space-y-8" style={{ fontSize: printFontSize }}>
          {/* Header Trang In */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              BỘ GIÁO DỤC VÀ ĐÀO TẠO · CHƯƠNG TRÌNH GIÁO DỤC PHỔ THÔNG 2018
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              TÀI LIỆU KHOA HỌC TỰ NHIÊN 8
            </h1>
            <div className="text-sm font-semibold text-teal-800">
              {selectedPreset === 'KNOWLEDGE_SHEET' && 'TỜ TỔNG HỢP KIẾN THỨC CỐT LÕI'}
              {selectedPreset === 'REVISION_SHEET' && 'PHIẾU HỌC TẬP & ÔN LUYỆN BÀI TẬP TRỌNG TÂM'}
              {selectedPreset === 'FULL_NOTEBOOK' && 'SỔ TAY KHOA HỌC ĐẦY ĐỦ CÓ ĐÁP ÁN'}
              {selectedPreset === 'TEACHER_PACK' && 'TÀI LIỆU GIÁO VIÊN — HƯỚNG DẪN & ĐÁP ÁN CHI TIẾT'}
            </div>
            <div className="text-2xs text-slate-500">
              Nguồn dữ liệu: SGK & SGV Kết Nối Tri Thức Với Cuộc Sống · Cánh Diều · Xuất ngày: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>

          {/* Section: Bảng Công Thức (Nếu chọn) */}
          {includeFormulas && filteredFormulas.length > 0 && (
            <div className="space-y-4 avoid-break">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5">
                <span className="font-bold text-base text-slate-900 uppercase tracking-wider">
                  I. BẢNG CÔNG THỨC KHOA HỌC CHUẨN
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredFormulas.map((f, fIdx) => (
                  <div
                    key={f.id}
                    className="p-3.5 rounded-xl border border-slate-300 bg-slate-50/50 space-y-2 avoid-break"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{f.name}</span>
                      <span className="text-2xs text-slate-500 font-medium">
                        {f.domain === 'HOA_HOC' ? 'Hóa học' : 'Vật lí'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-center text-base font-bold text-indigo-950">
                      <MathView math={f.formulaLatex} />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>

                    <div className="text-2xs space-y-0.5 text-slate-500 pt-1 border-t border-slate-200">
                      <div>
                        <strong>Đại lượng: </strong>
                        {f.variables.map((v) => `${v.symbol} (${v.name}, [${v.unit}])`).join('; ')}
                      </div>
                      {f.conditions.length > 0 && (
                        <div>
                          <strong>Điều kiện: </strong>
                          <span className="inline">
                            {f.conditions.map((cond, cIdx) => (
                              <span key={cIdx} className="inline">
                                <MathView math={cond} />
                                {cIdx < f.conditions.length - 1 && <span className="mx-1">; </span>}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Nội dung bài học */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5">
              <span className="font-bold text-base text-slate-900 uppercase tracking-wider">
                II. KIẾN THỨC CỐT LÕI THEO TỪNG BÀI
              </span>
            </div>

            {filteredLessons.map((l) => (
              <div key={l.id} className="space-y-2.5 avoid-break">
                <div className="flex items-baseline justify-between border-b border-slate-200 pb-1">
                  <h2 className="text-sm font-bold text-teal-900">
                    Bài {l.lessonNumber}: {l.title}
                  </h2>
                  <span className="text-2xs text-slate-500 font-medium">{l.chapterTitle}</span>
                </div>

                <div className="space-y-1.5 pl-3 border-l-2 border-teal-500 text-xs text-slate-700">
                  {l.summary.map((sum, sIdx) => (
                    <div key={sIdx} className="leading-relaxed">
                      • {sum}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Section: Tình huống thực tế */}
          {includeRealWorld && filteredRealWorld.length > 0 && (
            <div className="space-y-4 avoid-break">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5">
                <span className="font-bold text-base text-slate-900 uppercase tracking-wider">
                  III. HIỆN TƯỢNG VÀ TÌNH HUỐNG THỰC TẾ
                </span>
              </div>

              <div className="space-y-3">
                {filteredRealWorld.map((rw) => (
                  <div key={rw.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 avoid-break">
                    <h3 className="font-bold text-xs text-slate-900">{rw.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{rw.overview}</p>
                    <div className="text-xs text-teal-900 font-medium bg-white p-2 rounded-lg border border-slate-200">
                      <strong>Cơ chế khoa học: </strong>
                      {rw.scientificMechanism}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Ngân hàng Bài Tập */}
          {includeExercises && filteredExercises.length > 0 && (
            <div className="space-y-4 avoid-break">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-1.5">
                <span className="font-bold text-base text-slate-900 uppercase tracking-wider">
                  IV. NGÂN HÀNG BÀI TẬP VẬN DỤNG & CỦNG CỐ
                </span>
              </div>

              <div className="space-y-4">
                {filteredExercises.map((ex, eIdx) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 avoid-break"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-xs text-teal-800">Câu {eIdx + 1}:</span>
                      <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                        <MathView math={ex.question} />
                      </div>
                    </div>

                    {/* Options */}
                    {ex.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pl-6">
                        {ex.options.map((opt, oIdx) => (
                          <div key={oIdx} className="text-slate-700">
                            <MathView math={opt} />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answers (if enabled) */}
                    {includeAnswers && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 mt-2">
                        <div className="font-bold text-emerald-900">
                          Đáp án: {typeof ex.correctAnswer === 'number' ? `Phương án ${['A', 'B', 'C', 'D'][ex.correctAnswer]}` : ex.correctAnswer}
                        </div>
                        <div className="text-slate-700 leading-relaxed">
                          <strong>Lời giải chi tiết: </strong>
                          <MathView math={ex.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Trang In */}
          <div className="pt-6 border-t border-slate-300 text-center text-2xs text-slate-500">
            Học sinh quét mã hoặc mở ứng dụng Trợ Lý KHTN 8 để sử dụng máy tính công thức và làm bài trắc nghiệm tương tác trực tuyến.
          </div>
        </div>
      </div>
    </div>
  );
};
