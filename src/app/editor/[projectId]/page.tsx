import Editor from '@/features/editor/components/editor';
import React from 'react';
import { protectServer } from '@/features/auth/utils';

const EditorProjectPage = async () => {
  await protectServer();

  return <Editor />;
};

export default EditorProjectPage;
