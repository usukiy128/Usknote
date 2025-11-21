#!/bin/bash

# ===========================================
# Usknote 一键部署脚本 desuwa
# 像宝塔面板一样方便快捷的部署工具
# ===========================================

# 脚本信息
echo "==========================================="
echo "🎵 Usknote 一键部署脚本 desuwa"
echo "==========================================="
echo "就像MyGO!!!!!的演出一样，让部署也变得优雅呢～"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 函数：检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 函数：检查系统类型
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# 函数：安装 Node.js
install_nodejs() {
    local os_type=$1
    print_step "正在安装 Node.js..."
    
    case $os_type in
        "linux")
            if command_exists apt-get; then
                # Ubuntu/Debian
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command_exists yum; then
                # CentOS/RHEL
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs
            elif command_exists dnf; then
                # Fedora
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo dnf install -y nodejs
            else
                print_error "不支持的Linux发行版，请手动安装Node.js"
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                brew install node@18
            else
                print_error "请先安装Homebrew，或从官网下载Node.js安装包"
                exit 1
            fi
            ;;
        "windows")
            print_info "请从 https://nodejs.org 下载并安装Node.js"
            exit 1
            ;;
        *)
            print_error "不支持的操作系统"
            exit 1
            ;;
    esac
    
    print_success "Node.js 安装完成 desuwa"
}

# 函数：检查并安装依赖
check_dependencies() {
    print_step "检查系统依赖..."
    
    local os_type=$(detect_os)
    
    # 检查 Node.js
    if ! command_exists node; then
        print_warning "Node.js 未安装，开始自动安装..."
        install_nodejs $os_type
    else
        local node_version=$(node --version | sed 's/v//')
        local major_version=$(echo $node_version | cut -d. -f1)
        
        if [ $major_version -lt 14 ]; then
            print_warning "Node.js 版本过低 ($node_version)，需要升级到 14.0 或更高版本"
            install_nodejs $os_type
        else
            print_success "Node.js 版本符合要求 ($node_version) desuwa"
        fi
    fi
    
    # 检查 npm
    if ! command_exists npm; then
        print_error "npm 未安装，请检查Node.js安装"
        exit 1
    else
        print_success "npm 已安装"
    fi
    
    # 检查 git
    if ! command_exists git; then
        print_warning "git 未安装，正在安装..."
        case $os_type in
            "linux")
                if command_exists apt-get; then
                    sudo apt-get install -y git
                elif command_exists yum; then
                    sudo yum install -y git
                elif command_exists dnf; then
                    sudo dnf install -y git
                fi
                ;;
            "macos")
                if command_exists brew; then
                    brew install git
                else
                    xcode-select --install
                fi
                ;;
        esac
        print_success "git 安装完成"
    else
        print_success "git 已安装"
    fi
}

# 函数：下载项目
download_project() {
    print_step "下载 Usknote 项目..."
    
    if [ -d "Usknote" ]; then
        print_warning "Usknote 目录已存在，正在更新..."
        cd Usknote
        git pull origin main
    else
        git clone https://github.com/usukiy128/Usknote.git
        cd Usknote
    fi
    
    print_success "项目下载完成 desuwa"
}

# 函数：安装项目依赖
install_dependencies() {
    print_step "安装项目依赖..."
    
    if [ -f "package.json" ]; then
        npm install
        print_success "依赖安装完成"
    else
        print_error "package.json 文件不存在"
        exit 1
    fi
}

# 函数：配置环境
setup_environment() {
    print_step "配置运行环境..."
    
    # 创建数据目录
    if [ ! -d "data" ]; then
        mkdir data
        print_success "创建数据目录"
    fi
    
    # 检查必要的文件
    local required_files=("server.js" "dashboard.html" "package.json")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "必要文件 $file 不存在"
            exit 1
        fi
    done
    
    print_success "环境配置完成 desuwa"
}

# 函数：启动服务
start_service() {
    print_step "启动 Usknote 服务..."
    
    # 检查端口是否被占用
    if command_exists lsof; then
        if lsof -i :3000 >/dev/null 2>&1; then
            print_warning "端口 3000 已被占用，尝试停止占用进程..."
            lsof -ti:3000 | xargs kill -9 >/dev/null 2>&1
            sleep 2
        fi
    fi
    
    # 启动服务
    nohup node server.js > server.log 2>&1 &
    local pid=$!
    
    # 等待服务启动
    sleep 3
    
    # 检查服务是否启动成功
    if ps -p $pid > /dev/null; then
        print_success "服务启动成功！PID: $pid"
        echo "服务日志文件: server.log"
        echo "访问地址: http://localhost:3000"
        echo ""
        echo "🎵 就像MyGO!!!!!的演出开始一样，Usknote已经准备就绪 desuwa！"
        echo "💾 数据文件位置: $(pwd)/data/memos.db"
        echo "📝 开始记录您的优雅备忘录吧～"
    else
        print_error "服务启动失败，请检查 server.log 文件"
        exit 1
    fi
}

# 函数：安装为系统服务（可选）
install_as_service() {
    print_step "安装为系统服务（可选）..."
    
    local os_type=$(detect_os)
    local service_file=""
    
    case $os_type in
        "linux")
            # 创建 systemd 服务文件
            service_file="/etc/systemd/system/usknote.service"
            
            if [ ! -f "$service_file" ]; then
                sudo tee $service_file > /dev/null <<EOF
[Unit]
Description=Usknote Memo Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=usknote

[Install]
WantedBy=multi-user.target
EOF
                
                sudo systemctl daemon-reload
                sudo systemctl enable usknote.service
                print_success "系统服务安装完成"
                echo "使用以下命令管理服务:"
                echo "  sudo systemctl start usknote"
                echo "  sudo systemctl stop usknote"
                echo "  sudo systemctl status usknote"
            else
                print_info "系统服务已存在"
            fi
            ;;
        "macos")
            # 创建 launchd plist 文件
            service_file="$HOME/Library/LaunchAgents/com.usknote.plist"
            
            if [ ! -f "$service_file" ]; then
                tee $service_file > /dev/null <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.usknote</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>$(pwd)/server.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>$(pwd)</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$(pwd)/usknote.log</string>
    <key>StandardErrorPath</key>
    <string>$(pwd)/usknote.log</string>
</dict>
</plist>
EOF
                
                launchctl load $service_file
                print_success "启动服务安装完成"
            else
                print_info "启动服务已存在"
            fi
            ;;
        *)
            print_info "当前系统不支持自动安装为系统服务"
            ;;
    esac
}

# 函数：显示使用说明
show_usage() {
    echo ""
    echo "==========================================="
    echo "📖 使用说明 desuwa"
    echo "==========================================="
    echo ""
    echo "基本用法:"
    echo "  ./deploy.sh           # 一键部署并启动"
    echo "  ./deploy.sh --service # 部署并安装为系统服务"
    echo "  ./deploy.sh --help    # 显示帮助信息"
    echo ""
    echo "管理命令:"
    echo "  node server.js        # 手动启动服务"
    echo "  npm start             # 使用npm启动"
    echo ""
    echo "就像MyGO!!!!!的演出一样，每个细节都精心设计呢～"
    echo ""
}

# 主函数
main() {
    local install_service=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --service|-s)
                install_service=true
                shift
                ;;
            --help|-h)
                show_usage
                exit 0
                ;;
            *)
                print_error "未知参数: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # 开始部署流程
    echo ""
    echo "🎵 开始 Usknote 部署流程 desuwa..."
    echo "就像准备一场完美的演出一样，每个步骤都很重要呢～"
    echo ""
    
    # 1. 检查依赖
    check_dependencies
    
    # 2. 下载项目
    download_project
    
    # 3. 安装依赖
    install_dependencies
    
    # 4. 配置环境
    setup_environment
    
    # 5. 启动服务
    start_service
    
    # 6. 可选：安装为系统服务
    if [ "$install_service" = true ]; then
        install_as_service
    fi
    
    echo ""
    echo "==========================================="
    echo "🎉 部署完成 desuwa！"
    echo "==========================================="
    echo ""
    echo "就像MyGO!!!!!的演出圆满结束一样，Usknote已经成功部署！"
    echo ""
    echo "📊 部署摘要:"
    echo "  ✅ 系统依赖检查完成"
    echo "  ✅ 项目代码下载完成"
    echo "  ✅ 依赖包安装完成"
    echo "  ✅ 运行环境配置完成"
    echo "  ✅ 服务启动成功"
    if [ "$install_service" = true ]; then
        echo "  ✅ 系统服务安装完成"
    fi
    echo ""
    echo "🌐 访问地址: http://localhost:3000"
    echo "📁 项目目录: $(pwd)"
    echo ""
    echo "感谢使用 Usknote，愿您的备忘录管理也如此优雅 desuwa～"
    echo ""
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi