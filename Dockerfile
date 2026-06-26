# Imagen base de Node
# Imagen base de Node
FROM node:20-alpine

# Cache bust: 2026-06-26
WORKDIR /app

COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 8080
CMD ["node", "index.js"]