import React, { useState } from 'react';
import { Drawer } from 'antd';

export const SidePanelChat: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button className="text-red-600" onClick={showDrawer}>
        Why this result?
      </button>
      <Drawer
        title={
          <a target="_blank" className="inline-flex items-center" rel="noreferrer" href={'https://casdoor.com'}>
            <img alt="help" src="https://casbin.org/img/casbin.svg" className="h-5 w-5 mr-2 mb-1" />
            <div>AI Assistant</div>
          </a>
        }
        placement="right"
        onClose={onClose}
        open={open}
        width={500}
        styles={{
          body: { display: 'flex', flexDirection: 'column', height: '100%' },
          mask: { backgroundColor: 'transparent' },
        }}
      >
        <div className="flex-1 flex flex-col">
          <iframe
            id="iframeHelper"
            title={'iframeHelper'}
            src={'https://ai.casbin.com/?isRaw=1'}
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="no"
          />
        </div>
      </Drawer>
    </>
  );
};
