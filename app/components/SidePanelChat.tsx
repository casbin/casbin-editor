'use client';

import { Drawer } from 'vaul';
import ChatWindow from './ChatWindow';

export function SidePanelChat() {
  return (
    <Drawer.Root direction="right">
      <Drawer.Trigger asChild>
        <button className='text-red-600'>Why this result?</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] fixed bottom-0 right-0">
          <div className="p-4 bg-white flex-1 flex flex-col h-full">
            <Drawer.Title className="font-medium mb-4">
              <a target="_blank" className="inline-flex items-center" rel="noreferrer" href={'https://casdoor.com'}>
                <img alt="help" src="https://casbin.org/img/casbin.svg" className="h-5 w-5 mr-2 mb-1" />
                <div>AI Assistant</div>
              </a>
            </Drawer.Title>
            <div className="flex-1 flex flex-col">
              <ChatWindow />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
