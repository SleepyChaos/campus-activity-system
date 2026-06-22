# 校园活动发布系统

基于 Vue3 的前端交互期末大作业，选题 65：校园活动发布系统。项目使用 Vue CLI、Vue Router、Vuex、Axios、Element Plus 和 json-server，实现活动首页轮播图、分类筛选、详情展示、在线报名与取消、二维码签到、活动相册上传与查看。

## 技术栈

- Vue3 + Vue CLI
- Vue Router：超过 10 个路由，包含多个 params 路由
- Vuex：用户、活动、报名、相册状态管理
- Axios：统一请求 json-server RESTful API
- Element Plus：轮播、卡片、表单、表格、弹窗、上传、标签、提示等组件
- json-server：模拟后端接口和 JSON 数据

## 预置账号

| 角色 | 用户名 | 密码 | 说明 |
| --- | --- | --- | --- |
| 学生 A | `student01` | `123456` | 可报名、取消、签到、上传相册 |
| 学生 B | `student02` | `123456` | 用于演示不同用户报名记录互不影响 |

本项目不提供注册功能，因为后端使用 json-server 模拟接口，没有正式用户数据库。账号使用预置学生数据登录，适合课程答辩演示。

## 运行方式

```bash
npm install
npm run dev
```

如果不使用并发启动，也可以打开两个终端：

```bash
npm run api
npm run serve
```

默认访问：

- 前端页面：http://localhost:8080
- 后端接口：http://localhost:3001

## 作业要求对应

- 页面数量：主页、登录页、活动列表、分类页、详情页、报名页、我的报名、签到页、相册页、相册上传页、404。
- 路由数量：超过 10 个。
- 带参路由：`/activities/:id`、`/activities/category/:categoryId`、`/signup/:activityId`、`/checkin/:activityId`、`/albums/:activityId`、`/albums/:activityId/upload` 等。
- API 数量：用户、活动、分类、报名、签到、相册等接口超过 5 处。
- 业务流程：学生浏览活动并报名，报名后可取消或扫码签到，活动后可上传查看相册。
