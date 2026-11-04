export type SeasonId = 1 | 2 | 3 | 4;

export type StatKey = 'creativity' | 'empathy' | 'selfAwareness' | 'social' | 'curiosity';

export interface StatInfo {
  key: StatKey;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
}

export type EmotionType = 'HAPPY' | 'CALM' | 'ANXIOUS' | 'SAD' | 'TIRED' | 'EXCITED';

export interface EmotionOption {
  type: EmotionType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface Quest {
  day: number;
  season: SeasonId;
  seasonTitle: string;
  title: string;
  question: string;
  guideHint: string;
  statBoost: StatKey;
  statPoints: number;
  badgeId?: string;
  suggestedTags: string[];
}

export interface QuestAnswer {
  day: number;
  emotion: EmotionType;
  text: string;
  completedAt: string;
  badgeUnlocked?: string;
  statsGained: Record<StatKey, number>;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  season: SeasonId | 0; // 0 for special
  description: string;
  unlockCondition: string;
  unlockedAt?: string;
}

export interface Classmate {
  id: string;
  name: string;
  avatar: string;
  statusMessage: string;
  stats: Record<StatKey, number>;
  completedDays: number;
  topEmotion: EmotionType;
  keywords: string[];
  favoriteAnswer: {
    day: number;
    question: string;
    answer: string;
  };
  todayCompleted: boolean;
  needsAttention?: boolean;
  attentionReason?: string;
  teacherNote?: string;
}

export interface GoogleSheetConfig {
  scriptUrl: string;
  sheetId: string;
  lastSyncedAt?: string;
  autoSync: boolean;
}
