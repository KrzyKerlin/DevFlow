# Synapse App (Vue + Node edition)

Menedżer projektów developerskich — projekty, zadania, kalendarz i AI asystent
w czacie, z prawdziwym logowaniem. Frontend Vue 3 + Vite, backend
Node/Express + SQLite.

## Stack technologiczny

- **Frontend**: Vue 3, Vite, Vue Router, Pinia, zwykły CSS
  (bez frameworka UI) — plain JavaScript, bez TypeScriptu, żeby kod był
  możliwie prosty do czytania.
- **Backend**: Node.js + Express, SQLite (`better-sqlite3`), JWT
  (`jsonwebtoken`) + `bcryptjs` do haseł. Jedna baza — plik na dysku, zero
  zewnętrznych usług do skonfigurowania.
- **AI chat**: silnik regułowy (bez zewnętrznego LLM) — odpowiada na pytania
  o projekty/zadania/kolory/statystyki, potrafi tworzyć zadania komendą
  („dodaj zadanie: ...”) i pamięta kontekst rozmowy.

## Uruchomienie lokalnie

Wymagany Node.js 18+ (testowane na 22).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env
npm run dev
# API działa na http://localhost:4000

# 2. Frontend (w drugim terminalu)
cd client
npm install
cp .env.example .env
npm run dev
# Aplikacja działa na http://localhost:5173
```

Otwórz `http://localhost:5173`, załóż konto i korzystaj. Baza danych
(`server/data/devdesk.sqlite`) tworzy się automatycznie przy pierwszym
uruchomieniu backendu.

## Struktura repo

```
synapse/
├── server/    # Node/Express API + SQLite
└── client/    # Vue 3 + Vite frontend
```

## Wdrożenie na hosting i własną domenę

Frontend i backend wdraża się osobno — to dwie niezależne aplikacje.

### 1. Backend (Node + SQLite)

Potrzebujesz hostingu, który utrzymuje długożyjący proces Node **z trwałym
dyskiem** (SQLite to plik — na hostingach z efemernym systemem plików, jak
zwykły Vercel/Netlify, dane znikałyby po restarcie). Dobre opcje:

- **Render** (Web Service, "Persistent Disk" zamontowany w `server/data`)
- **Railway** (wolumen na dane)
- **Fly.io** (wolumen `fly volumes`)
- zwykły VPS (np. z PM2 albo `systemd`, żeby proces wracał po restarcie)

Kroki (ogólnie, niezależnie od hosta):
1. Wypchnij repo na GitHub.
2. Podłącz repo do wybranego hosta, wskaż katalog `server/` jako root.
3. Build command: `npm install`. Start command: `npm start`.
4. Ustaw zmienne środowiskowe: `PORT` (host zwykle narzuca własny),
   `JWT_SECRET` — **wygeneruj nowy, losowy sekret**, nie używaj tego z
   `.env` deweloperskiego.
5. Zamontuj trwały dysk w `server/data`, żeby `devdesk.sqlite` przeżywał
   restarty i deploye.
6. Zanotuj publiczny URL backendu (np. `https://synapse-api.onrender.com`).

### 2. Frontend (Vue/Vite — build statyczny)

Frontend po zbudowaniu (`npm run build`) to zwykłe pliki statyczne — pasuje
do dowolnego hostingu stron statycznych:

- **Vercel** lub **Netlify** (najszybciej: connect repo, root `client/`,
  build command `npm run build`, output `dist`)

Przed buildem ustaw zmienną środowiskową `VITE_API_URL` na publiczny URL
backendu z kroku wyżej (np. `https://synapse-api.onrender.com/api`) —
w panelu hostingu albo w `client/.env.production`.

### 3. CORS

Backend (`server/src/index.js`) używa `cors()` bez ograniczeń — do produkcji
warto zawęzić do konkretnej domeny frontendu:

```js
app.use(cors({ origin: "https://twoja-domena.pl" }));
```

### 4. Podpięcie własnej domeny

1. Kup domenę.
2. Frontend: w panelu Vercel/Netlify dodaj domenę (np. `twoja-domena.pl`) —
   host poda rekord DNS (zwykle `A`/`ALIAS` na root lub `CNAME` na
   subdomenę `www`) do wpisania u rejestratora domeny. SSL (HTTPS) host
   ogarnia automatycznie.
3. Backend: dodaj subdomenę, np. `api.twoja-domena.pl`, jako `CNAME` do URL-a
   z Render/Railway/Fly.io.
4. Zaktualizuj `VITE_API_URL` na `https://api.twoja-domena.pl/api` i
   przebuduj frontend.
5. Zaktualizuj CORS na backendzie do `https://twoja-domena.pl`.

Miłego używania w codziennych zadaniach ;)

