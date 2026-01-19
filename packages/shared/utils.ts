import { supabase } from '@/lib/supabase'; // In web app

export const generateInviteCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const parseSmartSearch = (query: string) => {
  const filters: any = {};
  // Deterministic rules: e.g., "low back exercises" -> bodyPart: ['low back']
  if (query.includes('low back')) filters.bodyPart = ['low back'];
  if (query.includes('resistance band')) filters.equipment = ['resistance band'];
  // ... (expand for all tags, default to full-text if no matches)
  return filters;
};

export const computeStars = (completed: number, assigned: number) => {
  const percent = (completed / assigned) * 100;
  if (percent >= 100) return 3;
  if (percent >= 70) return 2;
  if (percent >= 40) return 1;
  return 0;
};

export const updateStreak = async (patientId: string, localDate: string) => {
  const { data: state } = await supabase.from('gamification_states').select('*').eq('patient_id', patientId).single();
  const today = new Date(localDate);
  const last = state.last_streak_date ? new Date(state.last_streak_date) : null;
  if (last && (today.getTime() - last.getTime()) === 86400000) { // 1 day
    state.current_streak += 1;
    state.best_streak = Math.max(state.best_streak, state.current_streak);
  } else if (!last || (today.getTime() - last.getTime()) > 86400000) {
    state.current_streak = 1;
  }
  state.last_streak_date = localDate;
  await supabase.from('gamification_states').update(state).eq('id', state.id);
};