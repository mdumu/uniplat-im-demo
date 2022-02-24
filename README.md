# im-demo

## Project setup

```
npm run init
```

### Compiles and hot-reloads for development

```
npm run serve:test1
npm run serve:test2
可以启动不同的测试账号
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### src/customer-service

是一个基于 VueX 和 xchat 的客服子模块，本身不能单独运行，通过`src/store/index.ts` 中 `modules` 进行挂载

在`src/service/chat.ts`中`initChat`进行初始化

但是在`initChat`需要依赖我们自研的`api`对接`sdk`，所以在初始化前还需要传入已登录的`sdk`

`sdk`提供多种登录，demo 中提供的是统一认证中心`passport`的方式登录

demo 请看`src/views/home.vue`
