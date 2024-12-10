// components/Controls.tsx
import React from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';

interface ControlsProps {
  isConnected: boolean;
  isAutonomous: boolean;
  onModeToggle: () => void;
  onEmergencyStop: () => void;
}

export function Controls({
  isConnected,
  isAutonomous,
  onModeToggle,
  onEmergencyStop,
}: ControlsProps) {
  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={styles.statusSection}>
        <Text style={styles.title}>Vehicle Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Connection:</Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isConnected ? '#4CAF50' : '#FF3B30' },
            ]}
          />
        </View>
      </View>

      {/* Mode Control */}
      <View style={styles.controlSection}>
        <Text style={styles.title}>Control Mode</Text>
        <View style={styles.modeRow}>
          <Text style={styles.modeLabel}>
            {isAutonomous ? 'Autonomous' : 'Manual'}
          </Text>
          <Switch
            value={isAutonomous}
            onValueChange={onModeToggle}
            disabled={!isConnected}
          />
        </View>
      </View>

      {/* Emergency Stop */}
      <TouchableOpacity
        style={[
          styles.emergencyButton,
          !isConnected && styles.disabledButton,
        ]}
        onPress={onEmergencyStop}
        disabled={!isConnected}
      >
        <Text style={styles.emergencyText}>EMERGENCY STOP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  statusSection: {
    gap: 8,
  },
  controlSection: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeLabel: {
    fontSize: 16,
    color: '#666',
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});