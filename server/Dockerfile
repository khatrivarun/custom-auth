FROM node:16-alpine

WORKDIR /server

COPY package.json .

RUN npm install

COPY . ./

ENV NODE_ENV=development
ENV DATABASE_HOST=postgres_db
ENV DATABASE_PORT=5432
ENV DATABASE_USER=admin
ENV DATABASE_PASSWORD=password
ENV DATABASE_NAME=auth
ENV PORT=5000

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]