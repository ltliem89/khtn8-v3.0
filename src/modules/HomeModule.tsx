import React from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { useLearningState } from '../context/LearningStateContext';
import {
  BookOpen,
  Binary,
  FlaskConical,
  Scale,
  Compass,
  FileCheck2,
  Gamepad2,
  AlertCircle,
  Globe2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Layers,
  ChevronRight,
  GitFork,
  Printer,
  Map,
  Swords,
  Target,
  Users
} from 'lucide-react';
import { LESSONS } from '../data/curriculum';
import { FORMULAS } from '../data/formulas';
import { REAL_WORLD_ITEMS } from '../data/realWorld';
import { calculateLevelFromXP } from '../utils/masteryEngine';

export const HomeModule: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { state, completeDailyMission } = useLearningState();

  const unresolvedErrors = state.errorNotebook.filter((e) => !e.resolved);
  const completedCount = state.completedLessons.length;
  const totalLessons = LESSONS.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  const levelInfo = calculateLevelFromXP(state.totalXP);

  // Compute average node mastery
  const nodeRecords = Object.values(state.nodeMastery || {});
  const avgMastery =
    nodeRecords.length > 0
      ? Math.round(nodeRecords.reduce((acc, r) => acc + r.masteryScore, 0) / nodeRecords.length)
      : 55;

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
            <span>Hệ thống tự học KHTN 8 chuẩn hóa</span>
            <span aria-hidden="true">·</span>
            <span>GDPT 2018 (KNTT & Cánh Diều)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Chinh phục Khoa Học Tự Nhiên 8 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-300">
              Kiến thức cốt lõi · Thí nghiệm · Thực tiễn
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Học đúng bản chất khoa học bám sát 100% sách giáo khoa & sách bài tập. Không học vẹt, kết nối công thức với thí nghiệm ảo và ứng dụng đời sống Việt Nam.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ tab: 'game_world' })}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Map className="w-4 h-4 text-slate-950" />
              <span>Thế Giới Game v4.0 (Gameplay-First)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate({ tab: 'on_tap' })}
              className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Ôn Tập 6 Chế Độ Xuyên Suốt</span>
            </button>

            <button
              type="button"
              onClick={() => navigate({ tab: 'teacher_dashboard' })}
              className="px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Bản Đồ Năng Lực & Giám Sát</span>
            </button>

            <button
              type="button"
              onClick={() => navigate({ tab: 'ly_thuyet' })}
              className="px-4 sm:px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs sm:text-sm rounded-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-300" />
              <span>Lý Thuyết Cốt Lõi</span>
            </button>

            <button
              type="button"
              onClick={() => navigate({ tab: 'xuat_ban' })}
              className="px-4 sm:px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-teal-600" />
              <span>Xuất & In A4 Chuẩn</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-0 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </section>

      {/* Daily Mission Section (Master Blueprint Section 19) */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white shadow-lg border border-teal-800/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-teal-400">
              <Target className="w-4 h-4 text-teal-400" />
              <span>Nhiệm Vụ Hằng Ngày · Daily Mission (Section 19)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Hôm nay: 1 Kiến thức mới + 3 Câu Review + 1 Câu Challenge
            </h2>
            <p className="text-xs text-slate-300">
              Mục tiêu hôm nay: Khắc sâu công thức thể tích mol khí chuẩn 24,79 L/mol và phục hồi các câu sai.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {state.dailyMissionDone ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Đã Hoàn Thành (+50 XP)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  completeDailyMission();
                  navigate({ tab: 'on_tap' });
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Thực Hiện Nhiệm Vụ (+50 XP)</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Mission Items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xs font-bold uppercase text-teal-300">1. Kiến thức mới</span>
            <div className="text-xs font-semibold text-white">V = 24,79 · n (Khí chuẩn 25 °C, 1 bar)</div>
            <p className="text-3xs text-slate-400">Thay thế hoàn toàn chuẩn cũ 22,4 lít</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xs font-bold uppercase text-sky-300">2. Ôn tập 3 câu</span>
            <div className="text-xs font-semibold text-white">Khối lượng riêng, p = F/S và C%</div>
            <p className="text-3xs text-slate-400">Tự động lấy từ các node có Mastery thấp</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-2xs font-bold uppercase text-amber-300">3. Thử thách 1 câu</span>
            <div className="text-xs font-semibold text-white">Tình huống tàu lặn Archimedes</div>
            <p className="text-3xs text-slate-400">Rèn luyện tư duy vận dụng thực tiễn</p>
          </div>
        </div>
      </section>

      {/* Blueprint 9-Step Core Learning Loop Visualization (Blueprint Section 1.1) */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xs font-bold uppercase tracking-wider text-slate-500">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Vòng Lặp Học Tập Cốt Lõi · Section 1.1 Master Blueprint</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Kiến Thức → Nhiệm Vụ → Tiến Bộ → Thành Thạo → Mở Khóa
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigate({ tab: 'game_world' })}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Vào bản đồ thế giới</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { step: '1. Khám Phá', desc: 'Hiện tượng đời sống & mâu thuẫn nhận thức', icon: '🔍', color: 'border-slate-200 bg-slate-50' },
            { step: '2. Học Kiến Thức', desc: 'Bản chất khoa học bám sát 100% SGK', icon: '📖', color: 'border-teal-200 bg-teal-50/50' },
            { step: '3. Luyện Tập', desc: 'Bài tập nhận biết, thông hiểu, công thức', icon: '✍️', color: 'border-sky-200 bg-sky-50/50' },
            { step: '4. Ôn Tập Ngắn', desc: 'Kích hoạt trí nhớ và phục hồi lỗi sai', icon: '🔄', color: 'border-indigo-200 bg-indigo-50/50' },
            { step: '5. Thử Thách & Boss', desc: 'Vận dụng thực tiễn, STEM và hạ Boss', icon: '👑', color: 'border-amber-200 bg-amber-50/50' }
          ].map((item, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border ${item.color} space-y-1 text-left`}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="font-bold text-xs text-slate-900">{item.step}</div>
              <p className="text-3xs text-slate-600 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Progress & Error Notification Widget */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Tiến độ học tập */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tiến độ chương trình
            </span>
            <span className="text-xs font-bold text-teal-700">
              {completedCount} / {totalLessons} bài ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
          <p className="text-2xs text-slate-500">
            Hoàn thành các bài tập và thí nghiệm để mở khóa danh hiệu mới!
          </p>
        </div>

        {/* Card 2: Sổ tay lỗi sai */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Sổ tay chẩn đoán lỗi
            </span>
            <span className={`text-xs font-bold ${unresolvedErrors.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {unresolvedErrors.length} lỗi cần khắc phục
            </span>
          </div>
          <div className="text-xs text-slate-600 flex items-center justify-between">
            <span>Định tuyến sửa lỗi tự động:</span>
            <button
              onClick={() => navigate({ tab: 'loi_sai' })}
              className="text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <p className="text-2xs text-slate-400">
            Học từ lỗi sai là cách nhanh nhất để không mất điểm trong kỳ thi.
          </p>
        </div>

        {/* Card 3: Thống kê Streak & XP */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Thành tựu tự học
            </span>
            <span className="text-xs font-bold text-indigo-600">
              {state.totalXP} Điểm XP
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold">{state.dailyStreak} ngày học</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Award className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold">{state.badges.length} huy hiệu</span>
            </div>
          </div>
          <p className="text-2xs text-slate-400">
            Duy trì chuỗi học mỗi ngày để củng cố phản xạ khoa học.
          </p>
        </div>
      </section>

      {/* 2 Learning Loops (SPEC V2 Principle) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Hai Lộ Trình Tự Học Chuẩn Sư Phạm
          </h2>
          <p className="text-xs text-slate-500">
            Lựa chọn phương thức học phù hợp với mục tiêu hiện tại của bạn: củng cố lý thuyết bài bản hoặc xuất phát từ tò mò thực tế.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Loop A: Standard Learning Loop */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50/70 to-slate-50 border border-cyan-200/70 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600 text-white rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Chu Trình Chuẩn (Core Mastery)
                </h3>
                <p className="text-xs text-slate-500">
                  Dành cho ôn thi, kiểm tra định kì, nắm vững bản chất kiến thức
                </p>
              </div>
            </div>

            {/* Loop Steps */}
            <div className="space-y-2 text-xs">
              {[
                { step: 'Hiểu', desc: 'Đọc tóm tắt lý thuyết cốt lõi SGK, tra từ khóa và điểm dễ nhầm', tab: 'ly_thuyet' as const },
                { step: 'Nhớ', desc: 'Luyện Flashcard thuật ngữ & lắp ghép cấu trúc công thức', tab: 'game' as const },
                { step: 'Luyện', desc: 'Làm bài tập trắc nghiệm phân loại theo dạng bài với gợi ý 2 bước', tab: 'bai_tap' as const },
                { step: 'Kiểm tra', desc: 'Thi thử tính giờ, đối chiếu bảng đáp án và giải thích chi tiết', tab: 'tu_kiem_tra' as const },
                { step: 'Sửa lỗi', desc: 'Mở sổ tay chẩn đoán phân loại lỗi sai để học lại đúng điểm yếu', tab: 'loi_sai' as const },
                { step: 'Vận dụng', desc: 'Giải thích hiện tượng đời sống thực tế và sản xuất', tab: 'thuc_tien' as const }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate({ tab: item.tab })}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200/80 hover:border-cyan-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-2xs shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800 mr-2">{item.step}:</span>
                    <span className="text-slate-600">{item.desc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Loop B: Exploration Learning Loop */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-slate-50 border border-emerald-200/70 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  2. Chu Trình Khám Phá (Inquiry Loop)
                </h3>
                <p className="text-xs text-slate-500">
                  Xuất phát từ các hiện tượng tò mò và thí nghiệm khoa học
                </p>
              </div>
            </div>

            {/* Loop Steps */}
            <div className="space-y-2 text-xs">
              {[
                { step: 'Bối cảnh', desc: 'Hiện tượng thực tế: Vì sao đáy đập thuỷ điện luôn dày hơn đỉnh?', tab: 'thuc_tien' as const },
                { step: 'Quan sát', desc: 'Làm thí nghiệm đục lỗ chai nước hoặc đo áp suất cát', tab: 'thi_nghiem' as const },
                { step: 'Dự đoán', desc: 'Thử sức với game dự đoán hiện tượng và bắt lỗi sai', tab: 'game' as const },
                { step: 'Kiến thức', desc: 'Kết nối đến công thức tính áp suất chất lỏng p = d.h', tab: 'cong_thuc' as const },
                { step: 'Định lượng', desc: 'Dùng máy tính công thức và bảng đổi đơn vị đo lường', tab: 'don_vi' as const },
                { step: 'Giải quyết', desc: 'Đề xuất giải pháp kỹ thuật, bảo vệ an toàn và môi trường', tab: 'thuc_tien' as const }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate({ tab: item.tab })}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-2xs shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800 mr-2">{item.step}:</span>
                    <span className="text-slate-600">{item.desc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars of KHTN 8 */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Ba Phân Môn Trọng Tâm KHTN 8
          </h2>
          <p className="text-xs text-slate-500">
            Tích hợp khoa học tự nhiên theo Chương trình GDPT 2018
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hóa học */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              Hóa
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Chất & Biến đổi Hoá học</h3>
            <p className="text-xs text-slate-600 line-clamp-3">
              Phản ứng hoá học, Mol & tỉ khối khí (chuẩn 24,79 L), Dung dịch & nồng độ C%, CM, Acid, Base, pH, Oxide, Muối và Phân bón hoá học.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-medium">
              <span className="text-slate-500">12 bài học</span>
              <button
                onClick={() => navigate({ tab: 'ly_thuyet', context: { domain: 'HOA_HOC' } })}
                className="text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Học ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Vật lí */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              Lý
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Năng lượng & Sự biến đổi</h3>
            <p className="text-xs text-slate-600 line-clamp-3">
              Khối lượng riêng, Áp suất mặt ép, Áp suất chất lỏng & khí quyển, Lực đẩy Archimedes, Moment lực & Đòn bẩy 3 loại, Dòng điện & Mạch điện, Sự truyền nhiệt.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-medium">
              <span className="text-slate-500">17 bài học</span>
              <button
                onClick={() => navigate({ tab: 'ly_thuyet', context: { domain: 'VAT_LI' } })}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Học ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sinh học */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              Sinh
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Vật sống & Môi trường</h3>
            <p className="text-xs text-slate-600 line-clamp-3">
              Giải phẫu sinh lí cơ thể người (Vận động, Tiêu hoá, Tuần hoàn máu, Hô hấp, Bài tiết, Thần kinh, Nội tiết, Da) và Sinh vật trong sinh quyển, Quần thể, Quần xã, Cân bằng tự nhiên.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-medium">
              <span className="text-slate-500">18 bài học</span>
              <button
                onClick={() => navigate({ tab: 'ly_thuyet', context: { domain: 'SINH_HOC' } })}
                className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Học ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Real-World Phenomena */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Điểm Sáng Ứng Dụng Thực Tế
            </h2>
            <p className="text-xs text-slate-500">
              Khoa học không xa vời — gắn liền với nông nghiệp, y tế và đời sống người Việt
            </p>
          </div>
          <button
            onClick={() => navigate({ tab: 'thuc_tien' })}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả ({REAL_WORLD_ITEMS.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REAL_WORLD_ITEMS.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate({ tab: 'thuc_tien', id: item.id })}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group space-y-2 bg-slate-50/50"
            >
              <div className="flex items-center gap-2 text-2xs text-slate-500">
                <span className="font-semibold text-teal-700">{item.nature}</span>
                <span aria-hidden="true">·</span>
                <span>{item.category}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                {item.title}
              </h4>
              <p className="text-2xs text-slate-600 line-clamp-2">
                {item.overview}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
