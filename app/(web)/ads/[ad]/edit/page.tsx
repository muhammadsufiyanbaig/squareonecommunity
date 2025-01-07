"use client"

import AdForm from '@/app/components/AdForm/AdForm'
import { useSearchParams } from 'next/navigation';
import React from 'react'


const page = () => {
   const searchParams = useSearchParams();
    const id = searchParams.get('id') || "";
  return (
    <div>
        <AdForm AdId={id}/>
    </div>
  )
}

export default page