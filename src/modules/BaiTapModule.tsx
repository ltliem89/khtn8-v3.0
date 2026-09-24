import React, { useState } from 'react';
import { EXERCISES } from '../data/exercises';
import { Exercise, SubjectDomain } from '../types';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { MathView } from '../components/MathView';
import {
  FileCheck2,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

export const BaiTapModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const { state, recordExerciseResult, addErrorRecord } = useLearningState();

  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'ALL'>(
    (context.domain as SubjectDomain) || 'ALL'
  );
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHintTier, setShowHintTier] = useState<0 | 1 | 2>(0);

  const filteredExercises = EXERCISES.filter((ex) => {
    if (selectedDomain !== 'ALL' && ex.domain !== selectedDomain) return false;
    if (context.lessonId && ex.lessonId !== context.lessonId) return false;
    return true;
  });

  const activeExercise = filteredExercises[selectedExerciseIndex] || filteredExercises[0] || EXERCISES[0];
  const isCorrect = isSubmitted && selectedOption === activeExercise.correctAnswer;
  const prevResult = state.completedExercises[activeExercise.id];

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    setIsSubmitted(true);
    const correct = selectedOption === activeExercise.correctAnswer;
    recordExerciseResult(activeExercise.id, correct, activeExercise.difficulty === 'HARD' ? 20 : 10);

    if (!correct) {
      // Record into Error Notebook with remediation
      addErrorRecord({
        exerciseId: activeExercise.id,
        questionText: activeExercise.question,
        userAnswer: activeExercise.options ? activeExercise.options[selectedOption] : String(selectedOption),
        correctAnswer: activeExercise.options ? activeExercise.options[Number(activeExercise.correctAnswer)] : String(activeExercise.correctAnswer),
        category: activeExercise.errorCategoryIfWrong,
        remediationPath: {
          tab: activeExercise.relatedFormulaId ? 'cong_thuc' : 'ly_thuyet',
          id: activeExercise.relatedFormulaId || activeExercise.relatedConceptId || activeExercise.lessonId,
          description: `Ôn lại kiến thức bài "${activeExercise.question.slice(0, 40)}..."`
        }
      });
    }
  };

  const handleNext = () => {
    if (selectedExerciseIndex < filteredExercises.length - 1) {
      setSelectedExerciseIndex(selectedExerciseIndex + 1);
    } else {
      setSelectedExerciseIndex(0);
    }
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHintTier(0);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHintTier(0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Domain Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Luyện Bài Tập Chuẩn Hoá
          </h1>
          <p className="text-xs text-slate-500">
            Trích xuất từ Sách Bài Tập KNTT & Cánh Diều. Phản hồi tức thì, gợi ý 2 tầng và lưu lỗi sai tự động.
          </p>
        </div>

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
              onClick={() => {
                setSelectedDomain(d.id as any);
                setSelectedExerciseIndex(0);
                handleReset();
              }}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Question Navigator */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between text-2xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Danh sách câu hỏi</span>
            <span>{selectedExerciseIndex + 1} / {filteredExercises.length}</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {filteredExercises.map((ex, idx) => {
              const res = state.completedExercises[ex.id];
              const isCurrent = idx === selectedExerciseIndex;
              let bg = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
              if (res) {
                bg = res.correct
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800';
              }
              if (isCurrent) {
                bg += ' ring-2 ring-teal-500 font-bold';
              }

              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => {
                    setSelectedExerciseIndex(idx);
                    handleReset();
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${bg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {prevResult && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-2xs space-y-1">
              <span className="font-semibold text-slate-700">Lịch sử làm bài câu này:</span>
              <p className={prevResult.correct ? 'text-emerald-700' : 'text-rose-700'}>
                {prevResult.correct ? '✓ Đã trả lời đúng (+10 XP)' : '✕ Đã từng trả lời sai, hãy thử lại!'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Question Card & Interactive Options */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Metadata bar */}
            <div className="flex items-center justify-between text-2xs text-slate-500 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-teal-700">
                  {activeExercise.domain === 'HOA_HOC' ? 'Hóa học' : activeExercise.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Nguồn: {activeExercise.curriculum} SBT</span>
                <span aria-hidden="true">·</span>
                <span>Độ khó: {activeExercise.difficulty}</span>
              </div>
              <span className="text-slate-400 font-mono">ID: {activeExercise.id}</span>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                Câu {selectedExerciseIndex + 1}:
              </span>
              <h2 className="text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                <MathView math={activeExercise.question} />
              </h2>
            </div>

            {/* Options List */}
            {activeExercise.options && (
              <div className="space-y-2.5">
                {activeExercise.options.map((option, optIdx) => {
                  let optStyle = 'border-slate-200 bg-white hover:bg-slate-50/80 text-slate-800';

                  if (selectedOption === optIdx && !isSubmitted) {
                    optStyle = 'border-teal-500 bg-teal-50/40 text-teal-950 ring-1 ring-teal-500 font-medium';
                  }

                  if (isSubmitted) {
                    if (optIdx === activeExercise.correctAnswer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                    } else if (selectedOption === optIdx) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400';
                    } else {
                      optStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none text-xs leading-relaxed ${optStyle}`}
                    >
                      <input
                        type="radio"
                        name="exercise-option"
                        disabled={isSubmitted}
                        checked={selectedOption === optIdx}
                        onChange={() => setSelectedOption(optIdx)}
                        className="mt-0.5 text-teal-600 focus:ring-teal-500"
                      />
                      <span><MathView math={option} /></span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Action Bar: Submit, Hints, Next */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Hints Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={showHintTier >= 2 || isSubmitted}
                  onClick={() => setShowHintTier((prev) => (prev < 2 ? ((prev + 1) as any) : 2))}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{showHintTier === 0 ? 'Gợi ý 1' : showHintTier === 1 ? 'Gợi ý 2' : 'Đã mở hết gợi ý'}</span>
                </button>

                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Làm lại</span>
                  </button>
                )}
              </div>

              {/* Submit or Next */}
              {!isSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Kiểm tra đáp án
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Câu tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Hint Tiers Display */}
            {showHintTier > 0 && !isSubmitted && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-amber-900">
                <span className="font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Gợi ý hướng dẫn ({showHintTier}/2):</span>
                </span>
                <p>• <MathView math={activeExercise.hint1} /></p>
                {showHintTier >= 2 && <p className="pt-1 border-t border-amber-200/50">• <MathView math={activeExercise.hint2} /></p>}
              </div>
            )}

            {/* Detailed Explanation upon Submission */}
            {isSubmitted && (
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  isCorrect
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>Chính xác! Bạn được cộng {activeExercise.difficulty === 'HARD' ? 20 : 10} XP.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span>Chưa chính xác! Lỗi đã được tự động lưu vào Sổ tay chẩn đoán.</span>
                    </>
                  )}
                </div>

                <div className="text-xs space-y-1.5">
                  <span className="font-semibold block text-slate-800">Lời giải chi tiết:</span>
                  <div className="leading-relaxed text-slate-700 bg-white/70 p-3 rounded-lg border border-slate-200/50">
                    <MathView math={activeExercise.explanation} />
                  </div>
                </div>

                {/* Remediation Shortcut */}
                {!isCorrect && (
                  <div className="pt-2 flex items-center justify-between text-xs text-rose-800">
                    <span className="text-2xs">Phân loại lỗi: {activeExercise.errorCategoryIfWrong}</span>
                    <button
                      type="button"
                      onClick={() => navigate({
                        tab: activeExercise.relatedFormulaId ? 'cong_thuc' : 'ly_thuyet',
                        id: activeExercise.relatedFormulaId || activeExercise.lessonId
                      })}
                      className="font-medium underline hover:text-rose-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem lại lý thuyết / công thức liên quan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
