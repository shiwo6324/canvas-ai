'use client';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDuplicateProject } from '@/features/projects/api/use-duplicate-project';
import { useDeleteProject } from '@/features/projects/api/use-delete-project';
import { useConfirm } from '@/hooks/use-confirm';

const ProjectsSection = () => {
  const { data, status, fetchNextPage, hasNextPage, isFetchNextPageError } =
    useGetProjects();

  const { mutate: duplicateProject, isPending: isDuplicateProjectPending } =
    useDuplicateProject();

  const { mutate: deleteProject, isPending: isDeleteProjectPending } =
    useDeleteProject();

  const [ConfirmDialog, confirm] = useConfirm({
    title: '确认删除',
    message: '确认删除项目',
  });

  const router = useRouter();

  const onDeleteProject = async (id: string) => {
    const result = await confirm();
    if (result) {
      deleteProject({ id });
    }
  };

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">最近的项目</h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <Loader className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">最近的项目</h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">获取项目失败</p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">最近的项目</h3>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground">暂无项目</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ConfirmDialog />
      <div className="">
        <h3 className="font-semibold text-lg">最近的项目</h3>
        <Table>
          <TableBody>
            {data.pages.map((group, index) => (
              <React.Fragment key={index}>
                {group.data.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell
                      onClick={() => router.push(`/editor/${project.id}`)}
                      className="flex items-center gap-x-2 font-medium cursor-pointer"
                    >
                      <FileIcon className="size-6" />
                      {project.name}
                    </TableCell>
                    <TableCell
                      onClick={() => router.push(`/editor/${project.id}`)}
                      className="hidden md:table-cell cursor-pointer"
                    >
                      {project.width} x {project.height} px
                    </TableCell>
                    <TableCell className="hidden md:table-cell cursor-pointer">
                      {formatDistanceToNow(project.updatedAt, {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="flex justify-end items-center">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button disabled={false} variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                          <DropdownMenuItem
                            className="h-10 cursor-pointer"
                            disabled={isDuplicateProjectPending}
                            onClick={() => {
                              duplicateProject({ id: project.id });
                            }}
                          >
                            <CopyIcon className="size-4 mr-2" />
                            复制
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="h-10 cursor-pointer"
                            disabled={isDeleteProjectPending}
                            onClick={() => {
                              onDeleteProject(project.id);
                            }}
                          >
                            <Trash2 className="size-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        {hasNextPage && (
          <div className="w-full flex items-center justify-center pt-4">
            <Button
              variant="ghost"
              onClick={() => fetchNextPage()}
              disabled={isFetchNextPageError}
            >
              加载更多
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
