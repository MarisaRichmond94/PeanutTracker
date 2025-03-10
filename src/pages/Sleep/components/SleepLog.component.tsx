import { CardContent, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Sleep, SleepLocation, SleepType } from '@models';
import { deleteSleep, updateSleep } from '@services';
import { formatDate, toCapitalCase } from '@utils';

interface SleepLogProps {
  sleep: Sleep;
  onSuccess: () => void;
}

export const SleepLog = ({ sleep, onSuccess }: SleepLogProps) => {
  const { firstName } = useProfile();

  const { id, endTime, duration, location, notes, startTime, type } = sleep;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedDuration, setUpdatedDuration] = useState<number | undefined>(duration);
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedLocation, setUpdatedLocation] = useState<SleepLocation>(location);
  const [updatedNotes, setUpdatedNotes] = useState<string | undefined>(notes);
  const [updatedType, setUpdatedType] = useState<SleepType>(type);

  const clearErrors = () => {
    setDurationErrorText(undefined);
  };

  const onDelete = async () => {
    await deleteSleep(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedDuration(duration);
    setUpdatedLocation(location);
    setUpdatedNotes(notes);
    setUpdatedType(type);
    setIsInEditMode(false);
  };

  const onUpdate = async () => {
    clearErrors();
    if (isNil(updatedDuration) || updatedDuration <= 0) {
      setDurationErrorText('Missing required duration');
      return;
    }

    await updateSleep(id, {
      duration: updatedDuration,
      location: updatedLocation,
      notes: updatedNotes,
      startTime: new Date(new Date(endTime).getTime() - updatedDuration * 60 * 1000).toISOString(),
      type: updatedType,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    setUpdatedDuration(Number(event.target.value));
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(startTime)} />
        <LogRow field='Duration' value={duration} />
        <LogRow field='Location' value={location} />
        <LogRow field='Type' value={type} />
        <LogRow field='Notes' value={notes} />
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(startTime)} />
        <EditLogRow field='Duration' value={
          <TextField
            className='skinny-text-field'
            error={!isNil(durationErrorText)}
            helperText={durationErrorText}
            id='sleep-duration-field'
            onChange={updateDuration}
            placeholder={`How long did ${firstName} sleep?`}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={updatedDuration}
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
