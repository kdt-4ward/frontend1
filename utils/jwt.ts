export function isJwtExpired(token: string): boolean {
  if (!token) return true;
  const [, payload] = token.split('.');
  if (!payload) return true;
  const decoded = JSON.parse(atob(payload));
  if (!decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}