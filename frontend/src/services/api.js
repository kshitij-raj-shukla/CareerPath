import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

export async function getPrediction(profile) {
  const { data } = await api.post('/predict', profile);
  return data;
}
