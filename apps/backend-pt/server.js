const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const app = express();
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// PT Auth Middleware
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user || !(await supabase.from('pt_profiles').select().eq('user_id', user.id)).data.length) return res.status(403).send('PT only');
  req.user = user;
  next();
});

// CRUD Exercises
app.get('/exercises', async (req, res) => {
  const { search, filters } = req.query;
  let query = supabase.from('exercises').select('*').or(`created_by.eq.system,created_by_user_id.eq.${req.user.id}`);
  if (filters) query = query.eq('tags', filters); // JSON match
  if (search) query = query.ilike('name', `%${search}%`);
  const { data } = await query;
  res.json(data);
});

app.post('/exercises', async (req, res) => {
  const { data } = await supabase.from('exercises').insert({ ...req.body, created_by: 'pt', created_by_user_id: req.user.id });
  res.json(data);
});

app.put('/exercises/:id', async (req, res) => {
  const { data } = await supabase.from('exercises').update(req.body).eq('id', req.params.id).eq('created_by_user_id', req.user.id);
  res.json(data);
});

app.delete('/exercises/:id', async (req, res) => {
  await supabase.from('exercises').delete().eq('id', req.params.id).eq('created_by_user_id', req.user.id);
  res.json({ success: true });
});

// CRUD Tags (simple taxonomy management)
app.get('/tags', async (req, res) => {
  // Return distinct tags from exercises
  const { data } = await supabase.from('exercises').select('tags');
  const tags = [...new Set(data.flatMap(d => Object.values(d.tags).flat()))];
  res.json(tags);
});

// CRUD Plans and Plan Items
app.get('/plans/:patientId', async (req, res) => {
  const { data } = await supabase.from('plans').select('*').eq('patient_id', req.params.patientId).eq('pt_id', req.user.id);
  res.json(data);
});

app.post('/plans', async (req, res) => {
  const { data } = await supabase.from('plans').insert({ ...req.body, pt_id: req.user.id });
  res.json(data);
});

app.post('/plan-items', async (req, res) => {
  const { data } = await supabase.from('plan_items').insert(req.body);
  res.json(data);
});

// Patient Management and Invite Codes
app.get('/patients', async (req, res) => {
  const { data } = await supabase.from('patients').select('*').eq('pt_id', req.user.id);
  res.json(data);
});

app.post('/patients', async (req, res) => {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const { data: patient } = await supabase.from('patients').insert({ ...req.body, pt_id: req.user.id });
  await supabase.from('invite_codes').insert({ pt_id: req.user.id, code, status: 'active' });
  res.json({ patient, code });
});

app.post('/invite-codes', async (req, res) => {
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const { data } = await supabase.from('invite_codes').insert({ pt_id: req.user.id, code, status: 'active' });
  res.json(data);
});

// Upload Media
app.post('/upload-media', upload.single('video'), async (req, res) => {
  const { data } = await supabase.storage.from('videos').upload(req.file.filename, req.file.buffer);
  res.json({ url: data.path });
});

// Analytics
app.get('/analytics/:patientId', async (req, res) => {
  const { data } = await supabase.from('sessions').select('local_date, total_exercises_completed, total_exercises_assigned').eq('patient_id', req.params.patientId).limit(7);
  res.json(data);
});

// Audit Logging
app.use(async (req, res, next) => {
  await supabase.from('audit_logs').insert({ actor_user_id: req.user.id, actor_role: 'pt', action: req.method, target_type: 'api', metadata: req.body });
  next();
});

app.listen(4000, () => console.log('PT Backend running on 4000'));