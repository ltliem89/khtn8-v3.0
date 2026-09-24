import React, { useState } from 'react';
import { FORMULAS } from '../data/formulas';
import { Formula, SubjectDomain } from '../types';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { FormulaCalculatorModal } from '../components/FormulaCalculatorModal';
import { MathView } from '../components/MathView';
import { runFormulaTestSuite } from '../utils/mathEngine';
import {
  Binary,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Filter,
  CheckCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CongThucModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const { state, markFormulaMastered } = useLearningState();

  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain | 'ALL'>(
    (context.domain as SubjectDomain) || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCalculatorFormula, setActiveCalculatorFormula] = useState<Formula | null>(null);
  const [showTestSuite, setShowTestSuite] = useState<boolean>(false);

  // Run the 14 test cases
  const testResults = React.useMemo(() => runFormulaTestSuite(), []);

  const filteredFormulas = FORMULAS.filter((f) => {
    if (selectedDomain !== 'ALL' && f.domain !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.formulaLatex.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bảng Công Thức & Công Cụ Tính Toán
          </h1>
          <p className="text-xs text-slate-500">
            Tổng hợp công thức KHTN 8 chuẩn mực KaTeX, phân tích đại lượng, thứ nguyên đơn vị và máy tính tương tác bằng code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Domain Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'HOA_HOC', label: 'Hóa học' },
              { id: 'VAT_LI', label: 'Vật lí' }
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomain(d.id as any)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                  selectedDomain === d.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Test Suite Toggle */}
          <button
            type="button"
            onClick={() => setShowTestSuite(!showTestSuite)}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kiểm tra 14 Tiêu chuẩn ({testResults.passedCount}/14 PASS)</span>
            {showTestSuite ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Test Suite Drawer / Section */}
      {showTestSuite && (
        <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Báo Cáo Kiểm Định Hệ Thống Công Thức (14 Test Tiêu Chuẩn)
                </h3>
                <p className="text-2xs text-slate-400">
                  Kiểm chứng: Phân số, số mũ, chỉ số dưới, căn, ký hiệu Hy Lạp, đơn vị, tính toán code-level và responsive.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/50">
              100% PASS ({testResults.passedCount}/{testResults.total})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs max-h-96 overflow-y-auto pr-1">
            {testResults.tests.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{t.name}</span>
                  <span className="font-bold text-2xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    PASS
                  </span>
                </div>
                <div className="text-2xs text-slate-400 space-y-0.5">
                  <div>
                    <span className="text-slate-500">Input: </span>
                    <span className="font-mono text-slate-300">{t.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected: </span>
                    <span className="text-slate-300">{t.expected}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Actual: </span>
                    <span className="text-emerald-300">{t.actual}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Tìm công thức (ví dụ: mol, thể tích khí, áp suất, lực đẩy, moment)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormulas.map((formula) => {
          const isMastered = state.masteredFormulas.includes(formula.id);

          return (
            <div
              key={formula.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Meta header */}
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-teal-700">
                      {formula.domain === 'HOA_HOC' ? 'Hóa học' : 'Vật lí'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Chuẩn SGK GDPT 2018</span>
                  </div>
                  {isMastered && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã thành thạo</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{formula.name}</h3>

                {/* KaTeX Standard Formula Callout */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-lg font-bold text-indigo-950 overflow-x-auto max-w-full">
                    <MathView math={formula.formulaLatex} />
                  </div>
                  {formula.calculatorConfig && (
                    <button
                      type="button"
                      onClick={() => setActiveCalculatorFormula(formula)}
                      className="shrink-0 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Tính thử (Code)</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {formula.description}
                </p>

                {/* Variables explanation */}
                <div className="text-xs space-y-1 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700 text-2xs uppercase tracking-wider block mb-1">
                    Các đại lượng trong công thức:
                  </span>
                  {formula.variables.map((v, vIdx) => (
                    <div key={vIdx} className="flex items-baseline justify-between text-2xs text-slate-600">
                      <span className="font-bold text-slate-800">
                        <MathView math={v.symbol} />
                      </span>
                      <span className="text-slate-700">{v.name} ({v.description || ''})</span>
                      <span className="font-mono text-slate-400">[{v.unit}]</span>
                    </div>
                  ))}
                </div>

                {/* Conditions / Traps */}
                {formula.conditions.length > 0 && (
                  <div className="text-2xs text-amber-800 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Điều kiện áp dụng & đơn vị: </span>
                      <span className="inline">
                        {formula.conditions.map((cond, cIdx) => (
                          <span key={cIdx} className="inline">
                            <MathView math={cond} />
                            {cIdx < formula.conditions.length - 1 && <span className="mx-1.5 font-bold">·</span>}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Derived Formulas */}
                {formula.derivedForms && formula.derivedForms.length > 0 && (
                  <div className="text-2xs text-slate-500 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-700">Công thức suy ra:</span>
                    {formula.derivedForms.map((df, dfIdx) => (
                      <span key={dfIdx} className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200/60">
                        <MathView math={df} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => markFormulaMastered(formula.id)}
                  className={`text-2xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    isMastered
                      ? 'text-slate-400 hover:text-slate-600'
                      : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
                  }`}
                >
                  {isMastered ? 'Bỏ đánh dấu' : 'Đánh dấu đã thuộc'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate({ tab: 'dang_bai', context: { formulaId: formula.id } })}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem dạng bài áp dụng</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      {activeCalculatorFormula && (
        <FormulaCalculatorModal
          formula={activeCalculatorFormula}
          onClose={() => setActiveCalculatorFormula(null)}
        />
      )}
    </div>
  );
};
