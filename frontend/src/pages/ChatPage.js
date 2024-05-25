import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat/Chat';
import Header from "../layout/Header";

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getUsers');
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
  }, []);

  return (
    <div className='chatPage'>
      <Header/>
      {users.length > 0 && (
        <Chat
          user={users[0]} // Assume the first user in the list is the logged-in user
          activeUser={activeUser}
          setActiveUser={setActiveUser}
          messages={messages}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

export default ChatPage;
