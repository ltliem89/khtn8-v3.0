import React, { useState } from 'react';
import { REAL_WORLD_ITEMS } from '../data/realWorld';
import { useAppNavigation } from '../context/NavigationContext';
import {
  Globe2,
  CheckCircle2,
  HeartPulse,
  Leaf,
  Factory,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ThucTienModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredItems = REAL_WORLD_ITEMS.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Khoa Học Trong Thực Tiễn Đời Sống
          </h1>
          <p className="text-xs text-slate-500">
            Khám phá ứng dụng thực tế trong nông nghiệp, y tế, môi trường và đời sống tại Việt Nam.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs flex-wrap">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'NONG_NGHIEP', label: 'Nông nghiệp' },
            { id: 'Y_TE', label: 'Y tế & Sức khoẻ' },
            { id: 'MOI_TRUONG', label: 'Môi trường' },
            { id: 'KY_THUAT', label: 'Kỹ thuật' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Real-world Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Provenance & Nature Badge according to SPEC V2 */}
              <div className="flex items-center justify-between text-2xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-teal-700">{item.nature}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.domain === 'HOA_HOC' ? 'Hóa học' : item.domain === 'VAT_LI' ? 'Vật lí' : 'Sinh học'}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 italic">
                "{item.problemContext}"
              </div>

              {/* Scientific Mechanism */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="font-semibold text-slate-900 block text-2xs uppercase tracking-wider">
                  Cơ chế giải thích khoa học:
                </span>
                <p className="leading-relaxed bg-teal-50/30 p-3 rounded-xl border border-teal-100/80">
                  {item.scientificMechanism}
                </p>
              </div>

              {/* Actionable Takeaways */}
              <div className="space-y-1.5 text-xs">
                <span className="font-semibold text-emerald-900 block text-2xs uppercase tracking-wider">
                  Bài học ứng dụng thực tế:
                </span>
                <ul className="space-y-1 text-slate-600 pl-4 list-disc text-2xs">
                  {item.actionableTakeaways.map((act, aIdx) => (
                    <li key={aIdx} className="leading-relaxed">
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Links to Core Lessons & Formulas */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-2xs text-slate-400">
                Liên kết bài học: {item.connectedLessonIds.join(', ')}
              </span>

              <button
                type="button"
                onClick={() => navigate({ tab: 'ly_thuyet', context: { lessonId: item.connectedLessonIds[0] } })}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Xem lý thuyết gốc</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
