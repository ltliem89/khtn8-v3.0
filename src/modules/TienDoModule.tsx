import React from 'react';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { LESSONS } from '../data/curriculum';
import { EXPERIMENTS } from '../data/experiments';
import { EXERCISES } from '../data/exercises';
import { KNOWLEDGE_NODES, GAME_QUESTS, BOSS_BATTLES } from '../data/knowledgeGraph';
import { calculateLevelFromXP, getMasteryTierInfo } from '../utils/masteryEngine';
import {
  Award,
  Flame,
  CheckCircle,
  BarChart3,
  Target,
  Sparkles,
  RotateCcw,
  BookOpen,
  FlaskConical,
  Binary,
  Map,
  Swords,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export const TienDoModule: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { state, clearAllProgress } = useLearningState();

  const levelInfo = calculateLevelFromXP(state.totalXP);

  // Competency metrics
  const c1Percent = Math.min(100, Math.round((state.completedLessons.length / LESSONS.length) * 100));
  const c2Percent = Math.min(100, Math.round((state.completedExperiments.length / EXPERIMENTS.length) * 100));
  const c3Percent = Math.min(100, Math.round((Object.keys(state.completedExercises).length / EXERCISES.length) * 100));

  // Compute node mastery metrics
  const nodeRecords = Object.values(state.nodeMastery || {});
  const avgMastery =
    nodeRecords.length > 0
      ? Math.round(nodeRecords.reduce((acc, r) => acc + r.masteryScore, 0) / nodeRecords.length)
      : 55;

  // Weak Nodes (< 50%)
  const weakNodes = KNOWLEDGE_NODES.filter((n) => {
    const record = state.nodeMastery?.[n.id];
    return record && record.masteryScore < 55 && record.attemptCount > 0;
  });

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập và điểm XP về ban đầu?')) {
      clearAllProgress();
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <Target className="w-4 h-4 text-teal-500" />
            <span>Student Competency Profile · Section 24 Master Blueprint</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hồ Sơ Năng Lực & Đẳng Cấp Khoa Học Tự Nhiên 8
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đánh giá đa chiều: Điểm kinh nghiệm, Cấp bậc, Mức độ thành thạo từng phân môn và 3 năng lực cốt lõi GDPT 2018.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 p-2 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại tiến độ</span>
        </button>
      </div>

      {/* Level & XP Progression Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center text-2xl font-black text-white shadow-lg border border-white/20">
              {levelInfo.level}
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-amber-300">
                Đẳng Cấp Hiện Tại
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Cấp {levelInfo.level} · {levelInfo.title}
              </h2>
              <p className="text-xs text-slate-300">
                Tích lũy {state.totalXP} XP · Cần {levelInfo.nextLevelXp - state.totalXP} XP nữa để lên Cấp {levelInfo.level + 1}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate({ tab: 'game_world' })}
              className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-2"
            >
              <Map className="w-4 h-4 text-slate-950" />
              <span>Vào Bản Đồ Game & Quests</span>
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-2xs text-slate-400 font-mono">
            <span>{levelInfo.currentLevelXp} XP</span>
            <span className="text-amber-300 font-bold">{Math.round(levelInfo.progressPercent)}%</span>
            <span>{levelInfo.nextLevelXp} XP</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-amber-400 transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overview 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-700">
              Chuỗi Ngày Học
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {state.dailyStreak} ngày
          </div>
          <p className="text-2xs text-slate-500">
            Duy trì học tập liên tục mỗi ngày
          </p>
        </div>

        {/* Mastery */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-teal-700">
              Mastery Trung Bình
            </span>
            <Target className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600 font-mono">
            {avgMastery}%
          </div>
          <p className="text-2xs text-slate-500">
            Chỉ số năng lực trên toàn bộ kiến thức
          </p>
        </div>

        {/* Quests Done */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-indigo-700">
              Nhiệm Vụ Quests
            </span>
            <Map className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {Object.values(state.questProgress || {}).filter((q) => q.status === 'COMPLETED').length} / {GAME_QUESTS.length}
          </div>
          <p className="text-2xs text-slate-500">
            Hoàn thành các chặng khám phá & vận dụng
          </p>
        </div>

        {/* Boss Defeated */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-rose-700">
              Đại Chiến Boss
            </span>
            <Swords className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {Object.values(state.bossVictories || {}).filter((b) => b.defeated).length} / {BOSS_BATTLES.length}
          </div>
          <p className="text-2xs text-slate-500">
            Hạ gục Boss trùm thử thách 5 vòng
          </p>
        </div>
      </div>

      {/* Weak Nodes Remediation Alert (Section 15 & 24) */}
      {weakNodes.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-bold text-rose-900">
                Phát Hiện {weakNodes.length} Kiến Thức Cần Củng Cố Ngay
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate({ tab: 'on_tap' })}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <span>Vào Chế Độ Ôn Điểm Yếu (Mode C)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {weakNodes.map((wn) => {
              const rec = state.nodeMastery?.[wn.id];
              return (
                <div
                  key={wn.id}
                  className="p-3 bg-white rounded-xl border border-rose-200/80 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{wn.title}</div>
                    <div className="text-2xs text-slate-500">{wn.chapterTitle}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-rose-600 font-mono">
                      {rec?.masteryScore || 0}%
                    </span>
                    <span className="block text-3xs text-rose-500">Cần can thiệp</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3 GDPT 2018 Competencies Progress */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Khung Đánh Giá 3 Năng Lực Đặc Thù KHTN 8 (Thông Tư 32/2018)
          </h2>
          <p className="text-xs text-slate-500">
            Chỉ số bám sát chuẩn đầu ra yêu cầu cần đạt của môn Khoa học tự nhiên lớp 8.
          </p>
        </div>

        <div className="space-y-4">
          {/* Competency 1 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>1. Nhận thức khoa học tự nhiên</span>
              </span>
              <span className="font-mono font-bold text-sky-700">{c1Percent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${c1Percent}%` }}
              />
            </div>
            <span className="text-2xs text-slate-500 block">
              Đã học {state.completedLessons.length} / {LESSONS.length} bài học cốt lõi
            </span>
          </div>

          {/* Competency 2 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-cyan-600" />
                <span>2. Tìm hiểu tự nhiên (Thí nghiệm & Thực nghiệm)</span>
              </span>
              <span className="font-mono font-bold text-cyan-700">{c2Percent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${c2Percent}%` }}
              />
            </div>
            <span className="text-2xs text-slate-500 block">
              Đã thực hành {state.completedExperiments.length} / {EXPERIMENTS.length} thí nghiệm ảo
            </span>
          </div>

          {/* Competency 3 */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Binary className="w-4 h-4 text-indigo-600" />
                <span>3. Vận dụng kiến thức & Kỹ năng đã học</span>
              </span>
              <span className="font-mono font-bold text-indigo-700">{c3Percent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${c3Percent}%` }}
              />
            </div>
            <span className="text-2xs text-slate-500 block">
              Đã hoàn thành {Object.keys(state.completedExercises).length} / {EXERCISES.length} bài tập chuẩn
            </span>
          </div>
        </div>
      </section>

      {/* Badges Earned */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Huy Hiệu & Danh Hiệu Đã Đạt</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Khởi Động Nhà Khoa Học', desc: 'Đăng nhập và học bài đầu tiên', unlocked: true },
            { title: 'Thực Hành Chuẩn Xác', desc: 'Hoàn thành thí nghiệm ảo', unlocked: true },
            { title: 'Dũng Sĩ Hóa Học', desc: 'Hạ gục Boss Trùm Lomonosov', unlocked: !!state.bossVictories?.['BOSS_KHU_A']?.defeated },
            { title: 'Bác Sĩ Trừ Lỗi Sai', desc: 'Khắc phục thành công các lỗi sai', unlocked: state.errorNotebook.some((e) => e.resolved) }
          ].map((b, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold">{b.title}</h4>
              <p className="text-2xs text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
