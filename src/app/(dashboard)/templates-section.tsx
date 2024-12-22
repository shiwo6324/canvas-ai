'use client';
import { useGetTemplates } from '@/features/projects/api/use-get-templates';
import React from 'react';
import { LoaderIcon } from 'lucide-react';

const TemplatesSection = () => {
  const { data, isLoading, isError } = useGetTemplates({
    page: '1',
    limit: '4',
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">从模板开始</h3>
        <div className="flex items-center justify-center h-32">
          <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <h3 className="font-semibold text-lg">从模板开始</h3>
      <div className="grid  grid-cols-2 md:grid-cols-4 mt-4 gap-4"></div>
    </div>
  );
};

export default TemplatesSection;
