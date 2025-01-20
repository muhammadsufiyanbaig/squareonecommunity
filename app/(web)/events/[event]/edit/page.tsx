"use client"

import EventForm from '@/app/components/EventsForm/EventForm'
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
   const searchParams = useSearchParams();
      const title = searchParams.get('title') || "";
  return (
    <div>
        <EventForm title={title}/>
    </div>
  )
}

export default page