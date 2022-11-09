FROM node:14

WORKDIR /backend/altesia-api/
COPY . /backend/altesia-api/

RUN npm ci

EXPOSE 3001

CMD ["npm", "run", "start:dev"]