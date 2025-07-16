import { backendBaseUrl } from '@/constants/app.constants';
import { getServiceAccessToken, getServiceRefreshToken, setServiceTokens } from './auth';
import { isJwtExpired } from './jwt';

export const apiFetch = async (url: string, options: any = {}) => {
  let token = await getServiceAccessToken();
  
  // 만료된 경우 refresh
  if (token && isJwtExpired(token)) {
    const refreshToken = await getServiceRefreshToken();
    const refreshRes = await fetch(`${backendBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (refreshRes.ok) {
      const { access_token, refresh_token } = await refreshRes.json();
      await setServiceTokens(access_token, refresh_token);
      token = access_token;
    } else {
      // refresh도 실패하면 온보딩으로 이동 등
      throw new Error('로그인 만료');
    }
  }

  // 정상 요청
  let response = await fetch(`${backendBaseUrl}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
  });

  // 토큰 만료 시 재발급 & 재요청
  if (response.status === 401) {
    // refresh 토큰으로 accessToken 재발급
    const refreshToken = await getServiceRefreshToken();
    const refreshRes = await fetch(`${backendBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (refreshRes.ok) {
      const { access_token, refresh_token } = await refreshRes.json();
      await setServiceTokens(access_token, refresh_token);
      // 새 토큰으로 다시 요청
      token = access_token;
      response = await fetch(`${backendBaseUrl}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }
  return response;
};
