import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { View, ActivityIndicator } from "react-native";

export default function YoutubeWebview() {
  const { url } = useLocalSearchParams<{ url: string }>();
  if (!url) return null;
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: decodeURIComponent(url) }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={{ marginTop: 100 }} />
        )}
      />
    </View>
  );
}