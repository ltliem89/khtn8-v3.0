/**
 * KHTN 8 - Types & Data Contracts
 * Complies with SPEC V2: SOURCE -> CONTENT -> PRACTICE/GAME/REALWORLD -> STATE
 */

export type Curriculum = 'KNTT' | 'CD' | 'SHARED';

export type SubjectDomain = 'HOA_HOC' | 'VAT_LI' | 'SINH_HOC' | 'CHUNG';

export type SourceType =
  | 'SGK'
  | 'SGV'
  | 'SBT'
  | 'EXTERNAL'
  | 'WIKIPEDIA'
  | 'REALWORLD_SOURCE'
  | 'SCENARIO'
  | 'ILLUSTRATIVE'
  | 'SIMULATED';

export type SourceStatus =
  | 'VERIFIED'
  | 'DERIVED'
  | 'EXTERNAL_VERIFIED'
  | 'NEEDS_VERIFICATION';

export interface SourceRecord {
  sourceId: string;
  sourceType: SourceType;
  curriculum: Curriculum;
  title: string;
  fileOrUrl: string;
  location?: string;
  status: SourceStatus;
  notes?: string;
}

export interface NavigationContext {
  sourceTab?: string;
  sourceId?: string;
  domain?: SubjectDomain;
  lessonId?: string;
  conceptId?: string;
  formulaId?: string;
  unitId?: string;
  problemTypeId?: string;
  exerciseId?: string;
  experimentId?: string;
  realWorldId?: string;
  gameId?: string;
  errorType?: ErrorCategory;
  returnTo?: {
    tab: TabType;
    id?: string;
    context?: Partial<NavigationContext>;
  };
}

import { NodeMasteryRecord, LearningEvent } from './blueprint';

export type TabType =
  | 'home'
  | 'game_world'
  | 'on_tap'
  | 'ly_thuyet'
  | 'cong_thuc'
  | 'don_vi'
  | 'dang_bai'
  | 'bai_tap'
  | 'thi_nghiem'
  | 'thuc_tien'
  | 'lien_mon'
  | 'xuat_ban'
  | 'game'
  | 'tu_kiem_tra'
  | 'loi_sai'
  | 'tra_cuu'
  | 'tien_do'
  | 'teacher_dashboard';

export interface Lesson {
  id: string;
  domain: SubjectDomain;
  chapterNumber: number;
  chapterTitle: string;
  lessonNumber: number;
  title: string;
  curriculum: Curriculum;
  sourceId: string;
  summary: string[];
  keyObjectives: string[];
}

export interface Concept {
  id: string;
  lessonId: string;
  domain: SubjectDomain;
  term: string;
  definition: string;
  curriculum: Curriculum;
  sourceId: string;
  keywords: string[];
  commonMisconceptions: string[];
  realWorldHook: string;
  relatedFormulaIds?: string[];
  relatedUnitIds?: string[];
}

export interface FormulaVariable {
  symbol: string;
  name: string;
  unit: string;
  description?: string;
}

export interface Formula {
  id: string;
  name: string;
  formulaLatex: string;
  description: string;
  domain: SubjectDomain;
  lessonId: string;
  curriculum: Curriculum;
  sourceId: string;
  variables: FormulaVariable[];
  conditions: string[];
  derivedForms?: string[];
  calculatorConfig?: {
    inputs: { id: string; label: string; unit: string; defaultValue: number; min?: number; max?: number }[];
    output: { label: string; unit: string };
    calculate: (inputs: Record<string, number>) => number;
  };
}

export interface UnitItem {
  id: string;
  name: string;
  symbol: string;
  quantity: string;
  domain: SubjectDomain;
  baseSI: string;
  conversions: { to: string; factor: number; note?: string }[];
  sourceId: string;
  commonErrors: string;
}

export interface ProblemType {
  id: string;
  title: string;
  domain: SubjectDomain;
  lessonId: string;
  sourceId: string;
  description: string;
  steps: { stepNumber: number; title: string; instruction: string; formulaUsed?: string }[];
  trapsAndTips: string[];
  sampleExample: {
    problemStatement: string;
    solutionSteps: string[];
    finalAnswer: string;
  };
}

export interface Exercise {
  id: string;
  problemTypeId?: string;
  lessonId: string;
  domain: SubjectDomain;
  curriculum: Curriculum;
  sourceId: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'ORDERING';
  options?: string[];
  correctAnswer: string | number | number[];
  hint1: string;
  hint2: string;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  errorCategoryIfWrong: ErrorCategory;
  relatedFormulaId?: string;
  relatedConceptId?: string;
}

export interface Experiment {
  id: string;
  title: string;
  domain: SubjectDomain;
  lessonId: string;
  curriculum: Curriculum;
  sourceId: string;
  objective: string;
  apparatus: string[];
  safetyNotes: string[];
  steps: {
    step: number;
    action: string;
    observation: string;
    scientificExplanation: string;
  }[];
  interactiveState?: {
    variableName: string;
    options: { label: string; value: string | number; resultText: string; visualState: string }[];
  };
}

export interface RealWorldItem {
  id: string;
  title: string;
  domain: SubjectDomain;
  category: 'DO_SONG' | 'Y_TE' | 'NONG_NGHIEP' | 'MOI_TRUONG' | 'KY_THUAT';
  nature: 'FACT' | 'SCENARIO' | 'ILLUSTRATIVE' | 'SIMULATED';
  sourceId: string;
  overview: string;
  problemContext: string;
  scientificMechanism: string;
  actionableTakeaways: string[];
  connectedLessonIds: string[];
  connectedFormulaIds?: string[];
}

export type GameId =
  | 'G01' // Flashcard
  | 'G02' // Ghép cặp
  | 'G03' // Phân loại
  | 'G04' // Lắp công thức
  | 'G05' // Biến đổi công thức
  | 'G06' // Đổi đơn vị
  | 'G08' // Tính nhanh
  | 'G11' // Dự đoán hiện tượng
  | 'G13' // Bắt lỗi sai
  | 'G16'; // Đấu trường tri thức

export interface GameMetadata {
  id: GameId;
  name: string;
  description: string;
  targetCompetency: string;
  iconName: string;
}

export type ErrorCategory =
  | 'CONCEPT'
  | 'FORMULA'
  | 'UNIT'
  | 'PROBLEM_STRATEGY'
  | 'PROCEDURE'
  | 'APPLICATION'
  | 'CALCULATION';

export interface UserErrorRecord {
  id: string;
  timestamp: number;
  exerciseId?: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  category: ErrorCategory;
  remediationPath: {
    tab: TabType;
    id?: string;
    description: string;
  };
  resolved: boolean;
}

export interface UserProgressState {
  curriculumPreference: Curriculum;
  completedLessons: string[];
  masteredConcepts: string[];
  masteredFormulas: string[];
  completedExercises: Record<string, { correct: boolean; score: number }>;
  completedExperiments: string[];
  gameHighScores: Record<string, number>;
  errorNotebook: UserErrorRecord[];
  dailyStreak: number;
  lastActiveDate: string;
  totalXP: number;
  badges: string[];
  nodeMastery?: Record<string, NodeMasteryRecord>;
  questProgress?: Record<string, { status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'; currentStage: number }>;
  bossVictories?: Record<string, { defeated: boolean; bestScore: number; stars: number }>;
  dailyMissionDone?: boolean;
  dailyMissionDate?: string;
  discoveredCards?: string[];
  learningEvents?: LearningEvent[];
  completedRepairMissions?: string[];
}
