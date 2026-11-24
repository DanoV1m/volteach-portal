type Decision = {ok: true; prompt: string} | {ok: false; status: number; error: string};

export function createAiGuard(
  verify: (token: string) => Promise<string>,
  now: () => number = Date.now,
  limit = 20,
  windowMs = 60000,
  maxUsers = 10000
) {
  const requests = new Map<string, { count: number; expires: number }>();
  const reject = (status: number, error: string): Decision => ({ok: false, status, error});
  return async (authorization: string | undefined, body: unknown): Promise<Decision> => {
    const token = authorization?.match(/^Bearer (\S+)$/i)?.[1];
    if (!token) return reject(401, "Authentication required");
    let uid: string;
    try { uid = await verify(token); } catch { return reject(401, "Invalid authentication"); }
    if (!uid) return reject(401, "Invalid authentication");
    const prompt = body && typeof body === "object" && "prompt" in body ? body.prompt : undefined;
    if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 20000)
      return reject(400, "Invalid prompt");
    const time = now();
    for (const [key, value] of requests) if (value.expires <= time) requests.delete(key);
    const bucket = requests.get(uid);
    if (bucket && bucket.count >= limit) return reject(429, "Request limit reached");
    if (!bucket && requests.size >= maxUsers) return reject(503, "Service busy");
    requests.set(uid, {count: (bucket?.count ?? 0)+1, expires: bucket?.expires ?? time+windowMs});
    return {ok: true, prompt};
  };
}
