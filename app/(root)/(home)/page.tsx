"use client"

import React, { useState, useEffect } from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';

const Home = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[260px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[275px] rounded py-2 text-center text-base font-normal'>
            Welcome to my 1<sup>st</sup> full-stack application
          </h2>
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
