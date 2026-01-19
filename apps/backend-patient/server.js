const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const mailer = nodemailer.createTransporter({ host: 'localhost', port: 1025 }); // Mailhog

// Patient Auth Middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user || !(await supabase.from('patients').select().eq('user_id', user.id)).data.length) return res.status(403).send('Patient only');
  req.user = user;
  next();
});

// Get Today Session
app.get('/today-session', async (req, res) => {
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  const today = new Date().toISOString().split('T')[0]; // Use timezone from prefs
  let { data: session } = await supabase.from('sessions').select('*').eq('patient_id', patient.id).eq('local_date', today);
  if (!session) {
    const planItems = await supabase.from('plan_items').select('*').eq('plan.patient_id', patient.id).contains('days_of_week', [new Date().getDay()]);
    const exercises = planItems.map(item => ({ plan_item_id: item.id, exercise_id: item.exercise_id, status: 'notStarted' }));
    session = await supabase.from('sessions').insert({
      patient_id: patient.id,
      plan_id: planItems[0]?.plan_id,
      local_date: today,
      total_exercises_assigned: exercises.length,
      started_at: new Date()
    }).select().single();
    await supabase.from('session_exercises').insert(exercises.map(e => ({ ...e, session_id: session.id })));
  }
  res.json(session);
});

// Start/Complete Session
app.post('/start-session', async (req, res) => {
  const { sessionId } = req.body;
  await supabase.from('sessions').update({ started_at: new Date() }).eq('id', sessionId);
  res.json({ success: true });
});

app.post('/complete-session', async (req, res) => {
  const { sessionId } = req.body;
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  const { data: session } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
  const { data: exercises } = await supabase.from('session_exercises').select('*').eq('session_id', sessionId);
  const completed = exercises.filter(e => e.status === 'completed').length;
  const stars = Math.floor((completed / session.total_exercises_assigned) * 3);
  let xp = completed * 10;
  if (stars === 3) xp += 30;
  const plan = await supabase.from('plans').select('gamification_enabled').eq('id', session.plan_id).single();
  if (plan.gamification_enabled) {
    await updateStreak(patient.id, session.local_date);
    await supabase.from('gamification_states').update({ total_xp: total_xp + xp, koala_plant_level: koala_plant_level + 1 }).eq('patient_id', patient.id);
    // Check achievements, unlock badges
  }
  await supabase.from('sessions').update({ completed_at: new Date(), xp_earned: xp, stars_earned: stars }).eq('id', sessionId);
  res.json({ xp, stars, message: 'GREAT JOB!' });
});

// Complete Exercise
app.post('/complete-exercise', async (req, res) => {
  const { sessionId, exerciseId, completedSets, timerSeconds } = req.body;
  await supabase.from('session_exercises').update({ status: 'completed', completed_sets: completedSets, timer_seconds_used: timerSeconds, completed_at: new Date() }).eq('session_id', sessionId).eq('exercise_id', exerciseId);
  res.json({ success: true });
});

// Roadmap, Achievements, Stats
app.get('/roadmap', async (req, res) => {
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  const { data: state } = await supabase.from('gamification_states').select('*').eq('patient_id', patient.id).single();
  res.json(state);
});

app.get('/achievements', async (req, res) => {
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  const { data } = await supabase.from('achievement_unlocks').select('*').eq('patient_id', patient.id);
  res.json(data);
});

app.get('/stats', async (req, res) => {
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  const { data } = await supabase.from('sessions').select('local_date, xp_earned').eq('patient_id', patient.id);
  res.json(data); // For graph
});

// Notifications
app.post('/set-notifications', async (req, res) => {
  const patient = (await supabase.from('patients').select('id').eq('user_id', req.user.id)).data[0];
  await supabase.from('notification_preferences').upsert({ patient_id: patient.id, ...req.body });
  res.json({ success: true });
});

// Cron for reminders
cron.schedule('* * * * *', async () => {
  const prefs = await supabase.from('notification_preferences').select('*').eq('enabled', true);
  // Check if today has sessions, send web/email if not completed
});

app.listen(5000, () => console.log('Patient Backend running on 5000'));