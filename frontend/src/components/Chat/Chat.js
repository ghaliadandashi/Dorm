import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { useAuth } from '../Auth/AuthHook';
import avatar from '../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp';
import axios from "axios";

const Chat = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = useRef(null);

  useEffect(() => {
    fetchUsers.current = async () => {
      if (user && user.email) {
        try {
          console.log("Fetching users...");
          const response = await fetch(`http://localhost:3001/api/getExistingChats?user=${user.email}`);
          if (response.ok) {
            const data = await response.json();
            const sortedUsers = sortUsers(data, user.email);
            setUsers(sortedUsers);
            setActiveUser(sortedUsers[0]);
            console.log("Fetched and sorted users: ", sortedUsers);
          } else {
            throw new Error('Failed to fetch users');
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.error('User is not defined or user.email is not available');
      }
    };

    fetchUsers.current();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeUser) {
        try {
          const response = await axios.get(`http://localhost:3001/chat/getChat/${user.email}/${activeUser.email}`);
          setMessages(response.data);
          console.log("users data: ", users)
          await axios.post('http://localhost:3001/chat/markAsRead', {
            userEmail: user.email,
            otherUserEmail: activeUser.email
          });


          // Update the unread count for the active user
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.email === activeUser.email ? { ...u, unreadCount: 0 } : u
            )
          );
          console.log("users data: ", users)

          console.log(activeUser)
          console.log("unread count: ",user.unreadCount)

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
        const response = await axios.post('http://localhost:3001/chat/chat', newMessage, { withCredentials: true });

        const user =  {
          unreadCount: 1,
          email: newMessage.receiver,
        }

        setActiveUser(user);

        // Add the new message to the current state
        const messageWithTimestamp = {
          ...newMessage,
          timestamp: new Date().toISOString() // Adding timestamp to the new message
        };

        setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
        setInput('');  // Clear the input field

        // Move the chat to the top
        moveChatToTop(activeUser.email);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const moveChatToTop = (email) => {
    setUsers((prevUsers) => {
      const userIndex = prevUsers.findIndex((user) => user.email === email);
      if (userIndex !== -1) {
        const updatedUsers = [...prevUsers];
        const [movedUser] = updatedUsers.splice(userIndex, 1);
        updatedUsers.unshift(movedUser);
        return updatedUsers;
      }
      return prevUsers;
    });
  };

  const sortUsers = (data, currentUserEmail) => {
    // Sort users by the timestamp of the most recent chat
    const sortedUsers = data.sort((a, b) => {
      const aTimestamp = a.chats && a.chats.length > 0 ? new Date(a.chats[0].timestamp) : new Date(0);
      const bTimestamp = b.chats && b.chats.length > 0 ? new Date(b.chats[0].timestamp) : new Date(0);
      return bTimestamp - aTimestamp;
    });

    // Ensure the user's own chat is at the top
    const currentUserChat = sortedUsers.find(u => u.email === currentUserEmail);
    if (currentUserChat) {
      sortedUsers.splice(sortedUsers.indexOf(currentUserChat), 1);
      sortedUsers.unshift(currentUserChat);
    }

    return sortedUsers;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query.trim()) {
      try {
        const response = await fetch(`http://localhost:3001/api/getUserByName?name=${query}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error('Failed to fetch users by name');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Reset to the original user list if search query is empty
      const fetchUsers = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/getExistingChats?user=${user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          } else {
            throw new Error('Failed to fetch users');
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUsers();
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <input
          type="text"
          placeholder="Search users"
          value={search}
          onChange={handleSearchChange}
        />
        <ul>
        {users.map((user) => (
            <li key={user.id} onClick={() => setActiveUser(user)}>
              <img src={user?.profilePic || user?.photoURL || avatar} width='50' height='50' style={{ objectFit: 'cover', borderRadius: '10px' }} /> {user.name.toUpperCase()}
              {user.unreadCount > 0 && (
                <span className="unread-icon">🔵</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-box">
        {activeUser && <div className="header"><h2> <img src={activeUser?.profilePic || activeUser?.photoURL || avatar} width='50' height='50' style={{ objectFit: 'cover', borderRadius: '10px' }} /> {activeUser.name}</h2></div>}
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