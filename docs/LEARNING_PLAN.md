# 校园活动发布系统 7 天冲刺学习表

## Summary

目标不是“把项目跑起来”，而是彻底理解每个作业指标如何在代码里实现，并能在答辩中讲清楚。  
后续学习统一按这条闭环推进：

`基础知识 -> 对应项目代码 -> 对应作业指标 -> 口头复述 -> 下一轮`

固定约束：

- 周期：`7天`
- 方式：`代码驱动`
- 强度：`每天 4-5 小时`
- 项目基线：`Vue3 + Vue CLI + Vue Router + Vuex + Axios + Element Plus + json-server`
- 后续每次学习都只推进当天主题，不跳题、不提前做后面模块

## 学习循环规则

每一天都执行同一套 6 步，不改顺序：

1. 先跑项目，确认当天要看的页面能打开。
2. 先看真实代码，再补对应知识点。
3. 把知识点和 1-2 个明确作业指标绑定。
4. 用自己的话解释“这段代码怎么实现、为什么这么写、如果不用会怎样”。
5. 做一个最小复盘：写下当天核心概念、关键文件、关键流程。
6. 做一次 3 分钟答辩模拟。

每次学习结束必须产出 5 项：

- 今天看懂的代码文件
- 今天掌握的基础知识
- 今天对应的作业指标
- 今天能复述的实现流程
- 今天还没懂透的点

后续和我继续学习时，也按这个格式推进：

- `知识点讲解`
- `对应代码定位`
- `指标映射`
- `答辩表达`
- `当天复盘`

## 7 天学习表

### Day 1：项目入口与工程化基础

学习目标：

- 搞懂项目是怎么启动的，Vue 应用是怎么挂起来的，项目目录为什么这样分。

基础知识：

- Vue CLI 是什么
- `main.js` 做了什么
- `createApp / app.use / app.mount`
- 全局注册组件
- 工程目录分层：`views / components / router / store / api`

代码重点：

- `src/main.js`
- `src/App.vue`
- `package.json`
- `README.md`

对应作业指标：

- 使用 `Vue3`
- 使用 `Vue CLI` 脚手架
- 项目具备完整前端工程结构

当天结果要求：

- 能说清 `npm run dev` 背后启动了什么
- 能说清 `main.js` 为什么要先挂 `store`、`router`、`Element Plus`
- 能画出项目目录结构图

答辩表达必须会说：

- “我使用 Vue CLI 创建工程，统一了开发、打包和运行方式。”
- “`main.js` 是整个应用入口，负责挂载路由、状态管理和 UI 组件库。”

### Day 2：路由系统与页面数量指标

学习目标：

- 搞懂页面跳转、动态路由、权限控制，以及老师要求的 `10+ 路由`、`3+ 参数路由` 是怎么达成的。

基础知识：

- `createRouter`
- `createWebHistory`
- 静态路由、动态路由、`props: true`
- 导航守卫 `beforeEach`
- `meta.requiresAuth`

代码重点：

- `src/router/index.js`
- `src/views/LoginView.vue`
- `src/views/NotFoundView.vue`

对应作业指标：

- 至少 `10` 个路径
- 至少 `3` 个带参数路径
- 页面数量 `8+`
- 权限跳转逻辑完整

当天结果要求：

- 能列出当前项目全部主要路由
- 能指出哪些是带参路由
- 能解释为什么报名页、签到页、详情页适合用动态路由

答辩表达必须会说：

- “我通过 Vue Router 管理页面切换，并通过路由守卫限制未登录用户访问报名、签到和相册上传页面。”
- “像 `/activities/:id`、`/signup/:activityId`、`/albums/:activityId` 这类动态路由可以根据不同活动复用同一个页面组件。”

### Day 3：Vuex 状态管理与登录流程

学习目标：

- 理解为什么要用 Vuex，而不是把数据都写在页面里；吃透登录态和会话恢复。

基础知识：

- `state / getters / mutations / actions / modules`
- 命名空间 `namespaced`
- `localStorage` 持久化
- 页面本地状态和全局状态的区别

代码重点：

- `src/store/index.js`
- `src/store/modules/user.js`
- `src/views/LoginView.vue`

对应作业指标：

- 使用 `Vuex` 进行状态管理
- 用户登录、会话恢复、页面权限控制完整

当天结果要求：

- 能解释 `restoreSession` 的作用
- 能说清 `login -> commit -> localStorage -> restoreSession` 这条链路
- 能回答“为什么登录用户要放进 Vuex”

答辩表达必须会说：

- “用户信息在多个页面都要用到，所以我把它放进 Vuex，而不是只存在某一个组件里。”
- “刷新页面后通过 `restoreSession` 从本地恢复登录态，提升体验。”

### Day 4：Axios、json-server 与 RESTful API

学习目标：

- 吃透前端是怎么请求数据的，为什么这套项目能满足 `Axios + RESTful API + JSON 数据` 的课程要求。

基础知识：

- HTTP 请求方法：`GET / POST / PATCH / DELETE`
- Axios 实例封装
- 响应拦截器
- mock 后端与 `json-server`
- `db.json` 如何充当数据库

代码重点：

- `src/api/request.js`
- `src/api/activities.js`
- `src/api/registrations.js`
- `src/api/photos.js`
- `src/api/users.js`
- `db.json`

对应作业指标：

- 使用 `Axios`
- 至少 `5` 处 RESTful API
- 主要数据使用 JSON 表示
- 后端接口说明可整理输出

当天结果要求：

- 能列出当前项目核心资源：`users / categories / activities / registrations / photos`
- 能说明 `request.js` 为什么要统一封装
- 能说清一个活动列表请求从前端到 mock 数据的完整过程

答辩表达必须会说：

- “我通过 Axios 封装请求实例，统一配置了 `baseURL` 和错误提示。”
- “我使用 json-server 模拟 RESTful API，满足了课程对后端接口和 JSON 数据的要求。”

### Day 5：学生端主业务流

学习目标：

- 吃透学生端最重要的业务闭环：浏览活动、分类筛选、查看详情、报名、取消、签到、相册查看。

基础知识：

- `computed`
- `onMounted`
- `props`
- 表单提交与异步流程
- 条件渲染与按钮禁用逻辑

代码重点：

- `src/views/HomeView.vue`
- `src/views/user/ActivitiesView.vue`
- `src/views/user/CategoryActivitiesView.vue`
- `src/views/user/ActivityDetailView.vue`
- `src/views/user/SignupView.vue`
- `src/views/user/MyRegistrationsView.vue`
- `src/views/user/CheckinView.vue`
- `src/views/user/AlbumView.vue`
- `src/components/ActivityCard.vue`

对应作业指标：

- 活动首页轮播图
- 活动分类筛选
- 活动详情展示
- 在线报名与取消
- 活动签到（二维码入口）
- 活动相册查看

当天结果要求：

- 能把学生端完整业务流程画成流程图
- 能解释报名页里 `canSubmit` 的业务判断
- 能说清“报名成功后为什么跳到我的报名”

答辩表达必须会说：

- “学生端的主线是：首页浏览 -> 分类筛选 -> 查看详情 -> 报名 -> 我的报名 -> 签到/查看相册。”
- “报名按钮不是无条件可点，代码中会校验活动状态、剩余名额和是否已报名。”

### Day 6：相册上传与完整业务闭环

学习目标：

- 理解为什么这个项目不只是列表展示，而是有完整的业务闭环，这也是优秀答辩的重要点。

基础知识：

- 上传组件使用方式
- Base64 图片预览
- 提交后页面跳转
- 报名、签到、相册之间的数据联动

代码重点：

- `src/views/user/AlbumUploadView.vue`
- `src/views/user/AlbumView.vue`
- `src/views/user/MyRegistrationsView.vue`
- `src/views/user/CheckinView.vue`
- `src/store/modules/registration.js`
- `src/store/modules/album.js`

对应作业指标：

- 完整程序界面
- 完整程序功能
- 复杂业务流程
- 相册上传与查看
- 报名后签到
- 数据状态联动

当天结果要求：

- 能说清报名、签到、相册上传之间的关系
- 能解释“为什么上传照片后回到相册页就能立即看到结果”
- 能说明为什么相册上传页适合单独做成一个路由页面

答辩表达必须会说：

- “我的项目不只是展示活动列表，还包含报名、取消报名、签到和相册上传，形成完整业务闭环。”
- “活动、报名和相册数据都通过接口和 Vuex 管理，所以页面之间能保持同步。”

### Day 7：指标总复盘与答辩专项

学习目标：

- 把所有知识点重新按“指标”串起来，形成答辩话术，不再按零散页面记忆。

基础知识：

- 不新增新概念，纯复盘
- 按“指标 -> 实现位置 -> 原理 -> 业务价值”组织表达

复盘重点：

- `Vue3` 怎么体现
- `Vue CLI` 怎么体现
- `Vue Router` 怎么体现
- `Vuex` 怎么体现
- `Axios` 怎么体现
- `RESTful API` 怎么体现
- `Element Plus` 用了哪些组件
- 六个题目功能分别在哪实现
- 哪些地方体现了复杂业务流程

对应作业指标：

- 全部指标一次性贯通

当天结果要求：

- 形成一份你自己的“答辩提纲”
- 每个指标都能回答：
  - 在哪里实现
  - 为什么这么实现
  - 如果老师点开代码你看哪里
- 完成一次完整 5-8 分钟口头演练

答辩表达必须会说：

- “我的项目不仅满足了基础技术要求，还通过报名、签到和相册上传形成完整业务闭环。”
- “每个课程要求我都能对应到具体代码位置和实际页面功能。”

## 学习验收标准

每天结束前必须同时满足：

- 能指出当天至少 `3` 个关键代码位置
- 能明确说出当天对应的作业指标
- 能不用看代码复述至少 `1` 条完整实现链路
- 能回答“为什么用这个技术，而不是随便写在页面里”
- 能输出一段 1 分钟答辩口述

7 天结束时必须达到：

- 能独立讲清整个项目结构
- 能独立讲清学生端主流程
- 能独立讲清 `Router / Vuex / Axios / json-server / Element Plus`
- 能独立把老师所有硬性要求和代码实现一一对应

## 默认约束

- 后续学习默认基于当前现有项目代码，不从零重写项目。
- 学习顺序固定为“先代码、后原理、再指标映射”，不切回原理优先模式。
- 后续和我继续学习时，默认一次只推进一天内容。
- 明天开始学习时，默认直接从 **Day 1：项目入口与工程化基础** 开始。
