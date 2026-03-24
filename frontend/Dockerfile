FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 пробрасываем env в build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

CMD ["npm", "start"]