import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
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

  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<Dayjs>(dayjs());
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [location, setLocation] = useState<SleepLocation>(SleepLocation.CRIB);
  const [notes, setNotes] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());
  const [type, setType] = useState<SleepType>(SleepType.NAP);

  const clearErrors = () => {
    setDurationErrorText(undefined);
  };

  const clearState = () => {
    setEndTime(dayjs());
    setLocation(SleepLocation.CRIB);
    setNotes(null);
    setStartTime(dayjs());
    setType(SleepType.NAP);
  };

  const onDiscard = () => {
    clearErrors();
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    clearErrors();
    if (startTime.isAfter(endTime)) {
      setDurationErrorText('Start time cannot come after end time');
      return;
    }
    if (startTime.isSame(endTime)) {
      setDurationErrorText('End time cannot match start time');
      return;
    }

    await createNewSleep({
      duration: endTime.diff(startTime, 'minute'),
      endTime: endTime.toISOString(),
      location,
      notes,
      startTime: startTime.toISOString(),
      type,
    });

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
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
      <MobileDateTimePicker
        label='Start Time'
        value={startTime}
        onChange={(newValue) => setStartTime(newValue ?? dayjs())}
        slotProps={{
          textField: {
            error: startTime.isAfter(endTime),
            helperText: startTime.isAfter(endTime) ? durationErrorText : undefined
          },
        }}
      />
      <MobileDateTimePicker
        label='End Time'
        value={endTime}
        onChange={(newValue) => setEndTime(newValue ?? dayjs())}
        slotProps={{
          textField: {
            error: !isNil(durationErrorText) && startTime.isSame(endTime),
            helperText: startTime.isSame(endTime) ? durationErrorText : undefined
          },
        }}
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
