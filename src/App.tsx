import React, { useEffect } from 'react';
import { NavigationProvider, useAppNavigation } from './context/NavigationContext';
import { LearningStateProvider } from './context/LearningStateContext';
import { Header } from './components/Header';
import { PrimaryNav } from './components/PrimaryNav';
import { Breadcrumb } from './components/Breadcrumb';

// Modules
import { HomeModule } from './modules/HomeModule';
import { GameWorldModule } from './modules/GameWorldModule';
import { OnTapModule } from './modules/OnTapModule';
import { TeacherDashboardModule } from './modules/TeacherDashboardModule';
import { LyThuyetModule } from './modules/LyThuyetModule';
import { CongThucModule } from './modules/CongThucModule';
import { DonViModule } from './modules/DonViModule';
import { DangBaiModule } from './modules/DangBaiModule';
import { BaiTapModule } from './modules/BaiTapModule';
import { ThiNghiemModule } from './modules/ThiNghiemModule';
import { ThucTienModule } from './modules/ThucTienModule';
import { LienMonModule } from './modules/LienMonModule';
import { XuatBanModule } from './modules/XuatBanModule';
import { GameModule } from './modules/GameModule';
import { TuKiemTraModule } from './modules/TuKiemTraModule';
import { LoiSaiModule } from './modules/LoiSaiModule';
import { TraCuuModule } from './modules/TraCuuModule';
import { TienDoModule } from './modules/TienDoModule';

const MainContent: React.FC = () => {
  const { currentTab, navigate } = useAppNavigation();

  // Keyboard shortcut Ctrl+K to jump to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate({ tab: 'tra_cuu' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      {/* Top Header */}
      <Header />

      {/* Primary Tab Navigation */}
      <PrimaryNav />

      {/* Smart Breadcrumb & History */}
      <Breadcrumb />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && <HomeModule />}
        {currentTab === 'game_world' && <GameWorldModule />}
        {currentTab === 'on_tap' && <OnTapModule />}
        {currentTab === 'ly_thuyet' && <LyThuyetModule />}
        {currentTab === 'cong_thuc' && <CongThucModule />}
        {currentTab === 'don_vi' && <DonViModule />}
        {currentTab === 'dang_bai' && <DangBaiModule />}
        {currentTab === 'bai_tap' && <BaiTapModule />}
        {currentTab === 'thi_nghiem' && <ThiNghiemModule />}
        {currentTab === 'thuc_tien' && <ThucTienModule />}
        {currentTab === 'lien_mon' && <LienMonModule />}
        {currentTab === 'xuat_ban' && <XuatBanModule />}
        {currentTab === 'game' && <GameModule />}
        {currentTab === 'tu_kiem_tra' && <TuKiemTraModule />}
        {currentTab === 'loi_sai' && <LoiSaiModule />}
        {currentTab === 'tra_cuu' && <TraCuuModule />}
        {currentTab === 'tien_do' && <TienDoModule />}
        {currentTab === 'teacher_dashboard' && <TeacherDashboardModule />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-semibold text-slate-700">
              Trợ Lý Tự Học Khoa Học Tự Nhiên 8 — Chương Trình GDPT 2018
            </span>
            <div className="flex items-center gap-4 text-2xs">
              <span>Nguồn: SGK & SGV Kết Nối Tri Thức Với Cuộc Sống</span>
              <span aria-hidden="true">·</span>
              <span>SGK Cánh Diều</span>
            </div>
          </div>
          <p className="text-2xs text-slate-400">
            Dữ liệu khoa học được kiểm chứng nghiêm ngặt theo chuẩn Bộ Giáo Dục và Đào Tạo Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <LearningStateProvider>
        <MainContent />
      </LearningStateProvider>
    </NavigationProvider>
  );
}
