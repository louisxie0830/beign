# being-document-signing-frontend

## Build Setup

#bash
| 命令 | 描述 |
| ---------------- | -------------------------------------------------------------------------------- |
| npm install or yarn install | install dependencies |
| npm run dev | 啟動一個熱載入的 Web 服務器（開發模式） [localhost:3000](http://localhost:3000/) |
| npm run build:sit | build for SIT with minification 內部測試用 |
| npm run build:prod | build for production with minification 發布正式版 |
| npm run analyz | build for production and view the bundle analyzer report |

# envs

| name       | description  | test value                                 | prod value                |
| ---------- | ------------ | ------------------------------------------ | ------------------------- |
| BASE_URL   | API 的位置   | https://gw-signing-test.beingtech.org/prod | https://api.beingsign.com |
| DEPLOY_ENV | 部署環境變數 | sit                                        | prod                      |

# Project structure

```
.
├── Dockerfile
├── Jenkinsfile
├── README.md
├── build  /
├── config
├── cypress
├── cypress.json
├── dist
├── index.html
├── nginx.default.conf
├── node_modules
├── package.json
├── scripts
├── server.js
├── src
├── static
├── test
├── tests
└── yarn.lock
```

# 環境參數

```
.
├── dev.env.js
├── index.js
├── prod.env.js
└── sit.env.js
```

# 前後台頁面

```
.
├── Index.vue
├── Login.vue
├── WelcomePage.vue
├── admin
│   ├── AssignManager.vue
│   ├── CheckList.vue
│   ├── CreateAuth.vue
│   ├── EditManager.vue
│   └── ManagementIndex.vue
└── client
    ├── AddContact.vue
    ├── AuthCode.vue
    ├── ChangePassword.vue
    ├── CheckFile.vue
    ├── ContactPerson.vue
    ├── ForgetPassword.vue
    ├── PaymentInfo.vue
    ├── Policy.vue
    ├── Privacy.vue
    ├── Purchase.vue
    ├── PurchaseResult.vue
    ├── Register.vue
    ├── ResetPassword.vue
    ├── SetLanguages.vue
    ├── SetMail.vue
    ├── SetTags.vue
    ├── SignDocumentInfo.vue
    ├── SignDocuments.vue
    └── Signing.vue
```

# Common Plguin --- BeingPlugins.js

### 統一在 main.js 註冊

**Modal 使用方法**

```
 開啟 Modal
 this.modal.show({
         other param 請參照 Modal.vue props
         onConfirm: () => {
             // do something
         },
         onCancel: () => {
             // do something
         }
 });

 關閉 Modal
 this.modal.hide();
```

**Alert 使用方法**

```
開啟 Alert
this.alert.show({
     content: '',
     position: 'top|middle|bottom'
});

關閉 Alert
this.alert.hide();
```
