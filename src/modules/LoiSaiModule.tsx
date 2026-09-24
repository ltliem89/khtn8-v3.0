import React, { useState } from 'react';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { ErrorCategory } from '../types';
import { MathView } from '../components/MathView';
import {
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const CATEGORY_LABELS: Record<ErrorCategory, string> = {
  CONCEPT: 'Nhầm lẫn khái niệm',
  FORMULA: 'Sai cấu trúc công thức',
  UNIT: 'Sai đổi đơn vị đo',
  PROCEDURE: 'Sai thao tác thí nghiệm',
  PROBLEM_STRATEGY: 'Sai phương pháp giải',
  APPLICATION: 'Vận dụng thực tế chưa đúng',
  CALCULATION: 'Sai số học & tính toán'
};

export const LoiSaiModule: React.FC = () => {
  const { navigate } = useAppNavigation();
  const { state, resolveErrorRecord } = useLearningState();

  const [selectedCategory, setSelectedCategory] = useState<ErrorCategory | 'ALL'>('ALL');
  const [filterResolved, setFilterResolved] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('UNRESOLVED');

  const filteredErrors = state.errorNotebook.filter((err) => {
    if (selectedCategory !== 'ALL' && err.category !== selectedCategory) return false;
    if (filterResolved === 'UNRESOLVED' && err.resolved) return false;
    if (filterResolved === 'RESOLVED' && !err.resolved) return false;
    return true;
  });

  const unresolvedCount = state.errorNotebook.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Sổ Tay Lỗi Sai & Chẩn Đoán Khắc Phục
          </h1>
          <p className="text-xs text-slate-500">
            Học sâu từ những điểm vấp ngã. Định tuyến trực tiếp về kiến thức gốc để không lặp lại lỗi cũ.
          </p>
        </div>

        {/* Status filter: Chưa sửa / Đã sửa */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setFilterResolved('UNRESOLVED')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filterResolved === 'UNRESOLVED'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cần khắc phục ({unresolvedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterResolved('ALL')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              filterResolved === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({state.errorNotebook.length})
          </button>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-2xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0">Phân loại lỗi:</span>
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer shrink-0 transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tất cả phân loại
        </button>
        {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
          <button
            key={catKey}
            type="button"
            onClick={() => setSelectedCategory(catKey as ErrorCategory)}
            className={`px-2.5 py-1 rounded-md border font-medium cursor-pointer shrink-0 transition-colors ${
              selectedCategory === catKey
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Errors List */}
      {filteredErrors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            {filterResolved === 'UNRESOLVED'
              ? 'Tuyệt vời! Không còn lỗi sai nào chưa khắc phục.'
              : 'Chưa có lỗi sai nào trong danh mục này.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khi làm bài tập hoặc thi thử, các câu bạn trả lời sai sẽ tự động xuất hiện ở đây cùng hướng dẫn ôn tập.
          </p>
          <button
            type="button"
            onClick={() => navigate({ tab: 'bai_tap' })}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Luyện thêm bài tập
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredErrors.map((err) => (
            <div
              key={err.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                err.resolved
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-rose-200 shadow-2xs'
              }`}
            >
              {/* Top metadata */}
              <div className="flex items-center justify-between text-2xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {CATEGORY_LABELS[err.category] || err.category}
                  </span>
                  <span className="text-slate-400">
                    {new Date(err.timestamp).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {err.resolved && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đã khắc phục</span>
                  </span>
                )}
              </div>

              {/* Question & Comparison */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 leading-relaxed">
                  <MathView math={err.questionText} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/70 text-rose-950 space-y-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-rose-700 block">
                      Câu bạn đã chọn:
                    </span>
                    <div className="font-medium">
                      <MathView math={err.userAnswer} />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-emerald-950 space-y-1">
                    <span className="text-2xs font-bold uppercase tracking-wider text-emerald-700 block">
                      Đáp án đúng chuẩn khoa học:
                    </span>
                    <div className="font-medium">
                      <MathView math={err.correctAnswer} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Remediation Action Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                {err.remediationPath && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate({
                        tab: err.remediationPath!.tab,
                        id: err.remediationPath!.id
                      })
                    }
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{err.remediationPath.description}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                {!err.resolved && (
                  <button
                    type="button"
                    onClick={() => resolveErrorRecord(err.id)}
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đánh dấu đã hiểu (+30 XP)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
