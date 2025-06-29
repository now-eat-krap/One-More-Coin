# 📦 1단계: Vue 앱 빌드
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 🌐 2단계: Nginx를 이용한 서빙
FROM nginx:alpine

# Nginx 설정 템플릿 복사
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template

# 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html