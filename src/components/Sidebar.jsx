import React, { useState } from 'react';
import {
    Home,
    Library,
    Image,
    Video,
    Workflow,
    Shuffle,
    Layers,
    Sparkles,
    Frame,
    ArrowUpCircle,
    GraduationCap,
    ChevronDown,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">GELLA</span>
            </div>

            {/* User Profile */}
            <div className="user-profile">
                <div
                    className="profile-header"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <div className="profile-avatar">T</div>
                    <div className="profile-info">
                        <span className="profile-name">Terix</span>
                        <ChevronDown size={14} className="profile-dropdown-icon" />
                    </div>
                </div>
                <div className="credits-section">
                    <div className="credits-badge">
                        <Sparkles size={12} />
                        <span>110</span>
                    </div>
                    <button className="upgrade-btn">Upgrade</button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {/* Simple Items */}
                <a href="#" className="nav-item active">
                    <Home size={18} />
                    <span>Home</span>
                </a>
                <a href="#" className="nav-item">
                    <Library size={18} />
                    <span>Library</span>
                </a>

                {/* AI Tools Section */}
                <div className="nav-section">
                    <div className="section-header">AI TOOLS</div>
                    <a href="#" className="nav-item">
                        <Image size={18} />
                        <span>Image</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Video size={18} />
                        <span>Video</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Workflow size={18} />
                        <span>Blueprints</span>
                        <span className="beta-badge">Beta</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Shuffle size={18} />
                        <span>Flow State</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Layers size={18} />
                        <span>Realtime Canvas</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Sparkles size={18} />
                        <span>Realtime Generation</span>
                    </a>
                    <a href="#" className="nav-item">
                        <Frame size={18} />
                        <span>Canvas Editor</span>
                    </a>
                    <a href="#" className="nav-item">
                        <ArrowUpCircle size={18} />
                        <span>Universal Upscaler</span>
                    </a>
                </div>

                {/* Advanced Section */}
                <div className="nav-section">
                    <div className="section-header">ADVANCED</div>
                    <a href="#" className="nav-item">
                        <GraduationCap size={18} />
                        <span>Models & Training</span>
                    </a>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
