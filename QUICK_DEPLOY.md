# ⚡ ДЕПЛОЙ НА TIMEWEB CLOUD - САМЫЙ ДЕШЕВЫЙ И ПРОСТОЙ СПОСОБ

## 🌐 Что это Timeweb Cloud?

Это облачная платформа где:

- ✅ Всё управляется через веб-интерфейс (никаких команд в терминале!)
- ✅ Автоматический деплой из Git
- ✅ Встроена Docker поддержка
- ✅ Очень дешево: от 99 руб/месяц

**Ссылка**: https://timeweb.cloud/

---

## 🚀 ПОШАГОВО ЗА 10 МИНУТ

### ШАГ 1️⃣: Зарегистрироваться на Timeweb Cloud

1. Перейди на https://timeweb.cloud/
2. Нажми **"Вход/Регистрация"**
3. Создай аккаунт (почта + пароль)
4. Подтверди почту
5. Войди в панель управления

---

### ШАГ 2️⃣: Загрузить проект на GitHub

**ВАЖНО!** Timeweb Cloud требует Git репозиторий.

На локальном компьютере (Mac), открой **Терминал**:

```bash
cd /Users/arseny/projects/music-app

# Если Git ещё не инициализирован:
git init

# Добавь все файлы
git add .

# Commit
git commit -m "Music app for deployment"
```

**Теперь на GitHub.com:**

1. Перейди на https://github.com/new
2. Создай новый репозиторий (назови `music-app`)
3. **НЕ инициализируй с README**
4. Скопируй ссылку (что-то вроде `https://github.com/твой_ник/music-app.git`)

**Вернись в Терминал и вставь:**

```bash
git remote add origin https://github.com/ТВ_НИК/music-app.git
git branch -M main
git push -u origin main
```

Введи свои GitHub логин и пароль (или токен).

**Готово!** Проект на GitHub ✅

---

### ШАГ 3️⃣: Создать контейнер на Timeweb Cloud

В панели Timeweb Cloud (https://timeweb.cloud/):

1. Нажми **"Облако"** → **"Контейнер Docker"**
2. Нажми **"Создать контейнер"**

3. **Настройка контейнера:**
   - **Имя**: `music-app`
   - **Память**: 512 MB (дешевле)
   - **CPU**: 1 ядро
   - **Диск**: 20 GB

4. **Git репозиторий:**
   - Вставь ссылку: `https://github.com/ТВ_НИК/music-app.git`
   - **Branch**: `main`
   - **Docker path**: `./docker-compose.yml` или оставить пусто

5. **Докуккер:**
   - Выбери **"Docker Compose"** если есть опция
   - Или выбери **"Собрать из Dockerfile"**

6. Нажми **"Создать"**

---

### ШАГ 4️⃣: Настроить переменные окружения

**В панели контейнера:**

1. Найди **"Переменные окружения"** или **"Env"**
2. Добавь эти переменные:

```
NEXT_PUBLIC_API_URL=http://ВАШ_ПУБЛИЧНЫЙ_IP:8000
DB_USER=arseny
DB_PASSWORD=супер_сложный_пароль_123
DB_NAME=music_app
DATABASE_URL=postgresql://arseny:супер_сложный_пароль_123@db:5432/music_app
SECRET_KEY=ваш_длинный_ключ
ENVIRONMENT=production
DEBUG=false
```

3. Сохрани

---

### ШАГ 5️⃣: Запустить деплой

**В панели контейнера:**

1. Нажми **"Пересобрать"** или **"Запустить"**
2. **Жди 2-3 минуты** пока Docker собирается
3. Посмотри **"Логи"** - там должно быть все ОК

---

### ШАГ 6️⃣: Открыть приложение

Timeweb Cloud выдаст тебе **публичный URL** (напоминает `app-abc123.timeweb.cloud`)

Открой в браузере - **приложение работает!** 🎉

---

## ⚠️ ЕСЛИ TIMEWEB НЕ ПОДДЕРЖИВАЕТ DOCKER-COMPOSE

Если облако требует отдельные Dockerfile для каждого сервиса, создай:

### Отдельно Backend:

Создай `Dockerfile.backend`:

```dockerfile
FROM python:3.12

WORKDIR /app

COPY backend/pyproject.toml .
RUN pip install -e .

COPY backend/ /app/app/
COPY .env .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Отдельно Frontend:

Создай `Dockerfile.frontend`:

```dockerfile
FROM node:20

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .

ENV NEXT_PUBLIC_API_URL=http://backend:8000

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Загрузи эти файлы на GitHub и создай для каждого свой контейнер.

---

## 🔧 Что если что-то не работает

### Посмотреть ошибки:

В панели контейнера → **"Логи"**

Ищи красные ошибки!

### Пересобрать:

**"Пересобрать и запустить"** (обновит из Git и перезапустит)

### Изменить переменные:

1. Отредактируй в **"Переменные окружения"**
2. Нажми **"Сохранить"**
3. Нажми **"Пересобрать"**

### Очистить:

Удали контейнер и создай новый

---

## 💡 СОВЕТЫ

1. **Если Git репозиторий не подходит** - используй обычный VPS (см. `TIMEWEB_DEPLOY.md`)
2. **Если нужен SSL** - используй Nginx как реверс прокси
3. **Для домена** - настрой DNS A record на IP Timeweb контейнера

---

## 📞 Полезные ссылки

- [Timeweb Cloud панель](https://timeweb.cloud/)
- [Как загрузить на GitHub](https://docs.github.com/en/get-started/quickstart/hello-world)

---

## ✅ ИТОГО

**Самый быстрый способ:**

1. ✅ Создай аккаунт на Timeweb Cloud
2. ✅ Загрузи проект на GitHub
3. ✅ На Timeweb Cloud создай контейнер Docker
4. ✅ Вставь ссылку на Git репозиторий
5. ✅ Добавь переменные окружения
6. ✅ Нажми "Запустить"
7. ✅ **ГОТОВО!** Приложение работает ☁️

Всё остальное делает облако автоматически!
