// SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vehicleApi } from '../api/vehicle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../api/config';

export function SettingsScreen() {
  const navigation = useNavigation();
  const [ipAddress, setIpAddress] = useState('192.168.208.252');
  const [port, setPort] = useState('8000');

  // Load saved settings when screen opens
  useEffect(() => {
    async function loadSettings() {
      try {
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.VEHICLE_SETTINGS);
        if (savedSettings) {
          const { ipAddress: savedIp, port: savedPort } = JSON.parse(savedSettings);
          setIpAddress(savedIp);
          setPort(String(savedPort));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }

    loadSettings();
  }, []);

  // Handle saving settings and connecting to vehicle
  const handleSave = async () => {
    try {
      const settings = {
        ipAddress,
        port: parseInt(port)
      };

// Test connection
      const isConnected = await vehicleApi.testConnection(settings);

      if (!isConnected) {  // When connection fails
          Alert.alert(
              'Connection Failed',
              'Could not connect to vehicle. Please check IP address and port.'
          );
          return;
}
      // Save settings and update vehicle configuration
      await AsyncStorage.setItem(STORAGE_KEYS.VEHICLE_SETTINGS, JSON.stringify(settings));
      await vehicleApi.updateConfig(settings.ipAddress, settings.port);
      navigation.goBack();
      
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Connection Settings</Text>

        <Text style={styles.label}>IP Address</Text>
        <TextInput
          style={styles.input}
          value={ipAddress}
          onChangeText={setIpAddress}
          placeholder="192.168.208.252"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Port</Text>
        <TextInput
          style={styles.input}
          value={port}
          onChangeText={setPort}
          placeholder="8000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});