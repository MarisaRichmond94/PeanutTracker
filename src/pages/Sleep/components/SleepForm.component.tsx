import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { createNewSleep } from '@services';
import { toCapitalCase } from '@utils';
import { SleepLocation, SleepType } from '@models';

type SleepFormProps = {
  onSuccess: () => void;
}

export const SleepForm = ({ onSuccess }: SleepFormProps) => {
  const { firstName } = useProfile();

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
    setIsFormExpanded(false);
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

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
  };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    setDuration(Number(event.target.value));
  };

  const fields = (
    <>
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
        placeholder={`How long did ${firstName} sleep?`}
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
        placeholder={`Any additional details about ${firstName}'s sleep?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='string'
        value={notes}
      />
    </>
  );

  return (
    <Form
      fields={fields}
      isFormExpanded={isFormExpanded}
      type='Sleep'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
