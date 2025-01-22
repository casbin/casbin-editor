import React, { useRef } from 'react';
import clsx from 'clsx';

interface FileUploadButtonProps {
  onFileContent: (content: string) => void;
  accept?: string;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileContent, accept = '.txt,.conf,.csv', className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileContent(content);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      <button
        onClick={handleClick}
        className={clsx(
          'flex items-center gap-1',
          'rounded',
          'px-2',
          'border border-[#453d7d]',
          'text-[#453d7a]',
          'bg-[#efefef]',
          'hover:bg-[#453d7d] hover:text-white',
          'transition-colors duration-500',
        )}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <span>Load</span>
      </button>
    </div>
  );
};
