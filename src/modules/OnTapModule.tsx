import React, { useState, useMemo } from 'react';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { EXERCISES } from '../data/exercises';
import { KNOWLEDGE_NODES } from '../data/knowledgeGraph';
import { ReviewType } from '../types/blueprint';
import { MathView } from '../components/MathView';
import {
  Sparkles,
  RotateCcw,
  AlertCircle,
  Clock,
  BookOpen,
  Shuffle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const OnTapModule: React.FC = () => {
  const { state, recordNodeAttempt, addErrorRecord, resolveErrorRecord } = useLearningState();
  const { navigate } = useAppNavigation();

  // Active review mode
  const [reviewMode, setReviewMode] = useState<ReviewType>('QUICK');

  // Exercise Session State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint1, setShowHint1] = useState(false);
  const [showHint2, setShowHint2] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ correct: number; total: number; xpGained: number }>({
    correct: 0,
    total: 0,
    xpGained: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  // Compute question set according to ReviewType (Blueprint Section 7)
  const questionPool = useMemo(() => {
    switch (reviewMode) {
      case 'QUICK':
        // Review A: 3-5 câu khởi động đầu buổi
        return EXERCISES.slice(0, 5);

      case 'ERROR': {
        // Review B: Các câu học sinh từng trả lời sai
        const errorExerciseIds = state.errorNotebook.map((e) => e.exerciseId).filter(Boolean);
        const matched = EXERCISES.filter((ex) => errorExerciseIds.includes(ex.id));
        return matched.length > 0 ? matched : EXERCISES.slice(2, 6);
      }

      case 'WEAK': {
        // Review C: Các Knowledge Node có Mastery < 50%
        const weakNodeIds = Object.values(state.nodeMastery || {})
          .filter((rec) => rec.masteryScore < 60)
          .map((rec) => rec.knowledgeId);

        const weakExercises = EXERCISES.filter((ex) => {
          const matchingNode = KNOWLEDGE_NODES.find(
            (kn) => kn.lessonId === ex.lessonId || kn.practiceIds.includes(ex.id)
          );
          return matchingNode && weakNodeIds.includes(matchingNode.id);
        });
        return weakExercises.length > 0 ? weakExercises : EXERCISES.slice(1, 6);
      }

      case 'SPACED':
        // Review D: Lặp lại ngắt quãng (SRS)
        return [...EXERCISES].reverse().slice(0, 5);

      case 'CHAPTER':
        // Review E: Ôn tập theo chương 1 (Phản ứng hoá học)
        return EXERCISES.filter((ex) => ex.domain === 'HOA_HOC');

      case 'MIXED':
        // Review F: Trộn nhiều chương và liên môn
        return [...EXERCISES].sort(() => 0.5 - Math.random()).slice(0, 6);
    }
  }, [reviewMode, state.errorNotebook, state.nodeMastery]);

  const currentExercise = questionPool[currentIndex] || questionPool[0];

  const handleSelectMode = (mode: ReviewType) => {
    setReviewMode(mode);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint1(false);
    setShowHint2(false);
    setIsFinished(false);
    setSessionResults({ correct: 0, total: 0, xpGained: 0 });
  };

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered || !currentExercise) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === Number(currentExercise.correctAnswer);
    const hintsUsed = (showHint1 ? 1 : 0) + (showHint2 ? 1 : 0);

    // Find mapped knowledge node
    const mappedNode = KNOWLEDGE_NODES.find(
      (kn) => kn.lessonId === currentExercise.lessonId || kn.practiceIds.includes(currentExercise.id)
    );
    const knowledgeId = mappedNode?.id || 'KN_HOA_01';

    // Record into Mastery Engine
    recordNodeAttempt(knowledgeId, isCorrect, 15000, hintsUsed > 0);

    if (isCorrect) {
      setSessionResults((prev) => ({
        correct: prev.correct + 1,
        total: prev.total + 1,
        xpGained: prev.xpGained + 15
      }));
    } else {
      setSessionResults((prev) => ({
        ...prev,
        total: prev.total + 1,
        xpGained: prev.xpGained + 5
      }));

      // Add to Error Notebook (Section 15: Sai -> Dữ liệu để học)
      addErrorRecord({
        exerciseId: currentExercise.id,
        questionText: currentExercise.question,
        userAnswer: currentExercise.options?.[optionIndex] || 'Đáp án chọn',
        correctAnswer: currentExercise.options?.[Number(currentExercise.correctAnswer)] || 'Đáp án đúng',
        category: currentExercise.errorCategoryIfWrong,
        remediationPath: {
          tab: 'ly_thuyet',
          id: currentExercise.lessonId,
          description: `Ôn tập lại kiến thức ${currentExercise.lessonId}`
        }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questionPool.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint1(false);
      setShowHint2(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint1(false);
    setShowHint2(false);
    setIsFinished(false);
    setSessionResults({ correct: 0, total: 0, xpGained: 0 });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Review Everywhere · Section 7 Master Blueprint</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hệ Thống Ôn Tập Xuyên Suốt & Đột Phá Điểm Yếu
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ôn tập không phải là một bài kiểm tra khô khan — mà là chìa khóa củng cố trí nhớ dài hạn và thăng hạng Mastery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate({ tab: 'game_world' })}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>Sang Bản Đồ Game KHTN</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6 REVIEW TYPES TABS (Section 7.1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          {
            type: 'QUICK' as ReviewType,
            label: 'A. Quick Review',
            sub: 'Khởi động 3-5 câu',
            icon: Clock,
            badge: 'Hàng ngày'
          },
          {
            type: 'ERROR' as ReviewType,
            label: 'B. Error Review',
            sub: 'Sửa các câu sai',
            icon: AlertCircle,
            badge: `${state.errorNotebook.length} lỗi`
          },
          {
            type: 'WEAK' as ReviewType,
            label: 'C. Weak Review',
            sub: 'Mastery < 50%',
            icon: ShieldCheck,
            badge: 'Ưu tiên'
          },
          {
            type: 'SPACED' as ReviewType,
            label: 'D. Spaced Review',
            sub: 'Lặp ngắt quãng SRS',
            icon: RotateCcw,
            badge: 'Định kỳ'
          },
          {
            type: 'CHAPTER' as ReviewType,
            label: 'E. Chapter Review',
            sub: 'Trọn vẹn 1 chương',
            icon: BookOpen,
            badge: 'Cơ bản'
          },
          {
            type: 'MIXED' as ReviewType,
            label: 'F. Mixed Review',
            sub: 'Trộn liên môn STEM',
            icon: Shuffle,
            badge: 'Nâng cao'
          }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = reviewMode === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleSelectMode(item.type)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-teal-400'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span
                    className={`text-2xs font-semibold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <div className="font-bold text-xs">{item.label}</div>
              </div>
              <div
                className={`text-2xs mt-1 ${
                  isActive ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {item.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* QUESTION SESSION AREA */}
      {!isFinished && currentExercise && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-50 text-teal-700">
                Câu {currentIndex + 1} / {questionPool.length}
              </span>
              <span className="text-2xs text-slate-500">
                Độ khó: <strong className="text-slate-700">{currentExercise.difficulty}</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-500">
                Đúng: <strong className="text-emerald-600">{sessionResults.correct}</strong>
              </span>
              <span className="text-slate-500">
                XP thu thập: <strong className="text-indigo-600">+{sessionResults.xpGained} XP</strong>
              </span>
            </div>
          </div>

          {/* Question text with KaTeX MathView */}
          <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
            <MathView math={currentExercise.question} />
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentExercise.options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === Number(currentExercise.correctAnswer);

              let optionStyle =
                'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                >
                  <div className="flex-1">
                    <MathView math={option} />
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Mechanism (Blueprint Section 15 & 16) */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-3">
              {!showHint1 && (
                <button
                  type="button"
                  onClick={() => setShowHint1(true)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-2xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gợi ý 1 (Định hướng)</span>
                </button>
              )}
              {showHint1 && !showHint2 && (
                <button
                  type="button"
                  onClick={() => setShowHint2(true)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-2xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gợi ý 2 (Công thức / Bản chất)</span>
                </button>
              )}
            </div>

            {showHint1 && (
              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <strong>Gợi ý 1:</strong> {currentExercise.hint1}
              </div>
            )}
            {showHint2 && (
              <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <strong>Gợi ý 2:</strong> {currentExercise.hint2}
              </div>
            )}
          </div>

          {/* Scientific Explanation on Answered */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-teal-700 block uppercase tracking-wider">
                Giải thích khoa học chuẩn GDPT 2018:
              </span>
              <div className="text-xs text-slate-700 leading-relaxed">
                <MathView math={currentExercise.explanation} />
              </div>
            </div>
          )}

          {/* Action Row */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-2"
              >
                <span>{currentIndex + 1 < questionPool.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả Ôn Tập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SESSION COMPLETED SUMMARY */}
      {isFinished && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Hoàn Thành Phiên Ôn Tập!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Chỉ số Mastery cho các node kiến thức liên quan đã được cập nhật tự động vào hệ thống.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xs text-slate-500 block">Số câu đúng</span>
              <strong className="text-lg font-extrabold text-emerald-600">
                {sessionResults.correct} / {sessionResults.total}
              </strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xs text-slate-500 block">Tỷ lệ chính xác</span>
              <strong className="text-lg font-extrabold text-slate-900">
                {Math.round((sessionResults.correct / (sessionResults.total || 1)) * 100)}%
              </strong>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-2xs text-slate-500 block">XP Nhận Được</span>
              <strong className="text-lg font-extrabold text-indigo-600">
                +{sessionResults.xpGained} XP
              </strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ôn Luyện Lại Chế Độ Này</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ tab: 'game_world' })}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Vào Bản Đồ Game & Làm Quest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
