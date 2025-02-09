document.addEventListener('DOMContentLoaded', () => {
    console.log('AI助手页面加载完成');
    
    // 处理返回按钮点击
    const backBtn = document.querySelector('.back-btn');
    console.log('返回按钮元素:', backBtn);
    
    backBtn.addEventListener('click', () => {
        console.log('返回按钮被点击');
        window.history.back();
        console.log('已执行返回操作');
    });

    // 处理分享按钮点击
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        console.log('分享按钮被点击');
        // TODO: 实现分享功能
        alert('分享功能开发中');
    });

    // 处理AI助手卡片点击
    document.querySelectorAll('.assistant-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const assistantName = e.currentTarget.querySelector('.assistant-name').textContent;
            console.log('点击了AI助手卡片:', assistantName);
            
            // 使用相对路径进行跳转
            if (assistantName === '研修助手') {
                console.log('准备跳转到研修助手聊天页面');
                window.location.href = '../chat/yanxiu/index.html';  // 修改为相对路径
            } else if (assistantName === '数学专家') {
                console.log('准备跳转到数学专家聊天页面');
                window.location.href = '../chat/math/index.html';    // 修改为相对路径
            } else if (assistantName === '德育专家') {
                console.log('准备跳转到德育专家聊天页面');
                window.location.href = '../chat/moral/index.html';   // 修改为相对路径
            }
        });
    });
}); 