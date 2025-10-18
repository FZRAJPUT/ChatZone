FROM node:latest

COPY . /home/app/

WORKDIR /home/app/

RUN npm install

EXPOSE 2001

CMD ["node", "server"]