import React, { useState, useRef } from 'react';
import { HAEntity, ConfigProfile, DisplayScreen, ScreenWidget } from '../types';
import { parseHaFileContent, suggestIconForEntity, formatFriendlyName } from '../utils/haEntityParser';
import { RAW_CSV_ENTITIES } from '../data/homeAssistantEntities';
import { IconRenderer } from './IconRenderer';
import {
  Upload,
  FileText,
  Search,
  Plus,
  Check,
  Layers,
  Sparkles,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  Sliders,
  Tv,
  Lightbulb,
  Printer,
  Calendar,
  Activity,
  Zap,
  HelpCircle
} from 'lucide-react';

interface HaEntityImporterProps {
  entities: HAEntity[];
  onUpdateEntities: (entities: HAEntity[]) => void;
  config: ConfigProfile;
  onUpdateConfig: React.Dispatch<React.SetStateAction<ConfigProfile>>;
  onNavigateToScreen?: (screenIndex: number) => void;
}

export const HaEntityImporter: React.FC<HaEntityImporterProps> = ({
  entities,
  onUpdateEntities,
  config,
  onUpdateConfig,
  onNavigateToScreen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pastedText, setPastedText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());
  const [targetScreenId, setTargetScreenId] = useState<string>(config.screens[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered entities
  const filteredEntities = entities.filter(ent => {
    const matchesSearch =
      ent.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ent.domain.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'lights') return ent.domain === 'light' || ent.domain === 'switch';
    if (selectedCategory === 'media') return ent.domain === 'media_player';
    if (selectedCategory === 'printer') return ent.category === 'printer' || ent.entity_id.includes('a1mini') || ent.entity_id.includes('bambu');
    if (selectedCategory === 'calendar_sun') return ent.domain === 'calendar' || ent.domain === 'sun' || ent.domain === 'weather' || ent.domain === 'todo';
    if (selectedCategory === 'sensors') return ent.domain === 'sensor' || ent.domain === 'binary_sensor' || ent.domain === 'number';
    return ent.category === selectedCategory;
  });

  const showNotification = (msg: string) => {
    setImportNotification(msg);
    setTimeout(() => setImportNotification(null), 4000);
  };

  // Process text or file content
  const handleImportContent = (content: string, sourceName = 'plik') => {
    try {
      const parsed = parseHaFileContent(content);
      if (parsed.length === 0) {
        showNotification('Nie znaleziono encji Home Assistant w podanym pliku.');
        return;
      }

      // Merge with existing entities without duplicating entity_id
      const existingMap = new Map<string, HAEntity>();
      entities.forEach(e => existingMap.set(e.entity_id, e));

      let addedCount = 0;
      let updatedCount = 0;

      parsed.forEach(p => {
        if (existingMap.has(p.entity_id)) {
          const current = existingMap.get(p.entity_id)!;
          existingMap.set(p.entity_id, {
            ...current,
            name: p.name || current.name,
            state: p.state !== 'unknown' ? p.state : current.state,
            unit: p.unit || current.unit,
          });
          updatedCount++;
        } else {
          existingMap.set(p.entity_id, p);
          addedCount++;
        }
      });

      const merged = Array.from(existingMap.values());
      onUpdateEntities(merged);
      setPastedText('');
      setShowPasteBox(false);

      showNotification(`Zaimportowano z ${sourceName}: dodano ${addedCount} nowych encji, zaktualizowano ${updatedCount}.`);
    } catch (e: any) {
      showNotification(`Błąd podczas parsowania: ${e?.message || 'Nieznany błąd'}`);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        handleImportContent(content, file.name);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Load standard factory sample entities
  const handleLoadSampleEntities = () => {
    onUpdateEntities(RAW_CSV_ENTITIES);
    showNotification(`Załadowano ${RAW_CSV_ENTITIES.length} fabrycznych encji Home Assistant.`);
  };

  // Toggle selection
  const handleToggleSelectEntity = (id: string) => {
    const next = new Set(selectedEntityIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEntityIds(next);
  };

  // Select all visible
  const handleSelectAllVisible = () => {
    if (selectedEntityIds.size === filteredEntities.length) {
      setSelectedEntityIds(new Set());
    } else {
      setSelectedEntityIds(new Set(filteredEntities.map(e => e.entity_id)));
    }
  };

  // Copy Entity ID
  const handleCopyId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Add a single entity to target screen
  const handleAddEntityToScreen = (ent: HAEntity, screenId: string) => {
    const icon = suggestIconForEntity(ent.entity_id);
    const newWidget: ScreenWidget = {
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: ent.domain === 'light' || ent.domain === 'switch'
        ? 'quick_slot_button'
        : ent.domain === 'media_player'
        ? 'media_single_player'
        : 'sensor_gauge',
      title: ent.name || formatFriendlyName(ent.entity_id),
      subtitle: ent.entity_id,
      entityId: ent.entity_id,
      icon,
      colSpan: ent.domain === 'media_player' ? 2 : 1,
      colorAccent: ent.domain === 'light' ? 'amber' : ent.domain === 'media_player' ? 'indigo' : 'cyan',
    };

    onUpdateConfig(prev => ({
      ...prev,
      screens: prev.screens.map(s => {
        if (s.id !== screenId) return s;
        return {
          ...s,
          widgets: [...s.widgets, newWidget],
        };
      }),
    }));

    const targetIdx = config.screens.findIndex(s => s.id === screenId);
    showNotification(`Dodano encję "${ent.name}" do ekranu "${config.screens[targetIdx]?.title || 'Wybrany'}"`);
    if (onNavigateToScreen && targetIdx !== -1) {
      onNavigateToScreen(targetIdx);
    }
  };

  // Create new screen with selected entities
  const handleCreateScreenFromSelected = () => {
    if (selectedEntityIds.size === 0) return;

    const selectedList = entities.filter(e => selectedEntityIds.has(e.entity_id));
    const firstDomain = selectedList[0]?.domain || 'smart_home';
    const screenTitle =
      firstDomain === 'light'
        ? 'Światła'
        : firstDomain === 'media_player'
        ? 'Odtwarzacze'
        : firstDomain === 'switch'
        ? 'Przełączniki'
        : 'Nowy Panel';

    const newScreenId = `screen_${Date.now()}`;
    const newWidgets: ScreenWidget[] = selectedList.map((ent, idx) => ({
      id: `w_imported_${Date.now()}_${idx}`,
      type: ent.domain === 'light' || ent.domain === 'switch' ? 'toggle_button' : 'sensor_gauge',
      title: ent.name || formatFriendlyName(ent.entity_id),
      subtitle: ent.entity_id,
      entityId: ent.entity_id,
      icon: suggestIconForEntity(ent.entity_id),
      colSpan: 1,
      colorAccent: idx % 2 === 0 ? 'cyan' : 'emerald',
    }));

    const newScreen: DisplayScreen = {
      id: newScreenId,
      title: screenTitle,
      icon: firstDomain === 'light' ? 'Lightbulb' : firstDomain === 'media_player' ? 'Tv' : 'Sliders',
      widgets: newWidgets,
    };

    onUpdateConfig(prev => ({
      ...prev,
      screens: [...prev.screens, newScreen],
    }));

    setSelectedEntityIds(new Set());
    const newIdx = config.screens.length;
    showNotification(`Utworzono nowy ekran "${screenTitle}" z ${selectedList.length} encjami!`);
    if (onNavigateToScreen) {
      onNavigateToScreen(newIdx);
    }
  };

  // Export current entities as JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'home_assistant_entities_export.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-lime-500/20 text-lime-400 border border-lime-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  Baza Encji Home Assistant
                  <span className="text-xs px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 font-mono border border-lime-500/30">
                    {entities.length} encji
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Zaimportuj plik CSV / JSON / YAML wyeksportowany z Home Assistant lub wklej listę encji, aby rozbudować swój panel.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-lime-500/20 active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Wgraj plik (CSV / JSON / YAML)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.yaml,.yml,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => setShowPasteBox(!showPasteBox)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{showPasteBox ? 'Ukryj wklejanie' : 'Wklej tekst'}</span>
            </button>

            <button
              onClick={handleLoadSampleEntities}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Przywróć 63 domyślne encje"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Wzorzec (63 encje)</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Pobierz kopię JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {importNotification && (
          <div className="mt-4 p-3 rounded-xl bg-lime-950/80 border border-lime-500/40 text-lime-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
            <span>{importNotification}</span>
          </div>
        )}

        {/* Collapsible Textarea for Pasting */}
        {showPasteBox && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Wklej treść z Home Assistant:</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Akceptuje eksport CSV z Narzędzi Developerskich, zrzut JSON lub listę entity_id)
                </span>
              </label>
              <span className="text-[10px] text-slate-400">
                Wspierane: CSV, JSON, YAML, TXT
              </span>
            </div>
            <textarea
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              placeholder="np. light.salon&#10;media_player.telewizor_salon&#10;sensor.temperatura_sypialnia&#10;lub wklej całą zawartość wygenerowanego pliku CSV..."
              rows={4}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-lime-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPastedText('')}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs"
              >
                Wyczyść
              </button>
              <button
                disabled={!pastedText.trim()}
                onClick={() => handleImportContent(pastedText, 'wklejonego tekstu')}
                className="px-4 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Przetwórz i dodaj encje</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar & Category Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Wszystkie', count: entities.length, icon: Layers },
            { id: 'lights', label: 'Światła & Gniazdka', count: entities.filter(e => e.domain === 'light' || e.domain === 'switch').length, icon: Lightbulb },
            { id: 'media', label: 'Multimedia', count: entities.filter(e => e.domain === 'media_player').length, icon: Tv },
            { id: 'printer', label: 'Drukarka 3D', count: entities.filter(e => e.category === 'printer' || e.entity_id.includes('a1mini')).length, icon: Printer },
            { id: 'calendar_sun', label: 'Kalendarz & Aura', count: entities.filter(e => ['calendar', 'sun', 'weather', 'todo'].includes(e.domain)).length, icon: Calendar },
            { id: 'sensors', label: 'Sensory', count: entities.filter(e => e.domain === 'sensor' || e.domain === 'binary_sensor').length, icon: Activity },
          ].map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-lime-500/20 text-lime-300 border border-lime-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Szukaj encji lub nazwy..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-lime-500"
          />
        </div>
      </div>

      {/* Batch Operations Bar */}
      {selectedEntityIds.size > 0 && (
        <div className="bg-lime-950/50 border border-lime-500/30 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-lime-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lime-300 font-mono">
              Zaznaczono: {selectedEntityIds.size} encji
            </span>
            <button
              onClick={() => setSelectedEntityIds(new Set())}
              className="text-slate-400 hover:text-slate-200 underline text-[11px]"
            >
              Odznacz wszystkie
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateScreenFromSelected}
              className="px-3 py-1.5 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-lime-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Utwórz nowy ekran z zaznaczonymi ({selectedEntityIds.size})</span>
            </button>
          </div>
        </div>
      )}

      {/* Target Screen Selector for 1-click add */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>Domyślny ekran docelowy dla przycisków "+ Dodaj":</span>
          <select
            value={targetScreenId}
            onChange={e => setTargetScreenId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:border-lime-500"
          >
            {config.screens.map((sc, idx) => (
              <option key={sc.id} value={sc.id}>
                Ekran {idx + 1}: {sc.title} ({sc.widgets.length} kafelek)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSelectAllVisible}
          className="text-xs text-slate-400 hover:text-slate-200 underline"
        >
          {selectedEntityIds.size === filteredEntities.length
            ? 'Odznacz wszystkie na liście'
            : `Zaznacz wszystkie widoczne (${filteredEntities.length})`}
        </button>
      </div>

      {/* Entities Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredEntities.map(ent => {
          const isSelected = selectedEntityIds.has(ent.entity_id);
          const iconName = suggestIconForEntity(ent.entity_id);

          return (
            <div
              key={ent.entity_id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-lime-950/30 border-lime-500/50 shadow-md shadow-lime-950/40'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 truncate">
                  {/* Select Checkbox */}
                  <button
                    onClick={() => handleToggleSelectEntity(ent.entity_id)}
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-lime-500 border-lime-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950 hover:border-slate-500'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Icon */}
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-lime-400 shrink-0">
                    <IconRenderer name={iconName} className="w-4 h-4" />
                  </div>

                  {/* Title & Entity ID */}
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-100 truncate">
                      {ent.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-slate-400 truncate">
                        {ent.entity_id}
                      </span>
                      <button
                        onClick={() => handleCopyId(ent.entity_id)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Kopiuj ID encji"
                      >
                        {copiedId === ent.entity_id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Domain Pill */}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                  {ent.domain}
                </span>
              </div>

              {/* Bottom State & 1-click Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span>Stan:</span>
                  <span className="font-mono font-semibold text-slate-200">
                    {ent.state} {ent.unit || ''}
                  </span>
                </div>

                <button
                  onClick={() => handleAddEntityToScreen(ent, targetScreenId)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-lime-500 hover:text-slate-950 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-all"
                  title="Dodaj jako kafelek do ekranu"
                >
                  <Plus className="w-3 h-3" />
                  <span>Dodaj do ekranu</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntities.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">
            Nie znaleziono encji pasujących do kryteriów
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Wgraj plik eksportu z Home Assistant (CSV lub JSON) albo zresetuj filtry wyszukiwania.
          </p>
          <button
            onClick={handleLoadSampleEntities}
            className="px-4 py-2 rounded-xl bg-lime-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Załaduj 63 przykładowe encje</span>
          </button>
        </div>
      )}
    </div>
  );
};
