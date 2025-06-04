# WFA Tutoring Plattform

Dies ist eine Webplattform zur Verwaltung von Nachhilfeangeboten, entwickelt mit Angular (Client) und Laravel (Server).
Sie wurde im Rahmen des Wahlpflichtmoduls WFA6 (Web Frameworks und Architekturen) im 6. Semester des KWM 
(Kommunikation, Wissen, Medien) Bachelorstudiengangs erstellt.

## Projektstruktur

```
tutoring_kasbauer/
├── client/  (Angular Frontend)
└── server/  (Laravel Backend)
```

## Technologien

| Bereich  | Technologie            |
| -------- | ---------------------- |
| Frontend | Angular                |
| Backend  | Laravel                |
| Server   | Hetzner (SFTP/SSH, Port 222) |
| IDE      | PhpStorm               |

## Voraussetzungen

* Node.js
* Angular CLI (`npm install -g @angular/cli@19.1.4`)
* Laravel CLI
* Git

## Installation

### Lokales Klonen der Repositories

```bash
git clone https://github.com/annamkb/wfa-tutoring-angular.git client
git clone https://github.com/annamkb/wfa-tutoring.git server
```

### Client (Angular)

```bash
cd client
npm install
ng serve
```

Der Angular-Client ist normalerweise erreichbar unter: `http://localhost:4200`

### Server (Laravel)

Der Server läuft remote am Hetzner Server. Zugriff erfolgt über SSH/SFTP. Das Projekt basiert auf dem Laravel-Paket, das via `wget` auf den Server geladen wird:

```bash
wget https://putz.kwmhgb.at/laravel_11_start.tar.gz
```

Das Backend wird aufgerufen unter:
`http://tutoring25.s2210456015.student.kwmhgb.at/api/`

## Deployment
http://tutoringclient25.s2210456015.student.kwmhgb.at/

## Tests

Für die API-Tests wurde eine [Postman Collection](https://postman.co/workspace/My-Workspace~70f72830-1b0f-4d5c-8194-46d9245487cb/collection/43562619-f40c4776-97d3-41bd-a928-8362baed0d57?action=share&creator=43562619) erstellt.

## Authentifizierung und Autorisierung

Die Authentifizierung erfolgt über JWT (JSON Web Tokens).
Das Paket `php-open-source-saver/jwt-auth` wird verwendet.

## Mitwirkende

* Anna Kasbauer ([GitHub: annamkb](https://github.com/annamkb))

Da das ein Studienprojekt ist und zum Lernen von Angular und Laravel gedacht ist, wird keine 
Verantwortung für Richtigkeit und Vollständigkeit gewährleistet.