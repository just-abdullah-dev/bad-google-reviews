
import React from 'react'
import dynamic from 'next/dynamic';

const TopupPage = dynamic(() => import('@/components/Pages/TopupPage/TopupPage'), { ssr: false });

export default function page() {
  
  return (
    <TopupPage />
  )
}
