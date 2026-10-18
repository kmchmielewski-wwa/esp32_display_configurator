import React from 'react';
import { getMdiChar } from '../utils/mdiHelper';

interface IconRendererProps {
  name?: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = 'w-4 h-4',
  size,
}) => (
  <span
    aria-hidden="true"
    className={`inline-flex items-center justify-center leading-none ${className}`}
    style={{
      fontFamily: '"Material Design Icons", sans-serif',
      ...(size !== undefined ? { fontSize: size, width: size, height: size } : {}),
    }}
  >
    {getMdiChar(name)}
  </span>
);

export const AVAILABLE_ICONS = [
  'Home', 'HomeAssistant', 'Dashboard', 'ViewGrid', 'Settings', 'Tune',
  'Sliders', 'Activity', 'Information', 'Alert', 'Sparkles', 'Lightbulb',
  'LightbulbOutline', 'LightbulbGroup', 'CeilingLight', 'WallSconce', 'FloorLamp', 'DeskLamp',
  'LedStrip', 'Power', 'PowerSocket', 'PowerPlug', 'Zap', 'Flash',
  'SolarPower', 'BatteryCharging', 'BatteryHigh', 'MeterElectric', 'Tv', 'Television',
  'TvRemote', 'Speaker', 'SpeakerBluetooth', 'SpeakerGroup', 'Radio', 'Cast',
  'CastConnected', 'CastAudio', 'Play', 'Pause', 'PlayPause', 'Square',
  'Stop', 'SkipPrevious', 'SkipBack', 'SkipNext', 'SkipForward', 'FastForward',
  'Rewind', 'Repeat', 'Shuffle', 'Volume', 'Volume1', 'Volume2',
  'VolumeLow', 'VolumeMedium', 'VolumeHigh', 'VolumeX', 'VolumeMute', 'VolumeMinus',
  'VolumePlus', 'Music', 'MusicNote', 'PlaylistMusic', 'Album', 'Podcast',
  'Film', 'Movie', 'Video', 'Hdmi', 'Youtube', 'Spotify',
  'Netflix', 'Thermometer', 'ThermometerWater', 'Thermostat', 'AirConditioner', 'Fan',
  'Radiator', 'Flame', 'Fire', 'WaterPercent', 'Droplet', 'Gauge',
  'Sun', 'Sunset', 'Sunrise', 'Moon', 'CloudSun', 'Rain',
  'Calendar', 'CalendarCheck', 'Clock', 'CheckSquare', 'CheckCircle2', 'Check',
  'Lock', 'LockOpen', 'Shield', 'ShieldCheck', 'Cctv', 'Camera',
  'Bell', 'BellRing', 'AlarmLight', 'MotionSensor', 'DoorOpen', 'DoorClosed',
  'WindowOpen', 'WindowClosed', 'WindowShutter', 'Garage', 'Car', 'CarElectric',
  'Printer', 'Printer3d', 'printer-3d', 'RobotVacuum', 'WashingMachine', 'CoffeeMaker',
  'Box', 'Layers', 'Wifi', 'WifiOff', 'RouterWireless', 'Ethernet',
  'Bluetooth', 'Chip', 'Cpu', 'Memory', 'Server', 'HardDrive',
  'LightbulbOn', 'LightbulbOnOutline', 'LightbulbOff', 'LightbulbOffOutline', 'LightbulbAuto',
  'LightbulbGroupOff', 'LightbulbMultiple', 'LightbulbMultipleOutline', 'LightbulbMultipleOff',
  'CeilingLightOutline', 'CeilingLightMultiple', 'FloorLampDual', 'FloorLampTorchiere',
  'FloorLampTorchiereVariant', 'WallSconceFlat', 'Chandelier', 'Lamp', 'LampOutline', 'Lamps',
  'LedStripVariant', 'LedStripVariantOff', 'LightRecessed', 'CoachLamp', 'OutdoorLamp',
  'StringLights', 'StringLightsOff', 'LightSwitch', 'LightSwitchOff', 'ToggleSwitch',
  'ToggleSwitchOff', 'Brightness5', 'Brightness6', 'Brightness7', 'ThemeLightDark',
  'HomeLightbulb', 'GlobeLight', 'SpotlightBeam', 'LightFloodDown',
  'TelevisionClassic', 'TelevisionBox', 'TelevisionClassicOff', 'TelevisionOff',
  'TelevisionSpeaker', 'TelevisionGuide', 'RemoteTv', 'RemoteTvOff', 'ProjectorScreen',
  'ProjectorScreenOff', 'SpeakerWireless', 'SpeakerOff', 'Soundbar', 'HeadphonesBluetooth',
  'DiscPlayer', 'MusicBox', 'MusicBoxMultiple', 'MusicNoteOff', 'MusicNoteBluetooth',
  'MusicOff', 'PlaylistPlay', 'RadioTower', 'CastAudioVariant', 'CastOff', 'CastVariant',
  'AudioVideo', 'AudioVideoOff', 'VideoInputHdmi', 'VideoInputAntenna',
];
