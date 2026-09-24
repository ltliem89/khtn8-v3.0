import React, { useState, useEffect, useMemo } from 'react';
import { useLearningState } from '../context/LearningStateContext';
import { useAppNavigation } from '../context/NavigationContext';
import {
  GAME_QUESTS,
  BOSS_BATTLES,
  TIMED_CHALLENGES,
  KNOWLEDGE_NODES
} from '../data/knowledgeGraph';
import { FORMULAS } from '../data/formulas';
import {
  Quest,
  BossBattle,
  TimedChallenge,
  KnowledgeNode,
  QuestType,
  ReviewRecoveryTicket,
  ScienceCard,
  RepairMission,
  DailyAdventure
} from '../types/blueprint';
import {
  calculateLevelFromXP,
  getMasteryTierInfo
} from '../utils/masteryEngine';
import {
  evaluateGameNodeState,
  getGameNodeStateMeta,
  evaluateQuestUnlock,
  evaluateBossUnlock,
  createReviewRecoveryTicket,
  getQuestTypeMeta,
  getBossStageTypeMeta,
  calculateScientistRank,
  generateScienceCards,
  generateRepairMission,
  generateDailyAdventure
} from '../utils/gameEngine';
import { GameplaySceneView } from '../components/gameV4/GameplaySceneView';
import { MathView } from '../components/MathView';
import {
  Compass,
  Shield,
  Swords,
  Award,
  Flame,
  Zap,
  Heart,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Clock,
  Target,
  Check,
  X,
  ExternalLink,
  Layers,
  Lightbulb,
  Binary,
  HelpCircle,
  Info,
  Calendar,
  Coffee,
  Bookmark,
  Activity,
  FileCheck
} from 'lucide-react';

type GameTab = 'GAMEPLAY_SCENE' | 'MAP' | 'QUESTS' | 'REPAIR' | 'CARDS' | 'DAILY' | 'BOSSES' | 'EVENTS';

export const GameWorldModule: React.FC = () => {
  const {
    state,
    recordNodeAttempt,
    updateQuestStage,
    completeQuest,
    recordBossDefeat,
    completeDailyMission,
    recordLearningEvent,
    unlockScienceCard,
    completeRepairMission
  } = useLearningState();
  const { navigate } = useAppNavigation();

  // Primary Sub-Tab (v4.0 Gameplay-First Architecture)
  const [activeTab, setActiveTab] = useState<GameTab>('GAMEPLAY_SCENE');

  // Active Zone Filter
  const [selectedZone, setSelectedZone] = useState<'ALL' | 'KHU_A' | 'KHU_B' | 'KHU_C' | 'FINAL_AREA'>('ALL');

  // Filter for Quest Type in Quest Engine
  const [selectedQuestType, setSelectedQuestType] = useState<'ALL' | QuestType>('ALL');

  // Transparency Assistant Modal / Drawer
  const [showTransparencyHelp, setShowTransparencyHelp] = useState(false);

  // Healthy Session Rest Confirmation Modal (Section 36 & 37)
  const [showSessionRestModal, setShowSessionRestModal] = useState(false);

  // Progressive Reveal Modal for Knowledge Node in Tab 1
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [revealStep, setRevealStep] = useState<1 | 2 | 3 | 4>(1);

  // Interactive Quest Player State (Tab 2)
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [questStageIdx, setQuestStageIdx] = useState(0);
  const [questChoiceIdx, setQuestChoiceIdx] = useState<number | null>(null);
  const [questAnswered, setQuestAnswered] = useState(false);
  const [questHintLevel, setQuestHintLevel] = useState<0 | 1 | 2>(0);
  const [questCombo, setQuestCombo] = useState(0);
  const [questTicket, setQuestTicket] = useState<ReviewRecoveryTicket | null>(null);
  const [questCompletedJustNow, setQuestCompletedJustNow] = useState(false);

  // Repair Mission Player State (Tab 3: Error as Quest)
  const [activeRepair, setActiveRepair] = useState<RepairMission | null>(null);
  const [repairStepIdx, setRepairStepIdx] = useState(0);
  const [repairChoiceIdx, setRepairChoiceIdx] = useState<number | null>(null);
  const [repairAnswered, setRepairAnswered] = useState(false);
  const [repairFinished, setRepairFinished] = useState(false);

  // Daily Adventure State (Tab 5: 5-10m Core Session)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dailyAdventure = useMemo(() => {
    return generateDailyAdventure(todayStr, state.nodeMastery || {});
  }, [todayStr, state.nodeMastery]);
  const [dailyStepIdx, setDailyStepIdx] = useState(0);
  const [dailyChoiceIdx, setDailyChoiceIdx] = useState<number | null>(null);
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [dailySessionFinished, setDailySessionFinished] = useState(false);

  // Active Science Card Detail Modal (Tab 4)
  const [selectedScienceCard, setSelectedScienceCard] = useState<ScienceCard | null>(null);

  // Boss Battle State (Tab 6: 5-Phase Boss Arena)
  const [activeBoss, setActiveBoss] = useState<BossBattle | null>(null);
  const [bossRoundIndex, setBossRoundIndex] = useState(0);
  const [bossHp, setBossHp] = useState(500);
  const [playerHp, setPlayerHp] = useState(3);
  const [selectedBossChoice, setSelectedBossChoice] = useState<number | null>(null);
  const [isBossAnswered, setIsBossAnswered] = useState(false);
  const [bossLog, setBossLog] = useState<string[]>([]);
  const [bossResult, setBossResult] = useState<'IN_PROGRESS' | 'VICTORY' | 'DEFEAT'>('IN_PROGRESS');
  const [bossDefeatTicket, setBossDefeatTicket] = useState<ReviewRecoveryTicket | null>(null);

  // Calculated Scientist Identity
  const levelInfo = calculateLevelFromXP(state.totalXP);
  const scientistRank = calculateScientistRank(state.totalXP, (state.discoveredCards || []).length);

  // Science Cards list
  const scienceCards = useMemo(() => {
    return generateScienceCards(KNOWLEDGE_NODES, state.nodeMastery || {}, state.discoveredCards || []);
  }, [state.nodeMastery, state.discoveredCards]);

  const unlockedCardsCount = useMemo(() => {
    return scienceCards.filter((c) => c.unlocked).length;
  }, [scienceCards]);

  // Overall mastery calculation
  const nodeRecords = Object.values(state.nodeMastery || {});
  const avgMastery =
    nodeRecords.length > 0
      ? Math.round(nodeRecords.reduce((acc, r) => acc + r.masteryScore, 0) / nodeRecords.length)
      : 50;

  // Filtered lists
  const filteredNodes = useMemo(() => {
    if (selectedZone === 'ALL') return KNOWLEDGE_NODES;
    if (selectedZone === 'KHU_A') return KNOWLEDGE_NODES.filter((n) => n.domain === 'HOA_HOC');
    if (selectedZone === 'KHU_B') return KNOWLEDGE_NODES.filter((n) => n.domain === 'VAT_LI');
    if (selectedZone === 'KHU_C') return KNOWLEDGE_NODES.filter((n) => n.domain === 'SINH_HOC');
    return KNOWLEDGE_NODES.filter((n) => n.domain === 'CHUNG' || n.domain === 'VAT_LI' || n.domain === 'HOA_HOC');
  }, [selectedZone]);

  const filteredQuests = useMemo(() => {
    return GAME_QUESTS.filter((q) => {
      const matchZone = selectedZone === 'ALL' || q.zoneId === selectedZone;
      const matchType = selectedQuestType === 'ALL' || q.questType === selectedQuestType;
      return matchZone && matchType;
    });
  }, [selectedZone, selectedQuestType]);

  const filteredBosses = useMemo(() => {
    if (selectedZone === 'ALL') return BOSS_BATTLES;
    return BOSS_BATTLES.filter((b) => b.zoneId === selectedZone);
  }, [selectedZone]);

  // Available Repair Missions based on Error Notebook or Low Mastery Nodes
  const repairMissions = useMemo(() => {
    const list: RepairMission[] = [];
    // From recent errors
    (state.errorNotebook || []).slice(0, 3).forEach((err) => {
      const mission = generateRepairMission(
        err.id,
        err.category === 'FORMULA' ? 'Công Thức & Biến Đổi' : 'Khái Niệm Trọng Tâm',
        err.questionText
      );
      list.push(mission);
    });
    // Add default repairs if list is small
    if (list.length < 2) {
      list.push(
        generateRepairMission(
          'KN_HOA_02',
          'Thể Tích Mol Chất Khí (24,79 L)',
          'Nhầm lẫn giữa điều kiện chuẩn cũ 22,4 L và chuẩn mới IUPAC 24,79 L.'
        )
      );
      list.push(
        generateRepairMission(
          'KN_VAT_02',
          'Áp Suất Chất Lỏng (p = d · h)',
          'Nhầm lẫn giữa độ sâu h tính từ mặt thoáng và khoảng cách từ đáy lên.'
        )
      );
    }
    return list;
  }, [state.errorNotebook]);

  // -------------------------------------------------------------
  // QUEST HANDLERS (With Fail-Forward & Combos)
  // -------------------------------------------------------------
  const handleStartQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setQuestStageIdx(0);
    setQuestChoiceIdx(null);
    setQuestAnswered(false);
    setQuestHintLevel(0);
    setQuestCombo(0);
    setQuestTicket(null);
    setQuestCompletedJustNow(false);
    recordLearningEvent('QUEST_STARTED', `Bắt đầu nhiệm vụ cốt truyện: ${quest.title}`, { questId: quest.id });
  };

  const handleQuestAnswer = (choiceIdx: number) => {
    if (!activeQuest || questAnswered) return;
    setQuestChoiceIdx(choiceIdx);
    setQuestAnswered(true);

    const currentStage = activeQuest.stages[questStageIdx];
    const qData = currentStage.interactiveQuestion;

    if (qData) {
      const isCorrect = choiceIdx === qData.correctAnswer;
      recordNodeAttempt(qData.knowledgeId, isCorrect, 10000, questHintLevel > 0);

      if (isCorrect) {
        const nextCombo = questCombo + 1;
        setQuestCombo(nextCombo);
        setQuestTicket(null);
        recordLearningEvent(
          'QUESTION_CORRECT',
          `Trả lời đúng chặng "${currentStage.title}" (+10 XP, Combo x${nextCombo >= 3 ? '2.0' : nextCombo >= 2 ? '1.5' : '1.0'})`,
          { knowledgeId: qData.knowledgeId, questId: activeQuest.id, scoreDelta: 10 }
        );
        // Check if unlocks science card
        unlockScienceCard(qData.knowledgeId);
      } else {
        setQuestCombo(0);
        const ticket = createReviewRecoveryTicket(
          qData.knowledgeId,
          activeQuest.title,
          'QUEST',
          activeQuest.title,
          `Sai câu hỏi chặng: "${currentStage.title}"`
        );
        setQuestTicket(ticket);
        recordLearningEvent(
          'QUESTION_WRONG',
          `Chưa chính xác tại chặng "${currentStage.title}". Kích hoạt hỗ trợ Fail-Forward & Gợi ý.`,
          { knowledgeId: qData.knowledgeId, questId: activeQuest.id }
        );
      }
    }
  };

  const handleNextQuestStage = () => {
    if (!activeQuest) return;
    const nextIdx = questStageIdx + 1;
    if (nextIdx >= activeQuest.stages.length) {
      completeQuest(activeQuest.id, activeQuest.reward.xp);
      setQuestCompletedJustNow(true);
      recordLearningEvent(
        'QUEST_STARTED',
        `Hoàn thành xuất sắc nhiệm vụ: ${activeQuest.title} (+${activeQuest.reward.xp} XP)`,
        { questId: activeQuest.id, scoreDelta: activeQuest.reward.xp }
      );
    } else {
      updateQuestStage(activeQuest.id, nextIdx + 1, false);
      setQuestStageIdx(nextIdx);
      setQuestChoiceIdx(null);
      setQuestAnswered(false);
      setQuestHintLevel(0);
      setQuestTicket(null);
    }
  };

  // -------------------------------------------------------------
  // REPAIR MISSION HANDLERS (Section 15: Error as Quest)
  // -------------------------------------------------------------
  const handleStartRepair = (mission: RepairMission) => {
    setActiveRepair(mission);
    setRepairStepIdx(0);
    setRepairChoiceIdx(null);
    setRepairAnswered(false);
    setRepairFinished(false);
    recordLearningEvent('REPAIR_STARTED', `Bắt đầu nhiệm vụ sửa chữa hệ thống: ${mission.title}`, {
      knowledgeId: mission.knowledgeId
    });
  };

  const handleRepairAnswer = (choiceIdx: number) => {
    if (!activeRepair || repairAnswered) return;
    setRepairChoiceIdx(choiceIdx);
    setRepairAnswered(true);

    const step = activeRepair.steps[repairStepIdx];
    const isCorrect = choiceIdx === step.correctAnswer;

    if (isCorrect) {
      recordLearningEvent(
        'QUESTION_CORRECT',
        `Khắc phục thành công ${step.title} (+15 XP)`,
        { knowledgeId: activeRepair.knowledgeId, scoreDelta: 15 }
      );
    }
  };

  const handleNextRepairStep = () => {
    if (!activeRepair) return;
    const nextIdx = repairStepIdx + 1;
    if (nextIdx >= activeRepair.steps.length) {
      setRepairFinished(true);
      completeRepairMission(activeRepair.id, activeRepair.rewardXP);
      recordLearningEvent(
        'REPAIR_COMPLETED',
        `Đã hoàn thành toàn bộ 4 bước sửa chữa "${activeRepair.title}" (+${activeRepair.rewardXP} XP)`,
        { knowledgeId: activeRepair.knowledgeId, scoreDelta: activeRepair.rewardXP }
      );
    } else {
      setRepairStepIdx(nextIdx);
      setRepairChoiceIdx(null);
      setRepairAnswered(false);
    }
  };

  // -------------------------------------------------------------
  // DAILY ADVENTURE HANDLERS (Section 24 & 37: 5-10 min)
  // -------------------------------------------------------------
  const handleDailyAnswer = (choiceIdx: number) => {
    if (dailyAnswered) return;
    setDailyChoiceIdx(choiceIdx);
    setDailyAnswered(true);

    const step = dailyAdventure.steps[dailyStepIdx];
    const isCorrect = choiceIdx === step.interactiveData.correctAnswer;
    recordNodeAttempt(step.knowledgeId, isCorrect, 9000, false);

    recordLearningEvent(
      isCorrect ? 'QUESTION_CORRECT' : 'QUESTION_WRONG',
      `Phiêu lưu hàng ngày: ${step.title} (${isCorrect ? 'Đúng' : 'Chưa đúng'})`,
      { knowledgeId: step.knowledgeId }
    );
  };

  const handleNextDailyStep = () => {
    const nextIdx = dailyStepIdx + 1;
    if (nextIdx >= dailyAdventure.steps.length) {
      setDailySessionFinished(true);
      completeDailyMission();
      recordLearningEvent(
        'REVIEW_COMPLETED',
        `Hoàn thành phiên học hàng ngày (+${dailyAdventure.rewardXP} XP)`,
        { scoreDelta: dailyAdventure.rewardXP }
      );
    } else {
      setDailyStepIdx(nextIdx);
      setDailyChoiceIdx(null);
      setDailyAnswered(false);
    }
  };

  // -------------------------------------------------------------
  // BOSS BATTLE HANDLERS (Section 18-19: 5-Phase Tactical Arena)
  // -------------------------------------------------------------
  const handleStartBoss = (boss: BossBattle) => {
    setActiveBoss(boss);
    setBossHp(boss.totalHp);
    setPlayerHp(3);
    setBossRoundIndex(0);
    setSelectedBossChoice(null);
    setIsBossAnswered(false);
    setBossResult('IN_PROGRESS');
    setBossDefeatTicket(null);
    setBossLog([`🚨 Hệ thống phát hiện bất thường! ${boss.name} (${boss.title}) kích hoạt thử thách 5 Tầng.`]);
    recordLearningEvent('QUEST_STARTED', `Bắt đầu đại chiến Boss 5 Tầng: ${boss.name}`, { bossId: boss.id });
  };

  const handleBossAnswer = (choiceIndex: number) => {
    if (isBossAnswered || !activeBoss) return;
    setSelectedBossChoice(choiceIndex);
    setIsBossAnswered(true);

    const currentRound = activeBoss.rounds[bossRoundIndex];
    const isCorrect = choiceIndex === currentRound.correctAnswer;

    recordNodeAttempt(currentRound.knowledgeId, isCorrect, 12000, false);

    if (isCorrect) {
      const nextHp = Math.max(0, bossHp - currentRound.damage);
      setBossHp(nextHp);
      setBossLog((prev) => [
        `✓ Đòn công kích chuẩn xác! Gây ${currentRound.damage} sát thương lên ${activeBoss.name}!`,
        ...prev
      ]);
      recordLearningEvent(
        'QUESTION_CORRECT',
        `Vượt qua Tầng ${bossRoundIndex + 1} của ${activeBoss.name}`,
        { knowledgeId: currentRound.knowledgeId, bossId: activeBoss.id }
      );

      if (nextHp <= 0 || bossRoundIndex === activeBoss.rounds.length - 1) {
        setBossResult('VICTORY');
        recordBossDefeat(activeBoss.id, 3, activeBoss.rewardXP);
        recordLearningEvent(
          'BOSS_PASSED',
          `Chiến thắng vang dội! Tiêu diệt Boss ${activeBoss.name} (+${activeBoss.rewardXP} XP)`,
          { bossId: activeBoss.id, scoreDelta: activeBoss.rewardXP }
        );
      }
    } else {
      const nextLives = playerHp - 1;
      setPlayerHp(nextLives);
      setBossLog((prev) => [
        `✕ Phản đòn! Dữ liệu chưa chính xác khiến bạn mất 1 sinh lực.`,
        ...prev
      ]);

      if (nextLives <= 0) {
        setBossResult('DEFEAT');
        const ticket = createReviewRecoveryTicket(
          currentRound.knowledgeId,
          activeBoss.name,
          'BOSS',
          activeBoss.name,
          `Thất bại tại vòng đấu: "${currentRound.title}"`
        );
        setBossDefeatTicket(ticket);
        recordLearningEvent(
          'BOSS_FAILED',
          `Thất bại tại Đấu trường Boss trước ${activeBoss.name}. Kích hoạt phiếu phục hồi khẩn cấp.`,
          { knowledgeId: currentRound.knowledgeId, bossId: activeBoss.id }
        );
      }
    }
  };

  const handleNextBossRound = () => {
    if (!activeBoss) return;
    setSelectedBossChoice(null);
    setIsBossAnswered(false);
    setBossRoundIndex((prev) => Math.min(activeBoss.rounds.length - 1, prev + 1));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: PLAYER IDENTITY & IMMERSIVE BANNER (SPEC V3.0)     */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          {/* Identity & Scientist Rank */}
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>KHTN 8 Game Learning System · Master Spec v3.0</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center gap-1">
                <span>{scientistRank.badgeIcon}</span>
                <span>{scientistRank.rankTitle}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Thế Giới Khám Phá Khoa Học Tự Nhiên 8
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Mỗi chặng đường là một hành trình nhập vai khám phá: <strong>Mục Tiêu</strong> → <strong>Câu Chuyện</strong> → <strong>Khám Phá</strong> → <strong>Nhiệm Vụ</strong> → <strong>Sửa Lỗi Kỹ Thuật</strong> → <strong>Bộ Sưu Tập Thẻ Khoa Học</strong>.
            </p>

            {/* Quick stats tags & Healthy streak */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-700/40 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-400" />
                <span>Chỉ số Mastery: <strong className="text-teal-300">{avgMastery}%</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-700/40 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Cấp {levelInfo.level}: <strong className="text-amber-300">{levelInfo.title} ({state.totalXP} XP)</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-700/40 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-purple-400" />
                <span>Thẻ khám phá: <strong className="text-purple-300">{unlockedCardsCount} / {scienceCards.length} Thẻ</strong></span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-700/40 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Chuỗi học: <strong className="text-rose-300">{state.dailyStreak} ngày</strong></span>
                <span className="text-[10px] text-slate-400 italic hidden sm:inline">(Học theo nhịp độ tự nhiên)</span>
              </div>
            </div>
          </div>

          {/* Quick Session Controls & Transparency */}
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2.5 w-full xl:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('DAILY')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chuyến Phiêu Lưu Hôm Nay (5–10m)</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowTransparencyHelp(true)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <HelpCircle className="w-4 h-4 text-indigo-300" />
                <span>Minh Bạch Nhiệm Vụ</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSessionRestModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                title="Dừng phiên học lành mạnh mà không bị phạt"
              >
                <Coffee className="w-4 h-4 text-amber-300" />
                <span>Nghỉ Ngơi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient lighting */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: 8 SUB-TABS NAVIGATION (SPEC V4.0)                  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveTab('GAMEPLAY_SCENE')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'GAMEPLAY_SCENE'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md ring-2 ring-teal-400'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>0. Thực Chiến Gameplay v4.0</span>
            <span className="text-2xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 font-black">
              Mới
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MAP')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'MAP'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Bản Đồ Sống (Map)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('QUESTS')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'QUESTS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>2. Nhiệm Vụ Cốt Truyện</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
              {GAME_QUESTS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('REPAIR')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'REPAIR'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-rose-500" />
            <span>3. Sửa Chữa (Repair Missions)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 font-bold">
              {repairMissions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CARDS')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CARDS'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>4. Sổ Khám Phá & Thẻ Bài</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
              {unlockedCardsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('DAILY')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'DAILY'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>5. Phiêu Lưu Hàng Ngày</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BOSSES')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'BOSSES'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-400" />
            <span>6. Đấu Trường Boss 5 Tầng</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
              {BOSS_BATTLES.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('EVENTS')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'EVENTS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-500" />
            <span>7. Nhật Ký Sự Kiện</span>
          </button>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <button
            type="button"
            onClick={() => setSelectedZone('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              selectedZone === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Toàn Thế Giới
          </button>
          <button
            type="button"
            onClick={() => setSelectedZone('KHU_A')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              selectedZone === 'KHU_A'
                ? 'bg-rose-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-500" />
            <span>Khu A: Hóa Học</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZone('KHU_B')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              selectedZone === 'KHU_B'
                ? 'bg-sky-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-sky-500" />
            <span>Khu B: Vật Lí</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZone('KHU_C')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              selectedZone === 'KHU_C'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-3 h-3 text-emerald-500" />
            <span>Khu C: Sinh Học</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZone('FINAL_AREA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 ${
              selectedZone === 'FINAL_AREA'
                ? 'bg-purple-700 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Hoàng Gia</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 0: THỰC CHIẾN GAMEPLAY V4.0 (GAMEPLAY-FIRST BLUEPRINT) */}
      {/* ======================================================== */}
      {activeTab === 'GAMEPLAY_SCENE' && (
        <GameplaySceneView
          onMasteryUpdated={(kId, delta) => recordNodeAttempt(kId, delta > 0, 8000, false)}
          onXPGranted={(xp) => completeDailyMission()}
        />
      )}

      {/* ======================================================== */}
      {/* TAB 1: BẢN ĐỒ SỐNG & TIẾN TRÌNH KHÁM PHÁ (SPEC V3.0)     */}
      {/* ======================================================== */}
      {activeTab === 'MAP' && (
        <div className="space-y-6">
          {/* Guide Legend */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Bản Đồ Sống · 8 Trạng Thái Khám Phá & Node Bí Ẩn:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">🔒 Khóa</span>
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200">○ Sẵn sàng</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">◐ Đang học</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">● Đang luyện</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-300 font-bold">⚠ Cần ôn tập</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300">⚔ Thử thách</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-300">👑 Sẵn sàng Boss</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-300">★ Thành thạo</span>
            </div>
          </div>

          {/* Interactive Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNodes.map((node) => {
              const nodeState = evaluateGameNodeState(node, state.nodeMastery, state.completedLessons);
              const meta = getGameNodeStateMeta(nodeState);
              const masteryRec = state.nodeMastery?.[node.id];
              const score = masteryRec?.masteryScore || 0;
              const tierInfo = getMasteryTierInfo(masteryRec?.tier || 'NOT_STARTED');

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    setSelectedNode(node);
                    setRevealStep(1);
                  }}
                  className={`rounded-3xl p-5 border transition-all cursor-pointer relative group flex flex-col justify-between ${meta.bgClass} ${meta.borderClass} hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${meta.badgeClass}`}>
                        <span>{meta.iconSymbol}</span>
                        <span>{meta.shortLabel}</span>
                      </span>

                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200">
                        {node.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 block truncate">
                        {node.chapterTitle} · {node.lessonTitle}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                        {node.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {node.description}
                    </p>

                    {/* Mystery curiosity hook if available */}
                    {node.realWorldHook && (
                      <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2"><strong>Khám phá:</strong> {node.realWorldHook}</span>
                      </div>
                    )}
                  </div>

                  {/* Progress & Quick Stats */}
                  <div className="pt-4 mt-4 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Độ thành thạo:</span>
                      <strong className="font-bold text-slate-800">{score}% · {tierInfo.label}</strong>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-indigo-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.max(5, score)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-indigo-600 font-semibold pt-1">
                      <span>Mở hộp giải mã Progressive Reveal</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: NHIỆM VỤ CỐT TRUYỆN (MISSION HOOK SPEC V3.0)      */}
      {/* ======================================================== */}
      {activeTab === 'QUESTS' && (
        <div className="space-y-6">
          {/* Quest Type Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Phân loại nhiệm vụ:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedQuestType('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedQuestType === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tất Cả ({GAME_QUESTS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuestType('MICRO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedQuestType === 'MICRO'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Micro Quests (3–5m)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuestType('STANDARD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedQuestType === 'STANDARD'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Compass className="w-3 h-3 text-blue-500" />
              <span>Standard Quests (10–15m)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedQuestType('EPIC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                selectedQuestType === 'EPIC'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Epic STEM Quests (20–30m)</span>
            </button>
          </div>

          {/* Quests Grid with Section 4: 3-Questions Mission Hook */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => {
              const unlockInfo = evaluateQuestUnlock(quest, state.nodeMastery, state.questProgress);
              const progress = state.questProgress?.[quest.id];
              const isCompleted = progress?.status === 'COMPLETED';
              const currentStage = progress?.currentStage || 1;
              const typeMeta = getQuestTypeMeta(quest.questType);

              return (
                <div
                  key={quest.id}
                  className={`bg-white rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-300 shadow-xs'
                      : unlockInfo.unlocked
                      ? 'border-slate-200 hover:border-blue-400 hover:shadow-xl'
                      : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeMeta.badgeClass}`}>
                        {typeMeta.label} · {typeMeta.durationLabel}
                      </span>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hoàn thành</span>
                        </span>
                      ) : !unlockInfo.unlocked ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3" />
                          <span>Chưa mở</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          Chặng {currentStage}/{quest.stages.length}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-medium text-slate-500 block">
                        {quest.zoneName}
                      </span>
                      <h3 className="font-bold text-lg text-slate-900 mt-1 leading-snug">
                        {quest.title}
                      </h3>
                    </div>

                    {/* Section 4: 3-Questions Mission Hook */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">🎯 Tôi đang làm gì?</span>
                        <p className="text-slate-600">{quest.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-700 block">❓ Tại sao phải làm?</span>
                        <p className="text-slate-600 italic">{quest.storyContext}</p>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700 block">🎁 Hoàn thành nhận được gì?</span>
                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="text-amber-600 font-bold">+{quest.reward.xp} XP</span>
                          {quest.reward.badgeTitle && (
                            <span className="text-purple-600 font-medium">Huy hiệu: {quest.reward.badgeTitle}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="pt-5 mt-4 border-t border-slate-100">
                    {unlockInfo.unlocked ? (
                      <button
                        type="button"
                        onClick={() => handleStartQuest(quest)}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          isCompleted
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{isCompleted ? 'Chơi lại nhiệm vụ' : currentStage > 1 ? 'Tiếp tục nhiệm vụ' : 'Bắt đầu nhiệm vụ'}</span>
                      </button>
                    ) : (
                      <div className="text-xs text-slate-500 italic flex items-center gap-1.5 p-2 bg-slate-100/70 rounded-lg">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{unlockInfo.reason}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: NHIỆM VỤ SỬA CHỮA (ERROR AS QUEST SPEC V3.0)     */}
      {/* ======================================================== */}
      {activeTab === 'REPAIR' && (
        <div className="space-y-6">
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-rose-900 text-sm flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-rose-950">Triết lý "Lỗi Trở Thành Nhiệm Vụ" (Error as Quest - Spec v3.0):</strong>
              <p className="text-xs text-rose-800 leading-relaxed">
                Khi gặp câu hỏi khó hoặc chọn nhầm đáp án, em không bị trừng phạt! Thay vào đó, hệ thống lập tức mở <strong>Nhiệm Vụ Sửa Chữa (Repair Mission)</strong> với quy trình 4 bước chuẩn khoa học: <em>1. Cô lập đại lượng</em> → <em>2. Chọn công thức</em> → <em>3. Đổi đơn vị</em> → <em>4. Tính toán & Khắc phục</em>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairMissions.map((mission) => {
              const isDone = (state.completedRepairMissions || []).includes(mission.id);

              return (
                <div
                  key={mission.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                    isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-rose-400 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-rose-600" />
                        <span>Quy trình 4 Bước Kỹ Thuật</span>
                      </span>

                      {isDone && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã khắc phục</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 leading-snug">
                      {mission.title}
                    </h3>

                    <p className="text-xs text-slate-600">
                      {mission.originError}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                      {mission.storyHook}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 pt-1">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Thưởng sửa chữa: +{mission.rewardXP} XP</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleStartRepair(mission)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isDone
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Khắc phục lại lần nữa' : 'Khởi động quy trình sửa chữa 4 bước'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: SỔ KHÁM PHÁ & THẺ KHOA HỌC (SPEC V3.0)            */}
      {/* ======================================================== */}
      {activeTab === 'CARDS' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 text-purple-900 text-sm flex items-start gap-3">
            <Bookmark className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-purple-950">Sổ Khám Phá Khoa Học & Thẻ Bài (Science Cards):</strong>
              <p className="text-xs text-purple-800 leading-relaxed">
                Mỗi khi em đạt mức thành thạo <strong>Mastery ≥ 70%</strong> ở một chủ đề kiến thức, một <strong>Science Card</strong> độc bản sẽ được giải mã vào cuốn Sổ Khám Phá này. Thẻ chứa định nghĩa chuẩn, công thức KaTeX, quy đổi đơn vị và ứng dụng thực tiễn để ôn tập nhanh.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {scienceCards.map((card) => {
              let rarityBg = 'bg-slate-100 text-slate-700 border-slate-200';
              if (card.cardRarity === 'LEGENDARY') rarityBg = 'bg-amber-100 text-amber-800 border-amber-300';
              if (card.cardRarity === 'EPIC') rarityBg = 'bg-purple-100 text-purple-800 border-purple-300';
              if (card.cardRarity === 'RARE') rarityBg = 'bg-sky-100 text-sky-800 border-sky-300';

              return (
                <div
                  key={card.knowledgeId}
                  onClick={() => card.unlocked && setSelectedScienceCard(card)}
                  className={`rounded-3xl p-5 border transition-all relative flex flex-col justify-between ${
                    card.unlocked
                      ? 'bg-white border-slate-200 hover:border-purple-400 hover:shadow-xl cursor-pointer'
                      : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${rarityBg}`}>
                        {card.cardRarity}
                      </span>
                      <span className="text-base">{card.icon}</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        {card.chapterTitle}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug mt-0.5">
                        {card.title}
                      </h4>
                    </div>

                    {card.unlocked ? (
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {card.conceptSummary}
                      </p>
                    ) : (
                      <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 italic space-y-1">
                        <Lock className="w-4 h-4 mx-auto text-slate-400" />
                        <span>Cần đạt Mastery ≥ 70% để mở thẻ này</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {card.unlocked ? (
                      <>
                        <span className="font-bold text-emerald-600">Đã mở khóa</span>
                        <span className="text-purple-600 font-semibold flex items-center gap-1">
                          <span>Xem thẻ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 font-medium">Chưa sở hữu</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: PHIÊU LƯU HÀNG NGÀY (DAILY ADVENTURE 5-10M)       */}
      {/* ======================================================== */}
      {activeTab === 'DAILY' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/20 text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Phiên Học Tối Ưu: 5–10 Phút Mỗi Ngày</span>
              </span>

              <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-lg">
                Ngày {todayStr}
              </span>
            </div>

            <h2 className="text-2xl font-black">
              {dailyAdventure.title}
            </h2>

            <p className="text-sm text-amber-50 leading-relaxed">
              Mỗi ngày gồm 3 chặng học tập trọng tâm: <strong>01-Khởi động phục hồi</strong> → <strong>02-Khám phá hiện tượng</strong> → <strong>03-Thử thách vận dụng</strong>. Sau khi hoàn thành, em có thể yên tâm nghỉ ngơi hoặc khám phá thêm theo sở thích!
            </p>
          </div>

          {dailySessionFinished ? (
            /* Session Completed Celebration Screen */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-6 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  🎉 Hoàn Thành Xuất Sắc Phiên Học Hôm Nay!
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Mục Tiêu Khoa Học Đã Đạt Chuẩn
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Em đã ôn luyện 1 kiến thức trọng tâm, khám phá 1 quy luật tự nhiên và vượt qua thử thách định lượng.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 font-bold text-sm">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>+{dailyAdventure.rewardXP} XP Thưởng Ngày</span>
                <span className="border-l border-amber-300 pl-3 text-emerald-700">
                  Chuỗi ngày: {state.dailyStreak} Ngày
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 max-w-md mx-auto text-left flex items-start gap-3">
                <Coffee className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Lời khuyên chăm sóc sự tập trung (Section 36):</strong>
                  <span>Học tập bền vững và hiệu quả nhất khi có thời gian nghỉ ngơi thư giãn. Em có thể đóng máy hoặc tiếp tục khám phá thêm các khu vực khác trên bản đồ nếu muốn.</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('MAP')}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                >
                  Xem Bản Đồ Thế Giới
                </button>
              </div>
            </div>
          ) : (
            /* Running Daily Steps */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Chặng {dailyStepIdx + 1} / {dailyAdventure.steps.length}</span>
                  <span className="font-bold text-amber-600">
                    {dailyAdventure.steps[dailyStepIdx].stepType}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {dailyAdventure.steps.map((st, i) => (
                    <div
                      key={st.stepType}
                      className={`h-2 rounded-full transition-all ${
                        i < dailyStepIdx ? 'bg-emerald-500' : i === dailyStepIdx ? 'bg-amber-500' : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Current Daily Step Card */}
              {(() => {
                const step = dailyAdventure.steps[dailyStepIdx];
                const q = step.interactiveData;

                return (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-extrabold text-xl text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {step.description}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-semibold text-slate-900 text-sm">
                      <MathView text={q.question} />
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = dailyChoiceIdx === optIdx;
                        const isCorrect = optIdx === q.correctAnswer;
                        let btnClass = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';

                        if (dailyAnswered) {
                          if (isCorrect) {
                            btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                          } else if (isSelected) {
                            btnClass = 'bg-rose-50 border-rose-400 text-rose-800 font-bold';
                          } else {
                            btnClass = 'bg-white border-slate-100 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={dailyAnswered}
                            onClick={() => handleDailyAnswer(optIdx)}
                            className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                          >
                            <span><MathView text={opt} /></span>
                            {dailyAnswered && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {dailyAnswered && isSelected && !isCorrect && (
                              <X className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {dailyAnswered && (
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1.5">
                        <strong className="font-bold block">Giải thích cơ chế khoa học:</strong>
                        <MathView text={q.explanation} />
                        {q.formulaLatex && (
                          <div className="pt-1 font-bold text-indigo-900">
                            <MathView latex={q.formulaLatex} />
                          </div>
                        )}
                      </div>
                    )}

                    {dailyAnswered && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNextDailyStep}
                          className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <span>{dailyStepIdx + 1 >= dailyAdventure.steps.length ? 'Hoàn thành phiên học' : 'Chặng tiếp theo'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: ĐẤU TRƯỜNG BOSS 5 TẦNG (SECTIONS 18-19 SPEC V3.0)  */}
      {/* ======================================================== */}
      {activeTab === 'BOSSES' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-indigo-900/60">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
              <Swords className="w-4 h-4" />
              <span>Đấu Trường Boss 5 Tầng Cốt Truyện · Master Spec v3.0</span>
            </div>
            <h2 className="text-2xl font-black">
              Đại Chiến Thần Tri Thức: Cuộc Đua Chiến Thuật
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Không bấm giờ gây hoảng loạn! Mỗi trận đấu chia làm 5 Tầng chiến thuật: <strong>1. Nhận diện</strong> → <strong>2. Chọn quy luật</strong> → <strong>3. Tính toán</strong> → <strong>4. Hóa giải bẫy</strong> → <strong>5. Quyết định tối thượng</strong>. Thất bại không phải là kết thúc, em luôn nhận được Phiếu Phục Hồi để củng cố và phục thù!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBosses.map((boss) => {
              const victory = state.bossVictories?.[boss.id];
              const isDefeated = victory?.defeated;
              const unlockInfo = evaluateBossUnlock(boss, state.nodeMastery, state.questProgress);

              return (
                <div
                  key={boss.id}
                  className={`bg-white rounded-3xl p-6 border transition-all relative flex flex-col justify-between ${
                    isDefeated
                      ? 'border-purple-300 shadow-md ring-2 ring-purple-100'
                      : unlockInfo.unlocked
                      ? 'border-slate-200 hover:border-purple-400 hover:shadow-xl'
                      : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block">
                          {boss.zoneName}
                        </span>
                        <h3 className="font-extrabold text-xl text-slate-900 mt-0.5">
                          {boss.name}
                        </h3>
                        <p className="text-xs font-medium text-purple-600">
                          {boss.title}
                        </p>
                      </div>

                      {isDefeated ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1 shrink-0">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>Đã tiêu diệt</span>
                        </span>
                      ) : !unlockInfo.unlocked ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1 shrink-0">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Khóa</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1 shrink-0">
                          <Swords className="w-3.5 h-3.5 text-purple-600" />
                          <span>Sẵn sàng khiêu chiến</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {boss.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Sinh lực Boss</span>
                        <strong className="text-rose-600 font-bold">{boss.totalHp} HP</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Số tầng đấu</span>
                        <strong className="text-indigo-600 font-bold">{boss.rounds.length} Tầng</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Phần thưởng</span>
                        <strong className="text-amber-600 font-bold">+{boss.rewardXP} XP</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    {unlockInfo.unlocked ? (
                      <button
                        type="button"
                        onClick={() => handleStartBoss(boss)}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Swords className="w-4 h-4" />
                        <span>{isDefeated ? 'Khiêu chiến lại Boss' : 'Bước Vào Đấu Trường Khiêu Chiến'}</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-slate-100 text-slate-600 text-xs flex items-start gap-2">
                        <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-slate-700 block">Điều kiện mở khóa:</strong>
                          <span>{unlockInfo.reason}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: NHẬT KÝ SỰ KIỆN HỌC TẬP (SECTIONS 28-29 SPEC V3.0) */}
      {/* ======================================================== */}
      {activeTab === 'EVENTS' && (
        <div className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-3xl p-5 text-teal-900 text-sm flex items-start gap-3">
            <Activity className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-teal-950">Nhật Ký Sự Kiện Học Tập (Game Event ↔ Learning Event):</strong>
              <p className="text-xs text-teal-800 leading-relaxed">
                Mọi hành động trong thế giới game (Quest, Boss, Sửa lỗi, Khám phá thẻ) đều được ghi nhận trực tiếp vào Hệ thống Tri Thức. Dữ liệu này giúp khôi phục tiến trình, minh bạch năng lực và chống gian lận điểm số.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {(state.learningEvents || []).length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 italic">
                Chưa có sự kiện nào được ghi nhận. Hãy hoàn thành 1 nhiệm vụ hoặc chặng phiêu lưu!
              </div>
            ) : (
              (state.learningEvents || []).map((ev) => {
                const dateStr = new Date(ev.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={ev.eventId} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 font-bold text-xs">
                        <FileCheck className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {ev.eventType}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {dateStr}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5 font-medium">
                          {ev.details}
                        </p>
                      </div>
                    </div>

                    {ev.scoreDelta && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        +{ev.scoreDelta} XP
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROGRESSIVE REVEAL FOR KNOWLEDGE NODE (TAB 1)     */}
      {/* ======================================================== */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Progressive Reveal (Mở Dần Bí Ẩn)
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedNode.id}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block">
                  {selectedNode.chapterTitle} · {selectedNode.lessonTitle}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedNode.title}
                </h2>
              </div>

              {/* 4-Step Reveal Progress */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {([1, 2, 3, 4] as const).map((stepNum) => (
                  <button
                    key={stepNum}
                    type="button"
                    onClick={() => setRevealStep(stepNum)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      revealStep === stepNum
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : revealStep > stepNum
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {stepNum === 1 ? '1. Gợi ý' : stepNum === 2 ? '2. Quan sát' : stepNum === 3 ? '3. Khám phá' : '4. Giải thích'}
                  </button>
                ))}
              </div>

              {/* Reveal Body */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3 min-h-[140px]">
                {revealStep === 1 && (
                  <div className="space-y-2">
                    <strong className="text-indigo-900 font-bold block text-sm">Bước 1: Manh mối quan sát đầu tiên (Hint)</strong>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                )}
                {revealStep === 2 && (
                  <div className="space-y-2">
                    <strong className="text-indigo-900 font-bold block text-sm">Bước 2: Hiện tượng thực tế cần giải mã (Observation)</strong>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{selectedNode.realWorldHook || 'Các nhà khoa học quan sát thấy sự biến đổi vật chất hoặc năng lượng tuân theo một quy luật nghiêm ngặt.'}"
                    </p>
                  </div>
                )}
                {revealStep === 3 && (
                  <div className="space-y-2">
                    <strong className="text-indigo-900 font-bold block text-sm">Bước 3: Mối quan hệ định lượng then chốt (Discovery)</strong>
                    {selectedNode.formulaIds && selectedNode.formulaIds.length > 0 ? (
                      <div className="space-y-2">
                        {selectedNode.formulaIds.map((fid) => {
                          const f = FORMULAS.find((item) => item.id === fid);
                          if (!f) return null;
                          return (
                            <div key={fid} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                              <span className="font-bold text-slate-800">{f.name}</span>
                              <div className="font-bold text-indigo-900 text-sm">
                                <MathView latex={f.formulaLatex} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-slate-600">Kiến thức này liên kết chặt chẽ với các kỹ năng thao tác và thí nghiệm.</p>
                    )}
                  </div>
                )}
                {revealStep === 4 && (
                  <div className="space-y-2">
                    <strong className="text-emerald-900 font-bold block text-sm">Bước 4: Giải thích quy luật hoàn chỉnh (Explanation)</strong>
                    <p className="text-slate-700 leading-relaxed">
                      Chúc mừng em đã hoàn thành toàn bộ chuỗi khám phá cho chủ đề này! Em có thể tiến hành luyện bài tập hoặc thực hiện nhiệm vụ cốt truyện để tăng Mastery lên mức thành thạo.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNode(null);
                    navigate({ tab: 'ly_thuyet', id: selectedNode.lessonId });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Đọc Toàn Bài SGK</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNode(null);
                    navigate({ tab: 'bai_tap', id: selectedNode.chapterId });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Luyện Tập Bài Tập</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: INTERACTIVE QUEST PLAYER (TAB 2)                  */}
      {/* ======================================================== */}
      {activeQuest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveQuest(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {questCompletedJustNow ? (
              <div className="text-center space-y-5 py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Hoàn Thành Nhiệm Vụ Xuất Sắc!
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {activeQuest.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Bạn đã vượt qua mọi chặng thách thức và củng cố vững vàng kiến thức trọng tâm chuẩn SGK.
                </p>

                <div className="inline-flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>+{activeQuest.reward.xp} XP Thưởng</span>
                  {activeQuest.reward.badgeTitle && (
                    <span className="border-l border-amber-300 pl-3 text-purple-700">
                      Huy hiệu: {activeQuest.reward.badgeTitle}
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveQuest(null)}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
                  >
                    Tiếp tục cuộc hành trình
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{activeQuest.zoneName} · {activeQuest.questType}</span>
                    </span>

                    {questCombo >= 2 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white animate-pulse">
                        🔥 Combo x{questCombo >= 3 ? '2.0' : '1.5'} XP!
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {activeQuest.title}
                  </h2>
                </div>

                {/* Stages progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Chặng {questStageIdx + 1} / {activeQuest.stages.length}</span>
                    <span className="font-semibold text-blue-600">
                      {activeQuest.stages[questStageIdx].stage}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {activeQuest.stages.map((st, i) => (
                      <div
                        key={st.stage}
                        className={`h-2 rounded-full transition-all ${
                          i < questStageIdx
                            ? 'bg-emerald-500'
                            : i === questStageIdx
                            ? 'bg-blue-600'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Stage interactive card */}
                {(() => {
                  const stage = activeQuest.stages[questStageIdx];
                  const qData = stage.interactiveQuestion;

                  return (
                    <div className="space-y-5 p-5 bg-slate-50 rounded-3xl border border-slate-200">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                          Chặng {questStageIdx + 1}: {stage.title}
                        </span>
                        <p className="text-sm text-slate-700 mt-1 font-medium">
                          {stage.instruction}
                        </p>
                      </div>

                      {qData ? (
                        <div className="space-y-4 pt-1">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 font-semibold text-slate-900 text-sm">
                            <MathView text={qData.prompt} />
                          </div>

                          <div className="space-y-2">
                            {qData.options.map((opt, optIdx) => {
                              const isSelected = questChoiceIdx === optIdx;
                              const isCorrect = optIdx === qData.correctAnswer;
                              let btnClass = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';

                              if (questAnswered) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                                } else if (isSelected) {
                                  btnClass = 'bg-rose-50 border-rose-400 text-rose-800 font-bold';
                                } else {
                                  btnClass = 'bg-white border-slate-100 text-slate-400 opacity-60';
                                }
                              }

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  disabled={questAnswered}
                                  onClick={() => handleQuestAnswer(optIdx)}
                                  className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                                >
                                  <span><MathView text={opt} /></span>
                                  {questAnswered && isCorrect && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  {questAnswered && isSelected && !isCorrect && (
                                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Fail-Forward Hint Engine (Section 14) */}
                          {!questAnswered && questHintLevel === 0 && (
                            <button
                              type="button"
                              onClick={() => setQuestHintLevel(1)}
                              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-1"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span>Cần gợi ý xác định đại lượng? (+0 XP phạt)</span>
                            </button>
                          )}

                          {questHintLevel >= 1 && (
                            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                              <strong className="block font-bold">💡 Gợi ý bước 1:</strong>
                              <p>Hãy chú ý các dữ kiện số liệu, đơn vị đo lường và định luật bảo toàn liên quan.</p>
                            </div>
                          )}

                          {/* Explanation */}
                          {questAnswered && (
                            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                              <strong className="font-semibold block">Giải thích chi tiết:</strong>
                              <MathView text={qData.explanation} />
                            </div>
                          )}

                          {/* Recovery Ticket if failed */}
                          {questTicket && (
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Phiếu Phục Hồi Kích Hoạt (Fail-Forward)!</span>
                              </div>
                              <p className="text-xs text-rose-800">
                                {questTicket.reason}. Bạn có thể tiếp tục hoặc ôn lại bài học liên quan.
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveQuest(null);
                                  navigate(questTicket.remediationPath);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-700"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{questTicket.remediationPath.description}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-600 italic">
                          Đã nắm vững nội dung chặng này. Nhấn nút bên dưới để tiến sang chặng kế tiếp!
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Footer buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveQuest(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-all"
                  >
                    Tạm dừng
                  </button>

                  {(!activeQuest.stages[questStageIdx].interactiveQuestion || questAnswered) && (
                    <button
                      type="button"
                      onClick={handleNextQuestStage}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                    >
                      <span>{questStageIdx + 1 >= activeQuest.stages.length ? 'Hoàn thành nhiệm vụ' : 'Chặng tiếp theo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: REPAIR MISSION PLAYER (TAB 3)                     */}
      {/* ======================================================== */}
      {activeRepair && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveRepair(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {repairFinished ? (
              <div className="text-center space-y-5 py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Sửa Chữa Hoàn Tất Thành Công!
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {activeRepair.title}
                  </h2>
                </div>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Hệ thống đã được tái chuẩn hóa qua đầy đủ 4 bước kỹ thuật. Em đã làm chủ hoàn toàn các đại lượng và quy tắc đo lường!
                </p>

                <div className="inline-flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 font-bold text-sm">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>+{activeRepair.rewardXP} XP Thưởng Khắc Phục</span>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveRepair(null)}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    Trở về danh sách nhiệm vụ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Quy Trình Sửa Chữa Kỹ Thuật 4 Bước</span>
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {activeRepair.title}
                  </h2>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Bước {repairStepIdx + 1} / {activeRepair.steps.length}</span>
                    <span className="font-bold text-rose-600">
                      {activeRepair.steps[repairStepIdx].title}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {activeRepair.steps.map((st, i) => (
                      <div
                        key={st.stepNumber}
                        className={`h-2 rounded-full transition-all ${
                          i < repairStepIdx ? 'bg-emerald-500' : i === repairStepIdx ? 'bg-rose-600' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                {(() => {
                  const step = activeRepair.steps[repairStepIdx];

                  return (
                    <div className="space-y-5 p-5 bg-slate-50 rounded-3xl border border-slate-200">
                      <div>
                        <strong className="text-xs font-bold uppercase tracking-wider text-rose-600 block">
                          {step.title}
                        </strong>
                        <p className="text-xs text-slate-700 mt-1">
                          {step.instruction}
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 font-semibold text-slate-900 text-sm">
                        <MathView text={step.question} />
                      </div>

                      <div className="space-y-2.5">
                        {step.options.map((opt, optIdx) => {
                          const isSelected = repairChoiceIdx === optIdx;
                          const isCorrect = optIdx === step.correctAnswer;
                          let btnClass = 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';

                          if (repairAnswered) {
                            if (isCorrect) {
                              btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                            } else if (isSelected) {
                              btnClass = 'bg-rose-50 border-rose-400 text-rose-800 font-bold';
                            } else {
                              btnClass = 'bg-white border-slate-100 text-slate-400 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={repairAnswered}
                              onClick={() => handleRepairAnswer(optIdx)}
                              className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                            >
                              <span><MathView text={opt} /></span>
                              {repairAnswered && isCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {repairAnswered && isSelected && !isCorrect && (
                                <X className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {repairAnswered && (
                        <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                          <strong className="font-semibold block">Giải thích cơ sở khoa học:</strong>
                          <MathView text={step.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {repairAnswered && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextRepairStep}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>{repairStepIdx + 1 >= activeRepair.steps.length ? 'Hoàn tất sửa chữa' : 'Bước tiếp theo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SCIENCE CARD DETAIL (TAB 4)                       */}
      {/* ======================================================== */}
      {selectedScienceCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedScienceCard(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mx-auto shadow-inner">
                {selectedScienceCard.icon}
              </div>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                {selectedScienceCard.cardRarity} · Thẻ Khoa Học
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {selectedScienceCard.title}
              </h2>
              <span className="text-xs text-slate-500 font-semibold block">
                {selectedScienceCard.chapterTitle} · {selectedScienceCard.lessonTitle}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">Khái niệm cốt lõi:</span>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedScienceCard.conceptSummary}
                </p>
              </div>

              {selectedScienceCard.formulaLatex && (
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1.5">
                  <span className="font-bold text-indigo-900 uppercase tracking-wider text-[11px] block">
                    {selectedScienceCard.formulaName || 'Công thức chuẩn SGK'}:
                  </span>
                  <div className="text-base font-bold text-indigo-950 text-center py-1">
                    <MathView latex={selectedScienceCard.formulaLatex} />
                  </div>
                  {selectedScienceCard.unitSymbol && (
                    <span className="text-[11px] text-indigo-700 block text-center">
                      Đơn vị đo lường: <strong>{selectedScienceCard.unitSymbol}</strong>
                    </span>
                  )}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 text-amber-950">
                <span className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ứng dụng thực tiễn trong cuộc sống:</span>
                </span>
                <p className="leading-relaxed">
                  {selectedScienceCard.realWorldApplication}
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const node = KNOWLEDGE_NODES.find((n) => n.id === selectedScienceCard.knowledgeId);
                  setSelectedScienceCard(null);
                  if (node) {
                    navigate({ tab: 'ly_thuyet', id: node.lessonId });
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <BookOpen className="w-4 h-4" />
                <span>Học bài học liên quan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: TRANSPARENCY ASSISTANT (SECTION 39 SPEC V3.0)     */}
      {/* ======================================================== */}
      {showTransparencyHelp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowTransparencyHelp(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900">
                  Trung Tâm Minh Bạch Học Tập
                </h3>
                <span className="text-xs text-slate-500">
                  Dành cho học sinh & phụ huynh / giáo viên (Section 39)
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-indigo-900 font-bold block text-sm">
                  1. "Vì sao tôi được giao nhiệm vụ này?"
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Hệ thống không chọn bài ngẫu nhiên. Mỗi nhiệm vụ được đề xuất dựa trên điểm thành thạo Mastery gần nhất và những lỗi sai ghi nhận trong sổ tay, giúp em bù đắp lỗ hổng kiến thức nhanh nhất.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-indigo-900 font-bold block text-sm">
                  2. "Vì sao Boss hoặc Khu vực này chưa mở?"
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Để đảm bảo an toàn học tập và không gây nản chí, Đấu trường Boss yêu cầu chỉ số Mastery khu vực đạt tối thiểu <strong>60% - 75%</strong> và hoàn thành các nhiệm vụ cốt truyện khám phá tiên quyết.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-indigo-900 font-bold block text-sm">
                  3. "Điểm Mastery khác gì với Level?"
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  Level và XP phản ánh nỗ lực và thời lượng tham gia. Mastery đo lường thực chất khả năng giải bài đúng và vận dụng quy luật. Level cao vẫn cần ôn tập các nút có Mastery giảm theo thời gian.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTransparencyHelp(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: HEALTHY SESSION REST (SECTIONS 36-37 SPEC V3.0)   */}
      {/* ======================================================== */}
      {showSessionRestModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-center relative">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Coffee className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-black text-xl text-slate-900">
                Nghỉ Ngơi Lành Mạnh
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Hệ thống tuân thủ nguyên tắc không gây nghiện và không phạt khi dừng phiên học. Hôm nay em đã tích lũy <strong>{state.totalXP} XP</strong> và chuỗi <strong>{state.dailyStreak} ngày</strong> học tập xuất sắc!
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 italic">
              "Bộ não cần thời gian củng cố các liên kết nơ-ron sau khi tiếp nhận kiến thức mới."
            </div>

            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSessionRestModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Học thêm chút nữa
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSessionRestModal(false);
                  navigate({ tab: 'home' });
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Nghỉ ngơi thôi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BOSS BATTLE ARENA (TAB 6)                         */}
      {/* ======================================================== */}
      {activeBoss && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-900/80 space-y-6 relative max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveBoss(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bossResult === 'VICTORY' ? (
              <div className="text-center space-y-5 py-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                  <Trophy className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Chiến Thắng Vinh Quang 5 Tầng!
                  </span>
                  <h2 className="text-3xl font-black text-white mt-1">
                    Đã Hạ Gục {activeBoss.name}
                  </h2>
                  <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                    Bạn đã chứng tỏ bản lĩnh làm chủ tri thức và mở ra đỉnh cao mới trong hành trình KHTN 8!
                  </p>
                </div>

                <div className="inline-flex items-center gap-4 p-4 bg-indigo-950/80 border border-indigo-700/60 rounded-2xl text-amber-300 font-bold text-sm">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span>+{activeBoss.rewardXP} XP Thưởng Lớn</span>
                  <span className="border-l border-indigo-800 pl-4 text-purple-300">
                    Huy hiệu: {activeBoss.rewardBadge}
                  </span>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveBoss(null)}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl cursor-pointer"
                  >
                    Vinh quang trở về bản đồ
                  </button>
                </div>
              </div>
            ) : bossResult === 'DEFEAT' ? (
              <div className="text-center space-y-5 py-6">
                <div className="w-20 h-20 rounded-full bg-rose-950 text-rose-500 flex items-center justify-center mx-auto border border-rose-800">
                  <AlertTriangle className="w-12 h-12" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Bạn Đã Thất Bại Trước {activeBoss.name}!
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Sinh lực đã cạn kiệt (0 / 3)
                  </h2>
                </div>

                {bossDefeatTicket && (
                  <div className="p-4 rounded-2xl bg-rose-900/30 border border-rose-800/80 text-left max-w-md mx-auto space-y-2 text-xs">
                    <span className="font-bold text-rose-300 block">
                      Kế hoạch phục hồi khẩn cấp (Fail-Forward):
                    </span>
                    <p className="text-slate-300">
                      {bossDefeatTicket.reason}. Đừng nản chí! Hãy ôn lại kiến thức để chuẩn bị phục thù.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveBoss(null);
                        navigate(bossDefeatTicket.remediationPath);
                      }}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{bossDefeatTicket.remediationPath.description}</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartBoss(activeBoss)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thử lại từ đầu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBoss(null)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                  >
                    Rút lui về căn cứ
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Boss vs Player HP Bars */}
                <div className="space-y-4 p-5 rounded-2xl bg-slate-950/60 border border-indigo-900/60">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-rose-400 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-rose-500" />
                        <span>{activeBoss.name}</span>
                      </span>
                      <strong className="font-mono text-rose-300">{bossHp} / {activeBoss.totalHp} HP</strong>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-rose-900/50">
                      <div
                        className="h-full bg-gradient-to-r from-rose-600 to-red-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(0, (bossHp / activeBoss.totalHp) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      <span>Sinh lực chiến binh:</span>
                    </span>
                    <div className="flex items-center gap-1 text-base">
                      {[1, 2, 3].map((heart) => (
                        <span key={heart} className={heart <= playerHp ? 'text-rose-500' : 'text-slate-700'}>
                          ❤️
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Round Combat Stage */}
                {(() => {
                  const round = activeBoss.rounds[bossRoundIndex];
                  const stageMeta = getBossStageTypeMeta(round.stageType);

                  return (
                    <div className="space-y-5 p-5 bg-slate-950/40 rounded-2xl border border-indigo-900/40">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageMeta.badgeClass}`}>
                          {stageMeta.label}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Tầng {bossRoundIndex + 1} / {activeBoss.rounds.length}
                        </span>
                      </div>

                      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 font-semibold text-white text-sm">
                        <MathView text={round.question} />
                      </div>

                      <div className="space-y-2">
                        {round.options.map((opt, optIdx) => {
                          const isSelected = selectedBossChoice === optIdx;
                          const isCorrect = optIdx === round.correctAnswer;
                          let btnClass = 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200';

                          if (isBossAnswered) {
                            if (isCorrect) {
                              btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                            } else if (isSelected) {
                              btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold';
                            } else {
                              btnClass = 'bg-slate-900 border-slate-800 text-slate-500 opacity-50';
                            }
                          }

                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={isBossAnswered}
                              onClick={() => handleBossAnswer(optIdx)}
                              className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                            >
                              <span><MathView text={opt} /></span>
                              {isBossAnswered && isCorrect && (
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {isBossAnswered && isSelected && !isCorrect && (
                                <X className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isBossAnswered && (
                        <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-200 space-y-1">
                          <strong className="font-semibold block text-indigo-300">Bí kíp chiến thuật:</strong>
                          <MathView text={round.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Combat Log */}
                {bossLog.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 max-h-24 overflow-y-auto">
                    {bossLog.slice(0, 3).map((log, i) => (
                      <div key={i} className="truncate">{log}</div>
                    ))}
                  </div>
                )}

                {/* Next round action */}
                {isBossAnswered && bossResult === 'IN_PROGRESS' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextBossRound}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <span>Tiến lên tầng tiếp theo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
