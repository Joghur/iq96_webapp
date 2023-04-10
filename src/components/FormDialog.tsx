import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {EventType} from '../pages/Home';
import {useState} from 'react';
import {DialogContentText, Stack, Typography} from '@mui/material';
import {styled} from '@mui/system';

interface Props {
  open: boolean;
  onClose: () => void;
  event?: EventType;
  editable?: boolean;
  updatingDoc: any;
}

export const BoldText = styled(Typography)({
  fontWeight: 'bold',
});

export const FormFieldLabel = styled(BoldText)({
  marginBottom: -12,
});

const initialEvent: EventType = {
  type: '',
  city: 'Kokkedal',
  country: 'Danmark',
  start: '',
  end: '',
  timezone: 'Europe/Copenhagen',
  year: 0,
  activities: `
  kl. xx - Guided tur i byen, mødested udenfor hotellet kl. xx:xx -- 
  kl. xx - Restaurant, mødested udenfor hotellet kl. xx:xx
  `,
  meetingPoints: `
  Kokkedal ved Centerpubben kl. xx -- 
  Hovedbanegården under uret kl. xx
  `,
};

export default function FormDialog({
  open,
  onClose,
  event,
  editable = true,
  updatingDoc,
}: Props) {
  const [changedEvent, setChangingEvent] = useState<EventType>(
    event || initialEvent,
  );

  const handleClose = () => {
    onClose();
  };

  const handleChange = (event: any) => {
    console.log('event', event);
    if (event.target) {
      const {id, value} = event.target;

      console.log('handleChange value', value);
      setChangingEvent(oldEvent => ({
        ...oldEvent,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (editable) {
      await updatingDoc(changedEvent.id, {
        ...changedEvent,
      });
    }
    onClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          console.log('first');
        }}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Opdatér begivenhed</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Stack direction="row">
              <Stack>
                <BoldText variant="subtitle1">Start dato</BoldText>
                <TextField
                  value={changedEvent.start}
                  id="start"
                  onChange={handleChange}
                />
              </Stack>
              <Stack>
                <BoldText variant="subtitle1">Slut dato</BoldText>
                <TextField
                  value={changedEvent.end}
                  id="end"
                  onChange={handleChange}
                />
              </Stack>
            </Stack>
            <Stack>
              <DialogContentText>
                Brug "--" til at separere emner
              </DialogContentText>
              <FormFieldLabel variant="subtitle1">OBS!</FormFieldLabel>
              <TextField
                autoFocus
                multiline
                value={changedEvent.notes}
                onChange={handleChange}
                margin="dense"
                id="notes"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Stack>
            <Stack>
              <FormFieldLabel variant="subtitle1">Mødesteder</FormFieldLabel>
              <TextField
                autoFocus
                multiline
                value={changedEvent.meetingPoints}
                onChange={handleChange}
                margin="dense"
                id="meetingPoints"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Stack>
            <Stack>
              <FormFieldLabel variant="subtitle1">Aktiviteter</FormFieldLabel>
              <TextField
                autoFocus
                multiline
                value={changedEvent.activities}
                onChange={handleChange}
                margin="dense"
                id="activities"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Fortryd</Button>
          <Button onClick={handleSubmit}>Opdatér</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
