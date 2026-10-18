import React from 'react';
import {
  Home,
  Lightbulb,
  Power,
  Zap,
  Sparkles,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  CloudSun,
  CloudRain,
  Tv,
  Speaker,
  Cast,
  Calendar,
  CalendarCheck,
  CheckSquare,
  CheckCircle2,
  Check,
  Wifi,
  WifiOff,
  Printer,
  Box,
  Gauge,
  Thermometer,
  Sliders,
  SlidersHorizontal,
  Play,
  Pause,
  Square,
  Flame,
  Fan,
  Activity,
  Layers,
  Clock,
  Settings,
  HardDrive,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Repeat,
  Shuffle,
  Music,
  Disc,
  Podcast,
  Film,
  Video,
  Radio,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Camera,
  Bell,
  BellRing,
  Coffee,
  Car,
  LayoutDashboard,
  LayoutGrid,
  Info,
  AlertCircle,
  Cpu,
  Server,
  Bluetooth,
  Droplets,
  Circle,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  // Nawigacja & System
  Home,
  HomeAssistant: Home,
  Dashboard: LayoutDashboard,
  ViewGrid: LayoutGrid,
  Settings,
  Tune: SlidersHorizontal,
  Sliders,
  Activity,
  Information: Info,
  Alert: AlertCircle,
  Sparkles,

  // Oświetlenie
  Lightbulb,
  LightbulbOutline: Lightbulb,
  LightbulbGroup: Lightbulb,
  CeilingLight: Lightbulb,
  WallSconce: Lightbulb,
  FloorLamp: Lightbulb,
  DeskLamp: Lightbulb,
  LedStrip: Lightbulb,

  // Zasilanie & Energia
  Power,
  PowerSocket: Power,
  PowerPlug: Power,
  Zap,
  Flash: Zap,
  SolarPower: Sun,
  BatteryCharging: Zap,
  BatteryHigh: Zap,
  MeterElectric: Gauge,

  // Multimedia & Audio / Video
  Tv,
  Television: Tv,
  TvRemote: Radio,
  Speaker,
  SpeakerBluetooth: Speaker,
  SpeakerGroup: Speaker,
  Radio,
  Cast,
  CastConnected: Cast,
  CastAudio: Cast,
  Play,
  Pause,
  PlayPause: Play,
  Square,
  Stop: Square,
  SkipPrevious: SkipBack,
  SkipBack,
  SkipNext: SkipForward,
  SkipForward,
  FastForward,
  Rewind,
  Repeat,
  Shuffle,
  Volume,
  Volume1,
  Volume2,
  VolumeLow: Volume,
  VolumeMedium: Volume1,
  VolumeHigh: Volume2,
  VolumeX,
  VolumeMute: VolumeX,
  VolumeMinus: Volume1,
  VolumePlus: Volume2,
  Music,
  MusicNote: Music,
  PlaylistMusic: Music,
  Album: Disc,
  Podcast,
  Film,
  Movie: Film,
  Video,
  Hdmi: Tv,
  Youtube: Play,
  Spotify: Music,
  Netflix: Film,

  // Klimat & Czujniki
  Thermometer,
  ThermometerWater: Thermometer,
  Thermostat: Thermometer,
  AirConditioner: Fan,
  Fan,
  Radiator: Flame,
  Flame,
  Fire: Flame,
  WaterPercent: Droplets,
  Droplet: Droplets,
  Gauge,

  // Czas & Pogoda
  Sun,
  Sunset,
  Sunrise,
  Moon,
  CloudSun,
  Rain: CloudRain,
  Calendar,
  CalendarCheck,
  Clock,
  CheckSquare,
  CheckCircle2,
  Check,

  // Bezpieczeństwo
  Lock,
  LockOpen: Unlock,
  Shield,
  ShieldCheck,
  Cctv: Camera,
  Camera,
  Bell,
  BellRing,
  AlarmLight: Bell,
  MotionSensor: Activity,
  DoorOpen: Unlock,
  DoorClosed: Lock,
  WindowOpen: Square,
  WindowClosed: Square,
  WindowShutter: Layers,
  Garage: Home,
  Car,
  CarElectric: Car,

  // Druk 3D & Urządzenia
  Printer,
  Printer3d: Printer,
  'printer-3d': Printer,
  RobotVacuum: Circle,
  WashingMachine: Circle,
  CoffeeMaker: Coffee,
  Box,
  Layers,

  // Hardware & Sieć
  Wifi,
  WifiOff,
  RouterWireless: Wifi,
  Ethernet: Cpu,
  Bluetooth,
  Chip: Cpu,
  Cpu,
  Memory: Cpu,
  Server,
  HardDrive,
};

// Case-insensitive & normalized map
const NORMALIZED_MAP: Record<string, LucideIcon> = {};
Object.entries(ICON_MAP).forEach(([key, icon]) => {
  NORMALIZED_MAP[key.toLowerCase()] = icon;
  NORMALIZED_MAP[key.toLowerCase().replace(/[-_]/g, '')] = icon;
});

interface IconRendererProps {
  name?: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-4 h-4', size }) => {
  if (!name) return <Activity className={className} size={size} />;
  const cleanKey = name.trim().toLowerCase();
  const IconComponent =
    ICON_MAP[name] ||
    NORMALIZED_MAP[cleanKey] ||
    NORMALIZED_MAP[cleanKey.replace(/^mdi[-:]?/, '')] ||
    Activity;

  return <IconComponent className={className} size={size} />;
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
