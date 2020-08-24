import React, { useState, useEffect } from "react";

import socketIoClient from "socket.io-client";



const socket = socketIoClient("http://localhost:8463", { autoConnect: false });


const Message = ({ msg }) => {

    return (
        <div className="msg">
            <span> { new Date(msg.date).toLocaleDateString() } </span>
            <span> { msg.content } </span>
        </div>
    );

};


const MessageBox = () => {

    const [value, setValue] = useState("");

    const postMessage = e => {
        e.preventDefault();

        if (!value) return;

        socket.emit("message", value);

        setValue("");
    };

    return (
        <form onSubmit={ postMessage }>
            <input type="text" className="input" placeholder="message"
                   value={ value } onChange={ e => setValue(e.target.value) }
            />
        </form>
    );

};


const Chat = () => {

    const [messages, setMessages] = useState([]);

    const addMessage = (msg) => {
        setMessages(oldMessages => [...oldMessages, ...(Array.isArray(msg) ? msg.reverse() : [msg])]);
    };

    useEffect(()=> {

        socket.on("latest", (data) => {
            // expect server to send us the latest messages
            addMessage(data);
        });
        socket.on("message", (msg) => {
            addMessage(msg);
        });

        socket.connect();

    }, []);

    return (
        <div>
            <div id = "msgBox">
                { messages.map((msg, index) => <Message msg={msg} />) }
            </div>
            <MessageBox />
        </div>
    );

};



export default Chat;
