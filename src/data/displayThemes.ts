import { DisplayTheme } from '../types';

export interface ThemePalette {
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardActiveBg: string;
  cardActiveBorder: string;
  accent: string;
  accentMuted: string;
  textPrimary: string;
  navBarBg: string;
  navBarBorder: string;
  navBtnInactive: string;
  navBtnActive: string;
  navBtnActiveBorder: string;
  navBtnActiveText: string;
  heroBg: string;
}

export const THEME_PALETTES: Record<DisplayTheme, ThemePalette> = {
  olive_green: {
    pageBg: '0x0B0F0A',         // Głęboka czerń z oliwkową nutą
    cardBg: '0x151D13',         // Ciemna oliwkowa zieleń dopasowana do obudowy
    cardBorder: '0x2C3D25',     // Oliwkowa krawędź
    cardActiveBg: '0x25391E',   // Aktywny kafel w tonacji tactical olive
    cardActiveBorder: '0x84CC16', // Limonkowo-oliwkowy akcent krawędzi
    accent: '0xA3E635',         // Akcent limonkowo-oliwkowy
    accentMuted: '0x8FA483',    // Stonowana wojskowa zieleń
    textPrimary: '0xF1F7ED',    // Czytelny jasny tekst
    navBarBg: '0x10170E',       // Tło paska nawigacji
    navBarBorder: '0x2C3D25',   // Ramka paska nawigacji
    navBtnInactive: '0x0C120B', // Nieaktywny przycisk nawigacji
    navBtnActive: '0x22331B',   // Aktywny przycisk nawigacji
    navBtnActiveBorder: '0x84CC16',
    navBtnActiveText: '0xBEF264',
    heroBg: '0x1A2517',
  },
  dark_modern: {
    pageBg: '0x0A0A0C',
    cardBg: '0x1E293B',
    cardBorder: '0x334155',
    cardActiveBg: '0x0284C7',
    cardActiveBorder: '0x38BDF8',
    accent: '0x38BDF8',
    accentMuted: '0x94A3B8',
    textPrimary: '0xF8FAFC',
    navBarBg: '0x0F172A',
    navBarBorder: '0x334155',
    navBtnInactive: '0x0A0F1D',
    navBtnActive: '0x1E293B',
    navBtnActiveBorder: '0x38BDF8',
    navBtnActiveText: '0x38BDF8',
    heroBg: '0x1E293B',
  },
  cyber_amber: {
    pageBg: '0x0C0A07',
    cardBg: '0x1F1A12',
    cardBorder: '0x453520',
    cardActiveBg: '0x4D3612',
    cardActiveBorder: '0xF59E0B',
    accent: '0xFBBF24',
    accentMuted: '0xA8977E',
    textPrimary: '0xFEF3C7',
    navBarBg: '0x141009',
    navBarBorder: '0x453520',
    navBtnInactive: '0x120E08',
    navBtnActive: '0x2E2211',
    navBtnActiveBorder: '0xF59E0B',
    navBtnActiveText: '0xFBBF24',
    heroBg: '0x241E15',
  },
  emerald_synth: {
    pageBg: '0x06110D',
    cardBg: '0x0E241B',
    cardBorder: '0x164E38',
    cardActiveBg: '0x10593E',
    cardActiveBorder: '0x10B981',
    accent: '0x34D399',
    accentMuted: '0x71A690',
    textPrimary: '0xECFDF5',
    navBarBg: '0x091A13',
    navBarBorder: '0x164E38',
    navBtnInactive: '0x081510',
    navBtnActive: '0x133829',
    navBtnActiveBorder: '0x10B981',
    navBtnActiveText: '0x34D399',
    heroBg: '0x112C21',
  },
  oled_black: {
    pageBg: '0x000000',
    cardBg: '0x111111',
    cardBorder: '0x27272A',
    cardActiveBg: '0x27272A',
    cardActiveBorder: '0x38BDF8',
    accent: '0x38BDF8',
    accentMuted: '0x71717A',
    textPrimary: '0xFFFFFF',
    navBarBg: '0x080808',
    navBarBorder: '0x27272A',
    navBtnInactive: '0x050505',
    navBtnActive: '0x18181B',
    navBtnActiveBorder: '0x38BDF8',
    navBtnActiveText: '0x38BDF8',
    heroBg: '0x141414',
  },
};

export function hexToCss(colorHex: string): string {
  if (!colorHex) return '#000000';
  if (colorHex.startsWith('0x') || colorHex.startsWith('0X')) {
    return '#' + colorHex.slice(2).padStart(6, '0');
  }
  if (!colorHex.startsWith('#')) {
    return '#' + colorHex;
  }
  return colorHex;
}

export function getThemeCssColors(theme: DisplayTheme = 'olive_green') {
  const p = THEME_PALETTES[theme] || THEME_PALETTES.olive_green;
  return {
    pageBg: hexToCss(p.pageBg),
    cardBg: hexToCss(p.cardBg),
    cardBorder: hexToCss(p.cardBorder),
    cardActiveBg: hexToCss(p.cardActiveBg),
    cardActiveBorder: hexToCss(p.cardActiveBorder),
    accent: hexToCss(p.accent),
    accentMuted: hexToCss(p.accentMuted),
    textPrimary: hexToCss(p.textPrimary),
    navBarBg: hexToCss(p.navBarBg),
    navBarBorder: hexToCss(p.navBarBorder),
    navBtnInactive: hexToCss(p.navBtnInactive),
    navBtnActive: hexToCss(p.navBtnActive),
    navBtnActiveBorder: hexToCss(p.navBtnActiveBorder),
    navBtnActiveText: hexToCss(p.navBtnActiveText),
    heroBg: hexToCss(p.heroBg),
  };
}
