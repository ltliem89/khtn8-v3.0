import React, { createContext, useContext, useState, useEffect } from 'react';
import { Curriculum, UserProgressState, UserErrorRecord, ErrorCategory, TabType } from '../types';
import { NodeMasteryRecord, LearningEvent, LearningEventType } from '../types/blueprint';
import { calculateNodeMastery } from '../utils/masteryEngine';
import { createLearningEvent } from '../utils/gameEngine';

interface LearningContextType {
  state: UserProgressState;
  setCurriculum: (c: Curriculum) => void;
  markLessonComplete: (lessonId: string) => void;
  markConceptMastered: (conceptId: string) => void;
  markFormulaMastered: (formulaId: string) => void;
  recordExerciseResult: (exerciseId: string, isCorrect: boolean, score: number) => void;
  recordExperimentDone: (expId: string) => void;
  recordGameScore: (gameId: string, score: number) => void;
  addErrorRecord: (error: Omit<UserErrorRecord, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveErrorRecord: (errorId: string) => void;
  // Master Blueprint Engines:
  recordNodeAttempt: (knowledgeId: string, isCorrect: boolean, responseTimeMs?: number, hintUsed?: boolean) => void;
  advanceQuestStage: (questId: string) => void;
  updateQuestStage: (questId: string, currentStage: number, isFinished: boolean, rewardXP?: number) => void;
  completeQuest: (questId: string, rewardXP?: number) => void;
  recordBossDefeat: (bossId: string, stars: number, score: number) => void;
  completeDailyMission: () => void;
  recordLearningEvent: (eventType: LearningEventType, details: string, extra?: { knowledgeId?: string; questId?: string; bossId?: string; scoreDelta?: number }) => void;
  unlockScienceCard: (knowledgeId: string) => void;
  completeRepairMission: (missionId: string, rewardXP?: number) => void;
  clearAllProgress: () => void;
}

const STORAGE_KEY = 'khtn8_user_learning_state_v3';

const INITIAL_NODE_MASTERY: Record<string, NodeMasteryRecord> = {
  KN_HOA_01: {
    knowledgeId: 'KN_HOA_01',
    correctCount: 4,
    incorrectCount: 1,
    attemptCount: 5,
    consecutiveStreak: 3,
    hintUsedCount: 0,
    totalResponseTimeMs: 24000,
    lastReviewedTimestamp: Date.now() - 3600000 * 12,
    masteryScore: 82,
    tier: 'PROFICIENT',
    reviewPriority: 'NORMAL'
  },
  KN_HOA_02: {
    knowledgeId: 'KN_HOA_02',
    correctCount: 5,
    incorrectCount: 1,
    attemptCount: 6,
    consecutiveStreak: 4,
    hintUsedCount: 1,
    totalResponseTimeMs: 38000,
    lastReviewedTimestamp: Date.now() - 3600000 * 2,
    masteryScore: 78,
    tier: 'PROFICIENT',
    reviewPriority: 'NORMAL'
  },
  KN_HOA_03: {
    knowledgeId: 'KN_HOA_03',
    correctCount: 2,
    incorrectCount: 3,
    attemptCount: 5,
    consecutiveStreak: 0,
    hintUsedCount: 2,
    totalResponseTimeMs: 45000,
    lastReviewedTimestamp: Date.now() - 3600000 * 48,
    masteryScore: 42,
    tier: 'EMERGING',
    reviewPriority: 'HIGH'
  },
  KN_VAT_01: {
    knowledgeId: 'KN_VAT_01',
    correctCount: 4,
    incorrectCount: 0,
    attemptCount: 4,
    consecutiveStreak: 4,
    hintUsedCount: 0,
    totalResponseTimeMs: 18000,
    lastReviewedTimestamp: Date.now() - 3600000 * 6,
    masteryScore: 92,
    tier: 'ADVANCED',
    reviewPriority: 'LOW'
  },
  KN_VAT_02: {
    knowledgeId: 'KN_VAT_02',
    correctCount: 3,
    incorrectCount: 1,
    attemptCount: 4,
    consecutiveStreak: 2,
    hintUsedCount: 1,
    totalResponseTimeMs: 31000,
    lastReviewedTimestamp: Date.now() - 3600000 * 24,
    masteryScore: 71,
    tier: 'PROFICIENT',
    reviewPriority: 'NORMAL'
  },
  KN_VAT_03: {
    knowledgeId: 'KN_VAT_03',
    correctCount: 1,
    incorrectCount: 2,
    attemptCount: 3,
    consecutiveStreak: 0,
    hintUsedCount: 2,
    totalResponseTimeMs: 40000,
    lastReviewedTimestamp: Date.now() - 3600000 * 72,
    masteryScore: 35,
    tier: 'EMERGING',
    reviewPriority: 'URGENT'
  }
};

const DEFAULT_STATE: UserProgressState = {
  curriculumPreference: 'KNTT',
  completedLessons: ['L_HOA_01', 'L_HOA_02', 'L_VAT_01'],
  masteredConcepts: ['C_HOA_BIEN_DOI_HOA_HOC', 'C_VAT_KHOI_LUONG_RIENG'],
  masteredFormulas: ['F_HOA_MOL_KHOI_LUONG', 'F_VAT_KHOI_LUONG_RIENG'],
  completedExercises: {
    'EX_HOA_01': { correct: true, score: 10 },
    'EX_VAT_01': { correct: true, score: 10 }
  },
  completedExperiments: ['EXP_HOA_01'],
  gameHighScores: {
    'G01': 85,
    'G04': 95
  },
  errorNotebook: [
    {
      id: 'err_demo_1',
      timestamp: Date.now() - 3600000,
      questionText: 'Số mol của 24,79 lít khí oxygen ở 25 °C, 1 bar?',
      userAnswer: '1,1 mol (tính theo 22,4 L)',
      correctAnswer: '1,0 mol (chuẩn mới 24,79 L/mol)',
      category: 'FORMULA',
      remediationPath: {
        tab: 'cong_thuc',
        id: 'F_HOA_MOL_THE_TICH',
        description: 'Xem lại công thức tính thể tích khí ở điều kiện chuẩn (25 °C, 1 bar)'
      },
      resolved: false
    }
  ],
  dailyStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalXP: 580,
  badges: ['Khởi Động Nhà Khoa Học', 'Thực Hành Chuẩn Xác', 'Dũng Sĩ Hóa Học'],
  nodeMastery: INITIAL_NODE_MASTERY,
  questProgress: {
    'Q_HOA_01': { status: 'COMPLETED', currentStage: 4 },
    'Q_HOA_02': { status: 'IN_PROGRESS', currentStage: 2 },
    'Q_VAT_01': { status: 'AVAILABLE', currentStage: 1 }
  },
  bossVictories: {
    'BOSS_KHU_A': { defeated: true, bestScore: 480, stars: 3 }
  },
  dailyMissionDone: false,
  dailyMissionDate: new Date().toISOString().split('T')[0],
  discoveredCards: ['KN_HOA_01', 'KN_VAT_01'],
  learningEvents: [
    {
      eventId: 'EV_001',
      timestamp: Date.now() - 3600000 * 24,
      eventType: 'AREA_UNLOCKED',
      details: 'Khám phá thành công Khu A: Giả Kim & Hóa Học'
    },
    {
      eventId: 'EV_002',
      timestamp: Date.now() - 3600000 * 12,
      eventType: 'QUEST_STARTED',
      questId: 'Q_HOA_01',
      details: 'Bắt đầu nhiệm vụ: Giải Mã Bí Ẩn Bảo Toàn Khối Lượng'
    },
    {
      eventId: 'EV_003',
      timestamp: Date.now() - 3600000 * 8,
      eventType: 'SCIENCE_CARD_DISCOVERED',
      knowledgeId: 'KN_HOA_01',
      details: 'Đạt Mastery ≥ 70%, mở khóa Thẻ bài Khoa học: Định luật Bảo toàn khối lượng'
    }
  ],
  completedRepairMissions: []
};

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_STATE,
          ...parsed,
          nodeMastery: {
            ...DEFAULT_STATE.nodeMastery,
            ...(parsed.nodeMastery || {})
          }
        };
      }
    } catch {
      // fallback
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save learning state to localStorage', e);
    }
  }, [state]);

  const setCurriculum = (c: Curriculum) => {
    setState((prev) => ({ ...prev, curriculumPreference: c }));
  };

  const markLessonComplete = (lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        totalXP: prev.totalXP + 50
      };
    });
  };

  const markConceptMastered = (conceptId: string) => {
    setState((prev) => {
      if (prev.masteredConcepts.includes(conceptId)) return prev;
      return {
        ...prev,
        masteredConcepts: [...prev.masteredConcepts, conceptId],
        totalXP: prev.totalXP + 20
      };
    });
  };

  const markFormulaMastered = (formulaId: string) => {
    setState((prev) => {
      if (prev.masteredFormulas.includes(formulaId)) return prev;
      return {
        ...prev,
        masteredFormulas: [...prev.masteredFormulas, formulaId],
        totalXP: prev.totalXP + 25
      };
    });
  };

  const recordExerciseResult = (exerciseId: string, isCorrect: boolean, score: number) => {
    setState((prev) => ({
      ...prev,
      completedExercises: {
        ...prev.completedExercises,
        [exerciseId]: { correct: isCorrect, score }
      },
      totalXP: isCorrect ? prev.totalXP + score : prev.totalXP + 5
    }));
  };

  const recordExperimentDone = (expId: string) => {
    setState((prev) => {
      if (prev.completedExperiments.includes(expId)) return prev;
      return {
        ...prev,
        completedExperiments: [...prev.completedExperiments, expId],
        totalXP: prev.totalXP + 40
      };
    });
  };

  const recordGameScore = (gameId: string, score: number) => {
    setState((prev) => {
      const oldScore = prev.gameHighScores[gameId] || 0;
      return {
        ...prev,
        gameHighScores: {
          ...prev.gameHighScores,
          [gameId]: Math.max(oldScore, score)
        },
        totalXP: prev.totalXP + Math.round(score / 2)
      };
    });
  };

  const addErrorRecord = (error: Omit<UserErrorRecord, 'id' | 'timestamp' | 'resolved'>) => {
    const newRecord: UserErrorRecord = {
      ...error,
      id: 'err_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      resolved: false
    };
    setState((prev) => ({
      ...prev,
      errorNotebook: [newRecord, ...prev.errorNotebook.slice(0, 49)]
    }));
  };

  const resolveErrorRecord = (errorId: string) => {
    setState((prev) => ({
      ...prev,
      errorNotebook: prev.errorNotebook.map((err) =>
        err.id === errorId ? { ...err, resolved: true } : err
      ),
      totalXP: prev.totalXP + 30
    }));
  };

  // --- Master Blueprint: Mastery Engine Integration ---
  const recordNodeAttempt = (
    knowledgeId: string,
    isCorrect: boolean,
    responseTimeMs = 15000,
    hintUsed = false
  ) => {
    setState((prev) => {
      const oldMap = prev.nodeMastery || {};
      const existing = oldMap[knowledgeId] || {
        knowledgeId,
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

      const correctCount = existing.correctCount + (isCorrect ? 1 : 0);
      const incorrectCount = existing.incorrectCount + (isCorrect ? 0 : 1);
      const attemptCount = existing.attemptCount + 1;
      const consecutiveStreak = isCorrect ? existing.consecutiveStreak + 1 : 0;
      const hintUsedCount = existing.hintUsedCount + (hintUsed ? 1 : 0);
      const totalResponseTimeMs = existing.totalResponseTimeMs + responseTimeMs;
      const lastReviewedTimestamp = Date.now();

      const evaluation = calculateNodeMastery({
        correctCount,
        incorrectCount,
        attemptCount,
        consecutiveStreak,
        hintUsedCount,
        lastReviewedTimestamp
      });

      const updatedRecord: NodeMasteryRecord = {
        knowledgeId,
        correctCount,
        incorrectCount,
        attemptCount,
        consecutiveStreak,
        hintUsedCount,
        totalResponseTimeMs,
        lastReviewedTimestamp,
        masteryScore: evaluation.score,
        tier: evaluation.tier,
        reviewPriority: evaluation.reviewPriority
      };

      const earnedXP = isCorrect ? 15 : 5;

      return {
        ...prev,
        totalXP: prev.totalXP + earnedXP,
        nodeMastery: {
          ...oldMap,
          [knowledgeId]: updatedRecord
        }
      };
    });
  };

  // --- Master Blueprint: Quest Progression ---
  const advanceQuestStage = (questId: string) => {
    setState((prev) => {
      const current = prev.questProgress?.[questId] || { status: 'AVAILABLE', currentStage: 1 };
      const nextStage = current.currentStage + 1;
      const isCompleted = nextStage > 4;

      return {
        ...prev,
        totalXP: prev.totalXP + 40,
        questProgress: {
          ...(prev.questProgress || {}),
          [questId]: {
            status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
            currentStage: Math.min(4, nextStage)
          }
        }
      };
    });
  };

  const updateQuestStage = (questId: string, currentStage: number, isFinished: boolean, rewardXP = 50) => {
    setState((prev) => ({
      ...prev,
      totalXP: prev.totalXP + (isFinished ? rewardXP : 25),
      questProgress: {
        ...(prev.questProgress || {}),
        [questId]: {
          status: isFinished ? 'COMPLETED' : 'IN_PROGRESS',
          currentStage
        }
      }
    }));
  };

  const completeQuest = (questId: string, rewardXP = 100) => {
    setState((prev) => ({
      ...prev,
      totalXP: prev.totalXP + rewardXP,
      questProgress: {
        ...(prev.questProgress || {}),
        [questId]: {
          status: 'COMPLETED',
          currentStage: 99
        }
      }
    }));
  };

  // --- Master Blueprint: Boss Defeat ---
  const recordBossDefeat = (bossId: string, stars: number, score: number) => {
    setState((prev) => ({
      ...prev,
      totalXP: prev.totalXP + 250,
      bossVictories: {
        ...(prev.bossVictories || {}),
        [bossId]: {
          defeated: true,
          bestScore: Math.max(score, prev.bossVictories?.[bossId]?.bestScore || 0),
          stars: Math.max(stars, prev.bossVictories?.[bossId]?.stars || 0)
        }
      }
    }));
  };

  // --- Master Blueprint: Daily Mission ---
  const completeDailyMission = () => {
    setState((prev) => ({
      ...prev,
      dailyMissionDone: true,
      totalXP: prev.totalXP + 50,
      dailyStreak: prev.dailyStreak + 1
    }));
  };

  // --- Master Spec v3.0: Event Logger & Science Cards & Repair Missions ---
  const recordLearningEvent = (
    eventType: LearningEventType,
    details: string,
    extra?: { knowledgeId?: string; questId?: string; bossId?: string; scoreDelta?: number }
  ) => {
    const ev = createLearningEvent(eventType, details, extra);
    setState((prev) => ({
      ...prev,
      learningEvents: [ev, ...(prev.learningEvents || []).slice(0, 49)]
    }));
  };

  const unlockScienceCard = (knowledgeId: string) => {
    setState((prev) => {
      const current = prev.discoveredCards || [];
      if (current.includes(knowledgeId)) return prev;
      return {
        ...prev,
        discoveredCards: [...current, knowledgeId],
        totalXP: prev.totalXP + 25
      };
    });
  };

  const completeRepairMission = (missionId: string, rewardXP = 60) => {
    setState((prev) => {
      const current = prev.completedRepairMissions || [];
      if (current.includes(missionId)) return prev;
      return {
        ...prev,
        completedRepairMissions: [...current, missionId],
        totalXP: prev.totalXP + rewardXP
      };
    });
  };

  const clearAllProgress = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <LearningContext.Provider
      value={{
        state,
        setCurriculum,
        markLessonComplete,
        markConceptMastered,
        markFormulaMastered,
        recordExerciseResult,
        recordExperimentDone,
        recordGameScore,
        addErrorRecord,
        resolveErrorRecord,
        recordNodeAttempt,
        advanceQuestStage,
        updateQuestStage,
        completeQuest,
        recordBossDefeat,
        completeDailyMission,
        recordLearningEvent,
        unlockScienceCard,
        completeRepairMission,
        clearAllProgress
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearningState = () => {
  const ctx = useContext(LearningContext);
  if (!ctx) {
    throw new Error('useLearningState must be used within LearningStateProvider');
  }
  return ctx;
};
