"use client"

import DealForm from '@/app/components/DealsForm/DealForm'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
    const searchParams = useSearchParams();
    const dealname = searchParams.get('dealname') || "";
  return (
    <div>
        <DealForm dealname={dealname}/>
    </div>
  )
}

export default page