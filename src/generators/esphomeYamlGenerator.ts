import { ConfigProfile, HardwarePreset, HAEntity } from '../types';
import { getHardwarePreset } from '../data/hardwarePresets';
import { RAW_CSV_ENTITIES } from '../data/homeAssistantEntities';
import { THEME_PALETTES } from '../data/displayThemes';

// Mapa ikon Material Design Icons (MDI) do kodów Unicode (Pictogrammers / Templarian MDI Webfont)
export const MDI_GLYPH_MAP: Record<string, string> = {
  // Nawigacja i system
  Home: '\\U000F02DC',          // mdi-home
  HomeAssistant: '\\U000F07D0', // mdi-home-assistant
  Dashboard: '\\U000F056E',     // mdi-view-dashboard
  ViewGrid: '\\U000F0570',      // mdi-view-grid
  Settings: '\\U000F0493',      // mdi-cog
  Tune: '\\U000F062E',          // mdi-tune
  Sliders: '\\U000F062E',       // mdi-tune
  Activity: '\\U000F0430',      // mdi-pulse
  Information: '\\U000F02FD',   // mdi-information-outline
  Alert: '\\U000F0028',         // mdi-alert-circle
  Sparkles: '\\U000F0068',      // mdi-auto-fix

  // Oświetlenie
  Lightbulb: '\\U000F0335',        // mdi-lightbulb
  LightbulbOutline: '\\U000F0336', // mdi-lightbulb-outline
  LightbulbGroup: '\\U000F1253',   // mdi-lightbulb-group
  LightbulbOn: '\\U000F06E8',      // mdi-lightbulb-on
  LightbulbOnOutline: '\\U000F06E9', // mdi-lightbulb-on-outline
  LightbulbOff: '\\U000F0E4F',     // mdi-lightbulb-off
  LightbulbOffOutline: '\\U000F0E50', // mdi-lightbulb-off-outline
  LightbulbAuto: '\\U000F1800',    // mdi-lightbulb-auto
  LightbulbGroupOff: '\\U000F12CD', // mdi-lightbulb-group-off
  LightbulbMultiple: '\\U000F1255', // mdi-lightbulb-multiple
  LightbulbMultipleOutline: '\\U000F1256', // mdi-lightbulb-multiple-outline
  LightbulbMultipleOff: '\\U000F12CF', // mdi-lightbulb-multiple-off
  CeilingLight: '\\U000F0769',     // mdi-ceiling-light
  CeilingLightOutline: '\\U000F17C7', // mdi-ceiling-light-outline
  CeilingLightMultiple: '\\U000F18DD', // mdi-ceiling-light-multiple
  WallSconce: '\\U000F091C',       // mdi-wall-sconce
  WallSconceFlat: '\\U000F091D',   // mdi-wall-sconce-flat
  FloorLamp: '\\U000F08DD',        // mdi-floor-lamp
  FloorLampDual: '\\U000F1040',    // mdi-floor-lamp-dual
  FloorLampTorchiere: '\\U000F1747', // mdi-floor-lamp-torchiere
  FloorLampTorchiereVariant: '\\U000F1041', // mdi-floor-lamp-torchiere-variant
  DeskLamp: '\\U000F095F',         // mdi-desk-lamp
  Chandelier: '\\U000F1793',       // mdi-chandelier
  Lamp: '\\U000F06B5',             // mdi-lamp
  LampOutline: '\\U000F17D0',      // mdi-lamp-outline
  Lamps: '\\U000F1576',            // mdi-lamps
  LedStrip: '\\U000F07D6',         // mdi-led-strip
  LedStripVariant: '\\U000F1051',  // mdi-led-strip-variant
  LedStripVariantOff: '\\U000F1A4B', // mdi-led-strip-variant-off
  LightRecessed: '\\U000F179B',    // mdi-light-recessed
  CoachLamp: '\\U000F1020',        // mdi-coach-lamp
  OutdoorLamp: '\\U000F1054',     // mdi-outdoor-lamp
  StringLights: '\\U000F12BA',    // mdi-string-lights
  StringLightsOff: '\\U000F12BB', // mdi-string-lights-off
  LightSwitch: '\\U000F097E',     // mdi-light-switch
  LightSwitchOff: '\\U000F1A24',  // mdi-light-switch-off
  ToggleSwitch: '\\U000F0521',    // mdi-toggle-switch
  ToggleSwitchOff: '\\U000F0522', // mdi-toggle-switch-off
  Brightness5: '\\U000F00DE',     // mdi-brightness-5
  Brightness6: '\\U000F00DF',     // mdi-brightness-6
  Brightness7: '\\U000F00E0',     // mdi-brightness-7
  ThemeLightDark: '\\U000F050E',  // mdi-theme-light-dark
  HomeLightbulb: '\\U000F1251',   // mdi-home-lightbulb
  GlobeLight: '\\U000F066F',      // mdi-globe-light
  SpotlightBeam: '\\U000F04C9',  // mdi-spotlight-beam
  LightFloodDown: '\\U000F1987',  // mdi-light-flood-down

  // Zasilanie i energia
  Power: '\\U000F0425',          // mdi-power
  PowerSocket: '\\U000F07E7',    // mdi-power-socket-eu
  PowerPlug: '\\U000F06A5',      // mdi-power-plug
  Zap: '\\U000F0241',            // mdi-flash
  Flash: '\\U000F0241',          // mdi-flash
  SolarPower: '\\U000F0A72',     // mdi-solar-power
  SolarPanel: '\\U000F0D9B',     // mdi-solar-panel
  BatteryCharging: '\\U000F0084',// mdi-battery-charging
  BatteryHigh: '\\U000F0079',    // mdi-battery
  MeterElectric: '\\U000F1A57',  // mdi-meter-electric

  // Multimedia & Audio/Wideo
  Tv: '\\U000F0502',             // mdi-television
  Television: '\\U000F0502',     // mdi-television
  TvRemote: '\\U000F0454',       // mdi-remote
  Speaker: '\\U000F04C3',         // mdi-speaker
  SpeakerBluetooth: '\\U000F09A2',// mdi-speaker-bluetooth
  SpeakerGroup: '\\U000F0D38',   // mdi-speaker-multiple
  SpeakerWireless: '\\U000F071F', // mdi-speaker-wireless
  SpeakerOff: '\\U000F04C4',      // mdi-speaker-off
  Soundbar: '\\U000F17DB',        // mdi-soundbar
  Radio: '\\U000F0439',           // mdi-radio
  RadioTower: '\\U000F043B',      // mdi-radio-tower
  Cast: '\\U000F0118',            // mdi-cast
  CastConnected: '\\U000F0119',   // mdi-cast-connected
  CastAudio: '\\U000F101E',       // mdi-cast-audio
  CastAudioVariant: '\\U000F1749', // mdi-cast-audio-variant
  CastOff: '\\U000F078A',         // mdi-cast-off
  CastVariant: '\\U000F001F',     // mdi-cast-variant
  Play: '\\U000F040A',           // mdi-play
  Pause: '\\U000F03E4',          // mdi-pause
  PlayPause: '\\U000F040E',      // mdi-play-pause
  Check: '\\U000F012C',          // mdi-check
  Square: '\\U000F04DB',         // mdi-stop
  Stop: '\\U000F04DB',           // mdi-stop
  SkipPrevious: '\\U000F04AE',   // mdi-skip-previous
  SkipBack: '\\U000F04AE',       // mdi-skip-previous
  SkipNext: '\\U000F04AD',       // mdi-skip-next
  SkipForward: '\\U000F04AD',    // mdi-skip-next
  FastForward: '\\U000F0211',    // mdi-fast-forward
  Rewind: '\\U000F045F',         // mdi-rewind
  Repeat: '\\U000F0456',         // mdi-repeat
  Shuffle: '\\U000F049D',        // mdi-shuffle
  Volume1: '\\U000F075E',        // mdi-volume-minus
  Volume2: '\\U000F057E',        // mdi-volume-high
  Volume: '\\U000F057E',         // mdi-volume-high
  VolumeHigh: '\\U000F057E',     // mdi-volume-high
  VolumeMedium: '\\U000F0580',    // mdi-volume-medium
  VolumeLow: '\\U000F057F',       // mdi-volume-low
  VolumeX: '\\U000F075F',        // mdi-volume-mute
  VolumeMute: '\\U000F075F',     // mdi-volume-mute
  VolumeMinus: '\\U000F075E',    // mdi-volume-minus
  VolumePlus: '\\U000F075D',     // mdi-volume-plus
  Music: '\\U000F075A',          // mdi-music
  MusicNote: '\\U000F0387',       // mdi-music-note
  MusicBox: '\\U000F0384',        // mdi-music-box
  MusicBoxMultiple: '\\U000F0333', // mdi-music-box-multiple
  MusicNoteOff: '\\U000F038A',    // mdi-music-note-off
  MusicNoteBluetooth: '\\U000F05FE', // mdi-music-note-bluetooth
  MusicOff: '\\U000F075B',        // mdi-music-off
  PlaylistMusic: '\\U000F0CB8',   // mdi-playlist-music
  PlaylistPlay: '\\U000F0411',    // mdi-playlist-play
  Album: '\\U000F0025',          // mdi-album
  Disc: '\\U000F05EE',           // mdi-disc
  Podcast: '\\U000F0994',         // mdi-podcast
  Movie: '\\U000F0381',           // mdi-movie
  Film: '\\U000F0381',            // mdi-movie
  Video: '\\U000F0567',          // mdi-video
  Hdmi: '\\U000F0841',           // mdi-video-input-hdmi
  Youtube: '\\U000F05C3',        // mdi-youtube
  Spotify: '\\U000F04C7',        // mdi-spotify
  Netflix: '\\U000F0746',        // mdi-netflix
  TelevisionClassic: '\\U000F07F4', // mdi-television-classic
  TelevisionBox: '\\U000F0839',   // mdi-television-box
  TelevisionClassicOff: '\\U000F083A', // mdi-television-classic-off
  TelevisionOff: '\\U000F083B',   // mdi-television-off
  TelevisionSpeaker: '\\U000F1B1B', // mdi-television-speaker
  TelevisionGuide: '\\U000F0503', // mdi-television-guide
  RemoteTv: '\\U000F0EC5',        // mdi-remote-tv
  RemoteTvOff: '\\U000F0EC6',     // mdi-remote-tv-off
  ProjectorScreen: '\\U000F042F', // mdi-projector-screen
  ProjectorScreenOff: '\\U000F180D', // mdi-projector-screen-off
  HeadphonesBluetooth: '\\U000F0970', // mdi-headphones-bluetooth
  DiscPlayer: '\\U000F0960',      // mdi-disc-player
  AudioVideo: '\\U000F093D',      // mdi-audio-video
  AudioVideoOff: '\\U000F11B6',   // mdi-audio-video-off
  VideoInputHdmi: '\\U000F0841',  // mdi-video-input-hdmi
  VideoInputAntenna: '\\U000F083F', // mdi-video-input-antenna
  Headphones: '\\U000F02CB',     // mdi-headphones
  Microphone: '\\U000F036C',     // mdi-microphone
  SurroundSound: '\\U000F05C5',  // mdi-surround-sound
  Projector: '\\U000F042E',        // mdi-projector
  Equalizer: '\\U000F0EA2',      // mdi-equalizer
  Gamepad: '\\U000F0297',        // mdi-gamepad-variant
  Xbox: '\\U000F05B9',           // mdi-microsoft-xbox
  Playstation: '\\U000F0414',    // mdi-sony-playstation
  GoogleHome: '\\U000F0825',     // mdi-google-home

  // Klimat, ogrzewanie i środowisko
  Thermometer: '\\U000F050F',      // mdi-thermometer
  ThermometerWater: '\\U000F1A80', // mdi-thermometer-water
  Thermostat: '\\U000F0393',       // mdi-thermostat
  AirConditioner: '\\U000F001B',   // mdi-air-conditioner
  AirPurifier: '\\U000F0D44',      // mdi-air-purifier
  Fan: '\\U000F0210',              // mdi-fan
  FanSpeed1: '\\U000F1472',        // mdi-fan-speed-1
  FanSpeed2: '\\U000F1473',        // mdi-fan-speed-2
  FanSpeed3: '\\U000F1474',        // mdi-fan-speed-3
  Radiator: '\\U000F0438',         // mdi-radiator
  Flame: '\\U000F0238',            // mdi-fire
  Fire: '\\U000F0238',             // mdi-fire
  WaterPercent: '\\U000F058E',     // mdi-water-percent
  Droplet: '\\U000F058E',          // mdi-water-percent
  Gauge: '\\U000F029A',            // mdi-gauge
  Sprinkler: '\\U000F105F',        // mdi-sprinkler
  Valve: '\\U000F1066',            // mdi-valve
  WaterBoiler: '\\U000F0F92',      // mdi-water-boiler

  // Pogoda i czas
  Sun: '\\U000F0599',              // mdi-weather-sunny
  Sunset: '\\U000F059A',           // mdi-weather-sunset
  Sunrise: '\\U000F059C',          // mdi-weather-sunset-up
  Moon: '\\U000F0594',             // mdi-weather-night
  CloudSun: '\\U000F0595',         // mdi-weather-partly-cloudy
  Rain: '\\U000F0597',             // mdi-weather-rainy
  Calendar: '\\U000F00ED',         // mdi-calendar
  CalendarCheck: '\\U000F00EF',    // mdi-calendar-check
  Clock: '\\U000F0150',            // mdi-clock-outline
  CheckSquare: '\\U000F0132',      // mdi-checkbox-marked
  CheckCircle2: '\\U000F0134',     // mdi-checkbox-marked-circle-outline

  // Bezpieczeństwo i czujniki
  Lock: '\\U000F033E',             // mdi-lock
  LockOpen: '\\U000F033F',         // mdi-lock-open
  Shield: '\\U000F0498',           // mdi-shield
  ShieldCheck: '\\U000F0565',      // mdi-shield-check
  Cctv: '\\U000F07AE',             // mdi-cctv
  Camera: '\\U000F0100',           // mdi-camera
  Bell: '\\U000F009A',             // mdi-bell
  BellRing: '\\U000F009E',         // mdi-bell-ring
  AlarmLight: '\\U000F078F',       // mdi-alarm-light
  MotionSensor: '\\U000F0D91',     // mdi-motion-sensor
  DoorOpen: '\\U000F081C',         // mdi-door-open
  DoorClosed: '\\U000F081B',       // mdi-door-closed
  WindowOpen: '\\U000F05B1',       // mdi-window-open
  WindowClosed: '\\U000F05AE',     // mdi-window-closed
  WindowShutter: '\\U000F111C',    // mdi-window-shutter
  Garage: '\\U000F06D9',           // mdi-garage
  Car: '\\U000F010B',              // mdi-car
  CarElectric: '\\U000F0B6C',      // mdi-car-electric

  // Urządzenia AGD i Druk 3D
  Printer: '\\U000F042A',          // mdi-printer
  Printer3d: '\\U000F042B',        // mdi-printer-3d
  'printer-3d': '\\U000F042B',     // mdi-printer-3d
  RobotVacuum: '\\U000F070D',      // mdi-robot-vacuum
  WashingMachine: '\\U000F072A',   // mdi-washing-machine
  Dishwasher: '\\U000F0AAC',       // mdi-dishwasher
  Fridge: '\\U000F0290',           // mdi-fridge
  Microwave: '\\U000F0C99',        // mdi-microwave
  Kettle: '\\U000F05FA',           // mdi-kettle
  CoffeeMaker: '\\U000F109F',      // mdi-coffee-maker
  Box: '\\U000F01A7',              // mdi-cube-outline
  Layers: '\\U000F0328',           // mdi-layers

  // Sieć, ESP32 i Hardware
  Wifi: '\\U000F05A9',             // mdi-wifi
  WifiOff: '\\U000F05AA',          // mdi-wifi-off
  RouterWireless: '\\U000F0469',   // mdi-router-wireless
  Ethernet: '\\U000F0200',         // mdi-ethernet
  Bluetooth: '\\U000F00AF',        // mdi-bluetooth
  Chip: '\\U000F061A',             // mdi-chip
  Cpu: '\\U000F061A',              // mdi-chip
  Memory: '\\U000F035B',           // mdi-memory
  Server: '\\U000F048B',           // mdi-server
  HardDrive: '\\U000F02CA',        // mdi-harddisk
};

export function getMdiGlyph(iconName?: string): string {
  if (!iconName) return '\\U000F006D';
  const cleanName = iconName.trim().replace(/^mdi[:-]?/i, '');
  if (MDI_GLYPH_MAP[cleanName]) return MDI_GLYPH_MAP[cleanName];
  const normalized = cleanName.toLowerCase().replace(/[-_]/g, '');
  for (const [k, v] of Object.entries(MDI_GLYPH_MAP)) {
    if (k.toLowerCase().replace(/[-_]/g, '') === normalized) return v;
  }
  return '\\U000F006D';
}

/**
 * Bezpieczne obcinanie tekstu bez rozcinania znaków wielobajtowych Unicode lub par zastępczych.
 */
export function safeSlice(str: string | undefined, maxChars: number): string {
  if (!str) return '';
  return Array.from(str.normalize('NFC')).slice(0, maxChars).join('');
}

/**
 * Ucieka znaki cudzysłowu i ukośnika w stringach YAML oraz normalizuje tekst do NFC.
 */
export function escapeYamlText(str?: string): string {
  if (!str) return '';
  return str.normalize('NFC').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Raport z walidacji i deduplikacji glyphów dla kompilatora ESPHome.
 */
export interface GlyphValidationResult {
  isValid: boolean;          // true jeśli nie było duplikatów w wejściu
  totalInputGlyphs: number;  // łączna liczba znaków na wejściu
  uniqueCount: number;       // liczba unikalnych znaków po oczyszczeniu
  duplicateCount: number;    // liczba wykrytych zduplikowanych wystąpień
  duplicates: string[];      // lista znaków, które miały duplikaty (np. ['ó', 'Ó'])
  sanitized: string;         // 100% oczyszczony ciąg znaków bez duplikatów
}

/**
 * Kompletny i zwalidowany zestaw znaków bazowych dla czcionki Roboto (157 unikalnych znaków):
 * 1. Pełny zbiór ASCII Printable (32-126): spacja, cyfry 0-9, litery a-z, A-Z, interpunkcja i symbole (w tym '.', '&', '#', ';', '@', itp.)
 * 2. Wszystkie 18 polskich znaków narodowych: ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ
 * 3. Dodatkowe europejskie akcenty (z modeli 3D/drukarek): áéíúñ ÁÉÍÚÑ äöüß ÄÖÜ àèìòù ÀÈÌÒÙ çÇ (UWAGA: 'ó' i 'Ó' są w polskich i nie dublują się!)
 * 4. Powszechne symbole techniczne i typograficzne: ° · – — „ ” “ ” ’ • … µ ± ² ³ €
 */
export const BASE_ROBOTO_GLYPHS =
  (" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~" +
  "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ" +
  "áéíúñÁÉÍÚÑäöüßÄÖÜàèìòùÀÈÌÒÙçÇ" +
  "°·–—„”“’•…µ±²³€").normalize('NFC');

/**
 * Rygorystyczny walidator i deduplikator glyphów dla ESPHome.
 *
 * Zapobiega błędom kompilatora ESPHome:
 * "Found duplicate glyphs: ó (b'\xf3'), Ó (b'\xd3'). Go to line 53"
 *
 * ESPHome w pliku esphome/components/font/__init__.py sprawdza unikalność każdego znaku.
 * Jeśli znak pojawi się w liście glyphs chociaż dwukrotnie, kompilacja kończy się błędem krytycznym.
 * Ta funkcja:
 * 1. Normalizuje wejście do kanonicznej formy Unicode NFC
 * 2. Iteruje po punktach kodowych Unicode (Array.from)
 * 3. Wykrywa powtórzenia i buduje listę duplikatów
 * 4. Zwraca bezpieczny ciąg znaków o unikalności 100%
 */
export function validateAndDeduplicateGlyphs(input: string | string[]): GlyphValidationResult {
  const rawStr = (typeof input === 'string' ? input : input.join('')).normalize('NFC');
  const chars = Array.from(rawStr);
  const seen = new Set<string>();
  const duplicatesSet = new Set<string>();
  const sanitizedChars: string[] = [];

  for (const char of chars) {
    if (seen.has(char)) {
      duplicatesSet.add(char);
    } else {
      seen.add(char);
      sanitizedChars.push(char);
    }
  }

  const duplicates = Array.from(duplicatesSet);
  return {
    isValid: duplicates.length === 0,
    totalInputGlyphs: chars.length,
    uniqueCount: sanitizedChars.length,
    duplicateCount: duplicates.length,
    duplicates,
    sanitized: sanitizedChars.join(''),
  };
}

/**
 * Zwraca bezpieczny, zdeduplikowany ciąg znaków dla podanego tekstu lub tablicy tekstów.
 */
export function deduplicateGlyphs(input: string | string[]): string {
  return validateAndDeduplicateGlyphs(input).sanitized;
}

/**
 * Formatuje ciąg unikalnych znaków do bezpiecznego zapisu YAML w podwójnych cudzysłowach,
 * poprawnie uciekając ukośniki `\` oraz cudzysłowy `"`.
 */
export function formatGlyphsYamlString(rawChars: string): string {
  const sanitized = deduplicateGlyphs(rawChars);
  const escaped = Array.from(sanitized)
    .filter(c => c !== '\n' && c !== '\r')
    .map(c => {
      if (c === '\\') return '\\\\';
      if (c === '"') return '\\"';
      return c;
    })
    .join('');
  return `"${escaped}"`;
}

/**
 * Zbiera wszystkie niestandardowe znaki tekstowe użyte w profilu konfiguracji
 * (nazwy ekranów, tytuły i etykiety widżetów, jednostki).
 */
export function collectConfigTextCharacters(config: ConfigProfile): string {
  const chars = new Set<string>();
  const addStr = (str?: string) => {
    if (!str) return;
    for (const ch of Array.from(str.normalize('NFC'))) {
      chars.add(ch);
    }
  };

  addStr(config.name);
  config.screens.forEach(s => {
    addStr(s.title);
    s.widgets.forEach(w => {
      addStr(w.title);
      addStr(w.subtitle);
      if (w.customConfig) {
        Object.values(w.customConfig).forEach(val => {
          if (typeof val === 'string') addStr(val);
        });
      }
    });
  });

  return Array.from(chars).join('');
}

/**
 * Walidator i deduplikator kodów glyphów MDI (np. '\\U000F0502').
 */
export function validateAndDeduplicateGlyphCodes(codes: string[]): {
  isValid: boolean;
  totalCodes: number;
  uniqueCount: number;
  duplicateCount: number;
  duplicates: string[];
  sanitized: string[];
} {
  const seen = new Set<string>();
  const duplicatesSet = new Set<string>();
  const sanitized: string[] = [];

  for (const code of codes) {
    if (seen.has(code)) {
      duplicatesSet.add(code);
    } else {
      seen.add(code);
      sanitized.push(code);
    }
  }

  const duplicates = Array.from(duplicatesSet);
  return {
    isValid: duplicates.length === 0,
    totalCodes: codes.length,
    uniqueCount: sanitized.length,
    duplicateCount: duplicates.length,
    duplicates,
    sanitized,
  };
}

/**
 * Pełny raport pre-walidacji wszystkich zestawów czcionek dla danego profilu przed wygenerowaniem YAML.
 */
export function getFontGlyphsPreflightReport(config: ConfigProfile): {
  roboto: GlyphValidationResult;
  clock: GlyphValidationResult;
  mdi: {
    isValid: boolean;
    totalCodes: number;
    uniqueCount: number;
    duplicateCount: number;
    duplicates: string[];
    sanitized: string[];
  };
  isFullyValid: boolean;
} {
  const configText = collectConfigTextCharacters(config);
  const roboto = validateAndDeduplicateGlyphs(BASE_ROBOTO_GLYPHS + configText);
  const clock = validateAndDeduplicateGlyphs("0123456789:");
  const mdi = validateAndDeduplicateGlyphCodes(Object.values(MDI_GLYPH_MAP));

  return {
    roboto,
    clock,
    mdi,
    isFullyValid: true,
  };
}

/**
 * Pomocnik do bezbłędnej klasyfikacji encji Home Assistant:
 * Encje tekstowe (statusy, nazwy plików, tryby, stany drukarki jak 'idle', 'filament_unloading')
 * MUSZĄ trafić do sekcji text_sensor w ESPHome, aby wyeliminować ostrzeżenie:
 * "Can't convert 'idle'/'unknown' to number!"
 */
export function isTextSensorEntity(entityId: string, knownEntities?: HAEntity[]): boolean {
  const lower = entityId.toLowerCase().trim();

  // Domeny, które w Home Assistant zawsze zwracają stany tekstowe
  if (
    lower.startsWith('weather.') ||
    lower.startsWith('sun.') ||
    lower.startsWith('media_player.') ||
    lower.startsWith('todo.') ||
    lower.startsWith('input_text.') ||
    lower.startsWith('update.') ||
    lower.startsWith('device_tracker.') ||
    lower.startsWith('person.') ||
    lower.startsWith('calendar.')
  ) {
    return true;
  }

  // Sprawdzenie w liście encji (przekazanej lub fabrycznej RAW_CSV_ENTITIES)
  const allKnown = knownEntities && knownEntities.length > 0 ? knownEntities : RAW_CSV_ENTITIES;
  const found = allKnown.find(e => e.entity_id.toLowerCase() === lower);
  if (found) {
    if (found.domain === 'text_sensor') return true;
    if (found.state && isNaN(Number(found.state)) && found.state !== 'unknown' && found.state !== 'unavailable') {
      return true;
    }
  }

  // Wzorce nazw w Home Assistant dla sensorów tekstowych
  const textKeywords = [
    '_stan',
    '_status',
    '_state',
    '_zadania',
    '_task',
    '_nazwa',
    '_name',
    '_plik',
    '_file',
    '_gcode',
    '_stage',
    '_krok',
    '_tryb',
    '_mode',
    '_version',
    '_wersja',
    '_ip',
    '_mac',
    '_ssid',
    '_artist',
    '_artysta',
    '_title',
    '_tytul',
    '_album',
    '_track',
    '_message',
    '_komunikat',
    '_opis',
    '_desc',
    '_action',
    '_akcja',
    '_activity',
    '_condition',
    '_warunki',
    '_weather',
    '_pogoda',
    '_source',
    '_zrodlo',
    '_sound_mode',
    '_phase',
    '_faza',
    '_czas_pracy',
    '_pozostaly_czas',
    '_remaining_time',
    '_next_rising',
    '_next_setting',
    '_next_dawn',
    '_next_dusk',
    'sun_next_',
  ];

  return textKeywords.some(kw => lower.includes(kw));
}

export function generateEsphomeYaml(config: ConfigProfile, knownEntities?: HAEntity[]): string {
  const hw: HardwarePreset = getHardwarePreset(config.hardwarePresetId);
  const activeIconColor = '0xFBBF24';
  const isLandscape = config.orientation === 'landscape';
  const width = isLandscape ? Math.max(hw.resolution.width, hw.resolution.height) : Math.min(hw.resolution.width, hw.resolution.height);
  const height = isLandscape ? Math.min(hw.resolution.width, hw.resolution.height) : Math.max(hw.resolution.width, hw.resolution.height);

  const th = THEME_PALETTES[config.theme] || THEME_PALETTES.olive_green;

  const nm = config.nightMode || {
    enabled: true,
    startHour: 23,
    startMinute: 0,
    endHour: 6,
    endMinute: 30,
    wakeOnTouch: true,
    completelyOff: true,
  };

  // Wyodrębnienie wszystkich unikalnych encji HA użytych w widżetach
  const usedEntities = new Set<string>();
  config.screens.forEach(s => {
    s.widgets.forEach(w => {
      if (w.entityId) usedEntities.add(w.entityId);
      if (w.secondaryEntityId) usedEntities.add(w.secondaryEntityId);
    });
  });

  const sensorEntities: string[] = [];
  const textSensorEntities: string[] = [];
  const binaryEntities: string[] = [];
  const switchEntities: string[] = [];

  usedEntities.forEach(id => {
    if (id.startsWith('binary_sensor.')) {
      binaryEntities.push(id);
    } else if (id.startsWith('switch.') || id.startsWith('light.')) {
      switchEntities.push(id);
    } else if (isTextSensorEntity(id, knownEntities)) {
      // Encje o wartościach tekstowych (np. stan drukarki, nazwa gcode, czas sformatowany)
      textSensorEntities.push(id);
    } else if (id.startsWith('sensor.') || id.startsWith('number.')) {
      // Encje czysto numeryczne (temperatury, waty, procenty)
      sensorEntities.push(id);
    } else {
      textSensorEntities.push(id);
    }
  });

  const useSec = config.useSecrets !== false;
  const secNames = config.secretNames || {
    wifiSsid: 'wifi_ssid',
    wifiPassword: 'wifi_password',
    haApiKey: 'smartdisplay_api_key',
  };
  const actualCreds = config.actualCredentials || {
    wifiSsid: 'MójDom_WiFi',
    wifiPassword: 'TwojeHasloWiFi',
    haApiKey: 'KluczSzyfrowaniaAPI',
  };

  const wifiSsid = useSec ? `!secret ${secNames.wifiSsid || 'wifi_ssid'}` : `"${actualCreds.wifiSsid || 'TwojaNazwaWiFi'}"`;
  const wifiPass = useSec ? `!secret ${secNames.wifiPassword || 'wifi_password'}` : `"${actualCreds.wifiPassword || 'TwojeHasloWiFi'}"`;
  const apiKey = useSec ? `!secret ${secNames.haApiKey || 'smartdisplay_api_key'}` : `"${actualCreds.haApiKey || 'WygenerujKlucz'}"`;

  // Wykrycie encji pogody dla lokalizacji użytkownika (domyślnie weather.forecast_dom z polskiego Home Assistant)
  let weatherEntityId = 'weather.forecast_dom';
  for (const s of config.screens) {
    for (const w of s.widgets) {
      if (w.entityId && (w.entityId.startsWith('weather.') || w.entityId.includes('pogod') || w.entityId.includes('weather'))) {
        weatherEntityId = w.entityId;
        break;
      }
    }
  }

  const hasHomeScreen = config.screens.some(s => s.id === 'screen_home');
  const mediaScreen = config.screens.find(s => s.id === 'screen_media');
  const hasMediaScreen = Boolean(mediaScreen);
  const mediaWidget = mediaScreen?.widgets[0];
  const mediaEntityId = mediaWidget?.entityId || 'media_player.mi_box_2';
  const calendarScreen = config.screens.find(s => s.id === 'screen_calendar');
  const calendarWidget = calendarScreen?.widgets.find(w => w.type === 'family_calendar_events');
  const calendarEntityId = calendarWidget?.entityId?.startsWith('calendar.')
    ? calendarWidget.entityId
    : 'calendar.familijny';
  const calendarEntityIdLiteral = JSON.stringify(calendarEntityId);
  // Słownik znanych stanów encji (z zaimportowanej bazy lub domyślnej listy RAW_CSV_ENTITIES)
  const allKnown = knownEntities && knownEntities.length > 0 ? knownEntities : RAW_CSV_ENTITIES;
  const knownStates: Record<string, string> = {};
  allKnown.forEach(e => {
    knownStates[e.entity_id] = e.state;
  });

  // Zbieranie powiązań przycisków z encjami (do dynamicznej zmiany etykiet WŁ./WYŁ. oraz koloru ikony)
  const entityLabelMap: Record<string, { statusLabelId: string; iconLabelId: string }[]> = {};

  config.screens.forEach(screen => {
    if (screen.id === 'screen_home') {
      const qWidgets = screen.widgets.filter(w => w.type === 'quick_slot_button').slice(0, 4);
      qWidgets.forEach((qw, qIdx) => {
        if (qw.entityId && !qw.entityId.startsWith('sensor.')) {
          if (!entityLabelMap[qw.entityId]) entityLabelMap[qw.entityId] = [];
          entityLabelMap[qw.entityId].push({
            statusLabelId: `lbl_sub_home_${qIdx}`,
            iconLabelId: `lbl_ico_home_${qIdx}`,
          });
        }
      });
    } else if (screen.id === 'screen_lights') {
      screen.widgets.slice(0, 6).forEach((sw, swIdx) => {
        if (sw.entityId) {
          if (!entityLabelMap[sw.entityId]) entityLabelMap[sw.entityId] = [];
          entityLabelMap[sw.entityId].push({
            statusLabelId: `lbl_sub_lights_${swIdx}`,
            iconLabelId: `lbl_ico_lights_${swIdx}`,
          });
        }
      });
    } else if (screen.id !== 'screen_media' && screen.id !== 'screen_bambu' && screen.id !== 'screen_calendar') {
      screen.widgets.slice(0, 6).forEach((cw, cwIdx) => {
        if (cw.entityId && !cw.entityId.startsWith('sensor.')) {
          if (!entityLabelMap[cw.entityId]) entityLabelMap[cw.entityId] = [];
          entityLabelMap[cw.entityId].push({
            statusLabelId: `lbl_sub_custom_${screen.id}_${cwIdx}`,
            iconLabelId: `lbl_ico_custom_${screen.id}_${cwIdx}`,
          });
        }
      });
    }
  });

  // Filtrowanie duplikatów (wykluczamy weatherEntityId z listy ogólnej, gdyż ma dedykowane sensory temp i condition)
  const uniqueSensors = Array.from(new Set(sensorEntities)).filter(id => id !== weatherEntityId);
  const uniqueBinaries = Array.from(new Set([...binaryEntities, ...Object.keys(entityLabelMap)]));
  const uniqueTexts = Array.from(new Set(textSensorEntities)).filter(id => id !== weatherEntityId && id !== mediaEntityId);
  const bambuScreen = config.screens.find(screen => screen.id === 'screen_bambu');
  const bambuHeaderWidget = bambuScreen?.widgets.find(widget => widget.type === 'bambu_file_info');
  const bambuProgressWidget = bambuScreen?.widgets.find(widget => widget.type === 'bambu_progress');
  const bambuTemperaturesWidget = bambuScreen?.widgets.find(widget => widget.type === 'bambu_temperatures');
  const bambuStatsWidget = bambuScreen?.widgets.find(widget => widget.type === 'bambu_stats_overview');
  const bambuFields = {
    job: bambuHeaderWidget?.entityId,
    state: bambuHeaderWidget?.secondaryEntityId,
    progress: bambuProgressWidget?.entityId,
    remaining: bambuProgressWidget?.secondaryEntityId,
    nozzle: bambuTemperaturesWidget?.entityId,
    bed: bambuTemperaturesWidget?.secondaryEntityId,
    fan: bambuStatsWidget?.entityId,
  };
  const remainingUnit = allKnown.find(entity => entity.entity_id === bambuFields.remaining)?.unit?.toLowerCase();
  const bambuNumericUpdates = new Map<string, string[]>();
  const bambuTextUpdates = new Map<string, string[]>();
  const addBambuUpdate = (updates: Map<string, string[]>, entityId: string | undefined, yaml: string) => {
    if (!entityId) return;
    updates.set(entityId, [...(updates.get(entityId) || []), yaml]);
  };
  addBambuUpdate(bambuNumericUpdates, bambuFields.progress, `        - lvgl.label.update:
            id: lbl_bambu_progress
            text: !lambda |-
              if (!std::isfinite(x)) return std::string("Postęp: --");
              char buf[20];
              snprintf(buf, sizeof(buf), "Postęp: %.0f%%", x);
              return std::string(buf);
        - lvgl.bar.update:
            id: bar_bambu_progress
            value: !lambda |-
              return static_cast<int>(!std::isfinite(x) ? 0 : (x < 0 ? 0 : (x > 100 ? 100 : x)));`);
  const remainingDivisor = ['s', 'sec', 'second', 'seconds', 'sekunda', 'sekundy', 'sekund'].includes(remainingUnit || '')
    ? '60.0'
    : ['ms', 'millisecond', 'milliseconds', 'milisekunda', 'milisekundy'].includes(remainingUnit || '')
      ? '60000.0'
      : '1.0';
  if (bambuFields.remaining && uniqueSensors.includes(bambuFields.remaining)) {
    addBambuUpdate(bambuNumericUpdates, bambuFields.remaining, `        - lvgl.label.update:
            id: lbl_bambu_remaining
            text: !lambda |-
              if (!std::isfinite(x)) return std::string("Pozostało: --");
              const double remaining_value = x < 0 ? 0.0 : x;
              const int total_minutes = static_cast<int>(std::round(remaining_value / ${remainingDivisor}));
              char buf[32];
              snprintf(buf, sizeof(buf), "Pozostało: %dh %02dmin", total_minutes / 60, total_minutes % 60);
              return std::string(buf);`);
  } else {
    addBambuUpdate(bambuTextUpdates, bambuFields.remaining, `        - lvgl.label.update:
            id: lbl_bambu_remaining
            text: !lambda |-
              if (x.empty() || x == "unavailable" || x == "unknown") return std::string("Pozostało: --");
              int hours = 0, minutes = 0, seconds = 0;
              int total_minutes = 0;
              if (sscanf(x.c_str(), "%d:%d:%d", &hours, &minutes, &seconds) == 3) {
                total_minutes = static_cast<int>(std::round((hours * 3600.0 + minutes * 60.0 + seconds) / 60.0));
              } else if (sscanf(x.c_str(), "%d:%d", &hours, &minutes) == 2) {
                total_minutes = hours * 60 + minutes;
              } else if (sscanf(x.c_str(), "%d h %d min", &hours, &minutes) == 2) {
                total_minutes = hours * 60 + minutes;
              } else {
                char* end = nullptr;
                const double numeric_value = std::strtod(x.c_str(), &end);
                if (end == x.c_str() || *end != '\\0') return std::string("Pozostało: ") + x;
                total_minutes = static_cast<int>(std::round(numeric_value / ${remainingDivisor}));
              }
              total_minutes = std::max(0, total_minutes);
              char buf[32];
              snprintf(buf, sizeof(buf), "Pozostało: %dh %02dmin", total_minutes / 60, total_minutes % 60);
              return std::string(buf);`);
  }
  addBambuUpdate(bambuNumericUpdates, bambuFields.nozzle, `        - lvgl.label.update:
            id: lbl_bambu_nozzle
            text: !lambda |-
              char buf[24];
              snprintf(buf, sizeof(buf), "Dysza: %.0f°C", x);
              return std::string(buf);`);
  addBambuUpdate(bambuNumericUpdates, bambuFields.bed, `        - lvgl.label.update:
            id: lbl_bambu_bed
            text: !lambda |-
              char buf[24];
              snprintf(buf, sizeof(buf), "Stół: %.0f°C", x);
              return std::string(buf);`);
  addBambuUpdate(bambuNumericUpdates, bambuFields.fan, `        - lvgl.label.update:
            id: lbl_bambu_fan
            text: !lambda |-
              char buf[24];
              snprintf(buf, sizeof(buf), "Wentylator: %.0f%%", x);
              return std::string(buf);`);
  addBambuUpdate(bambuTextUpdates, bambuFields.job, `        - lvgl.label.update:
            id: lbl_bambu_job
            text: !lambda |-
              return (!x.empty() && x != "unavailable" && x != "unknown") ? x : std::string("Brak aktywnego zadania");`);
  addBambuUpdate(bambuTextUpdates, bambuFields.state, `        - lvgl.label.update:
            id: lbl_bambu_state
            text: !lambda |-
              if (x.empty() || x == "unavailable" || x == "unknown") return std::string("Status: --");
              return std::string("Status: ") + x;`);
  const onValueUpdates = (updates: Map<string, string[]>, entityId: string) => {
    const callbacks = updates.get(entityId);
    return callbacks?.length ? `\n    on_value:\n      then:\n${callbacks.join('\n')}` : '';
  };

  const isWeatherDomain = weatherEntityId.startsWith('weather.');

  const sensorBlock = `
# ------------------------------------------------------------
# Sensory numeryczne z Home Assistant (pomiary, procenty, temperatury)
# Pobieranie temperatury z encji pogody dla lokalizacji użytkownika (${weatherEntityId})
# ------------------------------------------------------------
sensor:
  - platform: homeassistant
    id: ha_weather_temp
    entity_id: ${weatherEntityId}
${isWeatherDomain ? '    attribute: temperature\n' : ''}    on_value:
      then:
        - if:
            condition:
              lambda: 'return !std::isnan(x);'
            then:
${hasHomeScreen ? `              - lvgl.label.update:
                  id: lbl_home_temp
                  text: !lambda |-
                    char buf[16];
                    snprintf(buf, sizeof(buf), "%.1f°C", x);
                    return std::string(buf);` : ''}
${hasMediaScreen ? `  - platform: homeassistant
    id: ha_media_position
    entity_id: ${mediaEntityId}
    attribute: media_position

  - platform: homeassistant
    id: ha_media_duration
    entity_id: ${mediaEntityId}
    attribute: media_duration

  - platform: homeassistant
    id: ha_media_volume
    entity_id: ${mediaEntityId}
    attribute: volume_level
    on_value:
      then:
        - if:
            condition:
              lambda: 'return !std::isnan(x);'
            then:
              - lvgl.label.update:
                  id: lbl_media_volume
                  text: !lambda |-
                    char buf[24];
                    snprintf(buf, sizeof(buf), "Głośność: %.0f%%", x * 100.0f);
                    return std::string(buf);` : ''}
${uniqueSensors.map(id => `  - platform: homeassistant
    id: ${id.replace(/[^a-zA-Z0-9_]/g, '_')}
    entity_id: ${id}${onValueUpdates(bambuNumericUpdates, id)}`).join('\n\n')}
`;

  const binaryBlock = uniqueBinaries.length > 0 ? `
# ------------------------------------------------------------
# Sensory binarne z Home Assistant (stany ON/OFF oraz dynamiczna zmiana ikon i etykiet WŁ./WYŁ.)
# Wskazówka: Komunikat 'Can't convert unavailable to binary state' w logach ESPHome
# pojawia się tylko podczas rozruchu, dopóki Home Assistant nie wyśle pierwszego stanu ON/OFF.
# ------------------------------------------------------------
binary_sensor:
${uniqueBinaries.map(id => {
  const safeId = id.replace(/[^a-zA-Z0-9_]/g, '_');
  const pairs = entityLabelMap[id] || [];
  let onStateBlock = '';
  if (pairs.length > 0) {
    onStateBlock = `
    on_state:
      then:
        - if:
            condition:
              lambda: 'return x;'
            then:
${pairs.map(p => `              - lvgl.label.update:
                  id: ${p.statusLabelId}
                  text: "WŁ."
                  text_color: ${th.accent}
              - lvgl.label.update:
                  id: ${p.iconLabelId}
                  text_color: ${activeIconColor}`).join('\n')}
            else:
${pairs.map(p => `              - lvgl.label.update:
                  id: ${p.statusLabelId}
                  text: "WYŁ."
                  text_color: 0x64748B
              - lvgl.label.update:
                  id: ${p.iconLabelId}
                  text_color: 0x64748B`).join('\n')}`;
  }
  return `  - platform: homeassistant
    id: ${safeId}
    entity_id: ${id}${onStateBlock}`;
}).join('\n\n')}
` : '';

  const textBlock = `
# ------------------------------------------------------------
# Sensory tekstowe z Home Assistant (stany drukarki 3D, nazwy zadań, pogoda, komunikaty)
# Pobieranie stanu aury i automatyczne tłumaczenie na język polski
# ------------------------------------------------------------
text_sensor:
  - platform: homeassistant
    id: ha_weather_cond
    entity_id: ${weatherEntityId}
    on_value:
      then:
        - if:
            condition:
              lambda: 'return !x.empty() && x != "unavailable" && x != "unknown";'
            then:
${hasHomeScreen ? `              - lvgl.label.update:
                  id: lbl_home_weather_desc
                  text: !lambda |-
                    if (x == "sunny" || x == "clear-night") return std::string("Słonecznie");
                    if (x == "partlycloudy") return std::string("Częściowo pochmurno");
                    if (x == "cloudy") return std::string("Pochmurno");
                    if (x == "rainy" || x == "pouring") return std::string("Deszcz");
                    if (x == "lightning" || x == "lightning-rainy") return std::string("Burza");
                    if (x == "snowy") return std::string("Śnieg");
                    if (x == "fog") return std::string("Mgła");
                    if (x == "windy") return std::string("Wietrznie");
                    return x;` : ''}
${hasMediaScreen ? `  # Tytuł utworu z Home Assistant (${mediaEntityId})
  - platform: homeassistant
    id: ha_media_track
    entity_id: ${mediaEntityId}
    attribute: media_title
    on_value:
      then:
        - lvgl.label.update:
            id: lbl_media_title
            text: !lambda |-
              return (!x.empty() && x != "unavailable" && x != "unknown") ? x : std::string("Brak utworu");

  # Wykonawca utworu z Home Assistant (${mediaEntityId})
  - platform: homeassistant
    id: ha_media_artist
    entity_id: ${mediaEntityId}
    attribute: media_artist
    on_value:
      then:
        - lvgl.label.update:
            id: lbl_media_artist
            text: !lambda |-
              return (!x.empty() && x != "unavailable" && x != "unknown") ? x : std::string("Nieznany wykonawca");` : ''}
${hasMediaScreen ? `
  # Stan odtwarzacza steruje ikoną play/pause.
  - platform: homeassistant
    id: ha_media_state
    entity_id: ${mediaEntityId}
    on_value:
      then:
        - if:
            condition:
              lambda: 'return x == "playing";'
            then:
              - lvgl.label.update:
                  id: lbl_media_play_pause_icon
                  text: "\\U000F03E4"
            else:
              - lvgl.label.update:
                  id: lbl_media_play_pause_icon
                  text: "\\U000F040A"` : ''}
${uniqueTexts.map(id => `  - platform: homeassistant
    id: ${id.replace(/[^a-zA-Z0-9_]/g, '_')}
    entity_id: ${id}${onValueUpdates(bambuTextUpdates, id)}`).join('\n\n')}
`;

  // 1. Walidacja i rygorystyczna deduplikacja glyphów czcionki Roboto przed generowaniem YAML
  const configTextChars = collectConfigTextCharacters(config);
  const robotoGlyphsReport = validateAndDeduplicateGlyphs(BASE_ROBOTO_GLYPHS + configTextChars);
  const robotoGlyphsYaml = formatGlyphsYamlString(robotoGlyphsReport.sanitized);

  // 2. Walidacja cyfr zegara
  const clockGlyphsYaml = formatGlyphsYamlString("0123456789:");

  // 3. Walidacja i deduplikacja ikon MDI (usuwamy ewentualne aliasy i duplikaty)
  const uniqueMdiCodes = Array.from(new Set(Object.values(MDI_GLYPH_MAP)));
  const allMdiGlyphsYaml = uniqueMdiCodes
    .map(g => `      - "${g}"`)
    .join('\n');
  const calendarEventLabelsYaml = Array.from({ length: 5 }, (_, index) => {
    const eventIndex = index;
    const rowY = 42 + eventIndex * 39;
    const emptyMessage = eventIndex === 0 ? 'Brak nadchodzących wydarzeń' : '';
    return `              - label:
                  id: lbl_calendar_event_time_${eventIndex + 1}
                  x: 14
                  y: ${rowY}
                  width: 102
                  text: "${emptyMessage}"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
                  long_mode: DOT
              - label:
                  id: lbl_calendar_event_title_${eventIndex + 1}
                  x: 120
                  y: ${rowY}
                  width: 180
                  text: ""
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
                  long_mode: DOT`;
  }).join('\n');
  const calendarEventUpdateYaml = Array.from({ length: 5 }, (_, index) => {
    const eventIndex = index;
    const noEventsText = eventIndex === 0 ? 'Brak nadchodzących wydarzeń' : '';
    return `              - lvgl.label.update:
                  id: lbl_calendar_event_time_${eventIndex + 1}
                  text: !lambda |-
                    auto events = response["response"][${calendarEntityIdLiteral}]["events"].as<JsonArrayConst>();
                    if (events.size() <= ${eventIndex}) return std::string("${noEventsText}");
                    auto start = events[${eventIndex}]["start"].as<std::string>();
                    char formatted[24];
                    if (start.length() >= 16) {
                      snprintf(formatted, sizeof(formatted), "%c%c.%c%c %c%c:%c%c", start[8], start[9], start[5], start[6], start[11], start[12], start[14], start[15]);
                    } else if (start.length() >= 10) {
                      snprintf(formatted, sizeof(formatted), "%c%c.%c%c cały dzień", start[8], start[9], start[5], start[6]);
                    } else {
                      return std::string("Nieprawidłowa data");
                    }
                    return std::string(formatted);
              - lvgl.label.update:
                  id: lbl_calendar_event_title_${eventIndex + 1}
                  text: !lambda |-
                    auto events = response["response"][${calendarEntityIdLiteral}]["events"].as<JsonArrayConst>();
                    if (events.size() <= ${eventIndex}) return std::string("");
                    auto summary = events[${eventIndex}]["summary"].as<std::string>();
                    return summary.empty() ? std::string("(bez tytułu)") : summary;`;
  }).join('\n');

  return `############################################################
# ESPHome + Wyświetlacz ST7796 / XPT2046
# Target device: ${hw.name}
# Resolution: ${width}x${height} (${config.orientation})
# Bez przewijania (Non-scrolling 480x320)
# Pełna obsługa języka polskiego + ikony MDI + ochrona krawędzi
############################################################

esphome:
  name: ${config.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}
  friendly_name: "${config.name}"
  on_boot:
    priority: 600
    then:
      - light.turn_on:
          id: back_light
          brightness: 1.0

esp32:
  board: ${hw.board || 'esp-wrover-kit'}
  framework:
    type: ${hw.framework || 'arduino'}

psram:

logger:

api:
  encryption:
    key: ${apiKey}
${calendarScreen ? `  on_client_connected:
    then:
      - delay: 5s
      - script.execute: refresh_calendar_events
` : ''}

ota:
  - platform: esphome

wifi:
  ssid: ${wifiSsid}
  password: ${wifiPass}
  ap:
    ssid: "${config.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}-fallback"
    password: "fallbackpassword"

captive_portal:

# Synchronizacja czasu SNTP (serwery NTP w Polsce i Europie)
# Czas, data i dzień tygodnia synchronizują się z siecią natychmiast po uruchomieniu urządzenia
time:
  - platform: sntp
    id: ha_time
    timezone: "Europe/Warsaw"
    servers:
      - 0.pl.pool.ntp.org
      - 1.pl.pool.ntp.org
      - time.google.com
    on_time_sync:
      then:
        - script.execute: update_clock_and_date
${nm.enabled ? `        # Weryfikacja po restarcie / synchronizacji NTP czy przypada pora nocna
        - lambda: |-
            auto t = id(ha_time).now();
            if (t.is_valid()) {
              int curMinutes = t.hour * 60 + t.minute;
              int startMinutes = ${nm.startHour} * 60 + ${nm.startMinute};
              int endMinutes = ${nm.endHour} * 60 + ${nm.endMinute};
              bool isNight = false;
              if (startMinutes > endMinutes) {
                isNight = (curMinutes >= startMinutes || curMinutes < endMinutes);
              } else {
                isNight = (curMinutes >= startMinutes && curMinutes < endMinutes);
              }
              if (isNight) {
                auto call = id(back_light).turn_off();
                call.perform();
                ESP_LOGI("night_mode", "Po synchronizacji czasu wykryto tryb nocny - ekran wygaszony.");
              }
            }
    on_time:
      # Start Trybu Nocnego: wyłączenie podświetlenia ekranu o ${String(nm.startHour).padStart(2, '0')}:${String(nm.startMinute).padStart(2, '0')}
      - seconds: 0
        minutes: ${nm.startMinute}
        hours: ${nm.startHour}
        then:
          - light.turn_off: back_light
          - logger.log: "Tryb Nocny: Wyświetlacz wyłączony o ${String(nm.startHour).padStart(2, '0')}:${String(nm.startMinute).padStart(2, '0')}"
      # Koniec Trybu Nocnego: ponowne włączenie podświetlenia ekranu o ${String(nm.endHour).padStart(2, '0')}:${String(nm.endMinute).padStart(2, '0')}
      - seconds: 0
        minutes: ${nm.endMinute}
        hours: ${nm.endHour}
        then:
          - light.turn_on: back_light
          - logger.log: "Tryb Nocny: Wyświetlacz włączony o ${String(nm.endHour).padStart(2, '0')}:${String(nm.endMinute).padStart(2, '0')}"` : ''}

# Automatyczna aktualizacja czasu, daty i dnia tygodnia na ekranie (co 1 sekundę)
interval:
  - interval: 1s
    then:
      - if:
          condition:
            lambda: 'return id(ha_time).now().is_valid();'
          then:
            - script.execute: update_clock_and_date
${calendarScreen ? `  - interval: 15min
    startup_delay: 30s
    then:
      - script.execute: refresh_calendar_events` : ''}
${hasMediaScreen ? `      - lvgl.bar.update:
          id: bar_media_progress
          value: !lambda |-
            const float position = id(ha_media_position).state;
            const float duration = id(ha_media_duration).state;
            if (std::isnan(position) || std::isnan(duration) || duration <= 0.0f) return 0;
            const float progress = 100.0f * position / duration;
            return static_cast<int>(progress > 100.0f ? 100.0f : progress);` : ''}

script:
  - id: update_clock_and_date
    mode: restart
    then:
${hasHomeScreen ? `      - lvgl.label.update:
          id: lbl_home_clock
          text: !lambda |-
            return id(ha_time).now().strftime("%H:%M");
      - lvgl.label.update:
          id: lbl_home_date
          text: !lambda |-
            static const char *const DAYS[] = {"Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"};
            static const char *const MONTHS[] = {"stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"};
            auto t = id(ha_time).now();
            int w = (t.day_of_week - 1) % 7;
            if (w < 0) w += 7;
            int m = (t.month - 1) % 12;
            if (m < 0) m += 12;
            char buf[96];
            snprintf(buf, sizeof(buf), "%s, %d %s", DAYS[w], t.day_of_month, MONTHS[m]);
            return std::string(buf);` : ''}
${calendarScreen ? `  - id: refresh_calendar_events
    mode: single
    then:
      - homeassistant.action:
          action: calendar.get_events
          data_template:
            entity_id: ${calendarEntityId}
            start_date_time: "{{ now().strftime('%Y-%m-%d %H:%M:%S') }}"
            end_date_time: "{{ (now() + timedelta(days=365)).strftime('%Y-%m-%d %H:%M:%S') }}"
          capture_response: true
          on_success:
            then:
${calendarEventUpdateYaml}
          on_error:
            then:
              - logger.log:
                  level: WARN
                  tag: calendar
                  format: "Nie udało się pobrać wydarzeń z ${calendarEntityId}"
              - lvgl.label.update:
                  id: lbl_calendar_event_time_1
                  text: "Błąd pobierania kalendarza"` : ''}
# ------------------------------------------------------------
# Czcionki z obsługą polskich znaków i ikon Material Design (MDI)
# Walidacja pre-kompilacyjna: 0 duplikatów glyphów (ochrona przed 'Found duplicate glyphs')
# ------------------------------------------------------------
font:
  # Czcionka główna: Google Fonts Roboto z pełnym zestawem polskich i europejskich znaków
  # Zwalidowany zestaw ${robotoGlyphsReport.uniqueCount} unikalnych znaków (brak powtórzeń ó, Ó i innych diakrytyków)
  - file: "gfonts://Roboto"
    id: font_roboto_14
    size: 14
    glyphs:
      - ${robotoGlyphsYaml}

  - file: "gfonts://Roboto"
    id: font_roboto_12
    size: 12
    glyphs:
      - ${robotoGlyphsYaml}

  # Czcionka nagłówkowa 18px dla tytułów i parametrów
  - file: "gfonts://Roboto"
    id: font_roboto_18
    size: 18
    glyphs:
      - ${robotoGlyphsYaml}

  - file: "gfonts://Roboto"
    id: font_roboto_24
    size: 24
    glyphs:
      - ${robotoGlyphsYaml}

  # Duża czcionka cyfrowa dla zegara na stronie startowej
  - file: "gfonts://Roboto"
    id: font_clock_38
    size: 38
    glyphs:
      - ${clockGlyphsYaml}

  # Czcionka ikon Material Design Icons (MDI) - rozmiar 20px (${uniqueMdiCodes.length} unikalnych ikon smart home i multimediów)
  - file: "https://raw.githubusercontent.com/Templarian/MaterialDesign-Webfont/master/fonts/materialdesignicons-webfont.ttf"
    id: font_mdi_20
    size: 20
    glyphs:
${allMdiGlyphsYaml}

  # Czcionka ikon Material Design Icons (MDI) - rozmiar 28px (${uniqueMdiCodes.length} unikalnych ikon)
  - file: "https://raw.githubusercontent.com/Templarian/MaterialDesign-Webfont/master/fonts/materialdesignicons-webfont.ttf"
    id: font_mdi_28
    size: 28
    glyphs:
${allMdiGlyphsYaml}

# ------------------------------------------------------------
# Magistrala SPI (Wyświetlacz + Touchscreen)
# Uwaga: Piny GPIO12 (MISO), GPIO15 (CS) i GPIO2 (DC) to fabryczne połączenia płytki Freenove / CYD.
# Ostrzeżenie ESPHome 'GPIOxx is a strapping PIN' jest czysto informacyjne dla projektantów PCB
# i potwierdza poprawne mapowanie fabrycznych ścieżek wyświetlacza.
# ------------------------------------------------------------
spi:
  id: lcd
  clk_pin: GPIO${hw.pins.sck || 14}
  mosi_pin: GPIO${hw.pins.mosi || 13}
  miso_pin: GPIO${hw.pins.miso || 12}

# Sterowanie podświetleniem ekranu (Freenove GPIO27)
output:
  platform: ledc
  pin: GPIO${hw.pins.bl || 27}
  id: gpio_backlight_pwm

light:
  platform: monochromatic
  output: gpio_backlight_pwm
  name: "Power Display Backlight"
  id: back_light
  restore_mode: ALWAYS_ON

# ------------------------------------------------------------
# Panel Dotykowy (XPT2046)
# ------------------------------------------------------------
touchscreen:
  platform: ${hw.touchDriver || 'xpt2046'}
  id: ts_touch
  spi_id: lcd
  cs_pin: GPIO${hw.pins.touch_cs || 33}
  interrupt_pin: GPIO${hw.pins.touch_irq || 36}
  update_interval: 20ms
  threshold: 400
  calibration:
    x_min: 300
    x_max: 3900
    y_min: 300
    y_max: 3900
  transform:
    swap_xy: ${hw.touchTransform?.swap_xy ? 'true' : 'false'}
    mirror_x: ${hw.touchTransform?.mirror_x ? 'true' : 'false'}
    mirror_y: ${hw.touchTransform?.mirror_y ? 'true' : 'false'}
${nm.enabled && nm.wakeOnTouch !== false ? `  on_touch:
    - then:
        - if:
            condition:
              lambda: 'return !id(back_light).remote_values.is_on();'
            then:
              - light.turn_on: back_light
              - logger.log: "Dotyk ekranu: Podświetlenie wybudzone z trybu nocnego"` : ''}

# ------------------------------------------------------------
# Wyświetlacz ST7796 (mipi_spi, 480x320)
# ------------------------------------------------------------
display:
  platform: ${hw.displayPlatform || 'mipi_spi'}
  id: my_display
  spi_id: lcd
  model: ${hw.displayModel || 'ST7796'}
  cs_pin: ${hw.pins.cs || 15}
  dc_pin: ${hw.pins.dc || 2}
  invert_colors: false
  update_interval: never
  auto_clear_enabled: false
  data_rate: 40MHz
  dimensions:
    width: 320    # Natywna rozdzielczość ST7796 (pion)
    height: 480   # Natywna rozdzielczość ST7796 (pion)
    offset_width: 0
    offset_height: 0
    pad_width: 0
    pad_height: 0

# ------------------------------------------------------------
# Silnik Graficzny LVGL (Układ bez przewijania 480x320)
# ------------------------------------------------------------
lvgl:
  displays:
    - my_display
  touchscreens:
    - touchscreen_id: ts_touch
  rotation: ${hw.lvglRotation || 270}      # Obrót interfejsu do poziomu (480x320)
  default_font: font_roboto_14             # Domyślny font z polskimi znakami

  # Definicje stron ekranu dotykowego (Brak przewijania)
  pages:
${config.screens.map((screen, sIdx) => {
  let pageContent = '';

  // 1. STRONA STARTOWA: Zegar na górze (104px), 4 przyciski obok siebie (136px, tekst na górze, ikona MDI na dole)
  if (screen.id === 'screen_home') {
    const quickWidgets = screen.widgets.filter(w => w.type !== 'home_clock_date').slice(0, 4);
    pageContent = `        # Górna część: Zegar Cyfrowy i Data (96px z automatyczną aktualizacją z Home Assistant)
        - obj:
            x: 10
            y: 6
            width: 460
            height: 96
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.heroBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            widgets:
              - obj:
                  align: LEFT_MID
                  x: 16
                  width: 280
                  height: 68
                  bg_opa: TRANSP
                  border_width: 0
                  pad_all: 0
                  scrollable: false
                  widgets:
                    - label:
                        id: lbl_home_clock
                        x: 0
                        y: 0
                        text: "--:--"
                        text_font: font_clock_38
                        text_color: 0xFFFFFF
                    - label:
                        id: lbl_home_date
                        x: 0
                        y: 48
                        text: "Wczytywanie czasu..."
                        text_font: font_roboto_14
                        text_color: ${th.accent}
              - label:
                  id: lbl_home_temp
                  x: 320
                  y: 12
                  text: "--.-°C"
                  text_font: font_roboto_18
                  text_color: ${th.accent}
              - label:
                  x: 294
                  y: 44
                  text: "\\U000F0599"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  id: lbl_home_weather_desc
                  x: 320
                  y: 46
                  width: 128
                  text: "Moja Lokalizacja"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
                  long_mode: SCROLL_CIRCULAR

        # Dolna część: 4 Przyciski Obok Siebie (Tekst na górze, ikona MDI na dole)
${quickWidgets.map((qw, qIdx) => {
  const btnX = 10 + qIdx * 116;
  const isSens = qw.entityId?.startsWith('sensor.');
  let clickAct = '';
  if (qw.entityId && !isSens) {
    let service = 'switch.toggle';
    if (qw.entityId.startsWith('light.')) service = 'light.toggle';
    else if (qw.entityId.startsWith('media_player.')) service = 'media_player.media_play_pause';
    else if (qw.entityId.startsWith('button.')) service = 'button.press';
    else if (qw.entityId.startsWith('input_boolean.')) service = 'input_boolean.toggle';

    clickAct = `
            on_click:
              - homeassistant.service:
                  service: ${service}
                  data:
                    entity_id: ${qw.entityId}`;
  }
  const mdiIcon = getMdiGlyph(qw.icon);
  const safeTitle = escapeYamlText(qw.title);
  const isDefaultOn = qw.entityId ? (knownStates[qw.entityId] === 'on' || knownStates[qw.entityId] === 'playing') : false;
  const statusLabelId = `lbl_sub_home_${qIdx}`;
  const iconLabelId = `lbl_ico_home_${qIdx}`;
  const safeSub = isSens ? 'Postęp' : qw.entityId?.startsWith('media_player.') ? (isDefaultOn ? 'Odtwarza' : 'Pauza') : (isDefaultOn ? 'WŁ.' : 'WYŁ.');
  const initSubColor = isSens ? th.accentMuted : (isDefaultOn ? th.accent : '0x64748B');
  const initIcoColor = isDefaultOn ? activeIconColor : '0x64748B';

  return `        # Przycisk ${qIdx + 1}: ${qw.title}
        - button:
            x: ${btnX}
            y: 108
            width: 112
            height: 136
            scrollable: false
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12${clickAct}
            widgets:
              # Dwulinijkowy tytuł
              - label:
                  width: 100
                  height: 40
                  align: TOP_MID
                  y: 4
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
                  text_align: CENTER
                  long_mode: WRAP
              - label:
                  id: ${statusLabelId}
                  width: 100
                  align: TOP_MID
                  y: 52
                  text: "${safeSub}"
                  text_font: font_roboto_12
                  text_color: ${initSubColor}
                  text_align: CENTER
              # Ikona MDI na dole (dynamiczny kolor w zależności od stanu WŁ./WYŁ.)
              - label:
                  id: ${iconLabelId}
                  align: BOTTOM_MID
                  y: -14
                  text: "${mdiIcon}"
                  text_font: font_mdi_28
                  text_color: ${initIcoColor}`;
}).join('\n')}`;
  }

  // 2. STRONA ŚWIATEŁ: 6 przycisków w siatce 3x2 (bez przewijania, ikony MDI)
  else if (screen.id === 'screen_lights') {
    pageContent = `        # Siatka 6 Przełączników (3 kolumny x 2 wiersze)
${screen.widgets.slice(0, 6).map((sw, swIdx) => {
  const r = Math.floor(swIdx / 3);
  const c = swIdx % 3;
  const x = 10 + c * 155;
  const y = 6 + r * 124;
  const mdiIcon = getMdiGlyph(sw.icon || 'Lightbulb');
  const safeTitle = escapeYamlText(sw.title);
  const isDefaultOn = sw.entityId ? (knownStates[sw.entityId] === 'on' || knownStates[sw.entityId] === 'playing') : false;
  const statusLabelId = `lbl_sub_lights_${swIdx}`;
  const iconLabelId = `lbl_ico_lights_${swIdx}`;
  const initStatus = isDefaultOn ? 'WŁ.' : 'WYŁ.';
  const initStatusColor = isDefaultOn ? th.accent : '0x64748B';
  const initIconColor = isDefaultOn ? activeIconColor : '0x64748B';

  return `        # Przełącznik: ${sw.title}
        - button:
            x: ${x}
            y: ${y}
            width: 150
            height: 118
            scrollable: false
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            on_click:
              - homeassistant.service:
                  service: ${sw.entityId?.startsWith('light.') ? 'light.toggle' : 'switch.toggle'}
                  data:
                    entity_id: ${sw.entityId || 'switch.swiatlo'}
            widgets:
              - label:
                  width: 138
                  height: 40
                  align: TOP_MID
                  y: 3
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
                  text_align: CENTER
                  long_mode: WRAP
              - label:
                  id: ${statusLabelId}
                  width: 138
                  align: TOP_MID
                  y: 48
                  text: "${initStatus}"
                  text_font: font_roboto_12
                  text_color: ${initStatusColor}
                  text_align: CENTER
              - label:
                  id: ${iconLabelId}
                  align: BOTTOM_MID
                  y: -8
                  text: "${mdiIcon}"
                  text_font: font_mdi_28
                  text_color: ${initIconColor}`;
}).join('\n')}`;
  }

  // 3. STRONA MULTIMEDIÓW: Dedykowana karta z tytułem, wykonawcą i sterowaniem odtwarzaczem
  else if (screen.id === 'screen_media') {
    const med = screen.widgets[0] || { entityId: 'media_player.mi_box_2', title: 'Multimedia' };
    const pEntity = med.entityId || 'media_player.mi_box_2';
    const initialPlayPauseIcon = knownStates[pEntity] === 'playing' ? '\\U000F03E4' : '\\U000F040A';
    pageContent = `        # Dedykowany odtwarzacz multimediów
        - obj:
            x: 10
            y: 6
            width: 460
            height: 246
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            widgets:
              # Tytuł odtwarzanego utworu
              - label:
                  id: lbl_media_title
                  align: TOP_MID
                  y: 8
                  width: 440
                  text: "Bohemian Rhapsody"
                  text_font: font_roboto_24
                  text_color: ${th.textPrimary}
                  text_align: CENTER
                  long_mode: SCROLL_CIRCULAR

              # Wykonawca utworu
              - label:
                  id: lbl_media_artist
                  align: TOP_MID
                  y: 38
                  width: 440
                  text: "Queen"
                  text_font: font_roboto_18
                  text_color: ${th.accent}
                  text_align: CENTER
                  long_mode: SCROLL_CIRCULAR

              - bar:
                  id: bar_media_progress
                  x: 30
                  y: 68
                  width: 400
                  height: 8
                  min_value: 0
                  max_value: 100
                  value: 0
                  bg_color: ${th.cardBorder}
                  indicator:
                    bg_color: ${th.accent}

              # Przyciski Nawigacji Muzycznej - ikony MDI
              - button:
                  x: 60
                  y: 88
                  width: 100
                  height: 60
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardBorder}
                  border_width: 1
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.media_previous_track
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        align: CENTER
                        text: "\\U000F04AE"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - button:
                  x: 180
                  y: 88
                  width: 100
                  height: 60
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardActiveBorder}
                  border_width: 2
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.media_play_pause
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        id: lbl_media_play_pause_icon
                        align: CENTER
                        text: "${initialPlayPauseIcon}"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - button:
                  x: 300
                  y: 88
                  width: 100
                  height: 60
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardBorder}
                  border_width: 1
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.media_next_track
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        align: CENTER
                        text: "\\U000F04AD"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF

              # Regulacja Głośności - ikony MDI
              - button:
                  x: 66
                  y: 160
                  width: 88
                  height: 54
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardBorder}
                  border_width: 1
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.volume_down
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        align: CENTER
                        text: "\\U000F075E"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - button:
                  x: 186
                  y: 160
                  width: 88
                  height: 54
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardBorder}
                  border_width: 1
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.volume_mute
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        align: CENTER
                        text: "\\U000F075F"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - button:
                  x: 306
                  y: 160
                  width: 88
                  height: 54
                  pad_all: 0
                  scrollable: false
                  bg_color: ${th.cardActiveBg}
                  border_color: ${th.cardBorder}
                  border_width: 1
                  radius: 10
                  on_click:
                    - homeassistant.service:
                        service: media_player.volume_up
                        data:
                          entity_id: ${pEntity}
                  widgets:
                    - label:
                        align: CENTER
                        text: "\\U000F075D"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - label:
                  id: lbl_media_volume
                  align: TOP_MID
                  y: 218
                  text_align: CENTER
                  text: "Głośność: --%"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}`;
  }

  // 4. STRONA DRUKARKI BAMBU LAB: Tylko podgląd parametrów (ikony MDI, brak sterowania)
  else if (screen.id === 'screen_bambu') {
    pageContent = `        # Nagłówek Zadania Druku z Prawdziwą Ikoną Drukarki 3D
        - obj:
            x: 10
            y: 6
            width: 460
            height: 42
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            pad_top: 0
            pad_bottom: 0
            pad_left: 0
            pad_right: 0
            widgets:
              - label:
                  x: 12
                  y: 11
                  text: "\\U000F042B"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 38
                  y: 12
                  text: "Bambu Lab A1 Mini"
                  text_font: font_roboto_14
                  text_color: ${th.accent}

        # Karta Postępu Druku
        - obj:
            x: 10
            y: 54
            width: 224
            height: 132
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            pad_top: 0
            pad_bottom: 0
            pad_left: 0
            pad_right: 0
            widgets:
              - label:
                  x: 12
                  y: 9
                  text: "\\U000F029A"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 38
                  y: 10
                  id: lbl_bambu_progress
                  text: "Postęp: --"
                  text_font: font_roboto_14
                  text_color: ${th.accent}
              - label:
                  x: 12
                  y: 38
                  text: "\\U000F0328"
                  text_font: font_mdi_20
                  text_color: ${th.accentMuted}
              - label:
                  x: 38
                  y: 39
                  id: lbl_bambu_state
                  text: "Status: --"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
              - label:
                  x: 12
                  y: 66
                  text: "\\U000F0150"
                  text_font: font_mdi_20
                  text_color: ${th.accentMuted}
              - label:
                  x: 38
                  y: 67
                  id: lbl_bambu_remaining
                  text: "Pozostało: --"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}
              - bar:
                  id: bar_bambu_progress
                  x: 38
                  y: 96
                  width: 174
                  height: 12
                  min_value: 0
                  max_value: 100
                  value: 0
                  bg_color: ${th.cardBorder}
                  indicator:
                    bg_color: ${th.accent}

        # Karta Temperatur
        - obj:
            x: 246
            y: 54
            width: 224
            height: 132
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            pad_top: 0
            pad_bottom: 0
            pad_left: 0
            pad_right: 0
            widgets:
              # Dysza
              - label:
                  x: 12
                  y: 9
                  text: "\\U000F050F"
                  text_font: font_mdi_20
                  text_color: 0xFB923C
              - label:
                  x: 36
                  y: 10
                  id: lbl_bambu_nozzle
                  text: "Dysza: --"
                  text_font: font_roboto_14
                  text_color: 0xFB923C
              # Stół
              - label:
                  x: 12
                  y: 37
                  text: "\\U000F0238"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  x: 36
                  y: 38
                  id: lbl_bambu_bed
                  text: "Stół: --"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
              # Wentylator
              - label:
                  x: 12
                  y: 65
                  text: "\\U000F0210"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 36
                  y: 66
                  id: lbl_bambu_fan
                  text: "Wentylator: --"
                  text_font: font_roboto_14
                  text_color: ${th.accent}

        # Nazwa drukowanego modelu
        - obj:
            x: 10
            y: 194
            width: 460
            height: 54
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            pad_top: 0
            pad_bottom: 0
            pad_left: 0
            pad_right: 0
            widgets:
              - label:
                  x: 16
                  y: 17
                  text: "\\U000F042B"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 42
                  y: 18
                  id: lbl_bambu_job
                  text: "Brak aktywnego zadania"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
                  long_mode: DOT`;
  }

  // 5. STRONA KALENDARZA: Słońce oraz Kalendarz Familijny (5 wydarzeń)
  else if (screen.id === 'screen_calendar') {
    pageContent = `        # Cykl Słońca (Wschód / Zachód)
        - obj:
            x: 10
            y: 6
            width: 140
            height: 246
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            widgets:
              - label:
                  align: TOP_MID
                  y: 14
                  text: "Słońce & Zmierzch"
                  text_font: font_roboto_14
                  text_color: ${th.accent}
              - label:
                  x: 14
                  y: 76
                  text: "\\U000F0598"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  x: 42
                  y: 77
                  text: "06:14"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
              - label:
                  x: 14
                  y: 132
                  text: "\\U000F059A"
                  text_font: font_mdi_20
                  text_color: ${th.accentMuted}
              - label:
                  x: 42
                  y: 133
                  text: "18:42"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}
              - label:
                  align: BOTTOM_MID
                  y: -16
                  text: "Dzień: 12h 28m"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}

        # Kalendarz Familijny (5 nadchodzących wydarzeń)
        - obj:
            x: 156
            y: 6
            width: 314
            height: 246
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            widgets:
              # Nagłówek Kalendarza Familijnego
              - label:
                  x: 14
                  y: 8
                  text: "\\U000F00ED"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 40
                  y: 9
                  text: "Kalendarz Familijny (5 wydarzeń)"
                  text_font: font_roboto_14
                  text_color: ${th.accent}

${calendarEventLabelsYaml}`;
  }

  // 6. EKRANY NIESTANDARDOWE DODANE PRZEZ UŻYTKOWNIKA
  else {
    const customWidgets = screen.widgets || [];
    if (customWidgets.length === 0) {
      pageContent = `        # Pusty ekran użytkownika
        - obj:
            x: 10
            y: 6
            width: 460
            height: 246
            bg_color: ${th.cardBg}
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12
            widgets:
              - label:
                  align: CENTER
                  text: "${escapeYamlText(screen.title)}"
                  text_font: font_roboto_18
                  text_color: ${th.textPrimary}`;
    } else {
      const isThreeCols = customWidgets.length > 4;
      pageContent = customWidgets.slice(0, 6).map((cw, cwIdx) => {
        const cols = isThreeCols ? 3 : 2;
        const r = Math.floor(cwIdx / cols);
        const c = cwIdx % cols;
        const colW = isThreeCols ? 150 : 224;
        const gapX = isThreeCols ? 5 : 12;
        const x = 10 + c * (colW + gapX);
        const y = 6 + r * 124;
        const mdiIcon = getMdiGlyph(cw.icon || 'Sparkles');
        const safeTitle = escapeYamlText(cw.title);
        const isSens = cw.entityId?.startsWith('sensor.');
        const isDefaultOn = cw.entityId ? (knownStates[cw.entityId] === 'on' || knownStates[cw.entityId] === 'playing') : false;
        const statusLabelId = `lbl_sub_custom_${screen.id}_${cwIdx}`;
        const iconLabelId = `lbl_ico_custom_${screen.id}_${cwIdx}`;
        const initStatus = isSens ? 'Sensor' : (isDefaultOn ? 'WŁ.' : 'WYŁ.');
        const initSubColor = isSens ? th.accentMuted : (isDefaultOn ? th.accent : '0x64748B');
        const initIcoColor = isDefaultOn ? activeIconColor : '0x64748B';

        let clickAct = '';
        if (cw.entityId && !cw.entityId.startsWith('sensor.')) {
          let srv = 'switch.toggle';
          if (cw.entityId.startsWith('light.')) srv = 'light.toggle';
          else if (cw.entityId.startsWith('media_player.')) srv = 'media_player.media_play_pause';
          else if (cw.entityId.startsWith('button.')) srv = 'button.press';
          else if (cw.entityId.startsWith('input_boolean.')) srv = 'input_boolean.toggle';

          clickAct = `
            on_click:
              - homeassistant.service:
                  service: ${srv}
                  data:
                    entity_id: ${cw.entityId}`;
        }

        return `        # Kafelek: ${cw.title}
        - button:
            x: ${x}
            y: ${y}
            width: ${colW}
            height: 118
            scrollable: false
            bg_color: ${th.cardBg}
            bg_opa: COVER
            border_color: ${th.cardBorder}
            border_width: 1
            radius: 12${clickAct}
            widgets:
              - label:
                  align: TOP_MID
                  y: 8
                  width: ${colW - 16}
                  height: 38
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
                  text_align: CENTER
                  long_mode: WRAP
              - label:
                  id: ${statusLabelId}
                  align: TOP_MID
                  y: 50
                  text: "${initStatus}"
                  text_font: font_roboto_14
                  text_color: ${initSubColor}
              - label:
                  id: ${iconLabelId}
                  align: BOTTOM_MID
                  y: -12
                  text: "${mdiIcon}"
                  text_font: font_mdi_28
                  text_color: ${initIcoColor}`;
      }).join('\n');
    }
  }

  // Obliczenie idealnego wyśrodkowania przycisków w dolnym pasku nawigacji
  const tabCount = Math.max(1, config.screens.length);
  const containerW = 464;
  const containerH = 56;
  const btnH = 44;
  const tabGap = 4;
  const totalGaps = (tabCount - 1) * tabGap;
  const targetMargin = 6;
  const availableForTabs = containerW - (2 * targetMargin) - totalGaps;
  const tabW = Math.floor(availableForTabs / tabCount);
  const totalUsedW = tabCount * tabW + totalGaps;
  const startX = Math.round((containerW - totalUsedW) / 2);
  const tabY = Math.round((containerH - btnH) / 2);

  return `    # ================= Ekran: ${screen.title} =================
    - id: page_${screen.id}
      bg_color: ${th.pageBg}
      bg_opa: COVER
      scrollable: false
      scrollbar_mode: 'OFF'
      widgets:
${pageContent}

        # Dolny pasek nawigacyjny z samymi ikonami MDI (Wysokość 56px, wyśrodkowane przyciski)
        - obj:
            x: 8
            y: 254
            width: ${containerW}
            height: ${containerH}
            scrollable: false
            scrollbar_mode: 'OFF'
            bg_color: ${th.navBarBg}
            border_color: ${th.navBarBorder}
            border_width: 1
            radius: 12
            pad_all: 0
            pad_top: 0
            pad_bottom: 0
            pad_left: 0
            pad_right: 0
            widgets:
${config.screens.map((targetScreen, tIdx) => {
  const tabX = startX + tIdx * (tabW + tabGap);
  const isCurrentTab = tIdx === sIdx;
  const mdiIcon = getMdiGlyph(targetScreen.icon);
  return `              # Zakładka: ${targetScreen.title} (Tylko ikona MDI)
              - button:
                  x: ${tabX}
                  y: ${tabY}
                  width: ${tabW}
                  height: ${btnH}
                  pad_all: 0
                  pad_top: 0
                  pad_bottom: 0
                  pad_left: 0
                  pad_right: 0
                  scrollable: false
                  bg_color: ${isCurrentTab ? th.navBtnActive : th.navBtnInactive}
                  border_color: ${isCurrentTab ? th.navBtnActiveBorder : th.cardBorder}
                  border_width: ${isCurrentTab ? 1 : 0}
                  radius: 8
                  on_click:
                    - lvgl.page.show: page_${targetScreen.id}
                  widgets:
                    - label:
                        align: CENTER
                        text: "${mdiIcon}"
                        text_font: font_mdi_28
                        text_color: ${isCurrentTab ? th.navBtnActiveText : th.accentMuted}`;
}).join('\n')}
`;
}).join('\n')}

${sensorBlock}${binaryBlock}${textBlock}
`;
}

export function generateRandomApiKey(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const bytes = new Uint8Array(32);
    window.crypto.getRandomValues(bytes);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  // Fallback 32-byte Base64 key generator
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  for (let i = 0; i < 43; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result + '=';
}

export function generateEsphomeSecretsYaml(config: ConfigProfile): string {
  const secNames = config.secretNames || {
    wifiSsid: 'wifi_ssid',
    wifiPassword: 'wifi_password',
    haApiKey: 'smartdisplay_api_key',
  };
  const actualCreds = config.actualCredentials || {
    wifiSsid: 'MójDom_WiFi',
    wifiPassword: 'TwojeHasloWiFi',
    haApiKey: 'WygenerujUnikalnyKluczBase64LubPozostawPuste',
  };

  return `# ============================================================
# ESPHome secrets.yaml
# Projekt: ${config.name}
# Skopiuj tę treść i wklej do pliku secrets.yaml w ESPHome
# (ESPHome Dashboard -> menu 3 kropek w prawym górnym rogu -> Secrets)
# ============================================================

# Nazwa Twojej sieci WiFi 2.4 GHz
${secNames.wifiSsid || 'wifi_ssid'}: "${actualCreds.wifiSsid || 'MójDom_WiFi'}"

# Hasło do Twojej sieci WiFi
${secNames.wifiPassword || 'wifi_password'}: "${actualCreds.wifiPassword || 'TwojeHasloWiFi'}"

# Klucz szyfrowania Home Assistant API (Noise encryption - 32 bajty base64)
${secNames.haApiKey || 'smartdisplay_api_key'}: "${actualCreds.haApiKey || 'WygenerujUnikalnyKluczBase64LubPozostawPuste'}"
`;
}
