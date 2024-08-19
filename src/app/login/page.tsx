"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState , useEffect } from 'react';
import { login } from '../services/user';
import { toast } from 'react-hot-toast';

export default function Component() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(localStorage.getItem('token')) {
      window.location.href = '/chat';
    }
    else
    {
      setLoading(false);
    }
  }, []);


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
        toast.success('Fetching Your Profile !', {
            className: 'bg-orange-400 text-xl text-white font-semibold px-6 rounded-lg',
            icon: '⌛',
            duration: 4000,
          });
      const response = await login(email, password); 
      const { token , username , userId } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('user', username);
      localStorage.setItem('userId', userId);
      window.location.href = '/chat';
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    (loading) ? <div></div> :
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#fff] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-xl border border-[#ffa500] bg-white p-8 shadow-lg">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#333]">Sign in to your account</h1>
            <p className="mt-2 text-sm text-[#666]">
              Don't have an account?
              <a href="/signup" className="font-medium ml-2 text-[#ffa500] hover:underline" >
                Sign up
              </a>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <Label htmlFor="email" className="block text-xl font-medium text-[#333]">
                Email
              </Label>
              <div className="mt-3">
                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="block w-full text-lg rounded-xl border-[#ffa500] bg-[#fff] px-3 py-2 text-[#333] shadow-sm focus:border-[#ffa500] focus:ring-[#ffa500]"
                />
              </div>
            </div>
            <div className="mb-3">
              <Label htmlFor="password" className="block text-xl font-medium text-[#333]">
                Password
              </Label>
              <div className="mt-3 mb-8">
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="block w-full rounded-xl text-lg border-[#ffa500] bg-[#fff] px-3 py-2 text-[#333] shadow-sm focus:border-[#ffa500] focus:ring-[#ffa500]"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="flex  w-full justify-center rounded-xl text-lg bg-[#ffa500] px-4 py-3 font-medium text-white shadow-sm hover:bg-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ffa500] focus:ring-offset-2"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
