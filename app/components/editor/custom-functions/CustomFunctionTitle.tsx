import React from 'react';

interface CustomFunctionTitleProps {
  title: string;
  textClass: string;
}

export const CustomFunctionTitle: React.FC<CustomFunctionTitleProps> = ({ title, textClass }) => {
  return (
    <div className={'pt-6 h-12 pl-3 flex items-center font-bold text-lg'}>
      <div className={textClass}>{title}</div>
    </div>
  );
};
