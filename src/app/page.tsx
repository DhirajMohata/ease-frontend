'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(localStorage.getItem('token')) {
      window.location.href = '/chat';
    }
    else{
      setLoading(false);
    }
  }, []);
  return (
    (loading) ? <div></div> :
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[#fff] text-[#333]">
      <div className="max-w-[800px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Connect with Ease</h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8">
          Our chat app makes it simple to stay connected with friends, family, and colleagues.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center h-12 px-6 rounded-md bg-[#ff7b00] text-white text-lg font-medium shadow-md hover:bg-[#e67000] focus:outline-none focus:ring-2 focus:ring-[#ff7b00] focus:ring-offset-2"
        >
          Start Chatting
        </a>
      </div>
    </div>
  )
}
