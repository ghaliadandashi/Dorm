import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat/Chat';
import Header from "../layout/Header";
import { useAuth } from '../components/Auth/AuthHook';

const ChatPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email) {
      const fetchUsers = async () => {
        console.log("Fetching users...");
        try {
          const response = await fetch(`http://localhost:3001/api/getExistingChats?user=${user.email}`);
          if (response.ok) {
            var data = await response.json();
            if (data.length === 0) {
              data = [{ email: user.email, name: user.name || 'You', unreadCount: 0 }];
            }
            // Sort users by the timestamp of the most recent chat
            const sortedUsers = data.sort((a, b) => {
              // Get the most recent chat timestamp for each user
              const aTimestamp = a.chats && a.chats.length > 0 ? new Date(a.chats[0].timestamp) : new Date(0);
              const bTimestamp = b.chats && b.chats.length > 0 ? new Date(b.chats[0].timestamp) : new Date(0);
              return bTimestamp - aTimestamp;
            });

            // Ensure the user's own chat is at the top
            const currentUserChat = sortedUsers.find(u => u.email === user.email);
            if (currentUserChat) {
              sortedUsers.splice(sortedUsers.indexOf(currentUserChat), 1);
              sortedUsers.unshift(currentUserChat);
            }

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
      };
      fetchUsers();
    } else {
      setLoading(false);
      console.error('User is not defined or user.email is not available');
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='chatPage'>
      <Header/>
      {users.length > 0 && (
        <Chat
          user={user} // Passing the authenticated user
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
