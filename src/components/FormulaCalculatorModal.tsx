import React, { useState, useEffect } from 'react';
import { Formula } from '../types';
import { MathView } from './MathView';
import { parseNumericInput } from '../utils/mathEngine';
import { X, Calculator, RefreshCw } from 'lucide-react';

interface Props {
  formula: Formula | null;
  onClose: () => void;
}

export const FormulaCalculatorModal: React.FC<Props> = ({ formula, onClose }) => {
  if (!formula || !formula.calculatorConfig) return null;

  const { inputs: inputDefs, output, calculate } = formula.calculatorConfig;
  
  // Track inputs as string to allow typing decimals like "0," or "2.5" naturally
  const [rawInputs, setRawInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    inputDefs.forEach((def) => {
      init[def.id] = String(def.defaultValue);
    });
    return init;
  });

  // Calculate parsed numerical inputs
  const numericInputs: Record<string, number> = {};
  inputDefs.forEach((def) => {
    numericInputs[def.id] = parseNumericInput(rawInputs[def.id]);
  });

  const [result, setResult] = useState<number>(() => {
    try {
      return calculate(numericInputs);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      const parsed: Record<string, number> = {};
      inputDefs.forEach((def) => {
        parsed[def.id] = parseNumericInput(rawInputs[def.id]);
      });
      setResult(calculate(parsed));
    } catch (e) {
      console.error('Calculation error:', e);
    }
  }, [rawInputs, formula]);

  const handleInputChange = (id: string, textVal: string) => {
    setRawInputs((prev) => ({
      ...prev,
      [id]: textVal
    }));
  };

  const handleReset = () => {
    const init: Record<string, string> = {};
    inputDefs.forEach((def) => {
      init[def.id] = String(def.defaultValue);
    });
    setRawInputs(init);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{formula.name}</h3>
              <div className="text-xs text-indigo-800">
                <MathView math={formula.formulaLatex} />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Inputs */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600">{formula.description}</p>

          <div className="space-y-3">
            {inputDefs.map((def) => (
              <div key={def.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label htmlFor={def.id} className="font-medium text-slate-700">
                    {def.label}
                  </label>
                  <span className="text-slate-400 font-mono">[{def.unit}]</span>
                </div>
                <div className="relative">
                  <input
                    id={def.id}
                    type="text"
                    inputMode="decimal"
                    value={rawInputs[def.id] ?? ''}
                    onChange={(e) => handleInputChange(def.id, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                  <div className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                    {def.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Result Card */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wider block mb-1">
              Kết quả tính toán thực tế (Tính bằng Code)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-teal-700">{output.label}:</span>
              <span className="text-2xl font-bold font-mono text-teal-900">
                {isNaN(result) ? '...' : result.toLocaleString('vi-VN', { maximumFractionDigits: 4 })}{' '}
                <span className="text-sm font-normal text-teal-700">{output.unit}</span>
              </span>
            </div>
          </div>

          {/* Condition notes */}
          {formula.conditions.length > 0 && (
            <div className="text-2xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
              <span className="font-semibold text-slate-700">Lưu ý điều kiện & đơn vị: </span>
              <span className="inline">
                {formula.conditions.map((cond, cIdx) => (
                  <span key={cIdx} className="inline">
                    <MathView math={cond} />
                    {cIdx < formula.conditions.length - 1 && <span className="mx-1.5 font-bold">·</span>}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Giá trị ban đầu</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
