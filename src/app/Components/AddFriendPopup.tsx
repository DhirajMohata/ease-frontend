"use client"

import React, { useState, useEffect } from 'react';
import { getPotentialFriends, addFriendship } from '../services/friendships';
import { toast } from 'react-toastify';

interface AddFriendPopupProps {
  closePopup: () => void;
}



const AddFriendPopup: React.FC<AddFriendPopupProps> = ({ closePopup }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [potentialFriends, setPotentialFriends] = useState<Array<{ id: number; username: string; email:string}>>([]);
  
    useEffect(() => {
      fetchPotentialFriends();
    }, []);
  
    const fetchPotentialFriends = async () => {
      try {
        toast.info('Getting People you may know');
        const response = await getPotentialFriends();
        setPotentialFriends(response.users);
      } catch (err) {
        console.error('Failed to fetch potential friends:', err);
      }
    };
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
  
    const handleAddFriend = async (friendId: number) => {
      try {
        await addFriendship(friendId);
        toast.success('Friend added successfully');
        closePopup();
      } catch (err) {
        console.error('Failed to add friend:', err);
        alert('Failed to add friend');
      }
    };
  
    const filteredFriends = potentialFriends.filter((friend) =>
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white w-[500px] p-6 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Add a Friend</h2>
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 mb-4 border border-gray-500 rounded-xl"
          />
          <div className="max-h-72 border border-b-slate-500 p-2 rounded-xl overflow-y-auto hide-scrollbar">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between text-xl font-medium items-center p-2 border-b last:border-b-0"
              >
                <span>{friend.username}</span>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-xl hover:bg-blue-600"
                  onClick={() => handleAddFriend(friend.id)}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AddFriendPopup;
  