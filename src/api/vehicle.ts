// vehicle.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

class VehicleApi {
  private baseUrl: string = '';

  private async request(endpoint: string, method = 'GET', body?: any) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error('Request error:', error);
    }
  }

  async moveVehicle(data: any) {
    try {
      await fetch(`${this.baseUrl}/api/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Move error:', error);
    }
  }

  async initialize() {
    try {
      const settings = await AsyncStorage.getItem('@vehicle_settings');
      if (settings) {
        const { ipAddress, port } = JSON.parse(settings);
        this.baseUrl = `http://${ipAddress}:${port}`;
      }
    } catch (error) {
      console.error('Init error:', error);
    }
  }

  async updateConfig(ipAddress: string, port: number) {
    try {
      this.baseUrl = `http://${ipAddress}:${port}`;
      await AsyncStorage.setItem(
        '@vehicle_settings',
        JSON.stringify({ ipAddress, port })
      );
    } catch (error) {
      console.error('Config error:', error);
      throw error;
    }
  }


  async testConnection(settings?: { ipAddress: string; port: number }) {
    try {
      const testUrl = settings 
        ? `http://${settings.ipAddress}:${settings.port}/api/status`
        : `${this.baseUrl}/api/status`;
        
      const response = await fetch(testUrl);
      const data = await response.json();
      return data.camera_active || data.lidar_active;
    } catch {
      return false;
    }
  }

  async getStatus() {
    return this.request('/api/status');
  }

  async getCameraFrame() {
    return this.request('/api/camera');
  }

  async getMap() {
    return this.request('/api/map');
  }



  async setMode(isAutonomous: boolean) {
    return this.request('/api/mode', 'POST', {
      mode: isAutonomous ? 'explore' : 'manual'
    });
  }

  async emergencyStop() {
    return this.request('/api/emergency', 'POST');
  }
}

export const vehicleApi = new VehicleApi();