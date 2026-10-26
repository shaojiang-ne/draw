# AI 绘图 - 服务器部署文档（Nginx + SEO）

本文档介绍如何将本项目部署到 Linux 服务器，使用 Nginx 提供静态资源服务和 API 反向代理，并完成搜索引擎优化配置。

## 1. 项目结构说明

构建产物（`dist/`）是一个多页应用（MPA）：

| 路径 | 内容 | 说明 |
| --- | --- | --- |
| `/` | 落地页（`dist/index.html`） | 纯静态 HTML，SEO 主入口，可被搜索引擎完整抓取 |
| `/app/` | 绘图应用（`dist/app/index.html`） | React SPA，HashRouter 路由（`/app/#/templates`），已标记 `noindex` |
| `/assets/` | JS/CSS 等构建资源 | 文件名带内容哈希，可长缓存 |
| `/robots.txt`、`/sitemap.xml` | 爬虫协议与站点地图 | 部署前需替换域名 |
| `/api/*` | AI 接口 | 由 Nginx 反向代理到上游 API，SSE 流式传输 |

> 应用使用 HashRouter（URL 形如 `/app/#/templates`），路由信息在 `#` 之后，不发送到服务器，因此 **Nginx 无需配置 history 路由回退**，任意静态托管均可工作。

## 2. 本地构建

```bash
# 安装依赖
npm ci

# 配置环境变量（复制并编辑 .env，填入 API Key）
cp .env.example .env

# 构建，产物输出到 dist/
npm run build
```

`.env` 关键配置：

```ini
VITE_OPENAI_API_KEY=你的API Key
VITE_OPENAI_MODEL=模型名称
# 生产环境 API 地址。留空则走同源 /api 前缀（推荐，由 Nginx 代理）
# VITE_OPENAI_API_ENDPOINT=
```

> **安全提示**：`VITE_OPENAI_API_KEY` 会被打包进前端 JS，任何打开网页的人都能通过浏览器开发者工具看到。如果 API 按量计费且站点公开访问，建议改用同源 `/api` 前缀并在 Nginx 层注入鉴权头（见 4.3），或自行增加后端中转。

## 3. 上传产物

将 `dist/` 上传到服务器，例如 `/var/www/ai-draw`：

```bash
# 本地执行
scp -r dist/ user@服务器IP:/var/www/ai-draw

# 或使用 rsync（推荐，增量同步）
rsync -avz --delete dist/ user@服务器IP:/var/www/ai-draw/
```

## 4. Nginx 配置

### 4.1 完整配置示例

创建 `/etc/nginx/conf.d/ai-draw.conf`（把 `your-domain.com` 替换为实际域名）：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/ai-draw;
    index index.html;

    # ---------- gzip 压缩（SEO 与加载速度） ----------
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json
               image/svg+xml application/xml;

    # ---------- 安全响应头 ----------
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # ---------- 构建资源：带哈希，长缓存 ----------
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # ---------- 图标等静态文件 ----------
    location ~* \.(svg|png|ico|txt|xml)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # ---------- AI 接口反向代理（SSE 流式，必须关闭缓冲） ----------
    location /api/ {
        # 与 vite.config.ts 中 dev 代理一致：/api/* → 上游 /v2/*
        proxy_pass https://maas-coding-api.cn-huabei-1.xf-yun.com/v2/;
        proxy_set_header Host maas-coding-api.cn-huabei-1.xf-yun.com;

        # SSE 流式传输关键配置
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding on;
        gzip off;                    # 流式响应不能压缩
        proxy_read_timeout 300s;     # 图表生成耗时长，放宽超时
        proxy_send_timeout 300s;
    }

    # ---------- 应用（/app） ----------
    location /app {
        try_files $uri $uri/ /app/index.html;
    }

    # ---------- 落地页（/） ----------
    location / {
        try_files $uri $uri/ /index.html;
    }

    # HTML 不缓存，保证发版即时生效
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }
}
```

### 4.2 生效与验证

```bash
# 检查配置语法
nginx -t

# 重载
systemctl reload nginx

# 验证
curl -I http://your-domain.com/          # 200，落地页
curl -I http://your-domain.com/app/      # 200，应用
curl http://your-domain.com/robots.txt   # 爬虫协议
```

### 4.3 可选：在 Nginx 层隐藏 API Key

如果不希望 Key 出现在前端代码中，`.env` 里把 `VITE_OPENAI_API_KEY` 留空，并在 `/api/` location 注入鉴权头（同时需移除前端对空 Key 的拦截逻辑）：

```nginx
location /api/ {
    proxy_pass https://maas-coding-api.cn-huabei-1.xf-yun.com/v2/;
    proxy_set_header Host maas-coding-api.cn-huabei-1.xf-yun.com;
    proxy_set_header Authorization "Bearer 你的API Key";
    # ...其余 SSE 配置同上
}
```

## 5. HTTPS 配置（SEO 必需）

搜索引擎对 HTTPS 站点有明确的排名倾斜，使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot（以 Ubuntu 为例）
apt install certbot python3-certbot-nginx

# 自动签发并改写 Nginx 配置
certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期验证
certbot renew --dry-run
```

签发后 certbot 会自动添加 443 server 块和 HTTP→HTTPS 跳转，无需手工修改。

## 6. SEO 上线清单

### 6.1 替换域名（必须）

构建前或部署后，替换以下文件中的占位域名 `your-domain.com`：

- `public/sitemap.xml` — 两条 `<loc>` 记录
- `public/robots.txt` — 取消 Sitemap 行注释并填域名
- `index.html`（落地页）— 取消注释并填写：
  - `<link rel="canonical" href="https://your-domain.com/" />`
  - `<meta property="og:url" content="https://your-domain.com/" />`
  - `<meta property="og:image" content="https://your-domain.com/og-cover.png" />`（需自制 1200×630 分享图，放入 `public/`）

### 6.2 提交搜索引擎

| 平台 | 入口 | 操作 |
| --- | --- | --- |
| Google | [Search Console](https://search.google.com/search-console) | 验证站点所有权 → 提交 `https://your-domain.com/sitemap.xml` |
| 百度 | [百度搜索资源平台](https://ziyuan.baidu.com) | 站点验证 → 普通收录提交 sitemap → 开启 HTTPS 认证 |
| Bing | [Bing Webmaster Tools](https://www.bing.com/webmasters) | 导入 GSC 或手动提交 sitemap |

### 6.3 本项目的 SEO 设计（已实现，供参考）

- 落地页为纯静态 HTML：title / description / keywords / OG / Twitter Card / JSON-LD（`WebApplication`）齐全，爬虫无需执行 JS 即可抓取全部内容
- 应用页（`/app/`）标记 `noindex`，权重集中在落地页
- `sitemap.xml` 中落地页 priority 1.0，应用页 0.6
- 语义化 HTML（`nav`/`main`/`article`/`h1`/`h2`）+ 中文 `lang="zh-CN"`

### 6.4 部署后自检

```bash
# 页面可被无 JS 抓取（应输出完整 HTML 内容）
curl -s https://your-domain.com/ | head -50

# robots 与 sitemap 可访问
curl -s https://your-domain.com/robots.txt
curl -s https://your-domain.com/sitemap.xml

# HTTPS 跳转正常
curl -I http://your-domain.com/   # 应 301 到 https
```

再用手持设备访问确认移动端布局，并用 [Google PageSpeed Insights](https://pagespeed.web.dev/) 跑一遍分数。

## 7. 日常发版流程

```bash
# 本地
npm run build
rsync -avz --delete dist/ user@服务器IP:/var/www/ai-draw/

# 无需重启 Nginx，静态文件即刻生效（HTML 已配 no-cache）
```

## 8. 常见问题

| 问题 | 排查 |
| --- | --- |
| 生成图表时转圈后失败 | 检查 `/api/` 代理是否生效：`curl -N https://your-domain.com/api/chat/completions` 应返回 401/400 而非 404；确认 `proxy_buffering off` 已配置 |
| 流式输出卡住、一次性返回 | Nginx 缓冲未关闭，或上层还有 CDN 开启了缓冲；确认 `proxy_buffering off` 与 `gzip off` |
| `/app/` 刷新 404 | `location /app` 的 `try_files` 未配置；注意 HashRouter 的 `#/` 部分不发送到服务器，与服务器无关 |
| 落地页样式错乱 | 确认 `gzip_types` 包含 `text/css`，且 `/assets/` 返回 200 |
| 搜索一直不收录 | 确认 robots.txt 未误禁爬；在百度/Google 站长平台手动提交；检查 canonical 是否指向最终域名 |
