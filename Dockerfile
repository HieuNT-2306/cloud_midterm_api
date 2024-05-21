# Sử dụng image node:20-alpine làm base
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt các dependencies và loại bỏ các file không cần thiết
RUN npm install && npm cache clean --force

COPY . .

CMD ["npm", "run", "start"]
