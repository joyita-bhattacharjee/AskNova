const server = import.meta.env.PROD 
    ? "https://asknovabackend4.onrender.com" 
    : "http://localhost:8000";

export default server;