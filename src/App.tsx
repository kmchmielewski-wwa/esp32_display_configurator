import React, { useState, useEffect } from 'react';
import { ConfigProfile, HAEntity } from './types';
import { INITIAL_CONFIG_PROFILE } from './data/defaultScreens';
import { RAW_CSV_ENTITIES } from './data/homeAssistantEntities';
import { DisplaySimulator } from './components/DisplaySimulator';
import { ScreenEditor } from './components/ScreenEditor';
import { HardwareSettings } from './components/HardwareSettings';
import { YamlViewer } from './components/YamlViewer';
import { EntitySimulatorDrawer } from './components/EntitySimulatorDrawer';
import { ImportExportModal } from './components/ImportExportModal';
import { HaEntityImporter } from './components/HaEntityImporter';
import {
  Sliders,
  Cpu,
  FileCode,
  LayoutGrid,
  Sparkles,
  Download,
  Share2,
  HardDrive,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Tv,
  Printer,
  Lightbulb,
  Calendar,
  FileText
} from 'lucide-react';

const STORAGE_KEY = 'esphome_touch_config_v6';
const ENTITIES_STORAGE_KEY = 'ha_imported_entities_v4';

export default function App() {
  // Config state with localStorage persistence and migration
  const [config, setConfig] = useState<ConfigProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('esphome_touch_config_v5') || localStorage.getItem('esphome_touch_config_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hardwarePresetId) {
          // Migration: ensure media player has only 'Multimedia' title and no extra text,
          // calendar has family events without shopping list and without office desk node,
          // and weather uses weather.forecast_dom for user local weather.
          const migratedScreens = parsed.screens?.map((scr: any) => {
            if (scr.id === 'screen_media') {
              return {
                ...scr,
                title: 'Multimedia',
                widgets: [
                  {
                    id: 'w_single_media',
                    type: 'media_single_player',
                    title: 'Multimedia',
                    subtitle: '',
                    entityId: 'media_player.mi_box_2',
                    icon: 'Tv',
                    colSpan: 2,
                    colorAccent: 'cyan',
                  },
                ],
              };
            }
            if (scr.id === 'screen_calendar') {
              return {
                ...scr,
                title: 'Kalendarz',
                widgets: [
                  {
                    id: 'w_clock_weather',
                    type: 'clock_weather',
                    title: 'Zegar i Aura',
                    subtitle: 'Moja Lokalizacja',
                    entityId: 'weather.forecast_dom',
                    icon: 'CloudSun',
                    colSpan: 2,
                    colorAccent: 'sky',
                  },
                  {
                    id: 'w_sun_cycle',
                    type: 'sun_widget',
                    title: 'Słońce & Zmierzch',
                    subtitle: 'Wschód / Zachód',
                    entityId: 'sun.sun',
                    secondaryEntityId: 'sensor.sun_next_setting',
                    icon: 'Sunset',
                    colSpan: 1,
                    colorAccent: 'amber',
                  },
                  {
                    id: 'w_family_calendar',
                    type: 'family_calendar_events',
                    title: 'Kalendarz Familijny',
                    subtitle: '5 wydarzeń',
                    entityId: 'calendar.familijny',
                    icon: 'Calendar',
                    colSpan: 1,
                    colorAccent: 'emerald',
                  },
                ],
              };
            }
            if (scr.id === 'screen_home') {
              return {
                ...scr,
                widgets: scr.widgets.map((w: any) => {
                  if (w.id === 'w_home_clock') {
                    return { ...w, entityId: 'weather.forecast_dom', subtitle: 'Moja Lokalizacja' };
                  }
                  if (w.id === 'w_quick_slot_2' && (w.title?.includes('Relé') || w.title === 'Shelly 1 Relé')) {
                    return { ...w, title: 'Shelly 1 Główny', subtitle: 'Przekaźnik' };
                  }
                  if (w.id === 'w_quick_slot_4' && (w.entityId === 'media_player.58pus8517_12_3' || w.title?.includes('Philips'))) {
                    return { ...w, title: 'Mi Box 2', subtitle: 'Odtwarzacz Media', entityId: 'media_player.mi_box_2' };
                  }
                  return w;
                }),
              };
            }
            if (scr.id === 'screen_lights') {
              return {
                ...scr,
                widgets: scr.widgets.map((w: any) => {
                  if (w.id === 'w_desk_led' && w.title?.includes('OfficeDesk')) {
                    return { ...w, title: 'Oświetlenie LED', subtitle: 'Pasek LED' };
                  }
                  return w;
                }),
              };
            }
            return scr;
          }) || INITIAL_CONFIG_PROFILE.screens;

          return {
            ...INITIAL_CONFIG_PROFILE,
            ...parsed,
            screens: migratedScreens,
            secretNames: {
              ...INITIAL_CONFIG_PROFILE.secretNames,
              ...(parsed.secretNames || {}),
            },
            actualCredentials: {
              ...INITIAL_CONFIG_PROFILE.actualCredentials,
              ...(parsed.actualCredentials || {}),
            },
            nightMode: {
              ...INITIAL_CONFIG_PROFILE.nightMode,
              ...(parsed.nightMode || {}),
            },
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved config', e);
    }
    return INITIAL_CONFIG_PROFILE;
  });

  // Home Assistant entities state (starts with factory entities, extensible via file import)
  const [haEntities, setHaEntities] = useState<HAEntity[]>(() => {
    try {
      const saved = localStorage.getItem(ENTITIES_STORAGE_KEY) || localStorage.getItem('ha_imported_entities_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure media_player.mi_box_2 is in the list
          const hasMiBox2 = parsed.some(e => e.entity_id === 'media_player.mi_box_2');
          if (!hasMiBox2) {
            return [
              { entity_id: 'media_player.mi_box_2', name: 'Xiaomi Mi Box 2', state: 'playing', domain: 'media_player', category: 'media' },
              ...parsed,
            ];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved entities', e);
    }
    return RAW_CSV_ENTITIES;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'entities' | 'hardware' | 'yaml'>('editor');
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [showSimulatorDrawer, setShowSimulatorDrawer] = useState<boolean>(true);

  // Simulated Home Assistant entity states
  const [entityStates, setEntityStates] = useState<Record<string, any>>(() => {
    const states: Record<string, any> = {
      media_title: 'Bohemian Rhapsody',
      media_artist: 'Queen',
      'sensor.media_title': 'Bohemian Rhapsody',
      'sensor.media_artist': 'Queen',
    };
    RAW_CSV_ENTITIES.forEach(e => {
      states[e.entity_id] = e.state;
    });
    return states;
  });

  // Save config to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [config]);

  // Save imported entities to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(ENTITIES_STORAGE_KEY, JSON.stringify(haEntities));
    } catch (e) {
      console.error('Failed to save entities to localStorage', e);
    }
  }, [haEntities]);

  // Sync simulator entity states when entities are imported
  useEffect(() => {
    setEntityStates(prev => {
      const next = { ...prev };
      haEntities.forEach(ent => {
        if (!(ent.entity_id in next)) {
          next[ent.entity_id] = ent.state || 'off';
        }
      });
      return next;
    });
  }, [haEntities]);

  // Toggle entity state in simulator (e.g. switch on/off, media play/pause, etc.)
  const handleEntityStateToggle = (entityId: string) => {
    setEntityStates(prev => {
      const current = prev[entityId];
      let nextVal: any = 'on';

      if (entityId.startsWith('switch.') || entityId.startsWith('light.') || entityId.startsWith('input_boolean.') || entityId.startsWith('binary_sensor.')) {
        nextVal = (current === 'on' || current === true) ? 'off' : 'on';
      } else if (entityId.startsWith('media_player.')) {
        nextVal = current === 'playing' ? 'paused' : 'playing';
      } else if (entityId.startsWith('button.')) {
        // Flash button press effect
        nextVal = 'pressed';
        setTimeout(() => {
          setEntityStates(s => ({ ...s, [entityId]: 'idle' }));
        }, 600);
      } else if (typeof current === 'boolean') {
        nextVal = !current;
      }

      return { ...prev, [entityId]: nextVal };
    });
  };

  const handleUpdateSimulatedState = (key: string, value: any) => {
    setEntityStates(prev => ({ ...prev, [key]: value }));
  };

  const handleResetSimulatedStates = () => {
    const fresh: Record<string, any> = {
      media_title: 'Bohemian Rhapsody',
      media_artist: 'Queen',
      'sensor.media_title': 'Bohemian Rhapsody',
      'sensor.media_artist': 'Queen',
    };
    RAW_CSV_ENTITIES.forEach(e => {
      fresh[e.entity_id] = e.state;
    });
    setEntityStates(fresh);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/25">
              <Cpu className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold tracking-tight text-white">
                  ESP32 Touch Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  ESPHome + HA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Konfigurator ekranu dotykowego z Twoimi encjami Home Assistant
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Układ Widgetów</span>
            </button>
            <button
              onClick={() => setActiveTab('entities')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'entities'
                  ? 'bg-lime-500 text-slate-950 shadow-sm shadow-lime-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Baza Encji HA</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {haEntities.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'hardware'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Płytka i Sprzęt</span>
            </button>
            <button
              onClick={() => setActiveTab('yaml')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'yaml'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Generuj YAML</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-1.5"
              title="Kopia zapasowa / Wczytaj JSON"
            >
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Kopia / JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: Editor + Live Simulator */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Live Physical Simulator & HA State Drawer */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6 lg:sticky lg:top-20">
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Podgląd Na Żywo (Dotknij aby przetestować)</span>
                  </div>
                  <button
                    onClick={() => setShowSimulatorDrawer(!showSimulatorDrawer)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                  >
                    {showSimulatorDrawer ? 'Ukryj suwaki HA' : 'Pokaż suwaki HA'}
                  </button>
                </div>

                {/* Display Simulator Component */}
                <DisplaySimulator
                  config={config}
                  activeScreenIndex={activeScreenIndex}
                  onScreenChange={setActiveScreenIndex}
                  entityStates={entityStates}
                  onEntityStateToggle={handleEntityStateToggle}
                  onThemeChange={(theme) => setConfig(prev => ({ ...prev, theme }))}
                />
              </div>

              {/* Collapsible HA States Simulator Drawer */}
              {showSimulatorDrawer && (
                <EntitySimulatorDrawer
                  entityStates={entityStates}
                  onUpdateState={handleUpdateSimulatedState}
                  onResetStates={handleResetSimulatedStates}
                />
              )}
            </div>

            {/* Right Column: Screen & Widget Customization Panel */}
            <div className="lg:col-span-6 xl:col-span-6 space-y-6">
              <ScreenEditor
                config={config}
                activeScreenIndex={activeScreenIndex}
                onScreenChange={setActiveScreenIndex}
                onUpdateConfig={setConfig}
              />
            </div>
          </div>
        )}

        {/* TAB 2: Home Assistant Entity Importer & Database */}
        {activeTab === 'entities' && (
          <div className="max-w-6xl mx-auto">
            <HaEntityImporter
              entities={haEntities}
              onUpdateEntities={setHaEntities}
              config={config}
              onUpdateConfig={setConfig}
              onNavigateToScreen={(idx) => {
                setActiveScreenIndex(idx);
                setActiveTab('editor');
              }}
            />
          </div>
        )}

        {/* TAB 2: Hardware Settings */}
        {activeTab === 'hardware' && (
          <div className="max-w-4xl mx-auto">
            <HardwareSettings config={config} onUpdateConfig={setConfig} />
          </div>
        )}

        {/* TAB 3: YAML Code Generator & Flash Guide */}
        {activeTab === 'yaml' && (
          <div className="max-w-5xl mx-auto">
            <YamlViewer config={config} onUpdateConfig={setConfig} entities={haEntities} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ESP32 ESPHome & Home Assistant Touchscreen Studio</span>
          <span className="text-slate-600">
            Encje wgrane dla: Shelly 1, Shelly 2PM, Bambu Lab A1 Mini, Philips TV, Biuro, Pogoda & Sun
          </span>
        </div>
      </footer>

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        config={config}
        onImportConfig={setConfig}
      />
    </div>
  );
}
