import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL?.replace("/api", ""), {
    transports: ["websocket", "polling"],
    autoConnect: true
});

let joined = false;

export const connectSocket = () => {
    const userId = localStorage.getItem("userId");

    if (userId && !joined) {
        socket.emit("join", userId);
        joined = true;
    }
};

export default socket;