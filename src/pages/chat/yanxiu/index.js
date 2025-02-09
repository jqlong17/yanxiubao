document.addEventListener('DOMContentLoaded', () => {
    console.log('研修助手对话页面加载完成');
    
    const API_KEY = 'app-GCEDQ8r97vMbRVMzW1RKy2Yf';
    const API_URL = 'https://api.dify.ai/v1';
    
    // 保存对话ID
    let conversationId = '';
    // 生成一个随机的用户ID
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    
    // 处理返回按钮点击
    const backBtn = document.querySelector('.back-btn');
    console.log('返回按钮元素:', backBtn);
    
    backBtn.addEventListener('click', () => {
        console.log('返回按钮被点击');
        window.history.back();
        console.log('已执行返回操作');
    });

    // 处理消息发送
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');
    const chatArea = document.querySelector('.chat-area');

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

        console.log('发送用户消息:', message);

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
        console.log('用户消息已添加到对话框');

        // 清空输入框
        messageInput.value = '';
        
        try {
            console.log('开始调用Dify API...');
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
                    inputs: {},
                    query: message,
                    conversation_id: conversationId,
                    response_mode: "streaming",
                    user: userId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API错误详情:', errorData);
                throw new Error(`API请求失败: ${errorData.message || '未知错误'}`);
            }

            console.log('API响应成功，开始处理流式响应');
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
                            console.log('收到数据块:', data);
                            
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
                                    console.log('更新对话ID:', conversationId);
                                }

                                // 滚动到底部
                                chatArea.scrollTop = chatArea.scrollHeight;
                            }
                        } catch (e) {
                            console.error('解析响应数据失败:', e, line);
                        }
                    }
                }
            }

            console.log('流式响应处理完成');

        } catch (error) {
            console.error('发送消息失败:', error);
            // 显示错误消息
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

    // 格式化消息，处理换行和Markdown
    function formatMessage(text) {
        console.log('格式化消息:', text);
        
        // 处理Markdown格式
        text = text
            // 处理标题
            .replace(/#{1,6} (.+)/g, '<strong>$1</strong>')
            // 处理无序列表
            .replace(/^\* (.+)/gm, '<li>$1</li>')
            .replace(/(?:^|\n)(\* .+\n?)+/g, '<ul>$&</ul>')
            // 处理有序列表
            .replace(/^\d+\. (.+)/gm, '<li>$1</li>')
            .replace(/(?:^|\n)(\d+\. .+\n?)+/g, '<ol>$&</ol>')
            // 处理粗体
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            // 处理斜体
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // 处理代码块
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // 处理行内代码
            .replace(/`(.+?)`/g, '<code>$1</code>')
            // 处理段落，保持换行
            .split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('');

        console.log('格式化后的消息:', text);
        return text;
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