/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import ChatIcon from '@mui/icons-material/Chat';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';

interface Props {
  value: number;
  nick: string;
  onChange: (arg0: number) => void;
}

export default function FixedBottomNavigation({value, nick, onChange}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
  }, [value]);

  return (
    <Box sx={{pb: 7}} ref={ref}>
      <Paper
        sx={{position: 'fixed', bottom: 0, left: 0, right: 0}}
        elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            onChange(newValue);
          }}>
          <BottomNavigationAction label="IQ96" icon={<HomeIcon />} />
          <BottomNavigationAction label="Kort" icon={<MapIcon />} />
          <BottomNavigationAction label="Chat" icon={<ChatIcon />} />
          <BottomNavigationAction label={nick} icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
