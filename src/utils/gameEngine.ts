/**
 * Game Engine - KHTN 8 Game Learning System
 * Implements MASTER GAME SPEC v2.0
 * Sections: 6 (Game Matrix), 7 (State Machine), 8 (Quest Engine), 11 (Unlock Engine), 12 (Boss Engine)
 */

import {
  GameNodeState,
  KnowledgeNode,
  NodeMasteryRecord,
  Quest,
  BossBattle,
  ReviewRecoveryTicket,
  BossStageType,
  QuestType,
  ScientistRankInfo
} from '../types/blueprint';
import { TabType } from '../types';

/**
 * Evaluates the dynamic Game State of a Knowledge Node based on student's actual mastery
 * Implements State Transition:
 * LOCKED -> AVAILABLE -> LEARNING -> PRACTICING -> REVIEW_REQUIRED -> CHALLENGE_UNLOCKED -> BOSS_READY -> MASTERED -> SPACED_REVIEW
 */
export function evaluateGameNodeState(
  node: KnowledgeNode,
  nodeMasteryMap: Record<string, NodeMasteryRecord> = {},
  completedLessonIds: string[] = []
): GameNodeState {
  // 1. Check prerequisites: all prerequisites must have at least 50% mastery
  if (node.prerequisites && node.prerequisites.length > 0) {
    const hasUnmetPrereq = node.prerequisites.some((prereqId) => {
      const record = nodeMasteryMap[prereqId];
      return !record || record.masteryScore < 50;
    });
    if (hasUnmetPrereq) {
      return 'LOCKED';
    }
  }

  const record = nodeMasteryMap[node.id];

  // 2. If never attempted
  if (!record || record.attemptCount === 0) {
    if (completedLessonIds.includes(node.lessonId)) {
      return 'LEARNING';
    }
    return 'AVAILABLE';
  }

  // 3. Spaced Review check: if not reviewed in > 10 days and score >= 70
  const daysSinceReview = (Date.now() - record.lastReviewedTimestamp) / (1000 * 60 * 60 * 24);
  if (daysSinceReview > 10 && record.masteryScore >= 70) {
    return 'SPACED_REVIEW';
  }

  // 4. Low mastery / frequent errors trigger Review Required
  if (record.masteryScore < 65 || record.reviewPriority === 'URGENT') {
    return 'REVIEW_REQUIRED';
  }

  // 5. High Mastery States
  if (record.masteryScore >= 92) {
    return 'MASTERED';
  }

  if (record.masteryScore >= 80) {
    return 'BOSS_READY';
  }

  if (record.masteryScore >= 70) {
    return 'CHALLENGE_UNLOCKED';
  }

  // 6. Default practicing
  return 'PRACTICING';
}

/**
 * Returns UI metadata for rendering a Game Node State
 */
export function getGameNodeStateMeta(state: GameNodeState): {
  label: string;
  shortLabel: string;
  iconSymbol: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  description: string;
} {
  switch (state) {
    case 'LOCKED':
      return {
        label: 'Khóa (Chưa đủ điều kiện)',
        shortLabel: 'Khóa',
        iconSymbol: '🔒',
        badgeClass: 'bg-slate-100 text-slate-500 border-slate-200',
        borderClass: 'border-slate-200',
        bgClass: 'bg-slate-50',
        textClass: 'text-slate-400',
        description: 'Cần hoàn thành các kiến thức tiên quyết trước khi mở khóa.'
      };
    case 'AVAILABLE':
      return {
        label: 'Sẵn sàng khám phá',
        shortLabel: 'Sẵn sàng',
        iconSymbol: '○',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        borderClass: 'border-sky-300',
        bgClass: 'bg-white',
        textClass: 'text-sky-700',
        description: 'Đã sẵn sàng mở, bạn có thể bắt đầu tiếp cận lý thuyết.'
      };
    case 'LEARNING':
      return {
        label: 'Đang tiếp thu lý thuyết',
        shortLabel: 'Đang học',
        iconSymbol: '◐',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        borderClass: 'border-indigo-300',
        bgClass: 'bg-indigo-50/30',
        textClass: 'text-indigo-700',
        description: 'Đã đọc bài học, cần tiếp tục làm quen các câu hỏi rèn luyện.'
      };
    case 'PRACTICING':
      return {
        label: 'Đang luyện tập câu hỏi',
        shortLabel: 'Đang luyện',
        iconSymbol: '●',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        borderClass: 'border-blue-300',
        bgClass: 'bg-white',
        textClass: 'text-blue-700',
        description: 'Đang giải bài tập để nâng cao tỷ lệ đúng và độ ổn định.'
      };
    case 'REVIEW_REQUIRED':
      return {
        label: 'Cần ôn tập gấp (Mastery < 70%)',
        shortLabel: 'Cần ôn',
        iconSymbol: '⚠',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse',
        borderClass: 'border-rose-400',
        bgClass: 'bg-rose-50/30',
        textClass: 'text-rose-700',
        description: 'Có sai sót hoặc nhầm lẫn, cần ôn tập phục hồi trước khi đi tiếp.'
      };
    case 'CHALLENGE_UNLOCKED':
      return {
        label: 'Thử thách mở (Mastery ≥ 70%)',
        shortLabel: 'Thử thách',
        iconSymbol: '⚔',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        borderClass: 'border-amber-400',
        bgClass: 'bg-amber-50/20',
        textClass: 'text-amber-800',
        description: 'Đạt chuẩn cơ bản! Mở khóa thử thách tốc độ và bẫy trắc nghiệm.'
      };
    case 'BOSS_READY':
      return {
        label: 'Sẵn sàng khiêu chiến Boss (≥ 80%)',
        shortLabel: 'Sẵn sàng Boss',
        iconSymbol: '👑',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-300',
        borderClass: 'border-purple-400',
        bgClass: 'bg-purple-50/30',
        textClass: 'text-purple-700',
        description: 'Kiến thức vững chắc, sẵn sàng bước vào Đấu trường Boss!'
      };
    case 'MASTERED':
      return {
        label: 'Đạt chuẩn thành thạo (≥ 92%)',
        shortLabel: 'Thành thạo',
        iconSymbol: '★',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-300',
        borderClass: 'border-emerald-400',
        bgClass: 'bg-emerald-50/20',
        textClass: 'text-emerald-700',
        description: 'Hoàn toàn làm chủ kiến thức, độ chính xác và phản xạ tuyệt vời.'
      };
    case 'SPACED_REVIEW':
      return {
        label: 'Đến hạn ôn ngắt quãng (SRS)',
        shortLabel: 'Ôn SRS',
        iconSymbol: '🔄',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-300',
        borderClass: 'border-teal-400',
        bgClass: 'bg-teal-50/30',
        textClass: 'text-teal-700',
        description: 'Đã hơn 10 ngày chưa kiểm tra lại, cần làm nhanh 1 bài để duy trì trí nhớ bền vững.'
      };
  }
}

/**
 * Checks if a Quest is unlocked according to rules
 */
export function evaluateQuestUnlock(
  quest: Quest,
  nodeMasteryMap: Record<string, NodeMasteryRecord> = {},
  questProgressMap: Record<string, { status: string; currentStage: number }> = {}
): { unlocked: boolean; reason?: string } {
  // Check quest prerequisites
  if (quest.prerequisites && quest.prerequisites.length > 0) {
    for (const prereqId of quest.prerequisites) {
      const p = questProgressMap[prereqId];
      if (!p || p.status !== 'COMPLETED') {
        return {
          unlocked: false,
          reason: `Cần hoàn thành nhiệm vụ tiền đề trước (${prereqId})`
        };
      }
    }
  }

  // Check target knowledge prerequisites if specified
  if (quest.knowledgeTargets && quest.knowledgeTargets.length > 0) {
    // If quest requires min mastery to start
    const avgMastery =
      quest.knowledgeTargets.reduce((sum, kid) => {
        return sum + (nodeMasteryMap[kid]?.masteryScore || 0);
      }, 0) / quest.knowledgeTargets.length;

    // Quests can start if avg >= 20%
    if (avgMastery < 20 && quest.questType === 'EPIC') {
      return {
        unlocked: false,
        reason: 'Nhiệm vụ liên môn STEM yêu cầu hiểu biết nền tảng tối thiểu 20%'
      };
    }
  }

  return { unlocked: true };
}

/**
 * Checks if a Boss Battle is unlocked according to rules
 */
export function evaluateBossUnlock(
  boss: BossBattle,
  nodeMasteryMap: Record<string, NodeMasteryRecord> = {},
  questProgressMap: Record<string, { status: string; currentStage: number }> = {}
): { unlocked: boolean; reason?: string; currentScore: number } {
  // 1. Check required quests
  if (boss.requiredQuestIds && boss.requiredQuestIds.length > 0) {
    const uncompletedQuests = boss.requiredQuestIds.filter((qid) => {
      const q = questProgressMap[qid];
      return !q || q.status !== 'COMPLETED';
    });
    if (uncompletedQuests.length > 0) {
      return {
        unlocked: false,
        reason: `Cần hoàn thành ${uncompletedQuests.length} nhiệm vụ Quest khám phá của khu vực này`,
        currentScore: 0
      };
    }
  }

  // 2. Check mastery requirement
  const roundKnowledgeIds = Array.from(new Set(boss.rounds.map((r) => r.knowledgeId)));
  const avgScore =
    roundKnowledgeIds.length > 0
      ? Math.round(
          roundKnowledgeIds.reduce((sum, kid) => sum + (nodeMasteryMap[kid]?.masteryScore || 0), 0) /
            roundKnowledgeIds.length
        )
      : 50;

  if (avgScore < boss.requiredMasteryScore) {
    return {
      unlocked: false,
      reason: `Chỉ số Mastery khu vực hiện đạt ${avgScore}%, cần tối thiểu ${boss.requiredMasteryScore}% để khiêu chiến Boss`,
      currentScore: avgScore
    };
  }

  return { unlocked: true, currentScore: avgScore };
}

/**
 * Generates an instant Review Ticket when a student fails a question in Game
 * Implements Section 2.4 & Section 9: Real-time Recovery Engine
 */
export function createReviewRecoveryTicket(
  knowledgeId: string,
  knowledgeTitle: string,
  failedSource: 'QUEST' | 'CHALLENGE' | 'BOSS',
  sourceTitle: string,
  reason: string
): ReviewRecoveryTicket {
  // Determine best remediation route
  let tab: TabType = 'on_tap';
  let description = `Ôn luyện kiến thức: ${knowledgeTitle}`;

  if (knowledgeId.startsWith('KN_HOA')) {
    tab = 'ly_thuyet';
    description = `Đọc lại lý thuyết Hóa học liên quan và xem các phản ứng mẫu`;
  } else if (knowledgeId.startsWith('KN_VAT')) {
    tab = 'cong_thuc';
    description = `Tra cứu công thức Vật lí và quy tắc chuyển đổi đơn vị`;
  }

  return {
    id: `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    knowledgeId,
    knowledgeTitle,
    failedSource,
    sourceTitle,
    reason,
    recommendedReviewType: 'ERROR',
    remediationPath: {
      tab,
      id: knowledgeId,
      description
    }
  };
}

/**
 * Metadata for Quest Types
 */
export function getQuestTypeMeta(type: QuestType): {
  label: string;
  badgeClass: string;
  durationLabel: string;
  iconName: string;
  description: string;
} {
  switch (type) {
    case 'MICRO':
      return {
        label: 'Micro Quest',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        durationLabel: '3–5 phút',
        iconName: 'Zap',
        description: 'Nhiệm vụ kiểm tra chớp nhoáng 1 khái niệm/công thức trọng tâm.'
      };
    case 'STANDARD':
      return {
        label: 'Standard Quest',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        durationLabel: '10–15 phút',
        iconName: 'Compass',
        description: 'Hành trình 4 chặng: Bối cảnh → Học → Luyện tập → Ôn tập & Thử thách.'
      };
    case 'EPIC':
      return {
        label: 'Epic STEM Quest',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
        durationLabel: '20–30 phút',
        iconName: 'Sparkles',
        description: 'Nhiệm vụ liên môn kỹ thuật: Chế tạo và giải quyết thách thức đời sống.'
      };
  }
}

/**
 * Metadata for Boss Stage Types
 */
export function getBossStageTypeMeta(stage: BossStageType): {
  label: string;
  badgeClass: string;
  icon: string;
} {
  switch (stage) {
    case 'KNOWLEDGE_CHECK':
      return {
        label: 'Tầng 1: Khái Niệm Cốt Lõi',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'BookOpen'
      };
    case 'FORMULA_CHECK':
      return {
        label: 'Tầng 2: Công Thức & Biến Đổi',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        icon: 'Binary'
      };
    case 'APPLICATION':
      return {
        label: 'Tầng 3: Tính Toán Định Lượng',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'Flame'
      };
    case 'TRAP_RESISTANCE':
      return {
        label: 'Tầng 4: Hóa Giải Bẫy Đề Thi',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: 'AlertTriangle'
      };
    case 'ULTIMATE_CHALLENGE':
      return {
        label: 'Tầng 5: Đòn Quyết Định Tối Thượng',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: 'Swords'
      };
  }
}

/**
 * MASTER GAME SPEC v3.0: Section 7 - Player Identity & Scientist Rank
 */
export function calculateScientistRank(totalXP: number, discoveredCount = 0): ScientistRankInfo {
  if (totalXP >= 2000) {
    return {
      rankTitle: 'Viện Sĩ Khoa Học KHTN (Grand Academician)',
      badgeIcon: '👑',
      minXP: 2000,
      nextRankXP: 3000,
      perks: [
        'Mở khóa toàn bộ Đấu trường Hoàng Gia',
        'Được quyền thiết lập thông số thí nghiệm nâng cao',
        'Huy hiệu Vinh Dự Khoa Học Tối Thượng'
      ]
    };
  }
  if (totalXP >= 1200) {
    return {
      rankTitle: 'Chuyên Gia Khám Phá (Chief Researcher)',
      badgeIcon: '⭐',
      minXP: 1200,
      nextRankXP: 2000,
      perks: [
        'Khả năng mở khóa Epic STEM Quests',
        'Tăng hệ số nhân Combo x2.0 XP khi làm bài tập',
        'Nhận thẻ bài Khoa học Sử thi (Epic Cards)'
      ]
    };
  }
  if (totalXP >= 700) {
    return {
      rankTitle: 'Kỹ Sư Thí Nghiệm (Lab Engineer)',
      badgeIcon: '⚡',
      minXP: 700,
      nextRankXP: 1200,
      perks: [
        'Mở khóa Thử thách Tốc độ (Timed Challenges)',
        'Mở khóa Nhiệm vụ Sửa chữa (Repair Missions)',
        'Nhận thẻ bài Khoa học Hiếm (Rare Cards)'
      ]
    };
  }
  if (totalXP >= 300) {
    return {
      rankTitle: 'Nhà Nghiên Cứu Tập Sự (Junior Researcher)',
      badgeIcon: '🔬',
      minXP: 300,
      nextRankXP: 700,
      perks: [
        'Mở khóa Khu B (Vật Lí & Áp Suất)',
        'Kích hoạt tính năng Sổ Khám Phá Khoa Học',
        'Gợi ý 3 bước khi gặp bài toán khó'
      ]
    };
  }
  return {
    rankTitle: 'Thực Tập Sinh Khoa Học (Science Apprentice)',
    badgeIcon: '🌱',
    minXP: 0,
    nextRankXP: 300,
    perks: [
      'Khám phá Khu A: Giả Kim & Hóa Học',
      'Được hướng dẫn từng bước chi tiết',
      'Tích lũy Micro-rewards mỗi bước làm đúng'
    ]
  };
}

/**
 * MASTER GAME SPEC v3.0: Section 21-23 - Science Card & Discovery Book Generator
 */
export function generateScienceCards(
  nodes: KnowledgeNode[],
  nodeMasteryMap: Record<string, NodeMasteryRecord> = {},
  discoveredIds: string[] = []
): import('../types/blueprint').ScienceCard[] {
  return nodes.map((node) => {
    const mastery = nodeMasteryMap[node.id]?.masteryScore || 0;
    const isUnlocked = mastery >= 70 || discoveredIds.includes(node.id);

    let cardRarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' = 'COMMON';
    let icon = '🔬';

    if (node.domain === 'HOA_HOC') {
      cardRarity = node.masteryThreshold >= 0.8 ? 'EPIC' : 'RARE';
      icon = '🧪';
    } else if (node.domain === 'VAT_LI') {
      cardRarity = node.masteryThreshold >= 0.85 ? 'LEGENDARY' : 'RARE';
      icon = '⚡';
    } else if (node.domain === 'SINH_HOC') {
      cardRarity = 'COMMON';
      icon = '🌱';
    } else {
      cardRarity = 'LEGENDARY';
      icon = '🧬';
    }

    // Default formula / application data based on node
    let formulaName = undefined;
    let formulaLatex = undefined;
    let unitSymbol = undefined;

    if (node.id === 'KN_HOA_01') {
      formulaName = 'Định luật Bảo toàn khối lượng';
      formulaLatex = 'm_A + m_B = m_C + m_D';
      unitSymbol = 'g, kg';
    } else if (node.id === 'KN_HOA_02') {
      formulaName = 'Thể tích mol khí ở ĐKC (25°C, 1 bar)';
      formulaLatex = 'V = n \\times 24{,}79 \\text{ (L)}';
      unitSymbol = 'L, mol';
    } else if (node.id === 'KN_HOA_03') {
      formulaName = 'Nồng độ phần trăm & Nồng độ mol';
      formulaLatex = 'C\\% = \\frac{m_{ct}}{m_{dd}} \\times 100\\%,\\quad C_M = \\frac{n}{V}';
      unitSymbol = '\\%, mol/L';
    } else if (node.id === 'KN_VAT_01') {
      formulaName = 'Áp suất chất rắn';
      formulaLatex = 'p = \\frac{F}{S}';
      unitSymbol = 'N/m^2 (Pa)';
    } else if (node.id === 'KN_VAT_02') {
      formulaName = 'Áp suất chất lỏng';
      formulaLatex = 'p = d \\cdot h';
      unitSymbol = 'N/m^2 (Pa)';
    } else if (node.id === 'KN_VAT_03') {
      formulaName = 'Lực đẩy Archimedes';
      formulaLatex = 'F_A = d \\cdot V';
      unitSymbol = 'N (Newton)';
    }

    return {
      knowledgeId: node.id,
      title: node.title,
      domain: node.domain,
      chapterTitle: node.chapterTitle,
      lessonTitle: node.lessonTitle,
      conceptSummary: node.description,
      formulaLatex,
      formulaName,
      unitSymbol,
      realWorldApplication: node.realWorldHook || 'Ứng dụng trong phân tích công nghiệp và giải thích hiện tượng tự nhiên.',
      unlocked: isUnlocked,
      masteryScore: mastery,
      cardRarity,
      icon
    };
  });
}

/**
 * MASTER GAME SPEC v3.0: Section 15 - Error as Quest (Repair Mission Generator)
 * Turns a misconception or failed test into a 4-step mission
 */
export function generateRepairMission(
  knowledgeId: string,
  knowledgeTitle: string,
  originError: string
): import('../types/blueprint').RepairMission {
  // Tailored 4-step repair workflow
  const steps: import('../types/blueprint').RepairMissionStep[] = [
    {
      stepNumber: 1,
      title: 'Bước 1: Nhận diện & Cô lập đại lượng',
      instruction: 'Hãy phân tích đề bài và xác định chính xác các đại lượng đã cho cùng đại lượng cần tìm.',
      question: `Trong tình huống vừa gặp ở chủ đề "${knowledgeTitle}", bước đầu tiên cần làm là gì?`,
      options: [
        'Đọc kỹ đề bài, ghi chú rõ ràng các đại lượng đã cho (số liệu + đơn vị) và đại lượng cần tìm',
        'Lập tức áp dụng một công thức bất kỳ mà mình nhớ mang máng',
        'Bỏ qua các đơn vị đo lường vì chúng không quan trọng',
        'Chọn ngẫu nhiên một đáp án để làm tiếp bài sau'
      ],
      correctAnswer: 0,
      explanation: 'Quy tắc vàng của nhà khoa học: Luôn cô lập dữ kiện đã biết và xác định rõ mục tiêu cần tìm trước khi giải quyết.',
      hint: 'Hãy chú ý đến các thông số đã cho và đơn vị đi kèm.'
    },
    {
      stepNumber: 2,
      title: 'Bước 2: Lựa chọn Công thức / Định luật đúng',
      instruction: 'Chọn mối quan hệ định lượng chính xác liên kết giữa dữ kiện đã có và mục tiêu.',
      question: `Công thức hoặc nguyên lý nào là cốt lõi để giải quyết vấn đề của "${knowledgeTitle}"?`,
      options: [
        'Chọn công thức chứa đúng đại lượng cần tìm và các dữ kiện đã biết',
        'Dùng công thức của bài học khác không liên quan',
        'Đoán mò kết quả không cần cơ sở lý thuyết',
        'Dùng công thức mà không xét điều kiện áp dụng'
      ],
      correctAnswer: 0,
      explanation: 'Mỗi định luật đều có miền áp dụng và công thức đại số đặc thù. Cần kiểm tra kỹ các biến số.',
      hint: 'Đối chiếu các biến số trong công thức với các đại lượng đề bài.'
    },
    {
      stepNumber: 3,
      title: 'Bước 3: Chuẩn hóa & Quy đổi Đơn vị đo lường',
      instruction: 'Một trong những bẫy phổ biến nhất là không đồng nhất đơn vị (cm² ↔ m², mL ↔ L).',
      question: 'Khi tính toán, đơn vị đo lường cần tuân thủ quy tắc nào?',
      options: [
        'Quy đổi tất cả về hệ đơn vị SI chuẩn thống nhất trước khi thế số vào công thức',
        'Giữ nguyên các đơn vị khác nhau và nhân chia trực tiếp',
        'Đổi đơn vị sau khi đã tính toán ra đáp số cuối cùng',
        'Không cần quan tâm đơn vị vì máy tính chỉ tính số'
      ],
      correctAnswer: 0,
      explanation: 'Phép tính chỉ có ý nghĩa vật lí/hóa học khi các đại lượng ở cùng một hệ đo lường chuẩn xác.',
      hint: '1 m² = 10 000 cm², 1 L = 1 000 mL.'
    },
    {
      stepNumber: 4,
      title: 'Bước 4: Kiểm tra tính hợp lý & Khắc phục hoàn toàn',
      instruction: 'Tính toán cẩn thận và đánh giá xem kết quả có phù hợp với thực tế không.',
      question: 'Sau khi tính ra kết quả số học, nhà nghiên cứu cần làm gì?',
      options: [
        'Kiểm tra lại thứ nguyên, độ lớn có phù hợp với hiện tượng thực tế và ghi kèm đơn vị',
        'Đóng bài thi ngay lập tức mà không nhìn lại',
        'Xóa hết các bước nháp đã làm',
        'Chỉ ghi con số mà không ghi đơn vị'
      ],
      correctAnswer: 0,
      explanation: 'Hoàn thành bước kiểm tra tính hợp lý giúp loại bỏ 100% các sai sót do bất cẩn.',
      hint: 'Xem xét kết quả có quá lớn hoặc quá nhỏ vô lý so với thực tế không.'
    }
  ];

  return {
    id: `repair_${knowledgeId}_${Date.now()}`,
    title: `🔧 Sửa Chữa Hệ Thống: Củng Cố ${knowledgeTitle}`,
    knowledgeId,
    knowledgeTitle,
    originError,
    storyHook: `Cảnh báo: Cảm biến phát hiện sai lệch trong dữ liệu của ${knowledgeTitle}. Hãy tiến hành quy trình 4 bước để tái chuẩn hóa hệ thống!`,
    steps,
    rewardXP: 60,
    completed: false
  };
}

/**
 * MASTER GAME SPEC v3.0: Section 24 - Daily Adventure Generator (5-10 min)
 */
export function generateDailyAdventure(
  dateStr: string,
  nodeMasteryMap: Record<string, NodeMasteryRecord> = {}
): import('../types/blueprint').DailyAdventure {
  const steps: import('../types/blueprint').DailyAdventureStep[] = [
    {
      stepType: 'REVIEW',
      title: '01. Khởi động: Ôn tập phục hồi (Review)',
      description: 'Củng cố 1 kiến thức then chốt về Định luật Bảo toàn khối lượng và Thể tích mol khí.',
      completed: false,
      knowledgeId: 'KN_HOA_01',
      interactiveData: {
        question: 'Khi nung đá vôi (CaCO₃) thu được vôi sống (CaO) và khí CO₂. Mối quan hệ khối lượng nào sau đây là đúng theo định luật bảo toàn khối lượng?',
        options: [
          'm(CaCO₃) = m(CaO) + m(CO₂)',
          'm(CaCO₃) = m(CaO) - m(CO₂)',
          'm(CaCO₃) = m(CaO) × m(CO₂)',
          'm(CaCO₃) > m(CaO) + m(CO₂)'
        ],
        correctAnswer: 0,
        explanation: 'Theo định luật bảo toàn khối lượng: Tổng khối lượng chất tham gia bằng tổng khối lượng các sản phẩm tạo thành.',
        formulaLatex: 'm_{CaCO_3} = m_{CaO} + m_{CO_2}'
      }
    },
    {
      stepType: 'DISCOVERY',
      title: '02. Khám phá bí ẩn: Áp suất chất lỏng (Discovery)',
      description: 'Tìm hiểu vì sao các thợ lặn chuyên nghiệp phải mặc đồ lặn có vỏ kim loại dày.',
      completed: false,
      knowledgeId: 'KN_VAT_02',
      interactiveData: {
        question: 'Càng lặn sâu xuống đáy biển, áp suất chất lỏng tác dụng lên cơ thể thợ lặn thay đổi như thế nào?',
        options: [
          'Càng tăng vì độ sâu h tăng theo công thức p = d · h',
          'Càng giảm vì nước biển càng lạnh',
          'Không đổi vì khối lượng riêng của nước biển không đổi',
          'Bằng 0 vì lực đẩy Archimedes đã triệt tiêu áp suất'
        ],
        correctAnswer: 0,
        explanation: 'Áp suất chất lỏng tỉ lệ thuận với độ sâu h (p = d · h). Do đó khi lặn xuống đáy vực sâu, áp lực nước cực lớn đòi hỏi trang phục lặn chịu lực cao.',
        formulaLatex: 'p = d \\cdot h'
      }
    },
    {
      stepType: 'CHALLENGE',
      title: '03. Thử thách nhanh: Giải quyết thách thức (Challenge)',
      description: 'Vận dụng định luật Archimedes để tính lực nâng tàu thuyền nổi trên sông.',
      completed: false,
      knowledgeId: 'KN_VAT_03',
      interactiveData: {
        question: 'Một sà lan có phần thể tích chìm trong nước là 12 m³. Biết trọng lượng riêng của nước là d = 10 000 N/m³. Lực đẩy Archimedes tác dụng lên sà lan là bao nhiêu?',
        options: [
          '120 000 N',
          '1 200 N',
          '12 000 N',
          '1 200 000 N'
        ],
        correctAnswer: 0,
        explanation: 'Áp dụng công thức lực đẩy Archimedes: F_A = d · V = 10 000 N/m³ × 12 m³ = 120 000 N.',
        formulaLatex: 'F_A = d \\cdot V = 10\\,000 \\times 12 = 120\\,000\\text{ N}'
      }
    }
  ];

  return {
    id: `daily_${dateStr}`,
    date: dateStr,
    title: `Chuyến Phiêu Lưu Khoa Học Ngày ${dateStr}`,
    estimatedMinutes: 8,
    steps,
    completed: false,
    rewardXP: 100
  };
}

/**
 * MASTER GAME SPEC v3.0: Section 28-29 - Event Logger Helper
 */
export function createLearningEvent(
  eventType: import('../types/blueprint').LearningEventType,
  details: string,
  extra?: { knowledgeId?: string; questId?: string; bossId?: string; scoreDelta?: number }
): import('../types/blueprint').LearningEvent {
  return {
    eventId: `EV_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    eventType,
    details,
    ...extra
  };
}

// =========================================================================
// MASTER GAME SPEC v4.0: GAMEPLAY ENGINE & EVIDENCE ENGINE UTILITIES
// =========================================================================

import {
  LearningEvidence,
  LearningEvidenceType,
  GameEventRecord,
  GameEventType,
  GameStateV4,
  InteractiveObject,
  GameActionType
} from '../types/blueprint';

/**
 * Creates a validated LearningEvidence object from a gameplay action
 */
export function createLearningEvidence(
  knowledgeId: string,
  type: LearningEvidenceType,
  quality: number,
  sourceEvent: string,
  description: string,
  skillId?: string
): LearningEvidence {
  return {
    evidenceId: `EVI_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    knowledgeId,
    skillId,
    type,
    quality: Math.min(1.0, Math.max(0.0, quality)),
    sourceEvent,
    timestamp: Date.now(),
    description
  };
}

/**
 * Creates an immutable GameEventRecord for the Event Bus / Event Log
 */
export function recordGameEvent(
  type: GameEventType,
  payload: Record<string, any>
): GameEventRecord {
  return {
    id: `GEV_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type,
    payload
  };
}

/**
 * Executes a player action on an interactive object in accordance with v4.0 Consequence Engine:
 * INPUT + PLAYER ACTION + GAME STATE + SYSTEM RESPONSE + CONSEQUENCE + LEARNING EVIDENCE
 */
export function evaluateActionConsequence(
  actionType: GameActionType,
  targetObject: InteractiveObject,
  equippedToolId: string | null,
  inputData?: Record<string, any>
): {
  success: boolean;
  systemResponse: string;
  consequenceText: string;
  updatedObjectState: Record<string, any>;
  evidence?: LearningEvidence;
  event: GameEventRecord;
} {
  const event = recordGameEvent(
    actionType === 'measure'
      ? 'MEASUREMENT_MADE'
      : actionType === 'inspect'
      ? 'OBJECT_INSPECTED'
      : actionType === 'calculate'
      ? 'CALCULATION_SUBMITTED'
      : actionType === 'decide'
      ? 'DECISION_MADE'
      : 'TOOL_USED',
    {
      actionType,
      targetObjectId: targetObject.objectId,
      equippedToolId,
      inputData
    }
  );

  let updatedState = { ...targetObject.state };
  let success = true;
  let systemResponse = '';
  let consequenceText = '';
  let evidence: LearningEvidence | undefined;

  switch (actionType) {
    case 'inspect': {
      updatedState.inspected = true;
      systemResponse = `Bạn quan sát kỹ ${targetObject.name}. Dữ kiện thu được: ${targetObject.description}`;
      consequenceText = `Phát hiện dấu vết khoa học quan trọng liên quan đến ${targetObject.knowledgeIds.join(', ')}.`;
      evidence = createLearningEvidence(
        targetObject.knowledgeIds[0] || 'K_HOA_01',
        'observation',
        0.8,
        'OBJECT_INSPECTED',
        `Quan sát chi tiết thực thể ${targetObject.name}`
      );
      break;
    }

    case 'measure': {
      if (!equippedToolId) {
        success = false;
        systemResponse = 'Bạn chưa chọn dụng cụ đo! Hãy mở Túi Dụng Cụ và trang bị Cân hoặc Áp kế trước.';
        consequenceText = 'Không thể đo đạc bằng tay không mà thiếu thiết bị chuẩn hóa.';
        break;
      }
      updatedState.measured = true;
      systemResponse = `Dùng thiết bị đo thành công! Thông số: Khối lượng = ${targetObject.state.massGas || 44}g; Thể tích = ${targetObject.state.volumeGas || 24.79}L.`;
      consequenceText = 'Dữ liệu đo đạc đã được ghi tự động vào Sổ Tay Hiện Trường.';
      evidence = createLearningEvidence(
        targetObject.knowledgeIds[0] || 'K_HOA_03',
        'measurement_skill',
        0.95,
        'MEASUREMENT_MADE',
        `Thực hiện phép đo chuẩn xác trên ${targetObject.name}`
      );
      break;
    }

    case 'calculate': {
      updatedState.calculated = true;
      systemResponse = 'Phép tính khoa học đã được đối chiếu với hệ thống chuẩn hóa KHTN 8.';
      consequenceText = 'Khẳng định giá trị khối lượng mol và tỉ khối d = M / 29.';
      evidence = createLearningEvidence(
        targetObject.knowledgeIds[0] || 'K_HOA_03',
        'formula_skill',
        1.0,
        'CALCULATION_SUBMITTED',
        'Vận dụng chính xác công thức tỉ khối và nồng độ'
      );
      break;
    }

    case 'decide': {
      updatedState.decided = true;
      const isFloor = inputData?.choiceIndex === 0;
      if (isFloor) {
        systemResponse = 'Quyết định chính xác! Bật quạt hút sàn gom toàn bộ lớp khí CO2 nặng (d ≈ 1.52) lắng dưới sàn.';
        consequenceText = 'Nồng độ khí trong phòng giảm nhanh về mức an toàn trong vòng 90 giây!';
        evidence = createLearningEvidence(
          targetObject.knowledgeIds[0] || 'K_HOA_03',
          'reasoning',
          1.0,
          'DECISION_MADE',
          'Đưa ra giải pháp an toàn tối ưu dựa trên bản chất tỉ khối khí'
        );
      } else {
        success = false;
        systemResponse = 'Cảnh báo: Bật quạt trần chỉ thổi loãng khí ở trên, khí CO2 nặng vẫn ứ đọng đặc quánh sát mặt sàn!';
        consequenceText = 'Hệ thống báo động chưa ngắt. Hãy đổi lại phương án thông gió sát sàn!';
        evidence = createLearningEvidence(
          targetObject.knowledgeIds[0] || 'K_HOA_03',
          'error_evidence',
          0.3,
          'DECISION_MADE',
          'Nhầm lẫn hướng tích tụ của chất khí có tỉ khối lớn hơn không khí'
        );
      }
      break;
    }

    case 'repair': {
      updatedState.repaired = true;
      systemResponse = 'Van an toàn đã được siết chặt và thay thế gioăng silicon kháng ăn mòn.';
      consequenceText = 'Áp suất bình ổn định ở 1 bar, không còn hiện tượng rò rỉ.';
      evidence = createLearningEvidence(
        targetObject.knowledgeIds[0] || 'K_HOA_01',
        'procedure_evidence',
        0.9,
        'TOOL_USED',
        'Hoàn tất quy trình khắc phục sự cố kỹ thuật'
      );
      break;
    }

    default: {
      systemResponse = `Thực hiện thao tác ${actionType} trên ${targetObject.name}.`;
      consequenceText = 'Trạng thái thế giới game được cập nhật.';
    }
  }

  return {
    success,
    systemResponse,
    consequenceText,
    updatedObjectState: updatedState,
    evidence,
    event
  };
}

