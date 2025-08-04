# Node imajı (Vite için gerekli)
FROM node:20

# Çalışma dizini
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Gerekli bağımlılıkları yükle
RUN npm install

# Projenin tüm dosyalarını kopyala
COPY . .

# Vite 3000 portunda çalışsın (istersen 5173 yaz)
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "run", "dev"]

