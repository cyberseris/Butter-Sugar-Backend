## 啟動方式

1. 安裝相依套件

```
npm ci
```

2. 設定環境變數

使用 Docker 開發：

```
POSTGRES_USER=testHexschool
POSTGRES_PASSWORD=pgStartkit4test
POSTGRES_DB=test
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=testHexschool
DB_PASSWORD=pgStartkit4test
DB_DATABASE=test
DB_SYNCHRONIZE=true
DB_ENABLE_SSL=false
PORT=8080
LOG_LEVEL=debug
JWT_EXPIRES_DAY=30d
JWT_SECRET=hexschool666
```

使用 localhost 開發伺服器（資料庫仍使用 Docker）：

```
POSTGRES_USER=testHexschool
POSTGRES_PASSWORD=pgStartkit4test
POSTGRES_DB=test
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=testHexschool
DB_PASSWORD=pgStartkit4test
DB_DATABASE=test
DB_SYNCHRONIZE=true
DB_ENABLE_SSL=false
PORT=8080
LOG_LEVEL=debug
JWT_EXPIRES_DAY=30d
JWT_SECRET=hexschool666
```

## 開發指令

- `npm run dev` - 啟動開發伺服器
- `npm run start` - 啟動伺服器與資料庫
- `npm run restart` - 重新啟動伺服器與資料庫
- `npm run stop` - 關閉啟動伺服器與資料庫
- `npm run clean` - 關閉伺服器與資料庫並清除所有資料

## 實際開發
## 前端 Open with Live Server, index.html  
```
<a href='http://localhost:8080/api/v1/users/auth/google'>Login with Google</a>
```
## 後端
- 開啟 docker desktop
- Dockerfile - 修改成 node 環境版本 node:20-alpine3.19
- .env 使用 localhost 開發伺服器, DB_HOST=localhost, 使用雲端主機，DB_HOST=postgres
- `npm run start` - 啟動伺服器與資料庫
- `npm run dev` - 啟動開發伺服器
- 本機運行程式碼， google auth 已授權的重新導向 URI: http://localhost:8080/api/v1/users/auth/google/callback
- 雲端主機 docker 佈署， google auth 已授權的重新導向 URI: http://domain:8080/api/v1/users/auth/google/callback ，不能設定 IP 網址(http://IP:8080/api/v1/users/auth/google/callback)
- port forwarding 出錯時 - (1) net stop winnat, (2) net start winnat

## 雲端佈署

- 打包 - docker build -t ${docker hub 帳號}/bootcamp-fitness .
- 上傳 - docker push ${docker hub 帳號}/bootcamp-fitness
- docker hub - 可看到上傳的 ${docker hub 帳號}/bootcamp-fitness image 檔
- 本機先建立 ssh key - 然後將公開金鑰貼到 Akamai Linode(ssh-keygen -t rsa -b 4096 -C "XXX@gmail.com")
- 建立 Akamai Linode 主機(Account Balance, 可預先儲值、價格不會爆表) - (1) 選擇 ubuntu 24.04, (2) 選擇一個國家伺服器(例如：Osaka, jp)，(3) 選擇 Shared CPU (Nanode 1GB, $5) (4) 新增 SSH key，建立完後，會取得一組 ip
- ssh 進入 Linode 虛擬主機
- 安裝 Docker - 直接複製貼上執行 - https://docs.docker.com/engine/install/ubuntu/
- 虛擬主機將 docker hub image ${docker hub 帳號}/bootcamp-fitness 抓下來 - docker pull ${docker hub 帳號}/bootcamp-fitness
- 虛擬主機 - 建立 .env 檔案

```
  POSTGRES_USER=testHexschool
  POSTGRES_PASSWORD=pgStartkit4test
  POSTGRES_DB=test

  DB_HOST=postgres
  DB_PORT=5432
  DB_USERNAME=testHexschool
  DB_PASSWORD=pgStartkit4test
  DB_DATABASE=test
  DB_SYNCHRONIZE=true
  DB_ENABLE_SSL=false
  PORT=8080
  LOG_LEVEL=debug
  JWT_EXPIRES_DAY=30d
  JWT_SECRET=hexschool666
  GOOGLE_CLIENT_ID=
  GOOGLE_CLIENT_SECRET=
  SESSION_SECRET=
```

- 虛擬主機 - 建立 docker-compose.yml 檔
- 指定要運行的 image - docker-compose.yml 需新增 image: seriskey/bootcamp-fitness
- 修改 docker-compose.yml - healthcheck: test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_DATABASE} -h localhost"] interval: 10s timeout: 3s retries: 5 start_period: 30s
- docker-compose.yml 需新增 volumes: .env:/app/.env - 新增 volumes 後，
Docker 一啟動 container 自動把主機上 /root/.env 掛到 container 的 /app/.env，dotenv.config() 可以正常讀到 /app/.env
```
  version: "3.8"
  volumes:
  pgData:
  services:
  postgres:
  image: postgres:16.4-alpine3.20
  environment: - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_PASSWORD=${DB_PASSWORD} - POSTGRES_DB=${DB_DATABASE}
    volumes:
      - pgData:/var/lib/postgresql/data
    ports:
      - 5432:5432
    deploy:
      replicas: 1
    networks:
      - bootcamp_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME} -d ${DB_DATABASE} -h localhost"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s
  bootcamp-fitness:
    image: ${docker hub 帳號}/bootcamp-fitness
    build:
      dockerfile: Dockerfile
    env_file:
      - .env
    ports:
      - "${PORT}:${PORT}"
    networks:
      - bootcamp_network
    volumes:
      - .env:/app/.env
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: 3
        compress: "true"
    healthcheck:
      test: wget --no-verbose --tries=1 --spider http://localhost:${PORT}/healthcheck || exit 1
  interval: 30s
  retries: 3
  start_period: 20s
  timeout: 30s
  deploy:
  replicas: 1
  networks:
  bootcamp_network:
```

- 啟動指令 - 自動建立環境並運行環境 - docker compose --env-file .env up -d
- POSTMAN API 測試 

## 除錯指令參考
```
docker container prune -f
docker system prune -f
docker image rmi seriskey/butter-sugar
docker volume ls
docker volume rm root_pgData
net stop winnat
net start winnat
docker pull seriskey/butter-sugar
docker compose --env-file .env up -d
docker compose --env-file .env down
```
## 參考資訊

- Docker 第一週 - https://hackmd.io/@hexschool/SJvuaqizA
- Docker 第二週 - https://hackmd.io/@hexschool/Skit-YEXA
- Docker 第三週 - https://hackmd.io/@hexschool/Hk4CTulEA
