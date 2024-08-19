"use client"

import React, { useEffect, useState } from 'react';
import { getFriends } from '../services/friendships';
import AddFriendPopup from './AddFriendPopup';

interface SidebarProps {
  chatWithFriend: (friendId: number, friendName: string) => void;
  showChat: boolean;
}

const formatLastSeen = (lastSeenAt: Date): string => {
  const now = new Date();
  const lastSeenDate = new Date(lastSeenAt);
  const diffMs = now.getTime() - lastSeenDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if(diffDay > 100) {
    return 'Start Talking';
  }
  if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const Sidebar: React.FC<SidebarProps> = ({ chatWithFriend, showChat }) => {
  const [activeButton, setActiveButton] = useState('All');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [friends, setFriends] = useState<Array<{
    id: number;
    userId: number;
    friendId: number;
    lastSeenAt: Date;
    lastMessage: string;
    friendName: string;
    status: string;
  }>>([]);
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await getFriends();
        response.friendships.sort((a, b) => {
            return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
        });
      setFriends(response.friendships);
    } catch (err) {
      console.error('Failed to fetch friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriendClick = () => {
    setShowAddFriendPopup(true);
  };

  const closePopup = () => {
    fetchFriends();
    setShowAddFriendPopup(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredFriends = friends.filter(friend =>
    friend.friendName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buttons = ['All', 'Archived', 'Blocked'];

  const chatItems = (id: number, lastSeenAt: Date ,  friendId: number, name: string, message: string) => (
    <a
      href="#"
      key={id.toString()}
      className={`flex p-2 sm:p-3 border border-solid border-gray-300 items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
        activeChat === id.toString() ? 'bg-gray-200 border-l-4 sm:border-l-8 border-l-orange-500' : 'hover:bg-[#e0e0e0]'
      }`}
      onClick={() => {
        setActiveChat(id.toString());
        chatWithFriend(friendId, name);
      }}
    >
      <div className="h-9 w-9 sm:w-12 sm:h-12">
        <svg
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="font-medium sm:font-semibold text-lg sm:text-xl text-gray-800">{name.toUpperCase()}</div>
          <div className="text-xs sm:text-lg text-gray-500">{formatLastSeen(lastSeenAt)}</div>
        </div>
        <div className="text-sm sm:text-lg text-gray-600 truncate">{message}</div>
      </div>
    </a>
  );

  return (
    <div className={`border-r border-[#ddd] bg-white w-full sm:w-1/3 h-max ${(showChat) ? "hidden  sm:block" : "block"}`}>
      <div className="flex flex-col py-4 px-4 border-b">
        <div className="relative flex items-center mb-7 mt-4 border p-2 border-solid border-slate-950 rounded-2xl ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 absolute right-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="bg-white text-semibold text-xl text-black rounded-lg w-96 pr-10 focus:outline-none"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex justify-between space-x-4 mt-2">
          <div>{buttons.map((button) => (
            <button
              key={button}
              className={`ml-0.5 sm:ml-3 px-2 py-1 sm:px-3 sm:py-2 rounded-xl text-sm ${
                activeButton === button ? 'bg-orange-300' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setActiveButton('All')}
            >
              {button}
            </button>
          ))}</div>
          <div>
            <button
              className="px-2 py-2 sm:px-3 sm:py-2 text-white font-bold rounded-l text-lgs bg-red-500 hover:bg-red-700"
              onClick={handleAddFriendClick}
            >
              Add Friend
            </button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-171px)] overflow-y-auto hide-scrollbar">
        {loading ? (
          <div>
            {Array.from({ length: 7 }).map((_, index) => (
              <ChatItemSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div>
            {filteredFriends.map((chat) => chatItems(chat.id, chat.lastSeenAt ,  chat.friendId, chat.friendName, chat.lastMessage))}
          </div>
        )}
      </div>

      {showAddFriendPopup && <AddFriendPopup closePopup={closePopup} />}
    </div>
  );
};

const ChatItemSkeleton = () => (
  <div className="flex p-3 border border-solid border-gray-300 items-center gap-10 px-4 py-3 rounded-lg animate-pulse">
    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between gap-11 items-center mb-2">
        <div className="bg-gray-300 rounded h-4 w-1/4"></div>
        <div className="bg-gray-300 rounded h-3 w-1/4"></div>
      </div>
      <div className="bg-gray-300 rounded h-4 w-full"></div>
    </div>
  </div>
);

export default Sidebar;
