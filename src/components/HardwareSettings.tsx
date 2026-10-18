import React, { useState } from 'react';
import { ConfigProfile, DisplayEngine, DisplayTheme } from '../types';
import { HARDWARE_PRESETS } from '../data/hardwarePresets';
import { generateRandomApiKey } from '../generators/esphomeYamlGenerator';
import {
  Cpu,
  Wifi,
  Key,
  Sun,
  Moon,
  Clock,
  Palette,
  Smartphone,
  Sparkles,
  Monitor,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  RefreshCw,
  FileCode,
  HelpCircle
} from 'lucide-react';

interface HardwareSettingsProps {
  config: ConfigProfile;
  onUpdateConfig: (updater: (prev: ConfigProfile) => ConfigProfile) => void;
}

export const HardwareSettings: React.FC<HardwareSettingsProps> = ({
  config,
  onUpdateConfig,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Safe accessor for secret names and credentials
  const secNames = config.secretNames || {
    wifiSsid: 'wifi_ssid',
    wifiPassword: 'wifi_password',
    haApiKey: 'smartdisplay_api_key',
  };

  const actualCreds = config.actualCredentials || {
    wifiSsid: 'MojaSiecDomowa_2.4GHz',
    wifiPassword: 'TwojeTajneHasloWiFi',
    haApiKey: 'smartdisplay_api_key_base64',
  };

  const handleGenerateApiKey = () => {
    const newKey = generateRandomApiKey();
    onUpdateConfig(prev => ({
      ...prev,
      actualCredentials: {
        ...(prev.actualCredentials || actualCreds),
        haApiKey: newKey,
      },
      haApiPassword: newKey,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Hardware Board Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Wybór Modelu Ekranu ESP32</h3>
            <p className="text-xs text-slate-400">Dostosuj piny, magistralę SPI/I2C i sterownik dotyku</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HARDWARE_PRESETS.map(preset => {
            const isSelected = config.hardwarePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onUpdateConfig(prev => ({ ...prev, hardwarePresetId: preset.id }))
                }
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-white ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-100">{preset.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {preset.resolution.width}x{preset.resolution.height}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Chip: {preset.chip.toUpperCase()}</span>
                  <span>Sterownik: {preset.displayDriver}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display & Layout Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Orientacja i Styl Wizualny</h3>
            <p className="text-xs text-slate-400">Ustawienia wyświetlania i uśpienia panelu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Orientation */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Orientacja Ekranu
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig(prev => ({ ...prev, orientation: 'landscape' }))
                }
                className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  config.orientation === 'landscape'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Pozioma (Landscape)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateConfig(prev => ({ ...prev, orientation: 'portrait' }))
                }
                className={`py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  config.orientation === 'portrait'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Pionowa (Portrait)</span>
              </button>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Motyw Kolorystyczny
            </label>
            <select
              value={config.theme}
              onChange={e =>
                onUpdateConfig(prev => ({ ...prev, theme: e.target.value as DisplayTheme }))
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="olive_green">Oliwkowa Zieleń / Tactical Olive (Dopasowany do zielonej obudowy)</option>
              <option value="dark_modern">Modern Dark (Slate & Cyan)</option>
              <option value="cyber_amber">Cyber Amber (Home Assistant Orange)</option>
              <option value="emerald_synth">Emerald Synth (Zielony)</option>
              <option value="oled_black">OLED Pure Black (Wysoki kontrast)</option>
            </select>
          </div>

          {/* Timeout */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Wygaszanie Podświetlenia
            </label>
            <select
              value={config.displayTimeoutSec}
              onChange={e =>
                onUpdateConfig(prev => ({ ...prev, displayTimeoutSec: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value={0}>Zawsze włączony (Brak wygaszania)</option>
              <option value={30}>Po 30 sekundach bezczynności</option>
              <option value={60}>Po 1 minucie bezczynności</option>
              <option value={120}>Po 2 minutach bezczynności</option>
              <option value={300}>Po 5 minutach bezczynności</option>
            </select>
          </div>
        </div>
      </div>

      {/* Night Mode & Screen Dimming Schedule */}
      {(() => {
        const nightMode = config.nightMode || {
          enabled: true,
          startHour: 23,
          startMinute: 0,
          endHour: 6,
          endMinute: 30,
          wakeOnTouch: true,
        };

        return (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">Tryb Nocny (Harmonogram Wygaszania Ekranu)</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        nightMode.enabled
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {nightMode.enabled ? 'Aktywny' : 'Wyłączony'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Całkowite wygaszenie podświetlenia panelu LCD o ustalonej godzinie w nocy i wybudzenie rano
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={nightMode.enabled}
                  onChange={e =>
                    onUpdateConfig(prev => ({
                      ...prev,
                      nightMode: {
                        ...(prev.nightMode || nightMode),
                        enabled: e.target.checked,
                      },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-2.5 text-xs font-semibold text-slate-300">
                  {nightMode.enabled ? 'Włączony' : 'Wyłączony'}
                </span>
              </label>
            </div>

            {nightMode.enabled && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start time */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Godzina wyłączenia wyświetlacza</span>
                      </label>
                      <span className="text-[11px] font-mono text-indigo-400 font-bold">
                        {String(nightMode.startHour).padStart(2, '0')}:{String(nightMode.startMinute).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={`${String(nightMode.startHour).padStart(2, '0')}:${String(nightMode.startMinute).padStart(2, '0')}`}
                        onChange={e => {
                          const [h, m] = e.target.value.split(':').map(Number);
                          if (!isNaN(h) && !isNaN(m)) {
                            onUpdateConfig(prev => ({
                              ...prev,
                              nightMode: {
                                ...(prev.nightMode || nightMode),
                                startHour: h,
                                startMinute: m,
                              },
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-1">
                        {[
                          { label: '22:00', h: 22, m: 0 },
                          { label: '23:00', h: 23, m: 0 },
                          { label: '00:00', h: 0, m: 0 },
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() =>
                              onUpdateConfig(prev => ({
                                ...prev,
                                nightMode: {
                                  ...(prev.nightMode || nightMode),
                                  startHour: p.h,
                                  startMinute: p.m,
                                },
                              }))
                            }
                            className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-[10px] font-mono text-slate-300 rounded border border-slate-800"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      O tej godzinie podświetlenie panelu LCD gaśnie całkowicie (0% jasności / wyłączenie LEDC).
                    </p>
                  </div>

                  {/* End time */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Godzina włączenia wyświetlacza</span>
                      </label>
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        {String(nightMode.endHour).padStart(2, '0')}:{String(nightMode.endMinute).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={`${String(nightMode.endHour).padStart(2, '0')}:${String(nightMode.endMinute).padStart(2, '0')}`}
                        onChange={e => {
                          const [h, m] = e.target.value.split(':').map(Number);
                          if (!isNaN(h) && !isNaN(m)) {
                            onUpdateConfig(prev => ({
                              ...prev,
                              nightMode: {
                                ...(prev.nightMode || nightMode),
                                endHour: h,
                                endMinute: m,
                              },
                            }));
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center gap-1">
                        {[
                          { label: '06:00', h: 6, m: 0 },
                          { label: '06:30', h: 6, m: 30 },
                          { label: '07:00', h: 7, m: 0 },
                        ].map(p => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() =>
                              onUpdateConfig(prev => ({
                                ...prev,
                                nightMode: {
                                  ...(prev.nightMode || nightMode),
                                  endHour: p.h,
                                  endMinute: p.m,
                                },
                              }))
                            }
                            className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-[10px] font-mono text-slate-300 rounded border border-slate-800"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      O tej godzinie ekran automatycznie powraca do normalnego podświetlenia.
                    </p>
                  </div>
                </div>

                {/* Całkowite wyłączenie ekranu (brak jakichkolwiek informacji na wyświetlaczu) */}
                <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
                      <EyeOff className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span>Całkowite wyłączenie ekranu (Czysta czerń)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {nightMode.completelyOff !== false ? 'Bez informacji' : 'Ze wskaźnikiem'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Wyświetlacz jest w 100% wygaszony – brak zegara, napisów czy świecących elementów w nocy
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nightMode.completelyOff !== false}
                      onChange={e =>
                        onUpdateConfig(prev => ({
                          ...prev,
                          nightMode: {
                            ...(prev.nightMode || nightMode),
                            completelyOff: e.target.checked,
                          },
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Wake on touch */}
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Wybudzanie dotykiem w nocy (Tap-to-wake)</div>
                      <div className="text-[11px] text-slate-400">
                        Dotknięcie ekranu w nocy włącza podświetlenie (ekran wygasi się z powrotem po zadanym czasie bezczynności)
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={nightMode.wakeOnTouch !== false}
                    onChange={e =>
                      onUpdateConfig(prev => ({
                        ...prev,
                        nightMode: {
                          ...(prev.nightMode || nightMode),
                          wakeOnTouch: e.target.checked,
                        },
                      }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-900 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Network & ESPHome Secrets Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Bezpieczeństwo & Sekrety ESPHome</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  secrets.yaml
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Przechowuj SSID, hasło WiFi i klucz szyfrowania API jako secret esphome
              </p>
            </div>
          </div>

          {/* Secret Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onUpdateConfig(prev => ({ ...prev, useSecrets: true }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                config.useSecrets !== false
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ESPHome !secret (Zalecane)</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateConfig(prev => ({ ...prev, useSecrets: false }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                config.useSecrets === false
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Wprost w YAML</span>
            </button>
          </div>
        </div>

        {config.useSecrets !== false ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200 mb-0.5">
                  Tryb bezpieczny aktywny: wartości są chronione w pliku secrets.yaml
                </p>
                <p className="text-emerald-400/80 leading-relaxed text-[11px]">
                  Główny kod odwołuje się do nich za pomocą dyrektywy <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">!secret nazwa_klucza</code>.
                  W zakładce <strong>Kod ESPHome YAML</strong> znajdziesz wygenerowany plik <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">secrets.yaml</code> gotowy do skopiowania.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Secret 1: WiFi SSID */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                    Sieć WiFi 2.4 GHz
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                    !secret {secNames.wifiSsid}
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Rzeczywiste SSID (do secrets.yaml)
                  </label>
                  <input
                    type="text"
                    value={actualCreds.wifiSsid || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        actualCredentials: {
                          ...(prev.actualCredentials || actualCreds),
                          wifiSsid: val,
                        },
                        wifiSsid: val,
                      }));
                    }}
                    placeholder="np. MojaSiec_2.4G"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">
                    Nazwa zmiennej w secrets.yaml:
                  </label>
                  <input
                    type="text"
                    value={secNames.wifiSsid || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        secretNames: {
                          ...(prev.secretNames || secNames),
                          wifiSsid: val,
                        },
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Secret 2: WiFi Password */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Hasło do WiFi
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                    !secret {secNames.wifiPassword}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-400">
                      Rzeczywiste Hasło (do secrets.yaml)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Ukryj' : 'Pokaż'}</span>
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={actualCreds.wifiPassword || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        actualCredentials: {
                          ...(prev.actualCredentials || actualCreds),
                          wifiPassword: val,
                        },
                        wifiPassword: val,
                      }));
                    }}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">
                    Nazwa zmiennej w secrets.yaml:
                  </label>
                  <input
                    type="text"
                    value={secNames.wifiPassword || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        secretNames: {
                          ...(prev.secretNames || secNames),
                          wifiPassword: val,
                        },
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Secret 3: HA API Key */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    Klucz API / Noise
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    !secret {secNames.haApiKey}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-400">
                      Klucz Base64 (do secrets.yaml)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateApiKey}
                      className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/60"
                      title="Wygeneruj 32-bajtowy klucz szyfrowania ESPHome"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Wygeneruj</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={actualCreds.haApiKey || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        actualCredentials: {
                          ...(prev.actualCredentials || actualCreds),
                          haApiKey: val,
                        },
                        haApiPassword: val,
                      }));
                    }}
                    placeholder="32 bajty w base64"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 truncate"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">
                    Nazwa zmiennej w secrets.yaml:
                  </label>
                  <input
                    type="text"
                    value={secNames.haApiKey || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        secretNames: {
                          ...(prev.secretNames || secNames),
                          haApiKey: val,
                        },
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
              <Unlock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200 mb-0.5">
                  Tryb bezpośredni: Hasła zostaną wpisane wprost do pliku głównego YAML
                </p>
                <p className="text-amber-400/80 leading-relaxed text-[11px]">
                  Nie musisz tworzyć pliku <code className="bg-amber-900/40 px-1 py-0.5 rounded font-mono">secrets.yaml</code>. Pamiętaj jednak, aby nie udostępniać wygenerowanego pliku YAML osobom trzecim, ponieważ zawiera on Twoje hasło WiFi.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Nazwa Sieci WiFi (SSID)
                </label>
                <input
                  type="text"
                  value={actualCreds.wifiSsid || config.wifiSsid || ''}
                  onChange={e => {
                    const val = e.target.value;
                    onUpdateConfig(prev => ({
                      ...prev,
                      wifiSsid: val,
                      actualCredentials: {
                        ...(prev.actualCredentials || actualCreds),
                        wifiSsid: val,
                      },
                    }));
                  }}
                  placeholder="np. DomowaSiec_2.4GHz"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Hasło WiFi
                </label>
                <input
                  type="password"
                  value={actualCreds.wifiPassword || config.wifiPassword || ''}
                  onChange={e => {
                    const val = e.target.value;
                    onUpdateConfig(prev => ({
                      ...prev,
                      wifiPassword: val,
                      actualCredentials: {
                        ...(prev.actualCredentials || actualCreds),
                        wifiPassword: val,
                      },
                    }));
                  }}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Klucz Szyfrowania API HA
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateApiKey}
                    className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Generuj</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={actualCreds.haApiKey || config.haApiPassword || ''}
                  onChange={e => {
                    const val = e.target.value;
                    onUpdateConfig(prev => ({
                      ...prev,
                      haApiPassword: val,
                      actualCredentials: {
                        ...(prev.actualCredentials || actualCreds),
                        haApiKey: val,
                      },
                    }));
                  }}
                  placeholder="Klucz base64 (32 bajty)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono truncate"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Polish Fonts, MDI Icons & Screen Safe Area Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Polskie Znaki, Ikony MDI & Optymalizacja Krawędzi Ekranu</h3>
            <p className="text-xs text-slate-400">Automatyczna obsługa czcionek, ikon i zabezpieczenie przed ucięciem dolnej krawędzi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Feature 1: Polish Characters */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Czcionka z polskimi znakami</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Konfigurator automatycznie generuje komponent <code className="text-cyan-300 font-mono">font:</code> z <code className="text-cyan-300 font-mono">gfonts://Roboto</code> oraz zestawem znaków <code className="text-cyan-300 font-mono">GF_Latin_Core</code> (ą, ć, ę, ł, ń, ó, ś, ź, ż, Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż).
            </p>
          </div>

          {/* Feature 2: MDI Icons */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ikony Material Design (MDI)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Ikony pobierane są przez ESPHome z repozytorium Pictogrammers MDI Webfont i mapowane do kodów Unicode (np. żarówka, telewizor, drukarka 3D, odtwarzacz).
            </p>
          </div>

          {/* Feature 3: Safe Area */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Ochrona dolnej krawędzi (Safe Area)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Dolny pasek nawigacyjny ma powiększoną wysokość (48px) i 10px margines bezpieczeństwa od dołu ekranu (Y: 260–310), dzięki czemu nie chowa się pod fizyczną ramką ST7796.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
