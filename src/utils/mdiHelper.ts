import { getMdiGlyph } from '../generators/esphomeYamlGenerator';

export function getMdiChar(iconName?: string): string {
  if (iconName && Array.from(iconName).length === 1) {
    const codePoint = iconName.codePointAt(0);
    if (codePoint !== undefined && codePoint >= 0xf0000 && codePoint <= 0xffffd) {
      return iconName;
    }
  }

  const rawCode = getMdiGlyph(iconName);

  if (!rawCode.startsWith('\\U000')) {
    return rawCode;
  }

  const codePoint = parseInt(rawCode.slice('\\U000'.length), 16);
  return Number.isNaN(codePoint) ? rawCode : String.fromCodePoint(codePoint);
}
