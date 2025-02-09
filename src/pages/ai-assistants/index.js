document.addEventListener('DOMContentLoaded', function() {
    console.log('AI助手页面加载完成');
    
    // 处理返回按钮
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('返回按钮被点击');
            window.history.back();
            console.log('已执行返回操作');
        });
    }

    // 处理助手卡片点击
    const assistantCards = document.querySelectorAll('.assistant-card');
    assistantCards.forEach(card => {
        card.addEventListener('click', function() {
            // 根据卡片类型跳转到不同的对话页面
            if (card.classList.contains('edu')) {
                console.log('点击了AI助手卡片:', '研修助手');
                console.log('准备跳转到研修助手聊天页面');
                window.location.href = '../chat/yanxiu/index.html';
            } else if (card.classList.contains('math')) {
                console.log('点击了AI助手卡片:', '数学专家');
                console.log('准备跳转到数学专家聊天页面');
                window.location.href = '../chat/yanxiu/math.html';
            } else if (card.classList.contains('moral')) {
                console.log('点击了AI助手卡片:', '德育专家');
                console.log('准备跳转到德育专家聊天页面');
                console.log('德育专家功能即将上线');
            }
        });
    });

    // 处理分享按钮
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            console.log('分享按钮被点击');
            // 分享功能（待实现）
            console.log('分享功能即将上线');
        });
    }
}); 