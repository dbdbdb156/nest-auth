## Description
1. nestJS 11.0.5
2. nodeJS v20
3. mongoDB 6.0
 - localhost(127.0.0.1: 27017)
4. Jwt : Public/Private Key Cryptography & JWE

## Project setup
1. npm install
2. npm run start

## nvm use for multi version
1. npm install nvm // 다중 node 버전 관리 가능 
2. nvm intstall v20 // node 
3. nvm use v20
4. npm run start:dev

## MongoDB docker 구동
1. cd nest-auth // git clone 한 root 디렉토리 위치
2. docker compose --env-file .env -f docker/docker-compose.yml up -d // mongoDB docker 로 구동

## RSA Key Pair Generation using OpenSSL
1. cd nest-auth // git clone 한 root 디렉토리 위치
2. openssl genrsa -out keys/private.pem 2048
3. openssl rsa -in keys/private.pem -pubout -out keys/public.pem

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Debug
1. .vscode/launch.json 파일 세팅
2. vscode 내 F5 클릭
 2-1. F10 라인별
 2-2. F5 breakpoint 기준

```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```


