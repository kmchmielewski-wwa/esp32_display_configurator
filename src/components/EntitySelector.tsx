import React, { useState } from 'react';
import { RAW_CSV_ENTITIES } from '../data/homeAssistantEntities';
import { HAEntity } from '../types';
import { Search, Check, ChevronDown } from 'lucide-react';

interface EntitySelectorProps {
  value?: string;
  onChange: (entityId: string) => void;
  label?: string;
  allowEmpty?: boolean;
  entities?: HAEntity[];
}

export const EntitySelector: React.FC<EntitySelectorProps> = ({
  value,
  onChange,
  label = 'Wybierz encję Home Assistant',
  allowEmpty = true,
  entities: customEntities,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Determine active entities list (passed in, from localStorage, or default RAW_CSV_ENTITIES)
  const allEntities = customEntities || (() => {
    try {
      const saved = localStorage.getItem('ha_imported_entities_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return RAW_CSV_ENTITIES;
  })();

  const selectedEntity = allEntities.find(e => e.entity_id === value);

  const filteredEntities = allEntities.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.entity_id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative">
      {label && <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>}

      {/* Button to open dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-left hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm"
      >
        <div className="truncate pr-2">
          {selectedEntity ? (
            <div>
              <div className="font-medium text-slate-100 truncate">{selectedEntity.name}</div>
              <div className="text-xs text-slate-400 font-mono truncate">{selectedEntity.entity_id}</div>
            </div>
          ) : value ? (
            <div className="font-mono text-cyan-300 truncate">{value}</div>
          ) : (
            <span className="text-slate-400">Wybierz encję...</span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden p-2 w-full max-h-80 flex flex-col">
            {/* Search input */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Szukaj po nazwie lub ID..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1.5 mb-1.5 text-xs border-b border-slate-800">
              {[
                { id: 'all', label: 'Wszystkie' },
                { id: 'lights', label: 'Światła/Relé' },
                { id: 'printer', label: 'Bambu Lab' },
                { id: 'media', label: 'Media' },
                { id: 'calendar_sun', label: 'Kalendarz' },
                { id: 'sensors', label: 'Pomiary' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                    filterCategory === cat.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Entity List */}
            <div className="overflow-y-auto space-y-1 pr-1 flex-1">
              {allowEmpty && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-400 hover:bg-slate-800/60 rounded-lg flex items-center justify-between"
                >
                  <span>-- Brak encji / Ręczny widget --</span>
                  {!value && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              )}

              {filteredEntities.map((ent: HAEntity) => {
                const isSelected = ent.entity_id === value;
                return (
                  <button
                    key={ent.entity_id}
                    type="button"
                    onClick={() => {
                      onChange(ent.entity_id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/30 text-white'
                        : 'hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-medium text-slate-100 truncate">{ent.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{ent.entity_id}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}

              {filteredEntities.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-500">
                  Nie znaleziono encji pasującej do wyszukiwania.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
