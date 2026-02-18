import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { MyContext } from "./MyContext.jsx";
import './Theme.css';
import './App.css';

import LandingPage  from "./LandingPage.jsx";
import Login        from "./Login.jsx";
import Signup       from "./Signup.jsx";
import Sidebar      from "./Sidebar.jsx";
import ChatWindow   from "./ChatWindow.jsx";

// Protected route — redirects to /login if no token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

// The full chat app layout
function ChatApp() {
  const [prompt, setPrompt]           = useState("");
  const [reply, setReply]             = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats]     = useState([]);
  const [newChat, setNewChat]         = useState(true);
  const [allThreads, setAllThreads]   = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat"   element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        } />
        {/* Catch-all → landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;