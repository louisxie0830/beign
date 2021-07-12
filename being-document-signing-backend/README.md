# being-document-signing-backend api

### local test

docker-compose  up  --build

### swagger ui

http://localhost:8080/documentation

## Project setup

```
yarn install
```

### Run develop mode

```
yarn run server
```

### Run unit tests

```
yarn run test
```

### Run integration tests

```
yarn run test-hapi
```

### Run production

```
pm2-runtime start ecosystem.config.js --web 9090
```

### rest service endpoint

```
http://localhost:8080
```

### moniter endpoint

```
http://localhost:9090
```
### Prometheus endpoint
```
http://localhost:8080/metrics
```

### envs

- NODE_ENV=test
- CONFIG_USER_CREATE_LIMIT_DURATION_DAYS=10000
- CONFIG_USER_CREATE_LIMIT=100000
- BIND_HOST=0.0.0.0
- BIND_PORT=8080
- MYSQL_HOST=13.115.164.143
- MYSQL_DB=ding_cloud_push
- MYSQL_USER=ding
- MYSQL_PASSWORD=nbrdsfWJVz8MuRc8
- REDIS_HOST=redis
- REDIS_PORT=6379
- REDIS_PASSWORD=
- AWS_ACCESS_KEY_ID=
- AWS_SECRET_ACCESS_KEY=
- AWS_S3_BUCKET=
- ALI_OSS_REGION=oss-cn-beijing
- ALI_OSS_BUCKET=bing-docsign
- ALI_OSS_KEYID=LTAIjVMYxBlh1fEW
- ALI_OSS_KEYSECRET=5rSZ9rd8Rp8LaTHQsoCqEpd2NeOxz6
- WEB_BASE_URL=https://frontend-signing-test.beingtech.org
- CN_WEB_BASE_URL=https://cn-frontend-signing-test.beingtech.org
- API_BASE_URL=https://backend-signing-test.beingtech.org
- BAPLAY_PAY_API=http://210.59.245.9:8202/happypay_sendStone.shtml
- ETH_ENDPOINT=http://13.115.164.143:8545
- ETH_PRIVATE_KEY=0xB13C15BEE2784CE50869E4D6CF1286D192D413D86DF5905BD8D437AAFBF41938
- ETH_CONTRACT_ADDRESS=0xaa564c68cdca2a9a091edaac29fef2d326a87636
- SMTP_HOST=maildev
- SMTP_PORT=25
- SMTP_IGNORE_TLS=true
- SMTP_SECURE=false
- SMTP_SEND_FROM=no-reply@beingtech.org
- SMTP_USER=email
- SMTP_PASS=email
- CORP_ID=dingefd8dead7a42ab3735c2f4657eb6378f
- SUITE_KEY=suitemgerhdgnplefkaqg
- SUITE_SECRET=z3kP-bBFjaXugcbrGd7ZrpcCvxxLFIBADwbYsBgDesUpt5oP13jVxsIJe4O_0B3u
- SUITE_ID=4530002
- APP_ID=11521
- DING_HOST=https://oapi.dingtalk.com
- HAPPY_PAY_PAYEE_ID=1506440e-bb1c-11e7-beda-0242ac11000b
- HAPPY_PAY_APP_KEY_ID=beingtech
- HAPPY_PAY_SERVER_SECRET_KEY=beingtestfordocumentsigning
- HAPPY_PAY_TOKEN_ENDPOINT=https://api-test.happy-pay.com/open/v1/tokens
- HAPPY_PAY_PAYMENT_URL=https://webview-sdk.happy-pay.com/test/createPayment.html
- HAPPY_PAY_PAYEE_ORDER_ENDPOINT=https://api-test.happy-pay.com/open/v1/payee/%s/sales/%s
- ALIPAY_GATEWAY=https://openapi.alipaydev.com/gateway.do
- ALIPAY_APP_ID=2016092300574741
- ALIPAY_ALI_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwl8qxfv7XHKko2y2sMWsebHUcZ9MZQpx/IxVpJlTw7MLONt1+ApoVzSYfl6+nJiPbaib1J7yF4dCMVxOJd/OEVmS387U+tn8kI13hIqZrzu1jnFrbhQNu+HcJkHbWEAODHMN33AU1YIyfvUQqm3xPzRG1NsUHZiIQM0+QUQ0y13+MtLxXuJlgtqy4DaK4LUZTlui33YfjHmMaUJqmRSACRKhNQHhm5F022goslgu6tCsqio8ASmill9ohjlU81IVTnT+orvb9Os4pVCF9o8/to6NC1hz0pugsS/fDb7pFsHO481cDpeuZvUDVThzOgcy9TuGH3ah4QKCf16LvtfAjwIDAQAB
ALIPAY_PRIVATE_KEY=MIIEowIBAAKCAQEAtYBH60m7f+u2w+Ww6RuKhMXvXPoxqt6ei94dls0nV98UK4kH2yQMKKWn4sHOhwBenOt9zeqhK68U76Pb9VocFOuvSLMEEzjA6dg8f/z2r1IRu5yQnMhMQVT50WnmzvbrxN7qPjctA3/eqFP7Ec+BqEtMiMFG77DmwHfW5cdfwF08lsfKGjAVYrsMXiEnE7eLYzLEJiSnrq48/8DZWOBPpE3pR28HvnmtQocXC25fi/8rPOjjA5HXf8LiRDeQuQ0qtKIfKV++MBSDSZc0IHhPMFMvvJcM0WMuc99l3Pb0P8Mo2923PRlRZdxaJHLjm1wi4C4rEPhkXSypqOsDpTFKOwIDAQABAoIBAQCbq6UDpz/MHc2qA41Swi5yZppAcs66sSnm6OEUAG2oLktMc8FrMWXETyDJmlSa8bQ0fr5uKLmHkCkyyKXVsC25u9OhVPk/y0Oazb5GQB8MjCVtdoGKFzlgJ5QFCwHNrXbWaiMarZRMFhZQ5YbH5eRdBghkmvFOj7m6ho6okfIMN/iPmJ0EUuW/HfX75xEokfD1+yDhKMf+VSGXvS+ZGY64UuvYwQCGbSnbII9o8qrZm1xo6Tzha8QIB7tO/1WXPj453+sR10+WAHFiYbsDZxuFR2lgoA1aghdHtBo2b/p6iR5mmvJRY0Ur49gQHZt7tcBPTi9mhY2hdhIufL0Ws1EBAoGBAOubaLbwiwVa1WWn4MYU7Ss7zP0/KlN/Wj2tPomkAW/uZaPLQeVLK3H71uJHwumDOGRTYY84exmZ3wHDAV4AKSMl39H6rvevAkZq/aeUKdzGWClikflzS6hyYzPmJiZe3LV5ejmwZZXDaJ0MIg1V3NGkAY7QQ70P+lrN0x8MCiZ7AoGBAMU1/VhGdLtGOq9dpXi09aKMLQHz4Jdt6Kt9sJh+KueuZO6r6UAvDjbdvr277VFhLz6eFTboGNuFOs3mxVIJCfg8fRIyDxuSzkV94OjJZd7L8Lz0HUJkqWsggMlNfj92LzvsNyB5tAWZ3fk/v7NoDyls26Ymk9yL3/U5Q5SJC/9BAoGAIvCmI9MiWsXwtaWi0N1TmsDAkqHmbgGJ6XGiv5jB2c6Z5iODfzSZmcrGQEJyJl0eZMp0wl+W6eIGz2US89TERQEd4y7w+axLgxPk0BBJ8QK9Gk4S5dJyWuWzzoOIDtKsmoEMXjfJqN8UyY1+E0ozeCeBT6OVGBmhgAvcDlOjwbcCgYBpjt9/S58ZypqI2WBDvuCn084XeHljtJHQkSNgTFAc2Izv75aXI1jBZ2m8VwXNBG7sXmNOk2cSwTpbkcVWhr4OYBo2DhNmF+tO6PTkxUBAw/qkuSmcKxM/4xLsLQ2BXHol4ecT+/Cu+tAEpOmwVueercTYJ1gHudrzgGY68Cw6wQKBgDhzQDfsx52YriZoIy0d5rAzLg7AJvsABGcuRPvUqsSqEGgj5la4rhppYP/hCdkpx3VFNxPjvAK0OhaIcF/n/4LU0uGg35mTnoZzwXu417+nPdwWGZfSieQKSiUORva+12Jh9mo2cRFGjL7/fiS7mYIrXX3GI+xTO3hL+MArY8Yw
- MERCHANT_ID=MS36207085
- NEWEBPAY_HASH_KEY=NwBGU0WWwakSH39celRTvqAflMRIlYR1
- NEWEBPAY_HASH_IV=9ZXPUdf7W9H23oKJ
- NEWEBPAY_URL=https://ccore.spgateway.com/MPG/mpg_gateway
- SMS_ACCOUNT=42977332
- SMS_PASSWORD=beingsignalan
