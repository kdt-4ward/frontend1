import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@react-native-kakao/user';
import { setServiceTokens } from '../utils/auth';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom } from '@/atoms/userAtom';
import { apiFetch } from '@/utils/api';
import * as Clipboard from 'expo-clipboard';
import { backendBaseUrl } from '@/constants/app.constants';
import { coupleAtom } from '@/atoms/coupleAtom';

type Step = "select" | "login" | "signup" | "couple";

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>("select");
  const [inviteCode, setInviteCode] = useState('');
  const [myInviteCode, setMyInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [polling, setPolling] = useState(false);
  const [isCoupleCodeEnter, setIsCoupleCodeEnter] = useState(false);
  const setUser = useSetAtom(userAtom);
  const setCouple = useSetAtom(coupleAtom);
  const router = useRouter();
  const kakaoLoginButton = require('../assets/images/kakao_login_large_wide.png');
  const userInfo = useAtomValue(userAtom);

  useEffect(() => {
    setUser(null);
    setCouple(null);
    console.log("Onboarding 초기화", userInfo);
  }, []);

  useEffect(() => {
    if (step !== "couple" || !userInfo?.user_id || userInfo.couple_id) return;

    setPolling(true);
    const interval = setInterval(async () => {
      const res = await apiFetch('/auth/me', { method: 'GET' });
      if (res.ok) {
        const userData = await res.json();
        // couple_id가 새로 생기면 → 연결 성공!
        if (userData.couple_id && !userInfo.couple_id) {
          setUser(userData);
          // 커플 정보 jotai에도 저장
          const coupleRes = await apiFetch(`/couple/info/${userData.couple_id}`);
          if (coupleRes.ok) {
            const coupleInfo = await coupleRes.json();
            setCouple(coupleInfo);
          }
          Alert.alert("커플 연결 성공!", "상대방과 연결이 완료되었습니다.", [
            { text: "확인", onPress: () => router.replace('/(tabs)/home') }
          ]);
          clearInterval(interval); // 폴링 종료
        }
      }
    }, 4000); // 4초마다 확인
    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [step, userInfo?.user_id, userInfo?.couple_id]);

  const onKakaoLogin = async () => {
    try {
      const kakaoRes = await login();
      // await setKakaoTokens(kakaoRes.accessToken, kakaoRes.refreshToken);
      // console.log("카카오 로그인 성공, 토큰 저장 완료", kakaoRes.accessToken, kakaoRes.refreshToken);

      // 백엔드에 카카오 accessToken 전달, JWT 획득
      const backendRes = await fetch(`${backendBaseUrl}/auth/kakao-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kakao_access_token: kakaoRes.accessToken }),
      });
      const { access_token, refresh_token } = await backendRes.json();
      await setServiceTokens(access_token, refresh_token);
      // console.log("백엔드 로그인 성공, 토큰 저장 완료", access_token, refresh_token);

      const res = await apiFetch('/auth/me', { method: 'GET' });
      const userInfo = await res.json();
      setUser(userInfo);
      // console.log("유저 정보:", userInfo);
      setStep(userInfo.couple_id ? "select" : "couple");
      // 2. 커플 정보 가져와서 jotai에 저장
      if (userInfo.couple_id) {
        const coupleRes = await apiFetch(`/couple/info/${userInfo.couple_id}`);
        if (coupleRes.ok) {
          const coupleInfo = await coupleRes.json();
          setCouple(coupleInfo);
          // console.log("커플 연결 성공:", coupleInfo);
          router.replace('/(tabs)/home');
        }
      }
    } catch (error) {
      alert('카카오 로그인 실패');
      console.error(error);
    }
  };

  // 2. 일반 회원가입
  const onSignup = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });
      if (!res.ok) {
        alert('회원가입 실패(중복 이메일 등)');
        return;
      }
      alert('회원가입 성공! 로그인 해주세요.');
      setStep("login");
    } catch (err) {
      alert('회원가입 에러');
      console.error(err);
    }
  };

  // 3. 일반 로그인
  const onLogin = async () => {
    try {
      const res = await fetch(`${backendBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        alert('이메일 또는 비밀번호를 확인하세요');
        return;
      }
      const { access_token, refresh_token, user_id, nickname, couple_id, profile_image } = await res.json();
      await setServiceTokens(access_token, refresh_token);
      const userData = { user_id, nickname, couple_id, email, profile_image };
      setUser(userData);
      setStep(couple_id ? "select" : "couple");
      // 2. 커플 정보 가져와서 jotai에 저장
      if (couple_id) {
        const coupleRes = await apiFetch(`/couple/info/${couple_id}`);
        if (coupleRes.ok) {
          const coupleInfo = await coupleRes.json();
          setCouple(coupleInfo);
          // console.log("커플 연결 성공:", coupleInfo);
          router.replace('/(tabs)/home');
        }
      }
    } catch (err) {
      alert('로그인 에러');
      console.error(err);
    }
  };

  // 4. 내 초대코드 생성
  const handleGenerateCode = async (user_id: string) => {
    const res = await apiFetch('/couple/invite', {
      method: 'POST',
      body: JSON.stringify({ inviter_user_id: user_id }),
    });
    const data = await res.json();
    setMyInviteCode(data.invite_code);
  };

  // 5. 초대코드 입력(참여)
  const handleJoin = async (user_id: string) => {
    const res = await apiFetch('/couple/join', {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode, invited_user_id: user_id }),
    });
    if (res.ok) {
      // 1. 유저 정보 최신화
      const updatedUser = await apiFetch('/auth/me').then(r => r.json());
      setUser(updatedUser);

      // 2. 커플 정보 가져와서 jotai에 저장
      if (updatedUser.couple_id) {
        const coupleRes = await apiFetch(`/couple/info/${updatedUser.couple_id}`);
        if (coupleRes.ok) {
          const coupleInfo = await coupleRes.json();
          setCouple(coupleInfo);
          // console.log("커플 연결 성공:", coupleInfo);
        }
      }
      setIsCoupleCodeEnter(false);
      router.replace('/(tabs)/home');
    } else {
      alert('초대 코드가 유효하지 않습니다.');
    }
  };

  // console.log("userInfo in onboarding:", userInfo);

  // ------ UI 단계별 분기 -------
  if (step === "select") {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('@/assets/images/icon.png')}
          resizeMode="contain"
        />
        <Text style={styles.welcome}>LuvTune에 오신 걸 환영해요!</Text>
        <TouchableOpacity onPress={onKakaoLogin} style={styles.kakaoButton} activeOpacity={0.7}>
          <Image source={kakaoLoginButton} style={styles.kakaoImg} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { marginTop: 0, marginBottom: 0 }]} onPress={() => setStep("login")}>
          <Text style={styles.buttonText}>이메일로 로그인</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "signup") {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>회원가입</Text>
        <TextInput placeholder="닉네임" value={signupName} onChangeText={setSignupName} style={styles.input} />
        <TextInput placeholder="이메일" value={signupEmail} onChangeText={setSignupEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="비밀번호" value={signupPassword} onChangeText={setSignupPassword} style={styles.input} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={onSignup}>
          <Text style={{ color: '#fff'}}>회원가입</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep("login")}>
          <Text style={{ color: '#7c7c7c' }}>이미 계정이 있으신가요? 로그인</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "login") {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>로그인</Text>
        <TextInput placeholder="이메일" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="비밀번호" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={{}} onPress={() => setStep("select")}>
            <Text style={{ color: '#7c7c7c' }}>← 뒤로 돌아가기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={() => setStep("signup")}>
            <Text style={{ color: '#7c7c7c' }}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 커플 연결 단계
  if (step === "couple") {
    if (!userInfo) return <Text>로그인 오류, 새로고침 해주세요</Text>;
    const copyCode = async () => {
      await Clipboard.setStringAsync(myInviteCode);
      Alert.alert('커플 코드 복사', '커플 코드가 복사되었어요.\n상대방에게 공유해 주세요!');
    };
    return (
      <View style={styles.container}>
        <Text style={[styles.welcome, { marginBottom: 0 }]}>커플 연결 후</Text>
        <Text style={[styles.welcome, { marginTop: 3, marginBottom: 30 }]}>러브튠을 시작해 보세요.</Text>
        <Image
          style={{ width: 150, height: 150 }}
          source={require('@/assets/images/luvy5.png')}
          resizeMode="contain"
        />
        {myInviteCode ? (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text>내 초대코드: {myInviteCode}</Text>
            <TouchableOpacity onPress={copyCode} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>복사하기</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TouchableOpacity style={styles.button} onPress={() => handleGenerateCode(userInfo.user_id)}>
          <Text style={styles.copyButtonText}>내 초대코드 생성하기</Text>
        </TouchableOpacity>
        {isCoupleCodeEnter ? (
          <>
            <TextInput value={inviteCode} onChangeText={setInviteCode} placeholder="상대방 초대코드 입력하기" style={styles.input} />
            <TouchableOpacity style={[styles.button, {marginTop: 12}]} onPress={() => handleJoin(userInfo.user_id)}>
              <Text style={styles.buttonText}>연결하기</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.InviteButton} onPress={() => setIsCoupleCodeEnter(true)}>
            <Text style={styles.InviteButtonText}>상대방 초대코드 입력하기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return null;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center"
  },
  input: {
    width: 300,
    borderBottomWidth: 1,
    borderColor: '#bbb',
    fontSize: 16,
    marginVertical: 10,
    padding: 8
  },
  kakaoImg: {
    width: 300,
    height: 50,
    resizeMode: 'contain',
  },
  kakaoButton: {
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: '#7493F7',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#fff',
  },
  InviteButton: {
    width: 300,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#7493F7',
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  InviteButtonText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#000',
  },
  copyButton: {
    backgroundColor: '#e5cf2d',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  copyButtonText: {
    fontWeight: 500,
    fontSize: 16,
    color: '#fff'
  },
  bottomNav: {
    width: 300,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
