import React, { useState } from 'react';
import { EXPERIMENTS } from '../data/experiments';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import {
  FlaskConical,
  ShieldAlert,
  Play,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ThiNghiemModule: React.FC = () => {
  const { navigate, context } = useAppNavigation();
  const { state, recordExperimentDone } = useLearningState();

  const [selectedExpId, setSelectedExpId] = useState<string>(
    context.experimentId || EXPERIMENTS[0].id
  );
  const activeExp = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionVal, setSelectedOptionVal] = useState<string>(
    activeExp.interactiveState ? String(activeExp.interactiveState.options[0].value) : ''
  );

  const isExpCompleted = state.completedExperiments.includes(activeExp.id);

  const handleSelectExp = (id: string) => {
    setSelectedExpId(id);
    setCurrentStepIndex(0);
    const exp = EXPERIMENTS.find((e) => e.id === id);
    if (exp?.interactiveState) {
      setSelectedOptionVal(String(exp.interactiveState.options[0].value));
    }
  };

  const handleComplete = () => {
    recordExperimentDone(activeExp.id);
  };

  // Find active interactive option
  const activeInteractiveOption = activeExp.interactiveState?.options.find(
    (opt) => String(opt.value) === selectedOptionVal
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Phòng Thí Nghiệm Ảo KHTN 8
        </h1>
        <p className="text-xs text-slate-500">
          Mô phỏng trực quan các thí nghiệm trong SGK KNTT & Cánh Diều, thao tác biến số và quan sát hiện tượng khoa học.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Experiment selector */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3 space-y-2">
          <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Các thí nghiệm ảo ({EXPERIMENTS.length})
          </div>

          {EXPERIMENTS.map((exp) => {
            const isActive = exp.id === activeExp.id;
            const completed = state.completedExperiments.includes(exp.id);

            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => handleSelectExp(exp.id)}
                className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 border border-teal-200 text-teal-950 font-medium shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <FlaskConical className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-mono">
                    <span>{exp.domain === 'HOA_HOC' ? 'Hóa học' : 'Vật lí'}</span>
                    {completed && <span className="text-emerald-600 font-bold">✓ Đã làm</span>}
                  </div>
                  <div className="font-semibold text-slate-900 truncate">
                    {exp.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Experiment Simulation Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-slate-500 font-semibold uppercase tracking-wider">
                  Thí nghiệm thực hành chuẩn SGK
                </span>
                <button
                  type="button"
                  onClick={handleComplete}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isExpCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isExpCompleted ? 'Đã hoàn thành (+40 XP)' : 'Xác nhận hoàn thành'}</span>
                </button>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{activeExp.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Mục tiêu: {activeExp.objective}
              </p>
            </div>

            {/* Interactive Simulation Stage */}
            {activeExp.interactiveState && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Bàn Thao Tác Mô Phỏng Tương Tác</span>
                  </div>
                  <span className="text-2xs text-slate-400 font-mono">Real-time Lab</span>
                </div>

                {/* Variable Selector */}
                <div>
                  <label className="block text-2xs text-slate-400 mb-2 font-medium">
                    {activeExp.interactiveState.variableName}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {activeExp.interactiveState.options.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => setSelectedOptionVal(String(opt.value))}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer font-medium ${
                          selectedOptionVal === String(opt.value)
                            ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                            : 'bg-slate-700/80 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Canvas Representation */}
                <div className="h-44 rounded-xl bg-slate-950/80 border border-slate-700/60 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  {/* Schematic Visual States */}
                  {activeExp.id === 'EXP_HOA_FE_S' && (
                    <div className="space-y-3">
                      {selectedOptionVal === 'before_heat' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-slate-900 font-bold text-2xs">
                              Fe (hút)
                            </div>
                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-bold text-2xs">
                              S (vàng)
                            </div>
                            <div className="w-12 h-6 bg-red-600 rounded flex items-center justify-center text-white text-2xs font-bold shadow-sm">
                              [ N | S ]
                            </div>
                          </div>
                          <span className="text-xs text-slate-300">Nam châm hút các hạt sắt Fe rời khỏi bột lưu huỳnh S.</span>
                        </div>
                      )}
                      {selectedOptionVal === 'heating' && (
                        <div className="space-y-2 animate-pulse">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300 mx-auto flex items-center justify-center text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/50">
                            900 °C
                          </div>
                          <span className="text-xs text-amber-300 font-medium">Hỗn hợp phát sáng nóng đỏ dữ dội, toả nhiều nhiệt năng!</span>
                        </div>
                      )}
                      {selectedOptionVal === 'after_heat' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-stone-700 border-2 border-stone-500 flex items-center justify-center text-stone-200 font-bold text-xs">
                              FeS rắn
                            </div>
                            <div className="w-12 h-6 bg-red-600 rounded flex items-center justify-center text-white text-2xs font-bold opacity-60">
                              [ N | S ]
                            </div>
                          </div>
                          <span className="text-xs text-emerald-300 font-medium">Hoàn toàn không bị hút bởi nam châm → Hợp chất FeS mới đã hình thành.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {activeExp.id === 'EXP_LY_ARCHIMEDES' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-6">
                        <div className="w-14 h-24 rounded-b-xl border-2 border-cyan-400/80 bg-cyan-500/20 relative flex items-center justify-center">
                          <div className="w-8 h-8 rounded bg-slate-300 text-slate-900 font-bold text-2xs flex items-center justify-center shadow-xs">
                            Vật
                          </div>
                        </div>
                        <div className="text-left text-xs font-mono space-y-1">
                          <div>P ngoài không khí: <span className="text-amber-400">1,8 N</span></div>
                          <div>Lực kế chỉ lúc này: <span className="text-cyan-400">{selectedOptionVal === 'water' ? '1,0 N' : selectedOptionVal === 'salt_water' ? '0,92 N' : '1,17 N'}</span></div>
                          <div>Lực đẩy FA: <span className="text-emerald-400 font-bold">{selectedOptionVal === 'water' ? '0,80 N' : selectedOptionVal === 'salt_water' ? '0,88 N' : '0,63 N'}</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeExp.id === 'EXP_LY_AP_SUAT_CAT' && (
                    <div className="space-y-2">
                      <div className="h-16 w-64 bg-amber-200/80 rounded-b-lg border-b-4 border-amber-400 mx-auto relative flex items-end justify-center pb-1">
                        {selectedOptionVal === 'large_face' && (
                          <div className="w-28 h-6 bg-slate-700 text-white text-2xs font-bold flex items-center justify-center rounded-xs shadow-sm">
                            Mặt rộng (Lún 3mm)
                          </div>
                        )}
                        {selectedOptionVal === 'small_face' && (
                          <div className="w-10 h-16 bg-slate-700 text-white text-2xs font-bold flex items-center justify-center rounded-xs shadow-sm -mb-2">
                            Lún 12mm
                          </div>
                        )}
                        {selectedOptionVal === 'stacked_small_face' && (
                          <div className="w-10 h-24 bg-slate-800 text-white text-2xs font-bold flex items-center justify-center rounded-xs shadow-md -mb-4">
                            2 Khối (24mm)
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-slate-300">Diện tích nhỏ hoặc áp lực tăng làm độ lún tăng rõ rệt.</span>
                    </div>
                  )}

                  {activeExp.id === 'EXP_HOA_PH_TEST' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md transition-all duration-300 ${
                            selectedOptionVal === 'lemon'
                              ? 'bg-rose-600'
                              : selectedOptionVal === 'vinegar'
                              ? 'bg-orange-500'
                              : selectedOptionVal === 'pure_water'
                              ? 'bg-emerald-500'
                              : selectedOptionVal === 'baking_soda'
                              ? 'bg-sky-600'
                              : 'bg-purple-700'
                          }`}
                        >
                          {selectedOptionVal === 'lemon'
                            ? 'pH 2,5'
                            : selectedOptionVal === 'vinegar'
                            ? 'pH 3,0'
                            : selectedOptionVal === 'pure_water'
                            ? 'pH 7,0'
                            : selectedOptionVal === 'baking_soda'
                            ? 'pH 8,5'
                            : 'pH 11,5'}
                        </div>
                      </div>
                      <span className="text-xs text-slate-300">Màu giấy pH đổi tức thì theo nồng độ ion H+ / OH-.</span>
                    </div>
                  )}
                </div>

                {/* Explanation Output */}
                {activeInteractiveOption && (
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-700 text-xs text-teal-200">
                    <span className="font-semibold text-white">Hiện tượng: </span>
                    {activeInteractiveOption.resultText}
                  </div>
                )}
              </div>
            )}

            {/* Apparatus & Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-2xs block">
                  Dụng cụ & Hoá chất cần chuẩn bị:
                </span>
                <ul className="space-y-1 text-slate-600 pl-4 list-disc">
                  {activeExp.apparatus.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2 text-rose-900">
                <span className="font-bold uppercase tracking-wider text-2xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Quy tắc an toàn PTN:</span>
                </span>
                <ul className="space-y-1 text-2xs pl-4 list-disc text-rose-800">
                  {activeExp.safetyNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Procedure */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Các bước tiến hành & Giải thích khoa học:
              </h3>

              <div className="space-y-3">
                {activeExp.steps.map((st) => (
                  <div key={st.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-2xs">
                        {st.step}
                      </span>
                      <span>Thao tác: {st.action}</span>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-100 space-y-1">
                      <p>
                        <span className="font-semibold text-teal-800">Hiện tượng quan sát: </span>
                        {st.observation}
                      </p>
                      <p>
                        <span className="font-semibold text-indigo-800">Giải thích bản chất: </span>
                        {st.scientificExplanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
