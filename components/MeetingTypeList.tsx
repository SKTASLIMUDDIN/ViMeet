"use client"
import Image from 'next/image'
import HomeCard from './HomeCard';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MeetingModal from './ui/MeetingModal';
import { create } from 'domain'
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

import { useToast } from "@/components/ui/use-toast";
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setmeetingState] = useState<'isScheduleMeeting' | 
  'isJoiningMeeting' | 'isInstantMeeting' | undefined >();
  const {user} = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  });
  const [callDetail, setCallDetail] = useState<Call>()
  const { toast } = useToast()

  const createMeeting = async () => {
    if(!client || !user) return;

    try {

      if (!values.dateTime){
        toast({title: "Please select date and time",})
        return;
      };

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('failed to creat call');
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';
      
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetail(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: 'Meeting Created',
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;


  return (
    <section className='grid grid-cols-1 gap-5 
    md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
       img='/icons/add-meeting.svg'
       title='New Meeting'
       description='Start an instant meeting'
       handleClick={() => setmeetingState('isInstantMeeting')}
       className="bg-orange-1"
      />
      <HomeCard
      img='/icons/schedule.svg'
      title='Schedule Meeting'
      description='Plan your meeting'
      handleClick={() => setmeetingState('isScheduleMeeting')}
      className="bg-blue-1"
      />
      <HomeCard
      img='/icons/recordings.svg'
      title='View Recordings'
      description='Check out your recordings'
      handleClick={() =>router.push('/recordings') }
      className="bg-purple-1"
      />
      <HomeCard
      img='/icons/join-meeting.svg'
      title='Join Meeting'
      description='Via invitation link'
      handleClick={() =>setmeetingState('isJoiningMeeting') }
      className="bg-yellow-1"
      />
      {!callDetail ? (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='Create meeting'
        
        handleClick={createMeeting}
      >
        <div className='flex flex-col gap-2.5'>
          <label className='text-base text-normal 
          leading-[22px] text-sky-2'>Add a description</label>
          <Textarea className='border-none bg-dark-3 focus-visible:ring-0 
          focus-visible:ring-offset-0'
          onChange={(e) => {
            setValues({...values, description: e.target.value})
          }}/>
        </div>
        <div className='flex w-full flex-col gap-2.5'>
        <label className='text-base text-normal 
          leading-[22px] text-sky-2'>Select Date and Time</label>
          <ReactDatePicker
             selected={values.dateTime}
             onChange={(date) => setValues({...values, dateTime: date!})}
             showTimeSelect
             timeFormat='HH:mm'
             timeIntervals={5}
             timeCaption='Time'
             dateFormat='MMMM d, yyyy h:mm aa'
             className='w-full rounded bg-dark-3 p-2 focus:outline-none'

          />
        </div>
      </MeetingModal>
      ) : (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='meeting created'
        className="text-center"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
           toast({title: 'Link copied'})
        }}
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='Copy Meeting Link'
        />
      )} 
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='Start an instant meeting'
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

       <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setmeetingState(undefined)}
        title='Type the link here'
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        <Input
        placeholder='Paste the meeting link here'
        className='border-none bg-dark-3 
        focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e) => setValues({...values, link:
        e.target.value})}/>
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
