FROM node:5.7
COPY ./ /home/pubuim
WORKDIR /home/pubuim
RUN echo "Asia/Shanghai" > /etc/timezone
RUN dpkg-reconfigure -f noninteractive tzdata
RUN npm install
CMD ["node", "bin/www"]
