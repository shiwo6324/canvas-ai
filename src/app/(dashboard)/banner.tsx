'use client';
import { Button } from '@/components/ui/button';
import { useCreateProject } from '@/features/projects/api/use-create-project';
import { ArrowRight, Sparkles } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

const Banner = () => {
  const mutation = useCreateProject();
  const router = useRouter();

  const onClick = () => {
    mutation.mutate(
      {
        name: '未命名项目',
        json: '',
        width: 900,
        height: 1200,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data[0].id}`);
        },
      }
    );
  };
  return (
    <div
      className="aspect-[5/1] min-h-[248px] 
    flex gap-x-6 p-6 items-center rounded-xl 
    bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]"
    >
      <div
        className="rounded-full size-28  items-center justify-center bg-white/50
      hidden md:flex
      "
      >
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-black" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-bold text-white">
          欢迎使用{' '}
          <span className="font-bold text-2xl bg-gradient-to-r from-indigo-700 to-purple-900 text-transparent bg-clip-text">
            Canvas AI
          </span>
        </h1>
        <p className="text-white text-sm mb-2">
          AI加持创作，让您的想象力插上翅膀。
        </p>
        <Button
          disabled={mutation.isPending}
          className="w-[160px]"
          variant="secondary"
          onClick={onClick}
        >
          开始创作
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Banner;
