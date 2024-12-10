
// config.ts
export const API_CONFIG = {
  defaultPort: 8000,
  endpoints: {
    status: '/api/status',
    map: '/api/map',
    camera: '/api/camera',
    control: '/api/control',
    mode: '/api/mode',
    emergency: '/api/emergency',
  },
  timeout: 5000,
};

export const STORAGE_KEYS = {
  VEHICLE_SETTINGS: '@vehicle_settings',
};
