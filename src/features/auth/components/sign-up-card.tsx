'use client';
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const SignUpCard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const onProviderSignUp = (provider: 'github' | 'google') => {
    signIn(provider, { redirectTo: '/', callbackUrl: '/', redirect: true });
  };
  return (
    <Card className="w-full h-full p-8 ">
      <CardHeader className="px-0 pt-0">
        <CardTitle>注册</CardTitle>
        <CardDescription>使用Email或者其他方式注册</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSignUp} className="space-y-2.5">
          <Input
            type="text"
            placeholder="用户名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={15}
          />
          <Input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={5}
            maxLength={15}
          />
          <Button className="w-full" size="lg" type="submit">
            注册
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignUp('github')}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            使用GitHub注册
          </Button>

          <Button
            onClick={() => onProviderSignUp('google')}
            variant="outline"
            size="lg"
            className="w-full relative"
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            使用Google注册
          </Button>
        </div>
        <p className="text-xs  text-muted-foreground ">
          已有账号？
          <Link href="/sign-in">
            <span className="text-sky-700 hover:underline">立即登录</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
