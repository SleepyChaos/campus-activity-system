# 答辩演示脚本

## 1. 项目运行

1. 说明技术栈：Vue3、Vue CLI、Vue Router、Vuex、Axios、Element Plus、json-server。
2. 运行 `npm run dev`，展示前端和后端同时启动。
3. 打开首页，展示活动轮播图、推荐活动和分类入口。

## 2. 学生端流程

1. 使用 `student01 / 123456` 登录。
2. 进入活动列表，演示关键词、分类、状态筛选。
3. 打开活动详情，说明详情页、名额、标签、活动说明。
4. 点击报名，进入报名确认页并提交。
5. 进入“我的报名”，展示报名记录和取消报名。
6. 对已报名活动进入二维码签到页，生成签到二维码并点击确认签到。
7. 进入活动相册，查看图片并上传一张活动照片。

## 3. 核心代码讲解点

- `src/router/index.js`：路由定义、带参路由和权限守卫。
- `src/store/modules`：用户、活动、报名、相册四类状态管理。
- `src/api`：Axios 封装和 RESTful API 调用。
- `src/views/user/CheckinView.vue`：二维码签到生成与签到状态更新。
- `src/views/user/AlbumUploadView.vue`：Element Plus 上传组件和相册数据提交。

## 4. 注册功能说明

本项目不提供真实注册功能。由于课程要求允许使用 json-server 模拟后端，当前账号采用预置测试数据完成角色切换，重点展示前端交互、状态管理、路由管理和 RESTful API 调用。
