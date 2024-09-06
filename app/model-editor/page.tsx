'use client';

import React from 'react';
import { ModelEditor } from '../components/ModelEditor';

const ModelEditorPage = ({ searchParams }: { searchParams: { model?: string } }) => {
  const initialValue = searchParams.model ? decodeURIComponent(searchParams.model) : '';

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ModelEditor initialValue={initialValue} />
    </div>
  );
};

export default ModelEditorPage;