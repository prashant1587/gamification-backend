FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
RUN npm run build
ENV PORT=4000
EXPOSE 4000
CMD ["npm","run","start"]
