import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, BackHandler, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => backHandler.remove();
    }
  }, [canGoBack]);

  // Custom UserAgent to allow Google OAuth inside WebView
  const userAgent = Platform.OS === 'android' 
    ? "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
    : "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://travolish-plum.vercel.app/' }}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
          style={styles.webview}
          startInLoadingState={true}
          userAgent={userAgent}
          renderLoading={() => (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#FF385C" />
            </View>
          )}
          // Reliability fixes for photo uploads & process death
          allowsFileAccess={true}
          allowsFileAccessFromFileURLs={true}
          onRenderProcessGone={() => webViewRef.current?.reload()}
          onContentProcessDidTerminate={() => webViewRef.current?.reload()}
          // Fix for some Android devices where hardware acceleration causes issues during camera picks
          androidLayerType={Platform.OS === 'android' ? 'hardware' : 'none'}
          // Allow full-screen video and standard web behaviors
          allowsFullscreenVideo={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          originWhitelist={['*']}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
