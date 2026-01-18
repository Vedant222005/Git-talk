import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api';
import Sidebar from './Sidebar';

const ChatInterface = ({ onLogout, user }) => {
    const { repoName } = useParams();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    // Load messages for current repo
    useEffect(() => {
        const loadHistory = async () => {
            try {
                // For now, we'll use localStorage to store chats per repo
                const allChats = JSON.parse(localStorage.getItem('repoChats') || '[]');
                const currentChat = allChats.find(chat => chat.repoName === repoName);

                if (currentChat) {
                    setMessages(currentChat.messages || []);
                } else {
                    setMessages([]);
                }
            } catch (err) {
                console.error('Failed to load history');
            }
        };
        loadHistory();
    }, [repoName]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
            timestamp: new Date().toISOString()
        };

        // Optimistic update
        setMessages(prev => [...prev, userMessage]);

        try {
            // Mock AI response for now
            const aiMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                text: `I analyzed the ${repoName} repository and here's what I found about: "${inputText}"\n\nThis is a mock response. In a real implementation, this would connect to your AI backend to analyze the actual codebase.`,
                timestamp: new Date().toISOString()
            };

            // Uncomment when backend is ready:
            // const { data } = await api.saveMessage(repoName, {
            //     userQuery: inputText,
            //     botAnswer: aiMessage.text
            // });

            setMessages(prev => [...prev, aiMessage]);

            // Save to localStorage
            saveChatToStorage([...messages, userMessage, aiMessage]);

            setInputText("");
        } catch (err) {
            console.error(err);
            alert('Failed to send message');
        }
    };

    const saveChatToStorage = (chatMessages) => {
        const allChats = JSON.parse(localStorage.getItem('repoChats') || '[]');
        const existingIndex = allChats.findIndex(chat => chat.repoName === repoName);

        const chatData = {
            repoName,
            messages: chatMessages,
            lastUpdated: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            allChats[existingIndex] = chatData;
        } else {
            allChats.push(chatData);
        }

        localStorage.setItem('repoChats', JSON.stringify(allChats));
        // Dispatch custom event to update sidebar
        window.dispatchEvent(new Event('chatUpdated'));
    };

    const loadChat = (selectedRepoName) => {
        navigate(`/chat/${selectedRepoName}`);
    };

    const goToDashboard = () => {
        navigate('/');
    };

    return (
        <div className="relative flex h-screen w-full flex-col md:flex-row overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar - With New Chat button in ChatInterface */}
            <Sidebar
                showNewChatButton={true}
                currentRepoName={repoName}
                onChatClick={loadChat}
                onNewChat={goToDashboard}
                onLogout={onLogout}
                user={user}
                isSidebarOpen={isSidebarOpen}
                onCloseSidebar={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative w-full md:w-auto min-w-0">
                <header className="flex items-center justify-between bg-background-light dark:bg-background-dark border-b border-zinc-border px-4 py-3 z-30 shrink-0">
                    <button className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden" onClick={toggleSidebar}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="flex flex-col items-center mx-auto md:mx-0 md:flex-row md:gap-4 justify-center md:items-baseline">
                        <h2 className="text-slate-900 dark:text-white text-sm font-bold leading-tight">{repoName}</h2>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-40">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">Start chatting about {repoName}</h3>
                                <p className="text-slate-500">Ask questions about the codebase and get AI-powered insights</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`size-8 shrink-0 rounded-lg flex items-center justify-center shadow-lg ${message.sender === 'user'
                                        ? 'bg-slate-700'
                                        : 'bg-primary shadow-primary/20'
                                    }`}>
                                    <span className="material-symbols-outlined text-white font-bold text-[18px]">
                                        {message.sender === 'user' ? 'person' : 'smart_toy'}
                                    </span>
                                </div>
                                <div className={`flex flex-col gap-2 max-w-[85%] ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                                        {message.sender === 'user' ? 'You' : 'RepoTalk AI'}
                                    </p>
                                    <div className={`text-[14px] leading-relaxed rounded-2xl px-4 py-3 font-medium shadow-lg whitespace-pre-wrap ${message.sender === 'user'
                                            ? 'bg-primary text-background-dark shadow-primary/10 rounded-tr-none'
                                            : 'bg-zinc-surface border border-zinc-border text-slate-100 shadow-sm rounded-tl-none'
                                        }`}>
                                        {message.text}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <div className="absolute bottom-0 inset-x-0 p-4 bg-background-dark/80 backdrop-blur-md border-t border-zinc-border z-40">
                    <div className="flex items-end gap-2 bg-zinc-surface rounded-2xl p-2 border border-zinc-border shadow-lg">
                        <textarea
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-200 py-2 resize-none max-h-32 placeholder:text-slate-500 focus:outline-none"
                            placeholder="Ask about the codebase..."
                            rows={1}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        />
                        <button className="size-10 rounded-xl bg-primary text-background-dark flex items-center justify-center shadow-lg hover:bg-primary-dark" onClick={handleSendMessage}>
                            <span className="material-symbols-outlined text-[20px] font-bold">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;