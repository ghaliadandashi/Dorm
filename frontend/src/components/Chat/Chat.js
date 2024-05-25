import React, { useState, useEffect } from 'react';
import './Chat.css';
import { useAuth } from '../Auth/AuthHook';

const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getUsers');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setActiveUser(data[0]);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeUser) {
        try {
          const response = await fetch(`http://localhost:3001/api/getChat?sender=${user.email}&receiver=${activeUser.email}`);
          if (response.ok) {
            const data = await response.json();
            setMessages(data);
          } else {
            throw new Error('Failed to fetch chat messages');
          }
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
        const response = await fetch('http://localhost:3001/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });
        if (!response.ok) {
          throw new Error('Error saving chat message');
        }

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
              {user.name}
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
