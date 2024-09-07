'use client';

import React, { useEffect, useState } from 'react';
import { ModelEditor } from '../components/ModelEditor';

export default function ModelEditorPage() {
  const [initialValue, setInitialValue] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modelParam = params.get('model');
    if (modelParam) {
      setInitialValue(decodeURIComponent(modelParam));
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ModelEditor initialValue={initialValue} />
    </div>
  );
}
