import { useRef } from 'react';
import clsx from 'clsx';
import { useLang } from '@/app/context/LangContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface FileUploadButtonProps {
  onFileContent: (content: string) => void;
  accept?: string;
  className?: string;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileContent, accept = '.txt,.conf,.csv', className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLang();
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              className={clsx(
                'flex items-center gap-1',
                'rounded',
                'px-2',
                'py-1',
                'border border-[#453d7d]',
                'text-[#453d7a]',
                'bg-[#efefef]',
                'hover:bg-[#453d7d] hover:text-white',
                'transition-colors duration-500',
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 1051 1024" fill="currentColor">
                {/* eslint-disable-next-line max-len */}
                <path d="M525.814398 698.649244a43.115789 43.115789 0 0 0 42.991894-42.991894V131.4536l180.268602 180.268602a43.983061 43.983061 0 0 0 60.709014 0 42.991894 42.991894 0 0 0 0-60.709014L582.31095 23.168542a79.293406 79.293406 0 0 0-111.506352 0L241.968784 251.013188a42.867998 42.867998 0 0 0 60.709014 60.709014L483.194192 131.4536v524.20375a42.991894 42.991894 0 0 0 42.620206 42.991894z M863.926437 117.08167a42.991894 42.991894 0 1 0 0 85.859891A102.09026 102.09026 0 0 1 966.388385 304.907925v531.26582a102.09026 102.09026 0 0 1-101.966364 101.966364H187.826255a102.09026 102.09026 0 0 1-101.966364-101.966364V304.907925a102.09026 102.09026 0 0 1 101.966364-101.966364 42.991894 42.991894 0 0 0 0-85.859891A188.074047 188.074047 0 0 0 0 304.907925v531.26582a188.074047 188.074047 0 0 0 187.826255 187.826255h676.100182a188.074047 188.074047 0 0 0 187.826255-187.826255V304.907925A188.074047 188.074047 0 0 0 863.926437 117.08167z" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-white text-[#453d7d] border border-[#453d7d]">
            <p>{t('Upload File')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
