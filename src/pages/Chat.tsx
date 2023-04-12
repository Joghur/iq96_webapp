import React, {memo, useState} from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {DocumentUser, useFirestoreMax4Days} from '../utils/hooks/useFirestore';
import {User} from 'firebase/auth';
import SkeletonComponent from '../components/SkeletonComponent';
import {convertEpochSecondsToDateString} from '../utils/dates';
import {Stack} from '@mui/system';
import DynamicText from '../components/DynamicText';

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  showLogin: (arg0: boolean) => void;
}

const Chat = ({authUser, documentUser, showLogin}: Props) => {
  const [days, setDays] = useState(4);
  const {docs, loading, addingDoc} = useFirestoreMax4Days(
    'chats',
    'createdAt',
    days,
  );
  const [input, setInput] = useState<string>('');

  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));

  if (!authUser) {
    return (
      <>
        <p>Mangler login...</p>
        <Button variant="outlined" onClick={() => showLogin(true)}>
          Login
        </Button>
      </>
    );
  }

  if (loading) {
    return <SkeletonComponent />;
  }

  const handleChangeDays = (days = 10) => {
    setDays(old => old + days);
  };

  const handleSubmit = () => {
    if (input.trim() !== '') {
      addingDoc({
        createdAt: new Date(),
        group: 'general',
        text: input.trim(),
        user: {
          id: authUser?.uid,
          name: documentUser?.nick,
          avatar: documentUser?.avatar,
        },
      });
      setInput('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: small ? '100vw' : '50vw',
      }}>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '16px',
        }}>
        <Stack direction="row" spacing={2}>
          <Button onClick={() => handleChangeDays()}>
            Vis beskeder for 10 dage tilbage
          </Button>
          <Button onClick={() => handleChangeDays(365)}>
            Gå et år tilbage
          </Button>
        </Stack>
        <Paper variant="outlined">
          {docs.length > 0 && (
            <List>
              {docs.map((message, index) => (
                <Stack direction="row">
                  <ListItem
                    key={index}
                    alignItems="flex-start"
                    sx={{
                      padding: '8px 16px',
                      textAlign:
                        authUser.uid === message.user.id ? 'right' : 'left',
                    }}>
                    {/* <ListItemAvatar>
                    <Avatar
                      alt={message.user.name}
                      src={`${documentUser?.avatar}.jpg`}
                    />
                  </ListItemAvatar> */}
                    <ListItemText
                      primary={`${
                        message.user.name
                      } - ${convertEpochSecondsToDateString(
                        message.createdAt.seconds,
                      )}`}
                      secondary={message.text}
                    />
                  </ListItem>
                </Stack>
              ))}
            </List>
          )}
          {docs.length === 0 && (
            <Box>
              <DynamicText sx={{p: 2}}>
                Der er ingen chats indenfor de sidste par dage. Prøv at trykke
                på de to knapper ovenover
              </DynamicText>
            </Box>
          )}
        </Paper>
      </Box>
      <Box sx={{display: 'flex', gap: '16px', padding: '16px'}}>
        <TextField
          label="Skriv din besked"
          variant="outlined"
          size="small"
          fullWidth
          value={input}
          onChange={event => setInput(event.target.value)}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default memo(Chat);
