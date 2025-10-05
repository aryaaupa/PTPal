import { z } from 'zod';

export const Role = z.enum(['patient', 'clinician', 'admin']);
export type Role = z.infer<typeof Role>;

export const User = z.object({
  id: z.string(),
  role: Role,
  name: z.string(),
  email: z.string().email(),
  locale: z.string().default('en'),
  authProvider: z.enum(['password', 'oauth'])
});
export type User = z.infer<typeof User>;

export const PatientProfile = z.object({
  userId: z.string(),
  injury: z.string(),
  side: z.enum(['left', 'right', 'bilateral']).default('right'),
  goals: z.array(z.string()),
  baselinePain: z.number().min(0).max(10),
  baselineMobility: z.enum(['low', 'moderate', 'high'])
});
export type PatientProfile = z.infer<typeof PatientProfile>;

export const Exercise = z.object({
  id: z.string(),
  title: z.string(),
  mediaUrl: z.string().url(),
  cues: z.array(z.string()),
  contraindications: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  formRules: z.array(z.object({ key: z.string(), threshold: z.number().min(0).max(1) }))
});
export type Exercise = z.infer<typeof Exercise>;

export const PlanExercise = z.object({
  exerciseId: z.string(),
  sets: z.number().int().min(1),
  reps: z.number().int().min(1),
  tempo: z.string().default('2-1-2'),
  restSeconds: z.number().int().min(0).default(60)
});
export type PlanExercise = z.infer<typeof PlanExercise>;

export const PlanDay = z.object({
  dayIndex: z.number().int().min(0).max(6),
  items: z.array(PlanExercise)
});
export type PlanDay = z.infer<typeof PlanDay>;

export const Plan = z.object({
  id: z.string(),
  patientId: z.string(),
  days: z.array(PlanDay),
  startDate: z.string(),
  templateName: z.string().optional()
});
export type Plan = z.infer<typeof Plan>;

export const Session = z.object({
  id: z.string(),
  planId: z.string(),
  date: z.string(),
  repsCompleted: z.number().int().min(0),
  setsCompleted: z.number().int().min(0),
  pain: z.number().min(0).max(10),
  notes: z.string().optional(),
  cvMetrics: z.object({ formQuality: z.number().min(0).max(1), repEvents: z.array(z.number()).default([]) })
});
export type Session = z.infer<typeof Session>;

export const Message = z.object({
  id: z.string(),
  threadId: z.string(),
  senderId: z.string(),
  text: z.string(),
  createdAt: z.string()
});
export type Message = z.infer<typeof Message>;

export const Badge = z.object({ id: z.string(), code: z.string(), name: z.string(), description: z.string() });
export type Badge = z.infer<typeof Badge>;

export const AdaptiveSignals = z.object({
  adherencePercent: z.number().min(0).max(1),
  formQuality: z.number().min(0).max(1),
  pain: z.number().min(0).max(10),
  rpe: z.number().min(0).max(10),
  timeToCompleteSec: z.number().min(0)
});
export type AdaptiveSignals = z.infer<typeof AdaptiveSignals>;

export const PlanAdjustment = z.object({
  type: z.enum(['reduce_volume', 'add_rest', 'progress_difficulty', 'maintain']),
  rationale: z.string(),
  delta: z.object({ reps: z.number().optional(), restSeconds: z.number().optional() }).optional()
});
export type PlanAdjustment = z.infer<typeof PlanAdjustment>;

export function decideAdjustment(s: AdaptiveSignals): PlanAdjustment {
  if (s.pain >= 7 || s.formQuality < 0.5) {
    return {
      type: 'reduce_volume',
      rationale: 'Protecting tissue: rising pain or degraded form detected.',
      delta: { reps: -2, restSeconds: 30 }
    };
  }
  if (s.pain >= 5 || s.formQuality < 0.65) {
    return {
      type: 'add_rest',
      rationale: 'Ensuring recovery: moderate pain or inconsistent form.',
      delta: { restSeconds: 30 }
    };
  }
  if (s.adherencePercent > 0.85 && s.formQuality > 0.8 && s.pain <= 3) {
    return {
      type: 'progress_difficulty',
      rationale: 'Great consistency and form. Progressing difficulty.',
      delta: { reps: 2 }
    };
  }
  return { type: 'maintain', rationale: 'Keeping steady while trends stabilize.' };
}

export const TelemetryEvent = z.object({
  name: z.enum([
    'session_started',
    'rep_detected',
    'session_completed',
    'plan_adjusted',
    'streak_saved',
    'error'
  ]),
  properties: z.record(z.any()).optional(),
  timestamp: z.number()
});
export type TelemetryEvent = z.infer<typeof TelemetryEvent>;

export const RBACRole = Role;
export type RBACRole = Role;
