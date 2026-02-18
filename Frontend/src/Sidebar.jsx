import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import server from "./environment.js";

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    const authHeader = () => ({
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    });

    const handle401 = (status) => {
        if (status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return true;
        }
        return false;
    };

    const getAllThreads = async () => {
        try {
            const response = await fetch(`${server}/api/thread`, {
                headers: authHeader()
            });
            if (handle401(response.status)) return;
            const res = await response.json();
            const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredData);
        } catch (err) {
            console.log(err);
        }
    };

    const getCurrentUser = async () => {
        try {
            const response = await fetch(`${server}/api/auth/me`, {
                headers: authHeader()
            });
            if (handle401(response.status)) return;
            const user = await response.json();
            setCurrentUser(user);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
        getCurrentUser();
    }, []);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`${server}/api/thread/${newThreadId}`, {
                headers: authHeader()
            });
            if (handle401(response.status)) return;
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${server}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: authHeader()
            });
            if (handle401(response.status)) return;
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getInitial = () => {
        return currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U";
    };

    return (
        <section className="sidebar">
            <div className="sidebar-header">
                <div className="logo-row">
                    <div className="gem-star">
                        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%"   stopColor="#8ab4f8" />
                                    <stop offset="33%"  stopColor="#c58af9" />
                                    <stop offset="66%"  stopColor="#f8a8c8" />
                                    <stop offset="100%" stopColor="#fdd663" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M18 3 C18 3 19.5 13 26 18 C19.5 23 18 33 18 33 C18 33 16.5 23 10 18 C16.5 13 18 3 18 3Z"
                                fill="url(#gemGrad)"
                            />
                        </svg>
                    </div>
                    <span className="logo-text">AskNova</span>
                </div>

                <div className="header-actions">
                    <ThemeToggle />
                    <button className="new-chat-btn" onClick={createNewChat}>
                        <span className="new-chat-icon">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5"  y1="12" x2="19" y2="12" />
                            </svg>
                        </span>
                        New chat
                    </button>
                </div>
            </div>

            <div className="sidebar-nav">
                {allThreads?.length > 0 && <p className="nav-label">Recent</p>}

                <ul className="history">
                    {allThreads?.map((thread, idx) => (
                        <li
                            key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={`chat-item${thread.threadId === currThreadId ? " active" : ""}`}
                        >
                            <svg className="chat-item-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                            </svg>
                            <span className="chat-item-title">{thread.title}</span>
                            <button
                                className="delete-btn"
                                title="Delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>

                {allThreads?.length === 0 && (
                    <p className="nav-empty">Your conversations will appear here.</p>
                )}
            </div>

            <div className="sidebar-footer">
                <div className="model-row">
                    <div className="model-gem">✦</div>
                    <div className="model-label">
                        <div className="model-name">AskNova 1.5 Pro</div>
                        <div className="model-sub">Latest model</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>

                <div className="sign">
                    <div className="user-avatar">{getInitial()}</div>
                    <div>
                        <div className="user-name">{currentUser?.name || "Loading..."}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Sidebar;