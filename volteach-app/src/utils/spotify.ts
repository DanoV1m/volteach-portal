const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;

const SCOPES = [
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
].join(' ');

function getRedirectUri(): string {
  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:3000';
  }
  return 'https://volteach-portal.web.app';
}

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function randomString(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, b => chars[b % chars.length]!).join('');
}

async function sha256base64url(plain: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ── Auth flow ─────────────────────────────────────────────────────────────────

export async function initiateSpotifyLogin(): Promise<void> {
  const verifier = randomString(64);
  const challenge = await sha256base64url(verifier);
  localStorage.setItem('sp_verifier', verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: SCOPES,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function handleSpotifyCallback(code: string): Promise<void> {
  const verifier = localStorage.getItem('sp_verifier');
  if (!verifier) throw new Error('Missing PKCE verifier');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: verifier,
    }),
  });

  if (!res.ok) throw new Error('Token exchange failed');

  const data = await res.json();
  localStorage.setItem('sp_token', data.access_token);
  localStorage.setItem('sp_refresh', data.refresh_token);
  localStorage.setItem('sp_expires', String(Date.now() + data.expires_in * 1000));
  localStorage.removeItem('sp_verifier');
}

// ── Token management ──────────────────────────────────────────────────────────

async function doRefresh(): Promise<string | null> {
  const rt = localStorage.getItem('sp_refresh');
  if (!rt) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: rt,
    }),
  });

  if (!res.ok) { disconnectSpotify(); return null; }

  const data = await res.json();
  localStorage.setItem('sp_token', data.access_token);
  localStorage.setItem('sp_expires', String(Date.now() + data.expires_in * 1000));
  if (data.refresh_token) localStorage.setItem('sp_refresh', data.refresh_token);
  return data.access_token;
}

export async function getToken(): Promise<string | null> {
  const token = localStorage.getItem('sp_token');
  const expires = Number(localStorage.getItem('sp_expires') ?? 0);
  if (!token) return null;
  if (Date.now() > expires - 5 * 60 * 1000) return doRefresh();
  return token;
}

export function isSpotifyConnected(): boolean {
  return !!localStorage.getItem('sp_token');
}

export function disconnectSpotify(): void {
  ['sp_token', 'sp_refresh', 'sp_expires', 'sp_verifier'].forEach(k =>
    localStorage.removeItem(k)
  );
}

// ── API calls ─────────────────────────────────────────────────────────────────

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: { total: number };
  owner: { display_name: string };
}

async function spotifyFetch<T>(path: string): Promise<T | null> {
  const token = await getToken();
  if (!token) return null;
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

export async function getMyPlaylists(): Promise<SpotifyPlaylist[]> {
  const data = await spotifyFetch<{ items: SpotifyPlaylist[] }>('/me/playlists?limit=50');
  return data?.items.filter(Boolean) ?? [];
}

export async function getSpotifyUser(): Promise<{ display_name: string } | null> {
  return spotifyFetch<{ display_name: string }>('/me');
}
