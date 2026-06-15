import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { setGeminiKey } from './gemini';

export async function loadRemoteConfig(): Promise<void> {
  try {
    const snap = await getDoc(doc(db, 'config', 'keys'));
    if (!snap.exists()) return;
    const key = snap.data().gemini as string | undefined;
    if (key) setGeminiKey(key);
  } catch {
    // silent — user not authenticated or doc missing
  }
}
