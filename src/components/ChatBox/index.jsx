import React, { useState } from 'react'
import { useEffect } from 'react';
import { addMessage, getMessages } from '../../functions/chatApi';
import { getUser } from '../../functions/user';
import './ChatBox.css'
import Moment from "react-moment";
import InputEmoji from "react-input-emoji";
import { useRef } from 'react';

export default function ChatBox({ chat, currentUserId, token, setSendMessage, receiveMessage }) {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scroll = useRef();


    useEffect(() => {
        if (receiveMessage !== null && receiveMessage.chatId === chat?._id) {
            setMessages([...messages, receiveMessage])
        }
    }, [receiveMessage])

    // fetching data of user for showing on the chatbox container.
    useEffect(() => {
        if (chat !== null) {
            getUserData();
        }
    }, [chat, currentUserId])

    const getUserData = async () => {
        try {
            const userId = chat?.members.find((id) => id !== currentUserId);
            const data = await getUser(userId, token);
            setUserData(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (chat !== null) {
            fetchMessages();
        }
    }, [chat])

    const fetchMessages = async () => {
        try {
            const messagedata = await getMessages(chat._id, token);
            setMessages(messagedata);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (newMessage) => {
        setNewMessage(newMessage)
    }

    const handleSend = async (e) => {
        e.preventDefault();
        const message = {
            senderId: currentUserId,
            text: newMessage,
            chatId: chat._id
        };

        // sending the message to the database
        try {
            const data = await addMessage(message, token)
            setMessages([...messages, data]);
            setNewMessage("");
        } catch (error) {
            console.log(error);
        }


        const receiverId = chat.members.find((id) => id !== currentUserId);
        setSendMessage({ ...message, receiverId });

    }

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    return (
        <div className='ChatBox-container '>
            {chat ? (
                <>
                    <div className="chat-header">
                        <div className="follower">
                            <div className='follower conversation'>
                                <div style={{
                                    display: 'flex',
                                    gap: "1rem"
                                }}>
                                    <img src={userData?.picture} alt="" className='followerImage'
                                        style={{ width: '50px', height: '50px' }} />
                                    <div className="name" style={{ fontSize: "1rem" }}>
                                        <span style={{ fontWeight: "bold" }}>{userData?.first_name} {userData?.last_name}</span>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                        </div>
                    </div>

                    {/* chat messages */}
                    <div className="chat-body">
                        {messages.map((message) => (
                            
                            <div ref={scroll} className={message.senderId === currentUserId ? "message own" : "message"} key={message._id}>
                                <span>{message.text}</span>
                                <span> <Moment fromNow  >{message.createdAt}</Moment></span>
                            </div>

                        ))}
                    </div>

                    {/* chat sender */}
                    {
                        userData &&

                        <div className="chat-sender">
                            <InputEmoji
                                value={newMessage}
                                onChange={handleChange}
                                placeholder="Type a message"
                            />
                            <div className="send-button button" onClick={handleSend}>Send</div>
                        </div>
                    }
                </>
            ) :
                <p className='chatbox-empty-message'>Tap the user to Start the Conversation</p>}

        </div>
    )
}
