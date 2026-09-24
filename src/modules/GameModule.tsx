import React, { useState } from 'react';
import { GAME_REGISTRY, FLASHCARDS, MATCH_PAIRS, CLASSIFICATION_ITEMS, ERROR_HUNT_ITEMS } from '../data/games';
import { GameId } from '../types';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { MathView } from '../components/MathView';
import {
  Gamepad2,
  BookOpen,
  Link,
  Layers,
  Puzzle,
  ArrowRightLeft,
  Zap,
  AlertTriangle,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const GameModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const { state, recordGameScore, addErrorRecord } = useLearningState();

  const [activeGameId, setActiveGameId] = useState<GameId | null>((context.gameId as GameId) || null);

  // --- G01: Flashcard State ---
  const [fcIndex, setFcIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFcHint, setShowFcHint] = useState(false);
  const [fcScore, setFcScore] = useState(0);

  // --- G02: Matching Pairs State ---
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState(0);

  // --- G03: Classification State ---
  const [classIndex, setClassIndex] = useState(0);
  const [classScore, setClassScore] = useState(0);
  const [classFeedback, setClassFeedback] = useState<string | null>(null);

  // --- G13: Error Hunt State ---
  const [ehIndex, setEhIndex] = useState(0);
  const [ehScore, setEhScore] = useState(0);
  const [ehFeedback, setEhFeedback] = useState<string | null>(null);

  const handleStartGame = (id: GameId) => {
    setActiveGameId(id);
    setIsFlipped(false);
    setShowFcHint(false);
    setFcIndex(0);
    setFcScore(0);
    setSelectedLeft(null);
    setMatchedPairs([]);
    setMatchScore(0);
    setClassIndex(0);
    setClassScore(0);
    setClassFeedback(null);
    setEhIndex(0);
    setEhScore(0);
    setEhFeedback(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Game Hub Ôn Tập Khoa Học Tự Nhiên 8
          </h1>
          <p className="text-xs text-slate-500">
            Học mà chơi, củng cố phản xạ thuật ngữ, công thức, ghép cặp và tư duy bắt lỗi sai.
          </p>
        </div>

        {activeGameId && (
          <button
            type="button"
            onClick={() => setActiveGameId(null)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            ← Chọn trò chơi khác
          </button>
        )}
      </div>

      {/* Main Game Hub Menu */}
      {!activeGameId ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_REGISTRY.map((game) => {
            const highScore = state.gameHighScores[game.id] || 0;
            return (
              <div
                key={game.id}
                onClick={() => handleStartGame(game.id)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold text-teal-700">{game.id}</span>
                    <span className="text-2xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                      Điểm cao: {highScore}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {game.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {game.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-2xs">
                  <span className="text-slate-400 truncate max-w-[180px]">
                    {game.targetCompetency}
                  </span>
                  <span className="text-teal-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Chơi <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Active Game Canvas Area */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* G01: Flashcard */}
          {activeGameId === 'G01' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold text-teal-700">G01: Flashcard Thuật Ngữ</span>
                <span>Thẻ {fcIndex + 1} / {FLASHCARDS.length}</span>
              </div>

              {/* Flashcard container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[220px] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 border-2 select-none ${
                  isFlipped
                    ? 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-300'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {isFlipped ? 'Đáp án khoa học cốt lõi' : 'Câu hỏi thuật ngữ (Click để lật)'}
                </span>

                <div className="text-sm sm:text-base font-bold text-slate-900 max-w-lg leading-relaxed">
                  <MathView math={isFlipped ? FLASHCARDS[fcIndex].back : FLASHCARDS[fcIndex].front} />
                </div>

                <span className="text-2xs text-slate-400 mt-4">
                  {isFlipped ? 'Chạm để xem lại mặt trước' : 'Chạm để lật mở mặt sau'}
                </span>
              </div>

              {/* Hint Box */}
              {showFcHint && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <span className="font-semibold">Gợi ý: </span>
                  {FLASHCARDS[fcIndex].hint}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFcHint(!showFcHint)}
                  className="px-3 py-1.5 text-xs text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer"
                >
                  {showFcHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (fcIndex < FLASHCARDS.length - 1) {
                        setFcIndex(fcIndex + 1);
                        setIsFlipped(false);
                        setShowFcHint(false);
                      } else {
                        recordGameScore('G01', fcScore + 10);
                        alert(`Chúc mừng! Bạn đã hoàn thành toàn bộ Flashcard với ${fcScore + 10} điểm!`);
                        setActiveGameId(null);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Chưa thuộc
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFcScore((prev) => prev + 10);
                      if (fcIndex < FLASHCARDS.length - 1) {
                        setFcIndex(fcIndex + 1);
                        setIsFlipped(false);
                        setShowFcHint(false);
                      } else {
                        recordGameScore('G01', fcScore + 10);
                        alert(`Tuyệt vời! Bạn đã thành thạo bộ Flashcard với ${fcScore + 10} điểm!`);
                        setActiveGameId(null);
                      }
                    }}
                    className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Đã thuộc (+10)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* G02: Matching Pairs */}
          {activeGameId === 'G02' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold text-teal-700">G02: Ghép Cặp Thông Minh</span>
                <span>Đã ghép: {matchedPairs.length} / {MATCH_PAIRS.length} cặp</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left Column Items */}
                <div className="space-y-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Cột A (Khái niệm / Dụng cụ / Tế bào)
                  </span>
                  {MATCH_PAIRS.map((item) => {
                    const isMatched = matchedPairs.includes(item.id);
                    const isSelected = selectedLeft === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => setSelectedLeft(item.id)}
                        className={`w-full p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                            : isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-500 font-bold'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.leftTitle}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column Items */}
                <div className="space-y-2">
                  <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Cột B (Vai trò / Hiện tượng tương ứng)
                  </span>
                  {MATCH_PAIRS.map((item) => {
                    const isMatched = matchedPairs.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={isMatched}
                        onClick={() => {
                          if (!selectedLeft) {
                            alert('Vui lòng chọn 1 mục ở Cột A trước!');
                            return;
                          }
                          if (selectedLeft === item.id) {
                            setMatchedPairs((prev) => [...prev, item.id]);
                            setMatchScore((prev) => prev + 15);
                            setSelectedLeft(null);
                            if (matchedPairs.length + 1 === MATCH_PAIRS.length) {
                              recordGameScore('G02', matchScore + 15);
                              alert('Hoan hô! Bạn đã ghép chính xác tất cả các cặp!');
                            }
                          } else {
                            alert('Chưa chính xác! Hãy đọc kỹ mối liên hệ khoa học.');
                            setSelectedLeft(null);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.rightTitle}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* G03: Classification */}
          {activeGameId === 'G03' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold text-teal-700">G03: Phân Loại Hiện Tượng</span>
                <span>Câu {classIndex + 1} / {CLASSIFICATION_ITEMS.length} (Điểm: {classScore})</span>
              </div>

              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Hiện tượng cần phân loại:
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  "{CLASSIFICATION_ITEMS[classIndex].title}"
                </h3>
              </div>

              {/* 2 Target Category Choice Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {['Biến đổi vật lí', 'Biến đổi hoá học'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      const isRight = CLASSIFICATION_ITEMS[classIndex].correctCategory === cat;
                      if (isRight) {
                        setClassScore((prev) => prev + 10);
                        setClassFeedback(`Chính xác! "${CLASSIFICATION_ITEMS[classIndex].title}" là ${cat}.`);
                      } else {
                        setClassFeedback(`Chưa đúng! Đây là ${CLASSIFICATION_ITEMS[classIndex].correctCategory}.`);
                      }

                      setTimeout(() => {
                        setClassFeedback(null);
                        if (classIndex < CLASSIFICATION_ITEMS.length - 1) {
                          setClassIndex(classIndex + 1);
                        } else {
                          recordGameScore('G03', classScore + (isRight ? 10 : 0));
                          alert(`Hoàn thành thử thách phân loại với ${classScore + (isRight ? 10 : 0)} điểm!`);
                          setActiveGameId(null);
                        }
                      }, 1200);
                    }}
                    className="p-4 rounded-xl border-2 border-teal-500/40 bg-teal-50/30 hover:bg-teal-50 hover:border-teal-600 font-bold text-xs text-teal-900 transition-all cursor-pointer text-center"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {classFeedback && (
                <div className="p-3 rounded-lg bg-slate-900 text-white text-xs text-center font-medium animate-in fade-in">
                  {classFeedback}
                </div>
              )}
            </div>
          )}

          {/* G13: Error Hunt */}
          {activeGameId === 'G13' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <span className="font-bold text-rose-700">G13: Bắt Lỗi Sai & Sửa Đúng</span>
                <span>Câu {ehIndex + 1} / {ERROR_HUNT_ITEMS.length} (Điểm: {ehScore})</span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400">
                  Phát biểu khoa học:
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed font-serif">
                  "{ERROR_HUNT_ITEMS[ehIndex].statement}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const correct = ERROR_HUNT_ITEMS[ehIndex].isCorrect === true;
                    if (correct) {
                      setEhScore((prev) => prev + 10);
                      setEhFeedback('Đúng rồi! Phát biểu này hoàn toàn chính xác theo SGK.');
                    } else {
                      setEhFeedback(ERROR_HUNT_ITEMS[ehIndex].correction);
                    }
                  }}
                  className="p-3.5 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-900 font-bold text-xs cursor-pointer text-center"
                >
                  ✓ Phát biểu ĐÚNG
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const correct = ERROR_HUNT_ITEMS[ehIndex].isCorrect === false;
                    if (correct) {
                      setEhScore((prev) => prev + 10);
                      setEhFeedback('Chính xác! Bạn đã bắt đúng lỗi sai. ' + ERROR_HUNT_ITEMS[ehIndex].correction);
                    } else {
                      setEhFeedback('Sai rồi! Phát biểu này là đúng theo SGK.');
                    }
                  }}
                  className="p-3.5 rounded-xl border-2 border-rose-500/40 bg-rose-50/30 hover:bg-rose-50 text-rose-900 font-bold text-xs cursor-pointer text-center"
                >
                  ✕ Phát biểu SAI
                </button>
              </div>

              {ehFeedback && (
                <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-3">
                  <p className="leading-relaxed">{ehFeedback}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEhFeedback(null);
                      if (ehIndex < ERROR_HUNT_ITEMS.length - 1) {
                        setEhIndex(ehIndex + 1);
                      } else {
                        recordGameScore('G13', ehScore);
                        alert(`Bạn đã hoàn thành chẩn đoán bắt lỗi sai với ${ehScore} điểm!`);
                        setActiveGameId(null);
                      }
                    }}
                    className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-2xs rounded-md cursor-pointer"
                  >
                    Tiếp theo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fallback for other game types */}
          {activeGameId !== 'G01' && activeGameId !== 'G02' && activeGameId !== 'G03' && activeGameId !== 'G13' && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
              <Gamepad2 className="w-12 h-12 text-teal-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Trò chơi đang được mở rộng</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bạn có thể thử trước các mini game: Flashcard Thuật ngữ (G01), Ghép cặp (G02), Phân loại hiện tượng (G03), Bắt lỗi sai (G13).
              </p>
              <button
                type="button"
                onClick={() => handleStartGame('G01')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Chơi Flashcard ngay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
