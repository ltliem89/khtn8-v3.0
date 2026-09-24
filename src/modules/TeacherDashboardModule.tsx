import React, { useState } from 'react';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import { KNOWLEDGE_NODES, CONTENT_PACKS } from '../data/knowledgeGraph';
import { FORMULAS } from '../data/formulas';
import { getMasteryTierInfo } from '../utils/masteryEngine';
import { MathView } from '../components/MathView';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  ShieldAlert,
  ArrowRight,
  Filter,
  FileSpreadsheet,
  Download,
  BookOpen,
  Sparkles,
  Award
} from 'lucide-react';

export const TeacherDashboardModule: React.FC = () => {
  const { state, setCurriculum } = useLearningState();
  const { navigate } = useAppNavigation();

  const [domainFilter, setDomainFilter] = useState<'ALL' | 'HOA_HOC' | 'VAT_LI' | 'SINH_HOC'>('ALL');

  // Compute node mastery list
  const nodeData = KNOWLEDGE_NODES.map((node) => {
    const record = state.nodeMastery?.[node.id] || {
      knowledgeId: node.id,
      correctCount: 0,
      incorrectCount: 0,
      attemptCount: 0,
      consecutiveStreak: 0,
      hintUsedCount: 0,
      totalResponseTimeMs: 0,
      lastReviewedTimestamp: Date.now(),
      masteryScore: 0,
      tier: 'NOT_STARTED',
      reviewPriority: 'HIGH'
    };

    const tierInfo = getMasteryTierInfo(record.tier);

    return {
      ...node,
      record,
      tierInfo,
      needsIntervention: record.masteryScore < 50 && record.attemptCount > 0
    };
  });

  const filteredNodes =
    domainFilter === 'ALL'
      ? nodeData
      : nodeData.filter((n) => n.domain === domainFilter);

  // Summary Metrics
  const totalNodes = nodeData.length;
  const masteredCount = nodeData.filter((n) => n.record.masteryScore >= 70).length;
  const weakCount = nodeData.filter((n) => n.needsIntervention).length;
  const overallAvg = Math.round(
    nodeData.reduce((acc, n) => acc + n.record.masteryScore, 0) / (totalNodes || 1)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Teacher & Parent Dashboard · Blueprint Section 23</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Bản Đồ Năng Lực & Giám Sát Lỗ Hổng Kiến Thức
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi chính xác chỉ số Mastery từng Knowledge Node, phát hiện sớm học sinh cần can thiệp trước khi thi định kỳ.
          </p>
        </div>

        {/* Content Pack Selector (Blueprint Section 26) */}
        <div className="flex items-center gap-2">
          <span className="text-2xs font-semibold text-slate-500">Bộ sách (Content Pack):</span>
          <select
            value={state.curriculumPreference}
            onChange={(e) => setCurriculum(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-2xs cursor-pointer"
          >
            {CONTENT_PACKS.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name} ({pack.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Điểm Mastery Trung Bình
            </span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{overallAvg}%</div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${overallAvg}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Kiến Thức Đạt Chuẩn (≥70%)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {masteredCount} / {totalNodes}
          </div>
          <p className="text-2xs text-slate-500">
            {Math.round((masteredCount / totalNodes) * 100)}% chương trình đã vững
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Lỗ Hổng Cần Can Thiệp
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{weakCount} Node</div>
          <p className="text-2xs text-slate-500">
            {weakCount > 0 ? 'Cần giáo viên/hệ thống hỗ trợ' : 'Không có lỗ hổng báo động'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500">
              Sổ Tay Câu Sai Tích Lũy
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {state.errorNotebook.length} lỗi
          </div>
          <p className="text-2xs text-slate-500">
            {state.errorNotebook.filter((e) => e.resolved).length} lỗi đã phục hồi thành công
          </p>
        </div>
      </div>

      {/* Filter Tabs by Subject Domain */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Phân loại phân môn:</span>
          {(['ALL', 'HOA_HOC', 'VAT_LI', 'SINH_HOC'] as const).map((dom) => {
            const labels = {
              ALL: 'Tất cả phân môn',
              HOA_HOC: 'Hóa học',
              VAT_LI: 'Vật lí',
              SINH_HOC: 'Sinh học'
            };
            return (
              <button
                key={dom}
                type="button"
                onClick={() => setDomainFilter(dom)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  domainFilter === dom
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {labels[dom]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate({ tab: 'on_tap' })}
          className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tạo Phiên Ôn Củng Cố</span>
        </button>
      </div>

      {/* KNOWLEDGE HEATMAP TABLE (Blueprint Section 23) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Bản Đồ Thành Thạo Tri Thức (Knowledge Node Heatmap)
          </h3>
          <span className="text-2xs text-slate-500">
            Hiển thị {filteredNodes.length} node kiến thức
          </span>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredNodes.map((item) => {
            const score = item.record.masteryScore;
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                  item.needsIntervention ? 'bg-rose-50/30' : 'hover:bg-slate-50/60'
                }`}
              >
                {/* Node info */}
                <div className="space-y-1.5 flex-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.id}
                    </span>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.chapterTitle}
                    </span>
                    <span
                      className={`text-2xs font-semibold px-2 py-0.5 rounded border ${item.tierInfo.badgeClass}`}
                    >
                      {item.tierInfo.label} ({score}%)
                    </span>
                    {item.needsIntervention && (
                      <span className="text-2xs font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Cần can thiệp
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>

                  {/* Connected Formulas */}
                  {item.formulaIds.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-2xs text-slate-400 font-semibold">Công thức:</span>
                      {item.formulaIds.map((fId) => {
                        const formula = FORMULAS.find((f) => f.id === fId);
                        return (
                          <span
                            key={fId}
                            className="text-2xs px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
                          >
                            <MathView math={formula?.formulaLatex || fId} />
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Progress bar visualizer (Section 23 ASCII style in UI) */}
                <div className="w-full lg:w-64 space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between text-2xs font-mono">
                    <span className="text-slate-500">
                      {item.record.correctCount} đúng / {item.record.attemptCount} làm
                    </span>
                    <strong
                      style={{ color: item.tierInfo.colorHex }}
                      className="font-bold"
                    >
                      {score}%
                    </strong>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor: item.tierInfo.colorHex
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-3xs text-slate-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>70% (Chuẩn)</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Remediation Action button */}
                <div className="shrink-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => navigate({ tab: 'on_tap' })}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/50 text-slate-700 hover:text-teal-900 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Luyện Node này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
