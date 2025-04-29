import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { createNewSleep } from '@services';
import { toCapitalCase } from '@utils';
import { SleepEntity, SleepLocation, SleepType } from '@models';

type SleepFormProps = {
  onSuccess: () => void;
}

export const SleepForm = ({ onSuccess }: SleepFormProps) => {
  const { firstName } = useProfile();

  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<Dayjs>(dayjs().add(1, 'minute'));
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [location, setLocation] = useState<SleepLocation>(SleepLocation.CONTACT_NAP);
  const [notes, setNotes] = useState<string | null>(null);
  const [sleeper, setSleeper] = useState<SleepEntity>(SleepEntity.BABY);
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
      entity: sleeper,
      duration: endTime.diff(startTime, 'minute'),
      endTime: endTime.toISOString(),
      location: sleeper === SleepEntity.BABY ? location : null,
      notes,
      startTime: startTime.toISOString(),
      type: sleeper === SleepEntity.BABY ? type : null,
    });

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    // pull latest time every time there's a new log
    setStartTime(dayjs());
    setEndTime(dayjs().add(1, 'minute'));
    // expand the form
    setIsFormExpanded(isExpanded);
  };

  const fields = (
    <>
      <FormControl fullWidth>
        <InputLabel id='sleep-entity-select-label'>Who is sleeping?</InputLabel>
        <Select
          labelId='sleep-entity-select-label'
          id='sleep-entity-select'
          value={sleeper}
          label='Who is sleeping?'
          onChange={(event: SelectChangeEvent<SleepEntity>) => setSleeper(event.target.value as SleepEntity)}
        >
          {
            Object.values(SleepEntity).map((it, index) =>
              <MenuItem key={`sleep-entity-${index}`} value={it}>
                {it}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
      {
        sleeper === SleepEntity.BABY &&
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
      }
      {
        sleeper === SleepEntity.BABY &&
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
      }
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
