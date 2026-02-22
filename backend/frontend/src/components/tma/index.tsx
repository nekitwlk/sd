'use client';

import { PropsWithChildren } from 'react';
import { SDKProvider } from '@tma.js/sdk-react';

export function TmaSDKProvider({ children }: PropsWithChildren) {
  return (
    <SDKProvider options={{ 
      cssVars: true, 
      acceptCustomStyles: true, 
      async: true 
    }}>
      {children}
    </SDKProvider>
  );
}