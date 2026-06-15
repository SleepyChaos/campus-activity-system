# 后端 API 接口说明

后端使用 json-server 模拟 RESTful API，数据文件为项目根目录的 `db.json`。

## 用户与登录

- `GET /users?username=admin&password=123456`
  - 用途：模拟登录校验。
  - 返回：匹配的用户数组，前端取第一项作为当前用户。

## 活动与分类

- `GET /categories`
  - 用途：获取活动分类。

- `GET /activities`
  - 用途：获取活动列表。
  - 常用查询：`categoryId`、`status`、`q`。

- `GET /activities/:id`
  - 用途：获取活动详情。

- `POST /activities`
  - 用途：管理员发布活动。

- `PATCH /activities/:id`
  - 用途：管理员编辑活动，或报名/取消时更新已报名人数。

- `DELETE /activities/:id`
  - 用途：管理员删除活动。

## 报名与签到

- `GET /registrations?userId=2`
  - 用途：获取某个学生的报名记录。

- `GET /registrations?userId=2&activityId=1`
  - 用途：判断当前学生是否已报名某活动。

- `POST /registrations`
  - 用途：新增报名记录。

- `PATCH /registrations/:id`
  - 用途：取消报名或更新签到状态。
  - 取消报名示例：`{ "status": "cancelled" }`
  - 签到示例：`{ "status": "checkedIn", "checkedInAt": "2026-06-14 10:00" }`

## 活动相册

- `GET /photos?activityId=6`
  - 用途：查看某活动的相册。

- `POST /photos`
  - 用途：上传活动相册记录。
  - 说明：演示环境中图片以本地静态路径或 Base64 Data URL 保存。
