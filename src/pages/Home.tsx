import {DocumentUser, useFirestore} from '../utils/hooks/useFirestore';
import React, {memo, useState} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {handleType} from '../utils/convertEventType';
import FormDialog from '../components/FormDialog';
import DynamicText from '../components/DynamicText';

interface FirebaseDate {
  seconds: number;
}

export type EventType = {
  id?: string;
  city: string;
  country: string;
  end: string;
  endDate?: FirebaseDate;
  start: string;
  startDate?: FirebaseDate;
  timezone: string;
  type: string;
  year: number;
  activities?: string;
  meetingPoints: string;
  notes?: string;
};

interface Props {
  documentUser: DocumentUser | null;
}

const Home = ({documentUser}: Props) => {
  const {
    docs: events,
    loading,
    updatingDoc,
  } = useFirestore<EventType>('events', 'startDate');
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  console.log('Home');

  if (loading) {
    return (
      <Stack alignItems="center" spacing={3}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!events) {
    return (
      <Stack alignItems="center">
        <Typography variant="subtitle1">
          Der er ingen events på dette tidspunkt
        </Typography>
      </Stack>
    );
  }

  const handleUpdate = async (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string | undefined,
  ) => {
    if (!id) {
      return;
    }

    setCurrentEvent(
      () => events?.filter(o => o.id === id)[0] as unknown as EventType,
    );
    setShowDialog(true);
  };

  const canEdit =
    documentUser?.isAdmin ||
    documentUser?.isBoard ||
    documentUser?.isSuperAdmin;

  return (
    <>
      <Box>
        {events.map(event => {
          return (
            <Paper elevation={4} sx={{m: 3, p: 2}}>
              <Stack spacing={2}>
                <Stack spacing={1} direction="row">
                  <DynamicText mobile="h6" desktop="h5">
                    {event?.type === 'tour'
                      ? `${handleType(event?.type)} de ${event.city}`
                      : handleType(event?.type)}
                  </DynamicText>
                  {canEdit && event.id && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={e => handleUpdate(e, event.id)}>
                      Opdater
                    </Button>
                  )}
                </Stack>
                {!!event?.startDate && (
                  <Stack>
                    <DynamicText>
                      <strong>Start:</strong>
                    </DynamicText>
                    <DynamicText mobile="caption" sx={{ml: 2}}>
                      {event.start}
                    </DynamicText>
                  </Stack>
                )}
                {!!event?.endDate && (
                  <Stack>
                    <DynamicText>
                      <strong>Slut:</strong>
                    </DynamicText>
                    <DynamicText mobile="caption" sx={{ml: 2}}>
                      {event.end}
                    </DynamicText>
                  </Stack>
                )}
                {event.meetingPoints.trim() && (
                  <Stack>
                    <DynamicText>
                      <strong>Mødesteder:</strong>
                    </DynamicText>
                    <DynamicText mobile="caption">
                      {event.meetingPoints
                        .split('--')
                        .map((f: string, index: number) => {
                          return (
                            <Box sx={{ml: 4}}>
                              <li key={index}>{f.trim()}</li>
                            </Box>
                          );
                        })}
                    </DynamicText>
                  </Stack>
                )}
                {event?.notes?.trim() && (
                  <Stack>
                    <DynamicText>
                      <strong>OBS:</strong>
                    </DynamicText>
                    <DynamicText mobile="caption">
                      {event.notes
                        .split('--')
                        .map((f: string, index: number) => {
                          return (
                            <Box sx={{ml: 4}}>
                              <li key={index}>{f.trim()}</li>
                            </Box>
                          );
                        })}
                    </DynamicText>
                  </Stack>
                )}
                {event?.activities?.trim() && (
                  <DynamicText>
                    <strong>Aktiviteter:</strong>
                    {event.activities.split('--').map((f: string) => {
                      return (
                        <Box sx={{ml: 4}}>
                          <DynamicText mobile="caption">
                            <li>{f.trim()}</li>
                          </DynamicText>
                        </Box>
                      );
                    })}
                  </DynamicText>
                )}
              </Stack>
            </Paper>
          );
        })}
      </Box>
      {showDialog && (
        <FormDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          event={currentEvent || undefined}
          updatingDoc={updatingDoc}
        />
      )}
    </>
  );
};

export default memo(Home);
