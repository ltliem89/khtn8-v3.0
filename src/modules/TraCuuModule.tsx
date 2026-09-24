import React, { useState } from 'react';
import { useAppNavigation } from '../context/NavigationContext';
import { CONCEPTS } from '../data/concepts';
import { FORMULAS } from '../data/formulas';
import { LESSONS } from '../data/curriculum';
import { EXPERIMENTS } from '../data/experiments';
import { REAL_WORLD_ITEMS } from '../data/realWorld';
import { MathView } from '../components/MathView';
import {
  Search,
  BookOpen,
  Binary,
  FlaskConical,
  Globe2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const TraCuuModule: React.FC = () => {
  const { navigate } = useAppNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.trim().toLowerCase();

  const matchedConcepts = CONCEPTS.filter(
    (c) =>
      !query ||
      c.term.toLowerCase().includes(query) ||
      c.definition.toLowerCase().includes(query)
  );

  const matchedFormulas = FORMULAS.filter(
    (f) =>
      !query ||
      f.name.toLowerCase().includes(query) ||
      f.formulaLatex.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
  );

  const matchedLessons = LESSONS.filter(
    (l) =>
      !query ||
      l.title.toLowerCase().includes(query) ||
      l.chapterTitle.toLowerCase().includes(query) ||
      l.summary.some((s) => s.toLowerCase().includes(query))
  );

  const matchedExperiments = EXPERIMENTS.filter(
    (e) =>
      !query ||
      e.title.toLowerCase().includes(query) ||
      e.objective.toLowerCase().includes(query)
  );

  const matchedRealWorld = REAL_WORLD_ITEMS.filter(
    (rw) =>
      !query ||
      rw.title.toLowerCase().includes(query) ||
      rw.scientificMechanism.toLowerCase().includes(query)
  );

  const totalResults =
    matchedConcepts.length +
    matchedFormulas.length +
    matchedLessons.length +
    matchedExperiments.length +
    matchedRealWorld.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Tra Cứu Khoa Học Tự Nhiên 8
        </h1>
        <p className="text-xs text-slate-500">
          Tìm kiếm nhanh các khái niệm, công thức toán học, bài học SGK, thí nghiệm ảo và ứng dụng thực tiễn.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            autoFocus
            placeholder="Nhập từ khoá tra cứu (ví dụ: mol, áp suất, đòn bẩy, hồng cầu, vôi tôi, Archimedes)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
          />
        </div>

        {/* Quick query chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-2xs">
          <span className="text-slate-400 font-medium">Gợi ý tìm kiếm:</span>
          {['mol', 'áp suất', 'Archimedes', 'nồng độ', 'pH', 'đòn bẩy', 'nhóm máu', 'dẫn nhiệt', 'vôi sống'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchTerm(tag)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 font-medium">
        Tìm thấy <span className="font-bold text-slate-900">{totalResults}</span> mục phù hợp
      </div>

      {/* Results Sections */}
      <div className="space-y-6">
        {/* Section 1: Concepts */}
        {matchedConcepts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Khái Niệm & Định Nghĩa ({matchedConcepts.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedConcepts.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate({ tab: 'ly_thuyet', context: { lessonId: c.lessonId } })}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {c.term}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {c.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Formulas */}
        {matchedFormulas.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Binary className="w-4 h-4 text-indigo-600" />
              <span>Công Thức & Đại Lượng ({matchedFormulas.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedFormulas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate({ tab: 'cong_thuc', id: f.id })}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {f.name}
                    </h3>
                    <div className="text-xs font-bold text-indigo-700">
                      <MathView math={f.formulaLatex} />
                    </div>
                  </div>
                  <p className="text-2xs text-slate-600 line-clamp-2">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Experiments */}
        {matchedExperiments.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-cyan-600" />
              <span>Thí Nghiệm Ảo ({matchedExperiments.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedExperiments.map((e) => (
                <div
                  key={e.id}
                  onClick={() => navigate({ tab: 'thi_nghiem', context: { experimentId: e.id } })}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-400 hover:shadow-xs transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {e.title}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600 transition-colors" />
                  </div>
                  <p className="text-2xs text-slate-500 line-clamp-1">
                    Mục tiêu: {e.objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Real world */}
        {matchedRealWorld.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              <span>Ứng Dụng Thực Tiễn ({matchedRealWorld.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matchedRealWorld.map((rw) => (
                <div
                  key={rw.id}
                  onClick={() => navigate({ tab: 'thuc_tien', id: rw.id })}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {rw.title}
                    </h3>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <p className="text-2xs text-slate-500 line-clamp-2">
                    {rw.overview}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
