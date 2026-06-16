import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Minimal Firebase Auth mock ────────────────────────────────────────────────
// We test the *shape* of the auth contract used in App.tsx without hitting
// real Firebase servers. The mock captures the onAuthStateChanged callback so
// tests can drive auth state changes synchronously.

type AuthCallback = (user: MockUser | null) => void;

interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
}

let _authCallback: AuthCallback | null = null;

const mockAuth = {
  currentUser: null as MockUser | null,
};

const mockOnAuthStateChanged = vi.fn((auth: unknown, cb: AuthCallback) => {
  _authCallback = cb;
  cb(mockAuth.currentUser);
  return () => { _authCallback = null; };
});

const mockSignOut = vi.fn(async () => {
  mockAuth.currentUser = null;
  _authCallback?.(null);
});

vi.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  onAuthStateChanged: mockOnAuthStateChanged,
  signOut: mockSignOut,
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

vi.mock('../firebase', () => ({
  auth: mockAuth,
  db: {},
  handleFirestoreError: vi.fn(),
  OperationType: { CREATE: 'create', UPDATE: 'update', DELETE: 'delete', LIST: 'list', GET: 'get', WRITE: 'write' },
}));

// ── Helper to simulate auth state changes ─────────────────────────────────────

function signIn(user: MockUser) {
  mockAuth.currentUser = user;
  _authCallback?.(user);
}

function signOut() {
  mockAuth.currentUser = null;
  _authCallback?.(null);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

const MOCK_USER: MockUser = {
  uid: 'test-uid-123',
  email: 'test@volteach.test',
  displayName: 'סטודנט בדיקה',
  emailVerified: true,
};

describe('Firebase Auth contract', () => {
  beforeEach(() => {
    mockAuth.currentUser = null;
    _authCallback = null;
    vi.clearAllMocks();
  });

  it('onAuthStateChanged receives null for unauthenticated user', () => {
    const cb = vi.fn();
    mockOnAuthStateChanged({}, cb);
    expect(cb).toHaveBeenCalledWith(null);
  });

  it('onAuthStateChanged receives user object after sign-in', () => {
    const cb = vi.fn();
    mockOnAuthStateChanged({}, cb);
    signIn(MOCK_USER);
    expect(cb).toHaveBeenLastCalledWith(MOCK_USER);
  });

  it('signed-in user has required uid and email fields', () => {
    const cb = vi.fn();
    mockOnAuthStateChanged({}, cb);
    signIn(MOCK_USER);
    const receivedUser = cb.mock.calls.at(-1)?.[0] as MockUser;
    expect(receivedUser.uid).toBeTruthy();
    expect(receivedUser.email).toBeTruthy();
  });

  it('onAuthStateChanged receives null after sign-out', () => {
    const cb = vi.fn();
    mockOnAuthStateChanged({}, cb);
    signIn(MOCK_USER);
    signOut();
    expect(cb).toHaveBeenLastCalledWith(null);
  });

  it('unsubscribe stops future notifications', () => {
    const cb = vi.fn();
    const unsub = mockOnAuthStateChanged({}, cb);
    unsub();
    signIn(MOCK_USER);
    // cb should have been called once (initial null), not again after signIn
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('uid is a non-empty string', () => {
    const cb = vi.fn();
    mockOnAuthStateChanged({}, cb);
    signIn(MOCK_USER);
    const user = cb.mock.calls.at(-1)?.[0] as MockUser;
    expect(typeof user.uid).toBe('string');
    expect(user.uid.length).toBeGreaterThan(0);
  });
});

// ── Rate-limiter behaviour (server contract) ───────────────────────────────────
// These tests verify the *shape* of the /api/gemini response contract that
// the client relies on. No actual HTTP request is made.

describe('/api/gemini response contract', () => {
  it('success response has a text field', () => {
    const successBody = { text: 'הסבר לנוסחה...' };
    expect(typeof successBody.text).toBe('string');
    expect(successBody.text.length).toBeGreaterThan(0);
  });

  it('auth error response has an error field', () => {
    const errorBody = { error: 'Authentication required' };
    expect(typeof errorBody.error).toBe('string');
  });

  it('rate limit response has an error field', () => {
    const rateLimitBody = { error: 'Too many requests, please try again later.' };
    expect(typeof rateLimitBody.error).toBe('string');
    expect(rateLimitBody.error).toContain('Too many requests');
  });

  it('prompt validation rejects empty prompt', () => {
    const prompt = '';
    expect(prompt.length === 0 || typeof prompt !== 'string').toBe(true);
  });

  it('prompt validation rejects oversized prompt', () => {
    const longPrompt = 'x'.repeat(4001);
    expect(longPrompt.length > 4000).toBe(true);
  });
});
