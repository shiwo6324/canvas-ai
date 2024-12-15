'use client';

import Editor from '@/features/editor/components/editor';
import React from 'react';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { Loader, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EditorProjectPageProps {
  params: {
    projectId: string;
  };
}
const EditorProjectPage = ({ params }: EditorProjectPageProps) => {
  const { data, isLoading, isError } = useGetProject(params.projectId);
  if (isLoading || !data) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Loader className="animate-spin size-6 text-muted-foreground" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="h-full flex flex-col  gap-y-5 items-center justify-center">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">获取项目失败</p>
        <Button variant="secondary" asChild>
          <Link href="/">返回项目列表</Link>
        </Button>
      </div>
    );
  }
  return <Editor initialData={data} />;
};

export default EditorProjectPage;
