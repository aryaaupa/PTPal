export type Role = 'pt' | 'patient';

export interface Exercise {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  generalVideoUrl: string;
  thumbnailUrl: string;
  tags: {
    bodyPart: string[];
    equipment: string[];
    injuryType: string[];
    planeOfMotion: string[];
  };
  difficulty: {
    strength: 'easy' | 'medium' | 'hard';
    flexibility: 'easy' | 'medium' | 'hard';
    mobility: 'easy' | 'medium' | 'hard';
  };
  muscleActivationPrimary: string[];
  muscleActivationSecondary: string[];
  createdBy: 'system' | 'pt';
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  displayName: string;
  avatarConfig: object;
  ptId: string;
  joinCodeUsed: string;
  createdAt: string;
}

export interface Plan {
  id: string;
  patientId: string;
  ptId: string;
  title: string;
  status: 'active' | 'paused' | 'archived';
  roadmapTheme: 'wildlife' | 'ocean' | 'kingdom';
  gamificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  planId: string;
  localDate: string;
  startedAt: string;
  completedAt?: string;
  totalExercisesAssigned: number;
  totalExercisesCompleted: number;
  xpEarned: number;
  starsEarned: number;
  createdAt: string;
}

export interface GamificationState {
  id: string;
  patientId: string;
  currentStreak: number;
  bestStreak: number;
  totalXP: number;
  totalCompletions: number;
  lastStreakDate?: string;
  koalaPlantLevel: number;
  badges: string[];
  achievementProgress: object;
  createdAt: string;
  updatedAt: string;
}