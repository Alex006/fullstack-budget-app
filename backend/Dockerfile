## BUILD
# docker build -t mybackend:0.1.0 .
## RUN
# docker run -e ORACLE_USER=appuser -e ORACLE_PASS=<your_pass> -e ORACLE_CONNSTR=<db_host>:1521/xepdb1 -d -p 3800:3800 mybackend:0.1.0

FROM oraclelinux:8.7

LABEL developer="cristian.padilla06@gmail.com"

ENV ORACLE_USER=appuser \
    ORACLE_PASS=mipass \
    ORACLE_CONNSTR=localhost:1521/xepdb1 \
    SERVER_PORT=3800

# https://yum.oracle.com/oracle-instant-client.html
RUN dnf install oracle-instantclient-release-el8 -y
RUN dnf install oracle-instantclient-basic -y

# https://yum.oracle.com/oracle-linux-nodejs.html#InstallingNodeOnOL8
RUN dnf module enable nodejs:16 -y
RUN dnf module install nodejs -y

# Copiando mi applicacion
COPY . /opt/app

WORKDIR /opt/app

RUN npm install

CMD ["npm", "start"]
