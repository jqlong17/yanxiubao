document.addEventListener('DOMContentLoaded', () => {
    console.log('数学教学专家对话页面加载完成');
    
    const API_KEY = 'app-GCEDQ8r97vMbRVMzW1RKy2Yf';
    const API_URL = 'https://api.dify.ai/v1';
    
    // 保存对话ID
    let conversationId = '';
    // 生成一个随机的用户ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    // 处理返回按钮点击
    const backBtn = document.querySelector('.back-btn');
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatArea = document.querySelector('.chat-area');

    backBtn.addEventListener('click', () => {
        window.history.back();
    });

    // 处理分享按钮点击
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            try {
                // 获取当前页面URL
                const url = window.location.href;
                await navigator.clipboard.writeText(url);
                
                // 显示复制成功提示
                showToast('链接已复制到剪贴板');
            } catch (err) {
                console.error('复制失败:', err);
                showToast('复制失败，请重试');
            }
        });
    }

    // 显示提示信息
    function showToast(message) {
        // 创建或获取 toast 元素
        let toast = document.querySelector('.copy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            document.body.appendChild(toast);
        }
        
        // 设置消息并显示
        toast.textContent = message;
        toast.classList.add('show');
        
        // 2秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // 添加用户消息
        const userMessageHtml = `
            <div class="message-item user">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="avatar"></div>
            </div>
        `;
        chatArea.insertAdjacentHTML('beforeend', userMessageHtml);
        messageInput.value = '';
        
        try {
            // 创建助手消息容器
            const messageHtml = `
                <div class="message-item">
                    <div class="avatar"></div>
                    <div class="message-content">
                        <div class="assistant-response"></div>
                    </div>
                </div>
            `;
            chatArea.insertAdjacentHTML('beforeend', messageHtml);
            const responseElement = chatArea.lastElementChild.querySelector('.assistant-response');
            
            // 开始流式响应
            const response = await fetch(`${API_URL}/chat-messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: {
                        role: "数学教学专家",
                        expertise: "数学教育",
                        background: "具有丰富的数学教学经验，精通数学教育理论和实践"
                    },
                    query: message,
                    conversation_id: conversationId,
                    response_mode: "streaming",
                    user: userId
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            let currentParagraph = document.createElement('p');
            responseElement.appendChild(currentParagraph);

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                const chunk = new TextDecoder().decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        try {
                            const data = JSON.parse(line.slice(5));
                            
                            if (data.event === 'message') {
                                // 处理新的文本
                                const newContent = data.answer;
                                
                                // 检查是否需要创建新段落
                                if (newContent.includes('\n')) {
                                    const parts = newContent.split('\n');
                                    parts.forEach((part, index) => {
                                        if (part.trim()) {
                                            if (index > 0) {
                                                currentParagraph = document.createElement('p');
                                                responseElement.appendChild(currentParagraph);
                                            }
                                            currentParagraph.textContent += part;
                                        }
                                    });
                                } else {
                                    currentParagraph.textContent += newContent;
                                }

                                // 保存对话ID
                                if (data.conversation_id) {
                                    conversationId = data.conversation_id;
                                }

                                // 滚动到底部
                                chatArea.scrollTop = chatArea.scrollHeight;
                            }
                        } catch (e) {
                            console.error('解析响应数据失败:', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('发送消息失败:', error);
            const errorMessageHtml = `
                <div class="message-item">
                    <div class="avatar"></div>
                    <div class="message-content">
                        <p class="error">抱歉，发生了一些错误，请稍后再试。</p>
                    </div>
                </div>
            `;
            chatArea.insertAdjacentHTML('beforeend', errorMessageHtml);
        }
    }

    // 发送按钮点击事件
    sendBtn.addEventListener('click', sendMessage);

    // 输入框回车事件
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 