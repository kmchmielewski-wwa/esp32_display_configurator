export type WidgetType =
  | 'home_clock_date'
  | 'quick_slot_button'
  | 'media_single_player'
  | 'bambu_stats_overview'
  | 'toggle_button'
  | 'power_switch_card'
  | 'bambu_temperatures'
  | 'bambu_progress'
  | 'bambu_controls'
  | 'bambu_file_info'
  | 'media_player_card'
  | 'media_mini_control'
  | 'clock_weather'
  | 'sun_widget'
  | 'todo_list'
  | 'family_calendar_events'
  | 'sensor_gauge'
  | 'system_info';

export type ColorAccent = 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'orange' | 'sky';

export interface ScreenWidget {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  entityId?: string;
  secondaryEntityId?: string;
  icon?: string;
  colSpan?: 1 | 2; // 1 = half width, 2 = full width
  colorAccent?: ColorAccent;
  customConfig?: Record<string, any>;
}

export interface DisplayScreen {
  id: string;
  title: string;
  icon: string;
  widgets: ScreenWidget[];
}

export interface HAEntity {
  entity_id: string;
  name: string;
  state: string;
  domain: string;
  unit?: string;
  category: 'lights' | 'printer' | 'media' | 'calendar_sun' | 'sensors' | 'other';
}

export interface HardwarePreset {
  id: string;
  name: string;
  chip: 'esp32' | 'esp32-s3';
  board?: string;
  framework?: 'arduino' | 'esp-idf';
  usePsram?: boolean;
  resolution: { width: number; height: number };
  displayDriver: string;
  displayPlatform?: 'mipi_spi' | 'spi';
  displayModel?: string;
  touchDriver: string;
  touchTransform?: {
    swap_xy: boolean;
    mirror_x: boolean;
    mirror_y: boolean;
  };
  lvglRotation?: number;
  description: string;
  pins: {
    cs?: number;
    dc?: number;
    rst?: number;
    bl?: number;
    sck?: number;
    mosi?: number;
    miso?: number;
    touch_cs?: number;
    touch_irq?: number;
    sda?: number;
    scl?: number;
  };
}

export type DisplayTheme = 'dark_modern' | 'olive_green' | 'cyber_amber' | 'emerald_synth' | 'oled_black';
export type DisplayEngine = 'lvgl' | 'display_page';

export interface NightModeConfig {
  enabled: boolean;
  startHour: number;   // np. 23 (23:00)
  startMinute: number; // np. 00
  endHour: number;     // np. 6 (06:00)
  endMinute: number;   // np. 30
  wakeOnTouch?: boolean;
  completelyOff?: boolean; // Całkowite wyłączenie ekranu (100% czarny ekran, bez żadnych informacji czy napisów)
}

export interface ConfigProfile {
  id: string;
  name: string;
  hardwarePresetId: string;
  orientation: 'landscape' | 'portrait';
  theme: DisplayTheme;
  engine: DisplayEngine;
  displayTimeoutSec: number;
  useSecrets: boolean;
  secretNames: {
    wifiSsid: string;
    wifiPassword: string;
    haApiKey: string;
  };
  actualCredentials: {
    wifiSsid: string;
    wifiPassword: string;
    haApiKey: string;
  };
  wifiSsid: string;
  wifiPassword?: string;
  haApiPassword?: string;
  screens: DisplayScreen[];
  nightMode?: NightModeConfig;
}
