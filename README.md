# SafeCampus

[Español](#español) · [English](#english)

---

## Español

App de seguridad para el campus: botón SOS, reporte de incidentes, mapa de
puntos seguros, contactos de emergencia, pases de acceso con QR y
notificaciones para toda la comunidad.

### Estructura

| Carpeta | Contenido |
| --- | --- |
| `backend/` | API en Node.js + Express + TypeScript + Prisma (SQLite), con Socket.IO para alertas en tiempo real. Ver [backend/README.md](backend/README.md). |
| `frontend/` | App en React Native (Expo SDK 51) + TypeScript. Incluye el proyecto nativo de iOS en `frontend/ios`. Ver [frontend/README.md](frontend/README.md). |
| `docs/` | Casos de uso y notas de arquitectura. |

### Requisitos

| Herramienta | Versión | Para qué |
| --- | --- | --- |
| macOS | — | Necesario para compilar la app de iOS |
| Node.js | 20 LTS o superior (probado con 26.10) | Backend y app |
| npm | 10 o superior (probado con 11.19) | Dependencias |
| Xcode | Probado con 27.2, con el simulador de iOS instalado | Compilar y ejecutar la app |
| CocoaPods | 1.15 o superior (probado con 1.17) | Dependencias nativas de iOS |
| Git | — | Clonar el repositorio |
| Proyecto de Firebase | Opcional | Copia de los datos en Firestore |

La app pide iOS 15.1 o superior.

### Ejecutar en local

#### 1. Clonar el repositorio

```bash
git clone https://github.com/mmurillob2021/safecampus.git
cd safecampus
```

#### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita `backend/.env` y pon un valor largo y aleatorio en `JWT_SECRET`. Luego:

```bash
npx prisma migrate dev   # crea prisma/dev.db, aplica las migraciones y carga los datos de prueba
npm run dev              # API en http://localhost:4000/api
```

Deja esta terminal abierta.

#### 3. App (en otra terminal)

```bash
cd frontend
npm install
cd ios && pod install && cd ..
npx expo start           # Metro, el empaquetador de JavaScript, en el puerto 8081
```

Deja Metro corriendo y elige una de estas formas de abrir la app:

- **Desde Xcode:** abre `frontend/ios/SafeCampus.xcworkspace` (el `.xcworkspace`, no el `.xcodeproj`), elige un simulador de iPhone arriba y presiona **▶ Run** (⌘R).
- **Desde la terminal:** `npm run ios` compila la app y la abre en el simulador.

#### 4. Iniciar sesión

Los datos de prueba crean un usuario por rol. Todos usan la contraseña `Test1234!`:

| Rol | Correo |
| --- | --- |
| Estudiante | `student@safecampus.dev` |
| Seguridad | `security@safecampus.dev` |
| Administrador | `admin@safecampus.dev` |

**En un iPhone físico:** el teléfono no puede usar `localhost` para llegar a tu computador. En `frontend/app.json`, cambia `expo.extra.apiUrl` y `expo.extra.socketUrl` por la IP de tu computador en la red local (por ejemplo `http://192.168.1.20:4000/api`). El teléfono y el computador tienen que estar en la misma red Wi‑Fi.

### Firebase (opcional)

SQLite es la base de datos principal. Firestore guarda una copia.

1. En la [consola de Firebase](https://console.firebase.google.com/), abre el proyecto → **Configuración del proyecto** → **Cuentas de servicio** → **Generar nueva clave privada**.
2. Guarda el archivo como `backend/firebase-service-account.json`. Git ya lo ignora, así que no se sube al repositorio.
3. En `backend/.env`, agrega:
   ```env
   FIREBASE_SERVICE_ACCOUNT="./firebase-service-account.json"
   ```
4. Reinicia el backend.

Con esto:

- **Los incidentes se copian solos.** Cada vez que alguien crea un incidente o cambia su estado, el backend lo escribe en la colección `Incident`. Si Firestore falla, el error queda en el log y el reporte se guarda igual en SQLite.
- **Copia completa a mano:** `npm run firestore:sync` (dentro de `backend/`) copia todas las tablas a Firestore. Se puede correr varias veces sin crear duplicados. Las contraseñas no se copian.

### Despliegue

#### Backend

Necesitas un servidor con Node.js 20 o superior y un **disco persistente**, porque la base de datos es un archivo SQLite.

```bash
git clone https://github.com/mmurillob2021/safecampus.git
cd safecampus/backend
npm ci                    # instala también prisma y tsx, que se usan en los pasos siguientes
cp .env.example .env      # y edítalo (ver abajo)
npx prisma migrate deploy # aplica las migraciones sin borrar datos
npm run prisma:seed       # solo la primera vez: tablas de parámetros y usuarios de prueba
npm run build             # compila TypeScript a dist/
npm start                 # node dist/server.js
```

Variables de `.env` en producción:

| Variable | Valor |
| --- | --- |
| `JWT_SECRET` | Obligatoria. Un valor largo, aleatorio y distinto al de desarrollo. |
| `PORT` | Puerto del API (por defecto `4000`). |
| `DATABASE_URL` | Ruta del archivo SQLite, por ejemplo `file:./prod.db`. Es relativa a `backend/prisma/`. |
| `CORS_ORIGIN` | Los orígenes permitidos, en lugar de `*`. |
| `FIREBASE_SERVICE_ACCOUNT` | Opcional. Activa la copia a Firestore. |

Recomendaciones:

- Mantén el proceso vivo con un gestor de procesos, como `pm2` o un servicio de `systemd`.
- Pon el API detrás de un proxy con **HTTPS**, como Nginx o Caddy. La app de iOS bloquea conexiones `http://` que no sean de la red local.
- Corre **una sola instancia**, porque SQLite no se comparte entre servidores. Haz copias de seguridad del archivo `.db`.
- Después de actualizar el código: `git pull && npm ci && npx prisma migrate deploy && npm run build`, y reinicia el proceso.

#### App de iOS

1. En `frontend/app.json`, cambia `expo.extra.apiUrl` y `expo.extra.socketUrl` por la URL **HTTPS** del backend publicado.
2. Corre `cd frontend && npm install && cd ios && pod install`.
3. Abre `frontend/ios/SafeCampus.xcworkspace` en Xcode.
4. En el target **SafeCampus** → **Signing & Capabilities**, elige tu equipo de Apple Developer. Si hace falta, cambia el Bundle Identifier (`com.safecampus.app`).
5. Arriba, elige **Any iOS Device (arm64)** como destino.
6. Ve a **Product → Archive** y, cuando termine, a **Distribute App** para subirla a TestFlight o al App Store.

La versión Release incluye el JavaScript dentro de la app, así que en producción no se necesita Metro.

### Problemas comunes

| Problema | Solución |
| --- | --- |
| La app muestra *No script URL provided* o una pantalla roja al abrir | Metro no está corriendo. Ejecuta `npx expo start` en `frontend/`. |
| La app no inicia sesión o no carga datos | El backend no está corriendo, o `apiUrl` en `app.json` apunta a una dirección equivocada. |
| Xcode no encuentra los módulos de React Native | Abriste el `.xcodeproj`. Abre el `.xcworkspace` y corre `pod install` en `frontend/ios`. |
| `EADDRINUSE` al iniciar el backend | El puerto 4000 está ocupado. Cierra el otro proceso o cambia `PORT` en `.env`. |
| *Missing required env var: JWT_SECRET* | Falta `backend/.env`. Cópialo desde `.env.example`. |

### Limitación conocida

Las fotos de evidencia de los incidentes todavía no se suben a ningún servidor. Solo se guarda la ruta del archivo dentro del teléfono que hizo el reporte, así que otros usuarios no pueden ver la imagen.

---

## English

A campus-safety app: SOS button, incident reporting, safety-point map,
emergency contacts, QR access passes and campus-wide notifications.

### Layout

| Folder | Contents |
| --- | --- |
| `backend/` | Node.js + Express + TypeScript + Prisma (SQLite) API, with Socket.IO for real-time alerts. See [backend/README.md](backend/README.md). |
| `frontend/` | React Native (Expo SDK 51) + TypeScript app. Includes the native iOS project in `frontend/ios`. See [frontend/README.md](frontend/README.md). |
| `docs/` | Use cases and architecture notes. |

### Requirements

| Tool | Version | Used for |
| --- | --- | --- |
| macOS | — | Required to build the iOS app |
| Node.js | 20 LTS or newer (tested with 26.10) | Backend and app |
| npm | 10 or newer (tested with 11.19) | Dependencies |
| Xcode | Tested with 27.2, with the iOS Simulator installed | Building and running the app |
| CocoaPods | 1.15 or newer (tested with 1.17) | Native iOS dependencies |
| Git | — | Cloning the repository |
| Firebase project | Optional | Copy of the data in Firestore |

The app requires iOS 15.1 or newer.

### Run locally

#### 1. Clone the repository

```bash
git clone https://github.com/mmurillob2021/safecampus.git
cd safecampus
```

#### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and set `JWT_SECRET` to a long random value. Then:

```bash
npx prisma migrate dev   # creates prisma/dev.db, applies migrations and loads the demo data
npm run dev              # API on http://localhost:4000/api
```

Leave this terminal open.

#### 3. App (in a second terminal)

```bash
cd frontend
npm install
cd ios && pod install && cd ..
npx expo start           # Metro, the JavaScript bundler, on port 8081
```

Keep Metro running and open the app one of these ways:

- **From Xcode:** open `frontend/ios/SafeCampus.xcworkspace` (the `.xcworkspace`, not the `.xcodeproj`), pick an iPhone simulator at the top and press **▶ Run** (⌘R).
- **From the terminal:** `npm run ios` builds the app and opens it in the simulator.

#### 4. Sign in

The demo data creates one user per role. All of them use the password `Test1234!`:

| Role | Email |
| --- | --- |
| Student | `student@safecampus.dev` |
| Security | `security@safecampus.dev` |
| Admin | `admin@safecampus.dev` |

**On a physical iPhone:** the phone can't use `localhost` to reach your computer. In `frontend/app.json`, set `expo.extra.apiUrl` and `expo.extra.socketUrl` to your computer's IP address on the local network (for example `http://192.168.1.20:4000/api`). The phone and the computer must be on the same Wi‑Fi network.

### Firebase (optional)

SQLite is the main database. Firestore holds a copy.

1. In the [Firebase console](https://console.firebase.google.com/), open the project → **Project settings** → **Service accounts** → **Generate new private key**.
2. Save the file as `backend/firebase-service-account.json`. Git already ignores it, so it is never committed.
3. Add this to `backend/.env`:
   ```env
   FIREBASE_SERVICE_ACCOUNT="./firebase-service-account.json"
   ```
4. Restart the backend.

With that in place:

- **Incidents are copied automatically.** Every time an incident is created or its status changes, the backend writes it to the `Incident` collection. If Firestore fails, the error is logged and the report is still saved in SQLite.
- **Full manual copy:** `npm run firestore:sync` (inside `backend/`) copies every table to Firestore. It can be run repeatedly without creating duplicates. Passwords are never copied.

### Deployment

#### Backend

You need a server with Node.js 20 or newer and a **persistent disk**, because the database is a SQLite file.

```bash
git clone https://github.com/mmurillob2021/safecampus.git
cd safecampus/backend
npm ci                    # also installs prisma and tsx, which the next steps use
cp .env.example .env      # then edit it (see below)
npx prisma migrate deploy # applies migrations without deleting data
npm run prisma:seed       # first time only: parameter tables and demo users
npm run build             # compiles TypeScript to dist/
npm start                 # node dist/server.js
```

Production `.env` variables:

| Variable | Value |
| --- | --- |
| `JWT_SECRET` | Required. A long random value, different from the development one. |
| `PORT` | API port (defaults to `4000`). |
| `DATABASE_URL` | SQLite file path, for example `file:./prod.db`. It is relative to `backend/prisma/`. |
| `CORS_ORIGIN` | The allowed origins, instead of `*`. |
| `FIREBASE_SERVICE_ACCOUNT` | Optional. Turns on the Firestore copy. |

Recommendations:

- Keep the process alive with a process manager, such as `pm2` or a `systemd` service.
- Put the API behind an **HTTPS** proxy, such as Nginx or Caddy. The iOS app blocks `http://` connections outside the local network.
- Run **a single instance**, because SQLite can't be shared between servers. Back up the `.db` file.
- After updating the code: `git pull && npm ci && npx prisma migrate deploy && npm run build`, then restart the process.

#### iOS app

1. In `frontend/app.json`, set `expo.extra.apiUrl` and `expo.extra.socketUrl` to the deployed backend's **HTTPS** URL.
2. Run `cd frontend && npm install && cd ios && pod install`.
3. Open `frontend/ios/SafeCampus.xcworkspace` in Xcode.
4. In the **SafeCampus** target → **Signing & Capabilities**, pick your Apple Developer team. Change the Bundle Identifier (`com.safecampus.app`) if needed.
5. At the top, pick **Any iOS Device (arm64)** as the destination.
6. Go to **Product → Archive** and, when it finishes, **Distribute App** to upload it to TestFlight or the App Store.

The Release build bundles the JavaScript inside the app, so Metro is not needed in production.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| The app shows *No script URL provided* or a red screen on launch | Metro isn't running. Run `npx expo start` in `frontend/`. |
| The app can't sign in or load data | The backend isn't running, or `apiUrl` in `app.json` points to the wrong address. |
| Xcode can't find the React Native modules | You opened the `.xcodeproj`. Open the `.xcworkspace` and run `pod install` in `frontend/ios`. |
| `EADDRINUSE` when starting the backend | Port 4000 is taken. Stop the other process or change `PORT` in `.env`. |
| *Missing required env var: JWT_SECRET* | `backend/.env` is missing. Copy it from `.env.example`. |

### Known limitation

Incident evidence photos are not uploaded to any server yet. Only the file path on the reporting phone is stored, so other users can't see the image.
