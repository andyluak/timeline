import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { getAuthCookie } from 'utils/cookie';

function TimerWrapper({children}) {
  const router = useRouter();
  
  const handleTimerCheck = () => {
    const token = getAuthCookie();
    console.log('sal');
    if( !token ) {
      window.location.href = '/sign-in'
    }
  }

  useEffect(() => {
    const interval = setInterval(handleTimerCheck, 3000);

    return () => {
      clearInterval(interval);
    }
  }, [])
  return children
}

export default TimerWrapper