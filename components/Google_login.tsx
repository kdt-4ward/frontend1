import * as React from 'react';
import { Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';
interface GoogleLoginProps {
  onLoginSuccess: (user: { user_id: string; name: string; email: string }) => void;
}
const CLIENT_ID = '20389543951-lp415huk9beqdqainbb9u15iam327qha.apps.googleusercontent.com';
const REDIRECT_URI = 'https://api.luvtune.site/auth/google/callback';

export default function Google_login({ onLoginSuccess }: GoogleLoginProps) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',
      usePKCE: false,
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    }
  );

  React.useEffect(() => {
    const sendCodeToServer = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;
        console.log('✅ Authorization Code:', code);

        try {
          const res = await axios.post(`${REDIRECT_URI}`, { code });
          const { user_info } = res.data;
          onLoginSuccess(user_info);
          console.log("🔥 onLoginSuccess 실행됨:", user_info);

          // console.log('🔐 로그인 성공:', res.data);
          Alert.alert('로그인 성공', JSON.stringify(res.data));
        } catch (err: any) {
          // console.error('❌ 서버 요청 실패:', err);
          Alert.alert('서버 요청 실패', err.message);
        }
      }
    };

    sendCodeToServer();
  }, [response]);

  return (
    <Button
      title="Google 로그인"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}

