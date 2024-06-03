import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react';

const Home = () => {

  /*for date and time*/
   const now = new Date();

   const currentTime = now.toLocaleTimeString('en-US', 
   { hour:'2-digit', minute: '2-digit'});

   const currentDate = ( new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full'})).format(now);

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
     <div className='h-[260px] w-full rounded-[20px] bg-hero bg-cover'>

       <div className='flex h-full flex-col justify-between 
       max-md:px-5 max-md:py-8 lg:p-11'>
         
         <h2 className='glassmorphism max-w-[275px] rounded py-2 text-center 
         text-base font-normal'>Upcoming Meeting at 12:30 PM</h2>
         
         <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-extrabold lg:text-4xl'>
          {currentTime}
          </h1>
          <p className='text-lg font-medium text-sky-1 lg:text-2xl'
          >{currentDate}</p>

         </div>
       </div>
     </div>
      <MeetingTypeList/>
    </section>
  )
}

export default Home;

