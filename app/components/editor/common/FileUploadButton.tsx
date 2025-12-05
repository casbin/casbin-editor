import { useRef } from 'react';
import clsx from 'clsx';
import { Upload } from 'lucide-react';
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
                'rounded-lg',
                'px-2',
                'py-1',
                'border border-primary',
                'text-primary',
                'bg-secondary',
                'hover:bg-primary hover:text-primary-foreground',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md',
              )}
            >
              <Upload className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-white dark:bg-gray-800 text-primary border border-primary shadow-lg">
            <p>{t('Upload File')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
