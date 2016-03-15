FROM node:5.7
COPY ./ /home/pubuim
WORKDIR /home/pubuim
npm install
CMD ["node", "bin/www"]
