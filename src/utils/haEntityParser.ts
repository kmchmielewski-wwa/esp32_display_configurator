import { HAEntity } from '../types';

/**
 * Maps Home Assistant domain to appropriate category
 */
export function getCategoryFromDomain(domain: string): HAEntity['category'] {
  switch (domain) {
    case 'light':
    case 'switch':
      return 'lights';
    case 'media_player':
      return 'media';
    case 'sensor':
    case 'binary_sensor':
    case 'number':
      return 'sensors';
    case 'weather':
    case 'sun':
    case 'calendar':
    case 'todo':
      return 'calendar_sun';
    default:
      return 'other';
  }
}

/**
 * Suggests an icon name based on entity_id and attributes
 */
export function suggestIconForEntity(entityId: string, attributes?: Record<string, any>): string {
  const [domain, name = ''] = entityId.toLowerCase().split('.');
  const lowerName = name.toLowerCase();

  // Check HA icon attribute first (e.g. mdi:television -> Television)
  if (attributes?.icon && typeof attributes.icon === 'string') {
    const iconName = attributes.icon.replace(/^mdi:/, '').replace(/[-_]/g, '');
    const iconMapping: Record<string, string> = {
      television: 'Tv',
      tv: 'Tv',
      lightbulb: 'Lightbulb',
      fan: 'Fan',
      thermometer: 'Thermometer',
      gauge: 'Gauge',
      speaker: 'Speaker',
      cast: 'Cast',
      radio: 'Radio',
      power: 'Power',
      flash: 'Zap',
      printer3d: 'Printer3d',
      printer: 'Printer',
      airconditioner: 'AirConditioner',
      lock: 'Lock',
      cctv: 'Cctv',
      bell: 'Bell',
      motion: 'MotionSensor',
      weather: 'CloudSun',
      weatherpartlycloudy: 'CloudSun',
      weathersunny: 'Sun',
      weathernight: 'Moon',
      volumehigh: 'VolumeHigh',
      music: 'Music',
    };
    if (iconMapping[iconName]) return iconMapping[iconName];
  }

  // Domain & name pattern matching
  if (domain === 'light') {
    if (lowerName.includes('led') || lowerName.includes('pasek') || lowerName.includes('strip')) return 'LedStrip';
    if (lowerName.includes('sufit') || lowerName.includes('ceiling')) return 'CeilingLight';
    if (lowerName.includes('biurk') || lowerName.includes('desk')) return 'DeskLamp';
    return 'Lightbulb';
  }

  if (domain === 'media_player') {
    if (lowerName.includes('tv') || lowerName.includes('telewizor') || lowerName.includes('philips') || lowerName.includes('samsung') || lowerName.includes('lg')) return 'Tv';
    if (lowerName.includes('glosnik') || lowerName.includes('speaker') || lowerName.includes('audio') || lowerName.includes('soundbar')) return 'Speaker';
    if (lowerName.includes('chromecast') || lowerName.includes('cast')) return 'Cast';
    if (lowerName.includes('radio')) return 'Radio';
    return 'Tv';
  }

  if (domain === 'climate') return 'Thermostat';
  if (domain === 'weather') return 'CloudSun';
  if (domain === 'sun') return 'Sun';
  if (domain === 'calendar') return 'Calendar';
  if (domain === 'todo') return 'CheckSquare';

  if (lowerName.includes('temp')) return 'Thermometer';
  if (lowerName.includes('wilgotnos') || lowerName.includes('hum')) return 'WaterPercent';
  if (lowerName.includes('moc') || lowerName.includes('power') || lowerName.includes('watt') || lowerName.includes('energy') || lowerName.includes('energia')) return 'Zap';
  if (lowerName.includes('wifi') || lowerName.includes('signal') || lowerName.includes('rssi')) return 'Wifi';
  if (lowerName.includes('bambu') || lowerName.includes('druk') || lowerName.includes('print')) return 'Printer3d';
  if (lowerName.includes('wentylator') || lowerName.includes('fan')) return 'Fan';
  if (lowerName.includes('bateria') || lowerName.includes('battery')) return 'BatteryHigh';
  if (lowerName.includes('drzwi') || lowerName.includes('door')) return 'DoorClosed';
  if (lowerName.includes('okno') || lowerName.includes('window')) return 'WindowClosed';
  if (lowerName.includes('roleta') || lowerName.includes('shutter') || lowerName.includes('blind')) return 'WindowShutter';
  if (lowerName.includes('zamek') || lowerName.includes('lock')) return 'Lock';
  if (lowerName.includes('ruch') || lowerName.includes('motion')) return 'MotionSensor';
  if (lowerName.includes('cpu') || lowerName.includes('chip') || lowerName.includes('ram')) return 'Chip';
  if (lowerName.includes('czas') || lowerName.includes('uptime') || lowerName.includes('time')) return 'Clock';

  if (domain === 'switch') return 'Power';
  if (domain === 'binary_sensor') return 'Activity';
  return 'Gauge';
}

/**
 * Format friendly name from entity_id if not provided
 */
export function formatFriendlyName(entityId: string): string {
  const parts = entityId.split('.');
  const rawName = parts.length > 1 ? parts[1] : parts[0];
  return rawName
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();
}

/**
 * Parse entities from CSV text (supports HA Developer Tools -> States CSV exports)
 */
export function parseHaCsv(text: string): HAEntity[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Determine delimiter: comma, semicolon, or tab
  const headerLine = lines[0];
  let delimiter = ',';
  if (headerLine.includes(';') && !headerLine.includes(',')) delimiter = ';';
  else if (headerLine.includes('\t')) delimiter = '\t';

  // Parse header columns
  const headerCols = headerLine.split(delimiter).map(c => c.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const entityIdx = headerCols.findIndex(c => c === 'entity_id' || c === 'entity' || c.includes('entity'));
  const stateIdx = headerCols.findIndex(c => c === 'state' || c === 'stan' || c.includes('state'));
  const attrIdx = headerCols.findIndex(c => c === 'attributes' || c === 'atrybuty' || c.includes('attribute'));

  const results: HAEntity[] = [];
  const startLine = entityIdx !== -1 ? 1 : 0;

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser supporting quotes
    const cells: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        cells.push(cur.trim().replace(/^["']|["']$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim().replace(/^["']|["']$/g, ''));

    const rawEntity = entityIdx !== -1 && cells[entityIdx] ? cells[entityIdx] : cells[0];
    if (!rawEntity || !rawEntity.includes('.')) continue;

    const entity_id = rawEntity.trim();
    const domain = entity_id.split('.')[0] || 'sensor';
    const state = (stateIdx !== -1 && cells[stateIdx]) ? cells[stateIdx] : (cells[1] || 'unknown');
    const rawAttrs = (attrIdx !== -1 && cells[attrIdx]) ? cells[attrIdx] : '';

    let friendlyName = '';
    let unit: string | undefined = undefined;

    // Try parsing friendly_name and unit from attributes JSON / text
    if (rawAttrs) {
      try {
        const parsedAttrs = JSON.parse(rawAttrs);
        friendlyName = parsedAttrs.friendly_name || '';
        unit = parsedAttrs.unit_of_measurement;
      } catch {
        const fnMatch = rawAttrs.match(/friendly_name["']?:\s*["']?([^"',}\n]+)/i);
        if (fnMatch) friendlyName = fnMatch[1].trim();
        const unitMatch = rawAttrs.match(/unit_of_measurement["']?:\s*["']?([^"',}\n]+)/i);
        if (unitMatch) unit = unitMatch[1].trim();
      }
    }

    results.push({
      entity_id,
      name: friendlyName || formatFriendlyName(entity_id),
      state: state || 'unknown',
      domain,
      unit,
      category: getCategoryFromDomain(domain),
    });
  }

  return results;
}

/**
 * Parse entities from JSON text (array of states or states object)
 */
export function parseHaJson(text: string): HAEntity[] {
  const data = JSON.parse(text);
  const results: HAEntity[] = [];

  const processEntity = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    const entity_id = obj.entity_id || obj.id;
    if (!entity_id || typeof entity_id !== 'string' || !entity_id.includes('.')) return;

    const domain = entity_id.split('.')[0] || 'sensor';
    const attrs = obj.attributes || {};
    const name = attrs.friendly_name || obj.name || formatFriendlyName(entity_id);
    const state = String(obj.state ?? 'unknown');
    const unit = attrs.unit_of_measurement || obj.unit;

    results.push({
      entity_id,
      name,
      state,
      domain,
      unit,
      category: getCategoryFromDomain(domain),
    });
  };

  if (Array.isArray(data)) {
    data.forEach(processEntity);
  } else if (typeof data === 'object') {
    Object.entries(data).forEach(([key, val]) => {
      if (val && typeof val === 'object' && !(val as any).entity_id) {
        (val as any).entity_id = key;
      }
      processEntity(val);
    });
  }

  return results;
}

/**
 * Parse entities from YAML or generic plain text lines
 */
export function parseHaPlainTextOrYaml(text: string): HAEntity[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const results: HAEntity[] = [];
  const knownDomains = new Set([
    'light', 'switch', 'sensor', 'binary_sensor', 'media_player',
    'climate', 'weather', 'sun', 'todo', 'camera', 'fan', 'cover',
    'lock', 'button', 'number', 'select', 'scene', 'automation', 'script'
  ]);

  for (const line of lines) {
    // Strip bullet points, leading dash, quotes, colons
    const clean = line.replace(/^[-*]\s*/, '').replace(/[:;,]$/, '').trim();
    // Regex for domain.name pattern
    const match = clean.match(/([a-z_]+)\.([a-z0-9_]+)/i);
    if (match) {
      const domain = match[1].toLowerCase();
      if (knownDomains.has(domain)) {
        const entity_id = `${domain}.${match[2].toLowerCase()}`;
        // Extract possible trailing name or state: e.g. "light.salon # Salon Główne"
        let name = '';
        const commentMatch = line.match(/[#//]\s*(.*)$/);
        if (commentMatch) name = commentMatch[1].trim();

        results.push({
          entity_id,
          name: name || formatFriendlyName(entity_id),
          state: 'unknown',
          domain,
          category: getCategoryFromDomain(domain),
        });
      }
    }
  }

  return results;
}

/**
 * Universal auto-detecting parser that accepts file text in any format
 */
export function parseHaFileContent(content: string): HAEntity[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  // Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const jsonRes = parseHaJson(trimmed);
      if (jsonRes.length > 0) return jsonRes;
    } catch {
      // not JSON, continue
    }
  }

  // Try CSV if lines contain commas or semicolons
  if (trimmed.includes(',') || trimmed.includes(';')) {
    const csvRes = parseHaCsv(trimmed);
    if (csvRes.length > 0) return csvRes;
  }

  // Fallback to text / YAML line parser
  return parseHaPlainTextOrYaml(trimmed);
}
