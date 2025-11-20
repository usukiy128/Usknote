# Usknote - 优雅的备忘录管理系统

> 与丰川祥子一样优雅的备忘录页面

Usknote 是一个现代化的个人备忘录管理系统，具有简洁优雅的界面和强大的功能。

## 🌟 功能特性

- 📝 **备忘录管理** - 创建、编辑、删除和搜索备忘录
- 🎨 **现代化UI** - 响应式设计，支持桌面和移动端
- 🔍 **智能搜索** - 实时搜索备忘录内容
- 📱 **移动优化** - 触摸友好的交互设计
- 🌙 **优雅主题** - 精心设计的视觉风格
- ⚡ **快速响应** - 流畅的动画和交互效果

## 🚀 快速开始

### 环境要求

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/usukiy128/Usknote.git
cd Usknote
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务**
```bash
npm start
# 或者直接运行
node server.js
```

4. **访问应用**
打开浏览器访问：`http://localhost:3000`

## 🛠️ 服务器部署

### 1. 传统服务器部署（Linux/Ubuntu）

#### 环境准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js（使用 NodeSource 仓库）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

#### 部署应用
```bash
# 克隆项目
git clone https://github.com/usukiy128/Usknote.git
cd Usknote

# 安装依赖
npm install --production

# 启动服务（开发模式）
npm start

# 或者使用 PM2 进行生产环境部署
sudo npm install -g pm2
pm2 start server.js --name "usknote"
pm2 startup
pm2 save
```

#### 配置反向代理（Nginx）
```bash
# 安装 Nginx
sudo apt install nginx -y

# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/usknote
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/usknote /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

### 2. Docker 部署

#### 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "server.js"]
```

#### 构建和运行
```bash
# 构建镜像
docker build -t usknote .

# 运行容器
docker run -d -p 3000:3000 --name usknote-app usknote

# 使用 Docker Compose（推荐）
```

创建 `docker-compose.yml`：
```yaml
version: '3.8'
services:
  usknote:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - ./data:/app/data  # 持久化数据
```

运行：
```bash
docker-compose up -d
```

### 3. 云平台部署

#### Vercel 部署
1. Fork 本项目到您的 GitHub 账户
2. 在 Vercel 中导入项目
3. 配置构建命令：`npm install && npm run build`
4. 部署！

#### Heroku 部署
```bash
# 安装 Heroku CLI
heroku create your-app-name

# 设置构建环境
echo "web: node server.js" > Procfile

# 部署
git push heroku main
```

#### Railway 部署
1. 连接 GitHub 仓库到 Railway
2. 自动检测 Node.js 项目
3. 无需额外配置，自动部署

## ⚙️ 环境配置

### 环境变量
创建 `.env` 文件：
```env
PORT=3000
NODE_ENV=production
DB_PATH=./data/memos.db
```

### 数据库配置
应用使用 SQLite 数据库，数据文件位于 `./data/memos.db`

## 🔧 开发指南

### 开发模式
```bash
npm run dev  # 开发模式（如果配置了 nodemon）
```

### 项目结构
```
Usknote/
├── dashboard.html      # 仪表板页面
├── edit.html          # 编辑页面
├── mymemos.html       # 我的备忘录页面
├── settings.html      # 设置页面
├── welcome.html       # 欢迎页面
├── sidebar.html       # 侧边栏组件
├── styles.css         # 样式文件
├── script.js          # 前端脚本
├── server.js          # 服务器主文件
├── package.json       # 项目配置
└── data/              # 数据目录
    └── memos.db       # SQLite 数据库
```

## 🐛 故障排除

### 常见问题

1. **端口被占用**
```bash
# 查找占用端口的进程
lsof -i :3000
# 终止进程
kill -9 <PID>
```

2. **权限问题**
```bash
# 给数据目录写权限
chmod 755 data
```

3. **依赖安装失败**
```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 日志查看
```bash
# PM2 日志
pm2 logs usknote

# Docker 日志
docker logs usknote-app

# 系统日志
journalctl -u nginx -f
```

## 📞 支持与贡献

如果您遇到问题或有改进建议：

1. 查看 [GitHub Issues](https://github.com/usukiy128/Usknote/issues)
2. 提交新的 Issue
3. Fork 项目并提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**Power By [usukiy](https://github.com/usukiy128) ^_^**