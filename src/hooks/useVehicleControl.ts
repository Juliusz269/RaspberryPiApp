// hooks/useVehicle.ts
import { useState, useEffect, useCallback } from 'react';
import { vehicleApi } from '../api/vehicle';
import { VehicleState, VehiclePosition } from '../types';

export function useVehicleControl() {
  const [state, setState] = useState<VehicleState>({
    isAutonomous: false,
    isConnected: false,
    speed: 0,
  });
  
  const [map, setMap] = useState<number[][] | null>(null);
  const [position, setPosition] = useState<VehiclePosition>({
    x: 0,
    y: 0,
    orientation: 0,
  });
  const [cameraFrame, setCameraFrame] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await vehicleApi.getStatus();
        setState(prev => ({
          ...prev,
          isConnected: true,
          isAutonomous: status?.mode === 'explore'
        }));
      } catch (error) {
        setState(prev => ({ ...prev, isConnected: false }));
      }
    };

    const interval = setInterval(checkStatus, 2000);
    checkStatus();
    return () => clearInterval(interval);
  }, []);

  // Rest of the code stays the same
  // Update camera feed in manual mode
  useEffect(() => {
    if (!state.isAutonomous && state.isConnected) {
      const updateCamera = async () => {
        try {
          const frame = await vehicleApi.getCameraFrame();
          setCameraFrame(frame.frame);
        } catch (error) {
          console.error('Camera update failed:', error);
        }
      };

      const interval = setInterval(updateCamera, 1000);
      updateCamera();

      return () => clearInterval(interval);
    }
  }, [state.isAutonomous, state.isConnected]);

  // Update map in autonomous mode
  useEffect(() => {
    if (state.isAutonomous && state.isConnected) {
      const updateMap = async () => {
        try {
          const mapData = await vehicleApi.getMap();
          setMap(mapData.map);
          setPosition(mapData.position);
        } catch (error) {
          console.error('Map update failed:', error);
        }
      };

      const interval = setInterval(updateMap, 1000);
      updateMap();

      return () => clearInterval(interval);
    }
  }, [state.isAutonomous, state.isConnected]);

  const toggleMode = useCallback(async () => {
    if (!state.isConnected) return;

    try {
      await vehicleApi.setMode(!state.isAutonomous);
      setState(prev => ({ ...prev, isAutonomous: !prev.isAutonomous }));
    } catch (error) {
      console.error('Mode toggle failed:', error);
    }
  }, [state.isConnected, state.isAutonomous]);
  const handleJoystickMove = async (data: any) => {
    try {
      console.log('Joystick data:', data);
      await vehicleApi.moveVehicle(data);
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  const emergencyStop = useCallback(async () => {
    try {
      await vehicleApi.emergencyStop();
      setState(prev => ({ ...prev, speed: 0, isAutonomous: false }));
    } catch (error) {
      console.error('Emergency stop failed:', error);
    }
  }, []);

  return {
    state,
    map,
    position,
    cameraFrame,
    actions: {
      toggleMode,
      emergencyStop,
      moveVehicle: handleJoystickMove,
    },
  };
}