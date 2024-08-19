const API_URL = 'https://chat-app-backend-11ku.onrender.com';
import { toast } from 'react-hot-toast';

interface GetFriendsResponse {
  friendships: Array<{
    id: number;
    userId: number;
    friendId: number;
    lastSeenAt: Date;
    lastMessage: string;
    friendName: string;
    status: string;
  }>;
}

interface GetPotentialFriendsResponse {
  users: Array<{
    id: number;
    username: string;
    email: string;
  }>;
}

export const getFriends = async (): Promise<GetFriendsResponse> => {
  try {
    const response = await fetch(`${API_URL}/friendships/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
        toast.error(`OOPS !! There was some problem fetching friends`, {
            className: 'bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg',
            icon: '🫠',
            duration: 5000,
          });
      throw new Error('Failed to get friends');
    }
    
    const data: GetFriendsResponse = await response.json();
    return data;
  } catch (error) {
    throw new Error('Error occurred while fetching friends');
  }
};

export const getPotentialFriends = async () => {
  try {
    const response = await fetch(`${API_URL}/friendships/potential-friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
        toast.error(`OOPS !! There was some problem fetching friends`, {
            className: 'bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg',
            icon: '🫠',
            duration: 4000,
          });
      throw new Error('Failed to fetch potential friends');
    }

    const data: GetPotentialFriendsResponse = await response.json();
    toast.success(`Make some new friend's`, {
        className: 'bg-green-600 text-white font-semibold px-4 py-3 rounded-lg',
        icon: '😊',
        duration: 4000,
      });
    return data;
  } catch (error) {
    throw new Error('Error occurred while fetching potential friends');
  }
};

export const addFriendship = async (friendId: number) => {
  try {
    const response = await fetch(`${API_URL}/friendships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        friendId,
      }),
    });

    if (!response.ok) {
        toast.error(`OOPS !! Faild to Make friend try again`, {
            className: 'bg-orange-400 text-white font-semibold px-4 py-3 rounded-lg',
            icon: '🫠',
            duration: 4000,
          });
      throw new Error('Failed to add friendship');
    }

    const data = await response.json();
    toast.success(`Yeyy , You make a new friend let's talk`, {
        className: 'bg-green-600 text-white font-semibold px-4 py-3 rounded-lg',
        icon: '😊',
        duration: 4000,
      });
    return data;
  } catch (error) {
    throw new Error('Error occurred while adding friendship');
  }
};
