import React, { useState, useEffect } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { useLearningState } from '../context/LearningStateContext';
import { Curriculum } from '../types';
import { BookOpen, Search, Flame, Award, BookCheck, Printer, Type } from 'lucide-react';

export const Header: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { state, setCurriculum } = useLearningState();

  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>(() => {
    try {
      const saved = localStorage.getItem('khtn8_font_size');
      if (saved === 'md' || saved === 'lg' || saved === 'xl') return saved;
    } catch {
      // fallback
    }
    return 'md';
  });

  useEffect(() => {
    document.documentElement.classList.remove('font-size-md', 'font-size-lg', 'font-size-xl');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    try {
      localStorage.setItem('khtn8_font_size', fontSize);
    } catch {
      // ignore
    }
  }, [fontSize]);

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div 
          onClick={() => navigate({ tab: 'home' })}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest via-forest2 to-water flex items-center justify-center text-white shadow-sm shadow-forest/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-ink">
                KHTN 8
              </span>
              <span className="text-xs font-semibold text-leaf uppercase tracking-wider">
                Trợ Lý Tự Học
              </span>
            </div>
            <p className="text-xs text-muted hidden sm:block">
              Chuẩn GDPT 2018 · Hóa học, Vật lí & Sinh học
            </p>
          </div>
        </div>

        {/* Middle: Curriculum Switcher & Font Size Scaler */}
        <div className="flex items-center gap-2">
          {/* Curriculum Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-sage/60 rounded-lg border border-line text-xs">
            <span className="text-muted px-2 font-medium">Bộ sách:</span>
            {(['KNTT', 'CD', 'SHARED'] as Curriculum[]).map((cur) => {
              const label = cur === 'KNTT' ? 'Kết Nối Tri Thức' : cur === 'CD' ? 'Cánh Diều' : 'Tất cả';
              const isActive = state.curriculumPreference === cur;
              return (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurriculum(cur)}
                  className={`px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-paper text-forest shadow-xs border border-leaf/60 font-semibold'
                      : 'text-muted hover:text-forest'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Accessibility Font Size Scaler (Tăng / Giảm Cỡ Chữ) */}
          <div className="flex items-center gap-1 p-1 bg-water2/60 border border-water/40 rounded-lg text-xs" title="Điều chỉnh cỡ chữ toàn bộ trang">
            <div className="flex items-center gap-1 px-1.5 text-water font-medium hidden sm:flex">
              <Type className="w-3.5 h-3.5 text-water" />
              <span className="text-2xs font-semibold">Cỡ chữ:</span>
            </div>
            <button
              type="button"
              onClick={() => setFontSize('md')}
              className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                fontSize === 'md'
                  ? 'bg-paper text-forest font-bold shadow-2xs border border-water'
                  : 'text-water hover:text-forest'
              }`}
              title="Cỡ chữ Chuẩn (100%)"
            >
              A <span className="text-2xs font-normal text-muted">100%</span>
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                fontSize === 'lg'
                  ? 'bg-paper text-forest font-bold shadow-2xs border border-water'
                  : 'text-water hover:text-forest'
              }`}
              title="Cỡ chữ Lớn (115% - Dễ đọc hơn)"
            >
              A+ <span className="text-2xs font-normal text-muted">115%</span>
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xl')}
              className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                fontSize === 'xl'
                  ? 'bg-paper text-forest font-bold shadow-2xs border border-water'
                  : 'text-water hover:text-forest'
              }`}
              title="Cỡ chữ Rất Lớn (130% - Rõ nét, chống mỏi mắt)"
            >
              A++ <span className="text-2xs font-normal text-muted">130%</span>
            </button>
          </div>
        </div>

        {/* Right action group: Export Print, Search, Streak, XP, Error count */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Export / Print Document Shortcut (17_DOCUMENT_EXPORT_RENDER_DEEP) */}
          <button
            onClick={() => navigate({ tab: 'xuat_ban' })}
            type="button"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-forest hover:text-forest2 bg-paper hover:bg-sage border border-leaf rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Xuất & In Tài Liệu Chuẩn A4 / PDF / DOCX"
          >
            <Printer className="w-3.5 h-3.5 text-leaf" />
            <span className="hidden sm:inline">Xuất & In A4</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={() => navigate({ tab: 'tra_cuu' })}
            type="button"
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-muted hover:text-forest bg-cream/70 hover:bg-sage border border-line rounded-lg transition-colors cursor-pointer"
            title="Tra cứu nhanh"
          >
            <Search className="w-3.5 h-3.5 text-leaf" />
            <span className="hidden md:inline">Tra cứu</span>
          </button>

          {/* Daily Streak */}
          <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-[#76541c] bg-[#fbf0dc] px-2.5 py-1 rounded-md border border-[#ead6ad]" title={`${state.dailyStreak} ngày học liên tiếp`}>
            <Flame className="w-4 h-4 text-gold fill-gold" />
            <span>{state.dailyStreak} ngày</span>
          </div>

          {/* XP & Progress */}
          <button
            onClick={() => navigate({ tab: 'tien_do' })}
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-forest bg-sage hover:bg-sage/80 px-2.5 py-1 rounded-md border border-leaf/70 transition-colors cursor-pointer"
            title="Xem hồ sơ tiến độ & thành tựu"
          >
            <Award className="w-4 h-4 text-forest2" />
            <span>{state.totalXP} XP</span>
          </button>

          {/* Errors Badge */}
          {state.errorNotebook.filter(e => !e.resolved).length > 0 && (
            <button
              onClick={() => navigate({ tab: 'loi_sai' })}
              type="button"
              className="flex items-center gap-1 text-xs font-medium text-clay bg-[#f8e9e6] hover:bg-[#f4ddd8] px-2.5 py-1 rounded-md border border-[#e6c4bd] transition-colors cursor-pointer"
              title="Có lỗi sai cần ôn lại trong sổ tay"
            >
              <BookCheck className="w-3.5 h-3.5 text-clay" />
              <span>{state.errorNotebook.filter(e => !e.resolved).length}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

