/**
 * Day 25 - AI Chatbot Component
 * AI Web Integration
 */

class AIChatbot {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            throw new Error(`Container '${containerId}' not found.`);
        }

        this.options = {
            apiUrl: options.apiUrl || "/api/ai/chat",
            theme: options.theme || "light",
            position: options.position || "bottom-right",
            title: options.title || "AI Assistant",
            placeholder: options.placeholder || "Type your message...",
            welcomeMessage:
                options.welcomeMessage ||
                "Hello! How can I help you today?",
            maxHistory: options.maxHistory || 50,
            ...options
        };

        this.isOpen = false;
        this.isTyping = false;
        this.conversationHistory = [];

        this.chatbotContainer = null;
        this.messagesContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.toggleButton = null;

        this.init();
    }

    init() {
        this.createChatbotUI();
        this.bindEvents();
        this.loadConversationHistory();
    }

    createChatbotUI() {
        this.chatbotContainer = document.createElement("div");
        this.chatbotContainer.className = `ai-chatbot ${this.options.theme}`;

        this.chatbotContainer.style.cssText = `
            position:fixed;
            ${this.options.position.includes("bottom") ? "bottom:20px;" : "top:20px;"}
            ${this.options.position.includes("right") ? "right:20px;" : "left:20px;"}
            width:360px;
            height:520px;
            background:#ffffff;
            border-radius:14px;
            box-shadow:0 10px 35px rgba(0,0,0,.15);
            display:none;
            flex-direction:column;
            overflow:hidden;
            z-index:1000;
            font-family:Arial,sans-serif;
        `;

        this.createHeader();
        this.createMessagesContainer();
        this.createInputArea();
        this.createToggleButton();

        this.container.appendChild(this.chatbotContainer);
    }

    createHeader() {
        const header = document.createElement("div");

        header.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            background:#2563eb;
            color:white;
            padding:15px;
        `;

        const title = document.createElement("h3");
        title.textContent = this.options.title;
        title.style.margin = "0";

        const closeBtn = document.createElement("button");
        closeBtn.innerHTML = "&times;";

        closeBtn.style.cssText = `
            border:none;
            background:none;
            color:white;
            font-size:24px;
            cursor:pointer;
        `;

        closeBtn.onclick = () => this.toggle();

        header.appendChild(title);
        header.appendChild(closeBtn);

        this.chatbotContainer.appendChild(header);
    }

    createMessagesContainer() {
        this.messagesContainer = document.createElement("div");

        this.messagesContainer.style.cssText = `
            flex:1;
            padding:15px;
            display:flex;
            flex-direction:column;
            gap:10px;
            overflow-y:auto;
            background:#f8fafc;
        `;

        this.chatbotContainer.appendChild(this.messagesContainer);

        this.addMessage(this.options.welcomeMessage, "bot");
    }

    createInputArea() {
        const wrapper = document.createElement("div");

        wrapper.style.cssText = `
            display:flex;
            gap:10px;
            padding:15px;
            border-top:1px solid #e5e7eb;
            background:white;
        `;

        this.messageInput = document.createElement("input");

        this.messageInput.type = "text";
        this.messageInput.placeholder = this.options.placeholder;

        this.messageInput.style.cssText = `
            flex:1;
            padding:10px;
            border:1px solid #cbd5e1;
            border-radius:8px;
            outline:none;
        `;

        this.sendButton = document.createElement("button");

        this.sendButton.textContent = "Send";

        this.sendButton.style.cssText = `
            background:#2563eb;
            color:white;
            border:none;
            border-radius:8px;
            padding:10px 18px;
            cursor:pointer;
        `;

        wrapper.appendChild(this.messageInput);
        wrapper.appendChild(this.sendButton);

        this.chatbotContainer.appendChild(wrapper);
    }

    createToggleButton() {
        this.toggleButton = document.createElement("button");

        this.toggleButton.innerHTML = "💬";

        this.toggleButton.style.cssText = `
            position:fixed;
            ${this.options.position.includes("bottom") ? "bottom:20px;" : "top:20px;"}
            ${this.options.position.includes("right") ? "right:20px;" : "left:20px;"}
            width:60px;
            height:60px;
            border-radius:50%;
            border:none;
            background:#2563eb;
            color:white;
            font-size:24px;
            cursor:pointer;
            box-shadow:0 5px 15px rgba(0,0,0,.25);
            z-index:1001;
        `;

        this.container.appendChild(this.toggleButton);
    }

    bindEvents() {
        this.toggleButton.addEventListener("click", () => this.toggle());

        this.sendButton.addEventListener("click", () => this.sendMessage());

        this.messageInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.sendMessage();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;

        this.chatbotContainer.style.display =
            this.isOpen ? "flex" : "none";

        this.toggleButton.style.display =
            this.isOpen ? "none" : "block";

        if (this.isOpen) {
            this.messageInput.focus();
        }
    }
    async sendMessage() {
        const message = this.messageInput.value.trim();

        if (!message || this.isTyping) {
            return;
        }

        this.messageInput.value = "";

        this.addMessage(message, "user");

        this.showTypingIndicator();

        try {
            const response = await this.callAIAPI(message);

            this.hideTypingIndicator();

            this.addMessage(response, "bot");
        } catch (error) {
            console.error("AI Chatbot Error:", error);

            this.hideTypingIndicator();

            this.addMessage(
                "Sorry! Something went wrong while contacting the AI service.",
                "bot"
            );
        }
    }

    async callAIAPI(message) {
        const response = await fetch(this.options.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                conversation_history: this.conversationHistory
            })
        });
    
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.assistant) {
            return data.assistant;
        }
    
        if (data.response) {
            return data.response;
        }
    
        if (data.message) {
            return data.message;
        }
    
        return "No response received from AI.";
    }

    addMessage(content, sender) {
        const bubble = document.createElement("div");

        bubble.className = `chat-message ${sender}`;

        bubble.style.cssText = `
            max-width:80%;
            padding:10px 14px;
            border-radius:14px;
            word-break:break-word;
            line-height:1.5;
            font-size:14px;
            align-self:${sender === "user" ? "flex-end" : "flex-start"};
            background:${sender === "user" ? "#2563eb" : "#e5e7eb"};
            color:${sender === "user" ? "#ffffff" : "#111827"};
        `;

        bubble.textContent = content;

        this.messagesContainer.appendChild(bubble);

        this.messagesContainer.scrollTop =
            this.messagesContainer.scrollHeight;

        this.conversationHistory.push({
            role: sender === "user" ? "user" : "assistant",
            content,
            timestamp: new Date().toISOString()
        });

        if (
            this.conversationHistory.length >
            this.options.maxHistory
        ) {
            this.conversationHistory.shift();
        }

        this.saveConversationHistory();
    }

    showTypingIndicator() {
        this.isTyping = true;

        const typing = document.createElement("div");

        typing.className = "typing-indicator";

        typing.style.cssText = `
            background:#f3f4f6;
            padding:10px 14px;
            border-radius:12px;
            align-self:flex-start;
            display:flex;
            gap:4px;
        `;

        typing.innerHTML = `
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        `;

        this.messagesContainer.appendChild(typing);

        this.messagesContainer.scrollTop =
            this.messagesContainer.scrollHeight;

        if (!document.getElementById("typing-animation-style")) {
            const style = document.createElement("style");

            style.id = "typing-animation-style";

            style.textContent = `
                .typing-indicator .dot{
                    width:8px;
                    height:8px;
                    border-radius:50%;
                    background:#6b7280;
                    animation:typing 1.2s infinite;
                }

                .typing-indicator .dot:nth-child(2){
                    animation-delay:.2s;
                }

                .typing-indicator .dot:nth-child(3){
                    animation-delay:.4s;
                }

                @keyframes typing{
                    0%,80%,100%{
                        transform:scale(.5);
                        opacity:.5;
                    }
                    40%{
                        transform:scale(1);
                        opacity:1;
                    }
                }
            `;

            document.head.appendChild(style);
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;

        const typing =
            this.messagesContainer.querySelector(
                ".typing-indicator"
            );

        if (typing) {
            typing.remove();
        }
    }

    loadConversationHistory() {
        try {
            const history = localStorage.getItem(
                "ai_chatbot_history"
            );

            if (!history) {
                return;
            }

            this.conversationHistory = JSON.parse(history);

            this.messagesContainer.innerHTML = "";

            this.conversationHistory.forEach((msg) => {
                this.renderStoredMessage(msg);
            });
        } catch (error) {
            console.error(
                "Unable to load conversation history",
                error
            );
        }
    }

    renderStoredMessage(message) {
        const sender =
            message.role === "user" ? "user" : "bot";

        const bubble = document.createElement("div");

        bubble.className = `chat-message ${sender}`;

        bubble.style.cssText = `
            max-width:80%;
            padding:10px 14px;
            border-radius:14px;
            word-break:break-word;
            line-height:1.5;
            font-size:14px;
            align-self:${sender === "user" ? "flex-end" : "flex-start"};
            background:${sender === "user" ? "#2563eb" : "#e5e7eb"};
            color:${sender === "user" ? "#ffffff" : "#111827"};
        `;

        bubble.textContent = message.content;

        this.messagesContainer.appendChild(bubble);
    }

    saveConversationHistory() {
        localStorage.setItem(
            "ai_chatbot_history",
            JSON.stringify(this.conversationHistory)
        );
    }
    clearHistory() {
        this.conversationHistory = [];

        localStorage.removeItem("ai_chatbot_history");

        this.messagesContainer.innerHTML = "";

        this.addMessage(this.options.welcomeMessage, "bot");
    }

    setTheme(theme) {
        this.options.theme = theme;

        this.chatbotContainer.classList.remove("light", "dark");

        this.chatbotContainer.classList.add(theme);
    }

    open() {
        if (!this.isOpen) {
            this.toggle();
        }
    }

    close() {
        if (this.isOpen) {
            this.toggle();
        }
    }

    destroy() {
        if (this.chatbotContainer) {
            this.chatbotContainer.remove();
        }

        if (this.toggleButton) {
            this.toggleButton.remove();
        }

        this.conversationHistory = [];
    }

    getHistory() {
        return [...this.conversationHistory];
    }

    exportHistory() {
        return JSON.stringify(this.conversationHistory, null, 2);
    }

    importHistory(history) {
        try {
            if (typeof history === "string") {
                history = JSON.parse(history);
            }

            if (!Array.isArray(history)) {
                return;
            }

            this.conversationHistory = history;

            this.messagesContainer.innerHTML = "";

            history.forEach((message) => {
                this.renderStoredMessage(message);
            });

            this.saveConversationHistory();
        } catch (error) {
            console.error("Failed to import history:", error);
        }
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.getElementById("chatbot-container");

//     if (!container) {
//         return;
//     }

//     window.aiChatbot = new AIChatbot("chatbot-container", {
//         apiUrl: "/api/ai/chat",
//         theme: "light",
//         position: "bottom-right",
//         title: "AI Assistant"
//     });
// });

if (typeof module !== "undefined" && module.exports) {
    module.exports = AIChatbot;
}

if (typeof window !== "undefined") {
    window.AIChatbot = AIChatbot;
}