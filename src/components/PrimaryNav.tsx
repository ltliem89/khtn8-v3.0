import React from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { TabType } from '../types';
import {
  Home,
  BookOpen,
  Binary,
  Scale,
  Compass,
  FileCheck2,
  FlaskConical,
  Globe2,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  Search,
  LineChart,
  GitFork,
  Printer,
  Map,
  Sparkles,
  Users
} from 'lucide-react';

interface NavItem {
  tab: TabType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'home', label: 'Trang chủ', shortLabel: 'Tổng quan', icon: Home },
  { tab: 'game_world', label: 'Thế Giới Game v4.0', shortLabel: 'Game v4.0', icon: Map },
  { tab: 'on_tap', label: 'Ôn tập 6 chế độ', shortLabel: 'Ôn tập', icon: Sparkles },
  { tab: 'ly_thuyet', label: 'Lý thuyết cốt lõi', shortLabel: 'Lý thuyết', icon: BookOpen },
  { tab: 'cong_thuc', label: 'Bảng công thức', shortLabel: 'Công thức', icon: Binary },
  { tab: 'don_vi', label: 'Đơn vị đo lường', shortLabel: 'Đơn vị', icon: Scale },
  { tab: 'dang_bai', label: 'Phương pháp giải', shortLabel: 'Dạng bài', icon: Compass },
  { tab: 'bai_tap', label: 'Luyện bài tập', shortLabel: 'Bài tập', icon: FileCheck2 },
  { tab: 'thi_nghiem', label: 'Thí nghiệm ảo', shortLabel: 'Thí nghiệm', icon: FlaskConical },
  { tab: 'thuc_tien', label: 'Vấn đề thực tế', shortLabel: 'Thực tế', icon: Globe2 },
  { tab: 'lien_mon', label: 'Mạch liên môn', shortLabel: 'Liên môn', icon: GitFork },
  { tab: 'xuat_ban', label: 'Xuất & In A4', shortLabel: 'Xuất bản', icon: Printer },
  { tab: 'game', label: 'Trò chơi ôn tập', shortLabel: 'Game Hub', icon: Gamepad2 },
  { tab: 'tu_kiem_tra', label: 'Tự kiểm tra', shortLabel: 'Kiểm tra', icon: CheckCircle2 },
  { tab: 'loi_sai', label: 'Sổ tay lỗi sai', shortLabel: 'Lỗi sai', icon: AlertCircle },
  { tab: 'tra_cuu', label: 'Tra cứu thuật ngữ', shortLabel: 'Tra cứu', icon: Search },
  { tab: 'tien_do', label: 'Hồ sơ tiến độ', shortLabel: 'Tiến độ', icon: LineChart },
  { tab: 'teacher_dashboard', label: 'Bản đồ năng lực', shortLabel: 'Giám sát', icon: Users },
];

export const PrimaryNav: React.FC = () => {
  const { currentTab, setTab } = useAppNavigation();

  return (
    <nav className="bg-white border-b border-slate-200 overflow-x-auto no-scrollbar py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 min-w-max">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setTab(item.tab)}
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
