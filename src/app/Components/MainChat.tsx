"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from 'react';
import { sendMessage, getMessage } from '../services/message';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const socket = io('https://chat-app-backend-11ku.onrender.com');

interface Message {
  id: number;
  content: string;
  senderId: Number;
  receiverId: Number;
  type: 'recived' | 'sent';
  sentAt: Date;
}

const MainChat = ({ friendId, friendName , onBack , showChat}: { friendId: Number, friendName: string , onBack: ()=>void , showChat: boolean }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchMessages();
  }, [friendId]);

  useEffect(() => {
    socket.on('receiveMessage', (messageData) => {
      if(localStorage.getItem('user') === messageData.friendName && friendId === messageData.userId)
      {
        setMessages((prevMessages) => [...prevMessages, messageData.messageData]);
      }
    });

    socket.on('typingRecived', (data) => {
      if(localStorage.getItem('user') === data.friendName && friendId === data.userId)
      {
        setIsTyping(true);
        setTimeout(()=>setIsTyping(false) , 2000);
      }
    });

    // Clean up on component unmount
    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await getMessage(friendId);
      setMessages(response.messages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    socket.emit('typing', { friendName: friendName , userId : localStorage.getItem('userId')});
    setMessageText(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    try {
      setMessages([...messages, { id: messages.length + 1, senderId: 1, receiverId: friendId, content: messageText, type: 'sent', sentAt: new Date() }]);
      setMessageText('');

      const messageData = {
        id: messages.length + 1,
        senderId: friendId,
        receiverId: 1,
        content: messageText,
        type: 'recived',
        sentAt: new Date(),
      };

      socket.emit('sendMessage', {messageData , friendName : friendName , userId : localStorage.getItem('userId')});
      await sendMessage(friendId, messageText);
    } catch (err) {
      console.error('Message failed:', err);
    }
  };

  return (
    <div className={`flex-1 flex flex-col bg-white ${(!showChat) ? "hidden sm:block" : "block"}`}>
      {/* Back button for mobile */}
      <div className="border-b border-[#ddd] bg-white flex justify-between items-center h-16 px-6 py-12">
        <div className="flex">
        <button onClick={onBack} className="sm:hidden mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <Avatar className="w-14 h-14 rounded-full mr-3">
          <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
          <AvatarFallback className="font-bold text-2xl bg-red-300">{friendName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-extrabold text-2xl">{friendName}</div>
          <div className="text-xl text-[#8d8b8b]">
            {isTyping ? 'Typing...' : 'Online'}
          </div>
        </div>
        </div>
        
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropdown}
            className="inline-flex justify-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none"
          >
            <svg data-slot="icon" className="size-10" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"></path>
            </svg>
          </button>
 
          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-60 shadow-xl rounded-xl bg-orange-400 focus:outline-none">
              <div className="py-1">
               
                <button
                  className="block px-4 py-3 text-xl font-semibold bg-red-500  text-white hover:bg-red-600 w-full text-left"
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    toast.success('You have been LOGGED OUT !', {
                        className: 'bg-orange-400 text-xl text-white font-semibold px-6 rounded-lg',
                        icon: '😊',
                        duration: 4000,
                      });
                    window.location.reload();
                  }}
                >
                  LOGOUT
                </button>
              </div>
        </div>
      )}
    </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar" ref={containerRef}>
        {loading ? (
          // Skeleton loading state resembling chat
          <div>
            <ChatItemSkeleton/>
          </div>
        ) : (
          // Render actual messages
        <div>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 mb-4 ${message.type === "sent" ? "justify-end" : ""}`}
          >
            {message.type === "recived" && (
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage src="/pfp.jpeg" alt="User Avatar" />
                <AvatarFallback className="bg-gray-300">{friendName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-xl p-3 max-w-[70%] ${
                message.type === "sent" ? "bg-[#e36d3e] text-white" : "bg-[#f0f0f0] "
              }`}
            >
              <div className="font-normal mb-1">{ message.type === "sent" ? "YOU" : friendName.toUpperCase()}</div>
              <div className="font-semibold text-lg">{message.content}</div>
            </div>
          </div>
        ))}
        <div>
          {(messages.length === 0) ? (<div className="text-center text-xl font-bold text-gray-500">Let's Start The Conversation 😊</div> ): (<div></div>)}
        </div>
        </div>
      )}
      
      </div>

      <div className="border-t border-[#ddd] bg-white flex items-center gap-4 h-24 px-10 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
          <Input
            type="text"
            placeholder="Type your message"
            value={messageText}
            onChange={handleInputChange}
            className="bg-[#ededed] rounded-xl text-gray-950 px-4 py-4 text-xl h-16 border-none outline-none focus:border-none focus:ring-0 flex-1"
          />
          <button className="rounded-xl p-2 bg-orange-300 hover:bg-orange-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
            </svg>
          </button>
          <button  className="rounded-xl p-2 bg-orange-300 hover:bg-orange-300" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

const ChatItemSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="bg-gray-200 rounded-xl w-32 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4 justify-end">
              <div className="bg-orange-300 rounded-xl w-20 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="bg-gray-200 rounded-xl w-56 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4 justify-end">
              <div className="bg-orange-300 rounded-xl w-36 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="bg-gray-200 rounded-xl w-32 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4 justify-end">
              <div className="bg-orange-300 rounded-xl w-20 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              <div className="bg-gray-200 rounded-xl w-56 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4 justify-end">
              <div className="bg-orange-300 rounded-xl w-36 p-3 max-w-[70%] shadow-lg">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
  </div>
);
export default MainChat;