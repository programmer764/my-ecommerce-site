# Базовый образ
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем манифесты и конфиги (не копируем .env.local, его обычно игнорим)
COPY package*.json next.config.js tsconfig.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной исходник приложения
COPY . .

# Если у тебя есть production-окружение в .env.production, переименовываем его в .env
# (если используется .env.local, просто скопируй вместо .env.production)
COPY .env.production .env

# Собираем Next.js-приложение
RUN npm run build

# Открываем порт (опционально, если нужно)
EXPOSE 3000

# Запускаем
CMD ["npm", "run", "start"]
