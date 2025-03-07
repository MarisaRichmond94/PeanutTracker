import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { createNewSleep } from '@services';
import { WhiteButton } from '@styles';
import { toCapitalCase } from '@utils';
import { SleepLocation, SleepType } from '@models';

type SleepFormProps = {
  onSuccess: () => void;
}

export const SleepForm = ({ onSuccess }: SleepFormProps) => {
  const [duration, setDuration] = useState<number | undefined>();
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [location, setLocation] = useState<SleepLocation>(SleepLocation.CRIB);
  const [notes, setNotes] = useState<string | undefined>();
  const [type, setType] = useState<SleepType>(SleepType.NAP);

  const clearErrors = () => {
    setDurationErrorText(undefined);
  };

  const clearState = () => {
    setDuration(undefined);
    setLocation(SleepLocation.CRIB);
    setNotes(undefined);
    setType(SleepType.NAP);
  };

  const onDiscard = () => {
    clearErrors();
    clearState();
  };

  const onSubmit = async () => {
    clearErrors();
    if (isNil(duration) || duration <= 0) {
      setDurationErrorText('Missing required duration');
      return;
    }

    await createNewSleep({
      duration,
      endTime: new Date().toISOString(),
      location,
      notes,
      startTime: new Date(new Date().getTime() - duration * 60 * 1000).toISOString(),
      type,
    });

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState =
    (_: SyntheticEvent, isExpanded: boolean) => {
      setIsFormExpanded(isExpanded);
    };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    setDuration(Number(event.target.value));
  };

  return (
    <Accordion expanded={isFormExpanded} onChange={onToggleFormState}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='sleep-form-content'
        id='sleep-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Log New Sleep</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div display='flex' flexDirection='column' gap='20px'>
          <FormControl fullWidth>
            <InputLabel id='sleep-type-select-label'>Type</InputLabel>
            <Select
              id='sleep-type-select'
              label='Type'
              labelId='sleep-type-select-label'
              onChange={(event: SelectChangeEvent<SleepType>) => setType(event.target.value as SleepType)}
              required
              value={type}
            >
              {
                Object.values(SleepType).map((it, index) =>
                  <MenuItem key={`sleep-type-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='sleep-location-select-label'>Location</InputLabel>
            <Select
              labelId='sleep-location-select-label'
              id='sleep-location-select'
              value={location}
              label='Location'
              onChange={(event: SelectChangeEvent<SleepLocation>) => setLocation(event.target.value as SleepLocation)}
            >
              {
                Object.values(SleepLocation).map((it, index) =>
                  <MenuItem key={`sleep-location-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
          <TextField
            error={!isNil(durationErrorText)}
            helperText={durationErrorText}
            id='sleep-duration-field'
            label='Duration In Minutes'
            onChange={updateDuration}
            placeholder='how long did peanut sleep?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={duration}
          />
          <TextField
            id='sleep-notes-field'
            label='Notes'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
            placeholder='include any relevant details'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={notes}
          />
        </x.div>
      </AccordionDetails>
      <AccordionActions>
        <x.div display='flex' gap='20px' justifyContent='right'>
          <WhiteButton onClick={onDiscard} variant='outlined'>
            Discard
          </WhiteButton>
          <Button onClick={onSubmit} variant='contained'>
            Log
          </Button>
        </x.div>
      </AccordionActions>
    </Accordion>
  );
};
