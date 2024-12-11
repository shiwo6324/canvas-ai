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
import { useSignUp } from '../hooks/use-sign-up';
import { TriangleAlert } from 'lucide-react';

const SignUpCard = () => {
  const mutation = useSignUp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(
      {
        name,
        email,
        password,
      },
      {
        onSuccess: () => {
          // toast.success('注册成功');
          signIn('credentials', {
            email,
            password,
            redirect: true,
            redirectTo: '/',
          });
        },
      }
    );
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

      {!!mutation.error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{mutation.error.message}</p>
        </div>
      )}

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
            disabled={mutation.isPending}
          />
          <Input
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={mutation.isPending}
          />
          <Input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={5}
            maxLength={15}
            disabled={mutation.isPending}
          />
          <Button
            disabled={mutation.isPending}
            className="w-full"
            size="lg"
            type="submit"
          >
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
            disabled={mutation.isPending}
          >
            <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
            使用GitHub注册
          </Button>

          <Button
            onClick={() => onProviderSignUp('google')}
            variant="outline"
            size="lg"
            className="w-full relative"
            disabled={mutation.isPending}
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
