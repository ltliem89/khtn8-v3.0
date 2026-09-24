import React, { useState } from 'react';
import { UNITS } from '../data/units';
import { UnitItem } from '../types';
import { Scale, ArrowRightLeft, AlertTriangle, Check, BookOpen } from 'lucide-react';

export const DonViModule: React.FC = () => {
  const [selectedQuantity, setSelectedQuantity] = useState<'THE_TICH' | 'KHOI_LUONG' | 'AP_SUAT' | 'DIEN'>('THE_TICH');
  const [inputValue, setInputValue] = useState<number>(1);
  const [inputUnit, setInputUnit] = useState<string>('m3');

  // Convert logic
  const getConversions = (qty: typeof selectedQuantity, val: number, unit: string) => {
    if (qty === 'THE_TICH') {
      // Base in Liters
      let baseLiters = val;
      if (unit === 'm3') baseLiters = val * 1000;
      else if (unit === 'cm3' || unit === 'mL') baseLiters = val / 1000;
      else if (unit === 'L') baseLiters = val;

      return [
        { name: 'Mét khối (m³)', value: baseLiters / 1000, unit: 'm³' },
        { name: 'Lít (L) / Đềximét khối (dm³)', value: baseLiters, unit: 'L' },
        { name: 'Mililít (mL) / Xentimét khối (cm³)', value: baseLiters * 1000, unit: 'mL' }
      ];
    }

    if (qty === 'KHOI_LUONG') {
      // Base in kg
      let baseKg = val;
      if (unit === 'g') baseKg = val / 1000;
      else if (unit === 'kg') baseKg = val;
      else if (unit === 'tan') baseKg = val * 1000;

      return [
        { name: 'Tấn', value: baseKg / 1000, unit: 'tấn' },
        { name: 'Kilôgam (kg)', value: baseKg, unit: 'kg' },
        { name: 'Gam (g)', value: baseKg * 1000, unit: 'g' }
      ];
    }

    if (qty === 'AP_SUAT') {
      // Base in Pa
      let basePa = val;
      if (unit === 'Pa') basePa = val;
      else if (unit === 'bar') basePa = val * 100000;
      else if (unit === 'atm') basePa = val * 101300;
      else if (unit === 'mmHg') basePa = val * 133.3;

      return [
        { name: 'Paxcan (Pa = N/m²)', value: basePa, unit: 'Pa' },
        { name: 'Bar', value: basePa / 100000, unit: 'bar' },
        { name: 'Atmôphe (atm)', value: basePa / 101300, unit: 'atm' },
        { name: 'Milimét thuỷ ngân (mmHg)', value: basePa / 133.3, unit: 'mmHg' }
      ];
    }

    // DIEN (I or U)
    let baseAmpe = val;
    if (unit === 'mA') baseAmpe = val / 1000;
    else if (unit === 'A') baseAmpe = val;

    return [
      { name: 'Ampe (A)', value: baseAmpe, unit: 'A' },
      { name: 'Miliampe (mA)', value: baseAmpe * 1000, unit: 'mA' }
    ];
  };

  const convertedResults = getConversions(selectedQuantity, inputValue, inputUnit);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Đơn Vị Đo Lường & Công Cụ Đổi Đơn Vị KHTN 8
        </h1>
        <p className="text-xs text-slate-500">
          Chuyển đổi tức thì giữa các đơn vị đo chuẩn SI và đơn vị thực tế trong các bài tập tính toán.
        </p>
      </div>

      {/* Interactive Converter Tool */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
          <ArrowRightLeft className="w-4 h-4" />
          <span>Công Cụ Đổi Đơn Vị Nhanh</span>
        </div>

        {/* Quantity Select Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'THE_TICH', label: 'Thể tích (V)', defaultUnit: 'm3' },
            { id: 'KHOI_LUONG', label: 'Khối lượng (m)', defaultUnit: 'kg' },
            { id: 'AP_SUAT', label: 'Áp suất (p)', defaultUnit: 'Pa' },
            { id: 'DIEN', label: 'Dòng điện (I)', defaultUnit: 'A' }
          ].map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setSelectedQuantity(q.id as any);
                setInputUnit(q.defaultUnit);
              }}
              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                selectedQuantity === q.id
                  ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input & Unit Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="sm:col-span-2">
            <label htmlFor="unit-val" className="block text-2xs font-semibold text-slate-600 mb-1">
              Nhập giá trị cần đổi:
            </label>
            <input
              id="unit-val"
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-base font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="unit-sel" className="block text-2xs font-semibold text-slate-600 mb-1">
              Đơn vị ban đầu:
            </label>
            <select
              id="unit-sel"
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {selectedQuantity === 'THE_TICH' && (
                <>
                  <option value="m3">Mét khối (m³)</option>
                  <option value="L">Lít (L / dm³)</option>
                  <option value="mL">Mililít (mL / cm³)</option>
                </>
              )}
              {selectedQuantity === 'KHOI_LUONG' && (
                <>
                  <option value="tan">Tấn</option>
                  <option value="kg">Kilôgam (kg)</option>
                  <option value="g">Gam (g)</option>
                </>
              )}
              {selectedQuantity === 'AP_SUAT' && (
                <>
                  <option value="Pa">Paxcan (Pa)</option>
                  <option value="bar">Bar (10⁵ Pa)</option>
                  <option value="atm">Atmôphe (atm)</option>
                  <option value="mmHg">Milimét thuỷ ngân (mmHg)</option>
                </>
              )}
              {selectedQuantity === 'DIEN' && (
                <>
                  <option value="A">Ampe (A)</option>
                  <option value="mA">Miliampe (mA)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Live Conversion Output */}
        <div className="space-y-2">
          <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500 block">
            Kết quả quy đổi tương đương:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {convertedResults.map((res, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-teal-200 shadow-2xs">
                <span className="text-2xs text-slate-500 block">{res.name}</span>
                <span className="text-lg font-bold font-mono text-teal-900 block mt-1">
                  {res.value.toLocaleString('vi-VN', { maximumFractionDigits: 6 })}{' '}
                  <span className="text-xs font-normal text-teal-700">{res.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dictionary of Units in KHTN 8 */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Bảng Tra Cứu Các Đơn Vị Thường Dùng & Các Bẫy Đổi Đơn Vị
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UNITS.map((u) => (
            <div key={u.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-900">{u.name}</h3>
                <span className="font-mono text-xs font-bold text-teal-700">{u.symbol}</span>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-medium text-slate-700">Đại lượng: </span>
                <span>{u.quantity}</span> (Chuẩn SI: <span className="font-mono font-semibold">{u.baseSI}</span>)
              </div>

              {/* Conversion Factors */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-2xs font-mono text-slate-700">
                {u.conversions.map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between">
                    <span>{c.to}</span>
                    {c.note && <span className="text-slate-400 font-sans">({c.note})</span>}
                  </div>
                ))}
              </div>

              {/* Common Exam Pitfalls */}
              <div className="text-2xs text-rose-800 bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/60 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-semibold">Bẫy điểm thi: </span>
                  {u.commonErrors}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
