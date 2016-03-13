FROM node:5.7
COPY ./ /home/pubuim
WORKDIR /home/pubuim
RUN apt-get update
RUN apt-get install -y cron
RUN echo '* * * * * root /home/pubuim/bin/check' >> /etc/cron.d/rixing-check
RUN service cron start
RUN crontab /etc/cron.d/rixing-check
CMD ["node", "bin/www"]

