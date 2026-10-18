import { HAEntity } from '../types';

export const RAW_CSV_ENTITIES: HAEntity[] = [
  // Lights & Switches
  { entity_id: 'switch.swiatlo', name: 'Światło', state: 'off', domain: 'switch', category: 'lights' },
  { entity_id: 'binary_sensor.swiatlo_wejscie', name: 'Światło Wejście', state: 'off', domain: 'binary_sensor', category: 'lights' },
  { entity_id: 'switch.shelly1_40f5202d59df', name: 'Shelly 1 Główny', state: 'on', domain: 'switch', category: 'lights' },
  { entity_id: 'binary_sensor.shelly1_40f5202d59df_wejscie', name: 'Shelly 1 Wejście', state: 'on', domain: 'binary_sensor', category: 'lights' },
  { entity_id: 'switch.shelly2pmg4_1020bafb63d4_output_0', name: 'Shelly 2PM - Wyjście 1', state: 'off', domain: 'switch', category: 'lights' },
  { entity_id: 'switch.shelly2pmg4_1020bafb63d4_output_1', name: 'Shelly 2PM - Wyjście 2', state: 'on', domain: 'switch', category: 'lights' },
  { entity_id: 'binary_sensor.shelly2pmg4_1020bafb63d4_wejscie_0', name: 'Shelly 2PM Wejście 0', state: 'off', domain: 'binary_sensor', category: 'lights' },
  { entity_id: 'binary_sensor.shelly2pmg4_1020bafb63d4_wejscie_1', name: 'Shelly 2PM Wejście 1', state: 'on', domain: 'binary_sensor', category: 'lights' },
  { entity_id: 'light.officedesk_led', name: 'OfficeDesk LED', state: 'off', domain: 'light', category: 'lights' },
  { entity_id: 'light.officedesk_power_display_backlight', name: 'OfficeDesk Podświetlenie Ekranu', state: 'on', domain: 'light', category: 'lights' },

  // Bambu Lab A1 Mini
  { entity_id: 'sensor.a1mini_0300da630400533_aktualny_stan', name: 'A1 Mini: Stan Drukarki', state: 'printing', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_status_druku', name: 'A1 Mini: Status Druku', state: 'Drukowanie', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_postep_drukowania', name: 'A1 Mini: Postęp Drukowania', state: '68', domain: 'sensor', unit: '%', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_temperatura_dyszy', name: 'A1 Mini: Temperatura Dyszy', state: '220', domain: 'sensor', unit: '°C', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_docelowa_temperatura_dyszy', name: 'A1 Mini: Docelowa Temp. Dyszy', state: '220', domain: 'sensor', unit: '°C', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_temperatura_stolu', name: 'A1 Mini: Temperatura Stołu', state: '60', domain: 'sensor', unit: '°C', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_docelowa_temperatura_stolu', name: 'A1 Mini: Docelowa Temp. Stołu', state: '60', domain: 'sensor', unit: '°C', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_pozostaly_czas', name: 'A1 Mini: Pozostały Czas', state: '42 min', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_calkowity_czas_pracy', name: 'A1 Mini: Czas Pracy', state: '1h 24m', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_aktualna_warstwa', name: 'A1 Mini: Aktualna Warstwa', state: '184', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_laczna_liczba_warstw', name: 'A1 Mini: Łączna Liczba Warstw', state: '270', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_nazwa_zadania', name: 'A1 Mini: Nazwa Zadania', state: 'esp32_cyd_enclosure.gcode', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_nazwa_pliku_g_code', name: 'A1 Mini: Plik G-code', state: 'esp32_cyd_enclosure.gcode', domain: 'sensor', category: 'printer' },
  { entity_id: 'sensor.a1mini_0300da630400533_predkosc_wentylatora_chlodzacego', name: 'A1 Mini: Wentylator Chłodzenia', state: '100', domain: 'sensor', unit: '%', category: 'printer' },
  { entity_id: 'light.a1mini_0300da630400533_oswietlenie_wnetrza', name: 'A1 Mini: Światło LED', state: 'on', domain: 'light', category: 'printer' },
  { entity_id: 'button.a1mini_0300da630400533_wstrzymaj_drukowanie', name: 'A1 Mini: Wstrzymaj Druk', state: 'press', domain: 'button', category: 'printer' },
  { entity_id: 'button.a1mini_0300da630400533_wznow_drukowanie', name: 'A1 Mini: Wznów Druk', state: 'press', domain: 'button', category: 'printer' },
  { entity_id: 'button.a1mini_0300da630400533_zatrzymaj_drukowanie', name: 'A1 Mini: Zatrzymaj Druk', state: 'press', domain: 'button', category: 'printer' },
  { entity_id: 'binary_sensor.a1mini_0300da630400533_online', name: 'A1 Mini: Drukarka Online', state: 'on', domain: 'binary_sensor', category: 'printer' },
  { entity_id: 'select.a1mini_0300da630400533_predkosc_druku', name: 'A1 Mini: Prędkość Druku', state: 'Standard', domain: 'select', category: 'printer' },

  // Media Players & Now Playing
  { entity_id: 'media_player.mi_box_2', name: 'Xiaomi Mi Box 2', state: 'playing', domain: 'media_player', category: 'media' },
  { entity_id: 'sensor.media_title', name: 'Tytuł Utworu (Now Playing)', state: 'Bohemian Rhapsody', domain: 'sensor', category: 'media' },
  { entity_id: 'sensor.media_artist', name: 'Wykonawca Utworu (Now Playing)', state: 'Queen', domain: 'sensor', category: 'media' },
  { entity_id: 'media_player.58pus8517_12_3', name: 'Telewizor Philips 58PUS8517', state: 'playing', domain: 'media_player', category: 'media' },
  { entity_id: 'media_player.biuro_2', name: 'Głośnik Biuro', state: 'idle', domain: 'media_player', category: 'media' },
  { entity_id: 'media_player.salon_2', name: 'Chromecast HD Salon', state: 'paused', domain: 'media_player', category: 'media' },
  { entity_id: 'media_player.mi_box', name: 'Mi Box TV', state: 'off', domain: 'media_player', category: 'media' },
  { entity_id: 'media_player.xbox', name: 'Konsola XBOX', state: 'idle', domain: 'media_player', category: 'media' },

  // Calendar, Sun & Weather
  { entity_id: 'weather.forecast_dom', name: 'Pogoda Dom (Moja Lokalizacja)', state: 'partlycloudy', domain: 'weather', category: 'calendar_sun' },
  { entity_id: 'sensor.weather_temperature', name: 'Temperatura Zewnętrzna (Moja Lokalizacja)', state: '21.4', domain: 'sensor', unit: '°C', category: 'calendar_sun' },
  { entity_id: 'weather.home', name: 'Pogoda Dom (weather.home)', state: 'partlycloudy', domain: 'weather', category: 'calendar_sun' },
  { entity_id: 'weather.forecast_home', name: 'Prognoza Pogody Dom', state: 'partlycloudy', domain: 'weather', category: 'calendar_sun' },
  { entity_id: 'calendar.familijny', name: 'Kalendarz Familijny (5 wydarzeń)', state: 'on', domain: 'calendar', category: 'calendar_sun' },
  { entity_id: 'sun.sun', name: 'Słońce', state: 'above_horizon', domain: 'sun', category: 'calendar_sun' },
  { entity_id: 'sensor.sun_next_rising', name: 'Wschód Słońca', state: '06:14', domain: 'sensor', category: 'calendar_sun' },
  { entity_id: 'sensor.sun_next_setting', name: 'Zachód Słońca', state: '18:42', domain: 'sensor', category: 'calendar_sun' },
  { entity_id: 'sensor.sun_next_dawn', name: 'Świt', state: '05:40', domain: 'sensor', category: 'calendar_sun' },
  { entity_id: 'sensor.sun_next_dusk', name: 'Zmierzch', state: '19:15', domain: 'sensor', category: 'calendar_sun' },

  // Sensors & Power
  { entity_id: 'sensor.shelly2pmg4_1020bafb63d4_output_0_moc', name: 'Shelly 2PM Out 0: Moc', state: '0.0', domain: 'sensor', unit: 'W', category: 'sensors' },
  { entity_id: 'sensor.shelly2pmg4_1020bafb63d4_output_1_moc', name: 'Shelly 2PM Out 1: Moc', state: '14.2', domain: 'sensor', unit: 'W', category: 'sensors' },
  { entity_id: 'sensor.shelly2pmg4_1020bafb63d4_output_0_energia', name: 'Shelly 2PM Out 0: Energia', state: '2.45', domain: 'sensor', unit: 'kWh', category: 'sensors' },
  { entity_id: 'sensor.shelly2pmg4_1020bafb63d4_output_1_energia', name: 'Shelly 2PM Out 1: Energia', state: '4.89', domain: 'sensor', unit: 'kWh', category: 'sensors' },
  { entity_id: 'sensor.display_wifi_signal', name: 'Sygnał WiFi Wyświetlacza', state: '-56', domain: 'sensor', unit: 'dBm', category: 'sensors' },
  { entity_id: 'number.geekmagic_display_brightness', name: 'Jasność Ekranu', state: '85', domain: 'number', unit: '%', category: 'sensors' },
];

export function getEntitiesByCategory(category: HAEntity['category']) {
  return RAW_CSV_ENTITIES.filter(e => e.category === category);
}

export function findEntity(entityId?: string): HAEntity | undefined {
  if (!entityId) return undefined;
  return RAW_CSV_ENTITIES.find(e => e.entity_id === entityId);
}
