import React, { useState } from 'react';
import {
  GameScene,
  GameQuestV4,
  InteractiveObject,
  ToolItem,
  LearningEvidence,
  GameEventRecord,
  GameActionType
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
import { MathView } from '../MathView';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Target,
  Check,
  X,
  Binary,
  HelpCircle,
  Activity,
  Layers,
  Award,
  ChevronRight,
  Eye,
  Settings,
  Flame,
  Shield,
  Zap,
  Info
} from 'lucide-react';

interface GameplaySceneViewProps {
  onMasteryUpdated?: (knowledgeId: string, scoreDelta: number) => void;
  onXPGranted?: (xp: number) => void;
}

export const GameplaySceneView: React.FC<GameplaySceneViewProps> = ({
  onMasteryUpdated,
  onXPGranted
}) => {
  // Active Scene & Quest
  const [selectedSceneKey, setSelectedSceneKey] = useState<string>('SC_HOA_01');
  const currentScene: GameScene = ALL_V4_SCENES[selectedSceneKey] || ALL_V4_SCENES['SC_HOA_01'];

  // Current Quest state for this scene
  const [questState, setQuestState] = useState<GameQuestV4>(
    JSON.parse(JSON.stringify(ALL_V4_QUESTS[currentScene.currentQuestId] || ALL_V4_QUESTS['QUEST_V4_01']))
  );

  // Objects state
  const [sceneObjects, setSceneObjects] = useState<Record<string, InteractiveObject>>(() => {
    const map: Record<string, InteractiveObject> = {};
    currentScene.objects.forEach((obj) => {
      map[obj.objectId] = { ...obj };
    });
    return map;
  });

  // Equipped tool
  const [equippedToolId, setEquippedToolId] = useState<string | null>('T_SCALE');

  // Interactive Inspector
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>('O_GAS_CYLINDER');

  // NPC dialogue state
  const [npcDialogueState, setNpcDialogueState] = useState<string>('welcome');
  const [showNpcModal, setShowNpcModal] = useState<boolean>(false);

  // Consequence Banner
  const [lastConsequence, setLastConsequence] = useState<{
    systemResponse: string;
    consequenceText: string;
    success: boolean;
  } | null>(null);

  // Evidence list
  const [evidenceList, setEvidenceList] = useState<LearningEvidence[]>([
    createLearningEvidence(
      'K_HOA_01',
      'observation',
      0.85,
      'SCENE_ENTERED',
      'Khảo sát hiện trường phòng thí nghiệm phát hiện bình khí rò rỉ'
    )
  ]);

  // Event log
  const [eventLog, setEventLog] = useState<GameEventRecord[]>([
    recordGameEvent('SCENE_ENTERED', { sceneId: currentScene.sceneId })
  ]);

  // Notebook drawer
  const [showNotebook, setShowNotebook] = useState<boolean>(false);
  const [notebookEntries, setNotebookEntries] = useState(V4_INITIAL_NOTEBOOK);

  // Debug Mode (Spec v4.0 Section 37)
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Interactive challenge modal state
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [userSelectedChoice, setUserSelectedChoice] = useState<number | null>(null);
  const [userNumericInput, setUserNumericInput] = useState<string>('');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);
  const [challengeResult, setChallengeResult] = useState<{
    correct: boolean;
    feedback: string;
  } | null>(null);

  const currentStage = questState.stages[activeStageIndex];
  const activeObject = selectedObjectId ? sceneObjects[selectedObjectId] : null;
  const equippedTool = V4_INITIAL_TOOLS.find((t) => t.toolId === equippedToolId);
  const currentNpc = currentScene.npcs[0];

  // Change Scene
  const handleSelectScene = (key: string) => {
    setSelectedSceneKey(key);
    const newScene = ALL_V4_SCENES[key];
    const newQuest = ALL_V4_QUESTS[newScene.currentQuestId];
    setQuestState(JSON.parse(JSON.stringify(newQuest)));
    const map: Record<string, InteractiveObject> = {};
    newScene.objects.forEach((obj) => {
      map[obj.objectId] = { ...obj };
    });
    setSceneObjects(map);
    setSelectedObjectId(newScene.objects[0]?.objectId || null);
    setActiveStageIndex(0);
    setUserSelectedChoice(null);
    setUserNumericInput('');
    setChallengeSubmitted(false);
    setChallengeResult(null);
    setLastConsequence(null);
    setNpcDialogueState('welcome');
  };

  // Perform an Action on an Object
  const handleExecuteAction = (actionType: GameActionType) => {
    if (!activeObject) return;

    const result = evaluateActionConsequence(
      actionType,
      activeObject,
      equippedToolId,
      { choiceIndex: userSelectedChoice }
    );

    // Update state
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
      if (onMasteryUpdated) {
        onMasteryUpdated(result.evidence.knowledgeId, Math.round(result.evidence.quality * 10));
      }
    }

    setEventLog((prev) => [result.event, ...prev]);

    // Record into notebook if measure or calculate
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

  // Submit Interactive Challenge
  const handleSubmitChallenge = () => {
    if (!currentStage || challengeSubmitted) return;

    const ch = currentStage.interactiveChallenge;
    let isCorrect = false;
    let feedback = '';

    if (ch.type === 'CHOICE') {
      if (userSelectedChoice === null) return;
      isCorrect = userSelectedChoice === ch.correctIndex;
      feedback = isCorrect
        ? `Chính xác! ${ch.explanation}`
        : `Chưa đúng! ${ch.explanation}`;
    } else if (ch.type === 'NUMERIC_CALC') {
      const val = parseFloat(userNumericInput);
      if (isNaN(val)) return;
      const target = ch.correctValue || 0;
      const tol = ch.tolerance || 0.1;
      isCorrect = Math.abs(val - target) <= tol;
      feedback = isCorrect
        ? `Chính xác! Giá trị tính được là ${val} ${ch.unit || ''}. ${ch.explanation}`
        : `Chưa chính xác! Giá trị tính đúng phải là ${target} ${ch.unit || ''}. ${ch.explanation}`;
    }

    setChallengeSubmitted(true);
    setChallengeResult({ correct: isCorrect, feedback });

    // Generate Learning Evidence
    const evidenceType =
      ch.type === 'NUMERIC_CALC'
        ? 'formula_skill'
        : currentStage.requiredActionType === 'measure'
        ? 'measurement_skill'
        : currentStage.requiredActionType === 'decide'
        ? 'reasoning'
        : 'knowledge_evidence';

    const ev = createLearningEvidence(
      currentStage.knowledgeId,
      evidenceType,
      isCorrect ? 1.0 : 0.4,
      isCorrect ? 'QUESTION_CORRECT' : 'QUESTION_WRONG',
      `${currentStage.title} - ${isCorrect ? 'Vượt qua thành công' : 'Cần củng cố lại'}`
    );
    setEvidenceList((prev) => [ev, ...prev]);

    if (isCorrect) {
      // Mark stage complete
      const updatedStages = [...questState.stages];
      updatedStages[activeStageIndex].completed = true;
      setQuestState({
        ...questState,
        stages: updatedStages
      });

      if (onMasteryUpdated) {
        onMasteryUpdated(currentStage.knowledgeId, 15);
      }
      if (onXPGranted) {
        onXPGranted(25);
      }
    }
  };

  // Next Stage
  const handleNextStage = () => {
    if (activeStageIndex < questState.stages.length - 1) {
      setActiveStageIndex(activeStageIndex + 1);
      setUserSelectedChoice(null);
      setUserNumericInput('');
      setChallengeSubmitted(false);
      setChallengeResult(null);
    } else {
      // Quest Completed!
      setQuestState({
        ...questState,
        status: 'COMPLETED'
      });
      if (onXPGranted) {
        onXPGranted(questState.rewardXP);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER & SCENE SELECTOR ================= */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider">
                Gameplay-First Engine v4.0
              </span>
              <span className="text-2xs text-slate-400">
                Action · State · Consequence · Evidence Loop
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{currentScene.title}</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentScene.storyIntro}
            </p>
          </div>

          {/* Scene Selector & Debug Mode Toggle */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => handleSelectScene('SC_HOA_01')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSceneKey === 'SC_HOA_01'
                  ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🧪 Màn 1: Hóa Học (Bình Khí & Dung Dịch)
            </button>

            <button
              type="button"
              onClick={() => handleSelectScene('SC_VAT_01')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSceneKey === 'SC_VAT_01'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🌊 Màn 2: Vật Lí (Áp Suất Tàu Lặn)
            </button>

            <button
              type="button"
              onClick={() => setDebugMode(!debugMode)}
              className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                debugMode
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Chế độ Nhà Phát Triển / Giáo Viên (Debug State & Event Log)"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Debug</span>
            </button>
          </div>
        </div>

        {/* Goal & Knowledge Anchors */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-teal-300 font-medium">
            <Target className="w-4 h-4 text-teal-400 shrink-0" />
            <span>
              <strong>Mục tiêu:</strong> {currentScene.goal}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap text-2xs">
            <span className="text-slate-400">Kiến thức liên kết:</span>
            {currentScene.knowledgeIds.map((kId) => (
              <span
                key={kId}
                className="bg-slate-700 px-2 py-0.5 rounded text-teal-200 font-mono font-bold"
              >
                {kId}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= LIVE GAMEPLAY CANVAS & STAGE WORKFLOW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 3D-ish Interactive Scene Room (Objects & Environment) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Không Gian Thực Chiến (Phòng Thí Nghiệm Số)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentNpc && (
                  <button
                    type="button"
                    onClick={() => setShowNpcModal(true)}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-2xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{currentNpc.avatar}</span>
                    <span>Hỏi {currentNpc.name}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowNotebook(true)}
                  className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 rounded-lg text-2xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sổ Tay Hiện Trường ({notebookEntries.length})</span>
                </button>
              </div>
            </div>

            {/* Interactive Objects Canvas Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentScene.objects.map((obj) => {
                const liveObj = sceneObjects[obj.objectId] || obj;
                const isSelected = selectedObjectId === obj.objectId;

                return (
                  <div
                    key={obj.objectId}
                    onClick={() => setSelectedObjectId(obj.objectId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between min-h-[140px] relative group ${
                      isSelected
                        ? 'bg-gradient-to-br from-teal-900/60 to-slate-900 border-teal-400 ring-2 ring-teal-400/50 shadow-lg'
                        : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-3xl filter drop-shadow group-hover:scale-110 transition-transform">
                        {obj.visualIcon}
                      </div>
                      <div className="text-xs font-bold text-white mt-2 leading-tight">
                        {obj.name}
                      </div>
                      <div className="text-2xs text-slate-400 line-clamp-2">
                        {obj.description}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-2xs">
                      <span className="font-mono text-teal-300 uppercase font-semibold">
                        {obj.type}
                      </span>
                      {liveObj.state.measured ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          ✓ Đã đo
                        </span>
                      ) : liveObj.state.inspected ? (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                          ✓ Đã xem
                        </span>
                      ) : (
                        <span className="text-slate-500">Chạm để chọn</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar on Selected Object */}
            {activeObject && (
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeObject.visualIcon}</span>
                    <span className="font-bold">{activeObject.name}</span>
                  </div>
                  <span className="text-2xs text-teal-400 font-mono">
                    ID: {activeObject.objectId}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleExecuteAction('inspect')}
                    className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Quan sát (Inspect)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteAction('measure')}
                    className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Binary className="w-3.5 h-3.5" />
                    <span>Dùng công cụ đo (Measure)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteAction('calculate')}
                    className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tính toán (Calculate)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecuteAction('repair')}
                    className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khắc phục/Sửa (Repair)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Consequence Banner (Real-world system response) */}
            {lastConsequence && (
              <div
                className={`p-4 rounded-xl border transition-all text-xs space-y-1 ${
                  lastConsequence.success
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {lastConsequence.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{lastConsequence.systemResponse}</span>
                </div>
                <div className="text-2xs opacity-90 pl-5">
                  <strong>Hậu quả thế giới thực:</strong> {lastConsequence.consequenceText}
                </div>
              </div>
            )}

            {/* ================= TOOL HUD (DỤNG CỤ THAO TÁC) ================= */}
            <div className="pt-2 border-t border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-2xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-slate-300">
                  Thanh Dụng Cụ Thao Tác (Equipped Tool)
                </span>
                <span>
                  Đang trang bị:{' '}
                  <strong className="text-teal-300">
                    {equippedTool ? equippedTool.name : 'Chưa chọn'}
                  </strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {V4_INITIAL_TOOLS.map((tool) => {
                  const isEquipped = equippedToolId === tool.toolId;

                  return (
                    <button
                      key={tool.toolId}
                      type="button"
                      onClick={() => setEquippedToolId(tool.toolId)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isEquipped
                          ? 'bg-teal-600 text-white border-teal-400 shadow-md ring-2 ring-teal-400/60 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700/80 border-slate-700'
                      }`}
                    >
                      <span className="text-xl">{tool.icon}</span>
                      <span className="text-2xs truncate max-w-full">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quest 7-Stage Execution Machine */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            {/* Quest Header & Stage Indicator */}
            <div className="space-y-2 border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-extrabold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Nhiệm Vụ Thực Chiến
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Giai đoạn {activeStageIndex + 1} / {questState.stages.length}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {questState.title}
              </h3>

              {/* Stage Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-0.5">
                {questState.stages.map((stg, sIdx) => (
                  <div
                    key={stg.stageId}
                    className={`flex-1 transition-all ${
                      stg.completed
                        ? 'bg-emerald-500'
                        : sIdx === activeStageIndex
                        ? 'bg-teal-500 animate-pulse'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Stage Card */}
            {currentStage && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-2xs font-mono font-bold text-teal-700 uppercase">
                    Mục tiêu giai đoạn {currentStage.stageNumber}:
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {currentStage.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {currentStage.storyPrompt}
                  </p>
                </div>

                {/* Interactive Challenge Input Form */}
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                  <div className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Thử Thách Khoa Học Cần Giải Quyết:</span>
                  </div>

                  <p className="text-xs text-slate-800 font-medium">
                    <MathView math={currentStage.interactiveChallenge.prompt} />
                  </p>

                  {/* Multiple Choice Format */}
                  {currentStage.interactiveChallenge.type === 'CHOICE' && (
                    <div className="space-y-2 pt-1">
                      {currentStage.interactiveChallenge.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={challengeSubmitted}
                          onClick={() => setUserSelectedChoice(oIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-start gap-2.5 ${
                            userSelectedChoice === oIdx
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                          }`}
                        >
                          <span className="font-bold mt-0.5">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span className="flex-1 leading-relaxed">
                            <MathView math={opt} />
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Numeric Calculation Format */}
                  {currentStage.interactiveChallenge.type === 'NUMERIC_CALC' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="any"
                          disabled={challengeSubmitted}
                          value={userNumericInput}
                          onChange={(e) => setUserNumericInput(e.target.value)}
                          placeholder="Nhập giá trị số tính toán..."
                          className="flex-1 p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="text-xs font-bold text-slate-700 px-2">
                          {currentStage.interactiveChallenge.unit || ''}
                        </span>
                      </div>
                      <div className="text-2xs text-slate-500 italic">
                        Gợi ý công thức: {currentStage.hint}
                      </div>
                    </div>
                  )}

                  {/* Submit / Advance Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    {!challengeSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitChallenge}
                        className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        Xác Nhận & Ghi Nhận Evidence
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextStage}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {activeStageIndex < questState.stages.length - 1
                            ? 'Tiếp tục giai đoạn sau →'
                            : '★ Hoàn thành nhiệm vụ & Nhận Thẻ'}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Challenge Result Feedback */}
                  {challengeResult && (
                    <div
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        challengeResult.correct
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-rose-100 border-rose-300 text-rose-900'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {challengeResult.correct ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        )}
                        <span>{challengeResult.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Accumulated Learning Evidence Feed */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-500">
                <span>Dòng Bằng Chứng Khoa Học (Evidence Feed)</span>
                <span className="text-teal-700">{evidenceList.length} bằng chứng</span>
              </div>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.evidenceId}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-2xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800">{ev.description}</span>
                      <div className="text-slate-400 font-mono">
                        {ev.type} · {ev.knowledgeId}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                      {Math.round(ev.quality * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= NPC DIALOGUE MODAL ================= */}
      {showNpcModal && currentNpc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentNpc.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentNpc.name}</h4>
                  <div className="text-2xs text-slate-500">{currentNpc.role}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNpcModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/80">
              "{currentNpc.dialogues[npcDialogueState]?.speech || currentNpc.dialogues.welcome.speech}"
            </p>

            <div className="space-y-2">
              <div className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Lựa chọn phản hồi của bạn:
              </div>
              {(
                currentNpc.dialogues[npcDialogueState]?.options ||
                currentNpc.dialogues.welcome.options ||
                []
              ).map((opt, optIdx) => (
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
                  className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-xs font-medium text-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{opt.text}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= FIELD NOTEBOOK DRAWER ================= */}
      {showNotebook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h4 className="text-base font-bold text-slate-900">Sổ Tay Hiện Trường KHTN 8</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowNotebook(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {notebookEntries.map((nb) => (
                <div key={nb.entryId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-teal-800">{nb.title}</span>
                    <span className="font-mono text-slate-400">{nb.type}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{nb.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= DEBUG MODE PANEL (SPEC V4.0 SECTION 37) ================= */}
      {debugMode && (
        <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl border border-amber-500/50 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Settings className="w-4 h-4" />
              <span>Chế độ Nhà Phát Triển / Giáo Viên (Debug Console)</span>
            </div>
            <button
              type="button"
              onClick={() => setDebugMode(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              Đóng Debug
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-amber-300 font-bold mb-1">State Đối Tượng Hiện Tại:</div>
              <pre className="p-3 bg-slate-900 rounded-lg text-2xs overflow-x-auto text-emerald-400">
                {JSON.stringify(sceneObjects, null, 2)}
              </pre>
            </div>

            <div>
              <div className="text-amber-300 font-bold mb-1">Nhật Ký Sự Kiện (Event Bus):</div>
              <div className="p-3 bg-slate-900 rounded-lg text-2xs overflow-y-auto max-h-48 space-y-1 text-slate-300">
                {eventLog.map((ev) => (
                  <div key={ev.id}>
                    [{new Date(ev.timestamp).toLocaleTimeString()}] {ev.type}
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
