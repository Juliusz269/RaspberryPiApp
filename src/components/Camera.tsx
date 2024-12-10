// components/Camera.tsx
import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';

interface CameraProps {
  frame: string | null;
}

export function Camera({ frame }: CameraProps) {
  if (!frame) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${frame}` }}
        style={styles.cameraFeed}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFeed: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
  },
});
