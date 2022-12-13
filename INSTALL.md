# INSTALL

## Install Project Utils
Operations below are all based on centos 8.4.0. Please first check os before you scroll down.And the following operations assume that your yum source is already up to date.
1. Firstly, you should install mongodb.You can refer to https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/. Or you can running following steps.
   - create `/etc/yum.repos.d/mongodb-org-6.0.repo` file, and paste below text into it.
        >[mongodb-org-6.0]
        name=MongoDB Repository
        baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/x86_64/
        gpgcheck=1
        enabled=1
        gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
    - Then you should run `sudo yum install -y mongodb-org` and add `exclude=mongodb-org,mongodb-org-database,mongodb-org-server,mongodb-mongosh,mongodb-org-mongos,mongodb-org-tools` to your `~/.zshrc` or `~/.bashrc`
    - Then you should run `mongo --version;mongod --version` to check whether mongodb is correctly installed.The output should like this.
    - ![](https://hutao-image-bed.oss-cn-hangzhou.aliyuncs.com/uPic/tnfFtZ.png)
2.  Then you should install nodejs. Also, you can refer to https://www.jianshu.com/p/959ca0e5495a. I'll only include minimum steps below.
    - first run `wget https://nodejs.org/dist/v16.13.2/node-v16.13.2-linux-x64.tar.xz` in any dir.
    - then run ` xz -d node-v16.13.2-linux-x64.tar.xz` to extract it (if bash or zsh cannot find xz, please run `yum install xz.x86_64`)
    - run `tar xvf node-v16.13.2-linux-x64.tar`
    - run `mv node-v16.13.2-linux-x64 /usr/local/nodejs`
    - Add `/usr/local/nodejs/bin` to your `~/.bashrc` or `~/.zshrc`,source it. Then run node -v, npm -v to check version. It should output like this.(node version here is v18.12.1, but version 16.13.2 is also ok, the same for npm)
    ![](https://hutao-image-bed.oss-cn-hangzhou.aliyuncs.com/uPic/FXtDL7.png)
3.  //TODO 安装es和套件
## Install dependencies

```shell
npm run install-dependencies
npm install nodemon --save-dev
```

## Run

#### MongoDB

+ If you do not have local MongoDB, you can set `DEBUG: false` in `backend/config.js` to use beet's Azure.
+ If you want to test/run totally locally, set your mongo in `backend/server.js`, and make sure `DEBUG: true`.

#### Octokit (Github Auth)

Get your GITHUB_ACCESS_TOKEN from github and fill it into `backend/config.js`.

---

```
npm run server
npm run client
```

