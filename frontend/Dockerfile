FROM node:18-alpine3.14

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . /frontend

EXPOSE 3000

CMD [ "npm", "run", "dev", "--" , "--host"]