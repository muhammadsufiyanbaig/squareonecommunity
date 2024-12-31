"use client"

import BrandForm from '@/app/components/BrandForm/BrandForm'
import React from 'react'
import { useSearchParams } from 'next/navigation';

const page = () => {
  const searchParams = useSearchParams();
  const brandName = searchParams.get('brandname') || "";

  return (
    <div>
        <BrandForm brandName={brandName} />
    </div>
  )
}

export default page