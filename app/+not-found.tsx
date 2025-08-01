import { Link, router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import React, { useEffect } from 'react';

export default function NotFoundScreen() {
  useEffect(() => {
    setTimeout(() => {
      // Redirect to onboarding after 3 seconds
      router.replace('/(tabs)/home');
    }, 100);
  }, []);
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.text}>This screen does not exist.</ThemedText>
        <Link href="/onboarding" style={styles.link}>
          <ThemedText type="link" style={styles.text}>Go to onboarding!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  text: {
    textAlign: 'center',
  }
});
