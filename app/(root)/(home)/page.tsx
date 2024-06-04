"use client"

import React, { useState, useEffect } from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';
import { useUser } from '@clerk/nextjs';

const Home = () => {
  const {user} = useUser();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [welcomeText, setWelcomeText] = useState('Welcome to Yoom!');
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }));
      setCurrentDate(new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full'
      }).format(now));
    };

    updateDateTime(); // Initial call to set the date and time immediately
    const intervalId = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);
    
      
    
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setWelcomeText(welcomeText === 'Welcome to Yoom!' ? 'Welcome to Zoom!' : 'Welcome to Yoom!');
    }, 3000); // Change text every 3 seconds

    return () => clearTimeout(timeoutId);
  }, [welcomeText]);


    

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[260px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h1 className='glassmorphism max-w-[285px] rounded py-2 text-center text-base font-normal'>
            Hey <b>{`${user?.username}`}</b>, {welcomeText}
          </h1>
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-extrabold lg:text-4xl'>
              {currentTime}
            </h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>
              {currentDate}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
