import React, { useState } from 'react';
import { NavLink, Home, Library, Image, Video, Workflow, Shuffle, Layers, Sparkles, Frame, ArrowUpCircle, GraduationCap, ChevronDown } from 'lucide-react';
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
                <div className="profile-header" onClick={() => setIsProfileOpen(!isProfileOpen)}>
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
                <NavLink to="/" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
                    <Home size={18} />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/library" className="nav-item">
                    <Library size={18} />
                    <span>Library</span>
                </NavLink>
                <NavLink to="/image" className="nav-item">
                    <Image size={18} />
                    <span>Image</span>
                </NavLink>
                <NavLink to="/video" className="nav-item">
                    <Video size={18} />
                    <span>Video</span>
                </NavLink>
                <NavLink to="/blueprints" className="nav-item">
                    <Workflow size={18} />
                    <span>Blueprints</span>
                    <span className="beta-badge">Beta</span>
                </NavLink>
                <NavLink to="/flow-state" className="nav-item">
                    <Shuffle size={18} />
                    <span>Flow State</span>
                </NavLink>
                <NavLink to="/realtime-canvas" className="nav-item">
                    <Layers size={18} />
                    <span>Realtime Canvas</span>
                </NavLink>
                <NavLink to="/realtime-generation" className="nav-item">
                    <Sparkles size={18} />
                    <span>Realtime Generation</span>
                </NavLink>
                <NavLink to="/canvas-editor" className="nav-item">
                    <Frame size={18} />
                    <span>Canvas Editor</span>
                </NavLink>
                <NavLink to="/upscaler" className="nav-item">
                    <ArrowUpCircle size={18} />
                    <span>Universal Upscaler</span>
                </NavLink>
                <NavLink to="/marketplace" className="nav-item">
                    <Image size={18} />
                    <span>Marketplace</span>
                </NavLink>
                <NavLink to="/preview" className="nav-item">
                    <Frame size={18} />
                    <span>Preview</span>
                </NavLink>
                <NavLink to="/admin/products/create" className="nav-item">
                    <Workflow size={18} />
                    <span>Create Product</span>
                </NavLink>
                <div className="nav-section">
                    <div className="section-header">ADVANCED</div>
                    <NavLink to="/models-training" className="nav-item">
                        <GraduationCap size={18} />
                        <span>Models & Training</span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
