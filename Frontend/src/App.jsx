import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import * as api from './api';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import ChatInterface from './Components/ChatInterface';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app with cookies, we'd hit an endpoint like /api/auth/me to validate the cookie session
        // For now, let's just assume we need to login if 'user' state is null.
        // Or we could have /api/auth/profile to restore user data.
        // Let's implement a quick check if possible, or just default to login for this MVP since cookies survive refresh but React state doesn't.
        // ideally: api.getProfile().then(u => setUser(u)).catch(() => setUser(null))
        setLoading(false);
    }, []);

    const handleLogout = async () => {
        await api.logout();
        setUser(null);
    };

    if (loading) return <div className="h-screen bg-background-dark flex items-center justify-center text-white">Loading...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Dashboard onLogout={handleLogout} user={user} /> : <Navigate to="/login" />} />
                <Route path="/chat/:repoName" element={user ? <ChatInterface onLogout={handleLogout} user={user} /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
