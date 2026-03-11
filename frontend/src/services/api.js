import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ──────────────────────────────────────────────────────

export async function signup(payload) {
  const { data } = await api.post('/api/signup', payload);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/api/login', { email, password });
  return data;
}

export async function getProfile() {
  const { data } = await api.get('/api/profile');
  return data;
}

export async function getProgress() {
  const { data } = await api.get('/api/progress');
  return data;
}

export async function toggleTask(planId, taskId, done) {
  const { data } = await api.patch(`/api/progress/${planId}/task`, { task_id: Number(taskId), done });
  return data;
}

// ── Career ────────────────────────────────────────────────────

export async function getPrediction(profile) {
  const { data } = await api.post('/api/predict', profile);
  return data;
}

export async function getCareerPlan(userProfile) {
  const { data } = await api.post('/api/career-plan', userProfile);
  return data;
}

export async function getAvailableCareers() {
  const { data } = await api.get('/api/careers');
  return data.careers;
}
