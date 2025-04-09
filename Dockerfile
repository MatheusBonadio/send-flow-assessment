FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

RUN npm run build

FROM node:22-alpine AS prod

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 4173

CMD ["serve", "-s", "dist", "-l", "4173"]
