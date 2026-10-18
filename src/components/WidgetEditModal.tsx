import React, { useState } from 'react';
import { ColorAccent, ScreenWidget, WidgetType } from '../types';
import { EntitySelector } from './EntitySelector';
import { AVAILABLE_ICONS, IconRenderer } from './IconRenderer';
import { X, Sparkles, LayoutGrid, Palette } from 'lucide-react';
import { findEntity } from '../data/homeAssistantEntities';

interface WidgetEditModalProps {
  widget: ScreenWidget | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: ScreenWidget) => void;
}

const WIDGET_TYPES: { id: WidgetType; label: string; description: string; defaultColSpan: 1 | 2; icon: string }[] = [
  {
    id: 'home_clock_date',
    label: 'Strona Startowa: Zegar & Data',
    description: 'Duży zegar cyfrowy, data w języku polskim oraz pogoda z Home Assistant',
    defaultColSpan: 2,
    icon: 'Clock',
  },
  {
    id: 'quick_slot_button',
    label: 'Slot Szybki (Start)',
    description: 'Jeden z 4 konfigurowalnych przycisków / sensorów na stronie startowej',
    defaultColSpan: 1,
    icon: 'Sparkles',
  },
  {
    id: 'media_single_player',
    label: 'Pojedynczy Odtwarzacz & Głośność',
    description: 'Pełne sterowanie wybranym odtwarzaczem: głośność, mute, play/pause, okładka',
    defaultColSpan: 2,
    icon: 'Tv',
  },
  {
    id: 'bambu_stats_overview',
    label: 'Bambu Lab: Podgląd Parametrów',
    description: 'Tylko odczyt: wentylator, prędkość druku, czas łączny, stan online',
    defaultColSpan: 2,
    icon: 'Activity',
  },
  {
    id: 'toggle_button',
    label: 'Przycisk Włącz / Wyłącz',
    description: 'Dotykowy przycisk do światła, przekaźnika lub gniazdka',
    defaultColSpan: 1,
    icon: 'Lightbulb',
  },
  {
    id: 'power_switch_card',
    label: 'Przełącznik z Pomiarem Mocy',
    description: 'Przycisk ze wskazaniem bieżącego poboru (np. Shelly 2PM W / kWh)',
    defaultColSpan: 1,
    icon: 'Zap',
  },
  {
    id: 'bambu_temperatures',
    label: 'Bambu Lab: Temperatury',
    description: 'Wskaźnik temperatury dyszy (hotend) i stołu grzejnego (heatbed)',
    defaultColSpan: 1,
    icon: 'Thermometer',
  },
  {
    id: 'bambu_progress',
    label: 'Bambu Lab: Pasek Postępu',
    description: 'Wskaźnik procentowy druku, aktualna warstwa i pozostały czas',
    defaultColSpan: 1,
    icon: 'Gauge',
  },
  {
    id: 'bambu_file_info',
    label: 'Bambu Lab: Karta Wydruku',
    description: 'Nazwa pliku gcode, aktualny status i miniatura',
    defaultColSpan: 2,
    icon: 'Box',
  },
  {
    id: 'bambu_controls',
    label: 'Bambu Lab: Przyciski Akcji',
    description: 'Dotykowe przyciski: Pauza, Wznów, Stop oraz oświetlenie LED',
    defaultColSpan: 2,
    icon: 'Sliders',
  },
  {
    id: 'media_player_card',
    label: 'Karta Multimediów (Duża)',
    description: 'Pełny odtwarzacz: głośność, status, okładka i sterowanie',
    defaultColSpan: 2,
    icon: 'Tv',
  },
  {
    id: 'media_mini_control',
    label: 'Mini Odtwarzacz Dźwięku',
    description: 'Kompaktowy kafelek głośnika (Play/Pause, głośność)',
    defaultColSpan: 1,
    icon: 'Speaker',
  },
  {
    id: 'clock_weather',
    label: 'Zegar Cyfrowy i Pogoda',
    description: 'Godzina, data, stan aury i temperatura zewnętrzna',
    defaultColSpan: 2,
    icon: 'CloudSun',
  },
  {
    id: 'sun_widget',
    label: 'Słońce & Zmierzch',
    description: 'Wschód, zachód słońca oraz zmierzch z Home Assistant',
    defaultColSpan: 1,
    icon: 'Sunset',
  },
  {
    id: 'family_calendar_events',
    label: 'Kalendarz Familijny (5 wydarzeń)',
    description: '5 nadchodzących wydarzeń z kalendarza rodzinnego',
    defaultColSpan: 1,
    icon: 'Calendar',
  },
];

const COLOR_ACCENTS: { id: ColorAccent; label: string; bgClass: string }[] = [
  { id: 'cyan', label: 'Turkus / Cyan', bgClass: 'bg-cyan-500' },
  { id: 'emerald', label: 'Szmaragd / Emerald', bgClass: 'bg-emerald-500' },
  { id: 'amber', label: 'Bursztyn / Amber', bgClass: 'bg-amber-500' },
  { id: 'orange', label: 'Pomarańcz / Orange', bgClass: 'bg-orange-500' },
  { id: 'rose', label: 'Róż / Rose', bgClass: 'bg-rose-500' },
  { id: 'indigo', label: 'Indygo / Fiolet', bgClass: 'bg-indigo-500' },
  { id: 'sky', label: 'Błękit / Sky', bgClass: 'bg-sky-500' },
];

export const WidgetEditModal: React.FC<WidgetEditModalProps> = ({
  widget,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !widget) return null;

  const [form, setForm] = useState<ScreenWidget>({ ...widget });

  const handleTypeChange = (newType: WidgetType) => {
    const meta = WIDGET_TYPES.find(t => t.id === newType);
    setForm(prev => ({
      ...prev,
      type: newType,
      colSpan: meta ? meta.defaultColSpan : prev.colSpan,
      icon: meta ? meta.icon : prev.icon,
    }));
  };

  const handleEntitySelected = (entityId: string) => {
    const ent = findEntity(entityId);
    setForm(prev => ({
      ...prev,
      entityId,
      title: prev.title || (ent ? ent.name : ''),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <IconRenderer name={form.icon || 'Sliders'} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Personalizacja Widgetu</h2>
              <p className="text-xs text-slate-400">Dostosuj parametry kafelka na ekranie dotykowym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Widget Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Rodzaj Widgetu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {WIDGET_TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    form.type === type.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-white ring-1 ring-cyan-500/40'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${form.type === type.id ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                    <IconRenderer name={type.icon} className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate">{type.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Tytuł Kafelka
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="np. Oświetlenie Główne"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Podtytuł / Etykieta
              </label>
              <input
                type="text"
                value={form.subtitle || ''}
                onChange={e => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                placeholder="np. Salon / Wejście"
              />
            </div>
          </div>

          {/* HA Entities */}
          <div className="space-y-3">
            <EntitySelector
              label="Główna Encja Home Assistant"
              value={form.entityId}
              onChange={handleEntitySelected}
            />

            {(form.type === 'power_switch_card' ||
              form.type === 'bambu_temperatures' ||
              form.type === 'bambu_progress' ||
              form.type === 'sun_widget' ||
              form.type === 'system_info' ||
              form.type === 'toggle_button') && (
              <EntitySelector
                label="Dodatkowa / Druga Encja (np. Pomiar W / Temp. Stołu)"
                value={form.secondaryEntityId}
                onChange={entId => setForm({ ...form, secondaryEntityId: entId })}
              />
            )}
          </div>

          {/* Width & Icon & Accent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Width */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Szerokość (Kolumny)
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, colSpan: 1 })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    form.colSpan === 1
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>1/2</span>
                  <span className="text-[10px] text-slate-400">Pół</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, colSpan: 2 })}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    form.colSpan === 2
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>2/2</span>
                  <span className="text-[10px] text-slate-400">Pełna</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Akcent Kolorystyczny
              </label>
              <div className="flex gap-2 items-center flex-wrap">
                {COLOR_ACCENTS.map(acc => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setForm({ ...form, colorAccent: acc.id })}
                    className={`w-7 h-7 rounded-lg ${acc.bgClass} flex items-center justify-center transition-transform hover:scale-110 ${
                      form.colorAccent === acc.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={acc.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Ikona Kafelka
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-950 rounded-xl border border-slate-800 max-h-28 overflow-y-auto">
              {AVAILABLE_ICONS.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setForm({ ...form, icon: iconName })}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                    form.icon === iconName
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                  title={iconName}
                >
                  <IconRenderer name={iconName} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              Zapisz Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
