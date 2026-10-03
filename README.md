# 像素画编辑器

Docker Compose 是首选启动方式：

```bash
cp .env.example .env
docker compose up -d --build
```

访问地址：http://localhost:8270

## 项目介绍

这是一个像素画编辑器，支持 32x32 默认画布、调色板、画笔、橡皮擦、油漆桶、多帧动画、图层管理，以及 PNG/GIF 导出。

## 主要功能

- 像素网格绘制与尺寸调整
- 多颜色调色板、橡皮擦、油漆桶工具
- 多帧时间轴和动画预览播放
- 图层新增、合并、显隐
- PNG 和 GIF 导出

## 本地开发

前端：

```bash
cd frontend
npm install
npm run dev
```

后端：

```bash
cd backend
npm install
npm start
```

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 前端 | React 18, Vite, Vitest |
| 后端 | Node.js HTTP 服务 |
| Web 服务 | Nginx 反向代理 |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目结构

```text
.
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── database/
│   ├── Dockerfile
│   └── init.sql
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── .env
├── .env.example
├── docker-compose.yml
└── README.md
```

## 环境变量

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| COMPOSE_PROJECT_NAME | Compose 项目名 | gb-170 |
| FRONTEND_PORT | 前端宿主机端口 | 8270 |
| BACKEND_PORT | 后端宿主机和容器端口 | 3270 |
| DB_PORT | MySQL 宿主机端口 | 5770 |
| DB_NAME | 数据库名 | gb170 |
| DB_USER | 数据库用户 | gb170 |
| DB_PASSWORD | 数据库密码 | gb170_password |
| DB_ROOT_PASSWORD | MySQL root 密码 | gb170_root_password |
| JWT_SECRET | 后端密钥 | change_me_gb170_jwt_secret |

## Docker 部署说明

前端容器监听 80，并通过 Nginx 将 `/api/` 反向代理到 `backend:3270`。数据库镜像从 `database/` 构建并内置初始化脚本，运行数据使用 Compose 命名卷 `db_data` 持久化，避免中文路径绑定挂载问题。首次启动前请复制 `.env.example` 为 `.env`，如端口冲突可修改 `.env` 中的端口变量。

## License

MIT
