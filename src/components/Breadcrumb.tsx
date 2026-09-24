import React from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { TabType } from '../types';

const TAB_NAMES: Record<TabType, string> = {
  home: 'Trang chủ',
  game_world: 'Bản đồ Game KHTN',
  on_tap: 'Ôn tập 6 chế độ',
  ly_thuyet: 'Lý thuyết cốt lõi',
  cong_thuc: 'Bảng công thức',
  don_vi: 'Đơn vị đo lường',
  dang_bai: 'Phương pháp giải',
  bai_tap: 'Luyện bài tập',
  thi_nghiem: 'Thí nghiệm ảo',
  thuc_tien: 'Vấn đề thực tế',
  lien_mon: 'Mạch liên môn',
  xuat_ban: 'Xuất & In ấn A4',
  game: 'Trò chơi ôn tập',
  tu_kiem_tra: 'Tự kiểm tra',
  loi_sai: 'Sổ tay lỗi sai',
  tra_cuu: 'Tra cứu thuật ngữ',
  tien_do: 'Hồ sơ tiến độ',
  teacher_dashboard: 'Bản đồ năng lực'
};

export const Breadcrumb: React.FC = () => {
  const { currentTab, context, goBack, navigate, historyStack } = useAppNavigation();

  if (currentTab === 'home' && historyStack.length === 0) {
    return null;
  }

  return (
    <div className="bg-cream/70 border-b border-line/70 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => navigate({ tab: 'home' })}
            className="hover:text-forest transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-leaf" />
            <span>KHTN 8</span>
          </button>

          <ChevronRight className="w-3 h-3 text-sage" />
          
          <span className="font-semibold text-ink">
            {TAB_NAMES[currentTab]}
          </span>

          {context.domain && (
            <>
              <ChevronRight className="w-3 h-3 text-sage" />
              <span className="text-forest2">
                {context.domain === 'HOA_HOC' ? 'Hóa học' : context.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'}
              </span>
            </>
          )}

          {context.sourceTab && context.sourceTab !== currentTab && (
            <span className="text-muted/70 ml-1">
              (Từ: {TAB_NAMES[context.sourceTab as TabType] || context.sourceTab})
            </span>
          )}
        </div>

        {/* Back Button */}
        {(context.returnTo || historyStack.length > 0) && (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-forest bg-paper border border-leaf rounded-md hover:bg-sage transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </button>
        )}
      </div>
    </div>
  );
};
