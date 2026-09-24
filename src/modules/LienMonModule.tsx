import React, { useState } from 'react';
import { INTERDISCIPLINARY_PROBLEMS, ProblemAtom } from '../data/interdisciplinary';
import { MathView } from '../components/MathView';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  Scale,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Compass
} from 'lucide-react';

export const LienMonModule: React.FC = () => {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);
  const [revealedEvidence, setRevealedEvidence] = useState<Record<string, boolean>>({});
  const [showTransfer, setShowTransfer] = useState(false);

  const activeProblem = INTERDISCIPLINARY_PROBLEMS[selectedProblemIndex] || INTERDISCIPLINARY_PROBLEMS[0];
  const activeLayer = activeProblem.reasoningLayers[activeLayerIndex];

  const toggleEvidence = (key: string) => {
    setRevealedEvidence((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              Mạch Vấn Đề Liên Môn KHTN 8
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Vật lí · Hóa học · Sinh học · Dữ liệu
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Giải Quyết Vấn Đề Thực Tế Liên Môn (Problem Graph)
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-4xl">
            Vấn đề thực tiễn là trung tâm. Kiến thức là các nút được kích hoạt đúng lúc theo tuyến tối thiểu (Minimal Sufficient Knowledge Path - MSKP) qua 4 tầng: Nhận diện → Giải thích → Quyết định → Kiểm chứng.
          </p>
        </div>
      </div>

      {/* Problem Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {INTERDISCIPLINARY_PROBLEMS.map((prob, idx) => {
          const isSelected = idx === selectedProblemIndex;
          return (
            <button
              key={prob.problemId}
              type="button"
              onClick={() => {
                setSelectedProblemIndex(idx);
                setActiveLayerIndex(0);
                setShowTransfer(false);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-teal-300' : 'text-teal-700'}`}>
                    Vấn đề {idx + 1}
                  </span>
                  <div className="flex gap-1">
                    {prob.disciplines.map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className={`text-2xs px-1.5 py-0.5 rounded font-medium ${
                          isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className={`text-sm font-bold line-clamp-2 leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {prob.title.replace(/^Vấn đề \d+:\s*/, '')}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100/20 flex items-center justify-between text-xs">
                <span className={isSelected ? 'text-teal-300 font-medium' : 'text-slate-500'}>
                  {prob.reasoningLayers.length} tầng lập luận
                </span>
                <span className={`font-semibold ${isSelected ? 'text-white' : 'text-teal-600'}`}>
                  Khám phá →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Problem Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Problem Central Hook */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              {activeProblem.disciplines.join(' ↔ ')}
            </span>
            <span className="text-xs text-slate-300">Mã: {activeProblem.problemId}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {activeProblem.centralQuestion}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl bg-white/5 p-3 rounded-xl border border-white/10">
            <strong className="text-teal-300">Bối cảnh thực tế: </strong>
            {activeProblem.context}
          </p>

          {/* Measurements & Data Strip */}
          <div className="pt-2">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block mb-2">
              Dữ liệu & Đại lượng đo được trong hiện trường:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeProblem.measurements.map((m, mIdx) => (
                <div key={mIdx} className="bg-white/10 rounded-lg p-2.5 border border-white/10">
                  <div className="text-xs text-slate-300 line-clamp-1">{m.label}</div>
                  <div className="text-base font-bold font-mono text-white mt-0.5">
                    {m.value} <span className="text-xs font-normal text-teal-300">{m.unit}</span>
                  </div>
                  <div className="text-2xs text-slate-400 mt-0.5">Dụng cụ: {m.tool}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Minimal Sufficient Knowledge Path (MSKP) Cards */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Tập kiến thức tối thiểu giải quyết vấn đề (MSKP)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Chỉ huy động kiến thức thực sự giúp giải thích hoặc đo lường
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeProblem.requiredKnowledgeAtoms.map((atom) => (
              <div
                key={atom.atomId}
                className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {atom.discipline}
                    </span>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                      Vai trò: {atom.role}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{atom.name}</h4>
                  {atom.formulaLatex && (
                    <div className="p-2 bg-slate-50 rounded text-center text-sm font-bold text-indigo-900">
                      <MathView math={atom.formulaLatex} />
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">{atom.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Reasoning Layers (4 Tầng Lập Luận) */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-bold text-slate-900">
                Tiến trình giải quyết 4 tầng (Evidence-First)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Tầng {activeLayerIndex + 1} / {activeProblem.reasoningLayers.length}
            </span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeProblem.reasoningLayers.map((layer, lIdx) => {
              const isActive = lIdx === activeLayerIndex;
              return (
                <button
                  key={layer.layer}
                  type="button"
                  onClick={() => setActiveLayerIndex(lIdx)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-2xs uppercase tracking-wider text-slate-500">
                    {layer.title.split('—')[0].trim()}
                  </div>
                  <div className="text-xs font-bold mt-0.5 truncate">
                    {layer.title.split('—')[1]?.trim() || layer.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Details */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block mb-1">
                {activeLayer.title}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-relaxed">
                {activeLayer.prompt}
              </h4>
            </div>

            {/* Evidence Checkboxes / Reveal */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Bằng chứng khoa học cần kết nối (Nhấn để xác thực):
              </span>
              <div className="space-y-2">
                {activeLayer.evidenceItems.map((item, eIdx) => {
                  const key = `${activeProblem.problemId}_${activeLayer.layer}_${eIdx}`;
                  const isChecked = !!revealedEvidence[key];
                  return (
                    <div
                      key={eIdx}
                      onClick={() => toggleEvidence(key)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                      </div>
                      <div className="text-sm font-medium leading-relaxed">
                        <MathView math={item} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Correct Path Callout */}
            <div className="p-4 rounded-xl bg-teal-900 text-white space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Mạch tư duy khoa học chuẩn mực:</span>
              </div>
              <p className="text-sm text-slate-100 leading-relaxed font-medium">
                {activeLayer.correctPath}
              </p>
            </div>

            {/* Misconception Trap */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-2.5 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-900">Bẫy nhận thức thường gặp: </strong>
                {activeLayer.misconception}
              </div>
            </div>

            {/* Layer Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={activeLayerIndex === 0}
                onClick={() => setActiveLayerIndex((prev) => Math.max(0, prev - 1))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeLayerIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                ← Tầng trước
              </button>

              {activeLayerIndex < activeProblem.reasoningLayers.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveLayerIndex((prev) => prev + 1)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Sang tầng kế tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTransfer(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Mở nhiệm vụ chuyển giao</span>
                </button>
              )}
            </div>
          </div>

          {/* Transfer Task Section */}
          {showTransfer && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Nhiệm vụ chuyển giao bối cảnh mới (Transfer Task)</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {activeProblem.transferTask.scenario}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  <strong>Thử thách: </strong>
                  {activeProblem.transferTask.challenge}
                </p>
              </div>

              <div className="p-4 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs space-y-1.5">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                  Phương án vận dụng liên môn giải quyết:
                </span>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {activeProblem.transferTask.expectedApplication}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
