class MemoManager {
  constructor() {
    this.apiBase = '/api/memos';
    this.currentUser = 'default'; // 默认用户，实际应用中应该从登录系统获取
    this.currentEditingId = null;
    this.memos = [];
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.loadMemos();
    this.updateEmptyState();
  }

  bindEvents() {
    // 绑定按钮事件
    document.getElementById('addMemoBtn').addEventListener('click', () => this.showInputSection());
    document.getElementById('saveMemoBtn').addEventListener('click', () => this.saveMemo());
    document.getElementById('cancelMemoBtn').addEventListener('click', () => this.hideInputSection());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAllMemos());
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => this.debounceSearch(e.target.value));
    
    // 排序功能
    document.getElementById('sortSelect').addEventListener('change', () => this.sortMemos());
    
    // 模态框事件
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modalCancel').addEventListener('click', () => this.closeModal());
    document.getElementById('modalConfirm').addEventListener('click', () => this.handleModalConfirm());
  }

  showInputSection(editingMemo = null) {
    const inputSection = document.getElementById('memoInputSection');
    const titleInput = document.getElementById('memoTitle');
    const contentInput = document.getElementById('memoContent');
    
    if (editingMemo) {
      this.currentEditingId = editingMemo.id;
      titleInput.value = editingMemo.title;
      contentInput.value = editingMemo.content;
      document.getElementById('saveMemoBtn').innerHTML = '<i class="fas fa-save"></i> 更新';
    } else {
      this.currentEditingId = null;
      titleInput.value = '';
      contentInput.value = '';
      document.getElementById('saveMemoBtn').innerHTML = '<i class="fas fa-save"></i> 保存';
    }
    
    inputSection.style.display = 'block';
    titleInput.focus();
  }

  hideInputSection() {
    document.getElementById('memoInputSection').style.display = 'none';
    this.currentEditingId = null;
  }

  async saveMemo() {
    const titleInput = document.getElementById('memoTitle');
    const contentInput = document.getElementById('memoContent');
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title) {
      this.showNotification('请输入备忘录标题', 'warning');
      return;
    }
    
    try {
      if (this.currentEditingId) {
        // 更新现有备忘录
        const response = await fetch(`${this.apiBase}/${this.currentEditingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content, user: this.currentUser })
        });
        
        if (response.ok) {
          this.showNotification('备忘录更新成功', 'success');
          this.hideInputSection();
          await this.loadMemos();
        } else {
          throw new Error('更新备忘录失败');
        }
      } else {
        // 创建新备忘录
        const response = await fetch(this.apiBase, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content, user: this.currentUser })
        });
        
        if (response.ok) {
          this.showNotification('备忘录创建成功', 'success');
          this.hideInputSection();
          await this.loadMemos();
        } else {
          throw new Error('创建备忘录失败');
        }
      }
    } catch (error) {
      this.showNotification(`操作失败: ${error.message}`, 'error');
    }
  }

  async loadMemos() {
    try {
      const response = await fetch(`${this.apiBase}?user=${this.currentUser}`);
      if (response.ok) {
        this.memos = await response.json();
        this.renderMemos();
        this.updateEmptyState();
      } else {
        throw new Error('加载备忘录失败');
      }
    } catch (error) {
      this.showNotification(`加载备忘录失败: ${error.message}`, 'error');
    }
  }

  async deleteMemo(id) {
    try {
      const response = await fetch(`${this.apiBase}/${id}?user=${this.currentUser}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        this.showNotification('备忘录删除成功', 'success');
        await this.loadMemos();
      } else {
        throw new Error('删除备忘录失败');
      }
    } catch (error) {
      this.showNotification(`删除失败: ${error.message}`, 'error');
    }
  }

  async clearAllMemos() {
    this.openModal('确定要删除所有备忘录吗？此操作无法撤销。', async () => {
      try {
        const response = await fetch(`${this.apiBase}?user=${this.currentUser}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          this.showNotification('所有备忘录已清空', 'success');
          await this.loadMemos();
        } else {
          throw new Error('清空备忘录失败');
        }
      } catch (error) {
        this.showNotification(`清空失败: ${error.message}`, 'error');
      }
    });
  }

  async searchMemos(query = '') {
    if (!query.trim()) {
      await this.loadMemos();
      return;
    }
    
    try {
      const response = await fetch(`/api/memos/search?user=${this.currentUser}&q=${encodeURIComponent(query)}`);
      if (response.ok) {
        this.memos = await response.json();
        this.renderMemos();
        this.updateEmptyState();
      } else {
        throw new Error('搜索备忘录失败');
      }
    } catch (error) {
      this.showNotification(`搜索失败: ${error.message}`, 'error');
    }
  }

  sortMemos() {
    const sortBy = document.getElementById('sortSelect').value;
    
    switch (sortBy) {
      case 'newest':
        this.memos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        this.memos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'title':
        this.memos.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    this.renderMemos();
  }

  renderMemos() {
    const memoGrid = document.getElementById('memoGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (this.memos.length === 0) {
      emptyState.style.display = 'block';
      memoGrid.innerHTML = '';
      memoGrid.appendChild(emptyState);
      return;
    }
    
    emptyState.style.display = 'none';
    memoGrid.innerHTML = '';
    
    this.memos.forEach(memo => {
      const memoCard = this.createMemoCard(memo);
      memoGrid.appendChild(memoCard);
    });
  }

  createMemoCard(memo) {
    const card = document.createElement('div');
    card.className = 'memo-card';
    card.innerHTML = `
      <div class="memo-header">
        <h3 class="memo-title">${this.escapeHtml(memo.title)}</h3>
      </div>
      <div class="memo-content">${this.escapeHtml(memo.content)}</div>
      <div class="memo-footer">
        <span>${this.formatDate(memo.created_at)}</span>
        <div class="memo-actions">
          <button class="edit-btn" onclick='memoManager.showInputSection(${JSON.stringify(memo)})'>
            <i class="fas fa-edit"></i> 编辑
          </button>
          <button class="delete-btn" onclick='memoManager.deleteMemo(${memo.id})'>
            <i class="fas fa-trash"></i> 删除
          </button>
        </div>
      </div>
    `;
    return card;
  }

  updateEmptyState() {
    const emptyState = document.getElementById('emptyState');
    if (this.memos.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
    }
  }

  openModal(message, confirmCallback) {
    this.modalConfirmCallback = confirmCallback;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').style.display = 'block';
  }

  closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    this.modalConfirmCallback = null;
  }

  handleModalConfirm() {
    if (this.modalConfirmCallback) {
      this.modalConfirmCallback();
    }
    this.closeModal();
  }

  showNotification(message, type = 'info') {
    // 移除现有的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .notification-info {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }
      
      .notification-success {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }
      
      .notification-warning {
        background: linear-gradient(135deg, #ed8936, #dd6b20);
      }
      
      .notification-error {
        background: linear-gradient(135deg, #f56565, #e53e3e);
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除通知
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  getNotificationIcon(type) {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'error':
        return 'fas fa-exclamation-circle';
      default:
        return 'fas fa-info-circle';
    }
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '今天';
    } else if (diffDays === 2) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  }

  debounceSearch(query) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchMemos(query);
    }, 300);
  }
}

// 初始化应用
const memoManager = new MemoManager();

// 检查用户登录状态
function checkUserLogin() {
  // 从 localStorage 获取当前用户
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    return currentUser;
  }
  // 如果没有登录，重定向到欢迎页面
  window.location.href = 'welcome.html';
  return null;
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  // 设置当前用户
  memoManager.currentUser = checkUserLogin();
  
  // 初始化备忘录管理器
  memoManager.init();
  
  // 设置侧边栏事件监听器
  setupSidebarEventListeners();
});

function setupSidebarEventListeners() {
  // 等待 DOM 元素完全加载
  setTimeout(() => {
    // 侧边栏导航项点击事件
    const navItems = document.querySelectorAll('.nav-item');
    
    // 新建备忘录按钮事件
    const newMemoBtn = document.getElementById('new-memo-btn');
    if (newMemoBtn) {
      newMemoBtn.addEventListener('click', function() {
        // 跳转到新建备忘录页面
        window.location.href = 'edit.html';
      });
    }
    
    navItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 移除所有活动状态
        navItems.forEach(navItem => navItem.classList.remove('active'));
        
        // 添加当前活动状态
        this.classList.add('active');
        
        // 根据点击的导航项执行相应操作
        const section = this.getAttribute('data-section');
        
        switch(section) {
          case 'dashboard':
            // 仪表板功能 - 显示主页面
            window.location.href = 'dashboard.html';
            break;
          case 'memos':
            // 我的备忘录功能 - 显示所有备忘录列表
            document.querySelector('.memo-grid').style.display = 'grid';
            document.querySelector('.recent-memos-section').style.display = 'none';
            break;
          case 'recent':
            // 最近备忘录功能 - 显示最近备忘录区域
            document.querySelector('.memo-grid').style.display = 'none';
            document.querySelector('.recent-memos-section').style.display = 'block';
            // 加载最近备忘录
            loadRecentMemos();
            break;
          case 'profile':
            // 个人资料功能
            alert('个人资料功能尚未实现');
            break;
          case 'settings':
            // 设置功能
            alert('设置功能尚未实现');
            break;
          case 'logout':
            // 登出功能
            const logoutConfirmed = confirm('确定要登出吗？');
            if (logoutConfirmed) {
              // 执行登出逻辑
              localStorage.removeItem('currentUser');
              window.location.href = 'welcome.html';
            }
            break;
        }
      });
    });
  }, 100); // 延迟100毫秒确保 DOM 更新完成
}

// 加载最近备忘录列表
function loadRecentMemos() {
  // 从 localStorage 获取当前用户
  const currentUser = localStorage.getItem('currentUser') || 'default';
  
  // 从 API 获取最近备忘录
  fetch(`/api/memos?user=${currentUser}&limit=5`)
    .then(response => response.json())
    .then(memos => {
      const recentMemosContainer = document.getElementById('recent-memos-container');
      if (!recentMemosContainer) return;
      
      recentMemosContainer.innerHTML = '';
      
      if (memos.length === 0) {
        recentMemosContainer.innerHTML = '<div class="empty-recent-memos">暂无最近备忘录</div>';
        return;
      }
      
      // 按时间倒序显示最近备忘录
      const sortedMemos = memos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      sortedMemos.forEach(memo => {
        const memoItem = document.createElement('div');
        memoItem.className = 'recent-memo-item';
        memoItem.innerHTML = `
          <div class="recent-memo-title">${escapeHtml(memo.title)}</div>
          <div class="recent-memo-preview">${escapeHtml(memo.content.substring(0, 50))}${memo.content.length > 50 ? '...' : ''}</div>
          <div class="recent-memo-time">${formatDate(memo.created_at)}</div>
        `;
        
        memoItem.addEventListener('click', () => {
          // 点击备忘录项跳转到编辑页面
          window.location.href = `edit.html?id=${memo.id}`;
        });
        
        recentMemosContainer.appendChild(memoItem);
      });
    })
    .catch(error => {
      console.error('加载最近备忘录失败:', error);
      const recentMemosContainer = document.getElementById('recent-memos-container');
      if (recentMemosContainer) {
        recentMemosContainer.innerHTML = '<div class="error-message">加载最近备忘录失败</div>';
      }
    });
}



// 随机提示功能
function getRandomTip() {
  const tips = [
    "使用搜索功能快速找到你需要的备忘录",
    "点击备忘录右上角的编辑按钮可以修改内容",
    "按标题排序可以更方便地组织你的备忘录",
    "记得定期清理不需要的备忘录以保持整洁"
  ];
  return tips[Math.floor(Math.random() * tips.length)];
}

// 页面加载完成后显示随机提示
document.addEventListener('DOMContentLoaded', () => {
  console.log('提示:', getRandomTip());
});