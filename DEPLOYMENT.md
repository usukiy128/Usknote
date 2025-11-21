# 🚀 Usknote 一键部署指南 desuwa

> 就像MyGO!!!!!的演出一样，让部署也变得如此优雅呢～

## 📋 部署脚本介绍

Usknote 提供了像宝塔面板一样方便快捷的部署脚本，支持多种操作系统，让您能够快速搭建个人备忘录系统desuwa。

### 🎵 脚本特色

- **全自动部署** - 一键完成所有部署步骤，就像调音师调好所有乐器一样完美
- **多平台支持** - 支持 Linux、macOS、Windows 系统，无论在哪里都能优雅部署
- **智能检测** - 自动检测系统环境，确保所有依赖都准备就绪desuwa
- **错误处理** - 完善的错误提示和解决方案，让部署过程无忧无虑
- **服务管理** - 可选安装为系统服务，确保服务稳定运行

## 📦 部署文件说明

### 1. `deploy.sh` - Linux/macOS 部署脚本

**适用系统：** Linux (Ubuntu/CentOS/Fedora) 和 macOS

**功能特点：**
- 自动检测系统类型和包管理器
- 智能安装 Node.js 和依赖
- 支持安装为 systemd/launchd 系统服务
- 彩色输出和进度提示

### 2. `deploy.bat` - Windows 部署脚本

**适用系统：** Windows 10/11

**功能特点：**
- 兼容 Windows 命令行环境
- 自动检查 Node.js 和 npm
- 最小化窗口运行服务
- 支持彩色输出

## 🚀 快速开始 desuwa

### Linux/macOS 用户

```bash
# 1. 下载部署脚本（如果还没有）
git clone https://github.com/usukiy128/Usknote.git
cd Usknote

# 2. 运行部署脚本
./deploy.sh

# 3. 如果需要安装为系统服务
./deploy.sh --service
```

### Windows 用户

```cmd
# 1. 下载部署脚本（如果还没有）
git clone https://github.com/usukiy128/Usknote.git
cd Usknote

# 2. 运行部署脚本
deploy.bat
```

## 🔧 手动部署步骤

如果您更喜欢手动部署，就像亲手调音一样有成就感呢～

### 1. 环境准备

**Node.js 要求：** 14.0 或更高版本

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version
```

### 2. 下载项目

```bash
# 克隆项目
git clone https://github.com/usukiy128/Usknote.git
cd Usknote
```

### 3. 安装依赖

```bash
# 安装项目依赖
npm install
```

### 4. 启动服务

```bash
# 启动服务
npm start
# 或者
node server.js
```

### 5. 访问应用

打开浏览器访问：`http://localhost:3000`

## 🛠️ 高级配置 desuwa

### 修改端口号

如果您需要更改默认端口（3000），可以修改 `server.js` 文件：

```javascript
const PORT = 3000; // 修改为您想要的端口号
```

### 数据库配置

Usknote 使用 SQLite 数据库，数据文件位于 `data/memos.db`。您可以根据需要备份或迁移数据库文件desuwa。

### 反向代理配置

如果您使用 Nginx 作为反向代理，可以参考以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

## 🐳 Docker 部署（可选）

如果您喜欢使用 Docker，就像把整个乐队打包带走一样方便呢～

### 1. 创建 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. 构建和运行

```bash
# 构建镜像
docker build -t usknote .

# 运行容器
docker run -d -p 3000:3000 --name usknote-app usknote
```

## 🔍 故障排除

### 端口被占用

如果端口 3000 被占用，部署脚本会自动尝试停止占用进程。您也可以手动修改端口号desuwa。

### Node.js 版本过低

部署脚本会自动检测 Node.js 版本，如果版本过低会提示升级。请确保使用 Node.js 14.0 或更高版本。

### 权限问题

在 Linux 系统上，如果遇到权限问题，可以尝试：

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 使用 sudo 运行（如果需要）
sudo ./deploy.sh
```

## 📞 技术支持

如果遇到任何问题，就像演出遇到技术故障一样，请不要慌张desuwa：

1. **查看日志文件** - 服务日志位于 `server.log`
2. **检查错误信息** - 部署脚本会提供详细的错误提示
3. **查阅文档** - 参考项目的 README.md 文件
4. **提交 Issue** - 在 GitHub 仓库提交问题

## 🎉 部署完成

当您看到以下信息时，就像演出圆满结束一样，Usknote 已经成功部署desuwa！

```
🎉 部署完成 desuwa！
===========================================

就像MyGO!!!!!的演出圆满结束一样，Usknote已经成功部署！

📊 部署摘要:
  ✅ 系统依赖检查完成
  ✅ 项目代码下载完成
  ✅ 依赖包安装完成
  ✅ 运行环境配置完成
  ✅ 服务启动成功

🌐 访问地址: http://localhost:3000
📁 项目目录: /path/to/Usknote

感谢使用 Usknote，愿您的备忘录管理也如此优雅 desuwa～
```

现在，您可以开始使用这个优雅的备忘录系统，记录生活中的每一个美好瞬间了desuwa！