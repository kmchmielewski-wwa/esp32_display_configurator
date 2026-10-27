import React, { useState } from 'react';
import { ConfigProfile, DisplayScreen, ScreenWidget, WidgetType } from '../types';
import { IconRenderer, AVAILABLE_ICONS } from './IconRenderer';
import { WidgetEditModal } from './WidgetEditModal';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit2,
  Copy,
  Layers,
  Sparkles,
  LayoutGrid,
  Lightbulb,
  Tv,
  Calendar,
  Printer,
  ChevronRight,
  SlidersHorizontal,
  FolderPlus
} from 'lucide-react';

interface ScreenEditorProps {
  config: ConfigProfile;
  activeScreenIndex: number;
  onScreenChange: (index: number) => void;
  onUpdateConfig: (updater: (prev: ConfigProfile) => ConfigProfile) => void;
}

export const ScreenEditor: React.FC<ScreenEditorProps> = ({
  config,
  activeScreenIndex,
  onScreenChange,
  onUpdateConfig,
}) => {
  const [editingWidget, setEditingWidget] = useState<ScreenWidget | null>(null);
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isAddingNewWidget, setIsAddingNewWidget] = useState(false);
  const [newScreenName, setNewScreenName] = useState('');
  const [showNewScreenInput, setShowNewScreenInput] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState<{ index: number; title: string } | null>(null);

  const activeScreen: DisplayScreen = config.screens[activeScreenIndex] || config.screens[0];

  // Screen handlers
  const handleAddScreen = () => {
    if (!newScreenName.trim()) return;
    const newScreen: DisplayScreen = {
      id: `screen_${Date.now()}`,
      title: newScreenName.trim(),
      icon: 'Layers',
      widgets: [],
    };
    onUpdateConfig(prev => ({
      ...prev,
      screens: [...prev.screens, newScreen],
    }));
    onScreenChange(config.screens.length);
    setNewScreenName('');
    setShowNewScreenInput(false);
  };

  const handlePromptDeleteScreen = (screenIndex: number) => {
    if (config.screens.length <= 1) return;
    const target = config.screens[screenIndex];
    if (target) {
      setScreenToDelete({ index: screenIndex, title: target.title });
    }
  };

  const handleDeleteScreen = (screenIndex: number) => {
    handlePromptDeleteScreen(screenIndex);
  };

  const handleConfirmDeleteScreen = () => {
    if (!screenToDelete) return;
    const targetIdx = screenToDelete.index;
    if (config.screens.length <= 1) {
      setScreenToDelete(null);
      return;
    }
    const nextScreensCount = config.screens.length - 1;
    let nextActiveIdx = activeScreenIndex;
    if (targetIdx === activeScreenIndex) {
      nextActiveIdx = Math.min(targetIdx, nextScreensCount - 1);
    } else if (targetIdx < activeScreenIndex) {
      nextActiveIdx = activeScreenIndex - 1;
    }
    onUpdateConfig(prev => ({
      ...prev,
      screens: prev.screens.filter((_, idx) => idx !== targetIdx),
    }));
    onScreenChange(Math.max(0, nextActiveIdx));
    setScreenToDelete(null);
  };

  // Widget handlers
  const handleOpenAddWidget = () => {
    const freshWidget: ScreenWidget = {
      id: `widget_${Date.now()}`,
      type: 'toggle_button',
      title: 'Nowy Przełącznik',
      subtitle: 'Dotknij aby włączyć',
      entityId: 'switch.swiatlo',
      icon: 'Power',
      colSpan: 1,
      colorAccent: 'cyan',
    };
    setEditingWidget(freshWidget);
    setIsAddingNewWidget(true);
    setIsWidgetModalOpen(true);
  };

  const handleEditWidget = (widget: ScreenWidget) => {
    setEditingWidget(widget);
    setIsAddingNewWidget(false);
    setIsWidgetModalOpen(true);
  };

  const handleSaveWidget = (savedWidget: ScreenWidget) => {
    onUpdateConfig(prev => {
      const currentScreens = [...prev.screens];
      const targetScreen = { ...currentScreens[activeScreenIndex] };

      if (isAddingNewWidget) {
        targetScreen.widgets = [...targetScreen.widgets, savedWidget];
      } else {
        targetScreen.widgets = targetScreen.widgets.map(w =>
          w.id === savedWidget.id ? savedWidget : w
        );
      }

      currentScreens[activeScreenIndex] = targetScreen;
      return { ...prev, screens: currentScreens };
    });
  };

  const handleDeleteWidget = (widgetId: string) => {
    onUpdateConfig(prev => {
      const currentScreens = [...prev.screens];
      const targetScreen = { ...currentScreens[activeScreenIndex] };
      targetScreen.widgets = targetScreen.widgets.filter(w => w.id !== widgetId);
      currentScreens[activeScreenIndex] = targetScreen;
      return { ...prev, screens: currentScreens };
    });
  };

  const handleMoveWidget = (index: number, direction: 'up' | 'down') => {
    onUpdateConfig(prev => {
      const currentScreens = [...prev.screens];
      const targetScreen = { ...currentScreens[activeScreenIndex] };
      const widgets = [...targetScreen.widgets];

      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= widgets.length) return prev;

      const temp = widgets[index];
      widgets[index] = widgets[targetIdx];
      widgets[targetIdx] = temp;

      targetScreen.widgets = widgets;
      currentScreens[activeScreenIndex] = targetScreen;
      return { ...prev, screens: currentScreens };
    });
  };

  const handleDuplicateWidget = (widget: ScreenWidget) => {
    const duplicated: ScreenWidget = {
      ...widget,
      id: `widget_${Date.now()}`,
      title: `${widget.title} (Kopia)`,
    };
    onUpdateConfig(prev => {
      const currentScreens = [...prev.screens];
      const targetScreen = { ...currentScreens[activeScreenIndex] };
      targetScreen.widgets = [...targetScreen.widgets, duplicated];
      currentScreens[activeScreenIndex] = targetScreen;
      return { ...prev, screens: currentScreens };
    });
  };

  return (
    <div className="space-y-6">
      {/* Screens Navigation & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100">Ekrany Panelu Dotykowego</h2>
          </div>

          {!showNewScreenInput ? (
            <button
              onClick={() => setShowNewScreenInput(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dodaj Ekran</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newScreenName}
                onChange={e => setNewScreenName(e.target.value)}
                placeholder="Nazwa ekranu..."
                className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 w-36"
                autoFocus
              />
              <button
                onClick={handleAddScreen}
                className="px-2.5 py-1 bg-cyan-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-cyan-400"
              >
                Dodaj
              </button>
              <button
                onClick={() => setShowNewScreenInput(false)}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs"
              >
                Anuluj
              </button>
            </div>
          )}
        </div>

        {/* Screen Tabs Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {config.screens.map((screen, idx) => {
            const isSelected = idx === activeScreenIndex;
            return (
              <div
                key={screen.id}
                onClick={() => onScreenChange(idx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/60 text-white ring-1 ring-cyan-500/30 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <IconRenderer name={screen.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold leading-4 line-clamp-2 break-words">{screen.title}</div>
                  </div>
                </div>

                {config.screens.length > 1 && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handlePromptDeleteScreen(idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-colors shrink-0 ml-1"
                    title={`Usuń ekran «${screen.title}»`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Screen Personalization Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Screen Title & Quick Rename */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <IconRenderer name={activeScreen?.icon} className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={activeScreen?.title || ''}
                  onChange={e => {
                    const newTitle = e.target.value;
                    onUpdateConfig(prev => {
                      const screens = [...prev.screens];
                      screens[activeScreenIndex] = { ...screens[activeScreenIndex], title: newTitle };
                      return { ...prev, screens };
                    });
                  }}
                  className="text-base font-bold text-slate-100 bg-transparent hover:bg-slate-800/60 focus:bg-slate-950 px-2 py-0.5 rounded-lg border border-transparent focus:border-slate-700 transition-colors focus:outline-none"
                  title="Kliknij, aby zmienić nazwę ekranu"
                />
              </div>
              <p className="text-xs text-slate-400 px-2">
                Układ kafelków na wyświetlaczu dotykowym ({activeScreen?.widgets.length} kafelków)
              </p>
            </div>
          </div>

          {/* Action buttons: Delete Screen & Add Widget */}
          <div className="flex items-center gap-2">
            {config.screens.length > 1 && (
              <button
                type="button"
                onClick={() => handlePromptDeleteScreen(activeScreenIndex)}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded-xl font-semibold text-xs transition-all active:scale-95"
                title="Usuń ten ekran z konfiguracji"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Usuń ekran</span>
              </button>
            )}

            <button
              onClick={handleOpenAddWidget}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-md shadow-cyan-500/20 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj Widget do tego Ekranu</span>
            </button>
          </div>
        </div>

        {/* Widgets List */}
        <div className="space-y-2.5">
          {activeScreen?.widgets.map((widget, index) => (
            <div
              key={widget.id}
              className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex items-center justify-between gap-3"
            >
              {/* Widget Info */}
              <div className="flex items-center gap-3 truncate flex-1">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                  <IconRenderer name={widget.icon || 'Sliders'} className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-bold text-slate-100 truncate">{widget.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {widget.colSpan === 2 ? 'Pełna szerokość' : '1/2 kolumny'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate flex items-center gap-2 mt-0.5 font-mono">
                    {widget.entityId ? (
                      <span className="text-cyan-400/90 truncate">{widget.entityId}</span>
                    ) : (
                      <span className="text-slate-500">Brak powiązanej encji</span>
                    )}
                    {widget.secondaryEntityId && (
                      <span className="text-slate-500 truncate">+ {widget.secondaryEntityId}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Reorder Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveWidget(index, 'up')}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                  title="Przesuń wyżej"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Reorder Down */}
                <button
                  type="button"
                  disabled={index === activeScreen.widgets.length - 1}
                  onClick={() => handleMoveWidget(index, 'down')}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
                  title="Przesuń niżej"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => handleDuplicateWidget(widget)}
                  className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Duplikuj"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => handleEditWidget(widget)}
                  className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Edytuj właściwości"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteWidget(widget.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Usuń widget"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {activeScreen?.widgets.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
              <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">Ten ekran jest jeszcze pusty</p>
              <p className="text-xs text-slate-500 mb-4">
                Kliknij przycisk poniżej, aby dodać przełącznik, monitor druku lub multimedia.
              </p>
              <button
                onClick={handleOpenAddWidget}
                className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors"
              >
                Dodaj Pierwszy Widget
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Widget Edit Modal */}
      <WidgetEditModal
        isOpen={isWidgetModalOpen}
        widget={editingWidget}
        onClose={() => setIsWidgetModalOpen(false)}
        onSave={handleSaveWidget}
      />

      {/* Delete Screen Confirmation Modal */}
      {screenToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Usunąć ten ekran?</h3>
                <p className="text-xs text-slate-400">Tej operacji nie można cofnąć</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Czy na pewno chcesz usunąć ekran <strong className="text-white">«{screenToDelete.title}»</strong>? Wszystkie zawarte na nim kafelki zostaną trwale usunięte.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScreenToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteScreen}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/25 transition-all active:scale-95"
              >
                Usuń ekran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
