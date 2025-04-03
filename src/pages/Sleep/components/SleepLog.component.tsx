import { CardContent, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Sleep, SleepLocation, SleepType } from '@models';
import { deleteSleep, updateSleep } from '@services';
import { formatDate, formatMinutesToHoursAndMinutes, toCapitalCase } from '@utils';

interface SleepLogProps {
  sleep: Sleep;
  onSuccess: () => void;
}

export const SleepLog = ({ sleep, onSuccess }: SleepLogProps) => {
  const { firstName } = useProfile();

  const { id, endTime, duration, location, notes, startTime, type } = sleep;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedEndTime, setUpdatedEndTime] = useState<Dayjs>(dayjs(endTime));
  const [updatedLocation, setUpdatedLocation] = useState<SleepLocation>(location);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);
  const [updatedStartTime, setUpdatedStartTime] = useState<Dayjs>(dayjs(startTime));
  const [updatedType, setUpdatedType] = useState<SleepType>(type);

  const clearErrors = () => {
    setDurationErrorText(undefined);
  };

  const onDelete = async () => {
    await deleteSleep(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedEndTime(dayjs(endTime));
    setUpdatedLocation(location);
    setUpdatedNotes(notes);
    setUpdatedStartTime(dayjs(startTime));
    setUpdatedType(type);
    setIsInEditMode(false);
  };

  const onUpdate = async () => {
    clearErrors();
    if (updatedStartTime.isAfter(updatedEndTime)) {
      setDurationErrorText('Start time cannot come after end time');
      return;
    }
    if (updatedStartTime.isSame(updatedEndTime)) {
      setDurationErrorText('End time cannot match start time');
      return;
    }

    await updateSleep(id, {
      duration: updatedEndTime.diff(updatedStartTime, 'minute'),
      endTime: updatedEndTime.toISOString(),
      location: updatedLocation,
      notes: updatedNotes,
      startTime: updatedStartTime.toISOString(),
      type: updatedType,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(startTime)} />
        <LogRow field='Duration' value={formatMinutesToHoursAndMinutes(duration)} />
        <LogRow field='Location' value={location} />
        <LogRow field='Type' value={type} />
        {!isNil(notes) && <LogRow field='Notes' value={notes} />}
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(startTime)} />
        <EditLogRow field='Start' value={
          <MobileDateTimePicker
            value={updatedStartTime}
            onChange={(newValue) => setUpdatedStartTime(newValue ?? dayjs())}
            slotProps={{
              textField: {
                className: 'skinny-text-field',
                error: updatedStartTime.isAfter(updatedEndTime),
                helperText: updatedStartTime.isAfter(updatedEndTime) ? durationErrorText : undefined
              },
            }}
          />
        } />
        <EditLogRow field='End' value={
          <MobileDateTimePicker
            value={updatedEndTime}
            onChange={(newValue) => setUpdatedEndTime(newValue ?? dayjs())}
            slotProps={{
              textField: {
                className: 'skinny-text-field',
                error: !isNil(durationErrorText) && updatedStartTime.isSame(updatedEndTime),
                helperText: updatedStartTime.isSame(updatedEndTime) ? durationErrorText : undefined
              },
            }}
          />
        } />
        <EditLogRow field='Location' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='sleep-location-select-label'
              id='sleep-location-select'
              value={updatedLocation}
              onChange={(event: SelectChangeEvent<SleepLocation>) => setUpdatedLocation(event.target.value as SleepLocation)}
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
        } />
        <EditLogRow field='Type' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='sleep-type-select-label'
              id='sleep-type-select'
              value={updatedType}
              onChange={(event: SelectChangeEvent<SleepType>) => setUpdatedType(event.target.value as SleepType)}
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
        } />
        <EditLogRow field='Notes' value={
          <TextField
            className='skinny-text-field'
            id='sleep-notes-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedNotes(event.target.value)}
            placeholder={`Any additional details about ${firstName}'s sleep?`}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={updatedNotes}
          />
        } />
      </x.div>
    </CardContent>
  );

  return (
    <Log
      isInEditMode={isInEditMode}
      getCardContent={getCardContent}
      getEditableCardContent={getEditableCardContent}
      onDelete={onDelete}
      onDiscard={onDiscard}
      onUpdate={onUpdate}
      setIsInEditMode={setIsInEditMode}
    />
  );
};
