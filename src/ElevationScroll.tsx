import * as React from 'react';
import { useScrollTrigger } from '@mui/material';

export function ElevationScroll({ children }: { children: React.ReactElement; }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}
