# INSTALL

## Install dependencies

```shell
npm run install-dependencies
npm install nodemon --save-dev
npm install axios --save-dev
npm install --save echarts-for-react
npm install --save echarts
```

## Run

#### MongoDB

- If you do not have local MongoDB, you can set `DEBUG: false` in `backend/config.js` to use beet's Azure.
- If you want to test/run totally locally, set your mongo in `backend/server.js`, and make sure `DEBUG: true`.

#### Octokit (Github Auth)

Get your GITHUB_ACCESS_TOKEN from github and fill it into `backend/config.js`.

---

```
npm run server
npm run client
```
