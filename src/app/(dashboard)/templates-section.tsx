'use client';
import {
  Template,
  useGetTemplates,
} from '@/features/projects/api/use-get-templates';
import React from 'react';
import { LoaderIcon, TriangleAlert } from 'lucide-react';
import TemplateCard from './template-card';
import { useCreateProject } from '@/features/projects/api/use-create-project';
import { useRouter } from 'next/navigation';

const TemplatesSection = () => {
  const { data, isLoading, isError } = useGetTemplates({
    page: '1',
    limit: '4',
  });

  const mutation = useCreateProject();

  const router = useRouter();

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">从模板开始</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <TriangleAlert className="size-6 text-muted-foreground " />
          <p className="text-sm text-muted-foreground">
            获取模板失败，请稍后再试
          </p>
        </div>
      </div>
    );
  }

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

  if (!data?.length) {
    return null;
  }

  const onClick = (template: Template['data'][0]) => {
    mutation.mutate(
      {
        name: template.name,
        json: template.json,
        height: template.height,
        width: template.width,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}`);
        },
      }
    );
  };
  return (
    <div>
      <h3 className="font-semibold text-lg">从模板开始</h3>
      <div className="grid  grid-cols-2 md:grid-cols-4 mt-4 gap-4">
        {data.map((template) => (
          <TemplateCard
            key={template.id}
            imageSrc={template.thumbnailUrl || ''}
            title={template.name}
            width={template.width}
            height={template.height}
            isPremium={template.isPremium}
            onClick={() => onClick(template)}
            description={`${template.width} x ${template.height} px`}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplatesSection;
