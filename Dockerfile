# Usa una imagen base de Node
FROM node:20.11.1

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo .env
COPY .env ./

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Compila la aplicación
RUN npm run build

# Expone el puerto que usa tu aplicación (ajusta si es necesario)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]