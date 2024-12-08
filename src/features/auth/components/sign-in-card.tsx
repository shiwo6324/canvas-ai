'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const SignInCard = () => {
  const onProviderSignIn = (provider: 'github' | 'google') => {
    signIn(provider, { redirectTo: '/' });
  };
  return (
    <Card className="w-full h-full p-8 ">
      <CardHeader className="px-0 pt-0">
        <CardTitle>登录</CardTitle>
        <CardDescription>使用Email或者其他方式登录</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignIn('github')}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            使用GitHub登录
          </Button>

          <Button
            onClick={() => onProviderSignIn('google')}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            使用Google登录
          </Button>
        </div>
        <p className="text-xs  text-muted-foreground ">
          没有账号？
          <Link href="/sign-up">
            <span className="text-sky-700 hover:underline">立即注册</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
