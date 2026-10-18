import React from 'react';
import { Sliders, RotateCcw, Flame, Tv, Zap, Printer, CloudSun, Calendar } from 'lucide-react';

interface EntitySimulatorDrawerProps {
  entityStates: Record<string, any>;
  onUpdateState: (key: string, value: any) => void;
  onResetStates: () => void;
}

export const EntitySimulatorDrawer: React.FC<EntitySimulatorDrawerProps> = ({
  entityStates,
  onUpdateState,
  onResetStates,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Symulator Stanów Home Assistant</h3>
            <p className="text-xs text-slate-400">Zmieniaj parametry w czasie rzeczywistym i testuj ekran</p>
          </div>
        </div>
        <button
          onClick={onResetStates}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Resetuj</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bambu Lab Simulator Controls */}
        <div className="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Printer className="w-4 h-4" />
            <span>Bambu Lab A1 Mini</span>
          </div>

          {/* Progress Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Postęp druku:</span>
              <span className="font-mono font-bold text-emerald-400">
                {entityStates['sensor.a1mini_0300da630400533_postep_drukowania']}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={entityStates['sensor.a1mini_0300da630400533_postep_drukowania'] || 68}
              onChange={e => onUpdateState('sensor.a1mini_0300da630400533_postep_drukowania', e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Nozzle Temp */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Temp. Dyszy (Hotend):</span>
              <span className="font-mono font-bold text-orange-400">
                {entityStates['sensor.a1mini_0300da630400533_temperatura_dyszy']}°C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="280"
              value={entityStates['sensor.a1mini_0300da630400533_temperatura_dyszy'] || 220}
              onChange={e => onUpdateState('sensor.a1mini_0300da630400533_temperatura_dyszy', e.target.value)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Bed Temp */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Temp. Stołu (Heatbed):</span>
              <span className="font-mono font-bold text-amber-400">
                {entityStates['sensor.a1mini_0300da630400533_temperatura_stolu']}°C
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={entityStates['sensor.a1mini_0300da630400533_temperatura_stolu'] || 60}
              onChange={e => onUpdateState('sensor.a1mini_0300da630400533_temperatura_stolu', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* State selector */}
          <div className="flex gap-1.5 pt-1">
            {['Drukowanie', 'Wstrzymany', 'Gotowa'].map(status => (
              <button
                key={status}
                onClick={() => {
                  onUpdateState('sensor.a1mini_0300da630400533_status_druku', status);
                  onUpdateState(
                    'sensor.a1mini_0300da630400533_aktualny_stan',
                    status === 'Drukowanie' ? 'printing' : status === 'Wstrzymany' ? 'paused' : 'idle'
                  );
                }}
                className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-colors border ${
                  entityStates['sensor.a1mini_0300da630400533_status_druku'] === status
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Media & Audio Controls */}
        <div className="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Tv className="w-4 h-4" />
            <span>Multimedia & Telewizor</span>
          </div>

          {/* Mi Box 2 State */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Xiaomi Mi Box 2:</span>
            <button
              onClick={() =>
                onUpdateState(
                  'media_player.mi_box_2',
                  entityStates['media_player.mi_box_2'] === 'playing' ? 'paused' : 'playing'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                entityStates['media_player.mi_box_2'] === 'playing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {entityStates['media_player.mi_box_2'] === 'playing' ? 'Odtwarza' : 'Zatrzymany'}
            </button>
          </div>

          {/* TV State */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Philips 58PUS8517:</span>
            <button
              onClick={() =>
                onUpdateState(
                  'media_player.58pus8517_12_3',
                  entityStates['media_player.58pus8517_12_3'] === 'playing' ? 'paused' : 'playing'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                entityStates['media_player.58pus8517_12_3'] === 'playing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {entityStates['media_player.58pus8517_12_3'] === 'playing' ? 'Odtwarza' : 'Zatrzymany'}
            </button>
          </div>

          {/* Głośnik Biuro */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Głośnik Biuro:</span>
            <button
              onClick={() =>
                onUpdateState(
                  'media_player.biuro_2',
                  entityStates['media_player.biuro_2'] === 'playing' ? 'idle' : 'playing'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                entityStates['media_player.biuro_2'] === 'playing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {entityStates['media_player.biuro_2'] === 'playing' ? 'Gra muzykę' : 'Bezczynny'}
            </button>
          </div>

          {/* Chromecast Salon */}
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Chromecast HD Salon:</span>
            <button
              onClick={() =>
                onUpdateState(
                  'media_player.salon_2',
                  entityStates['media_player.salon_2'] === 'playing' ? 'off' : 'playing'
                )
              }
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                entityStates['media_player.salon_2'] === 'playing'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {entityStates['media_player.salon_2'] === 'playing' ? 'Aktywny' : 'Wyłączony'}
            </button>
          </div>

          {/* Symulacja utworu i wykonawcy */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400">Aktualny Utwór & Wykonawca:</div>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Tytuł utworu (np. Bohemian Rhapsody)"
                value={entityStates['media_title'] !== undefined ? entityStates['media_title'] : 'Bohemian Rhapsody'}
                onChange={e => {
                  onUpdateState('media_title', e.target.value);
                  onUpdateState('sensor.media_title', e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Wykonawca (np. Queen)"
                value={entityStates['media_artist'] !== undefined ? entityStates['media_artist'] : 'Queen'}
                onChange={e => {
                  onUpdateState('media_artist', e.target.value);
                  onUpdateState('sensor.media_artist', e.target.value);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
            {/* Quick Song Switchers */}
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              <button
                type="button"
                onClick={() => {
                  onUpdateState('media_title', 'Bohemian Rhapsody');
                  onUpdateState('sensor.media_title', 'Bohemian Rhapsody');
                  onUpdateState('media_artist', 'Queen');
                  onUpdateState('sensor.media_artist', 'Queen');
                  onUpdateState('media_player.mi_box_2', 'playing');
                }}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition-colors"
              >
                Queen
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateState('media_title', 'Małomiasteczkowy');
                  onUpdateState('sensor.media_title', 'Małomiasteczkowy');
                  onUpdateState('media_artist', 'Dawid Podsiadło');
                  onUpdateState('sensor.media_artist', 'Dawid Podsiadło');
                  onUpdateState('media_player.mi_box_2', 'playing');
                }}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition-colors"
              >
                Podsiadło
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateState('media_title', 'Szary świat');
                  onUpdateState('sensor.media_title', 'Szary świat');
                  onUpdateState('media_artist', 'Sanah & Kwiat Jabłoni');
                  onUpdateState('sensor.media_artist', 'Sanah & Kwiat Jabłoni');
                  onUpdateState('media_player.mi_box_2', 'playing');
                }}
                className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-800 transition-colors"
              >
                Sanah
              </button>
            </div>
          </div>
        </div>

        {/* Shelly & Relay Powers */}
        <div className="space-y-3 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Zap className="w-4 h-4" />
            <span>Pomiary Mocy Shelly</span>
          </div>

          {/* Shelly Channel 1 Power */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Shelly 2PM Out 1 (W):</span>
              <span className="font-mono font-bold text-amber-400">
                {entityStates['sensor.shelly2pmg4_1020bafb63d4_output_0_moc']} W
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="5"
              value={parseFloat(entityStates['sensor.shelly2pmg4_1020bafb63d4_output_0_moc'] || 0)}
              onChange={e => onUpdateState('sensor.shelly2pmg4_1020bafb63d4_output_0_moc', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Shelly Channel 2 Power */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Shelly 2PM Out 2 (W):</span>
              <span className="font-mono font-bold text-emerald-400">
                {entityStates['sensor.shelly2pmg4_1020bafb63d4_output_1_moc']} W
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2500"
              step="5"
              value={parseFloat(entityStates['sensor.shelly2pmg4_1020bafb63d4_output_1_moc'] || 14.2)}
              onChange={e => onUpdateState('sensor.shelly2pmg4_1020bafb63d4_output_1_moc', e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Pogoda dla mojej lokalizacji */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <CloudSun className="w-4 h-4" />
              <span>Pogoda (Moja Lokalizacja)</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Temperatura na zewnątrz:</span>
              <span className="font-mono font-bold text-sky-300">
                {entityStates['sensor.weather_temperature'] || '21.4'}°C
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="38"
              step="0.5"
              value={parseFloat(entityStates['sensor.weather_temperature'] || '21.4')}
              onChange={e => {
                onUpdateState('sensor.weather_temperature', e.target.value);
                onUpdateState('weather.forecast_dom', {
                  ...(typeof entityStates['weather.forecast_dom'] === 'object' ? entityStates['weather.forecast_dom'] : {}),
                  temperature: parseFloat(e.target.value)
                });
              }}
              className="w-full accent-sky-400 cursor-pointer"
            />

            {/* Condition buttons */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              {[
                { id: 'partlycloudy', label: 'Częściowo' },
                { id: 'sunny', label: 'Słońce' },
                { id: 'rainy', label: 'Deszcz' },
                { id: 'cloudy', label: 'Pochmurno' },
                { id: 'lightning', label: 'Burza' },
                { id: 'snowy', label: 'Śnieg' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    onUpdateState('weather.forecast_dom', c.id);
                    onUpdateState('weather.home', c.id);
                  }}
                  className={`py-1 text-[10px] rounded border transition-colors ${
                    (entityStates['weather.forecast_dom'] === c.id || entityStates['weather.home'] === c.id)
                      ? 'bg-sky-500/25 border-sky-400 text-sky-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
