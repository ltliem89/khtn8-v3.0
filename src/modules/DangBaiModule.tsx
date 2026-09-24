import React, { useState } from 'react';
import { PROBLEM_TYPES } from '../data/problemTypes';
import { useAppNavigation } from '../context/NavigationContext';
import { MathView } from '../components/MathView';
import { Compass, CheckCircle2, AlertTriangle, ArrowRight, Play, ChevronDown, ChevronUp } from 'lucide-react';

export const DangBaiModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    context.problemTypeId || PROBLEM_TYPES[0].id
  );
  const [showSolution, setShowSolution] = useState(true);

  const activeType = PROBLEM_TYPES.find((pt) => pt.id === selectedTypeId) || PROBLEM_TYPES[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Phương Pháp Giải Các Dạng Bài KHTN 8
        </h1>
        <p className="text-xs text-slate-500">
          Quy trình giải toán khoa học từng bước, phân tích bẫy đề thi và bài mẫu có lời giải chi tiết.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Types list */}
        <div className="lg:col-span-4 space-y-2 bg-white rounded-xl border border-slate-200 p-3">
          <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Các dạng bài trọng tâm ({PROBLEM_TYPES.length})
          </div>

          {PROBLEM_TYPES.map((pt) => {
            const isActive = pt.id === activeType.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => {
                  setSelectedTypeId(pt.id);
                  setShowSolution(true);
                }}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 border border-teal-200 text-teal-950 font-medium shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <Compass className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-2xs text-slate-400 font-mono">
                    {pt.domain === 'HOA_HOC' ? 'Hóa học' : 'Vật lí'}
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {pt.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Step-by-Step Strategy & Sample Problem */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-2xs text-slate-500">
                <span className="font-semibold text-teal-700">
                  {activeType.domain === 'HOA_HOC' ? 'Hóa học' : 'Vật lí'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Phương pháp sư phạm chuẩn</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{activeType.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{activeType.description}</p>
            </div>

            {/* Step-by-Step Algorithm */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Quy trình 4 bước giải chuẩn</span>
              </h3>

              <div className="space-y-2.5">
                {activeType.steps.map((st) => (
                  <div key={st.stepNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {st.stepNumber}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">{st.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed"><MathView math={st.instruction} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traps & Exam Tips */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Bẫy đề thi & Mẹo tránh mất điểm:</span>
              </h3>
              <ul className="text-xs text-amber-800 space-y-1 pl-4 list-disc">
                {activeType.trapsAndTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <MathView math={tip} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Worked Example */}
            <div className="space-y-3 border border-slate-200 rounded-xl overflow-hidden">
              <div
                onClick={() => setShowSolution(!showSolution)}
                className="p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <span className="text-2xs font-semibold uppercase tracking-wider text-teal-700 block">
                    Ví dụ mẫu áp dụng
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    <MathView math={activeType.sampleExample.problemStatement} />
                  </p>
                </div>
                <button type="button" className="text-slate-400 p-1">
                  {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showSolution && (
                <div className="p-4 bg-white space-y-3 border-t border-slate-200">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500 block">
                    Lời giải chi tiết từng bước:
                  </span>
                  <div className="space-y-2 text-xs text-slate-700">
                    {activeType.sampleExample.solutionSteps.map((step, sIdx) => (
                      <div key={sIdx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs leading-relaxed text-slate-800">
                        <MathView math={step} />
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800">Đáp số cuối cùng:</span>
                    <span className="text-sm font-bold text-emerald-900">
                      <MathView math={activeType.sampleExample.finalAnswer} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Next Action CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Thực hành ngay với các bài tập tương tự trong ngân hàng đề.
              </span>
              <button
                type="button"
                onClick={() => navigate({ tab: 'bai_tap', context: { problemTypeId: activeType.id } })}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-teal-400" />
                <span>Luyện dạng bài này</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
