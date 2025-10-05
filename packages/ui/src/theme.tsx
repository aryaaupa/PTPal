import React, { PropsWithChildren, useEffect } from 'react';
import { cssVariables } from './tokens';

export function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'vitalize-theme';
      style.innerHTML = cssVariables;
      document.head.appendChild(style);
      return () => style.remove();
    }
  }, []);
  return <>{children}</>;
}
