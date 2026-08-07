FROM node:22-alpine

WORKDIR /app

# copy backend package manifest and install (build context is repository root)
COPY backend/package*.json ./

RUN npm install

# copy backend source into image
COPY backend/ ./

# copy frontend static files into the image so backend can serve them
COPY frontend/ ./frontend

EXPOSE 3000

CMD ["node", "app.js"]