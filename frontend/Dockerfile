FROM node:16

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN npm install 
RUN npm install -g npm
RUN npm install --save react-toastify
RUN npm install axios --save
RUN npm install react-router-dom


COPY . ./

CMD npm start


EXPOSE 3000
