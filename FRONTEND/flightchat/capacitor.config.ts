import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'flightchat',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'body'  // También puedes probar con 'native' si tienes problemas
    }
  }
};

export default config;
