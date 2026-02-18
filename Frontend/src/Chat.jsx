import "./Chat.css";
import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null); // prevChat load
            return;
        }

        if (!prevChats?.length) return;

        const content = reply.split(" "); // individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    return (
        <>
            {/* ── Welcome screen ── */}
            {newChat && (
                <div className="welcome-screen">
                    <div className="welcome-heading">
                        <div className="welcome-star">
                            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%"   stopColor="#8ab4f8" />
                                        <stop offset="33%"  stopColor="#c58af9" />
                                        <stop offset="66%"  stopColor="#f8a8c8" />
                                        <stop offset="100%" stopColor="#fdd663" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M28 4 C28 4 30.5 20 40 28 C30.5 36 28 52 28 52 C28 52 25.5 36 16 28 C25.5 20 28 4 28 4Z"
                                    fill="url(#wGrad)"
                                />
                            </svg>
                        </div>
                        <h1 className="welcome-title">
                            <span className="welcome-grad">Hello, there.</span>
                            <br />
                            <span className="welcome-plain">How can I help you today?</span>
                        </h1>
                    </div>
                    <p className="welcome-sub">
                        Ask anything. I'm here to help.
                    </p>
                </div>
            )}

            {/* ── Messages ── */}
            <div className="chats">
                {/* All messages except the last */}
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
                        {chat.role === "user" ? (
                            <p className="userMessage">{chat.content}</p>
                        ) : (
                            <div className="ai-message-wrap">
                                <div className="ai-avatar">✦</div>
                                <div className="ai-content">
                                    <span className="ai-label-name">AskNova</span>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {chat.content}
                                    </ReactMarkdown>
                                    <div className="ai-actions">
                                        <button className="act-btn" title="Copy" onClick={() => navigator.clipboard.writeText(chat.content)}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                            </svg>
                                        </button>
                                        <button className="act-btn" title="Good response">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                            </svg>
                                        </button>
                                        <button className="act-btn" title="Bad response">
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/>
                                                <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Last message — typing animation or static */}
                {prevChats.length > 0 && (
                    <>
                        {latestReply === null ? (
                            <div className="gptDiv" key="non-typing">
                                <div className="ai-message-wrap">
                                    <div className="ai-avatar">✦</div>
                                    <div className="ai-content">
                                        <span className="ai-label-name">AskNova</span>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {prevChats[prevChats.length - 1].content}
                                        </ReactMarkdown>
                                        <div className="ai-actions">
                                            <button className="act-btn" title="Copy" onClick={() => navigator.clipboard.writeText(prevChats[prevChats.length - 1].content)}>
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                                                </svg>
                                            </button>
                                            <button className="act-btn" title="Good response">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H10z"/>
                                                    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                                                </svg>
                                            </button>
                                            <button className="act-btn" title="Bad response">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/>
                                                    <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="gptDiv" key="typing">
                                <div className="ai-message-wrap">
                                    <div className="ai-avatar typing-avatar">✦</div>
                                    <div className="ai-content">
                                        <span className="ai-label-name">AskNova</span>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {latestReply}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Chat;