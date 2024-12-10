// screens/MainScreen.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Joystick } from '../components/Joystick';
import { Camera } from '../components/Camera';
import { Map } from '../components/Map';
import { Controls } from '../components/Controls';
import { useVehicleControl } from '../hooks/useVehicleControl';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export function MainScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { state, map, position, cameraFrame, actions } = useVehicleControl();
  // Handler for emergency stop
  const handleEmergencyStop = () => {
    actions.emergencyStop();
    Alert.alert('Emergency Stop', 'Vehicle has been stopped.');
  };

  // Handler for mode toggle with confirmation
  const handleModeToggle = () => {
    if (!state.isConnected) {
      Alert.alert('Not Connected', 'Please connect to vehicle in settings first.');
      return;
    }

    Alert.alert(
      `${state.isAutonomous ? 'Disable' : 'Enable'} Autonomous Mode`,
      `Are you sure you want to ${state.isAutonomous ? 'disable' : 'enable'} autonomous mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: actions.toggleMode }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Left Control Panel */}
      <View style={styles.leftPanel}>
        <Controls
          isConnected={state.isConnected}
          isAutonomous={state.isAutonomous}
          onModeToggle={handleModeToggle}
          onEmergencyStop={handleEmergencyStop}
        />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Center View (Camera or Map) */}
      <View style={styles.centerPanel}>
        {state.isAutonomous ? (
          <Map mapData={map} position={position} />
        ) : (
          <Camera frame={cameraFrame} />
        )}
      </View>

      {/* Right Control Panel */}
      <View style={styles.rightPanel}>
        <Joystick onMove={actions.moveVehicle} />
        {(!state.isConnected || state.isAutonomous) && (
          <Text style={styles.joystickStatus}>
            {state.isAutonomous ? 'Autonomous Mode' : 'Not Connected'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  leftPanel: {
    width: '25%',
    padding: 16,
    justifyContent: 'space-between',
  },
  centerPanel: {
    flex: 1,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  rightPanel: {
    width: '25%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  joystickStatus: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});