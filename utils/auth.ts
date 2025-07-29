import * as SecureStore from 'expo-secure-store';

export const setKakaoTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync('kakao_access_token', accessToken);
  await SecureStore.setItemAsync('kakao_refresh_token', refreshToken);
};
export const getKakaoAccessToken = () => SecureStore.getItemAsync('kakao_access_token');
export const getKakaoRefreshToken = () => SecureStore.getItemAsync('kakao_refresh_token');

export const setServiceTokens = async (accessToken: any, refreshToken: any) => {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new Error('Invalid accessToken');
  }
  if (!refreshToken || typeof refreshToken !== 'string') {
    throw new Error('Invalid refreshToken');
  }
  await SecureStore.setItemAsync('service_access_token', accessToken);
  await SecureStore.setItemAsync('service_refresh_token', refreshToken);
};
export const getServiceAccessToken = () => SecureStore.getItemAsync('service_access_token');
export const getServiceRefreshToken = () => SecureStore.getItemAsync('service_refresh_token');

export const removeAllTokens = async () => {
  // await SecureStore.deleteItemAsync('kakao_access_token');
  // await SecureStore.deleteItemAsync('kakao_refresh_token');
  await SecureStore.deleteItemAsync('service_access_token');
  await SecureStore.deleteItemAsync('service_refresh_token');
};

