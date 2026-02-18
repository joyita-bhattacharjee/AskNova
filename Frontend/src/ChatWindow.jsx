import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import server from "./environment.js";

const MODELS = ["1.5 Pro", "1.5 Flash", "1.0 Ultra"];

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState("1.5 Pro");
    const navigate = useNavigate();

    const profileRef = useRef(null);
    const modelRef   = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setIsOpen(false);
            if (modelRef.current   && !modelRef.current.contains(e.target))   setModelOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ── Auth helpers ──
    const authHeader = () => ({
        "Content-Type": "application/json",
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

    // ── Send message to backend ──
    const getReply = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setNewChat(false);

        try {
            const response = await fetch(`${server}/api/chat`, {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify({message: prompt, threadId: currThreadId})
            });

            if (handle401(response.status)) return;

            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    };

    // Append user + assistant messages to prevChats after reply arrives
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => ([
                ...prevChats,
                {role: "user",      content: prompt},
                {role: "assistant", content: reply }
            ]));
        }
        setPrompt("");
    }, [reply]);

    // Log out
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="chatWindow">

            {/* ── Topbar ── */}
            <div className="navbar">
                <div className="navbar-left">
                    <span className="navbar-title">AskNova</span>

                    {/* Model version dropdown */}
                    <div className="model-chip-wrap" ref={modelRef}>
                        <button
                            className={`model-chip${modelOpen ? " active" : ""}`}
                            onClick={() => setModelOpen(o => !o)}
                        >
                            <svg width="8" height="8" viewBox="0 0 36 36" fill="none">
                                <defs>
                                    <linearGradient id="nc" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#8ab4f8"/>
                                        <stop offset="100%" stopColor="#c58af9"/>
                                    </linearGradient>
                                </defs>
                                <path d="M18 3C18 3 19.5 13 26 18C19.5 23 18 33 18 33C18 33 16.5 23 10 18C16.5 13 18 3 18 3Z" fill="url(#nc)"/>
                            </svg>
                            {selectedModel}
                            <i className={`fa-solid fa-chevron-down chip-arrow${modelOpen ? " rotated" : ""}`}></i>
                        </button>

                        {modelOpen && (
                            <div className="model-dropdown">
                                {MODELS.map(m => (
                                    <button
                                        key={m}
                                        className={`model-option${m === selectedModel ? " selected" : ""}`}
                                        onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 36 36" fill="none">
                                            <defs>
                                                <linearGradient id={`mg-${m}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#8ab4f8"/>
                                                    <stop offset="100%" stopColor="#c58af9"/>
                                                </linearGradient>
                                            </defs>
                                            <path d="M18 3C18 3 19.5 13 26 18C19.5 23 18 33 18 33C18 33 16.5 23 10 18C16.5 13 18 3 18 3Z" fill={`url(#mg-${m})`}/>
                                        </svg>
                                        AskNova {m}
                                        {m === selectedModel && (
                                            <svg className="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gem-1)" strokeWidth="2.5">
                                                <polyline points="20 6 9 17 4 12"/>
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="navbar-right">
                    <button className="icon-btn" title="Share">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                    </button>

                    {/* Profile + dropdown */}
                    <div className="profile-wrap" ref={profileRef}>
                        <div className="userIconDiv" onClick={() => setIsOpen(o => !o)}>
                            <span className="userIcon">
                                <i className="fa-solid fa-user"></i>
                            </span>
                        </div>

                        {isOpen && (
                            <div className="dropDown">
                                <div className="dropDownItem">
                                    <i className="fa-solid fa-gear"></i> Settings
                                </div>
                                <div className="dropDownItem">
                                    <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                                </div>
                                <div className="dropDownItem logout" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Messages (scrollable) ── */}
            <div className="chatScroll">
                <Chat />
            </div>

            {/* ── Loading indicator ── */}
            {loading && (
                <div className="loaderWrap">
                    <div className="typing-dots">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            )}

            {/* ── Input area ── */}
            <div className="chatInput">
                <div className="inputBox">
                    <div className="input-top">
                        <input
                            placeholder="Ask AskNova anything…"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" ? getReply() : ""}
                        />
                        <button id="submit" onClick={getReply} title="Send">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>

                    <div className="input-bottom">
                        <button className="tool-icon-btn" title="Attach">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
                            </svg>
                        </button>
                        <button className="tool-icon-btn" title="Image">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="3" width="18" height="18" rx="3"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                        </button>
                        <button className="tool-text-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            Search
                        </button>
                        <button className="tool-text-btn">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 18 22 12 16 6"/>
                                <polyline points="8 6 2 12 8 18"/>
                            </svg>
                            Code
                        </button>
                        <div className="input-spacer"></div>
                    </div>
                </div>

                <p className="info">
                    AskNova may display inaccurate info. Always double-check important responses.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;