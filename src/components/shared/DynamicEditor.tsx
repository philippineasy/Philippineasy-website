'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { OutputData } from '@editorjs/editorjs';

interface EditorProps {
  data?: OutputData;
  onChange(data: OutputData): void;
  holder: string;
}

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const DynamicEditor = (props: EditorProps) => {
  return <Editor {...props} />;
};

export default memo(DynamicEditor);
