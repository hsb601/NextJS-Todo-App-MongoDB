'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const router = useRouter();
  const authState = useSelector((state) => state.user.verifyEmail);
  const [authorized, setAuthorized] = useState(false);
  const publicPaths = ['/login', '/signup', '/', '/verify'];
 console.log("authstate:",authState)
  useEffect(() => {
    authCheck(router.asPath)
    const hideContent = (url) => {
      const path = url.split('?')[0];
      if (authState === null && !publicPaths.includes(path)) {
        setAuthorized(false);
      }
    };
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, [authState]);

  const authCheck = (url) => {
    const path = url.split('?')[0];
    if (authState === null && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath }
      });
    }
   else if (authState !== null && publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/todo',
        query: { returnUrl: router.asPath }
      });
    }
    else {
      setAuthorized(true);
    }
  };


  return (authorized && children);
};

export default PrivateRoute;
