/**
 * KHTN 8 Game Learning System - Master Blueprint Types
 * Implements 7-Layer Architecture, Knowledge Engine, Mastery Engine, Quest & Boss Systems
 */

import { SubjectDomain, Curriculum, ErrorCategory, TabType } from './index';

export type KnowledgeNodeType =
  | 'concept'       // Khái niệm
  | 'rule'          // Quy luật / Định luật
  | 'formula'       // Công thức
  | 'skill'         // Kỹ năng thao tác / tính toán
  | 'experiment'    // Thí nghiệm
  | 'application'   // Vận dụng thực tiễn
  | 'connection';   // Mạch liên môn

export type DifficultyLevel =
  | 'L1' // Nhận biết
  | 'L2' // Thông hiểu
  | 'L3' // Vận dụng trực tiếp
  | 'L4' // Vận dụng
  | 'L5' // Phân tích / Tổng hợp
  | 'L6'; // Tình huống / STEM

export type MasteryTier =
  | 'NOT_STARTED'  // 0 - 29%: Chưa hình thành
  | 'EMERGING'     // 30 - 49%: Đang hình thành
  | 'DEVELOPING'   // 50 - 69%: Đang phát triển
  | 'PROFICIENT'   // 70 - 84%: Đạt chuẩn
  | 'ADVANCED'     // 85 - 94%: Vững vàng
  | 'MASTER';      // 95 - 100%: Thành thạo

export type ReviewType =
  | 'QUICK'    // Review A: 3-5 câu đầu buổi
  | 'ERROR'    // Review B: Câu trong sổ tay lỗi
  | 'WEAK'     // Review C: Kiến thức Mastery < 50%
  | 'SPACED'   // Review D: Lặp lại ngắt quãng (SRS)
  | 'CHAPTER'  // Review E: Ôn tập toàn chương
  | 'MIXED';   // Review F: Trộn nhiều chương / liên môn

export type LearningStage =
  | 'DISCOVER' // 1. Khám phá
  | 'LEARN'    // 2. Hình thành kiến thức
  | 'PRACTICE' // 3. Luyện tập
  | 'APPLY'    // 4. Vận dụng
  | 'MASTER';  // 5. Kiểm tra thành thạo

/**
 * 7+ Game Node States according to MASTER GAME SPEC v2.0 Section 7
 */
export type GameNodeState =
  | 'LOCKED'              // 🔒 Chưa đủ prerequisite
  | 'AVAILABLE'           // ○ Có thể bắt đầu khám phá
  | 'LEARNING'            // ◐ Đang học lý thuyết
  | 'PRACTICING'          // ● Đang luyện tập câu hỏi
  | 'REVIEW_REQUIRED'     // ⚠ Cần ôn tập / sai nhiều / Mastery < 70%
  | 'CHALLENGE_UNLOCKED'  // ⚔ Đạt mastery tối thiểu ≥ 70%, mở Thử thách
  | 'BOSS_READY'          // 👑 Các Node & Quest đạt chuẩn, sẵn sàng khiêu chiến Boss
  | 'MASTERED'            // ★ Đạt chuẩn mastery thành thạo (≥ 85-95%)
  | 'SPACED_REVIEW';      // 🔄 Đến thời điểm cần gọi lại kiến thức (SRS)

export type QuestType =
  | 'MICRO'     // Micro Quest: 3-5 phút
  | 'STANDARD'  // Standard Quest: 10-15 phút
  | 'EPIC';     // Epic STEM Quest: 20-40 phút

export type BossStageType =
  | 'KNOWLEDGE_CHECK'     // 1. Kiểm tra khái niệm then chốt
  | 'FORMULA_CHECK'       // 2. Kiểm tra công thức & biến đổi đại lượng
  | 'APPLICATION'         // 3. Tính toán định lượng thực tế
  | 'TRAP_RESISTANCE'     // 4. Bẫy đề thi & hóa giải nhầm lẫn
  | 'ULTIMATE_CHALLENGE'; // 5. Thử thách tối thượng dứt điểm Boss

export interface KnowledgeNode {
  id: string;
  subject: 'KHTN';
  grade: 8;
  domain: SubjectDomain;
  book: Curriculum;
  chapterId: string;
  chapterTitle: string;
  lessonId: string;
  lessonTitle: string;
  title: string;
  description: string;
  type: KnowledgeNodeType;
  prerequisites: string[]; // List of prerequisite knowledge IDs
  skills: string[];
  formulaIds: string[];
  unitIds?: string[];
  realWorldHook?: string;
  practiceIds: string[];
  reviewTags: string[];
  masteryThreshold: number; // e.g. 0.7 (70%)
}

export interface NodeMasteryRecord {
  knowledgeId: string;
  correctCount: number;
  incorrectCount: number;
  attemptCount: number;
  consecutiveStreak: number;
  hintUsedCount: number;
  totalResponseTimeMs: number;
  lastReviewedTimestamp: number;
  masteryScore: number; // 0 to 100
  tier: MasteryTier;
  reviewPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface QuestStage {
  stage: LearningStage;
  title: string;
  instruction: string;
  questionId?: string;
  formulaId?: string;
  conceptId?: string;
  requiredScore?: number;
  interactiveQuestion?: {
    prompt: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    knowledgeId: string;
  };
}

export interface Quest {
  id: string;
  title: string;
  zoneId: 'KHU_A' | 'KHU_B' | 'KHU_C' | 'FINAL_AREA';
  zoneName: string;
  domain: SubjectDomain;
  description: string;
  questType: QuestType;
  estimatedMinutes: number;
  storyContext: string;
  knowledgeTargets: string[]; // knowledge node IDs
  prerequisites: string[];    // prerequisite quest IDs
  stages: QuestStage[];
  completion: {
    masteryRequired: number; // e.g. 0.7
  };
  reward: {
    xp: number;
    badgeTitle?: string;
  };
}

export interface TimedChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  knowledgeId: string;
  formulaId?: string;
  trapWarning?: string;
}

export interface TimedChallenge {
  id: string;
  title: string;
  zoneId: 'KHU_A' | 'KHU_B' | 'KHU_C' | 'FINAL_AREA';
  zoneName: string;
  domain: SubjectDomain;
  description: string;
  timeLimitSeconds: number; // e.g. 60
  knowledgeTargets: string[];
  requiredMastery: number; // e.g. 70
  questions: TimedChallengeQuestion[];
  rewardXP: number;
}

export interface ReviewRecoveryTicket {
  id: string;
  knowledgeId: string;
  knowledgeTitle: string;
  failedSource: 'QUEST' | 'CHALLENGE' | 'BOSS';
  sourceTitle: string;
  reason: string;
  recommendedReviewType: ReviewType;
  remediationPath: {
    tab: TabType;
    id?: string;
    description: string;
  };
}

export interface BossRound {
  roundNumber: number;
  title: string;
  stageType: BossStageType;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  knowledgeId: string;
  formulaId?: string;
  damage: number; // Boss HP damage upon correct answer
}

export interface BossBattle {
  id: string;
  name: string;
  title: string;
  zoneId: 'KHU_A' | 'KHU_B' | 'KHU_C' | 'FINAL_AREA';
  zoneName: string;
  domain: SubjectDomain;
  description: string;
  requiredMasteryScore: number; // minimum student mastery to challenge
  requiredQuestIds: string[];
  totalHp: number;
  avatarIcon: string;
  accentColor: string;
  rounds: BossRound[];
  rewardXP: number;
  rewardBadge: string;
}

export interface DailyMission {
  dateString: string; // YYYY-MM-DD
  title: string;
  newKnowledgeId: string;
  reviewQuestionIds: string[];
  challengeQuestionId: string;
  rewardXP: number;
  completed: boolean;
}

export interface ContentPack {
  id: Curriculum;
  name: string;
  publisher: string;
  description: string;
  totalChapters: number;
  totalLessons: number;
  verified: boolean;
}

/**
 * MASTER GAME SPEC v3.0: Science Card & Discovery Book
 */
export interface ScienceCard {
  knowledgeId: string;
  title: string;
  domain: SubjectDomain;
  chapterTitle: string;
  lessonTitle: string;
  conceptSummary: string;
  formulaLatex?: string;
  formulaName?: string;
  unitSymbol?: string;
  unitName?: string;
  realWorldApplication: string;
  unlocked: boolean;
  unlockedTimestamp?: number;
  masteryScore: number;
  cardRarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  icon: string;
}

/**
 * MASTER GAME SPEC v3.0: Fail Forward & Error as Quest (Repair Mission)
 */
export interface RepairMissionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

export interface RepairMission {
  id: string;
  title: string;
  knowledgeId: string;
  knowledgeTitle: string;
  originError: string;
  storyHook: string;
  steps: RepairMissionStep[];
  rewardXP: number;
  completed: boolean;
}

/**
 * MASTER GAME SPEC v3.0: Daily Adventure (5-10 min)
 */
export interface DailyAdventureStep {
  stepType: 'REVIEW' | 'DISCOVERY' | 'CHALLENGE';
  title: string;
  description: string;
  completed: boolean;
  knowledgeId: string;
  interactiveData: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    formulaLatex?: string;
  };
}

export interface DailyAdventure {
  id: string;
  date: string;
  title: string;
  estimatedMinutes: number;
  steps: DailyAdventureStep[];
  completed: boolean;
  rewardXP: number;
}

/**
 * MASTER GAME SPEC v3.0: Game Event <-> Learning Event Mapping
 */
export type LearningEventType =
  | 'QUEST_STARTED'
  | 'QUESTION_CORRECT'
  | 'QUESTION_WRONG'
  | 'REPAIR_STARTED'
  | 'REPAIR_COMPLETED'
  | 'REVIEW_COMPLETED'
  | 'CHALLENGE_PASSED'
  | 'BOSS_PASSED'
  | 'BOSS_FAILED'
  | 'SCIENCE_CARD_DISCOVERED'
  | 'AREA_UNLOCKED';

export interface LearningEvent {
  eventId: string;
  timestamp: number;
  eventType: LearningEventType;
  knowledgeId?: string;
  questId?: string;
  bossId?: string;
  scoreDelta?: number;
  details: string;
}

export interface ScientistRankInfo {
  rankTitle: string;
  badgeIcon: string;
  minXP: number;
  nextRankXP: number;
  perks: string[];
}

// =========================================================================
// MASTER GAME SPEC v4.0 --- GAMEPLAY-FIRST IMPLEMENTATION BLUEPRINT
// =========================================================================

export type InteractiveObjectType =
  | 'inspectable'
  | 'collectible'
  | 'measurement_tool'
  | 'experiment_equipment'
  | 'environment'
  | 'clue'
  | 'formula_device'
  | 'machine'
  | 'character';

export interface InteractiveObject {
  objectId: string;
  type: InteractiveObjectType;
  name: string;
  description: string;
  visualIcon: string;
  interactive: boolean;
  state: Record<string, any>;
  actions: string[];
  knowledgeIds: string[];
  locationNote?: string;
}

export type ToolItemType =
  | 'microscope'
  | 'scale'
  | 'ruler'
  | 'thermometer'
  | 'titration'
  | 'calculator'
  | 'notebook'
  | 'pressure_gauge';

export interface ToolItem {
  toolId: string;
  type: ToolItemType;
  name: string;
  icon: string;
  description: string;
  allowedActions: string[];
  knowledgeIds: string[];
  active?: boolean;
}

export type GameActionType =
  | 'inspect'
  | 'measure'
  | 'collect'
  | 'combine'
  | 'move'
  | 'select'
  | 'calculate'
  | 'observe'
  | 'experiment'
  | 'talk'
  | 'record'
  | 'decide'
  | 'repair';

export type LearningEvidenceType =
  | 'observation'
  | 'measurement_skill'
  | 'formula_skill'
  | 'reasoning'
  | 'knowledge_evidence'
  | 'procedure_evidence'
  | 'application_evidence'
  | 'integrated_mastery'
  | 'error_evidence';

export interface LearningEvidence {
  evidenceId: string;
  knowledgeId: string;
  skillId?: string;
  type: LearningEvidenceType;
  quality: number; // 0.0 - 1.0
  sourceEvent: string;
  timestamp: number;
  description: string;
}

export type GameEventType =
  | 'SCENE_ENTERED'
  | 'OBJECT_INSPECTED'
  | 'OBJECT_DISCOVERED'
  | 'TOOL_SELECTED'
  | 'TOOL_USED'
  | 'MEASUREMENT_MADE'
  | 'CALCULATION_SUBMITTED'
  | 'DECISION_MADE'
  | 'HINT_REQUESTED'
  | 'QUESTION_CORRECT'
  | 'QUESTION_WRONG'
  | 'REVIEW_STARTED'
  | 'REVIEW_COMPLETED'
  | 'CHALLENGE_STARTED'
  | 'CHALLENGE_PASSED'
  | 'CHALLENGE_FAILED'
  | 'BOSS_STARTED'
  | 'BOSS_PHASE_COMPLETED'
  | 'BOSS_PASSED'
  | 'QUEST_COMPLETED'
  | 'KNOWLEDGE_MASTERED'
  | 'AREA_UNLOCKED';

export interface GameEventRecord {
  id: string;
  timestamp: number;
  type: GameEventType;
  payload: Record<string, any>;
}

export interface NPCDialogue {
  speech: string;
  options?: {
    text: string;
    nextState?: string;
    consequence?: string;
    actionId?: string;
    isCorrect?: boolean;
  }[];
}

export interface NPCEntity {
  npcId: string;
  name: string;
  role: string;
  avatar: string;
  dialogueState: string;
  dialogues: Record<string, NPCDialogue>;
  knowledgeIds: string[];
}

export interface NotebookEntry {
  entryId: string;
  timestamp: number;
  type: 'observation' | 'measurement' | 'formula' | 'hypothesis' | 'conclusion' | 'error_note';
  title: string;
  content: string;
  knowledgeId?: string;
  data?: Record<string, any>;
}

export interface GameInventoryItem {
  itemId: string;
  type: 'tool' | 'clue' | 'sample' | 'formula_card' | 'measurement_record' | 'mission_item';
  name: string;
  description: string;
  icon: string;
  quantity?: number;
  payload?: Record<string, any>;
}

export interface QuestStageV4 {
  stageId: string;
  stageNumber: number;
  title: string;
  storyPrompt: string;
  requiredActionType: GameActionType;
  targetObjectId?: string;
  requiredToolId?: string;
  hint: string;
  completed: boolean;
  learningObjective: string;
  knowledgeId: string;
  formulaId?: string;
  interactiveChallenge: {
    prompt: string;
    type: 'CHOICE' | 'NUMERIC_CALC' | 'TOOL_OPERATE' | 'FORMULA_SELECTION';
    options?: string[];
    correctIndex?: number;
    correctValue?: number;
    tolerance?: number;
    unit?: string;
    explanation: string;
  };
}

export interface GameQuestV4 {
  questId: string;
  title: string;
  domain: SubjectDomain;
  chapterTitle: string;
  storyIntro: string;
  currentStageIndex: number;
  stages: QuestStageV4[];
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'REVIEW_REQUIRED' | 'COMPLETED' | 'MASTERED';
  rewardXP: number;
  unlockedNodeId: string;
  rewardCardId?: string;
}

export interface GameScene {
  sceneId: string;
  title: string;
  domain: SubjectDomain;
  chapterTitle: string;
  storyIntro: string;
  goal: string;
  knowledgeIds: string[];
  objects: InteractiveObject[];
  tools: ToolItem[];
  npcs: NPCEntity[];
  currentQuestId: string;
}

export interface GameStateV4 {
  activeSceneId: string;
  activeQuestId: string;
  sceneObjects: Record<string, InteractiveObject>;
  equippedToolId: string | null;
  inventory: GameInventoryItem[];
  notebook: NotebookEntry[];
  evidenceList: LearningEvidence[];
  eventLog: GameEventRecord[];
  debugMode: boolean;
}

