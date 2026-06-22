# Imagen base de Node
FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

#Copiar dependencias primero (mejor caché)
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto
EXPOSE 3300

# Comando para arrancar la app
CMD ["node", "index.js"]