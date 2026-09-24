import React, { useState, useEffect } from 'react';
import { EXERCISES } from '../data/exercises';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { Exercise, SubjectDomain } from '../types';
import { MathView } from '../components/MathView';
import {
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

export const TuKiemTraModule: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { addErrorRecord } = useLearningState();

  const [testDomain, setTestDomain] = useState<SubjectDomain | 'ALL'>('ALL');
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes default
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testQuestions, setTestQuestions] = useState<Exercise[]>([]);

  // Start a new test
  const handleStartTest = (domain: SubjectDomain | 'ALL', durationSec: number) => {
    setTestDomain(domain);
    const pool = EXERCISES.filter((ex) => (domain === 'ALL' ? true : ex.domain === domain));
    // Pick up to 8 questions
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, Math.min(8, pool.length));
    setTestQuestions(shuffled);
    setUserAnswers({});
    setTimeLeft(durationSec);
    setIsTestStarted(true);
    setIsTestSubmitted(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTestStarted || isTestSubmitted) return;

    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestSubmitted, timeLeft]);

  const handleSubmitTest = () => {
    setIsTestSubmitted(true);

    // Record incorrect answers to Error Notebook
    testQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      if (userAns !== q.correctAnswer) {
        addErrorRecord({
          exerciseId: q.id,
          questionText: q.question,
          userAnswer: userAns !== undefined && q.options ? q.options[userAns] : 'Chưa chọn',
          correctAnswer: q.options ? q.options[Number(q.correctAnswer)] : String(q.correctAnswer),
          category: q.errorCategoryIfWrong,
          remediationPath: {
            tab: q.relatedFormulaId ? 'cong_thuc' : 'ly_thuyet',
            id: q.relatedFormulaId || q.relatedConceptId || q.lessonId,
            description: `Học lại kiến thức bài "${q.question.slice(0, 35)}..."`
          }
        });
      }
    });
  };

  const correctCount = testQuestions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;
  const scorePercent = testQuestions.length > 0 ? Math.round((correctCount / testQuestions.length) * 100) : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Tự Kiểm Tra Đánh Giá Năng Lực KHTN 8
        </h1>
        <p className="text-xs text-slate-500">
          Đề kiểm tra trắc nghiệm bấm giờ theo chuẩn cấu trúc GDPT 2018. Tự động chấm điểm và chuyển các câu sai về Sổ tay lỗi sai.
        </p>
      </div>

      {!isTestStarted ? (
        /* Test Setup Card */
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Chọn Đề Thi Thử Thách
            </h2>
            <p className="text-xs text-slate-500">
              Đề thi ngẫu nhiên gồm các câu hỏi từ dễ đến vận dụng cao trong kho dữ liệu SBT KNTT và Cánh Diều.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'ALL', label: 'Tổng Hợp KHTN 8', desc: '8 câu · 10 phút · Cả 3 phân môn', dur: 600 },
              { id: 'HOA_HOC', label: 'Chuyên Đề Hoá Học', desc: '8 câu · 10 phút · Phản ứng & Hợp chất', dur: 600 },
              { id: 'VAT_LI', label: 'Chuyên Đề Vật Lí', desc: '8 câu · 10 phút · Áp suất, Đòn bẩy & Nhiệt', dur: 600 },
              { id: 'SINH_HOC', label: 'Chuyên Đề Sinh Học', desc: '8 câu · 10 phút · Cơ thể người & Sinh thái', dur: 600 }
            ].map((cfg) => (
              <div
                key={cfg.id}
                onClick={() => handleStartTest(cfg.id as any, cfg.dur)}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-teal-700 transition-colors">
                    {cfg.label}
                  </h3>
                  <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
                <p className="text-2xs text-slate-500">{cfg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Ongoing or Submitted Test View */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Status & Timer Bar */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-md">
            <div>
              <span className="text-2xs text-slate-400 uppercase tracking-wider block">
                {testDomain === 'ALL' ? 'Đề Tổng Hợp KHTN 8' : `Chuyên Đề ${testDomain}`}
              </span>
              <span className="text-xs font-semibold">
                Đã làm: {Object.keys(userAnswers).length} / {testQuestions.length} câu
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isTestSubmitted ? (
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã chấm điểm</span>
                </div>
              )}

              {!isTestSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer transition-colors"
                >
                  Nộp bài
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsTestStarted(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thi lại</span>
                </button>
              )}
            </div>
          </div>

          {/* Test Summary Score Card (when submitted) */}
          {isTestSubmitted && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-3xl font-extrabold text-slate-900">
                {scorePercent >= 80 ? '🎉 Xuất Sắc!' : scorePercent >= 50 ? '👍 Khá Tốt!' : '💪 Cần Cố Gắng Hơn!'}
              </div>
              <div className="flex items-center justify-center gap-6 text-xs">
                <div>
                  <span className="text-slate-400 block text-2xs">Số câu đúng:</span>
                  <span className="text-lg font-bold text-emerald-600">{correctCount} / {testQuestions.length}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-2xs">Tỉ lệ đạt:</span>
                  <span className="text-lg font-bold text-teal-700">{scorePercent}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {testQuestions.length - correctCount > 0
                  ? `Có ${testQuestions.length - correctCount} câu làm sai đã được ghi tự động vào Sổ tay lỗi sai để bạn khắc phục.`
                  : 'Bạn đã trả lời đúng 100% câu hỏi! Tiếp tục phát huy nhé.'}
              </p>
            </div>
          )}

          {/* Questions review list */}
          <div className="space-y-4">
            {testQuestions.map((q, qIdx) => {
              const userAns = userAnswers[q.id];
              const isCorrectQ = isTestSubmitted && userAns === q.correctAnswer;
              const isWrongQ = isTestSubmitted && userAns !== q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl bg-white border transition-all space-y-3 ${
                    isTestSubmitted
                      ? isCorrectQ
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-2xs text-slate-400">
                    <span className="font-bold text-slate-700">Câu {qIdx + 1}</span>
                    {isTestSubmitted && (
                      <span className={`font-bold flex items-center gap-1 ${isCorrectQ ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isCorrectQ ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {isCorrectQ ? 'Đúng (+10)' : 'Sai'}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                    <MathView math={q.question} />
                  </div>

                  {/* Options */}
                  {q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        let optStyle = 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100';

                        if (userAns === optIdx && !isTestSubmitted) {
                          optStyle = 'border-teal-500 bg-teal-50 text-teal-950 ring-1 ring-teal-500 font-medium';
                        }

                        if (isTestSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                          } else if (userAns === optIdx) {
                            optStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                          } else {
                            optStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <label
                            key={optIdx}
                            className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${optStyle}`}
                          >
                            <input
                              type="radio"
                              name={`test-q-${q.id}`}
                              disabled={isTestSubmitted}
                              checked={userAns === optIdx}
                              onChange={() => setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className="mt-0.5 text-teal-600"
                            />
                            <span><MathView math={opt} /></span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation if submitted */}
                  {isTestSubmitted && (
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-2xs text-slate-700 space-y-1">
                      <span className="font-semibold text-slate-900">Giải thích: </span>
                      <div className="mt-1">
                        <MathView math={q.explanation} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
