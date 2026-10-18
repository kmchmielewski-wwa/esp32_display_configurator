import { ConfigProfile, HardwarePreset, HAEntity } from '../types';
import { getHardwarePreset } from '../data/hardwarePresets';
import { RAW_CSV_ENTITIES } from '../data/homeAssistantEntities';
import { THEME_PALETTES } from '../data/displayThemes';

// Mapa ikon Material Design Icons (MDI) do kodów Unicode (Pictogrammers / Templarian MDI Webfont)
export const MDI_GLYPH_MAP: Record<string, string> = {
  // Nawigacja i system
  Home: '\\U000F02DC',          // mdi-home
  HomeAssistant: '\\U000F07D0', // mdi-home-assistant
  Dashboard: '\\U000F05CA',     // mdi-view-dashboard
  ViewGrid: '\\U000F05CD',      // mdi-view-grid
  Settings: '\\U000F0493',      // mdi-cog
  Tune: '\\U000F04DF',          // mdi-tune
  Sliders: '\\U000F04DF',       // mdi-tune
  Activity: '\\U000F0429',      // mdi-pulse
  Information: '\\U000F02FD',   // mdi-information-outline
  Alert: '\\U000F0028',         // mdi-alert-circle
  Sparkles: '\\U000F006D',      // mdi-auto-fix

  // Oświetlenie
  Lightbulb: '\\U000F0335',        // mdi-lightbulb
  LightbulbOutline: '\\U000F0336', // mdi-lightbulb-outline
  LightbulbGroup: '\\U000F0E27',   // mdi-lightbulb-group
  CeilingLight: '\\U000F0769',     // mdi-ceiling-light
  WallSconce: '\\U000F0914',       // mdi-wall-sconce
  FloorLamp: '\\U000F08DD',        // mdi-floor-lamp
  DeskLamp: '\\U000F095F',         // mdi-desk-lamp
  LedStrip: '\\U000F07D9',         // mdi-led-strip

  // Zasilanie i energia
  Power: '\\U000F0425',          // mdi-power
  PowerSocket: '\\U000F0426',    // mdi-power-socket-eu
  PowerPlug: '\\U000F06A5',      // mdi-power-plug
  Zap: '\\U000F0241',            // mdi-flash
  Flash: '\\U000F0241',          // mdi-flash
  SolarPower: '\\U000F0A79',     // mdi-solar-power
  SolarPanel: '\\U000F0D99',     // mdi-solar-panel
  BatteryCharging: '\\U000F0084',// mdi-battery-charging
  BatteryHigh: '\\U000F0079',    // mdi-battery
  MeterElectric: '\\U000F03FE',  // mdi-meter-electric

  // Multimedia & Audio/Wideo
  Tv: '\\U000F0502',             // mdi-television
  Television: '\\U000F0502',     // mdi-television
  TvRemote: '\\U000F0454',       // mdi-remote
  Speaker: '\\U000F057E',        // mdi-volume-high
  SpeakerBluetooth: '\\U000F0980',// mdi-speaker-bluetooth
  SpeakerGroup: '\\U000F0D2E',   // mdi-speaker-multiple
  Radio: '\\U000F0434',          // mdi-radio
  Cast: '\\U000F0126',           // mdi-cast
  CastConnected: '\\U000F0127',  // mdi-cast-connected
  CastAudio: '\\U000F0128',      // mdi-cast-audio
  Play: '\\U000F040A',           // mdi-play
  Pause: '\\U000F03E4',          // mdi-pause
  PlayPause: '\\U000F040B',      // mdi-play-pause
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
  VolumeHigh: '\\U000F057E',     // mdi-volume-high
  VolumeMedium: '\\U000F057F',   // mdi-volume-medium
  VolumeLow: '\\U000F0580',      // mdi-volume-low
  VolumeX: '\\U000F075F',        // mdi-volume-mute
  VolumeMute: '\\U000F075F',     // mdi-volume-mute
  VolumeMinus: '\\U000F075E',    // mdi-volume-minus
  VolumePlus: '\\U000F075D',     // mdi-volume-plus
  Music: '\\U000F075A',          // mdi-music
  MusicNote: '\\U000F0383',      // mdi-music-note
  PlaylistMusic: '\\U000F0CB8',  // mdi-playlist-music
  Album: '\\U000F0025',          // mdi-album
  Disc: '\\U000F01BA',           // mdi-disc
  Podcast: '\\U000F0999',        // mdi-podcast
  Movie: '\\U000F037E',          // mdi-movie
  Film: '\\U000F037E',           // mdi-movie
  Video: '\\U000F0567',          // mdi-video
  Hdmi: '\\U000F02D6',           // mdi-video-input-hdmi
  Youtube: '\\U000F05C3',        // mdi-youtube
  Spotify: '\\U000F04CB',        // mdi-spotify
  Netflix: '\\U000F0746',        // mdi-netflix
  Headphones: '\\U000F02CB',     // mdi-headphones
  Microphone: '\\U000F036C',     // mdi-microphone
  SurroundSound: '\\U000F05C5',  // mdi-surround-sound
  Projector: '\\U000F042C',      // mdi-projector
  Equalizer: '\\U000F0EA0',      // mdi-equalizer
  Gamepad: '\\U000F0280',        // mdi-gamepad-variant
  Xbox: '\\U000F05B8',           // mdi-microsoft-xbox
  Playstation: '\\U000F0419',    // mdi-sony-playstation
  GoogleHome: '\\U000F0825',     // mdi-google-home

  // Klimat, ogrzewanie i środowisko
  Thermometer: '\\U000F050F',      // mdi-thermometer
  ThermometerWater: '\\U000F0510', // mdi-thermometer-water
  Thermostat: '\\U000F0511',       // mdi-thermostat
  AirConditioner: '\\U000F001D',   // mdi-air-conditioner
  AirPurifier: '\\U000F0D13',      // mdi-air-purifier
  Fan: '\\U000F0210',              // mdi-fan
  FanSpeed1: '\\U000F11C8',        // mdi-fan-speed-1
  FanSpeed2: '\\U000F11C9',        // mdi-fan-speed-2
  FanSpeed3: '\\U000F11CA',        // mdi-fan-speed-3
  Radiator: '\\U000F08B9',         // mdi-radiator
  Flame: '\\U000F0238',            // mdi-fire
  Fire: '\\U000F0238',             // mdi-fire
  WaterPercent: '\\U000F058E',     // mdi-water-percent
  Droplet: '\\U000F058E',          // mdi-water-percent
  Gauge: '\\U000F029A',            // mdi-gauge
  Sprinkler: '\\U000F0A7B',        // mdi-sprinkler
  Valve: '\\U000F0606',            // mdi-valve
  WaterBoiler: '\\U000F0F37',      // mdi-water-boiler

  // Pogoda i czas
  Sun: '\\U000F0599',              // mdi-weather-sunny
  Sunset: '\\U000F059A',           // mdi-weather-sunset
  Sunrise: '\\U000F0598',          // mdi-weather-sunset-up
  Moon: '\\U000F0594',             // mdi-weather-night
  CloudSun: '\\U000F0595',         // mdi-weather-partly-cloudy
  Rain: '\\U000F0597',             // mdi-weather-rainy
  Calendar: '\\U000F00ED',         // mdi-calendar
  CalendarCheck: '\\U000F00EE',    // mdi-calendar-check
  Clock: '\\U000F0150',            // mdi-clock-outline
  CheckSquare: '\\U000F0135',      // mdi-checkbox-marked
  CheckCircle2: '\\U000F0134',     // mdi-checkbox-marked-circle-outline

  // Bezpieczeństwo i czujniki
  Lock: '\\U000F033E',             // mdi-lock
  LockOpen: '\\U000F033F',         // mdi-lock-open
  Shield: '\\U000F0498',           // mdi-shield
  ShieldCheck: '\\U000F0565',      // mdi-shield-check
  Cctv: '\\U000F07AE',             // mdi-cctv
  Bell: '\\U000F009A',             // mdi-bell
  BellRing: '\\U000F009B',         // mdi-bell-ring
  AlarmLight: '\\U000F078E',       // mdi-alarm-light
  MotionSensor: '\\U000F0D2B',     // mdi-motion-sensor
  DoorOpen: '\\U000F081B',         // mdi-door-open
  DoorClosed: '\\U000F081A',       // mdi-door-closed
  WindowOpen: '\\U000F0588',       // mdi-window-open
  WindowClosed: '\\U000F0585',     // mdi-window-closed
  WindowShutter: '\\U000F07E3',    // mdi-window-shutter
  Garage: '\\U000F06D9',           // mdi-garage
  Car: '\\U000F010B',              // mdi-car
  CarElectric: '\\U000F0B63',      // mdi-car-electric

  // Urządzenia AGD i Druk 3D
  Printer: '\\U000F042A',          // mdi-printer
  Printer3d: '\\U000F042B',        // mdi-printer-3d
  'printer-3d': '\\U000F042B',     // mdi-printer-3d
  RobotVacuum: '\\U000F070C',      // mdi-robot-vacuum
  WashingMachine: '\\U000F0592',   // mdi-washing-machine
  Dishwasher: '\\U000F0AAC',       // mdi-dishwasher
  Fridge: '\\U000F028F',           // mdi-fridge
  Microwave: '\\U000F0C7A',        // mdi-microwave
  Kettle: '\\U000F05FA',           // mdi-kettle
  CoffeeMaker: '\\U000F017E',      // mdi-coffee-maker
  Box: '\\U000F01C9',              // mdi-cube-outline
  Layers: '\\U000F0328',           // mdi-layers

  // Sieć, ESP32 i Hardware
  Wifi: '\\U000F05A9',             // mdi-wifi
  WifiOff: '\\U000F05AA',          // mdi-wifi-off
  RouterWireless: '\\U000F0463',   // mdi-router-wireless
  Ethernet: '\\U000F0200',         // mdi-ethernet
  Bluetooth: '\\U000F00AF',        // mdi-bluetooth
  Chip: '\\U000F061A',             // mdi-chip
  Cpu: '\\U000F061A',              // mdi-chip
  Memory: '\\U000F061B',           // mdi-memory
  Server: '\\U000F048B',           // mdi-server
  HardDrive: '\\U000F02CA',        // mdi-harddisk
};

export function getMdiGlyph(iconName?: string): string {
  if (!iconName) return '\\U000F006D';
  if (MDI_GLYPH_MAP[iconName]) return MDI_GLYPH_MAP[iconName];
  const normalized = iconName.toLowerCase().replace(/[-_]/g, '');
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
  const hasCalendarScreen = config.screens.some(s => s.id === 'screen_calendar');
  const mediaScreen = config.screens.find(s => s.id === 'screen_media');
  const hasMediaScreen = Boolean(mediaScreen);
  const mediaWidget = mediaScreen?.widgets[0];
  const mediaEntityId = mediaWidget?.entityId || 'media_player.mi_box_2';

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
${hasCalendarScreen ? `              - lvgl.label.update:
                  id: lbl_cal_temp
                  text: !lambda |-
                    char buf[16];
                    snprintf(buf, sizeof(buf), "%.1f°C", x);
                    return std::string(buf);` : ''}
${uniqueSensors.map(id => `  - platform: homeassistant
    id: ${id.replace(/[^a-zA-Z0-9_]/g, '_')}
    entity_id: ${id}`).join('\n\n')}
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
                  text_color: ${th.accent}`).join('\n')}
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
${hasCalendarScreen ? `              - lvgl.label.update:
                  id: lbl_cal_weather_desc
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
${uniqueTexts.map(id => `  - platform: homeassistant
    id: ${id.replace(/[^a-zA-Z0-9_]/g, '_')}
    entity_id: ${id}`).join('\n\n')}
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
${hasCalendarScreen ? `      - lvgl.label.update:
          id: lbl_cal_clock
          text: !lambda |-
            return id(ha_time).now().strftime("%H:%M");
      - lvgl.label.update:
          id: lbl_cal_date
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

  # Czcionka nagłówkowa 18px dla tytułów i parametrów
  - file: "gfonts://Roboto"
    id: font_roboto_18
    size: 18
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
              - label:
                  id: lbl_home_clock
                  x: 16
                  y: 8
                  text: "--:--"
                  text_font: font_clock_38
                  text_color: 0xFFFFFF
              - label:
                  id: lbl_home_date
                  x: 16
                  y: 54
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
                  x: 320
                  y: 44
                  text: "\\U000F0599"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  id: lbl_home_weather_desc
                  x: 346
                  y: 46
                  text: "Moja Lokalizacja"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24

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
  const safeTitle = escapeYamlText(safeSlice(qw.title, 14));
  const isDefaultOn = qw.entityId ? (knownStates[qw.entityId] === 'on' || knownStates[qw.entityId] === 'playing') : false;
  const statusLabelId = `lbl_sub_home_${qIdx}`;
  const iconLabelId = `lbl_ico_home_${qIdx}`;
  const safeSub = isSens ? 'Postęp' : qw.entityId?.startsWith('media_player.') ? (isDefaultOn ? 'Odtwarza' : 'Pauza') : (isDefaultOn ? 'WŁ.' : 'WYŁ.');
  const initSubColor = isSens ? th.accentMuted : (isDefaultOn ? th.accent : '0x64748B');
  const initIcoColor = isDefaultOn ? th.accent : '0x64748B';

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
              # Tekst na górze
              - label:
                  align: TOP_MID
                  y: 10
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
              - label:
                  id: ${statusLabelId}
                  align: TOP_MID
                  y: 32
                  text: "${safeSub}"
                  text_font: font_roboto_14
                  text_color: ${initSubColor}
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
  const safeTitle = escapeYamlText(safeSlice(sw.title, 16));
  const isDefaultOn = sw.entityId ? (knownStates[sw.entityId] === 'on' || knownStates[sw.entityId] === 'playing') : false;
  const statusLabelId = `lbl_sub_lights_${swIdx}`;
  const iconLabelId = `lbl_ico_lights_${swIdx}`;
  const initStatus = isDefaultOn ? 'WŁ.' : 'WYŁ.';
  const initColor = isDefaultOn ? th.accent : '0x64748B';

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
                  align: TOP_MID
                  y: 8
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
              - label:
                  id: ${statusLabelId}
                  align: TOP_MID
                  y: 30
                  text: "${initStatus}"
                  text_font: font_roboto_14
                  text_color: ${initColor}
              - label:
                  id: ${iconLabelId}
                  align: BOTTOM_MID
                  y: -12
                  text: "${mdiIcon}"
                  text_font: font_mdi_28
                  text_color: ${initColor}`;
}).join('\n')}`;
  }

  // 3. STRONA MULTIMEDIÓW: Dedykowana karta multimediów - Etykieta Multimedia, Wykonawca i Tytuł odtwarzanego utworu
  else if (screen.id === 'screen_media') {
    const med = screen.widgets[0] || { entityId: 'media_player.mi_box_2', title: 'Multimedia' };
    const pEntity = med.entityId || 'media_player.mi_box_2';
    pageContent = `        # Dedykowany Odtwarzacz Multimediów (Etykieta Multimedia, Wykonawca, Tytuł utworu)
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
              # Etykieta Multimedia na górze
              - label:
                  align: TOP_MID
                  y: 8
                  text: "Multimedia"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}

              # Tytuł odtwarzanego utworu
              - label:
                  id: lbl_media_title
                  align: TOP_MID
                  y: 26
                  width: 440
                  text: "Bohemian Rhapsody"
                  text_font: font_roboto_18
                  text_color: ${th.textPrimary}
                  long_mode: SCROLL_CIRCULAR

              # Wykonawca utworu
              - label:
                  id: lbl_media_artist
                  align: TOP_MID
                  y: 50
                  width: 440
                  text: "Queen"
                  text_font: font_roboto_14
                  text_color: ${th.accent}
                  long_mode: DOT

              # Przyciski Nawigacji Muzycznej - ikony MDI
              - button:
                  x: 60
                  y: 78
                  width: 100
                  height: 66
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
                  y: 78
                  width: 100
                  height: 66
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
                        align: CENTER
                        text: "\\U000F040A"
                        text_font: font_mdi_28
                        text_color: 0xFFFFFF
              - button:
                  x: 300
                  y: 78
                  width: 100
                  height: 66
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
                  x: 60
                  y: 154
                  width: 100
                  height: 66
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
                        text_color: ${th.accent}
              - button:
                  x: 180
                  y: 154
                  width: 100
                  height: 66
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
                        text_color: ${th.accent}
              - button:
                  x: 300
                  y: 154
                  width: 100
                  height: 66
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
                        text_color: ${th.accent}`;
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
                  text: "Bambu Lab A1 Mini · esp32_cyd_enclosure.gcode"
                  text_font: font_roboto_14
                  text_color: ${th.accent}

        # Karta Postępu Druku
        - obj:
            x: 10
            y: 54
            width: 224
            height: 102
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
                  text: "Postęp: 68%"
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
                  text: "Warstwa: 184 / 270"
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
                  text: "Pozostało: 42 min"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}

        # Karta Temperatur
        - obj:
            x: 246
            y: 54
            width: 224
            height: 102
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
                  text: "Dysza: 220°C / 220°C"
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
                  text: "Stół: 60°C / 60°C"
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
                  text: "Wentylator: 100%"
                  text_font: font_roboto_14
                  text_color: ${th.accent}

        # Dolny pasek parametrów druku z ikonami
        - obj:
            x: 10
            y: 162
            width: 460
            height: 86
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
                  y: 10
                  text: "\\U000F01C9"
                  text_font: font_mdi_20
                  text_color: ${th.accent}
              - label:
                  x: 42
                  y: 11
                  text: "Status: Drukowanie · Profil: Standard 0.2mm"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
              - label:
                  x: 16
                  y: 44
                  text: "\\U000F0150"
                  text_font: font_mdi_20
                  text_color: ${th.accentMuted}
              - label:
                  x: 42
                  y: 45
                  text: "Całkowity czas pracy zadania: 1h 24m · Drukarka Online"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}`;
  }

  // 5. STRONA KALENDARZA: Zegar, Aura, Słońce oraz Kalendarz Familijny (5 wydarzeń)
  else if (screen.id === 'screen_calendar') {
    pageContent = `        # Karta Zegara i Pogody z Ikonami (Moja Lokalizacja)
        - obj:
            x: 10
            y: 6
            width: 460
            height: 64
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
                  id: lbl_cal_clock
                  x: 16
                  y: 8
                  text: "--:--"
                  text_font: font_clock_38
                  text_color: 0xFFFFFF
              - label:
                  id: lbl_cal_date
                  x: 16
                  y: 44
                  text: "Wczytywanie..."
                  text_font: font_roboto_14
                  text_color: ${th.accent}
              - label:
                  id: lbl_cal_temp
                  x: 320
                  y: 10
                  text: "--.-°C"
                  text_font: font_roboto_18
                  text_color: ${th.accent}
              - label:
                  x: 320
                  y: 38
                  text: "\\U000F0599"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  id: lbl_cal_weather_desc
                  x: 346
                  y: 39
                  text: "Moja Lokalizacja"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24

        # Cykl Słońca (Wschód / Zachód)
        - obj:
            x: 10
            y: 76
            width: 140
            height: 176
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
                  y: 10
                  text: "Słońce & Zmierzch"
                  text_font: font_roboto_14
                  text_color: ${th.accent}
              - label:
                  x: 14
                  y: 46
                  text: "\\U000F0598"
                  text_font: font_mdi_20
                  text_color: 0xFBBF24
              - label:
                  x: 42
                  y: 47
                  text: "06:14"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
              - label:
                  x: 14
                  y: 82
                  text: "\\U000F059A"
                  text_font: font_mdi_20
                  text_color: ${th.accentMuted}
              - label:
                  x: 42
                  y: 83
                  text: "18:42"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}
              - label:
                  align: BOTTOM_MID
                  y: -12
                  text: "Dzień: 12h 28m"
                  text_font: font_roboto_14
                  text_color: ${th.accentMuted}

        # Kalendarz Familijny (5 nadchodzących wydarzeń)
        - obj:
            x: 156
            y: 76
            width: 314
            height: 176
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

              # Wydarzenie 1
              - label:
                  x: 14
                  y: 36
                  text: "NDZ 14:00"
                  text_font: font_roboto_14
                  text_color: 0xFBBF24
              - label:
                  x: 95
                  y: 36
                  text: "Obiad rodzinny"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}

              # Wydarzenie 2
              - label:
                  x: 14
                  y: 64
                  text: "PON 17:30"
                  text_font: font_roboto_14
                  text_color: 0x38BDF8
              - label:
                  x: 95
                  y: 64
                  text: "Trening dzieci / Zajęcia"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}

              # Wydarzenie 3
              - label:
                  x: 14
                  y: 92
                  text: "WT 10:15"
                  text_font: font_roboto_14
                  text_color: 0xFB7185
              - label:
                  x: 95
                  y: 92
                  text: "Wizyta u lekarza"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}

              # Wydarzenie 4
              - label:
                  x: 14
                  y: 120
                  text: "CZW Cały"
                  text_font: font_roboto_14
                  text_color: 0xC084FC
              - label:
                  x: 95
                  y: 120
                  text: "Urodziny Mamy"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}

              # Wydarzenie 5
              - label:
                  x: 14
                  y: 148
                  text: "SOB 09:00"
                  text_font: font_roboto_14
                  text_color: 0x34D399
              - label:
                  x: 95
                  y: 148
                  text: "Wyjazd weekendowy"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}`;
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
        const safeTitle = escapeYamlText(safeSlice(cw.title, isThreeCols ? 15 : 22));
        const isSens = cw.entityId?.startsWith('sensor.');
        const isDefaultOn = cw.entityId ? (knownStates[cw.entityId] === 'on' || knownStates[cw.entityId] === 'playing') : false;
        const statusLabelId = `lbl_sub_custom_${screen.id}_${cwIdx}`;
        const iconLabelId = `lbl_ico_custom_${screen.id}_${cwIdx}`;
        const initStatus = isSens ? escapeYamlText(safeSlice(cw.subtitle || 'Kafelek', isThreeCols ? 18 : 26)) : (isDefaultOn ? 'WŁ.' : 'WYŁ.');
        const initSubColor = isSens ? th.accentMuted : (isDefaultOn ? th.accent : '0x64748B');
        const initIcoColor = isDefaultOn ? th.accent : '0x64748B';

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
                  text: "${safeTitle}"
                  text_font: font_roboto_14
                  text_color: ${th.textPrimary}
              - label:
                  id: ${statusLabelId}
                  align: TOP_MID
                  y: 30
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
