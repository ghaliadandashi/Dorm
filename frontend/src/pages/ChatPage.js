import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styling/pages/ChatApp.css'; 


const Chat = () => {
    const [activeChat, setActiveChat] = useState('person2');
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState({});

    useEffect(() => {
        // Fetch friends list
        axios.get('http://localhost:3001/users')
            .then(response => {
                setFriends(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch friends data:", error);
            });

        // Fetch chat data
        axios.get('http://localhost:3001/chats')
            .then(response => {
                setChats(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch chat data:", error);
            });
    }, []);

    const handlePersonClick = (personId) => {
        setActiveChat(personId);
    };

    return (
        <div className="wrapper">
            <div className="container">
                <div className="left">
                    <div className="top">
                        <input type="text" placeholder="Search" />
                        <a href="javascript:;" className="search"></a>
                    </div>
                    <ul className="people">
                        {friends.map((friend) => (
                            <li
                                key={friend.id}
                                className={`person ${activeChat === friend.id ? 'active' : ''}`}
                                data-chat={friend.id}
                                onClick={() => handlePersonClick(friend.id)}
                            >
                                <img src={friend.img} alt="" />
                                <span className="name">{friend.name}</span>
                                <span className="time">{friend.time}</span>
                                <span className="preview">{friend.preview}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="right">
                    <div className="top">
                        <span>To: <span className="name">{friends.find(f => f.id === activeChat)?.name}</span></span>
                    </div>
                    <div className="chat" data-chat={activeChat}>
                        {chats[activeChat]?.map((bubble, index) => (
                            <div key={index} className={`bubble ${bubble.type}`}>
                                {bubble.text}
                            </div>
                        ))}
                    </div>
                    <div className="write">
                        <a href="javascript:;" className="write-link attach"></a>
                        <input type="text" />
                        <a href="javascript:;" className="write-link smiley"></a>
                        <a href="javascript:;" className="write-link send"></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
