import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Sparkles,
    Image,
    Video,
    Music,
    Type,
    FileSpreadsheet,
    Monitor,
    Clock,
    Menu,
    X,
} from 'lucide-react';
import './MainContent.css';

const MainContent = () => {
    // UI state
    const [activeTab, setActiveTab] = useState('text-to-animation');
    const [prompt, setPrompt] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState('dashboard'); // dashboard | chat | designs
    const [designs, setDesigns] = useState([]);

    const messagesEndRef = useRef(null);

    // Scroll chat to bottom when new messages appear
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Load designs when user switches to the designs view
    useEffect(() => {
        if (view === 'designs') {
            fetch('/api/designs')
                .then((res) => res.json())
                .then(setDesigns)
                .catch((err) => console.error('Failed to load designs', err));
        }
    }, [view]);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        const userMsg = { role: 'user', content: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setPrompt('');
        setView('chat');
        setIsLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            const aiMsg = { role: 'ai', content: data.explanation, design: data };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (e) {
            console.error(e);
            setMessages((prev) => [...prev, { role: 'ai', content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const deleteDesign = async (id) => {
        await fetch(`/api/designs/${id}`, { method: 'DELETE' });
        setDesigns((prev) => prev.filter((d) => d.id !== id));
    };

    const updateDesign = async (id) => {
        const newPrompt = window.prompt('Enter new prompt for this design');
        if (!newPrompt) return;
        const res = await fetch(`/api/designs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: newPrompt }),
        });
        const updated = await res.json();
        setDesigns((prev) => prev.map((d) => (d.id === id ? updated : d)));
    };

    return (
        <main className="main-content">
            <header className="top-header">
                <div className="header-actions">
                    <button className="earn-btn">
                        <span className="icon">🎁</span> Earn $500
                    </button>
                    <button className="designs-btn" onClick={() => setView('designs')}>
                        <FileSpreadsheet size={16} /> My Designs
                    </button>
                    <div className="plan-badge">
                        Free plan • <a href="#">Upgrade</a>
                    </div>
                </div>
            </header>

            {view === 'dashboard' && (
                <>
                    <div className="hero-section">
                        <h1 className="hero-title">Your AI Motion Designer</h1>
                        <p className="hero-subtitle">Create awesome motion graphics by chatting with GELLA</p>
                    </div>

                    <div className="creation-container">
                        <div className="creation-options">
                            <div className="option-group">
                                <button className="option-btn">
                                    <Monitor size={16} /> Widescreen (16:9)
                                </button>
                                <button className="option-btn">
                                    <Clock size={16} /> Auto (max 60s)
                                </button>
                            </div>
                        </div>

                        <div className="input-card">
                            <div className="input-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'text-to-animation' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('text-to-animation')}
                                >
                                    <Menu size={16} /> Text to animation
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'image-reference' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('image-reference')}
                                >
                                    <Image size={16} /> Image reference
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'video-reference' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('video-reference')}
                                >
                                    <Video size={16} /> Video reference
                                </button>
                                <div className="brand-style-badge">
                                    <X size={12} /> No brand style
                                </div>
                            </div>

                            <div className="input-area">
                                <textarea
                                    placeholder="Create a bar chart animation showing..."
                                    rows="3"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="input-actions">
                                <div className="action-group">
                                    <button className="action-btn"><Image size={14} /> Image</button>
                                    <button className="action-btn"><Video size={14} /> Video</button>
                                    <button className="action-btn"><Music size={14} /> Audio</button>
                                    <button className="action-btn"><Type size={14} /> Font</button>
                                    <button className="action-btn"><FileSpreadsheet size={14} /> CSV</button>
                                </div>
                                <div className="submit-group">
                                    <button className="magic-btn" onClick={handleSubmit} disabled={isLoading}>
                                        <Sparkles size={20} />
                                    </button>
                                    <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <button className="quick-btn">
                                <FileSpreadsheet size={18} /> Infographics
                            </button>
                            <button className="quick-btn">
                                <Type size={18} /> Text animations
                            </button>
                            <button className="quick-btn">
                                <Monitor size={18} /> Social media
                            </button>
                            <button className="quick-btn">
                                <Video size={18} /> Ads
                            </button>
                        </div>
                    </div>
                </>
            )}

            {view === 'chat' && (
                <div className="chat-interface">
                    <div className="messages-list">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.role}`}>
                                <div className="message-avatar">{msg.role === 'user' ? 'You' : 'G'}</div>
                                <div className="message-content">
                                    <p>{msg.content}</p>
                                    {msg.design && (
                                        <div className="design-preview">
                                            <div className="preview-header">
                                                <span>Generated Design Preview</span>
                                                <span className="preview-specs">
                                                    {msg.design.specs.layout} • {msg.design.specs.color}
                                                </span>
                                            </div>
                                            <div className="preview-canvas">
                                                <h3 style={{ color: msg.design.specs.color }}>{msg.design.content}</h3>
                                                <div className="components-list">
                                                    {msg.design.specs.components.map((c, idx) => (
                                                        <div key={idx} className="component-item">{c}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message ai loading">
                                <div className="message-avatar">G</div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <div className="input-card compact">
                            <div className="input-area">
                                <textarea
                                    placeholder="Ask follow‑up..."
                                    rows="1"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="input-actions">
                                <div className="submit-group">
                                    <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'designs' && (
                <div className="designs-view">
                    <h2>My Designs</h2>
                    {designs.length === 0 && <p>No designs yet.</p>}
                    <ul className="designs-list">
                        {designs.map((d) => (
                            <li key={d.id} className="design-item">
                                <div className="design-info">
                                    <h4>{d.content}</h4>
                                    <p>{d.explanation}</p>
                                </div>
                                <div className="design-actions">
                                    <button onClick={() => updateDesign(d.id)} className="design-edit">Edit</button>
                                    <button onClick={() => deleteDesign(d.id)} className="design-delete">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
};

export default MainContent;
