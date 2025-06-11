# Używamy oficjalnego obrazu node z obsługą npm
FROM node:20-alpine

# Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików aplikacji
COPY . .

# Budujemy aplikację (jeśli korzystasz z Typescript)
RUN npm run build

# Domyślna komenda do uruchomienia aplikacji
CMD ["npm", "run", "start:dev"]

# Eksponujemy port (domyślnie NestJS nasłuchuje na 3000)
EXPOSE 3000
