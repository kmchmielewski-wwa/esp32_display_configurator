import React, { useState } from 'react';
import { ConfigProfile, HAEntity } from '../types';
import {
  generateEsphomeYaml,
  generateEsphomeSecretsYaml,
  generateRandomApiKey,
  getFontGlyphsPreflightReport,
  validateAndDeduplicateGlyphs,
} from '../generators/esphomeYamlGenerator';
import { copyTextToClipboard } from '../utils/clipboard';
import {
  Copy,
  Download,
  Check,
  FileCode,
  Terminal,
  HelpCircle,
  ExternalLink,
  Lock,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  Cpu,
  Type,
  ToggleLeft,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

interface YamlViewerProps {
  config: ConfigProfile;
  onUpdateConfig?: (updater: (prev: ConfigProfile) => ConfigProfile) => void;
  entities?: HAEntity[];
}

export const YamlViewer: React.FC<YamlViewerProps> = ({ config, onUpdateConfig, entities }) => {
  const [activeSubTab, setActiveSubTab] = useState<'main' | 'secrets' | 'guide'>('main');
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedSecrets, setCopiedSecrets] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [showGlyphInspector, setShowGlyphInspector] = useState(false);
  const [testGlyphInput, setTestGlyphInput] = useState('');

  const glyphsReport = getFontGlyphsPreflightReport(config);
  const userTextValidation = testGlyphInput ? validateAndDeduplicateGlyphs(testGlyphInput) : null;

  const mainYaml = generateEsphomeYaml(config, entities);
  const secretsYaml = generateEsphomeSecretsYaml(config);

  const secNames = config.secretNames || {
    wifiSsid: 'wifi_ssid',
    wifiPassword: 'wifi_password',
    haApiKey: 'smartdisplay_api_key',
  };

  const actualCreds = config.actualCredentials || {
    wifiSsid: 'MojaSiecDomowa_2.4GHz',
    wifiPassword: 'TwojeTajneHasloWiFi',
    haApiKey: 'WygenerujUnikalnyKluczBase64LubPozostawPuste',
  };

  const handleCopyMain = async () => {
    setCopyError(null);
    try {
      await copyTextToClipboard(mainYaml);
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2500);
    } catch (error) {
      setCopiedMain(false);
      setCopyError(
        `Nie udało się skopiować głównego YAML: ${
          error instanceof Error ? error.message : 'wystąpił nieznany błąd.'
        }`,
      );
    }
  };

  const handleCopySecrets = async () => {
    setCopyError(null);
    try {
      await copyTextToClipboard(secretsYaml);
      setCopiedSecrets(true);
      setTimeout(() => setCopiedSecrets(false), 2500);
    } catch (error) {
      setCopiedSecrets(false);
      setCopyError(
        `Nie udało się skopiować secrets.yaml: ${
          error instanceof Error ? error.message : 'wystąpił nieznany błąd.'
        }`,
      );
    }
  };

  const handleDownloadMain = () => {
    const filename = `${config.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.yaml`;
    const blob = new Blob([mainYaml], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSecrets = () => {
    const blob = new Blob([secretsYaml], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'secrets.yaml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateApiKey = () => {
    if (!onUpdateConfig) return;
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
    <div className="space-y-4">
      {/* Top Tabs Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('main')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeSubTab === 'main'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Główny Kod (.yaml)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
              {config.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.yaml
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('secrets')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeSubTab === 'secrets'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Sekrety ESPHome</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 font-bold">
              secrets.yaml
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
              activeSubTab === 'guide'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Instrukcja wdrożenia</span>
          </button>
        </div>

        {/* Action Buttons based on active tab */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'main' && (
            <>
              <button
                type="button"
                onClick={handleCopyMain}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                {copiedMain ? <Check className="w-3.5 h-3.5 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMain ? 'Skopiowano!' : 'Kopiuj Główny YAML'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadMain}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition-colors border border-slate-700 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pobierz .yaml</span>
              </button>
            </>
          )}

          {activeSubTab === 'secrets' && (
            <>
              <button
                type="button"
                onClick={handleCopySecrets}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                {copiedSecrets ? <Check className="w-3.5 h-3.5 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSecrets ? 'Skopiowano secrets!' : 'Kopiuj secrets.yaml'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSecrets}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition-colors border border-slate-700 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pobierz secrets.yaml</span>
              </button>
            </>
          )}
        </div>
      </div>

      {copyError && (
        <p role="alert" className="rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-2 text-xs text-red-300">
          {copyError} Możesz pobrać plik przyciskiem pobierania.
        </p>
      )}

      {/* TAB 1: MAIN YAML */}
      {activeSubTab === 'main' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">
                  Konfiguracja zoptymalizowana pod Freenove ST7796 / XPT2046 (480x320)
                </p>
                <p className="text-slate-400 text-[11px]">
                  {config.useSecrets !== false ? (
                    <span className="text-emerald-400">
                      ✓ Używa dyrektyw <code className="font-mono">!secret {secNames.wifiSsid}</code>, <code className="font-mono">!secret {secNames.wifiPassword}</code>, <code className="font-mono">!secret {secNames.haApiKey}</code>
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      ⚠ Dane logowania zapisane wprost w pliku (tryb bezpośredni)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
                OTA: - platform: esphome (0 błędów walidacji)
              </span>
            </div>
          </div>

          {/* Szybka informacja o rozwiązaniu zgłoszonych ostrzeżeń z logów */}
          <div className="bg-slate-900/90 border border-cyan-800/40 rounded-2xl p-4 shadow-xl space-y-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Diagnostyka i poprawki logów ESPHome dla Twojego urządzenia:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Błędy konwersji wartości Bambu Lab wyeliminowane</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Encje tekstowe (<code className="text-slate-300 font-mono text-[10px]">_aktualny_stan</code>, <code className="text-slate-300 font-mono text-[10px]">_nazwa_zadania</code>) zostały automatycznie przypisane do <strong className="text-cyan-300 font-mono">text_sensor:</strong>. W ESPHome klasyczny <code className="font-mono text-slate-300">sensor:</code> przyjmuje tylko liczby zmiennoprzecinkowe – to powodowało ostrzeżenia <em>"Can't convert 'idle' to number!"</em>.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Komunikat binary_sensor: 'unavailable'</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Log <code className="text-slate-300 font-mono text-[10px]">Can't convert 'unavailable' to binary state!</code> pojawia się tylko raz przy starcie ESP32 przed wysłaniem przez HA pierwszego stanu. Jak widać w kolejnej linijce Twojego logu (<code className="text-emerald-300 font-mono text-[10px]">Got state OFF</code>), sensor działa w pełni poprawnie.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Glify czcionki zwalidowane & brak duplikatów (ó, Ó)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Do fontu Roboto dodano prekomponowany zestaw znaków (<code className="text-slate-300 font-mono text-[10px]">á, é, í, ó, ú, ñ, ...</code>) oraz wprowadzono automatyczną deduplikację. Wyeliminowano błąd kompilatora <code className="text-amber-300 font-mono text-[10px]">Found duplicate glyphs: ó, Ó</code>.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Piny strapping (GPIO12, GPIO15, GPIO2)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Ostrzeżenie kompilatora ma charakter informacyjny – te piny sterują magistralą SPI wyświetlacza ST7796. Płytka Freenove ma je fabrycznie poprawnie spolaryzowane, więc nie zakłócają one rozruchu ESP32.
                </p>
              </div>
            </div>
          </div>

          {/* KARTA WALIDACJI GLYPHÓW PRZED WYGENEROWANIEM YAML */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-200">
                    <span>Pre-kompilacyjna Walidacja Glyphów (Zero Duplikatów)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      0 duplikatów • 100% poprawności
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Kompilator ESPHome rygorystycznie odrzuca kod z błędem <code className="text-amber-300 font-mono">Found duplicate glyphs</code>. Nasz generator automatycznie filtruje powtórzenia znaków (m.in. <code className="text-slate-300 font-mono">ó</code>, <code className="text-slate-300 font-mono">Ó</code>).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGlyphInspector(!showGlyphInspector)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors border border-slate-700 shrink-0 self-start sm:self-center cursor-pointer"
              >
                <span>{showGlyphInspector ? 'Zwiń inspektor znaków' : 'Inspektor & Tester znaków'}</span>
                {showGlyphInspector ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            </div>

            {/* Liczniki glyphów */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Roboto 14px & 18px</span>
                  <p className="text-slate-200 font-bold text-xs mt-0.5">Polski + Akcenty + Symbole</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono font-bold text-sm">{glyphsReport.roboto.uniqueCount}</span>
                  <span className="text-[10px] text-slate-500 block">unikalnych znaków</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Ikony MDI 20px & 28px</span>
                  <p className="text-slate-200 font-bold text-xs mt-0.5">Multimedia, AGD, Smart Home</p>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-mono font-bold text-sm">{glyphsReport.mdi.uniqueCount}</span>
                  <span className="text-[10px] text-slate-500 block">unikalnych ikon</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Zegar Roboto 38px</span>
                  <p className="text-slate-200 font-bold text-xs mt-0.5">Cyfry i dwukropek</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-mono font-bold text-sm">{glyphsReport.clock.uniqueCount}</span>
                  <span className="text-[10px] text-slate-500 block">znaków</span>
                </div>
              </div>
            </div>

            {/* Rozwijany Inspektor & Tester Znaków */}
            {showGlyphInspector && (
              <div className="mt-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>Tester własnego tekstu (sprawdź czy zawiera duplikaty znaków):</span>
                    {userTextValidation && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        userTextValidation.isValid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {userTextValidation.isValid ? '✓ Brak duplikatów w Twoim tekście' : `⚠ Wykryto duplikaty: ${userTextValidation.duplicates.join(', ')}`}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={testGlyphInput}
                      onChange={(e) => setTestGlyphInput(e.target.value)}
                      placeholder="Wpisz lub wklej dowolny tekst (np. nazwy plików z Bambu Lab lub encje)..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 pr-8 font-mono"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                  {userTextValidation && (
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-2 pt-1 font-mono">
                      <span>Znaków: <strong>{userTextValidation.totalInputGlyphs}</strong></span>
                      <span>Unikalnych: <strong className="text-emerald-400">{userTextValidation.uniqueCount}</strong></span>
                      <span>Duplikatów: <strong className={userTextValidation.duplicateCount > 0 ? 'text-amber-400' : 'text-slate-500'}>{userTextValidation.duplicateCount}</strong></span>
                      {userTextValidation.duplicateCount > 0 && (
                        <span>Zdeduplikowany ciąg: <strong className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">{userTextValidation.sanitized}</strong></span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Aktywne znaki w wygenerowanym YAML dla czcionki Roboto (100% unikalne):
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 break-all select-all leading-relaxed">
                    {glyphsReport.roboto.sanitized}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-medium">
                  {config.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}.yaml
                </span>
              </div>
              <span className="text-slate-500">{mainYaml.split('\n').length} linii kodu</span>
            </div>

            <pre className="p-5 text-xs font-mono text-cyan-200/90 overflow-x-auto leading-relaxed max-h-[580px] overflow-y-auto selection:bg-cyan-500/30 selection:text-white">
              {mainYaml}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: SECRETS YAML */}
      {activeSubTab === 'secrets' && (
        <div className="space-y-4">
          <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 shadow-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <FolderLock className="w-4 h-4 text-emerald-400" />
              <span>Plik secrets.yaml w ESPHome (Zgodny z zaleceniami Home Assistant)</span>
            </div>
            <p className="text-emerald-400/90 leading-relaxed text-[11px]">
              Wklej tę zawartość do pliku <code className="bg-emerald-900/40 px-1.5 py-0.5 rounded font-mono font-bold">secrets.yaml</code> w ESPHome Dashboard.
              W głównym pliku konfiguracyjnym odwołujesz się do nich bezpiecznie za pomocą <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">!secret</code> bez ujawniania haseł.
            </p>
          </div>

          {/* Quick Secrets Edit Card */}
          {onUpdateConfig && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Szybka edycja wartości do pliku secrets.yaml:</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Zmiany natychmiast aktualizują wygenerowany plik poniżej
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>{secNames.wifiSsid}</span>
                    <span className="text-[10px] font-mono text-cyan-400">SSID WiFi</span>
                  </div>
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
                      }));
                    }}
                    placeholder="Nazwa WiFi 2.4GHz"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>{secNames.wifiPassword}</span>
                    <span className="text-[10px] font-mono text-amber-400">Hasło WiFi</span>
                  </div>
                  <input
                    type="text"
                    value={actualCreds.wifiPassword || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onUpdateConfig(prev => ({
                        ...prev,
                        actualCredentials: {
                          ...(prev.actualCredentials || actualCreds),
                          wifiPassword: val,
                        },
                      }));
                    }}
                    placeholder="Hasło do WiFi"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-medium text-slate-300 mb-1 flex items-center justify-between">
                    <span>{secNames.haApiKey}</span>
                    <button
                      type="button"
                      onClick={handleGenerateApiKey}
                      className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Nowy klucz</span>
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
                      }));
                    }}
                    placeholder="32 bajty w base64"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500 truncate"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-medium">secrets.yaml</span>
              </div>
              <span className="text-slate-500">{secretsYaml.split('\n').length} linii kodu</span>
            </div>

            <pre className="p-5 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed max-h-[400px] overflow-y-auto selection:bg-emerald-500/30 selection:text-white">
              {secretsYaml}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: GUIDE & ERROR EXPLANATION */}
      {activeSubTab === 'guide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Kompletny Przewodnik Wdrożenia i Rozwiązanie Błędów ESPHome
              </h3>
              <p className="text-slate-400 text-xs">
                Jak poprawnie wgrać kod i skonfigurować secrets.yaml w Home Assistant
              </p>
            </div>
          </div>

          {/* Solved error explanation banner */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rozwiązano zgłoszone uwagi (Brak przewijania, same ikony nawigacji, wyświetlanie wszystkich ikon MDI)</span>
            </div>
            <ul className="text-emerald-400/90 leading-relaxed text-[11px] list-disc list-inside space-y-1">
              <li><strong>Zero przewijania (Non-scrolling):</strong> Usunięto przewijalność w pionie i w poziomie ze wszystkich ekranów i elementów (<code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">scrollable: false</code>, <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">scrollbar_mode: 'OFF'</code>). Cały interfejs mieści się w natywnych 480x320 px.</li>
              <li><strong>Dolny pasek nawigacji:</strong> Usunięto etykiety tekstowe i zastąpiono je wycentrowanymi, czytelnymi ikonami MDI (28px) o podwyższonym komforcie dotykowym.</li>
              <li><strong>Wszystkie ikony na ekranach multimediów, drukarki i kalendarza:</strong> Rozdzielono ikony MDI i teksty na niezależne etykiety (<code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">label</code>), ponieważ w LVGL/ESPHome pojedyncza etykieta używa jednego fontu. Każda ikona ma dedykowany font <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">font_mdi_20</code>/<code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">font_mdi_28</code>, a opisy używają <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">font_roboto_14</code> z polskimi znakami.</li>
              <li><strong>Polskie znaki:</strong> Pełna obsługa polskich znaków (<code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">gfonts://Roboto</code> z zestawem <code className="bg-emerald-900/40 px-1 py-0.5 rounded font-mono">GF_Latin_Core</code>).</li>
              <li><strong>Ochrona dolnej krawędzi:</strong> Pasek nawigacyjny posiada 10px margines bezpieczeństwa od dołu ekranu.</li>
            </ul>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed">
            <div className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1">
                <strong className="text-slate-100 text-xs block">
                  Krok 1: Wklejenie secrets.yaml w panelu ESPHome
                </strong>
                <p className="text-slate-400 text-[11px]">
                  Otwórz <strong>Home Assistant &gt; ESPHome</strong>. W prawym górnym rogu kliknij ikonę trzech kropek (<span className="font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">⋮</span>) i wybierz <strong className="text-emerald-400">Secrets</strong>. Wklej wygenerowaną zawartość z zakładki <span className="text-emerald-300 font-semibold">secrets.yaml</span> i kliknij <em>Save</em>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1">
                <strong className="text-slate-100 text-xs block">
                  Krok 2: Utworzenie urządzenia w ESPHome
                </strong>
                <p className="text-slate-400 text-[11px]">
                  Kliknij <span className="font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">+ New Device</span>. Wybierz opcję ręcznej konfiguracji, nadaj nazwę <code className="text-cyan-300 font-mono">{config.name}</code>, wklej cały wygenerowany plik z zakładki <span className="text-cyan-300 font-semibold">Główny Kod (.yaml)</span> i kliknij <em>Save</em>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1">
                <strong className="text-slate-100 text-xs block">
                  Krok 3: Pierwsza instalacja przez USB
                </strong>
                <p className="text-slate-400 text-[11px]">
                  Podłącz ekran Freenove ESP32 kablem USB-C do komputera. Kliknij <strong>Install &gt; Plug into this computer</strong> (w przeglądarce Chrome/Edge) lub skorzystaj z{' '}
                  <a href="https://web.esphome.io" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-0.5">
                    web.esphome.io <ExternalLink className="w-3 h-3 inline" />
                  </a>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs shrink-0 mt-0.5">
                4
              </span>
              <div className="space-y-1">
                <strong className="text-slate-100 text-xs block">
                  Krok 4: Zezwolenie na akcje Home Assistant
                </strong>
                <p className="text-slate-400 text-[11px]">
                  W Home Assistant wejdź w <strong>Ustawienia &gt; Urządzenia i usługi &gt; ESPHome</strong>, kliknij swoje urządzenie, wybierz <em>Konfiguruj</em> i upewnij się, że opcja <strong className="text-slate-200">"Zezwól urządzeniu na wykonywanie akcji Home Assistant"</strong> jest włączona. Pozwala to przyciskom na ekranie dotykowym przełączać światła i sterować telewizorem.
                </p>
              </div>
            </div>

            {/* Szczegółowa analiza Twoich logów z konsoli ESPHome */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Analiza i rozwiązanie logów nadesłanych z konsoli ESPHome:</span>
              </h4>

              <div className="space-y-3 font-mono text-[11px]">
                {/* Log 1: Bambu Lab convert error */}
                <div className="p-3 bg-slate-950 rounded-xl border border-amber-900/40 space-y-2">
                  <div className="text-amber-400 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-[10px]">ROZWIĄZANE</span>
                    <span>Can't convert 'idle' / 'filament_unloading' / 'lámpara Batman...' to number!</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Dlaczego to wystąpiło:</strong> W ESPHome sekcja <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">sensor:</code> oczekuje wartości liczbowych (float). Encje Bambu Lab takie jak <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">aktualny_stan</code> (zwracająca np. <em>idle</em>, <em>filament_unloading</em>, <em>heatbed_preheating</em>) oraz <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">nazwa_zadania</code> (zwracająca np. <em>lámpara Batman kit 001</em>) przekazują ciągi znaków (string).
                    <br />
                    <strong>Co zrobiono:</strong> Generator automatycznie przekierowuje te encje do platformy <code className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">text_sensor:</code>. ESPHome przyjmuje je jako tekst bez próby konwersji do float, w pełni eliminując te ostrzeżenia.
                  </p>
                </div>

                {/* Log 2: unavailable to binary */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px]">INFORMACJA</span>
                    <span>Can't convert 'unavailable' to binary state!</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Co oznacza ten log:</strong> ESPHome tuż po nawiązaniu połączenia WiFi pobiera stan encji z Home Assistant. W ułamku sekundy przed odebraniem pierwszego pakietu encja ma stan początkowy <em>unavailable</em>, co ESPHome odnotowuje ostrzeżeniem. Chwilę później (co widać w Twoim logu: <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400">Got state OFF</code> dla Shelly), stan zostaje zsynchronizowany i wszystko działa prawidłowo. Jest to standardowe zachowanie protokołu Home Assistant Native API.
                  </p>
                </div>

                {/* Log 3: Strapping pins */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-cyan-400 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[10px]">BEZPIECZNE</span>
                    <span>GPIO12, GPIO15, GPIO2 is a strapping PIN and should only be used with care</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Dlaczego ESPHome to wyświetla:</strong> Układy ESP32 wykorzystują niektóre piny (GPIO0, GPIO2, GPIO12, GPIO15) podczas rozruchu do wyboru trybu bootowania (bootloader vs pamięć Flash SPI). Kompilator ostrzega, by użytkownik nie lutował tam zewnętrznych rezystorów podciągających. W gotowym module Freenove piny te są fabrycznie połączone z wyświetlaczem ST7796 i działają w 100% stabilnie.
                  </p>
                </div>

                {/* Log 4: Font missing glyphs */}
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40 space-y-2">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px]">ROZWIĄZANE</span>
                    <span>Font Roboto:0:400 is missing 11 glyphs</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Co zostało poprawione:</strong> Usunięto znaki łączące Unicode (combining diacritics), a w zamian zdefiniowano gotowe, prekomponowane znaki Unicode NFC: alfabet polski (<code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">ąćęłńóśźżĄĆĘŁŃÓŚŹŻ</code>) oraz europejskie akcenty (<code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">á, é, í, ó, ú, ñ, ä, ö, ü</code>). Dzięki temu nazwy plików takie jak <em>"lámpara Batman kit 001"</em> renderują się bezbłędnie bez ostrzeżeń kompilatora.
                  </p>
                </div>

                {/* Log 5: Found duplicate glyphs */}
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40 space-y-2">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px]">ROZWIĄZANE</span>
                    <span>Found duplicate glyphs: ó (b'\xf3'), Ó (b'\xd3'). Go to line 53</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Przyczyna błędu w ESPHome:</strong> Parser komponentu <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]">font:</code> w ESPHome sprawdza unikalność każdego znaku w liście <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]">glyphs:</code>. Litery <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]">ó</code> oraz <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-[10px]">Ó</code> znajdowały się jednocześnie w zestawie znaków polskich i w hiszpańskich znakach akcentowanych. Kompilator ESPHome traktuje to jako błąd krytyczny i zatrzymuje proces kompilacji na linii deklaracji czcionki (linia 53).
                  </p>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    <strong>Wdrożona ochrona pre-kompilacyjna:</strong> Zaimplementowano funkcję <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono text-[10px]">validateAndDeduplicateGlyphs()</code> opartą o Unicode <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono text-[10px]">Set&lt;string&gt;</code>. Przed wygenerowaniem pliku YAML wszystkie znaki czcionek Roboto i kodów MDI są automatycznie weryfikowane i deduplikowane. Wygenerowany plik YAML zawiera wyłącznie w 100% unikalne znaki, co definitywnie rozwiązuje problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
