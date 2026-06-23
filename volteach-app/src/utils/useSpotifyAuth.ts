import { useEffect } from 'react';
import { handleSpotifyCallback } from './spotify';

function dispatchToast(msg: string, type: 'info' | 'error' | 'success') {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { msg, type } }));
}

export function useSpotifyAuth(): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    if (error) {
      window.history.replaceState({}, '', window.location.pathname);
      return;
    }
    if (code) {
      window.history.replaceState({}, '', window.location.pathname);
      handleSpotifyCallback(code)
        .then(() => {
          dispatchToast('חוברת בהצלחה ל-Spotify! 🎵', 'success');
          window.dispatchEvent(new CustomEvent('spotify-connected'));
        })
        .catch(() => dispatchToast('שגיאה בהתחברות ל-Spotify', 'error'));
    }
  }, []);
}
