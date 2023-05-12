import React, {memo, useState} from 'react';
import {
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
} from '@mui/material';
import {DocumentUser, useFirestoreMax4Days} from '../utils/hooks/useFirestore';
import {User} from 'firebase/auth';
import SkeletonComponent from '../components/SkeletonComponent';
import {convertEpochSecondsToDateString} from '../utils/dates';
import {Stack} from '@mui/system';
import DynamicText from '../components/DynamicText';
import {colors} from '../utils/colours';
import moment from 'moment';

type FirebaseTimestamp = {
  seconds: number;
};

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface ChatType {
  createdAt: Date | FirebaseTimestamp;
  group: string;
  text: string;
  user: ChatUser;
}

interface Props {
  authUser: User | null;
  documentUser: DocumentUser | null;
  showLogin: (arg0: boolean) => void;
}

const Chat = ({authUser, documentUser, showLogin}: Props) => {
  const [days, setDays] = useState(4);
  const {
    docs: chats,
    loading,
    addingDoc,
  } = useFirestoreMax4Days('chats', 'createdAt', days);
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
          name: documentUser?.nick || 'Ukendt',
          avatar: documentUser?.avatar,
        },
      });
      setInput('');
    }
  };

  let dayAsMilliSeconds = 0;
  let showDay = true;

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
          {chats.length > 0 && (
            <List>
              {chats.map((chat, index) => {
                const isChatUser = chat.user.name === documentUser?.nick;

                const isSame = moment(chat.createdAt.seconds * 1000).isSame(
                  moment(dayAsMilliSeconds),
                  'date',
                );

                if (!isSame) {
                  showDay = true;
                } else {
                  showDay = false;
                }
                dayAsMilliSeconds = chat.createdAt.seconds * 1000;

                return (
                  <>
                    {showDay && (
                      <ListItem
                        key={index}
                        alignItems="center"
                        sx={{
                          justifyContent: 'center',
                        }}>
                        <Chip
                          label={convertEpochSecondsToDateString(
                            chat.createdAt.seconds,
                            'D/MMM-YYYY',
                          )}
                        />
                      </ListItem>
                    )}
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{
                        justifyContent: isChatUser ? 'flex-end' : 'flex-start',
                      }}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          ml: isChatUser ? 8 : 2,
                          mr: isChatUser ? 2 : 8,
                          backgroundColor: isChatUser
                            ? colors.lightSuccess
                            : colors.button,
                        }}>
                        <Stack direction="row" spacing={1}>
                          <Avatar
                            alt={chat.user.name}
                            src={`${process.env.PUBLIC_URL}/images/avatars/${chat.user?.avatar}.png`}
                          />
                          <Stack>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center">
                              <DynamicText desktop="body1" mobile="body2">
                                {chat.user.name}
                              </DynamicText>
                              <DynamicText desktop="body2" mobile="caption">
                                {convertEpochSecondsToDateString(
                                  chat.createdAt.seconds,
                                  'HH:mm',
                                )}
                              </DynamicText>
                            </Stack>
                            <DynamicText desktop="body2" mobile="caption">
                              {chat.text}
                            </DynamicText>
                          </Stack>
                        </Stack>
                      </Paper>
                    </ListItem>
                  </>
                );
              })}
            </List>
          )}
          {chats.length === 0 && (
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

// primary={`${
//     message.user.name
//   } - ${convertEpochSecondsToDateString(
//       message.createdAt.seconds,
//       )}`}
// secondary={message.text}
// />
