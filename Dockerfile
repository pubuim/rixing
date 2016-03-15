FROM node:5.7
COPY ./ /home/pubuim
WORKDIR /home/pubuim
RUN npm install
CMD ["node", "bin/www"]
