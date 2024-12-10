// types.ts
export interface VehicleState {
  isAutonomous: boolean;
  isConnected: boolean;
  speed: number;
}

export interface VehiclePosition {
  x: number;
  y: number;
  orientation: number;
}

export interface JoystickData {
  angle: number;
  distance: number;
}

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
};