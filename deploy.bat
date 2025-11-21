@echo off
chcp 65001 >nul

REM ===========================================
REM Usknote Windows 一键部署脚本 desuwa
REM ===========================================

echo.
echo ===========================================
echo 🎵 Usknote Windows 一键部署脚本 desuwa
echo ===========================================
echo 就像MyGO!!!!!的演出一样，让部署也变得优雅呢～
echo.

REM 设置颜色
for /f "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do set "DEL=%%a"

REM 函数：打印带颜色的消息
:print_info
echo [INFO] %*
goto :eof

:print_success
call :ColorText 0A "[SUCCESS]"
echo %*
goto :eof

:print_warning
call :ColorText 0E "[WARNING]"
echo %*
goto :eof

:print_error
call :ColorText 0C "[ERROR]"
echo %*
goto :eof

:print_step
call :ColorText 0D "[STEP]"
echo %*
goto :eof

:ColorText
<nul set /p ".=%DEL%" > "%~2"
findstr /v /a:%1 /r "^$" "%~2" nul
del "%~2" > nul 2>&1
goto :eof

REM 函数：检查命令是否存在
:command_exists
%1 /? >nul 2>&1
if %errorlevel% == 9009 (
    exit /b 1
) else (
    exit /b 0
)

REM 函数：检查 Node.js
:check_nodejs
call :print_step "检查 Node.js 安装..."
node --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Node.js 未安装"
    call :print_info "请从 https://nodejs.org 下载并安装 Node.js 14.0 或更高版本"
    pause
    exit /b 1
)

REM 检查 Node.js 版本
for /f "tokens=3" %%i in ('node --version') do set "node_version=%%i"
set "node_version=%node_version:v=%"
for /f "tokens=1 delims=." %%i in ("%node_version%") do set "major_version=%%i"

if %major_version% lss 14 (
    call :print_error "Node.js 版本过低 (%node_version%)，需要 14.0 或更高版本"
    call :print_info "请从 https://nodejs.org 下载并安装新版 Node.js"
    pause
    exit /b 1
)

call :print_success "Node.js 版本符合要求 (%node_version%) desuwa"
goto :eof

REM 函数：检查 npm
:check_npm
call :print_step "检查 npm 安装..."
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "npm 未安装，请检查Node.js安装"
    pause
    exit /b 1
)
call :print_success "npm 已安装"
goto :eof

REM 函数：检查 git
:check_git
call :print_step "检查 git 安装..."
git --version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_warning "git 未安装，请从 https://git-scm.com 下载安装"
    call :print_info "或者手动下载项目代码：https://github.com/usukiy128/Usknote"
    set /p "continue=是否继续？(y/n): "
    if /i not "%continue%"=="y" (
        exit /b 1
    )
) else (
    call :print_success "git 已安装"
)
goto :eof

REM 函数：下载项目
:download_project
call :print_step "下载 Usknote 项目..."

if exist "Usknote" (
    call :print_warning "Usknote 目录已存在，正在更新..."
    cd Usknote
    git pull origin main
) else (
    git clone https://github.com/usukiy128/Usknote.git
    cd Usknote
)

if %errorlevel% neq 0 (
    call :print_error "项目下载失败"
    call :print_info "请手动下载：https://github.com/usukiy128/Usknote"
    pause
    exit /b 1
)

call :print_success "项目下载完成 desuwa"
goto :eof

REM 函数：安装依赖
:install_dependencies
call :print_step "安装项目依赖..."

if exist "package.json" (
    npm install
    if %errorlevel% neq 0 (
        call :print_error "依赖安装失败"
        pause
        exit /b 1
    )
    call :print_success "依赖安装完成"
) else (
    call :print_error "package.json 文件不存在"
    pause
    exit /b 1
)
goto :eof

REM 函数：配置环境
:setup_environment
call :print_step "配置运行环境..."

if not exist "data" (
    mkdir data
    call :print_success "创建数据目录"
)

REM 检查必要的文件
if not exist "server.js" (
    call :print_error "server.js 文件不存在"
    pause
    exit /b 1
)

if not exist "dashboard.html" (
    call :print_error "dashboard.html 文件不存在"
    pause
    exit /b 1
)

if not exist "package.json" (
    call :print_error "package.json 文件不存在"
    pause
    exit /b 1
)

call :print_success "环境配置完成 desuwa"
goto :eof

REM 函数：启动服务
:start_service
call :print_step "启动 Usknote 服务..."

REM 检查端口是否被占用
netstat -ano | findstr ":3000" >nul
if %errorlevel% == 0 (
    call :print_warning "端口 3000 已被占用"
    call :print_info "请关闭占用端口的程序或使用其他端口"
)

REM 启动服务
start "Usknote Server" /min node server.js

call :print_success "服务启动成功！"
echo 服务窗口已最小化到任务栏
echo 访问地址: http://localhost:3000
echo.
echo 🎵 就像MyGO!!!!!的演出开始一样，Usknote已经准备就绪 desuwa！
echo 💾 数据文件位置: %CD%\data\memos.db
echo 📝 开始记录您的优雅备忘录吧～
goto :eof

REM 函数：显示使用说明
:show_usage
echo.
echo ===========================================
echo 📖 使用说明 desuwa
echo ===========================================
echo.
echo 基本用法:
echo   deploy.bat           # 一键部署并启动
echo   deploy.bat --help    # 显示帮助信息
echo.
echo 管理命令:
echo   node server.js       # 手动启动服务
echo   npm start            # 使用npm启动
echo.
echo 就像MyGO!!!!!的演出一样，每个细节都精心设计呢～
echo.
goto :eof

REM 主函数
:main
setlocal enabledelayedexpansion

REM 解析参数
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

REM 开始部署流程
echo.
echo 🎵 开始 Usknote 部署流程 desuwa...
echo 就像准备一场完美的演出一样，每个步骤都很重要呢～
echo.

REM 1. 检查依赖
call :check_nodejs
call :check_npm
call :check_git

REM 2. 下载项目
call :download_project

REM 3. 安装依赖
call :install_dependencies

REM 4. 配置环境
call :setup_environment

REM 5. 启动服务
call :start_service

echo.
echo ===========================================
echo 🎉 部署完成 desuwa！
echo ===========================================
echo.
echo 就像MyGO!!!!!的演出圆满结束一样，Usknote已经成功部署！
echo.
echo 📊 部署摘要:
echo   ✅ 系统依赖检查完成
echo   ✅ 项目代码下载完成
echo   ✅ 依赖包安装完成
echo   ✅ 运行环境配置完成
echo   ✅ 服务启动成功
echo.
echo 🌐 访问地址: http://localhost:3000
echo 📁 项目目录: %CD%
echo.
echo 感谢使用 Usknote，愿您的备忘录管理也如此优雅 desuwa～
echo.

pause
goto :eof

:show_help
call :show_usage
pause
goto :eof

REM 脚本入口
if "%1"=="" goto main
goto main