## Narzędzia wymagane do instalacji projektu

- Docker https://docs.docker.com/desktop/install/windows-install/
- Node.JS https://nodejs.org/en/download/prebuilt-installer
- PNPM https://pnpm.io/installation#on-windows
- Git https://git-scm.com/downloads/win

## Klonowanie repozytorium

Poradnik jak dodać klucze SSH do siebie na Githuba: https://phoenixnap.com/kb/git-clone-ssh

Po dodaniu kluczy mozna sklonować repo po SSH:

```bash
$ git clone git@github.com:Haans001/praca-inzynierska-2024.git
```

## Jak uruchomić projekt

### Frontend

```bash
$ cd web
$ pnpm i
$ pnpm run dev
```

### Backend

```bash
$ cd api
$ pnpm i
$ pnpm run db:up
$ pnpm run start:dev
```

### Obsługa Prismy

Po dokonaniu zmian w pliku `schema.prisma` należy wygenerować migracje

```bash
# w folderze /api
$ npx prisma migrate dev
```

Kiedy chcemy zmigrować baze (np. po zaciągnięciu zmian z głównego brancha)

```bash
# w folderze /api
$ npx prisma migrate deploy
```

Prisma studio - program do przeglądania bazy

```bash
# w folderze /api
$ npx prisma studio
```

#### Domyślni użytkownicy

1. **Dev User**

   - **E-mail**: user.development@kino.com
   - **Hasło**: development

2. **Admin User**
   - **E-mail**: user.admin@kino.com
   - **Hasło**: development

Aby stworzyć tych użytkowników w lokalnej bazie trzeba puścić seed:

```bash
# w folderze /api
$ pnpm run db:seed
```

## Obsługa gita

### Tworzenie branchy

Kiedy zaczynamy prace nad jakimś konkretnym taskiem/featurem najlepiej stworzyć branch z głównego brancha (`staging`).
Aby stworzyć branch upewnij się że jesteś na branchu `staging`, następnie:

```bash
# w folderze głównym projektu
$ git pull --rebase
$ git checkout -b <imie>/<wybrana_nazwa_np._nazwa_featura>
```

### Tworzenie commitów

Kiedy chcemy zacommitować część swoich zmian na branchu, używamy następujących komend:

```bash
# w folderze głównym projektu
$ git add .
$ git commit -m "<nazwa commita>"
```

Kiedy chcemy wrzucić zmiany na remote branch (na Githuba):

```bash
# w folderze głównym projektu
$ git push
```
