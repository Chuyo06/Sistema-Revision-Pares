# Usamos una imagen ligera de Node.js
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Exponemos el puerto por defecto de NestJS
EXPOSE 3000

# Comando para iniciar el microservicio en modo desarrollo
CMD ["npm", "run", "start:dev"]