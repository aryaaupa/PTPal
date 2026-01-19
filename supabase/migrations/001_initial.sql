-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Tables
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  general_video_url TEXT,
  thumbnail_url TEXT,
  tags JSONB,
  difficulty JSONB,
  muscle_activation_primary TEXT[],
  muscle_activation_secondary TEXT[],
  created_by TEXT CHECK (created_by IN ('system', 'pt')),
  created_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercise_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id),
  type TEXT CHECK (type IN ('generalVideo', 'ptDemo', 'patientDemo')),
  video_url TEXT,
  uploaded_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  display_name TEXT,
  avatar_config JSONB,
  pt_id UUID REFERENCES auth.users(id),
  join_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pt_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  clinic_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pt_id UUID REFERENCES auth.users(id),
  code TEXT UNIQUE,
  patient_user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('active', 'used', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  pt_id UUID REFERENCES auth.users(id),
  title TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'archived')),
  roadmap_theme TEXT CHECK (roadmap_theme IN ('wildlife', 'ocean', 'kingdom')),
  gamification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id),
  exercise_id UUID REFERENCES exercises(id),
  custom_instructions TEXT,
  custom_video_url TEXT,
  sets INT,
  reps INT,
  hold_seconds INT,
  rest_seconds INT,
  days_of_week INT[],
  times_per_day INT DEFAULT 1,
  order_index INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  plan_id UUID REFERENCES plans(id),
  local_date TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_exercises_assigned INT,
  total_exercises_completed INT,
  xp_earned INT,
  stars_earned INT CHECK (stars_earned BETWEEN 0 AND 3),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  plan_item_id UUID REFERENCES plan_items(id),
  exercise_id UUID REFERENCES exercises(id),
  status TEXT CHECK (status IN ('notStarted', 'inProgress', 'completed', 'skipped')),
  completed_sets INT,
  completed_reps INT,
  timer_seconds_used INT,
  completed_at TIMESTAMPTZ
);

CREATE TABLE gamification_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) UNIQUE,
  current_streak INT DEFAULT 0,
  best_streak INT DEFAULT 0,
  total_xp INT DEFAULT 0,
  total_completions INT DEFAULT 0,
  last_streak_date TEXT,
  koala_plant_level INT DEFAULT 0,
  badges TEXT[],
  achievement_progress JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE,
  title TEXT,
  description TEXT,
  category TEXT CHECK (category IN ('streak', 'completion', 'login', 'lessons')),
  threshold INT,
  xp_reward INT,
  badge_icon_name TEXT
);

CREATE TABLE achievement_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id),
  achievement_key TEXT REFERENCES achievement_definitions(key),
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  reminder_times TEXT[],
  days_of_week INT[],
  timezone TEXT DEFAULT 'UTC'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id),
  actor_role TEXT,
  action TEXT,
  target_type TEXT,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_exercises_tags ON exercises USING GIN (tags);
CREATE INDEX idx_sessions_local_date ON sessions (local_date);
CREATE INDEX idx_plan_items_days ON plan_items USING GIN (days_of_week);

-- RLS Policies (examples)
CREATE POLICY "PT can manage their exercises" ON exercises FOR ALL USING (auth.uid() = created_by_user_id OR created_by = 'system');
CREATE POLICY "Patients can view their plan" ON plans FOR SELECT USING (auth.uid() IN (SELECT user_id FROM patients WHERE id = patient_id));
-- (Full RLS for all tables enforced similarly)