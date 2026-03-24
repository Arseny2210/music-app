# 🚀 Деплой на Timeweb - Пошаговое руководство

## 📋 Что такое Timeweb?

Timeweb - это хостинг в России с поддержкой Docker и управлением через панель управления.

---

## 🔧 ШАГ 1: Подготовка на локальном компьютере

### 1.1 Проверить, что всё готово

```bash
# В папке music-app должны быть:
ls -la
```

**Должно быть:**

- `docker-compose.yml` ✅
- `.env` файл ✅
- папка `backend/` ✅
- папка `frontend/` ✅

### 1.2 Проверить переменные окружения

```bash
cat .env
```

**Должны быть строки:**

```
NEXT_PUBLIC_API_URL=http://backend:8000
SECRET_KEY=ваш_ключ
DB_PASSWORD=ваш_пароль
ENVIRONMENT=production
DEBUG=false
```

---

## 🌐 ШАГ 2: Подготовка на Timeweb

### 2.1 Зарегистрироваться и создать сервер

1. Перейдите на [timeweb.com](https://timeweb.com)
2. Зарегистрируйтесь или войдите
3. Нажмите **"Создать сервер"**
4. Выберите:
   - **ОС**: Ubuntu 22.04 (или новее)
   - **Конфигурация**: Минимум 2GB RAM, 30GB SSD
   - **Тип**: VDS/VPS (не shared hosting!)

### 2.2 Получить доступ к серверу

После создания сервера вы получите:

- **IP адрес** (например, `123.45.67.89`)
- **Пароль** для пользователя `root`

---

## 🔑 ШАГ 3: Подключение к серверу

### 3.1 Подключиться по SSH

```bash
ssh root@123.45.67.89
# Введите пароль из письма Timeweb
```

### 3.2 Установить Docker и Docker Compose

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Проверить установку
docker --version
docker-compose --version
```

### 3.3 Установить Git

```bash
sudo apt install git -y
git --version
```

---

## 📁 ШАГ 4: Загрузка проекта на сервер

### 4.1 Клонировать проект (если он на GitHub)

```bash
cd /home
git clone https://github.com/ваш-аккаунт/music-app.git
cd music-app
```

**ИЛИ** загрузить вручную через SCP:

```bash
# На локальном компьютере
scp -r /Users/arseny/projects/music-app root@123.45.67.89:/home/
```

### 4.2 Проверить файлы на сервере

```bash
ls -la /home/music-app/
```

---

## ⚙️ ШАГ 5: Настройка переменных окружения на сервере

### 5.1 Отредактировать `.env`

```bash
cd /home/music-app
nano .env
```

**Обновите эти строки:**

```bash
# Если у вас есть домен (например, music.example.com)
NEXT_PUBLIC_API_URL=https://music.example.com

# Или если только IP адрес
NEXT_PUBLIC_API_URL=http://123.45.67.89:8000

# Измените на безопасный пароль
DB_PASSWORD=ваш_супер_сложный_пароль_12345

# Если есть домен, укажите его
# Если только IP, используйте IP
DATABASE_URL=postgresql://arseny:ваш_супер_сложный_пароль_12345@db:5432/music_app

# Убедитесь, что эти строки есть
SECRET_KEY=ваш_длинный_ключ
ENVIRONMENT=production
DEBUG=false
```

Нажмите **Ctrl+X**, потом **Y**, потом **Enter** для сохранения.

### 5.2 Обновить CORS в Python файле

```bash
nano backend/app/core/config.py
```

Найдите строку:

```python
ALLOWED_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
```

Замените на:

```python
ALLOWED_ORIGINS: list[str] = [
    "https://music.example.com",  # если есть домен
    "http://123.45.67.89:3000"    # или IP адрес
]
```

Сохраните (Ctrl+X, Y, Enter).

---

## 🚀 ШАГ 6: Запуск приложения

### 6.1 Запустить Docker контейнеры

```bash
cd /home/music-app

# Запустить в фоне
docker-compose up --build -d

# Подождите 30-60 секунд для инициализации БД
```

### 6.2 Проверить статус

```bash
# Посмотреть логи
docker-compose logs -f

# Или проверить статус контейнеров
docker-compose ps

# Должно быть "healthy" или "Up"
```

### 6.3 Проверить работоспособность

```bash
# Проверить API
curl http://localhost:8000/health

# Должно быть:
# {"status":"healthy","environment":"production"}
```

---

## 🌐 ШАГ 7: Настройка домена и SSL (если есть домен)

### 7.1 Указать IP в DNS записях домена

Если у вас есть домен (например, `music.example.com`):

1. Перейдите в панель управления домена
2. Найдите **DNS записи** или **A record**
3. Создайте запись:
   - **Тип**: A
   - **Имя**: music (или www.music)
   - **Значение**: IP адрес сервера (123.45.67.89)
4. Сохраните (может занять 10-30 минут для распространения)

### 7.2 Получить SSL сертификат (Let's Encrypt)

Установите certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 7.3 Или используйте Nginx как reverse proxy

Создайте файл конфигурации:

```bash
sudo nano /etc/nginx/sites-available/music-app
```

Вставьте:

```nginx
server {
    listen 80;
    server_name music.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```

---

## 📊 ШАГ 8: Мониторинг и обслуживание

### 8.1 Проверять логи регулярно

```bash
# Посмотреть логи в реальном времени
docker-compose logs -f backend

# Посмотреть только ошибки
docker-compose logs backend | grep ERROR

# Посмотреть логи последних 100 строк
docker-compose logs --tail=100
```

### 8.2 Перезагрузить приложение

```bash
# Если нужно перезагрузить
docker-compose restart

# Если нужно пересобрать
docker-compose up --build -d
```

### 8.3 Сделать бэкап БД

```bash
# Создать дамп БД
docker-compose exec db pg_dump -U arseny music_app > backup_$(date +%Y%m%d).sql

# Загрузить на локальный компьютер
scp root@123.45.67.89:/home/music-app/backup_*.sql ./backups/
```

---

## 🔧 Команды для отладки

```bash
# Посмотреть IP адреса контейнеров
docker-compose exec backend ifconfig

# Проверить подключение к БД
docker-compose exec backend python -c "from app.core.config import settings; print(settings.DATABASE_URL)"

# Перезагрузить только backend
docker-compose restart backend

# Удалить все контейнеры и пересобрать
docker-compose down
docker-compose up --build -d

# Посмотреть использование памяти
docker stats
```

---

## ❌ Частые проблемы и решения

### Проблема: "Cannot connect to database"

**Решение:**

```bash
# Проверить переменные
docker-compose config | grep DATABASE_URL

# Проверить логи БД
docker-compose logs db
```

### Проблема: "Port 8000 already in use"

**Решение:**

```bash
# Освободить порт
sudo lsof -i :8000
sudo kill -9 PID

# Или в docker-compose.yml измените порт
```

### Проблема: "Frontend не подключается к API"

**Решение:**

1. Проверьте `NEXT_PUBLIC_API_URL` в `.env`
2. Проверьте `ALLOWED_ORIGINS` в `config.py`
3. Перезагрузите frontend: `docker-compose restart frontend`

---

## ✅ Финальный чек-лист

- [ ] Docker установлен и работает
- [ ] Проект загружен на сервер
- [ ] `.env` файл настроен с правильными паролями
- [ ] `config.py` обновлен с правильными origins
- [ ] Контейнеры запущены и healthy
- [ ] API отвечает на `/health`
- [ ] Frontend загружается в браузере
- [ ] Домен (если есть) указывает на сервер
- [ ] SSL сертификат установлен (если используется домен)

---

## 📞 Полезные ссылки

- [Документация Timeweb](https://timeweb.com/help/)
- [Docker документация](https://docs.docker.com/)
- [FastAPI документация](https://fastapi.tiangolo.com/)
- [Next.js документация](https://nextjs.org/docs)

Если что-то не работает - проверьте логи! 🔍
