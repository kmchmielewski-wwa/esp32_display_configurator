# ESP32 ESPHome Touch Display Configurator

## Uruchomienie w Dockerze

Wymagany jest Docker z obsługą Docker Compose. W katalogu projektu uruchom:

```sh
docker compose up --build -d
```

Aplikacja będzie dostępna pod adresem <http://localhost:8080>. Aby ją zatrzymać:

```sh
docker compose down
```

Aplikacja działa w przeglądarce; jej konfiguracja jest zapisywana w `localStorage` przeglądarki, a nie w kontenerze.

## Źródło aplikacji dla CasaOS

Repozytorium zawiera definicję aplikacji CasaOS oraz workflow publikujący obraz dla `amd64` i `arm64` i pliki sklepu w gałęzi `gh-pages`.

1. W ustawieniach repozytorium włącz GitHub Actions z prawem zapisu do zawartości repozytorium.
2. Wypchnij zmiany do gałęzi `main` lub uruchom workflow **Publish CasaOS app and store**.
3. Po pierwszym opublikowaniu obrazu ustaw pakiet `ghcr.io/kmchmielewski-wwa/esp32_display_configurator` jako publiczny. W przeciwnym razie CasaOS nie będzie mógł go pobrać.
4. Adres plików sklepu to `https://cdn.jsdelivr.net/gh/kmchmielewski-wwa/esp32_display_configurator@gh-pages`. Pakiet dla starszego formatu CasaOS znajduje się pod adresem `https://cdn.jsdelivr.net/gh/kmchmielewski-wwa/esp32_display_configurator@gh-pages/store/main.zip`.

Pierwsze uruchomienie workflow może wymagać publicznego ustawienia obrazu i ponownego uruchomienia, aby proces budowania sklepu mógł odczytać metadane obrazu z GHCR.
