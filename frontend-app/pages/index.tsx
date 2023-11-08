import React, { useEffect } from 'react';
import AuthUser from '../templates/auth';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Autentication: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  return <AuthUser />;
};

export default Autentication;
