"use client"

import MainChat from '../Components/MainChat'
import Sidebar from '../Components/Sidebar'
import { useEffect, useState } from 'react'

export default function Component() {
  const [friendId, setFriendId] = useState<Number>(-1);
  const [friendName, setFriendName] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  if(localStorage.getItem('token') === null) {
    window.location.href = '/login';
  }
  else
  {
    setLoading(false);
  }
  }, []);

  const handleSubmit = (friendId : Number , friendName : string) => {
    setFriendId(friendId);
    setFriendName(friendName);
    setShowChat(true);
  }

  const onBack = () => {
    setShowChat(false);
  }
  
  return (
    (loading) ? <div></div> :
    <div className="flex h-screen w-full px-0 bg-[#4b4b4b] text-[#333]">
      <Sidebar chatWithFriend={handleSubmit} showChat={showChat}/>
      {(friendId === -1) ? (
        <div className={`flex-1 flex bg-gray-200 items-center justify-center ${(!showChat) ? "hidden sm:block" : "block"}`}>
          <div className="text-3xl p-96 font-bold text-center text-[#8d8b8b] sm:text-7xl sm:font-extrabold">WELCOME <br /> TO <br />EASE</div>
        </div>
      ) : (
        <MainChat friendId={friendId} friendName={friendName} onBack={onBack} showChat={showChat} />
      )}
    </div>
  )
}

