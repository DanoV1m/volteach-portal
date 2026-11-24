import { auth } from '../firebase';

export async function queryBackend(prompt: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use AI features.');
  const token = await user.getIdToken();
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error(response.status === 429 ? 'AI request limit reached.' : 'AI service unavailable.');
  const data = await response.json();
  if (typeof data.text !== 'string') throw new Error('AI service unavailable.');
  return data.text;
}
