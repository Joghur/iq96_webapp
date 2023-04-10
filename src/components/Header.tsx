import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import DynamicText from './DynamicText';

interface Props {
  nick?: string | null;
  banner: string;
}

export default function ButtonAppBar({nick, banner}: Props) {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="sticky">
        <Toolbar>
          <DynamicText mobile="subtitle1" desktop="h6" sx={{flexGrow: 1}}>
            {banner}
          </DynamicText>

          {nick && (
            <DynamicText mobile="body2" desktop="body1">
              {nick}
            </DynamicText>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
