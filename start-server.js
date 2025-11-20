#!/usr/bin/env node

// 这个脚本用于启动 Express 服务器

const { spawn } = require('child_process');
const path = require('path');

// 设置环境变量
process.env.NODE_PATH = path.resolve(__dirname, 'node_modules');

// 使用 npx 运行 nodemon 来启动服务器
const server = spawn('npx', ['nodemon', 'server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  console.log(`服务器进程退出，退出码: ${code}`);
});

server.on('error', (err) => {
  console.error('启动服务器时出错:', err);
  
  // 如果 nodemon 不可用，尝试直接使用 node
  console.log('尝试使用 node 直接启动...');
  const directServer = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  directServer.on('close', (code) => {
    console.log(`直接启动的服务器进程退出，退出码: ${code}`);
  });
  
  directServer.on('error', (err) => {
    console.error('直接启动服务器时也出错:', err);
  });
});