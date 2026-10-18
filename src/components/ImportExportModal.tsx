import React, { useState } from 'react';
import { ConfigProfile } from '../types';
import { INITIAL_CONFIG_PROFILE } from '../data/defaultScreens';
import { Download, Upload, Copy, Check, RotateCcw, X, FileJson } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigProfile;
  onImportConfig: (newConfig: ConfigProfile) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  config,
  onImportConfig,
}) => {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState(JSON.stringify(config, null, 2));
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `esphome_touch_config_${Date.now()}.json`;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
  };

  const handleApplyImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.screens || !Array.isArray(parsed.screens)) {
        throw new Error('Niepoprawny format: brak listy ekranów "screens".');
      }
      onImportConfig(parsed);
      setErrorMsg(null);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Błąd parsowania JSON');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ekrany z encjami Konrada?')) {
      onImportConfig(INITIAL_CONFIG_PROFILE);
      setJsonText(JSON.stringify(INITIAL_CONFIG_PROFILE, null, 2));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Kopia Zapasowa & Eksport / Import</h2>
              <p className="text-xs text-slate-400">Zapisz układ widgetów lub wczytaj własną konfigurację JSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Zawartość Konfiguracji JSON
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Skopiowano' : 'Kopiuj'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Pobierz plik</span>
              </button>
            </div>
          </div>

          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            rows={14}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Przywróć Ekrany Początkowe</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-xl transition-colors"
              >
                Zamknij
              </button>
              <button
                onClick={handleApplyImport}
                className="px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-colors shadow-md shadow-cyan-500/20"
              >
                Wczytaj i Zastosuj JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
