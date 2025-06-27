// App.js 또는 로그인 컴포넌트
import * as React from 'react';
import { Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = '20389543951-lp415huk9beqdqainbb9u15iam327qha.apps.googleusercontent.com';
const REDIRECT_URI = 'https://auth.expo.io/@soso12321/frontend'; //AuthSession.makeRedirectUri({ useProxy: true });

export default function Google_login() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'code',
    usePKCE: true
  }, {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      // 토큰 서버로 전송하거나 사용자 정보 디코딩
      console.log('ID Token:', id_token);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Google 로그인"
      onPress={() => promptAsync()}
    />
  );
}
console.log('최종 redirectUri:', REDIRECT_URI);
