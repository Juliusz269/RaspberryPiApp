import React from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { vehicleApi } from '../api/vehicle';

interface JoystickProps {
  size?: number;
  onMove: (data: { left: number; right: number }) => void;
}


export function Joystick({ size = 150, onMove }: JoystickProps) {
  const pan = new Animated.ValueXY();
  const baseRadius = size / 2;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: (_, gesture) => {
      const angle = Math.atan2(gesture.dy, gesture.dx);
      const distance = Math.min(1, Math.hypot(gesture.dx, gesture.dy) / baseRadius);
    
      const speed = distance;
      const rotation = angle / (Math.PI / 2);
    
      onMove({ left: speed + rotation, right: speed - rotation });
    },
    onPanResponderRelease: () => {
      pan.setValue({ x: 0, y: 0 });
      vehicleApi.moveVehicle({ left: 0, right: 0 }).catch(console.error);
      onMove({ left: 0, right: 0 });
    }
  });

  return (
    <View style={[styles.container, { width: size, height: size }]} {...panResponder.panHandlers}>
      <View style={styles.base} />
      <Animated.View
        style={[styles.knob, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: '#f0f0f0',
  },
  base: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#007AFF',
    opacity: 0.2,
  },
  knob: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
});