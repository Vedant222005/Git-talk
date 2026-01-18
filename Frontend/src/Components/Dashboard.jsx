import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = ({ onLogout, user }) => {
    const [githubUrl, setGithubUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleStartChat = () => {
        if (!githubUrl.trim()) return;

        // Extract repo name from URL (simple parsing)
        const urlParts = githubUrl.split('/');
        const repoName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];

        // Navigate to chat with repo param
        navigate(`/chat/${repoName}`);
    };

    const loadChat = (selectedRepoName) => {
        navigate(`/chat/${selectedRepoName}`);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="relative flex h-screen w-full flex-col md:flex-row overflow-hidden bg-[#0f0f12] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f0f12] to-black text-white font-display">
            {/* Sidebar - No New Chat button in Dashboard */}
            <Sidebar
                showNewChatButton={false}
                currentRepoName={null}
                onChatClick={loadChat}
                onLogout={onLogout}
                user={user}
                isSidebarOpen={isSidebarOpen}
                onCloseSidebar={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative w-full md:w-auto min-w-0">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
                    <button className="p-2 -ml-2 text-slate-300 md:hidden" onClick={toggleSidebar}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <h1 className="text-2xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:ml-0 ml-auto mr-auto md:mr-0">
                        RepoTalk
                    </h1>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm text-slate-400">Welcome, {user?.name || 'User'}</span>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                    <div className="w-full max-w-2xl">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent mb-4">
                                Analyze Your Codebase
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Paste a GitHub repository URL and start chatting with your code
                            </p>
                        </div>

                        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-2">
                                        GitHub Repository URL
                                    </label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username/repository"
                                        className="w-full p-4 bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleStartChat();
                                            }
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={handleStartChat}
                                    disabled={!githubUrl.trim() || isLoading}
                                    className="w-full bg-gradient-to-r from-primary to-emerald-400 hover:to-emerald-300 text-background-dark font-bold p-4 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Starting Chat...' : 'Start Chat'}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
