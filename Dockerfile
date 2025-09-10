
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY scripts ./scripts
ENV PORT=4000
EXPOSE 4000
CMD ["npm","run","start"]
