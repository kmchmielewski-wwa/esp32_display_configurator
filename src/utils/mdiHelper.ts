// Helper to map icon names to Material Design Icons (MDI) Unicode characters and CSS classes
// 100% compatible with Templarian MaterialDesign-Webfont used in ESPHome LVGL
import { MDI_GLYPH_MAP } from '../generators/esphomeYamlGenerator';

// Cache for unicode characters
const CODE_POINT_CACHE: Record<string, string> = {};

export function getMdiChar(iconName?: string): string {
  if (!iconName) return '\u{F02DC}'; // mdi-home default
  if (CODE_POINT_CACHE[iconName]) return CODE_POINT_CACHE[iconName];

  // If already a unicode character
  if (iconName.length === 1 || iconName.length === 2) {
    return iconName;
  }

  // Look up in MDI_GLYPH_MAP
  const rawCode =
    MDI_GLYPH_MAP[iconName] ||
    MDI_GLYPH_MAP[iconName.replace(/[-_]/g, '')] ||
    MDI_GLYPH_MAP[iconName.charAt(0).toUpperCase() + iconName.slice(1)];

  if (rawCode && rawCode.startsWith('\\U000')) {
    const hex = rawCode.replace('\\U000', '');
    const codePoint = parseInt(hex, 16);
    if (!isNaN(codePoint)) {
      const char = String.fromCodePoint(codePoint);
      CODE_POINT_CACHE[iconName] = char;
      return char;
    }
  }

  // Common direct mappings
  const directMap: Record<string, number> = {
    Home: 0xF02DC,
    Lightbulb: 0xF0335,
    Power: 0xF0425,
    Zap: 0xF0241,
    Tv: 0xF0502,
    Play: 0xF040A,
    Pause: 0xF03E4,
    SkipBack: 0xF04AE,
    SkipForward: 0xF04AD,
    Volume1: 0xF075E,
    Volume2: 0xF057E,
    VolumeX: 0xF075F,
    Printer: 0xF042A,
    Printer3d: 0xF042B,
    'printer-3d': 0xF042B,
    Calendar: 0xF00ED,
    Clock: 0xF0150,
    Sun: 0xF0599,
    Sunrise: 0xF0598,
    Sunset: 0xF059A,
    Gauge: 0xF029A,
    Layers: 0xF0328,
    Thermometer: 0xF050F,
    Flame: 0xF0238,
    Fan: 0xF0210,
    Radio: 0xF01C9,
    Activity: 0xF0429,
    Box: 0xF00BE,
    Sparkles: 0xF006D,
  };

  const code = directMap[iconName] || directMap[iconName.replace(/[-_]/g, '')];
  if (code) {
    const char = String.fromCodePoint(code);
    CODE_POINT_CACHE[iconName] = char;
    return char;
  }

  return '\u{F02DC}';
}
