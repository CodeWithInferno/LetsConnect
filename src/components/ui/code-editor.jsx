// components/ui/code-snippet.jsx
"use client";

import { useState } from 'react';

export function CodeSnippet({ value, onChange, placeholder }) {
  const [code, setCode] = useState(value || '');

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCode(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative rounded-md border overflow-hidden">
      <pre className="absolute top-2 left-2 text-sm text-muted-foreground pointer-events-none">
        {code ? '' : placeholder}
      </pre>
      <textarea
        value={code}
        onChange={handleChange}
        className="w-full h-48 p-4 font-mono text-sm bg-transparent resize-none focus:outline-none"
        spellCheck="false"
      />
    </div>
  );
}