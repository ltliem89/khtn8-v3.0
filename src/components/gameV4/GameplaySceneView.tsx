import React, { useState } from 'react';
import {
  GameScene,
  GameQuestV4,
  InteractiveObject,
  LearningEvidence,
  GameEventRecord,
  GameActionType,
  LearningEvidenceType
} from '../../types/blueprint';
import {
  ALL_V4_SCENES,
  ALL_V4_QUESTS,
  V4_INITIAL_TOOLS,
  V4_INITIAL_NOTEBOOK
} from '../../data/gameV4Data';
import {
  evaluateActionConsequence,
  recordGameEvent,
  createLearningEvidence
} from '../../utils/gameEngine';
import { calculateLevelFromXP } from '../../utils/masteryEngine';
import { useLearningState } from '../../context/LearningStateContext';
import { FORMULAS } from '../../data/formulas';
import { MathView } from '../MathView';
import { X, HelpCircle, Check, ChevronRight, Settings, BookOpen, Award, Sparkles } from 'lucide-react';

interface GameplaySceneViewProps {
  onMasteryUpdated?: (knowledgeId: string, scoreDelta: number) => void;
  onXPGranted?: (xp: number) => void;
}

const ACTION_LABELS: Record<string, { label: string; icon: string }> = {
  inspect: { label: 'Quan sát', icon: '👁️' },
  observe: { label: 'Quan sát', icon: '🔎' },
  measure: { label: 'Đo đạc', icon: '⚖️' },
  calculate: { label: 'Tính toán', icon: '🧮' },
  decide: { label: 'Quyết định', icon: '🧭' },
  repair: { label: 'Khắc phục', icon: '🔧' },
  experiment: { label: 'Thí nghiệm', icon: '⚗️' },
  record: { label: 'Ghi chép', icon: '📖' },
  collect: { label: 'Thu thập', icon: '🧺' },
  combine: { label: 'Trộn', icon: '💧' },
  move: { label: 'Di chuyển', icon: '🔄' },
  select: { label: 'Chọn', icon: '🖱️' },
  talk: { label: 'Trò chuyện', icon: '💬' }
};

const STAGE_ICONS: Record<string, string> = {
  inspect: '🔎',
  observe: '👁️',
  measure: '⚖️',
  calculate: '🧮',
  decide: '🧭',
  experiment: '⚗️',
  repair: '🔧',
  record: '📖'
};

const EVIDENCE_SLOTS = [
  { key: 'observe', label: 'Quan sát', icon: '🔎', types: ['observation'] },
  { key: 'measure', label: 'Đo lường', icon: '⚖️', types: ['measurement_skill'] },
  { key: 'analyze', label: 'Phân tích', icon: '🧮', types: ['formula_skill', 'reasoning', 'knowledge_evidence', 'procedure_evidence'] },
  { key: 'apply', label: 'Vận dụng', icon: '🌍', types: ['application_evidence', 'integrated_mastery'] }
];

const OBJ_STYLES: React.CSSProperties[] = [
  { left: '4%', top: '42%' },
  { left: '38%', top: '42%' },
  { right: '6%', top: '42%' },
  { left: '26%', bottom: '14%' },
  { right: '10%', bottom: '14%' }
];

const EVENT_LABELS: Record<string, string> = {
  SCENE_ENTERED: 'Vào cảnh',
  OBJECT_INSPECTED: 'Quan sát vật thể',
  TOOL_USED: 'Dùng dụng cụ',
  MEASUREMENT_MADE: 'Đo đạc',
  CALCULATION_SUBMITTED: 'Tính toán',
  DECISION_MADE: 'Ra quyết định',
  HINT_REQUESTED: 'Xin gợi ý',
  QUESTION_CORRECT: 'Trả lời đúng',
  QUESTION_WRONG: 'Trả lời sai',
  QUEST_COMPLETED: 'Hoàn thành nhiệm vụ',
  CHALLENGE_PASSED: 'Vượt thử thách'
};

// Chủ đề cảnh quan theo từng môn/themeKey
const THEMES: Record<string, { bg: string; icon: string; accent: string; flavor: string }> = {
  lab: {
    bg: 'linear-gradient(#cfe5e1 0 43%, #dce8d5 43% 69%, #bfa17c 69%)',
    icon: '🧪',
    accent: '#3d6b52',
    flavor: 'Hệ thống không chỉ chấm đúng/sai — nó theo dõi cách em suy luận và chọn hỗ trợ phù hợp.'
  },
  workshop: {
    bg: 'linear-gradient(#e9dfc8 0 43%, #dbc49a 43% 69%, #8a6a45 69%)',
    icon: '🔧',
    accent: '#8a6a45',
    flavor: 'Xưởng kỹ thuật: mỗi phép đo và tính toán đều tạo bằng chứng để mở cổng nhiệm vụ.'
  },
  underwater: {
    bg: 'linear-gradient(#0e3a52 0 30%, #0b2c42 30% 62%, #09263a 62%)',
    icon: '🌊',
    accent: '#2a74a8',
    flavor: 'Đáy đại dương nguy hiểm — mỗi phép đo tạo một bằng chứng, đừng quên mở Cổng nhiệm vụ.'
  },
  electric: {
    bg: 'linear-gradient(#1e3150 0 43%, #1a2a44 43% 62%, #141f35 62%)',
    icon: '⚡',
    accent: '#3d5799',
    flavor: 'Tuân thủ an toàn điện: chọn đúng GHĐ/ĐCNN trước khi đọc số chỉ dụng cụ.'
  },
  thermo: {
    bg: 'linear-gradient(#f2c9a0 0 43%, #e8b07f 43% 70%, #9c6b45 70%)',
    icon: '🔥',
    accent: '#b5713b',
    flavor: 'Thí nghiệm nhiệt: ghi số liệu cẩn thận — nhiệt lượng tỉ lệ với khối lượng và độ tăng nhiệt độ.'
  }
};

const themeOf = (scene: GameScene): string =>
  scene.themeKey || (scene.domain === 'HOA_HOC' ? 'lab' : 'underwater');

const chapterKeyOf = (chapterTitle: string): string => chapterTitle.split(':')[0].trim();

// Gộp các màn thành nhóm chương (giữ thứ tự đầu tiên xuất hiện)
const SCENE_GROUPS: { chapter: string; scenes: GameScene[] }[] = (() => {
  const groups: { chapter: string; scenes: GameScene[] }[] = [];
  Object.values(ALL_V4_SCENES).forEach((sc) => {
    const key = chapterKeyOf(sc.chapterTitle);
    let g = groups.find((x) => x.chapter === key);
    if (!g) {
      g = { chapter: key, scenes: [] };
      groups.push(g);
    }
    g.scenes.push(sc);
  });
  return groups;
})();

export const GameplaySceneView: React.FC<GameplaySceneViewProps> = () => {
  const {
    state,
    recordNodeAttempt,
    updateQuestStage,
    completeQuest,
    recordLearningEvent,
    unlockScienceCard,
    addErrorRecord
  } = useLearningState();

  const [selectedSceneKey, setSelectedSceneKey] = useState<string>('SC_HOA_01');
  const currentScene: GameScene = ALL_V4_SCENES[selectedSceneKey] || ALL_V4_SCENES['SC_HOA_01'];

  const [questState, setQuestState] = useState<GameQuestV4>(() => {
    const initial: GameQuestV4 = JSON.parse(
      JSON.stringify(ALL_V4_QUESTS['QUEST_V4_01'])
    );
    const prog = state.questProgress?.[initial.questId];
    if (prog && prog.currentStage > 0) {
      initial.stages = initial.stages.map((s, i) =>
        i < prog.currentStage ? { ...s, completed: true } : s
      );
    }
    return initial;
  });

  const [activeStageIndex, setActiveStageIndex] = useState<number>(() => {
    const initial = ALL_V4_QUESTS['QUEST_V4_01'];
    const prog = state.questProgress?.[initial.questId];
    if (prog && prog.currentStage > 0) {
      return Math.min(prog.currentStage - 1, initial.stages.length - 1);
    }
    return 0;
  });

  const [sceneObjects, setSceneObjects] = useState<Record<string, InteractiveObject>>(() => {
    const map: Record<string, InteractiveObject> = {};
    currentScene.objects.forEach((obj) => {
      map[obj.objectId] = { ...obj };
    });
    return map;
  });

  const [equippedToolId, setEquippedToolId] = useState<string | null>('T_SCALE');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [npcDialogueState, setNpcDialogueState] = useState<string>('welcome');
  const [showNpcModal, setShowNpcModal] = useState<boolean>(false);
  const [showNotebook, setShowNotebook] = useState<boolean>(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const [actionTarget, setActionTarget] = useState<InteractiveObject | null>(null);
  const [infoBox, setInfoBox] = useState<{ title: string; body: string; icon?: string } | null>(null);

  const [lastConsequence, setLastConsequence] = useState<{
    systemResponse: string;
    consequenceText: string;
    success: boolean;
  } | null>(null);

  const [evidenceList, setEvidenceList] = useState<LearningEvidence[]>([
    createLearningEvidence(
      'K_HOA_01',
      'observation',
      0.85,
      'SCENE_ENTERED',
      'Khảo sát hiện trường phòng thí nghiệm'
    )
  ]);

  const [eventLog, setEventLog] = useState<GameEventRecord[]>([
    recordGameEvent('SCENE_ENTERED', { sceneId: currentScene.sceneId })
  ]);

  const [notebookEntries, setNotebookEntries] = useState(V4_INITIAL_NOTEBOOK);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const [challengeOpen, setChallengeOpen] = useState<boolean>(false);
  const [userSelectedChoice, setUserSelectedChoice] = useState<number | null>(null);
  const [userNumericInput, setUserNumericInput] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);
  const [challengeResult, setChallengeResult] = useState<{ correct: boolean; feedback: string } | null>(null);

  const currentStage = questState.stages[activeStageIndex];
  const activeObject = selectedObjectId ? sceneObjects[selectedObjectId] : null;
  const sceneTools = currentScene.tools && currentScene.tools.length > 0 ? currentScene.tools : V4_INITIAL_TOOLS;
  const equippedTool = sceneTools.find((t) => t.toolId === equippedToolId);
  const currentNpc = currentScene.npcs[0];
  const totalStages = questState.stages.length;
  const isQuestComplete = questState.stages.every((s) => s.completed);
  const sceneThemeKey = themeOf(currentScene);
  const sceneTheme = THEMES[sceneThemeKey] || THEMES.underwater;

  const masteryPct = (() => {
    const recs = currentScene.knowledgeIds
      .map((id) => state.nodeMastery?.[id]?.masteryScore ?? null)
      .filter((v): v is number => v !== null);
    if (recs.length === 0) return 0;
    return Math.round(recs.reduce((a, b) => a + b, 0) / recs.length);
  })();

  const evidenceDone = EVIDENCE_SLOTS.filter((slot) =>
    evidenceList.some((e) => slot.types.includes(e.type))
  ).length;

  const levelInfo = calculateLevelFromXP(state.totalXP);
  const currentFormula = currentStage?.formulaId
    ? FORMULAS.find((f) => f.id === currentStage.formulaId)
    : undefined;

  const handleSelectScene = (key: string) => {
    const newScene = ALL_V4_SCENES[key];
    const newQuest = ALL_V4_QUESTS[newScene.currentQuestId];
    const prog = state.questProgress?.[newQuest.questId];
    const restoreIdx =
      prog && prog.currentStage > 0
        ? Math.min(prog.currentStage - 1, newQuest.stages.length - 1)
        : 0;

    const freshQuest: GameQuestV4 = JSON.parse(JSON.stringify(newQuest));
    if (prog && prog.currentStage > 0) {
      freshQuest.stages = freshQuest.stages.map((s, i) =>
        i < prog.currentStage ? { ...s, completed: true } : s
      );
    }

    setSelectedSceneKey(key);
    setQuestState(freshQuest);
    setActiveStageIndex(restoreIdx);
    const map: Record<string, InteractiveObject> = {};
    newScene.objects.forEach((obj) => {
      map[obj.objectId] = { ...obj };
    });
    setSceneObjects(map);
    setSelectedObjectId(null);
    setLastConsequence(null);
    setNpcDialogueState('welcome');
    setHintLevel(0);
    setChallengeOpen(false);
    setChallengeSubmitted(false);
    setChallengeResult(null);
    setEventLog((prev) => [recordGameEvent('SCENE_ENTERED', { sceneId: key }), ...prev]);
  };

  const openChallenge = () => {
    setChallengeOpen(true);
    setUserSelectedChoice(null);
    setUserNumericInput('');
    setChallengeSubmitted(false);
    setChallengeResult(null);
  };

  const handleGate = () => {
    if (isQuestComplete) {
      setInfoBox({
        title: '🏆 Nhiệm vụ đã hoàn thành',
        body: `Chuỗi bằng chứng của cả ${totalStages} giai đoạn đã thu thập đủ. Em đã mở khóa node ${questState.unlockedNodeId} và nhận ${questState.rewardXP} XP.`
      });
      return;
    }
    if (currentStage?.completed) {
      const nextUnfinished = questState.stages.findIndex((s) => !s.completed);
      if (nextUnfinished >= 0) setActiveStageIndex(nextUnfinished);
    }
    openChallenge();
  };

  const runObjectAction = (actionType: GameActionType) => {
    if (!activeObject) return;
    const before = activeObject;
    const result = evaluateActionConsequence(actionType, activeObject, equippedToolId, {
      choiceIndex: 0
    });

    setSceneObjects((prev) => ({
      ...prev,
      [activeObject.objectId]: {
        ...activeObject,
        state: result.updatedObjectState
      }
    }));

    setLastConsequence({
      systemResponse: result.systemResponse,
      consequenceText: result.consequenceText,
      success: result.success
    });

    if (result.evidence) {
      setEvidenceList((prev) => [result.evidence!, ...prev]);
      const flag =
        actionType === 'inspect'
          ? !before.state.inspected
          : actionType === 'measure'
          ? !before.state.measured
          : actionType === 'calculate'
          ? !before.state.calculated
          : actionType === 'decide'
          ? !before.state.decided
          : actionType === 'repair'
          ? !before.state.repaired
          : true;
      if (flag) {
        recordNodeAttempt(result.evidence.knowledgeId, result.success, 8000, false);
        recordLearningEvent(
          result.success ? 'CHALLENGE_PASSED' : 'QUESTION_WRONG',
          `${ACTION_LABELS[actionType]?.label || actionType} trên ${activeObject.name}`,
          { knowledgeId: result.evidence.knowledgeId, questId: questState.questId }
        );
      }
    }

    setEventLog((prev) => [result.event, ...prev]);

    if (actionType === 'measure' && result.success) {
      setNotebookEntries((prev) => [
        {
          entryId: `NB_${Date.now()}`,
          timestamp: Date.now(),
          type: 'measurement',
          title: `Đo lường trên ${activeObject.name}`,
          content: result.systemResponse,
          knowledgeId: activeObject.knowledgeIds[0]
        },
        ...prev
      ]);
    }
  };

  const handleSubmitChallenge = () => {
    if (!currentStage || challengeSubmitted) return;
    const ch = currentStage.interactiveChallenge;
    let isCorrect = false;
    let feedback = '';
    let userAnswer = '';

    if (ch.type === 'CHOICE') {
      if (userSelectedChoice === null) return;
      userAnswer = `${String.fromCharCode(65 + userSelectedChoice)}. ${ch.options?.[userSelectedChoice] ?? ''}`;
      isCorrect = userSelectedChoice === ch.correctIndex;
      feedback = isCorrect
        ? `Chính xác! ${ch.explanation}`
        : `Chưa đúng! ${ch.explanation}`;
    } else if (ch.type === 'NUMERIC_CALC') {
      const val = parseFloat(userNumericInput);
      if (isNaN(val)) return;
      userAnswer = `${userNumericInput} ${ch.unit || ''}`;
      const target = ch.correctValue || 0;
      const tol = ch.tolerance || 0.1;
      isCorrect = Math.abs(val - target) <= tol;
      feedback = isCorrect
        ? `Chính xác! Giá trị đúng là ${target} ${ch.unit || ''}. ${ch.explanation}`
        : `Chưa chính xác! Giá trị đúng là ${target} ${ch.unit || ''}. ${ch.explanation}`;
    }

    setChallengeSubmitted(true);
    setChallengeResult({ correct: isCorrect, feedback });

    const evidenceType =
      ch.type === 'NUMERIC_CALC'
        ? 'formula_skill'
        : currentStage.requiredActionType === 'decide'
        ? 'reasoning'
        : currentStage.requiredActionType === 'measure'
        ? 'measurement_skill'
        : 'knowledge_evidence';

    const ev = createLearningEvidence(
      currentStage.knowledgeId,
      evidenceType as LearningEvidenceType,
      isCorrect ? 1.0 : 0.4,
      isCorrect ? 'QUESTION_CORRECT' : 'QUESTION_WRONG',
      `${currentStage.title} — ${isCorrect ? 'vượt qua thành công' : 'cần củng cố lại'}`
    );
    setEvidenceList((prev) => [ev, ...prev]);

    const hintUsed = hintLevel > 0;

    if (isCorrect) {
      const updatedStages = questState.stages.map((s, i) =>
        i === activeStageIndex ? { ...s, completed: true } : s
      );
      setQuestState({ ...questState, stages: updatedStages });
      recordNodeAttempt(currentStage.knowledgeId, true, 9000, hintUsed);
      recordLearningEvent('CHALLENGE_PASSED', `Giai đoạn ${currentStage.stageNumber}: ${currentStage.title}`, {
        knowledgeId: currentStage.knowledgeId,
        questId: questState.questId,
        scoreDelta: 25
      });

      const isLast = activeStageIndex === questState.stages.length - 1;
      if (isLast) {
        completeQuest(questState.questId, questState.rewardXP);
        recordLearningEvent('AREA_UNLOCKED', `Hoàn thành ${questState.title} — mở node ${questState.unlockedNodeId}`, {
          knowledgeId: questState.unlockedNodeId,
          questId: questState.questId
        });
        if (questState.unlockedNodeId) unlockScienceCard(questState.unlockedNodeId);
      } else {
        updateQuestStage(questState.questId, activeStageIndex + 1, false, 25);
      }
    } else {
      recordNodeAttempt(currentStage.knowledgeId, false, 12000, hintUsed);
      recordLearningEvent('QUESTION_WRONG', `Giai đoạn ${currentStage.stageNumber}: ${currentStage.title}`, {
        knowledgeId: currentStage.knowledgeId,
        questId: questState.questId
      });
      const correctText =
        ch.type === 'CHOICE'
          ? ch.options?.[ch.correctIndex ?? 0] ?? ''
          : `${ch.correctValue ?? 0} ${ch.unit || ''}`;
      addErrorRecord({
        questionText: ch.prompt,
        userAnswer,
        correctAnswer: correctText,
        category: currentStage.formulaId
          ? 'FORMULA'
          : currentStage.requiredActionType === 'decide'
          ? 'APPLICATION'
          : currentStage.requiredActionType === 'calculate'
          ? 'CALCULATION'
          : 'CONCEPT',
        remediationPath: {
          tab: currentStage.formulaId ? 'cong_thuc' : 'ly_thuyet',
          id: currentStage.formulaId,
          description: currentStage.learningObjective
        }
      });
    }
  };

  const handleNextStage = () => {
    const isLast = activeStageIndex === totalStages - 1;
    if (isLast) {
      setChallengeOpen(false);
      setInfoBox({
        title: '🏆 Hoàn thành vòng học',
        body: `Em không chỉ trả lời đúng — em đã đi qua chuỗi quan sát → đo lường → liên kết → phân tích → vận dụng.\n\nNhận ${questState.rewardXP} XP và mở khóa node ${questState.unlockedNodeId}.`
      });
      return;
    }
    setActiveStageIndex(activeStageIndex + 1);
    setHintLevel(0);
    setChallengeOpen(false);
    setChallengeSubmitted(false);
    setChallengeResult(null);
  };

  const requestHint = () => {
    setHintLevel((prev) => Math.min(3, prev + 1));
    setEventLog((prev) => [
      recordGameEvent('HINT_REQUESTED', { stage: currentStage?.stageNumber, level: hintLevel + 1 }),
      ...prev
    ]);
  };

  const adaptiveHint = (() => {
    if (!currentStage) return 'Không có giai đoạn hoạt động.';
    if (hintLevel <= 0) {
      return 'Hãy thao tác với vật thể trong phòng để tạo bằng chứng, rồi mở Cổng nhiệm vụ ở giai đoạn hiện tại.';
    }
    if (hintLevel === 1) return `Gợi ý 1 — ${currentStage.hint}`;
    if (hintLevel === 2) {
      return `Gợi ý 2 — Mục tiêu: ${currentStage.learningObjective}. Kiểm tra lại dữ liệu đã thu được ở các bước trước.`;
    }
    return `Gợi ý 3 — Rà soát đơn vị (${currentStage.interactiveChallenge.unit || 'chuẩn KHTN 8'}) và công thức trước khi tính.`;
  })();

  const handleStepClick = (i: number) => {
    if (questState.stages[i].completed) {
      setActiveStageIndex(i);
      setHintLevel(0);
      return;
    }
    if (i === activeStageIndex) {
      openChallenge();
      return;
    }
    setInfoBox({
      title: i < activeStageIndex ? '✅ Đã vượt qua' : '🔒 Chưa mở',
      body:
        i < activeStageIndex
          ? 'Giai đoạn này đã hoàn thành. Em có thể xem lại bằng chứng trong Sổ Tay hiện trường.'
          : `Giai đoạn ${i + 1} sẽ mở sau khi hoàn thành giai đoạn ${activeStageIndex + 1} hiện tại.`
    });
  };

  const worldBg = sceneTheme.bg;

  const NPC_POS: Record<string, { left: string; top: string }> = {
    lab: { left: '47%', top: '30%' },
    workshop: { left: '9%', top: '32%' },
    underwater: { left: '12%', top: '44%' },
    electric: { left: '10%', top: '30%' },
    thermo: { left: '47%', top: '30%' }
  };

  const renderThemeDecor = (themeKey: string) => {
    if (themeKey === 'lab') {
      return (
        <>
          <div className="absolute left-[5%] top-[12%] w-[27%] h-[21%] rounded-[10px] border-8 border-[#eee7d8]" style={{ background: 'linear-gradient(135deg,#99c6c7,#e8f2ef)' }}>
            <div className="absolute left-1/2 top-0 bottom-0 w-[6px] bg-[#eee7d8] -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 right-0 h-[6px] bg-[#eee7d8] -translate-y-1/2" />
          </div>
          <div className="absolute right-[5%] top-[12%] w-[22%] h-[20%] pb-[9px] border-b-[9px] border-earth rounded-[4px]" style={{ background: 'linear-gradient(#eee6d8 0 30%, transparent 30% 38%, #eee6d8 38% 68%, transparent 68% 76%, #eee6d8 76%)' }} />
          <div className="absolute left-[36%] top-[14%] text-[42px] leading-none">🌿</div>
          <div className="absolute left-[17%] right-[17%] top-[54%] h-[12%] rounded-[11px] shadow-[0_10px_0_#886445]" style={{ background: '#ab7b54' }}>
            <div className="absolute left-[4%] right-[4%] -top-[12px] h-[14px] rounded-[8px] bg-[#c2966a]" />
          </div>
        </>
      );
    }
    if (themeKey === 'workshop') {
      return (
        <>
          <div className="absolute right-[4%] top-[14%] w-[30%] h-[26%] border-8 border-[#d8c79a] rounded-[8px]" style={{ background: 'linear-gradient(135deg,#d0a25a,#e9d9b2)' }}>
            <div className="absolute left-1/2 top-[12%] bottom-[8%] w-[5px] bg-[#c29a62] -translate-x-1/2" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute right-[8%] w-[26%] h-[3px] rounded bg-[#9c7a44]" style={{ top: `${18 + i * 12}%` }} />
            ))}
          </div>
          <div className="absolute left-[4%] top-[16%] w-[20%] h-[16%] rounded-[6px] border-4 border-[#8a6a45]" style={{ background: 'repeating-linear-gradient(0deg,#b98d5e 0 10px,#a67c50 10px 20px)' }} />
          <div className="absolute left-1/2 top-[20%] -translate-x-1/2 text-[40px] leading-none">⚙️</div>
          <div className="absolute left-[12%] right-[12%] top-[56%] h-[13%] rounded-[10px] shadow-[0_9px_0_#6f5536]" style={{ background: '#8a6a45' }}>
            <div className="absolute left-[5%] right-[5%] -top-[11px] h-[12px] rounded-[7px] bg-[#a68157]" />
          </div>
        </>
      );
    }
    if (themeKey === 'underwater') {
      return (
        <>
          <div className="absolute left-0 right-0 top-[30%] h-[2px] bg-[rgba(140,215,255,0.4)]" />
          <div className="absolute left-[8%] top-0 w-[8%] h-[42%] skew-x-[-12deg]" style={{ background: 'linear-gradient(180deg,rgba(140,215,255,0.28),transparent)' }} />
          <div className="absolute left-[26%] top-0 w-[5%] h-[36%] skew-x-[-12deg]" style={{ background: 'linear-gradient(180deg,rgba(140,215,255,0.18),transparent)' }} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-[rgba(180,230,255,0.45)]"
              style={{ left: `${16 + i * 20}%`, bottom: `${16 + i * 10}%`, width: `${10 + i * 4}px`, height: `${10 + i * 4}px` }}
            />
          ))}
          <div className="absolute left-[6%] bottom-0 w-[30%] h-[13%] rounded-t-[40%] border-t-4 border-[#35566e]" style={{ background: '#263f52' }} />
          <div className="absolute right-[8%] bottom-0 w-[26%] h-[10%] rounded-t-[40%] border-t-4 border-[#2f4c60]" style={{ background: '#22394b' }} />
          <div className="absolute left-[20%] bottom-[12%] text-[30px] leading-none">🪸</div>
          <div className="absolute right-[14%] bottom-[13%] text-[26px] leading-none">🐠</div>
        </>
      );
    }
    if (themeKey === 'electric') {
      return (
        <>
          <div className="absolute left-0 right-0 top-[30%] h-[2px] bg-[rgba(140,180,255,0.35)]" />
          <div className="absolute left-[5%] top-0 h-[38%] w-[7px] rounded-b bg-[#5d78b8]" style={{ background: 'repeating-linear-gradient(180deg,#6d86c2 0 10px,#46598f 10px 20px)' }} />
          <div className="absolute left-[13%] top-[8%] w-[34%] h-[20%] rounded-[8px] border-4 border-[#3d5799]" style={{ background: 'linear-gradient(160deg,#8fa8dd,#e5ecfa)' }} />
          <div className="absolute right-[8%] top-[16%] w-[26%] h-[18%] rounded-[6px]" style={{ background: 'repeating-linear-gradient(90deg,#c79a3f 0 14px,#e8c56a 14px 22px)' }} />
          <div className="absolute left-[10%] bottom-[12%] text-[30px] leading-none">💡</div>
          <div className="absolute right-[12%] bottom-[14%] text-[26px] leading-none">🔋</div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-[34%] h-[2px] bg-[rgba(150,190,255,0.5)]"
              style={{ left: `${18 + i * 14}%`, top: `${46 + i * 6}%`, transform: `rotate(${i * 12}deg)` }}
            />
          ))}
        </>
      );
    }
    return (
      <>
        <div className="absolute left-[10%] top-[16%] w-[20%] h-[15%] rounded-[8px]" style={{ background: 'linear-gradient(135deg,#d9883f,#c76a2f)' }}>
          <div className="absolute left-1/2 top-1/2 w-[20%] h-[20%] rounded-full -translate-1/2" style={{ background: '#ffe9c9' }} />
        </div>
        <div className="absolute right-[9%] top-[20%] text-[44px] leading-none">🔥</div>
        <div className="absolute left-[30%] top-[14%] text-[34px] leading-none">☁️</div>
        <div className="absolute left-[12%] right-[12%] top-[56%] h-[12%] rounded-[10px] shadow-[0_9px_0_#7d5336]" style={{ background: '#9c6b45' }}>
          <div className="absolute left-[5%] right-[5%] -top-[11px] h-[12px] rounded-[7px] bg-[#b5815a]" />
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-[6%] h-[6%] rounded-full"
            style={{ left: `${16 + i * 22}%`, top: `${24 + i * 5}%`, opacity: 0.5, boxShadow: '0 0 0 3px rgba(255,190,110,0.15)' }}
          />
        ))}
      </>
    );
  };

  return (
    <div className="space-y-3">
      {/* ===== Top bar: brand / scene / stats ===== */}
      <div className="sw-card p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[14px] bg-forest text-white grid place-items-center text-[20px] shadow-soft">
              🧪
            </div>
            <div>
              <b className="text-[15px] text-ink block">Science Quest · KHTN 8</b>
              <small className="text-muted text-[10px]">Learning World · học bằng hành động</small>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div
              className="px-2.5 py-1.5 rounded-[10px] text-[11px] font-bold text-white shadow-xs border"
              style={{ background: sceneTheme.accent, borderColor: sceneTheme.accent }}
            >
              {sceneTheme.icon} {currentScene.lessonBadge || currentScene.title}
            </div>
            <button
              type="button"
              onClick={() => setDebugMode(!debugMode)}
              className={`p-1.5 rounded-[10px] border transition-all cursor-pointer ${
                debugMode ? 'bg-gold text-ink border-gold' : 'bg-paper text-muted border-line hover:bg-sage'
              }`}
              title="Chế độ giáo viên / nhà phát triển (state & event bus)"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="px-2.5 py-1.5 rounded-[10px] border border-line bg-paper text-[10px]">
              ⭐ XP <b className="text-forest">{state.totalXP}</b>
            </div>
            <div className="px-2.5 py-1.5 rounded-[10px] border border-line bg-paper text-[10px]">
              🎒 Bằng chứng <b className="text-forest">{evidenceDone}/{EVIDENCE_SLOTS.length}</b>
            </div>
            <div className="px-2.5 py-1.5 rounded-[10px] border border-line bg-paper text-[10px]">
              🧠 Làm chủ <b className="text-forest">{masteryPct}%</b>
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-line flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 text-forest">
            <Award className="w-4 h-4 text-leaf shrink-0" />
            <span><strong>Mục tiêu:</strong> {currentScene.goal}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentNpc && (
              <button
                type="button"
                onClick={() => setShowNpcModal(true)}
                className="px-2 py-1 bg-[#fbf0dc] hover:bg-[#f7e8c8] border border-[#ead6ad] text-[#76541c] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{currentNpc.avatar}</span>
                <span>Hỏi {currentNpc.name}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowNotebook(true)}
              className="px-2 py-1 bg-sage/70 hover:bg-sage border border-leaf/60 text-forest rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sổ Tay ({notebookEntries.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Scene selector grouped by chapter ===== */}
      <div className="sw-card p-2.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] font-extrabold tracking-[.09em] text-muted uppercase">🎬 Chọn màn theo bài học</span>
          <span className="flex-1 h-[1px] bg-line" />
        </div>
        <div className="overflow-x-auto pb-1 no-scrollbar">
          {SCENE_GROUPS.map((group) => (
            <div key={group.chapter} className="mb-2 last:mb-0">
              <div className="text-[9px] font-bold text-muted mb-1">{group.chapter}</div>
              <div className="flex flex-wrap gap-1">
                {group.scenes.map((sc) => {
                  const st = themeOf(sc);
                  const th = THEMES[st] || THEMES.underwater;
                  const active = selectedSceneKey === sc.sceneId;
                  return (
                    <button
                      key={sc.sceneId}
                      type="button"
                      onClick={() => handleSelectScene(sc.sceneId)}
                      className={`px-2 py-1 rounded-[9px] border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        active
                          ? 'text-white border-transparent shadow-xs'
                          : 'bg-paper text-forest border-line hover:bg-sage'
                      }`}
                      style={active ? { background: th.accent, borderColor: th.accent } : undefined}
                      title={sc.title}
                    >
                      <span>{th.icon}</span>
                      <span>{sc.lessonBadge || sc.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_300px] gap-3 items-start">
        {/* ===== LEFT: World & competency chain ===== */}
        <aside className="sw-card lg:col-span-1 xl:col-span-1">
          <div className="sw-title">🌍 Thế giới & năng lực</div>
          <div className="p-2.5">
            <div className="flex gap-2 items-center bg-sage rounded-[13px] p-2.5 mb-2.5">
              <span className="text-[26px]">🧑‍🔬</span>
              <div>
                <b className="text-[11px] text-ink">{levelInfo.title}</b>
                <small className="block text-muted text-[9px]">LV {levelInfo.level} · Nghiên cứu sinh</small>
              </div>
            </div>

            {questState.stages.slice(0, 5).map((stg, idx) => {
              const kind =
                stg.completed
                  ? 'done'
                  : idx === activeStageIndex
                  ? 'active'
                  : idx < activeStageIndex
                  ? 'done'
                  : 'lock';
              const isClickable = stg.completed || idx === activeStageIndex;
              return (
                <React.Fragment key={stg.stageId}>
                  {idx > 0 && <div className="h-3 w-[2px] bg-[#cbd8cb] mx-5" />}
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => handleStepClick(idx)}
                    className={`w-full text-left px-2.5 py-2 rounded-[12px] border transition-all cursor-pointer ${
                      kind === 'active'
                        ? '!bg-[#e6f0e4] !border-[#b9d0bb]'
                        : kind === 'done'
                        ? 'bg-transparent border-transparent opacity-90'
                        : 'opacity-45 bg-[#f2eee4] border-transparent'
                    }`}
                  >
                    <b className="text-[11px]">
                      {STAGE_ICONS[stg.requiredActionType] || '🔎'} {String(idx + 1).padStart(2, '0')} · {isClickable ? 'Bước' : 'Khóa'}
                    </b>
                    <small className="block text-muted text-[9px] mt-0.5 leading-snug">{stg.title}</small>
                  </button>
                </React.Fragment>
              );
            })}

            <div className="sw-card-flat p-2 mt-2">
              <div className="text-[10px] font-bold text-forest mb-1.5">🔗 Chuỗi năng lực</div>
              <div className="grid grid-cols-[1fr_10px_1fr] gap-1 items-center">
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px]">Quan sát</div>
                <div className="text-center text-leaf text-[10px]">→</div>
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px]">Đo lường</div>
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px]">Phân tích</div>
                <div className="text-center text-leaf text-[10px]">→</div>
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px]">Kết luận</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ===== CENTER: Interactive world scene ===== */}
        <main className="sw-card p-2 lg:col-span-1 xl:col-span-1">
          <div
            className="relative overflow-hidden rounded-[15px] border border-[#c7d7cb]"
            style={{ background: worldBg, height: 560 }}
          >
            <div className="absolute z-20 left-3 top-3 bg-paper/95 border border-line rounded-[12px] px-3 py-2 shadow-soft max-w-[300px]">
              <small className="block text-leaf text-[9px] font-extrabold tracking-[.09em]">
                QUEST {String(activeStageIndex + 1).padStart(2, '0')} · TÌNH HUỐNG
              </small>
              <b className="text-[15px] text-ink block leading-tight mt-0.5">{questState.title}</b>
              <span className="block text-muted text-[9px] mt-0.5 leading-snug">{currentStage?.title}</span>
            </div>

            {renderThemeDecor(sceneThemeKey)}

            <button
              type="button"
              onClick={() => setShowNpcModal(true)}
              className="absolute z-10 text-[40px] leading-none cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: (NPC_POS[sceneThemeKey] || NPC_POS.underwater).left,
                top: (NPC_POS[sceneThemeKey] || NPC_POS.underwater).top,
                filter: 'drop-shadow(0 8px 5px rgba(0,0,0,.12))'
              }}
              title={currentNpc?.name}
            >
              {currentNpc?.avatar || '🧑‍🔬'}
            </button>

            {currentScene.objects.map((obj, i) => {
              const live = sceneObjects[obj.objectId] || obj;
              const sel = selectedObjectId === obj.objectId;
              const pos = OBJ_STYLES[i % OBJ_STYLES.length];
              const stateLabel = live.state.measured
                ? '✓ Đã đo'
                : live.state.inspected
                ? '✓ Đã xem'
                : ACTION_LABELS[obj.actions[0]]?.label || obj.type;
              return (
                <button
                  key={obj.objectId}
                  type="button"
                  onClick={() => {
                    setSelectedObjectId(obj.objectId);
                    setActionTarget(live);
                  }}
                  className={`absolute z-10 min-w-[104px] text-center px-2 py-2 rounded-[13px] border transition-transform duration-150 hover:-translate-y-1 cursor-pointer ${
                    sel
                      ? '!bg-sage/95 !border-forest2 shadow-[0_14px_25px_rgba(36,58,47,.17)]'
                      : 'bg-paper/95 border-[#c9d8ca] hover:border-[#79a488] shadow-[0_8px_20px_rgba(36,58,47,.12)]'
                  }`}
                  style={pos}
                >
                  <i className="block text-[26px] leading-none not-italic">{obj.visualIcon}</i>
                  <b className="block text-[11px] text-ink mt-1 leading-tight">{obj.name}</b>
                  <small className="text-[9px] text-muted">{stateLabel}</small>
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleGate}
              className="absolute z-10 right-[5%] bottom-[9%] min-w-[104px] text-center px-2 py-2 rounded-[13px] border border-[#d4a84c] bg-paper/95 hover:-translate-y-1 hover:shadow-[0_14px_25px_rgba(36,58,47,.17)] shadow-[0_8px_20px_rgba(36,58,47,.12)] transition-transform cursor-pointer"
            >
              <i className="block text-[26px] leading-none not-italic">🚪</i>
              <b className="block text-[11px] text-ink mt-1">Cổng nhiệm vụ</b>
              <small className="text-[9px] text-muted">Kiểm tra vận dụng</small>
            </button>

            <div className="absolute z-20 bottom-3 left-3 bg-forest/95 text-white rounded-[10px] px-3 py-2 text-[10px] shadow-soft max-w-[260px]">
              💡 {sceneTheme.flavor}
            </div>

            {lastConsequence && (
              <div
                className={`absolute z-30 left-1/2 top-2.5 -translate-x-1/2 max-w-[320px] w-[90%] rounded-[10px] px-3 py-2 text-[10px] border shadow-soft ${
                  lastConsequence.success
                    ? 'bg-forest text-white border-forest2'
                    : 'bg-clay text-white border-[#b97065]'
                }`}
              >
                <b>{lastConsequence.success ? '✓ ' : '⚠️ '}{lastConsequence.systemResponse}</b>
                <div className="text-[9px] opacity-90 mt-0.5">{lastConsequence.consequenceText}</div>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted mr-1">Dụng cụ:</span>
            {sceneTools.map((tool) => {
              const eq = equippedToolId === tool.toolId;
              return (
                <button
                  key={tool.toolId}
                  type="button"
                  onClick={() => setEquippedToolId(tool.toolId)}
                  title={tool.description}
                  className={`px-2 py-1.5 rounded-[10px] border text-[10px] transition-all cursor-pointer flex items-center gap-1 ${
                    eq
                      ? 'bg-forest text-white border-forest font-bold shadow-xs'
                      : 'bg-paper text-forest border-line hover:bg-sage'
                  }`}
                >
                  <span>{tool.icon}</span>
                  <span className="hidden sm:inline">{tool.name}</span>
                </button>
              );
            })}
          </div>

          {activeObject && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 px-1 py-2 bg-sage/60 rounded-[12px] border border-line">
              <span className="text-[10px] font-bold text-forest px-1">
                {activeObject.visualIcon} {activeObject.name}
              </span>
              <span className="flex-1" />
              {activeObject.actions
                .filter((a) => ACTION_LABELS[a])
                .map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => runObjectAction(a as GameActionType)}
                    className="px-2.5 py-1 bg-forest text-white hover:bg-forest2 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{ACTION_LABELS[a].icon}</span>
                    <span>{ACTION_LABELS[a].label}</span>
                  </button>
                ))}
            </div>
          )}
        </main>

        {/* ===== RIGHT: Learning Control rail ===== */}
        <aside className="sw-card lg:col-span-2 xl:col-span-1">
          <div className="sw-title">🧠 Learning Control</div>
          <div className="p-2 space-y-2">
            <div className="bg-[#edf4eb] border border-[#d2dfd0] rounded-[14px] p-2.5">
              <div className="text-[9px] uppercase tracking-[.09em] text-leaf font-extrabold">Mục tiêu hiện tại</div>
              <b className="block text-[12px] text-ink mt-0.5 leading-snug">{currentStage?.title}</b>
              <div className="text-[9px] text-muted mt-0.5">
                Cần tạo {EVIDENCE_SLOTS.length} loại bằng chứng liên kết.
              </div>
              <div className="flex items-center gap-1 my-2">
                {questState.stages.map((stg, idx) => (
                  <div
                    key={stg.stageId}
                    className={`h-[9px] flex-1 rounded-full transition-all ${
                      stg.completed ? 'bg-leaf' : idx === activeStageIndex ? 'bg-forest2' : 'bg-[#e0e6dd]'
                    }`}
                  />
                ))}
                <span className="text-[9px] text-muted">
                  {activeStageIndex + 1}→{totalStages}
                </span>
              </div>
            </div>

            <div className="sw-card-flat p-2.5">
              <h4 className="text-[10px] font-bold text-forest mb-1.5">🔎 Bằng chứng đã tạo</h4>
              <div className="grid grid-cols-2 gap-1">
                {EVIDENCE_SLOTS.map((slot) => {
                  const has = evidenceList.some((e) => slot.types.includes(e.type));
                  return (
                    <div
                      key={slot.key}
                      className={`p-1.5 rounded-[9px] text-[9px] bg-[#f0f3ea] ${has ? '' : 'opacity-45'}`}
                    >
                      <b className="block text-forest text-[9px]">{has ? '✓' : '○'} {slot.icon} {slot.label}</b>
                      <span>{has ? 'Đã tạo' : 'Chưa có'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sw-card-flat p-2.5 bg-[#edf4f2] !border-[#cfe1df]">
              <h4 className="text-[10px] font-bold text-water mb-1">🤖 AI Tutor · hỗ trợ theo trạng thái</h4>
              <p className="text-[9px] leading-[1.4] text-[#68766f]">{adaptiveHint}</p>
              <button
                type="button"
                onClick={requestHint}
                className="mt-1.5 text-[10px] bg-water hover:bg-forest text-white rounded-lg px-2.5 py-1 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                Xin gợi ý
              </button>
            </div>

            <div className="sw-card-flat p-2.5">
              <h4 className="text-[10px] font-bold text-forest mb-1.5">🧩 Liên kết kiến thức</h4>
              <div className="grid grid-cols-[1fr_10px_1fr] gap-1 items-center">
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px] break-words">
                  {currentFormula ? <MathView math={currentFormula.formulaLatex} /> : currentStage?.learningObjective}
                </div>
                <div className="text-center text-leaf text-[10px]">→</div>
                <div className="p-1.5 rounded-[9px] bg-[#edf4eb] border border-[#d7e1d4] text-center text-[9px]">
                  {currentFormula ? currentFormula.name : 'Kết luận'}
                </div>
              </div>
              <div className="mt-1 p-1.5 rounded-[9px] bg-paper border border-line text-[8px] text-muted leading-relaxed">
                {currentStage?.storyPrompt}
              </div>
            </div>

            <div className="sw-card-flat p-2.5">
              <h4 className="text-[10px] font-bold text-forest mb-1">🎯 Hệ thống sẽ đánh giá</h4>
              <p className="text-[9px] leading-[1.45] text-[#68766f]">
                • Chọn đúng dụng cụ<br />• Trình tự thao tác<br />• Đơn vị và dữ liệu<br />• Lý do của quyết định<br />• Vận dụng sang tình huống mới
              </p>
            </div>

            <div className="sw-card-flat p-2.5">
              <h4 className="text-[10px] font-bold text-forest mb-1">📜 Nhật ký suy luận</h4>
              <div className="max-h-[110px] overflow-auto pr-0.5">
                {eventLog.map((ev) => (
                  <div key={ev.id} className="text-[9px] text-muted py-1 border-b border-[#e7ebe4]">
                    [{new Date(ev.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}]{' '}
                    {EVENT_LABELS[ev.type] || ev.type}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== BOTTOM: lesson state + quest steps + transfer ===== */}
      <div className="sw-card p-2.5 grid grid-cols-1 md:grid-cols-[1.2fr_2fr_1fr] gap-2.5 items-center">
        <div className="text-[10px] text-muted">
          TRẠNG THÁI HỌC TẬP
          <br />
          <b className="text-forest text-[11px]">Giai đoạn {activeStageIndex + 1}/{totalStages}</b> · Hỗ trợ mức {hintLevel + 1}
        </div>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {questState.stages.map((stg, idx) => {
            const stateCls =
              stg.completed
                ? '!bg-[#e1ede2] !border-[#b8cfba] !text-forest font-bold'
                : idx === activeStageIndex
                ? '!bg-[#e1ede2] !border-[#b8cfba] !text-forest font-bold animate-pulse'
                : 'bg-[#f1f2eb] border-[#dfe4da] text-muted';
            return (
              <button
                key={stg.stageId}
                type="button"
                onClick={() => handleStepClick(idx)}
                className={`flex-1 min-w-[54px] px-1 py-1.5 rounded-[9px] border text-[9px] cursor-pointer transition-colors text-center ${stateCls}`}
              >
                <span className="block">{STAGE_ICONS[stg.requiredActionType] || '🔎'}</span>
                <span className="block font-bold">{String(idx + 1).padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>
        <div className="text-[10px] px-2 py-2 rounded-[10px] border border-[#ead6ad] bg-[#fbf0dc]">
          {isQuestComplete ? (
            <>
              <b className="block text-[#76541c]">✓ Đã mở khóa</b>
              Nhận {questState.rewardXP} XP · node {questState.unlockedNodeId}
            </>
          ) : (
            <>
              <b className="block text-[#76541c]">🌍 Chưa mở</b>
              Tình huống mới mở khi đủ bằng chứng của cả {totalStages} giai đoạn.
            </>
          )}
        </div>
      </div>

      {/* ===== ACTION MODAL ===== */}
      {actionTarget && (
        <div className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-[2px] flex items-center justify-center p-3">
          <div className="sw-card w-full max-w-[420px]">
            <div className="sw-title flex items-center justify-between !border-b border-line">
              <span>{actionTarget.visualIcon} {actionTarget.name}</span>
              <button type="button" onClick={() => setActionTarget(null)} className="text-muted hover:text-forest cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 space-y-3">
              <p className="text-[11px] text-muted leading-relaxed">{actionTarget.description}</p>
              <div className="space-y-1.5">
                {actionTarget.actions
                  .filter((a) => ACTION_LABELS[a])
                  .map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => {
                        setSelectedObjectId(actionTarget.objectId);
                        setActionTarget(null);
                        runObjectAction(a as GameActionType);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-[10px] bg-[#f0f3ea] hover:bg-sage border border-[#d7e1d4] text-[11px] font-medium text-forest transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span className="text-base">{ACTION_LABELS[a].icon}</span>
                      <span className="flex-1">{ACTION_LABELS[a].label}</span>
                      <ChevronRight className="w-4 h-4 text-leaf" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHALLENGE MODAL ===== */}
      {challengeOpen && currentStage && (
        <div className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-[2px] flex items-center justify-center p-3">
          <div className="sw-card w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="sw-title flex items-center justify-between">
              <span>🧩 Thử thách giai đoạn {currentStage.stageNumber}/{totalStages}</span>
              <button type="button" onClick={() => setChallengeOpen(false)} className="text-muted hover:text-forest cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-water">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentStage.learningObjective}</span>
                </div>
                <p className="text-[12px] text-ink font-medium mt-2 leading-relaxed">
                  <MathView math={currentStage.interactiveChallenge.prompt} />
                </p>
              </div>

              {currentStage.interactiveChallenge.type === 'CHOICE' && (
                <div className="space-y-1.5">
                  {currentStage.interactiveChallenge.options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={challengeSubmitted}
                      onClick={() => setUserSelectedChoice(oIdx)}
                      className={`w-full text-left p-2.5 rounded-[10px] text-[11px] font-medium border transition-all cursor-pointer flex items-start gap-2 ${
                        userSelectedChoice === oIdx
                          ? '!bg-forest !text-white !border-forest'
                          : 'bg-paper hover:bg-sage text-ink border-line'
                      }`}
                    >
                      <span className="font-bold mt-0.5">{String.fromCharCode(65 + oIdx)}.</span>
                      <span className="flex-1 leading-relaxed"><MathView math={opt} /></span>
                    </button>
                  ))}
                </div>
              )}

              {currentStage.interactiveChallenge.type === 'NUMERIC_CALC' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={challengeSubmitted}
                      value={userNumericInput}
                      onChange={(e) => setUserNumericInput(e.target.value)}
                      placeholder="Nhập giá trị số..."
                      className="flex-1 p-2.5 bg-paper border border-line rounded-[10px] text-[12px] font-mono text-ink focus:outline-none focus:ring-2 focus:ring-water"
                    />
                    <span className="text-[11px] font-bold text-muted px-1">
                      {currentStage.interactiveChallenge.unit || ''}
                    </span>
                  </div>
                  {challengeSubmitted && (
                    <div className="text-[10px] text-forest bg-sage/70 rounded-lg px-2.5 py-1.5 border border-leaf/40 font-bold">
                      → Đáp án chuẩn: {currentStage.interactiveChallenge.correctValue} {currentStage.interactiveChallenge.unit || ''}
                    </div>
                  )}
                </div>
              )}

              {currentStage.interactiveChallenge.type === 'TOOL_OPERATE' && (
                <p className="text-[10px] text-muted italic">Hãy dùng thanh dụng cụ ở giữa cảnh để thao tác vật thể.</p>
              )}
              {currentStage.interactiveChallenge.type === 'FORMULA_SELECTION' && (
                <p className="text-[10px] text-muted italic">Chọn công thức phù hợp với dữ liệu đã thu.</p>
              )}

              <div className="pt-1 flex items-center justify-between gap-3">
                {!challengeSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitChallenge}
                    className="w-full py-2.5 bg-forest hover:bg-forest2 text-white rounded-[10px] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Xác nhận & Ghi nhận Evidence
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextStage}
                    className="w-full py-2.5 bg-gold hover:bg-[#c49a3c] text-[#4a3a12] rounded-[10px] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {activeStageIndex < totalStages - 1 ? 'Tiếp tục giai đoạn sau →' : '★ Nhận thẻ khoa học & hoàn tất'}
                  </button>
                )}
              </div>

              {challengeResult && (
                <div
                  className={`p-2.5 rounded-[10px] border text-[11px] leading-relaxed ${
                    challengeResult.correct
                      ? '!bg-[#e1ede2] !border-[#b8cfba] text-forest'
                      : '!bg-[#f8e9e6] !border-[#e6c4bd] text-clay'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {challengeResult.correct ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>{challengeResult.feedback}</span>
                  </div>
                  {challengeResult.correct && hintLevel > 0 && (
                    <div className="text-[10px] mt-1 opacity-80">Lưu ý: đã dùng gợi ý, điểm mastery nhẹ hơn một chút.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== NPC MODAL ===== */}
      {showNpcModal && currentNpc && (
        <div className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-[2px] flex items-center justify-center p-3">
          <div className="sw-card w-full max-w-[480px]">
            <div className="sw-title flex items-center justify-between">
              <span>{currentNpc.avatar} {currentNpc.name}</span>
              <button type="button" onClick={() => setShowNpcModal(false)} className="text-muted hover:text-forest cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b border-line">
                <span className="text-3xl">{currentNpc.avatar}</span>
                <div>
                  <b className="text-[13px] text-ink block">{currentNpc.name}</b>
                  <small className="text-muted text-[10px]">{currentNpc.role}</small>
                </div>
              </div>
              <p className="text-[12px] text-ink leading-relaxed bg-[#fbf0dc] p-3 rounded-[10px] border border-[#ead6ad]">
                "{currentNpc.dialogues[npcDialogueState]?.speech || currentNpc.dialogues.welcome.speech}"
              </p>
              <div className="space-y-1.5">
                {(currentNpc.dialogues[npcDialogueState]?.options ||
                  currentNpc.dialogues.welcome.options ||
                  []).map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => {
                      if (opt.nextState) {
                        setNpcDialogueState(opt.nextState);
                      } else {
                        setShowNpcModal(false);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-[10px] bg-paper hover:bg-sage border border-line text-[11px] font-medium text-ink transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-leaf shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== NOTEBOOK MODAL ===== */}
      {showNotebook && (
        <div className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-[2px] flex items-center justify-center p-3">
          <div className="sw-card w-full max-w-[520px] max-h-[85vh] flex flex-col">
            <div className="sw-title flex items-center justify-between">
              <span><BookOpen className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />Sổ Tay Hiện Trường KHTN 8</span>
              <button type="button" onClick={() => setShowNotebook(false)} className="text-muted hover:text-forest cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 overflow-y-auto space-y-2 flex-1">
              {notebookEntries.map((nb) => (
                <div key={nb.entryId} className="p-2.5 rounded-[10px] bg-paper border border-line space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-forest">{nb.title}</span>
                    <span className="font-mono text-muted">{nb.type}</span>
                  </div>
                  <p className="text-[11px] text-ink leading-relaxed">{nb.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== INFO MODAL ===== */}
      {infoBox && (
        <div className="fixed inset-0 z-50 bg-forest/45 backdrop-blur-[2px] flex items-center justify-center p-3">
          <div className="sw-card w-full max-w-[440px]">
            <div className="sw-title flex items-center justify-between">
              <span>{infoBox.title}</span>
              <button type="button" onClick={() => setInfoBox(null)} className="text-muted hover:text-forest cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-[12px] text-ink leading-relaxed whitespace-pre-line">{infoBox.body}</p>
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={() => setInfoBox(null)}
                  className="px-4 py-2 bg-forest hover:bg-forest2 text-white rounded-[10px] text-[11px] font-bold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DEBUG MODE ===== */}
      {debugMode && (
        <div className="sw-card p-3 !border-gold/60 !bg-[#12261d] text-[#e7efe6] font-mono text-[11px] space-y-2">
          <div className="flex items-center justify-between">
            <b className="text-gold">Chế độ giáo viên / nhà phát triển (Debug)</b>
            <button type="button" onClick={() => setDebugMode(false)} className="text-[#9fb5aa] hover:text-white cursor-pointer">
              Đóng Debug
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-[#e7c378] mb-1 text-[10px]">State đối tượng hiện tại:</div>
              <pre className="p-2 bg-[#0c1a14] rounded-lg text-[10px] overflow-x-auto text-[#7fd7a6] max-h-40 overflow-y-auto">
                {JSON.stringify(sceneObjects, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-[#e7c378] mb-1 text-[10px]">Nhật ký sự kiện (Event Bus):</div>
              <div className="p-2 bg-[#0c1a14] rounded-lg text-[10px] overflow-y-auto max-h-40 space-y-0.5 text-[#b9cfc4]">
                {eventLog.map((ev) => (
                  <div key={ev.id}>
                    [{new Date(ev.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}] {ev.type}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};