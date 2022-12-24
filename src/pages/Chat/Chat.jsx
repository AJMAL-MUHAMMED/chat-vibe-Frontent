import './Chat.css';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Conversation from '../../components/Conversation/index';
import { userChats } from '../../functions/chatApi';
import Header from '../../components/header';
import ChatBox from '../../components/ChatBox';
import { useMediaQuery } from 'react-responsive';
import { io } from 'socket.io-client';

export default function Chat() {
  const mobileScreen = useMediaQuery({ query: '(min-width: 769px)' })
  const [showChat, setShowChat] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:8000');
    socket.current.emit('new-user-add', user.id);
    socket.current.on('get-users', (users) => {
      setOnlineUsers(users);
    })
  }, [user])


  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await userChats(user.id, user.token);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    }
    getChats();
  }, []);

  // sending message to socket server

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit('send-message', sendMessage);
    }
  }, [sendMessage]);

  // receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log('received message', data);
      setReceiveMessage(data);
    })
  }, []);

  return (
    <>
      <Header page="chat" />
      <div className='Chat'>
        {/* LeftSide */}
        {mobileScreen ?

          <>
            <div className="Left-side-chat" style={{ paddingTop: "60px" }} >
              <div className="Chat-container">
                <h2>Chats</h2>
                <div className="Chat-list">
                  {chats?.map((chat) => (
                    <div key={chat._id} onClick={() => { setCurrentChat(chat) }}>
                      <Conversation chat={chat} currentUserId={user.id} token={user.token} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="Right-side-chat" style={{ paddingTop: "60px" }}>
              <ChatBox currentUserId={user.id} chat={currentChat} token={user.token} receiveMessage={receiveMessage} setSendMessage={setSendMessage} />
            </div>
          </>
          :
          <>
            {!showChat ?
              <div className="Left-side-chat" style={{ paddingTop: "60px", minWidth: '97vw' }} >
                <div className="Chat-container">
                  <h2>Chats</h2>

                  <div className="Chat-list">
                    {chats?.map((chat) => (
                      <div onClick={() => { setCurrentChat(chat); setShowChat(true) }}>
                        <Conversation chat={chat} currentUserId={user.id} token={user.token} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              :
              <div className="Right-side-chat" style={{ paddingTop: "60px", minWidth: '97vw' }}>
                <ChatBox currentUserId={user.id} chat={currentChat} token={user.token} setSendMessage={setSendMessage} receiveMessage={receiveMessage} />
              </div>
            }

          </>

        }

      </div>
    </>
  )
}
