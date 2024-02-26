import { clsx } from 'clsx';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function HiddenButton({ open, setOpen }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={clsx('h-10 w-10')}
            onClick={() => {
              return setOpen(!open);
            }}
          >
            <svg
              style={{
                width: '100%',
                height: '100%',
                transform: open ? 'rotateZ(0deg)' : 'rotateZ(180deg)',
              }}
              viewBox="0 0 24 24"
            >
              <path
                fill={'currentColor'}
                d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
              />
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{open ? 'hidden Custom config' : 'show Custom config'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
