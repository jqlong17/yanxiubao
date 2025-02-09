document.addEventListener('DOMContentLoaded', function() {
    // 处理标签页切换和子菜单显示
    const tabItems = document.querySelectorAll('.tab-item');
    
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 移除其他tab的active状态和子菜单
            tabItems.forEach(tab => {
                if(tab !== this) {
                    tab.classList.remove('active', 'show-submenu');
                }
            });
            
            // 切换当前tab的active状态和子菜单显示状态
            this.classList.add('active');
            this.classList.toggle('show-submenu');
            
            // 阻止事件冒泡
            e.stopPropagation();
        });
    });
    
    // 点击页面其他地方关闭子菜单
    document.addEventListener('click', function() {
        tabItems.forEach(tab => {
            tab.classList.remove('show-submenu');
        });
    });
    
    // 处理子菜单项点击
    const submenuItems = document.querySelectorAll('.submenu-item');
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            const itemText = this.textContent;
            
            // 根据点击的子菜单项执行相应操作
            switch(itemText) {
                case '研修AI助手':
                    window.location.href = 'src/pages/ai-assistants/index.html';
                    break;
                case 'APP下载':
                    // 处理APP下载
                    console.log('打开APP下载页面');
                    break;
                case '小程序':
                    // 处理小程序
                    console.log('打开小程序二维码');
                    break;
                case '公司官网':
                    // 跳转到公司官网
                    console.log('跳转到公司官网');
                    break;
                default:
                    console.log('点击了:', itemText);
            }
        });
    });

    // 处理返回按钮
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
}); 