/**
 * Mastery Engine - KHTN 8 Game Learning System
 * Implements Section 8, 12, 13: Multi-factor Mastery, Difficulty Scaling, Spaced Decay, Priorities
 */

import {
  DifficultyLevel,
  MasteryTier,
  NodeMasteryRecord,
  ReviewType
} from '../types/blueprint';
import { SubjectDomain } from '../types';

/**
 * Returns user-friendly presentation data for each Mastery Tier
 */
export function getMasteryTierInfo(tier: MasteryTier): {
  label: string;
  range: string;
  badgeClass: string;
  colorHex: string;
  description: string;
} {
  switch (tier) {
    case 'NOT_STARTED':
      return {
        label: 'Chưa hình thành',
        range: '0–29%',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        colorHex: '#94a3b8',
        description: 'Kiến thức mới chưa qua rèn luyện hoặc tỷ lệ sai cao, cần học và củng cố.'
      };
    case 'EMERGING':
      return {
        label: 'Đang hình thành',
        range: '30–49%',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        colorHex: '#f43f5e',
        description: 'Đã tiếp cận nhưng còn nhầm lẫn công thức/khái niệm, cần can thiệp ôn tập.'
      };
    case 'DEVELOPING':
      return {
        label: 'Đang phát triển',
        range: '50–69%',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        colorHex: '#f59e0b',
        description: 'Nắm được các bài tập cơ bản, đang rèn luyện vận dụng trực tiếp.'
      };
    case 'PROFICIENT':
      return {
        label: 'Đạt chuẩn',
        range: '70–84%',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
        colorHex: '#0284c7',
        description: 'Đạt yêu cầu cần đạt của chuẩn chương trình GDPT 2018.'
      };
    case 'ADVANCED':
      return {
        label: 'Vững vàng',
        range: '85–94%',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        colorHex: '#6366f1',
        description: 'Hiểu sâu, giải quyết tốt bài toán phân tích và vận dụng liên hệ thực tế.'
      };
    case 'MASTER':
      return {
        label: 'Thành thạo',
        range: '95–100%',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        colorHex: '#10b981',
        description: 'Hoàn toàn làm chủ kiến thức, tốc độ tính chuẩn xác, sẵn sàng vượt Boss.'
      };
  }
}

/**
 * Calculates Node Mastery using multi-factor evaluation (Section 13.1):
 * - Accuracy (tỷ lệ đúng)
 * - Consistency streak (chuỗi đúng liên tiếp)
 * - Hint usage penalty (dùng gợi ý làm giảm nhẹ điểm mastery)
 * - Spaced recency decay (suy giảm nhớ theo thời gian nếu không ôn tập)
 */
export function calculateNodeMastery(
  record: Partial<NodeMasteryRecord>
): {
  score: number;
  tier: MasteryTier;
  reviewPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
} {
  const attempts = record.attemptCount || 0;
  if (attempts === 0) {
    return {
      score: 0,
      tier: 'NOT_STARTED',
      reviewPriority: 'HIGH'
    };
  }

  const correct = record.correctCount || 0;
  const streak = record.consecutiveStreak || 0;
  const hints = record.hintUsedCount || 0;
  const lastReviewed = record.lastReviewedTimestamp || Date.now();

  // 1. Base accuracy score (0 - 100)
  const accuracy = (correct / attempts) * 100;

  // 2. Consistency bonus (+ up to 15%)
  const streakBonus = Math.min(15, streak * 3);

  // 3. Hint penalty (each hint costs -3% capped at -15%)
  const hintPenalty = Math.min(15, hints * 3);

  // 4. Time decay factor (Ebbinghaus spaced retention)
  const daysSince = Math.max(0, (Date.now() - lastReviewed) / (1000 * 60 * 60 * 24));
  let retentionFactor = 1.0;
  if (daysSince > 14) {
    retentionFactor = 0.85; // decayed after 2 weeks without review
  } else if (daysSince > 7) {
    retentionFactor = 0.92; // slightly decayed after 1 week
  }

  let finalScore = Math.round((accuracy * 0.85 + streakBonus - hintPenalty) * retentionFactor);
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Determine Tier
  let tier: MasteryTier = 'NOT_STARTED';
  if (finalScore >= 95) tier = 'MASTER';
  else if (finalScore >= 85) tier = 'ADVANCED';
  else if (finalScore >= 70) tier = 'PROFICIENT';
  else if (finalScore >= 50) tier = 'DEVELOPING';
  else if (finalScore >= 30) tier = 'EMERGING';
  else tier = 'NOT_STARTED';

  // Determine Review Priority
  let reviewPriority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' = 'LOW';
  if (finalScore < 30) {
    reviewPriority = 'URGENT'; // Cần phục hồi khẩn cấp
  } else if (finalScore < 50 || daysSince > 10) {
    reviewPriority = 'HIGH'; // Ưu tiên ôn
  } else if (finalScore < 75 || daysSince > 5) {
    reviewPriority = 'NORMAL'; // Ôn định kỳ
  } else {
    reviewPriority = 'LOW'; // Đã vững, ít ôn
  }

  return {
    score: finalScore,
    tier,
    reviewPriority
  };
}

/**
 * Returns human-readable label for 6 difficulty tiers (Section 12)
 */
export function getDifficultyInfo(level: DifficultyLevel): {
  label: string;
  name: string;
  color: string;
} {
  switch (level) {
    case 'L1':
      return { label: 'L1', name: 'Nhận biết', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'L2':
      return { label: 'L2', name: 'Thông hiểu', color: 'text-sky-700 bg-sky-50 border-sky-200' };
    case 'L3':
      return { label: 'L3', name: 'Vận dụng trực tiếp', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'L4':
      return { label: 'L4', name: 'Vận dụng', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'L5':
      return { label: 'L5', name: 'Phân tích / Tổng hợp', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    case 'L6':
      return { label: 'L6', name: 'Tình huống / STEM', color: 'text-purple-700 bg-purple-50 border-purple-200' };
  }
}

/**
 * Evaluates Level from XP (Blueprint Section 14)
 */
export function calculateLevelFromXP(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  title: string;
} {
  // Level threshold: Level N requires N * 150 XP
  let level = 1;
  let accumulated = 0;
  let nextThreshold = 150;

  while (xp >= accumulated + nextThreshold) {
    accumulated += nextThreshold;
    level++;
    nextThreshold = level * 150;
  }

  const currentLevelXp = xp - accumulated;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextThreshold) * 100));

  const titles: Record<number, string> = {
    1: 'Thực Tập Sinh Khoa Học',
    2: 'Người Thu Thập Dữ Liệu',
    3: 'Thợ Đo Lường Chuẩn',
    4: 'Nhà Thám Hiểm Hóa Chất',
    5: 'Chuyên Gia Lực & Cơ Học',
    6: 'Bác Sĩ Thực Tập Sinh',
    7: 'Kỹ Sư Năng Lượng Trẻ',
    8: 'Đại Sứ Môi Trường & Sinh Học',
    9: 'Bậc Thầy Công Thức KHTN',
    10: 'Học Giả Khoa Học Toàn Diện'
  };

  const title = titles[Math.min(level, 10)] || `Đại Hiệp Sĩ KHTN 8 (Cấp ${level})`;

  return {
    level,
    currentLevelXp,
    nextLevelXp: nextThreshold,
    progressPercent,
    title
  };
}
