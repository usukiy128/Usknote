const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 创建数据目录（如果不存在）
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 连接到 SQLite 数据库
const dbPath = path.join(dataDir, 'memos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('连接数据库失败:', err.message);
  } else {
    console.log('成功连接到 SQLite 数据库');
    
    // 创建备忘录表（如果不存在）
    db.run(`CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('创建表失败:', err.message);
      } else {
        console.log('备忘录表准备就绪');
      }
    });
  }
});

// 中间件
app.use(express.json());

// 提供静态文件
app.use(express.static('.'));

// 根路径重定向到欢迎页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

// API 路由

// 获取所有备忘录
app.get('/api/memos', (req, res) => {
  const user = req.query.user || 'default';
  db.all('SELECT * FROM memos WHERE user = ? ORDER BY created_at DESC', [user], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 获取单个备忘录
app.get('/api/memos/:id', (req, res) => {
  const user = req.query.user || 'default';
  const { id } = req.params;
  db.get('SELECT * FROM memos WHERE id = ? AND user = ?', [id, user], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: '备忘录不存在或无权限访问' });
    }
  });
});

// 添加新备忘录
app.post('/api/memos', (req, res) => {
  const { title, content, user } = req.body;
  const stmt = db.prepare('INSERT INTO memos (title, content, user) VALUES (?, ?, ?)');
  stmt.run([title, content, user || 'default'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// 更新备忘录
app.put('/api/memos/:id', (req, res) => {
  const { title, content, user } = req.body;
  const { id } = req.params;
  const stmt = db.prepare('UPDATE memos SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user = ?');
  stmt.run([title, content, id, user || 'default'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updated: this.changes });
  });
  stmt.finalize();
});

// 删除备忘录
app.delete('/api/memos/:id', (req, res) => {
  const user = req.query.user || 'default';
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM memos WHERE id = ? AND user = ?');
  stmt.run([id, user], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
  stmt.finalize();
});

// 清空所有备忘录
app.delete('/api/memos', (req, res) => {
  const user = req.query.user || 'default';
  db.run('DELETE FROM memos WHERE user = ?', [user], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// 搜索备忘录
app.get('/api/memos/search', (req, res) => {
  const user = req.query.user || 'default';
  const q = req.query.q || '';
  const query = `%${q}%`;
  db.all(`SELECT * FROM memos WHERE user = ? AND (title LIKE ? OR content LIKE ?) ORDER BY created_at DESC`, 
    [user, query, query], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器正在运行在 http://localhost:${PORT}`);
  console.log(`数据库路径: ${dbPath}`);
});

module.exports = app;