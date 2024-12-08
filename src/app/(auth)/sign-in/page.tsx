import { auth } from '@/auth';
import SignInCard from '@/features/auth/components/sign-in-card';
import { redirect } from 'next/navigation';
import React from 'react';

const SignInPage = async () => {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return <SignInCard />;
};

export default SignInPage;
