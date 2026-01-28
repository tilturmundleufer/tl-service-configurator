# Turm & Leufer Service Konfigurator

Ein interaktiver, visuell ansprechender Service-Konfigurator für B2B-Lead-Generierung auf Webflow-Websites.

## Features

- **Multi-Service-Auswahl**: Kunden können mehrere Services in einer Anfrage kombinieren
- **Progressive Enthüllung**: UI erweitert sich dynamisch basierend auf Auswahl
- **Visuelle Builds**: Seiten-/Modul-Karten zeigen die Konfiguration visuell
- **Kaskadierende Abhängigkeiten**: Entfernen eines Parents entfernt automatisch alle Kinder
- **Zweisprachig**: Deutsch/Englisch mit Browser-Erkennung
- **Inaktivitäts-Vorschläge**: Intelligente Empfehlungen nach 12s Inaktivität
- **Glass-Effekte**: Moderne, "glasige" UI mit Micro-Interactions
- **Make.com Integration**: Direkter Webhook zu Pipedrive

## Projektstruktur

```
the-one-form/
├── src/
│   ├── index.js              # Entry Point
│   ├── config.js             # Konfigurationskonstanten
│   ├── data/
│   │   └── cms-data.js       # CMS-Daten (Services, Sizes, Addons)
│   ├── state/
│   │   ├── store.js          # State Management
│   │   ├── reducer.js        # Actions & Reducer
│   │   └── selectors.js      # State-Abfragen
│   ├── render/
│   │   ├── renderer.js       # DOM-Rendering
│   │   ├── templates.js      # Template-Cloning
│   │   └── animations.js     # Animation-Helpers
│   ├── events/
│   │   └── handlers.js       # Event Delegation
│   ├── submission/
│   │   └── submit.js         # Webhook-Submission
│   └── utils/
│       ├── i18n.js           # Internationalisierung
│       └── helpers.js        # Utility-Funktionen
├── styles/
│   └── configurator.css      # Alle Styles
├── webflow/
│   └── embed-code.html       # Webflow-Integrations-Anleitung
├── dist/                     # Build-Output
├── index.html                # Lokale Entwicklungs-Vorschau
└── package.json
```

## Installation

```bash
# Dependencies installieren
npm install

# Development Build (mit Sourcemaps)
npm run build:dev

# Production Build (minifiziert)
npm run build

# Watch Mode für Entwicklung
npm run watch
```

## Lokale Entwicklung

1. Dependencies installieren:
   ```bash
   npm install
   ```

2. Build ausführen:
   ```bash
   npm run build:dev
   ```

3. `index.html` im Browser öffnen (oder mit einem lokalen Server)

## Webflow Integration

### Schritt 1: CSS hinzufügen

In Webflow Page Settings > Custom Code > Head:

```html
<link rel="stylesheet" href="https://your-cdn.com/configurator.css">
```

### Schritt 2: Root-Element hinzufügen

Embed-Komponente auf der Seite platzieren:

```html
<div data-configurator></div>
```

### Schritt 3: JavaScript hinzufügen

In Page Settings > Custom Code > Before </body>:

```html
<script src="https://your-cdn.com/configurator.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    TLConfigurator.init({
      webhookUrl: 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID',
      inactivityTimeout: 12000,
      defaultLang: 'de'
    });
  });
</script>
```

## Konfiguration

| Option | Typ | Default | Beschreibung |
|--------|-----|---------|--------------|
| `webhookUrl` | string | - | Make.com Webhook URL (required) |
| `inactivityTimeout` | number | 12000 | Inaktivitäts-Timer in ms |
| `defaultLang` | string | 'de' | Standardsprache ('de' oder 'en') |
| `autoDetectLang` | boolean | true | Browser-Sprache erkennen |
| `rootSelector` | string | '[data-configurator]' | CSS-Selector für Root |

## API

Nach Initialisierung ist die API über `window.configurator` verfügbar:

```javascript
// Aktuellen State abrufen
configurator.getState();

// Sprache wechseln
configurator.setLang('en');

// Zurücksetzen
configurator.reset();

// Manuell absenden
configurator.submit();

// Konfigurationsdaten abrufen
configurator.getConfigData();

// Konfigurator zerstören
configurator.destroy();
```

## Payload-Struktur

Der Webhook erhält folgende JSON-Struktur:

```json
{
  "meta": {
    "timestamp": "2026-01-28T14:30:00.000Z",
    "sourceUrl": "https://turmleufer.de/konfigurator",
    "lang": "de",
    "userAgent": "Mozilla/5.0...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "services": [
    {
      "id": "webdesign",
      "name": "Webdesign",
      "size": { "id": "5_pages", "name": "5 Seiten" },
      "addons": [
        { "id": "blog", "name": "Blog" },
        { "id": "multilang", "name": "Mehrsprachigkeit" }
      ],
      "summary": "Webdesign: 5 Seiten + Blog + Mehrsprachigkeit"
    }
  ],
  "humanSummary": "Webdesign (5 Seiten + Blog + Mehrsprachigkeit)",
  "rawConfig": "{...}"
}
```

## Services anpassen

Die Services werden in `src/data/cms-data.js` definiert. Jeder Service hat:

- `slug`: Eindeutige ID
- `name` / `nameEn`: Anzeigenamen
- `icon`: Emoji oder Icon-URL
- `visualType`: 'pages' | 'modules' | 'cards'

Sizes und Addons werden pro Service definiert und können Abhängigkeiten (`requiresAddon`) haben.

## Styling anpassen

Alle Styles nutzen CSS Custom Properties für einfache Anpassung:

```css
:root {
  --tl-color-primary: #2563eb;       /* Hauptfarbe */
  --tl-color-primary-dark: #1d4ed8;  /* Dunklere Variante */
  --tl-glass-blur: 12px;             /* Glass-Effekt Blur */
  --tl-radius-xl: 1rem;              /* Border-Radius */
}
```

## Performance

- **Vanilla JS**: Kein Framework, minimale Bundle-Größe (~15KB gzipped)
- **Event Delegation**: Ein Event-Listener auf Root
- **Template Cloning**: Effizientes DOM-Rendering
- **CSS Containment**: Isolierte Repaints
- **Reduced Motion**: Respektiert `prefers-reduced-motion`

## Browser-Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+
- Mobile Safari / Chrome

## Make.com Setup

1. Neues Szenario erstellen
2. "Webhooks" > "Custom webhook" hinzufügen
3. Webhook-URL kopieren und in Konfiguration eintragen
4. Pipedrive-Modul hinzufügen ("Create a Deal")
5. Felder mappen:
   - Title: `{{humanSummary}}`
   - Notes: `{{rawConfig}}`
6. Error Handler hinzufügen (Email-Benachrichtigung)
7. Szenario aktivieren

## Lizenz

Proprietär - Turm & Leufer
