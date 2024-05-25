import React, { useState, useEffect } from 'react';
import './Chat.css';
import { useAuth } from '../Auth/AuthHook';
import avatar from '../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp'
import axios from "axios";
const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/getUsers');
        setUsers(response.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);
console.log(users)
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeUser) {
        try {
          const response = await axios.get(`http://localhost:3001/chat/getChat/${user.email}/${activeUser.email}`);
          setMessages(response.data)
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchMessages();
  }, [activeUser, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = {
        content: input,
        sender: user.email,
        receiver: activeUser.email,
      };

      try {
        const response = await axios.post('http://localhost:3001/chat/chat', newMessage,{withCredentials:true})

        // Add the new message to the current state
        const messageWithTimestamp = {
          ...newMessage,
          timestamp: new Date().toISOString() // Adding timestamp to the new message
        };
        setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
        setInput('');  // Clear the input field
      } catch (error) {
        console.error(error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
  };


  return (
    <div className="chat-container">
      <div className="user-list">
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => setActiveUser(user)}>
              <img src={user?.profilePic || user?.photoURL || avatar} width='50' height='50' style={{objectFit:'cover',borderRadius:'10px'}}/> {user.name.toUpperCase()}

            </li>
          ))}
        </ul>
      </div>
      <div className="chat-box">
        <ul id="messages">
          {messages.map((msg, index) => (
            <li key={index} className={msg.sender === user.email ? 'my-message' : 'their-message'}>
              <div className="message-header">
                <span>{msg.sender}</span>
                <span className="timestamp">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">{msg.content}</div>
            </li>
          ))}
        </ul>
        <form id="form" onSubmit={handleSubmit}>
          <input
            id="input"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
