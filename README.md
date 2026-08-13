# ReelScraper 📚

Ein persönlicher Content-Organizer für Instagram Reels. ReelScraper extrahiert, klassifiziert und speichert interessante Inhalte aus Instagram und macht aus dem eigenen Feed eine durchsuchbare, kategorisierte persönliche Wissensdatenbank.

---

## Inhaltsverzeichnis

- [Überblick](#überblick)
- [Features](#features)
- [Architektur](#architektur)
- [Erste Schritte](#erste-schritte)
- [Verwendung](#verwendung)
- [API-Referenz](#api-referenz)
- [Datenmodell](#datenmodell)
- [Projektstruktur](#projektstruktur)
- [Entwicklung](#entwicklung)
- [Troubleshooting](#troubleshooting)
- [Datenschutz & Sicherheit](#datenschutz--sicherheit)
- [Lizenz](#lizenz)

---

## Überblick

Interessante Orte, Tools und Ideen aus Instagram Reels sind schnell gesehen – und genauso schnell wieder vergessen. ReelScraper löst dieses Problem, indem der Inhalt eines Reels automatisch extrahiert, per KI klassifiziert und thematisch einsortiert wird, damit nichts Merkenswertes verloren geht.

## Projektstatus

Dieses Repository enthält den funktionalen Prototyp von ReelScraper: eine vollständige End-to-End-Umsetzung des Kernkonzepts – Extraktion, KI-basierte Klassifizierung, Speicherung und Abruf – über Backend und Web-Dashboard. Er dient als Machbarkeitsnachweis und Grundlage für die Weiterentwicklung.

Parallel dazu entsteht ein natives **SwiftUI-Frontend** für iOS, das dieselbe API konsumiert und einen mobilen, nativen Zugang zur eigenen Sammlung ermöglicht. Backend und API sind bewusst plattformunabhängig gehalten, um genau diese Mehrfachnutzung durch verschiedene Clients zu unterstützen.

## Features

- **Automatisierte Content-Extraktion** – Zieht Reel-Beschreibungen über die öffentliche oEmbed-API von Instagram
- **KI-gestützte Kategorisierung** – Nutzt Google Gemini, um Inhalte in Typen wie Orte, Websites, Filme/Serien, Tools und allgemeine Informationen einzuordnen
- **Automatische Themenorganisation** – Ordnet neue Einträge bestehenden Themen zu oder erstellt bei Bedarf neue
- **Web-Dashboard** – Übersichtliches, responsives Interface zum Durchstöbern der gesammelten Inhalte
- **Persistente lokale Speicherung** – Alle Daten werden lokal in einer strukturierten JSON-Datenbank gespeichert
- **Zeitstempel** – Jeder gespeicherte Eintrag zeigt, wann er hinzugefügt wurde
- **Schnellzugriffe** – Direkte Links zu Karten bei Orten und zu externen Ressourcen bei Websites/Tools

## Architektur

| Ebene | Technologie |
|---|---|
| Backend | Express.js (ES Modules) |
| KI-Verarbeitung | Google Gemini 2.5 Flash |
| Speicherung | Lokale JSON-Datenbank |
| Frontend | Vanilla JavaScript + modernes CSS |
| API | RESTful HTTP-Endpunkte |

Der Server stellt eine schlanke REST-API zum Einreichen und Abrufen von Reels bereit. Beim Einreichen wird die Reel-Beschreibung abgerufen, an Gemini zur Klassifizierung übergeben und anschließend zusammen mit dem zugewiesenen Thema und extrahierten Metadaten (Adresse, URL etc.) gespeichert. Das Dashboard greift auf denselben Datenbestand zu und stellt eine kategorisierte, aufklappbare Ansicht aller gespeicherten Inhalte dar.

## Erste Schritte

### Voraussetzungen

- Node.js ab Version 18
- Ein Google-Gemini-API-Key

### Installation

```bash
git clone https://github.com/laurenzbiller/reelScraper.git
cd reelScraper
npm install
```

### Konfiguration

Erstelle eine `.env`-Datei im Projektroot:

```bash
GEMINI_API_KEY=dein_gemini_api_key
```

### Start

```bash
npm start
```

Das Dashboard ist danach unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Verwendung

### Reel hinzufügen

Kopiere die URL eines Instagram Reels und sende sie an die API:

```bash
curl -X POST http://localhost:3000/reel \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/reel/..."}'
```

ReelScraper extrahiert daraufhin die Beschreibung, klassifiziert den Inhalt, weist ihn einem Thema zu und speichert ihn automatisch.

### Sammlung durchstöbern

Öffne [http://localhost:3000](http://localhost:3000), um das Dashboard zu sehen. Inhalte sind nach Themen in aufklappbaren Abschnitten gruppiert; jeder Eintrag zeigt Titel, Content-Typ, Speicherdatum und passende Schnellzugriffe.

## API-Referenz

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `POST` | `/reel` | Neues Instagram Reel per URL hinzufügen und klassifizieren |
| `GET` | `/entries` | Alle gespeicherten, organisierten Einträge abrufen |
| `GET` | `/` | Web-Dashboard ausliefern |

## Datenmodell

Einträge werden in `db.json` persistiert:

```json
{
  "topics": ["Travel", "Food", "Tech", "Movies"],
  "entries": [
    {
      "title": "Amazing restaurant in Tokyo",
      "topic": "Food",
      "type": "place",
      "data": "Sushi Restaurant, Shibuya, Tokyo",
      "url": "https://instagram.com/reel/...",
      "timestamp": 1723456789000
    }
  ]
}
```

**Unterstützte Content-Typen:**

| Typ | Beschreibung |
|---|---|
| `place` | Restaurants, Reiseziele, Orte |
| `website` | Tools, Ressourcen, Artikel |
| `movie` | Filmempfehlungen |
| `tvshow` | Serienempfehlungen |
| `information` | Allgemeines Wissen und Ideen |
| `tool` | Apps und Software |
| `other` | Sonstige Inhalte |

## Projektstruktur

```
reelScraper/
├── index.js               # Express-Server & Routen-Definitionen
├── descriptionHandle.js   # Reel-Extraktion, KI-Klassifizierung, DB-Logik
├── package.json           # Dependencies und Scripts
├── db.json                # Lokale JSON-Datenbank (Themen & Einträge)
├── public/
│   └── index.html         # Web-Dashboard
└── .env                   # Environment Variables (nicht im Repo)
```

## Entwicklung

```bash
npm start   # Server starten
npm test    # Tests ausführen (Platzhalter)
```

Der Code ist bewusst modular aufgebaut:

- Neue Content-Typen werden in `descriptionHandle.js` ergänzt
- Das Dashboard lässt sich in `public/index.html` anpassen
- Die API-Oberfläche wird in `index.js` erweitert

## Troubleshooting

| Problem | Mögliche Ursache / Lösung |
|---|---|
| `Failed to extract reel description` | Die Reel-URL ist privat oder falsch formatiert – prüfen, ob sie öffentlich und korrekt ist |
| `AI classification failed` | Ungültiger Gemini-API-Key oder keine Internetverbindung |
| Datenbankfehler | `db.json` ist fehlerhaft formatiert oder es fehlen Dateiberechtigungen |

## Datenschutz & Sicherheit

- Alle Daten werden lokal gespeichert; es findet keine Weitergabe an Dritte statt
- API-Keys liegen ausschließlich in Environment Variables und werden nicht ins Repository committed
- Instagram-Inhalte werden ausschließlich über die öffentliche oEmbed-API abgerufen

## Lizenz

ISC-Lizenz. Freie Nutzung und Anpassung für private Projekte.

---

Entwickelt von [@laurenzbiller](https://github.com/laurenzbiller)
