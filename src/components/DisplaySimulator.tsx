import React, { useState, useEffect, useRef } from 'react';
import { ConfigProfile, DisplayScreen, DisplayTheme } from '../types';
import { getHardwarePreset } from '../data/hardwarePresets';
import { getThemeCssColors } from '../data/displayThemes';
import { getMdiChar } from '../utils/mdiHelper';
import { Radio, Eye, Layers, Moon, Sun, Sparkles } from 'lucide-react';

interface DisplaySimulatorProps {
  config: ConfigProfile;
  activeScreenIndex: number;
  onScreenChange: (index: number) => void;
  entityStates: Record<string, any>;
  onEntityStateToggle: (entityId: string, secondaryId?: string) => void;
  onUpdateSimulatedState: (key: string, value: any) => void;
  onThemeChange?: (theme: DisplayTheme) => void;
}

const POLISH_DAYS = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const POLISH_MONTHS = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];
const ACTIVE_ICON_COLOR = '#FBBF24';

const MediaMarquee: React.FC<{
  text: string;
  top: string;
  fontSize: string;
  fontWeight: number;
  color: string;
}> = ({ text, top, fontSize, fontWeight, color }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    const content = textRef.current;
    if (!viewport || !content) return;

    const updateOverflow = () => setIsOverflowing(content.scrollWidth > viewport.clientWidth + 1);
    updateOverflow();
    const resizeObserver = new ResizeObserver(updateOverflow);
    resizeObserver.observe(viewport);
    resizeObserver.observe(content);
    return () => resizeObserver.disconnect();
  }, [text]);

  return (
    <div
      ref={viewportRef}
      className="absolute flex items-center overflow-hidden"
      style={{
        left: '12px',
        right: '12px',
        top,
        height: fontSize === '24px' ? '31px' : '24px',
        fontSize,
        fontWeight,
        color,
        fontFamily: 'Roboto, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        ref={textRef}
        className={`flex w-max shrink-0 ${isOverflowing ? 'media-marquee-track' : ''}`}
        style={{ margin: isOverflowing ? undefined : '0 auto', gap: isOverflowing ? '32px' : undefined }}
      >
        <span>{text}</span>
        {isOverflowing && <span aria-hidden="true">{text}</span>}
      </div>
    </div>
  );
};

export const DisplaySimulator: React.FC<DisplaySimulatorProps> = ({
  config,
  activeScreenIndex,
  onScreenChange,
  entityStates,
  onEntityStateToggle,
  onUpdateSimulatedState,
  onThemeChange,
}) => {
  const [touchPoint, setTouchPoint] = useState<{ x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showBezel, setShowBezel] = useState<boolean>(true);
  const [isSimulatedNightMode, setIsSimulatedNightMode] = useState<boolean>(false);
  const [isWokenUpByTouch, setIsWokenUpByTouch] = useState<boolean>(false);

  const nightMode = config.nightMode || {
    enabled: true,
    startHour: 23,
    startMinute: 0,
    endHour: 6,
    endMinute: 30,
    wakeOnTouch: true,
    completelyOff: true,
  };

  const isEntityActive = (entityId?: string): boolean => {
    if (!entityId) return false;
    const val = entityStates[entityId];
    return val === 'on' || val === true || val === 'playing';
  };

  const hw = getHardwarePreset(config.hardwarePresetId);
  const isLandscape = config.orientation === 'landscape';

  const screenWidth = isLandscape
    ? Math.max(hw.resolution.width, hw.resolution.height)
    : Math.min(hw.resolution.width, hw.resolution.height);
  const screenHeight = isLandscape
    ? Math.min(hw.resolution.width, hw.resolution.height)
    : Math.max(hw.resolution.width, hw.resolution.height);

  // Live simulated clock & date (aktualizowany co 1 sekundę)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = () => setCurrentDate(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format daty i godziny identyczny jak w kodzie C++ ESPHome (lambda LVGL)
  const timeFormatted = currentDate.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateEsphomeFormatted = `${POLISH_DAYS[currentDate.getDay()]}, ${currentDate.getDate()} ${
    POLISH_MONTHS[currentDate.getMonth()]
  }`;

  // Pogoda dla lokalizacji użytkownika
  const weatherTemp =
    entityStates['sensor.weather_temperature'] ||
    entityStates['weather.forecast_dom']?.temperature ||
    entityStates['weather.home']?.temperature ||
    '21.4';
  const weatherCondRaw =
    entityStates['weather.forecast_dom'] || entityStates['weather.home'] || 'partlycloudy';

  const getWeatherLabel = (cond: string) => {
    switch (cond) {
      case 'sunny':
      case 'clear-night':
        return 'Słonecznie';
      case 'partlycloudy':
        return 'Częściowo pochmurno';
      case 'cloudy':
        return 'Pochmurno';
      case 'rainy':
      case 'pouring':
        return 'Deszcz';
      case 'lightning':
      case 'lightning-rainy':
        return 'Burza';
      case 'snowy':
        return 'Śnieg';
      case 'fog':
        return 'Mgła';
      case 'windy':
        return 'Wietrznie';
      default:
        return 'Moja Lokalizacja';
    }
  };
  const weatherDesc = getWeatherLabel(weatherCondRaw);

  const handleTouchFeedback = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTouchPoint({ x, y });
    setTimeout(() => setTouchPoint(null), 350);
  };

  const activeScreen: DisplayScreen =
    config.screens[activeScreenIndex] || config.screens[0];
  const getBambuValue = (
    type: DisplayScreen['widgets'][number]['type'],
    field: 'entityId' | 'secondaryEntityId',
    fallback: string,
  ) => {
    const widget = activeScreen.widgets.find(item => item.type === type);
    const entityId = widget?.[field];
    const value = entityId ? entityStates[entityId] : undefined;
    return value === undefined || value === null || value === '' || value === 'unknown' || value === 'unavailable'
      ? fallback
      : String(value);
  };
  const bambuJob = getBambuValue('bambu_file_info', 'entityId', 'Brak aktywnego zadania');
  const bambuState = getBambuValue('bambu_file_info', 'secondaryEntityId', '--');
  const bambuProgressValue = getBambuValue('bambu_progress', 'entityId', '');
  const bambuProgress = bambuProgressValue ? Number(bambuProgressValue) : Number.NaN;
  const bambuRemaining = getBambuValue('bambu_progress', 'secondaryEntityId', '--');
  const bambuNozzle = getBambuValue('bambu_temperatures', 'entityId', '--');
  const bambuBed = getBambuValue('bambu_temperatures', 'secondaryEntityId', '--');
  const bambuFan = getBambuValue('bambu_stats_overview', 'entityId', '--');
  const formattedBambuRemaining = (() => {
    const raw = bambuRemaining.trim();
    if (!raw || raw === '--') return '--';

    const clock = raw.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
    if (clock) {
      const totalMinutes = clock[3] === undefined
        ? Number(clock[1]) * 60 + Number(clock[2])
        : Math.round((Number(clock[1]) * 3600 + Number(clock[2]) * 60 + Number(clock[3])) / 60);
      return `${Math.floor(totalMinutes / 60)}h ${String(totalMinutes % 60).padStart(2, '0')}min`;
    }

    const hoursAndMinutes = raw.match(/(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+(?:\.\d+)?)\s*(?:m|min))?/i);
    if (hoursAndMinutes && (hoursAndMinutes[1] || hoursAndMinutes[2])) {
      const totalMinutes = Math.round(Number(hoursAndMinutes[1] || 0) * 60 + Number(hoursAndMinutes[2] || 0));
      return `${Math.floor(totalMinutes / 60)}h ${String(totalMinutes % 60).padStart(2, '0')}min`;
    }

    const numericMinutes = Number(raw);
    if (Number.isFinite(numericMinutes)) {
      const totalMinutes = Math.round(numericMinutes);
      return `${Math.floor(totalMinutes / 60)}h ${String(totalMinutes % 60).padStart(2, '0')}min`;
    }
    return raw;
  })();

  // Dokładna paleta motywu zgodna 1:1 z ESPHome / LVGL
  const th = getThemeCssColors(config.theme || 'olive_green');

  return (
    <div className="flex flex-col items-center select-none">
      {/* Simulator Toolbar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Radio className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
            <span>ESP32 Live (1:1 LVGL)</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-400">
            {screenWidth}×{screenHeight}px
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 uppercase font-mono text-[11px]">
            {hw.displayDriver}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
            <Eye className="w-3 h-3" />
            Fizyczna wierność 100%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          {onThemeChange && (
            <select
              value={config.theme}
              onChange={e => onThemeChange(e.target.value as DisplayTheme)}
              className="bg-slate-950 text-[11px] font-medium text-slate-200 border border-slate-800 rounded-md px-2 py-1 focus:outline-none focus:border-lime-500 cursor-pointer"
              title="Motyw kolorystyczny wyświetlacza"
            >
              <option value="olive_green">🌲 Oliwkowy (Olive Green)</option>
              <option value="dark_modern">⚡ Modern Dark</option>
              <option value="cyber_amber">🔶 Cyber Amber</option>
              <option value="emerald_synth">💎 Emerald Synth</option>
              <option value="oled_black">🖤 OLED Black</option>
            </select>
          )}

          {/* Night Mode Preview Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsSimulatedNightMode(!isSimulatedNightMode);
              setIsWokenUpByTouch(false);
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
              isSimulatedNightMode && !isWokenUpByTouch
                ? 'bg-indigo-600/30 text-indigo-300 font-semibold border border-indigo-500/50 shadow-sm shadow-indigo-500/20'
                : isSimulatedNightMode && isWokenUpByTouch
                  ? 'bg-amber-600/25 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
            }`}
            title="Podgląd zachowania wyświetlacza w trybie nocnym"
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tryb Nocny</span>
            {isSimulatedNightMode && isWokenUpByTouch ? (
              <span className="text-[10px] text-amber-300 font-mono">Wybudzony</span>
            ) : nightMode.enabled ? (
              <span className="text-[10px] font-mono text-slate-500">
                {String(nightMode.startHour).padStart(2, '0')}:{String(nightMode.startMinute).padStart(2, '0')}
              </span>
            ) : null}
          </button>

          {/* Bezel Toggle */}
          <button
            type="button"
            onClick={() => setShowBezel(!showBezel)}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
              showBezel
                ? 'bg-slate-800 text-lime-300 font-semibold border border-lime-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
            }`}
          >
            {showBezel ? 'Obudowa: WŁ' : 'Ekran 1:1'}
          </button>

          {/* Zoom */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-md border border-slate-800">
            {[0.85, 1, 1.15].map(scale => (
              <button
                key={scale}
                type="button"
                onClick={() => setZoomLevel(scale)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  zoomLevel === scale
                    ? 'bg-lime-500/20 text-lime-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {Math.round(scale * 100)}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Frame Container */}
      <div className="w-full overflow-x-auto overflow-y-visible flex justify-center py-2 px-1">
        {/* Physical Hardware Frame */}
        <div
          className={`transition-all duration-200 shrink-0 ${
            showBezel
              ? config.theme === 'olive_green'
                ? 'p-5 bg-gradient-to-b from-[#222d1c] via-[#162013] to-[#0e150c] rounded-[24px] border-4 border-[#33462a] shadow-2xl shadow-black/90 relative ring-1 ring-[#516b43]/30'
                : 'p-5 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 rounded-[24px] border-4 border-stone-800 shadow-2xl shadow-black/80 relative ring-1 ring-white/10'
              : ''
          }`}
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            marginBottom:
              zoomLevel < 1
                ? `-${Math.round((1 - zoomLevel) * (screenHeight + (showBezel ? 48 : 0)))}px`
                : undefined,
          }}
        >
          {/* Hardware Frame Detailing */}
          {showBezel && (
            <>
              {/* Corner Screws */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-stone-950 rotate-45" />
              </div>
              <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-stone-950 -rotate-45" />
              </div>
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-stone-950 rotate-45" />
              </div>
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center">
                <div className="w-1.5 h-0.5 bg-stone-950 -rotate-45" />
              </div>

              {/* Hardware Model Label */}
              <div className="absolute -top-3.5 inset-x-0 flex justify-center items-center pointer-events-none">
                <span className="text-[9px] tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-stone-400 font-bold">
                  {hw.name.includes('Freenove')
                    ? 'FREENOVE 4.0" ST7796 · 480×320'
                    : 'ESP32 TOUCH PANEL · 480×320'}
                </span>
              </div>
            </>
          )}

          {/* LCD Screen Display Glass (Dokładne 480x320px 1:1 z fizycznym wyświetlaczem) */}
          <div
            onClick={handleTouchFeedback}
            className="relative select-none cursor-pointer rounded-lg border border-black overflow-hidden"
            style={{
              width: `${screenWidth}px`,
              height: `${screenHeight}px`,
              backgroundColor: th.pageBg,
              color: th.textPrimary,
              fontFamily: 'Roboto, sans-serif',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.85)',
            }}
          >
            {/* Touch Ripple Feedback */}
            {touchPoint && (
              <span
                className="absolute pointer-events-none z-50 w-8 h-8 -ml-4 -mt-4 rounded-full animate-ping"
                style={{
                  left: touchPoint.x,
                  top: touchPoint.y,
                  backgroundColor: `${th.accent}50`,
                  border: `1px solid ${th.accent}`,
                }}
              />
            )}

            {/* Tryb Nocny - realistyczne wygaszenie wyświetlacza (Backlight OFF) */}
            {isSimulatedNightMode && !isWokenUpByTouch && (
              <div
                onClick={e => {
                  e.stopPropagation();
                  if (nightMode.wakeOnTouch !== false) {
                    setIsWokenUpByTouch(true);
                  }
                }}
                className={`absolute inset-0 z-40 select-none transition-all duration-300 ${
                  nightMode.completelyOff !== false
                    ? 'bg-black cursor-pointer group flex items-center justify-center'
                    : 'bg-[#06080d]/98 cursor-pointer flex flex-col items-center justify-center'
                }`}
              >
                {nightMode.completelyOff !== false ? (
                  /* Całkowite wyłączenie ekranu: 100% czysta czerń, bez żadnych informacji/napisów na wyświetlaczu */
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {nightMode.wakeOnTouch !== false ? (
                      <span className="px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2 shadow-2xl backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ekran całkowicie wyłączony (czysta czerń) · Kliknij, aby wybudzić</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-500">
                        Ekran całkowicie wyłączony
                      </span>
                    )}
                  </div>
                ) : (
                  /* Tryb nocny ze wskaźnikiem */
                  <>
                    <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 mb-3 animate-pulse shadow-lg shadow-indigo-950/50">
                      <Moon className="w-7 h-7 text-indigo-400" />
                    </div>
                    <div className="text-base font-bold text-slate-200 tracking-wide font-sans">
                      Tryb Nocny Aktywny
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      Podświetlenie panelu LCD wygaszone ({String(nightMode.startHour).padStart(2, '0')}:{String(nightMode.startMinute).padStart(2, '0')} – {String(nightMode.endHour).padStart(2, '0')}:{String(nightMode.endMinute).padStart(2, '0')})
                    </div>
                    {nightMode.wakeOnTouch !== false ? (
                      <div className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/40 text-xs text-indigo-300 flex items-center gap-2 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dotknij ekranu, aby wybudzić (Tap-to-wake)</span>
                      </div>
                    ) : (
                      <div className="mt-4 text-xs text-slate-500">
                        Wybudzanie dotykiem wyłączone w konfiguracji
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Obszar roboczy ekranu LVGL: y: 0 do 254px (wysokość 248px przed dolnym paskiem) */}
            <div className="absolute inset-x-0 top-0 h-[254px] overflow-hidden">
              {/* EKRAN 1: Strona Startowa (screen_home) */}
              {activeScreen?.id === 'screen_home' ? (
                <>
                  {/* Górna część: Karta Zegara i Pogody (x: 10, y: 6, w: 460, h: 96, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '10px',
                      top: '6px',
                      width: '460px',
                      height: '96px',
                      borderRadius: '12px',
                      backgroundColor: th.heroBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    <div
                      className="absolute flex flex-col justify-center"
                      style={{
                        left: '16px',
                        top: '50%',
                        height: '68px',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '38px',
                          lineHeight: 1,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          fontFamily: 'Roboto, sans-serif',
                        }}
                      >
                        {timeFormatted}
                      </span>
                      <span
                        className="truncate"
                        style={{
                          maxWidth: '280px',
                          marginTop: '4px',
                          fontSize: '14px',
                          lineHeight: '17px',
                          color: th.accent,
                          fontFamily: 'Roboto, sans-serif',
                        }}
                      >
                        {dateEsphomeFormatted}
                      </span>
                    </div>

                    {/* lbl_home_temp: x: 320, y: 12, font: 18px Roboto, text_color: th.accent */}
                    <span
                      className="absolute"
                      style={{
                        left: '320px',
                        top: '12px',
                        fontSize: '18px',
                        lineHeight: 1,
                        fontWeight: 700,
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {weatherTemp}°C
                    </span>

                    {/* Ikona pogody: x: 320, y: 44, font: 20px MDI, color: 0xFBBF24 */}
                    <span
                      className="absolute"
                      style={{
                        left: '294px',
                        top: '44px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: '#FBBF24',
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Sun')}
                    </span>

                    {/* lbl_home_weather_desc: x: 346, y: 46, font: 14px Roboto, color: 0xFBBF24 */}
                    <span
                      className="absolute truncate"
                      style={{
                        left: '320px',
                        top: '46px',
                        right: '12px',
                        fontSize: '14px',
                        color: '#FBBF24',
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {weatherDesc}
                    </span>
                  </div>

                  {/* Dolna część: 4 Przyciski Obok Siebie (x: 10 + idx*116, y: 108, w: 112, h: 136, radius: 12) */}
                  {activeScreen.widgets
                    .filter(w => w.type !== 'home_clock_date')
                    .slice(0, 4)
                    .map((widget, idx) => {
                      const isSensor = widget.entityId?.startsWith('sensor.');
                      const isActive = isEntityActive(widget.entityId);
                      const isToggleable = !isSensor && widget.entityId && (
                        widget.entityId.startsWith('switch.') ||
                        widget.entityId.startsWith('light.') ||
                        widget.entityId.startsWith('input_boolean.') ||
                        widget.entityId.startsWith('binary_sensor.')
                      );

                      let statusText = 'WYŁ.';
                      let statusColor = '#64748B';
                      let iconColor = '#64748B';

                      if (isSensor) {
                        statusText = (widget.entityId && entityStates[widget.entityId] !== undefined) ? `${entityStates[widget.entityId]}%` : 'Postęp';
                        statusColor = th.accentMuted;
                        iconColor = th.accent;
                      } else if (widget.entityId?.startsWith('media_player.')) {
                        statusText = isActive ? 'Odtwarza' : 'Pauza';
                        statusColor = isActive ? th.accent : th.accentMuted;
                        iconColor = isActive ? ACTIVE_ICON_COLOR : '#64748B';
                      } else if (isToggleable) {
                        statusText = isActive ? 'WŁ.' : 'WYŁ.';
                        statusColor = isActive ? th.accent : '#64748B';
                        iconColor = isActive ? ACTIVE_ICON_COLOR : '#64748B';
                      } else {
                        statusText = '';
                        statusColor = th.accentMuted;
                        iconColor = th.accent;
                      }

                      return (
                        <div
                          key={widget.id || idx}
                          onClick={e => {
                            e.stopPropagation();
                            if (widget.entityId && !isSensor) {
                              onEntityStateToggle(widget.entityId);
                            }
                          }}
                          className="absolute select-none cursor-pointer transition-transform active:scale-95"
                          style={{
                            left: `${10 + idx * 116}px`,
                            top: '108px',
                            width: '112px',
                            height: '136px',
                            borderRadius: '12px',
                            backgroundColor: isActive ? th.cardActiveBg : th.cardBg,
                            border: `1px solid ${isActive ? (th.cardActiveBorder || th.accent) : th.cardBorder}`,
                            overflow: 'hidden',
                          }}
                        >
                          {/* Tytuł */}
                          <div
                            className="absolute inset-x-1.5 text-center overflow-hidden"
                            style={{
                              top: '4px',
                              height: '36px',
                              fontSize: '14px',
                              lineHeight: '17px',
                              fontWeight: 500,
                              color: th.textPrimary,
                              fontFamily: 'Roboto, sans-serif',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 2,
                              wordBreak: 'normal',
                              overflowWrap: 'normal',
                            }}
                          >
                            {widget.title}
                          </div>

                          <div
                            className="absolute inset-x-1.5 text-center"
                            style={{
                              top: '52px',
                              fontSize: '12px',
                              fontWeight: isActive ? 600 : 400,
                              color: statusColor,
                              fontFamily: 'Roboto, sans-serif',
                            }}
                          >
                            {statusText}
                          </div>

                          {/* Ikona MDI na dole (align: BOTTOM_MID, y: -14, font: 28px MDI, text_color: iconColor) */}
                          <div
                            className="absolute inset-x-0 flex justify-center items-center transition-colors duration-150"
                            style={{
                              bottom: '14px',
                              fontSize: '28px',
                              lineHeight: 1,
                              color: iconColor,
                              fontFamily: '"Material Design Icons", sans-serif',
                            }}
                          >
                            {getMdiChar(widget.icon)}
                          </div>
                        </div>
                      );
                    })}
                </>
              ) : activeScreen?.id === 'screen_lights' ? (
                /* EKRAN 2: Oświetlenie (Siatka 6 Przełączników: 3 kolumny x 2 wiersze, w: 150, h: 118) */
                <>
                  {activeScreen.widgets.slice(0, 6).map((widget, swIdx) => {
                    const r = Math.floor(swIdx / 3);
                    const c = swIdx % 3;
                    const x = 10 + c * 155;
                    const y = 6 + r * 124;
                    const isActive = isEntityActive(widget.entityId);
                    const statusText = isActive ? 'WŁ.' : 'WYŁ.';
                    const statusColor = isActive ? th.accent : '#64748B';
                    const iconColor = isActive ? ACTIVE_ICON_COLOR : '#64748B';

                    return (
                      <div
                        key={widget.id || swIdx}
                        onClick={e => {
                          e.stopPropagation();
                          if (widget.entityId) onEntityStateToggle(widget.entityId);
                        }}
                        className="absolute select-none cursor-pointer transition-transform active:scale-95"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          width: '150px',
                          height: '118px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? th.cardActiveBg : th.cardBg,
                          border: `1px solid ${isActive ? (th.cardActiveBorder || th.accent) : th.cardBorder}`,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Tytuł */}
                        <div
                          className="absolute inset-x-2 text-center overflow-hidden"
                          style={{
                            top: '3px',
                            height: '40px',
                            fontSize: '14px',
                            lineHeight: '17px',
                            fontWeight: 500,
                            color: th.textPrimary,
                            fontFamily: 'Roboto, sans-serif',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            wordBreak: 'normal',
                            overflowWrap: 'normal',
                          }}
                        >
                          {widget.title}
                        </div>

                        {/* Stan przełącznika */}
                        <div
                          className="absolute inset-x-2 text-center"
                          style={{
                            top: '48px',
                            fontSize: '12px',
                            fontWeight: isActive ? 600 : 400,
                            color: statusColor,
                            fontFamily: 'Roboto, sans-serif',
                          }}
                        >
                          {statusText}
                        </div>

                        {/* Duża ikona MDI na dole: align: BOTTOM_MID, y: -12, font: 28px MDI */}
                        <div
                          className="absolute inset-x-0 flex justify-center items-center transition-colors duration-150"
                          style={{
                            bottom: '8px',
                            fontSize: '28px',
                            lineHeight: 1,
                            color: iconColor,
                            fontFamily: '"Material Design Icons", sans-serif',
                          }}
                        >
                          {getMdiChar(widget.icon || 'Lightbulb')}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : activeScreen?.id === 'screen_media' ? (
                /* EKRAN 3: Dedykowany Odtwarzacz Multimediów (x: 10, y: 6, w: 460, h: 246, radius: 12) */
                (() => {
                  const med = activeScreen.widgets[0];
                  const pEntity = med?.entityId || 'media_player.mi_box_2';
                  const isPlaying = entityStates[pEntity] === 'playing';
                  const mediaPosition = Number(entityStates.media_position);
                  const mediaDuration = Number(entityStates.media_duration);
                  const progress = Number.isFinite(mediaPosition) && Number.isFinite(mediaDuration) && mediaDuration > 0
                    ? Math.min(100, Math.max(0, (mediaPosition / mediaDuration) * 100))
                    : 0;
                  const mediaVolume = Number(entityStates.media_volume ?? 50);
                  const isMuted = entityStates.media_muted === true;
                  const trackTitle =
                    entityStates['sensor.media_title'] ||
                    entityStates['media_title'] ||
                    (isPlaying ? 'Bohemian Rhapsody' : 'Odtwarzanie zatrzymane');
                  const trackArtist =
                    entityStates['sensor.media_artist'] ||
                    entityStates['media_artist'] ||
                    (isPlaying ? 'Queen' : 'Brak wykonawcy');
                  return (
                    <div
                      className="absolute select-none"
                      style={{
                        left: '10px',
                        top: '6px',
                        width: '460px',
                        height: '246px',
                        borderRadius: '12px',
                        backgroundColor: th.cardBg,
                        border: `1px solid ${th.cardBorder}`,
                      }}
                    >
                      <MediaMarquee text={trackTitle} top="8px" fontSize="24px" fontWeight={700} color={th.textPrimary} />
                      <MediaMarquee text={trackArtist} top="38px" fontSize="18px" fontWeight={500} color={th.accent} />

                      <div
                        className="absolute overflow-hidden rounded-full"
                        style={{
                          left: '40px',
                          top: '68px',
                          width: '380px',
                          height: '8px',
                          backgroundColor: th.cardBorder,
                        }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${progress}%`, backgroundColor: th.accent }}
                        />
                      </div>

                      {/* Przyciski nawigacji muzycznej */}
                      {/* Poprzedni utwór */}
                      <button
                        type="button"
                        onClick={e => e.stopPropagation()}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        style={{
                          left: '60px',
                          top: '88px',
                          width: '100px',
                          height: '60px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {getMdiChar('SkipBack')}
                      </button>

                      {/* Graj / Pauza */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onEntityStateToggle(pEntity);
                        }}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-md"
                        style={{
                          left: '180px',
                          top: '88px',
                          width: '100px',
                          height: '60px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `2px solid ${th.cardActiveBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {isPlaying ? getMdiChar('Pause') : getMdiChar('Play')}
                      </button>

                      {/* Następny utwór */}
                      <button
                        type="button"
                        onClick={e => e.stopPropagation()}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        style={{
                          left: '300px',
                          top: '88px',
                          width: '100px',
                          height: '60px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {getMdiChar('SkipForward')}
                      </button>

                      {/* Przyciski regulacji głośności */}
                      {/* Ciszej (Vol-) */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onUpdateSimulatedState('media_volume', Math.max(0, mediaVolume - 5));
                          onUpdateSimulatedState('media_muted', false);
                        }}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        style={{
                          left: '66px',
                          top: '160px',
                          width: '88px',
                          height: '54px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {getMdiChar('VolumeMinus')}
                      </button>

                      {/* Wycisz (Mute) */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onUpdateSimulatedState('media_muted', !isMuted);
                        }}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        style={{
                          left: '186px',
                          top: '160px',
                          width: '88px',
                          height: '54px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {getMdiChar(isMuted ? 'VolumeX' : 'VolumeMute')}
                      </button>

                      {/* Głośniej (Vol+) */}
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onUpdateSimulatedState('media_volume', Math.min(100, mediaVolume + 5));
                          onUpdateSimulatedState('media_muted', false);
                        }}
                        className="absolute flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                        style={{
                          left: '306px',
                          top: '160px',
                          width: '88px',
                          height: '54px',
                          borderRadius: '10px',
                          backgroundColor: th.cardActiveBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: '#FFFFFF',
                          fontFamily: '"Material Design Icons", sans-serif',
                          fontSize: '28px',
                          lineHeight: 1,
                        }}
                      >
                        {getMdiChar('VolumePlus')}
                      </button>
                      <div
                        className="absolute inset-x-0 text-center"
                        style={{
                          top: '218px',
                          fontSize: '12px',
                          color: th.accentMuted,
                          fontFamily: 'Roboto, sans-serif',
                        }}
                      >
                        Głośność: {isMuted ? 0 : Math.max(0, Math.min(100, mediaVolume))}%
                      </div>
                    </div>
                  );
                })()
              ) : activeScreen?.id === 'screen_bambu' ? (
                /* EKRAN 4: Bambu Lab A1 Mini (Podgląd parametrów 1:1 z LVGL) */
                <>
                  {/* Rząd 1: Nagłówek pliku (x: 10, y: 6, w: 460, h: 42, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '10px',
                      top: '6px',
                      width: '460px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '11px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accent,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Printer3d')}
                    </span>
                    <span
                      className="absolute truncate"
                      style={{
                        left: '38px',
                        top: '12px',
                        right: '12px',
                        fontSize: '14px',
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                        Bambu Lab A1 Mini
                    </span>
                  </div>

                  {/* Rząd 2, Lewa: Karta Postępu Druku (x: 10, y: 54, w: 224, h: 102, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '10px',
                      top: '54px',
                      width: '224px',
                      height: '132px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    {/* Row 1: Gauge */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '9px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accent,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Gauge')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '38px',
                        top: '10px',
                        fontSize: '14px',
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Postęp: {Number.isFinite(bambuProgress) ? `${Math.round(bambuProgress)}%` : '--'}
                    </span>

                    {/* Row 2: Layers */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '38px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accentMuted,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Layers')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '38px',
                        top: '39px',
                        fontSize: '14px',
                        color: th.textPrimary,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      Status: {bambuState}
                    </span>

                    {/* Row 3: Clock */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '66px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accentMuted,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Clock')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '38px',
                        top: '67px',
                        fontSize: '14px',
                        color: th.accentMuted,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      Pozostało: {formattedBambuRemaining}
                    </span>
                    <div
                      className="absolute overflow-hidden rounded-full"
                      style={{
                        left: '38px',
                        top: '96px',
                        width: '174px',
                        height: '12px',
                        backgroundColor: th.cardBorder,
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Number.isFinite(bambuProgress) ? Math.max(0, Math.min(100, bambuProgress)) : 0}%`,
                          backgroundColor: th.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Rząd 2, Prawa: Karta Temperatur (x: 246, y: 54, w: 224, h: 102, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '246px',
                      top: '54px',
                      width: '224px',
                      height: '132px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    {/* Row 1: Dysza */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '9px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: '#FB923C',
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Thermometer')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '36px',
                        top: '10px',
                        fontSize: '14px',
                        color: '#FB923C',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Dysza: {bambuNozzle}°C
                    </span>

                    {/* Row 2: Stół */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '37px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: '#FBBF24',
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Flame')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '36px',
                        top: '38px',
                        fontSize: '14px',
                        color: '#FBBF24',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Stół: {bambuBed}°C
                    </span>

                    {/* Row 3: Wentylator */}
                    <span
                      className="absolute"
                      style={{
                        left: '12px',
                        top: '65px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accent,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Fan')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '36px',
                        top: '66px',
                        fontSize: '14px',
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      Wentylator: {bambuFan}%
                    </span>
                  </div>

                  {/* Nazwa drukowanego modelu */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '10px',
                      top: '194px',
                      width: '460px',
                      height: '54px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    <span
                      className="absolute truncate"
                      style={{
                        left: '16px',
                        top: '17px',
                        right: '14px',
                        fontSize: '14px',
                        color: th.textPrimary,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Model: {bambuJob}
                    </span>
                  </div>
                </>
              ) : activeScreen?.id === 'screen_calendar' ? (
                /* EKRAN 5: Kalendarz Familijny & Zmierzch (1:1 z LVGL) */
                <>
                  {/* Cykl Słońca (x: 10, y: 6, w: 140, h: 246, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '10px',
                      top: '6px',
                      width: '140px',
                      height: '246px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 text-center"
                      style={{
                        top: '14px',
                        fontSize: '14px',
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Słońce & Zmierzch
                    </div>

                    {/* Sunrise */}
                    <span
                      className="absolute"
                      style={{
                        left: '14px',
                        top: '76px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: '#FBBF24',
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Sunrise')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '42px',
                        top: '77px',
                        fontSize: '14px',
                        color: '#FBBF24',
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      06:14
                    </span>

                    {/* Sunset */}
                    <span
                      className="absolute"
                      style={{
                        left: '14px',
                        top: '132px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accentMuted,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Sunset')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '42px',
                        top: '133px',
                        fontSize: '14px',
                        color: th.accentMuted,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      18:42
                    </span>

                    {/* Dzień */}
                    <div
                      className="absolute inset-x-0 text-center"
                      style={{
                        bottom: '16px',
                        fontSize: '14px',
                        color: th.accentMuted,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      Dzień: 12h 28m
                    </div>
                  </div>

                  {/* Kalendarz Familijny (x: 156, y: 6, w: 314, h: 246, radius: 12) */}
                  <div
                    className="absolute select-none"
                    style={{
                      left: '156px',
                      top: '6px',
                      width: '314px',
                      height: '246px',
                      borderRadius: '12px',
                      backgroundColor: th.cardBg,
                      border: `1px solid ${th.cardBorder}`,
                    }}
                  >
                    {/* Header */}
                    <span
                      className="absolute"
                      style={{
                        left: '14px',
                        top: '8px',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: th.accent,
                        fontFamily: '"Material Design Icons", sans-serif',
                      }}
                    >
                      {getMdiChar('Calendar')}
                    </span>
                    <span
                      className="absolute"
                      style={{
                        left: '40px',
                        top: '9px',
                        fontSize: '14px',
                        color: th.accent,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      Kalendarz Familijny (5 wydarzeń)
                    </span>

                    {(
                      Array.isArray(entityStates['calendar.familijny']?.events)
                        ? entityStates['calendar.familijny'].events.slice(0, 5)
                        : [{
                            start: '',
                            summary: 'Wydarzenia pobiera urządzenie z Home Assistant',
                          }]
                    ).map((ev: { start?: string; summary?: string }, eIdx: number) => {
                      const start = ev.start || '';
                      const displayDateTime = start.length >= 16
                        ? `${start.slice(8, 10)}.${start.slice(5, 7)} ${start.slice(11, 16)}`
                        : start.length >= 10
                          ? `${start.slice(8, 10)}.${start.slice(5, 7)} cały dzień`
                          : '';
                      return (
                      <div
                        key={`${start}-${ev.summary || eIdx}`}
                        className="absolute inset-x-0"
                        style={{ top: `${42 + eIdx * 39}px` }}
                      >
                        <span
                          className="absolute"
                          style={{
                            left: '14px',
                            width: '102px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#FBBF24',
                            fontFamily: 'Roboto, sans-serif',
                          }}
                        >
                          {displayDateTime}
                        </span>
                        <span
                          className="absolute truncate"
                          style={{
                            left: '120px',
                            right: '12px',
                            fontSize: '14px',
                            color: th.textPrimary,
                            fontFamily: 'Roboto, sans-serif',
                          }}
                        >
                          {ev.summary || '(bez tytułu)'}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* EKRANY NIESTANDARDOWE (DODANE PRZEZ UŻYTKOWNIKA) */
                (() => {
                  const customWidgets = activeScreen?.widgets || [];
                  if (customWidgets.length === 0) {
                    return (
                      <div
                        className="absolute flex items-center justify-center text-center p-4"
                        style={{
                          left: '10px',
                          top: '6px',
                          width: '460px',
                          height: '246px',
                          borderRadius: '12px',
                          backgroundColor: th.cardBg,
                          border: `1px solid ${th.cardBorder}`,
                          color: th.textPrimary,
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '18px',
                          fontWeight: 500,
                        }}
                      >
                        <div>
                          <Layers className="w-10 h-10 mx-auto mb-2 opacity-50" style={{ color: th.accent }} />
                          <div>{activeScreen.title}</div>
                          <div className="text-xs mt-1" style={{ color: th.accentMuted }}>
                            Dodaj kafelki w sekcji «Ekrany Wyświetlacza»
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const isThreeCols = customWidgets.length > 4;
                  const cols = isThreeCols ? 3 : 2;
                  const colW = isThreeCols ? 150 : 224;
                  const gapX = isThreeCols ? 5 : 12;

                  return (
                    <>
                      {customWidgets.slice(0, 6).map((cw, cwIdx) => {
                        const r = Math.floor(cwIdx / cols);
                        const c = cwIdx % cols;
                        const x = 10 + c * (colW + gapX);
                        const y = 6 + r * 124;
                        const isSens = cw.entityId?.startsWith('sensor.');
                        const isActive = isEntityActive(cw.entityId);
                        const statusText = isSens
                          ? ((cw.entityId && entityStates[cw.entityId] !== undefined) ? `${entityStates[cw.entityId]}` : 'Czujnik')
                          : (isActive ? 'WŁ.' : 'WYŁ.');
                        const statusColor = isSens ? th.accentMuted : (isActive ? th.accent : '#64748B');
                        const iconColor = isActive ? ACTIVE_ICON_COLOR : '#64748B';

                        return (
                          <div
                            key={cw.id || cwIdx}
                            onClick={e => {
                              e.stopPropagation();
                              if (cw.entityId && !isSens) onEntityStateToggle(cw.entityId);
                            }}
                            className="absolute select-none cursor-pointer transition-transform active:scale-95"
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              width: `${colW}px`,
                              height: '118px',
                              borderRadius: '12px',
                              backgroundColor: isActive ? th.cardActiveBg : th.cardBg,
                              border: `1px solid ${isActive ? (th.cardActiveBorder || th.accent) : th.cardBorder}`,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              className="absolute inset-x-2 text-center overflow-hidden"
                              style={{
                                top: '8px',
                                height: '38px',
                                fontSize: '14px',
                                lineHeight: '17px',
                                fontWeight: 500,
                                color: th.textPrimary,
                                fontFamily: 'Roboto, sans-serif',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 2,
                                wordBreak: 'normal',
                                overflowWrap: 'normal',
                              }}
                            >
                              {cw.title}
                            </div>
                            <div
                              className="absolute inset-x-2 text-center truncate"
                              style={{
                                top: '50px',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 400,
                                color: statusColor,
                                fontFamily: 'Roboto, sans-serif',
                              }}
                            >
                              {statusText}
                            </div>
                            <div
                              className="absolute inset-x-0 flex justify-center items-center transition-colors duration-150"
                              style={{
                                bottom: '12px',
                                fontSize: '28px',
                                lineHeight: 1,
                                color: iconColor,
                                fontFamily: '"Material Design Icons", sans-serif',
                              }}
                            >
                              {getMdiChar(cw.icon || 'Sparkles')}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })()
              )}
            </div>

            {/* Dolny Pasek Nawigacyjny ESPHome / LVGL (x: 8, y: 254, w: 464, h: 56, radius: 12) */}
            <div
              className="absolute select-none"
              style={{
                left: '8px',
                top: '254px',
                width: '464px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: th.navBarBg,
                border: `1px solid ${th.navBarBorder}`,
              }}
            >
              {config.screens.map((screen, idx) => {
                const isActive = idx === activeScreenIndex;
                const tabCount = Math.max(1, config.screens.length);
                const containerW = 464;
                const containerH = 56;
                const btnH = 44;
                const tabGap = 4;
                const totalGaps = (tabCount - 1) * tabGap;
                const targetMargin = 6;
                const availableForTabs = containerW - 2 * targetMargin - totalGaps;
                const tabW = Math.floor(availableForTabs / tabCount);
                const totalUsedW = tabCount * tabW + totalGaps;
                const startX = Math.round((containerW - totalUsedW) / 2);
                const tabY = Math.round((containerH - btnH) / 2);
                const tabX = startX + idx * (tabW + tabGap);

                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onScreenChange(idx);
                    }}
                    title={screen.title}
                    className="absolute flex items-center justify-center transition-all cursor-pointer select-none"
                    style={{
                      left: `${tabX}px`,
                      top: `${tabY}px`,
                      width: `${tabW}px`,
                      height: `${btnH}px`,
                      borderRadius: '8px',
                      backgroundColor: isActive ? th.navBtnActive : th.navBtnInactive,
                      border: isActive ? `1px solid ${th.navBtnActiveBorder}` : 'none',
                      color: isActive ? th.navBtnActiveText : th.accentMuted,
                      fontFamily: '"Material Design Icons", sans-serif',
                      fontSize: '28px',
                      lineHeight: 1,
                    }}
                  >
                    {getMdiChar(screen.icon)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
