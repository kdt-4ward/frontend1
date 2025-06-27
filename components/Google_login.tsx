// // App.js 또는 로그인 컴포넌트
// import * as React from 'react';
// import { Button } from 'react-native';
// import * as AuthSession from 'expo-auth-session';

// const CLIENT_ID = '20389543951-lp415huk9beqdqainbb9u15iam327qha.apps.googleusercontent.com';
// const REDIRECT_URI = 'https://auth.expo.io/@soso12321/frontend'; //AuthSession.makeRedirectUri({ useProxy: true });
// const REDIRECT_URI = "https://b134-221-148-97-239.ngrok-free.app/auth/google/callback";

// export default function Google_login() {
//   const [request, response, promptAsync] = AuthSession.useAuthRequest({
//     clientId: CLIENT_ID,
//     redirectUri: REDIRECT_URI,
//     scopes: ['openid', 'profile', 'email'],
//     // responseType: 'code',
//     // usePKCE: true,
//     usePKCE: false,
//     responseType: 'id_token',
//     extraParams: {
//       nonce: 'random-nonce-value' // 필수
//     }
//   },{
//     authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//   });

//   React.useEffect(() => {
//     if (response?.type === 'success') {
//       const { id_token, access_token, code } = response.params;
//       // 토큰 서버로 전송하거나 사용자 정보 디코딩
//       console.log('🔔 전체 로그인 응답:', response);
//       console.log('✅ ID Token:', id_token);
//       console.log('✅ Access Token:', access_token);
//       console.log('✅ Authorization Code:', code);
//     }
//   }, [response]);

//   return (
//     <Button
//       disabled={!request}
//       title="Google 로그인"
//       onPress={() => promptAsync()}
//     />
//   );
// }
// console.log('최종 redirectUri:', REDIRECT_URI);

// App.js 또는 Google_login.tsx
import * as React from 'react';
import { Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = '20389543951-lp415huk9beqdqainbb9u15iam327qha.apps.googleusercontent.com';

// ✅ FastAPI 서버의 /auth/google/callback 주소
const REDIRECT_URI = 'https://b134-221-148-97-239.ngrok-free.app/auth/google/callback';

export default function Google_login() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ['openid', 'profile', 'email'],
      responseType: 'code',     // ✅ 백엔드 연동을 위해 code 사용
      usePKCE: false,            // ✅ 보안 강화를 위해 true 사용
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    }
  );

  // 참고용: 프론트는 실제로 로그인 성공 정보를 직접 받지 않음
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('✅ Authorization Code (전송됨):', code);
    } else if (response?.type === 'error') {
      console.log('❌ 로그인 오류:', response);
    }
  }, [response]);

  return (
    <Button
      title="Google 로그인"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}
