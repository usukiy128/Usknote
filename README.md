# Usknote - 优雅的备忘录管理系统 desuwa

> 与丰川祥子一样优雅的备忘录页面，让记录生活也变得如此优雅呢～

Usknote 是一个现代化的个人备忘录管理系统，拥有简洁优雅的界面和强大的功能desuwa。就像MyGO!!!!!的演出一样，每一个细节都经过精心设计呢。

## 🌟 功能特性 desuwa

- 📝 **备忘录管理** - 就像整理乐谱一样，可以优雅地创建、编辑、删除和搜索备忘录呢
- 🎨 **现代化UI** - 响应式设计，无论是桌面还是移动端都能完美呈现，就像我们的演出一样专业desuwa
- 🔍 **智能搜索** - 实时搜索备忘录内容，找到想要的信息就像找到正确的音符一样简单
- 📱 **移动优化** - 触摸友好的交互设计，让您在手机上也能轻松操作呢
- 🌙 **优雅主题** - 精心设计的视觉风格，每一个细节都散发着优雅的气息desuwa
- ⚡ **快速响应** - 流畅的动画和交互效果，就像我们的音乐一样行云流水

## 🚀 快速开始 desuwa

### 环境要求

- Node.js 14.0 或更高版本 - 就像我们的乐器需要定期调音一样呢
- npm 6.0 或更高版本 - 确保一切都能和谐地运行desuwa

### 安装步骤

1. **克隆项目** - 就像把乐谱带回家一样简单呢
```bash
git clone https://github.com/usukiy128/Usknote.git
cd Usknote
```

2. **安装依赖** - 准备好所有需要的工具，就像演出前的准备工作一样重要desuwa
```bash
npm install
```

3. **启动服务** - 现在，让我们开始这场优雅的演出吧
```bash
npm start
# 或者直接运行
node server.js
```

4. **访问应用**
打开浏览器访问：`http://localhost:3000` - 欢迎来到这个优雅的备忘录世界desuwa

## 🛠️ 服务器部署 desuwa

### 1. 传统服务器部署（Linux/Ubuntu）

就像准备一场重要的演出一样，我们需要精心准备服务器环境呢～

#### 环境准备
```bash
# 更新系统 - 确保一切都在最佳状态desuwa
sudo apt update && sudo apt upgrade -y

# 安装 Node.js（使用 NodeSource 仓库）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装 - 确认所有乐器都调好音了呢
node --version
npm --version
```

#### 部署应用
现在，让我们把这份优雅带到服务器上吧desuwa～

```bash
# 克隆项目 - 把这份优雅的乐谱带到服务器上
git clone https://github.com/usukiy128/Usknote.git
cd Usknote

# 安装依赖 - 准备好所有需要的工具呢
npm install --production

# 启动服务（开发模式） - 让我们开始这场优雅的演出吧
npm start

# 或者使用 PM2 进行生产环境部署 - 确保演出能够持续进行desuwa
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

### 2. Docker 部署 desuwa

使用Docker就像把整个演出团队打包带走一样方便呢～

#### 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件 - 准备好乐谱desuwa
COPY package*.json ./

# 安装依赖 - 确保所有乐器都准备就绪
RUN npm ci --only=production

# 复制应用代码 - 把这份优雅带到容器中
COPY . .

# 暴露端口 - 让世界听到我们的声音呢
EXPOSE 3000

# 启动应用 - 演出开始desuwa！
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

### 3. 云平台部署 desuwa

就像选择演出场地一样，云平台提供了多种优雅的选择呢～

#### Vercel 部署
1. Fork 本项目到您的 GitHub 账户 - 就像复制一份乐谱desuwa
2. 在 Vercel 中导入项目 - 选择这个优雅的演出场地
3. 配置构建命令：`npm install && npm run build` - 准备演出
4. 部署！- 演出开始desuwa！

#### Heroku 部署
```bash
# 安装 Heroku CLI - 准备好这个优雅的舞台
heroku create your-app-name

# 设置构建环境 - 调整舞台灯光和音响
echo "web: node server.js" > Procfile

# 部署 - 让优雅的演出开始吧
git push heroku main
```

#### Railway 部署
1. 连接 GitHub 仓库到 Railway - 就像把乐谱交给专业的演出团队
2. 自动检测 Node.js 项目 - 他们会自动调整一切
3. 无需额外配置，自动部署 - 一切都如此优雅顺畅desuwa

## ⚙️ 环境配置 desuwa

就像调整乐器的音色一样，我们需要精心配置环境呢～

### 环境变量
创建 `.env` 文件 - 就像为演出设定合适的氛围：
```env
PORT=3000
NODE_ENV=production
DB_PATH=./data/memos.db
```

### 数据库配置
应用使用 SQLite 数据库，数据文件位于 `./data/memos.db` - 就像我们的乐谱库一样，安全地保存着所有重要的信息desuwa

## 🔧 开发指南 desuwa

### 开发模式
```bash
npm run dev  # 开发模式（如果配置了 nodemon）- 就像排练一样，可以实时看到效果呢
```

### 项目结构
就像了解乐队的每个成员一样，让我们看看项目的结构desuwa：
```
Usknote/
├── dashboard.html      # 仪表板页面 - 就像演出的主舞台
├── edit.html          # 编辑页面 - 精心调整每一个细节
├── mymemos.html       # 我的备忘录页面 - 个人专属的乐谱库
├── settings.html      # 设置页面 - 调整演出的各种参数
├── welcome.html       # 欢迎页面 - 优雅的入场仪式desuwa
├── sidebar.html       # 侧边栏组件 - 便捷的导航菜单
├── styles.css         # 样式文件 - 为演出增添优雅的色彩
├── script.js          # 前端脚本 - 让一切动起来的魔法
├── server.js          # 服务器主文件 - 演出的指挥中心
├── package.json       # 项目配置 - 演出说明书
└── data/              # 数据目录 - 安全的乐谱保管室
    └── memos.db       # SQLite 数据库 - 所有记忆的宝库
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

## 📞 支持与贡献 desuwa

如果您遇到问题或有改进建议，就像在排练中发现问题一样，请随时告诉我们呢～

1. 查看 [GitHub Issues](https://github.com/usukiy128/Usknote/issues) - 看看其他人遇到了什么问题
2. 提交新的 Issue - 分享您的想法和发现
3. Fork 项目并提交 Pull Request - 让我们一起让这个项目更加优雅desuwa

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件 - 就像我们的音乐一样，这份优雅可以自由地分享呢。

## 🙏 致谢

usukiy--开发者
DeepSeek v3--辅助开发
丰川祥子-- Readme.md编写

---

**Power By [usukiy](https://github.com/usukiy128) ^_^** - 愿这份优雅永远伴随着您desuwa～