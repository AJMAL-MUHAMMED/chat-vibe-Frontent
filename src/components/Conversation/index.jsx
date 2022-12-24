import { useEffect } from 'react';
import { useState } from 'react'
import { getUser } from '../../functions/user';
import './style.css'

export default function Conversation({ chat, currentUserId, token }) {

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (chat !== null){
      getUserData();
    }
  }, [chat, currentUserId]);


  const getUserData = async () => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    try {
      const data = await getUser(userId, token);
      setUserData(data);
    } catch (error) {
    }
  }

  return (
    <>
      <div className='follower conversation'>
        <div style={{
          display: 'flex',
          gap: "1rem"
        }}>
          <div className="online-dot"></div>
          <img src={userData?.picture} alt="" className='followerImage'
            style={{ width: '50px', height: '50px' }} />
          <div className="name" style={{ fontSize: "1rem" }}>
            <span style={{ fontWeight: "bold" }}>{userData?.first_name} {userData?.last_name}</span>
            <div >Online</div>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }}/>
    </>
  )
}
