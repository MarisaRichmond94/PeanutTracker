import { CardContent, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Sleep, SleepEntity, SleepLocation, SleepType } from '@models';
import { deleteSleep, updateSleep } from '@services';
import { formatDate, formatMinutesToHoursAndMinutes, toCapitalCase } from '@utils';

interface SleepLogProps {
  sleep: Sleep;
  onSuccess: () => void;
}

export const SleepLog = ({ sleep, onSuccess }: SleepLogProps) => {
  const { firstName } = useProfile();

  const { id, endTime, entity, duration, location, notes, startTime, type } = sleep;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedEndTime, setUpdatedEndTime] = useState<Dayjs>(dayjs(endTime));
  const [updatedEntity, setUpdatedEntity] = useState<SleepEntity>(entity || SleepEntity.BABY);
  const [updatedLocation, setUpdatedLocation] = useState<SleepLocation | null>(location || SleepLocation.CONTACT_NAP);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);
  const [updatedStartTime, setUpdatedStartTime] = useState<Dayjs>(dayjs(startTime));
  const [updatedType, setUpdatedType] = useState<SleepType | null>(type || SleepType.NAP);

  const clearErrors = () => {
    setDurationErrorText(undefined);
  };

  const onDelete = async (idToUpdate: string) => {
    await deleteSleep(idToUpdate);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedEndTime(dayjs(endTime));
    setUpdatedEntity(entity || SleepEntity.BABY);
    setUpdatedLocation(location || SleepLocation.CONTACT_NAP);
    setUpdatedNotes(notes);
    setUpdatedStartTime(dayjs(startTime));
    setUpdatedType(type || SleepType.NAP);
    setIsInEditMode(false);
  };

  const onUpdate = async (idToUpdate: string) => {
    clearErrors();
    if (updatedStartTime.isAfter(updatedEndTime)) {
      setDurationErrorText('Start time cannot come after end time');
      return;
    }
    if (updatedStartTime.isSame(updatedEndTime)) {
      setDurationErrorText('End time cannot match start time');
      return;
    }

    await updateSleep(idToUpdate, {
      entity: updatedEntity,
      duration: updatedEndTime.diff(updatedStartTime, 'minute'),
      endTime: updatedEndTime.toISOString(),
      location: updatedEntity === SleepEntity.BABY ? updatedLocation : null,
      notes: updatedNotes,
      startTime: updatedStartTime.toISOString(),
      type: updatedEntity === SleepEntity.BABY ? updatedType : null,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Sleeper' value={entity || SleepEntity.BABY} />
        <LogRow field='Date' value={formatDate(startTime)} />
        <LogRow field='Duration' value={formatMinutesToHoursAndMinutes(duration)} />
        {!isNil(location) && <LogRow field='Location' value={toCapitalCase(location)} />}
        {!isNil(type) && <LogRow field='Type' value={toCapitalCase(type)} />}
        {!isNil(notes) && <LogRow field='Notes' value={notes} />}
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(startTime)} />
        <EditLogRow field='Sleeper' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              id='sleep-entity-select'
              value={updatedEntity}
              onChange={(event: SelectChangeEvent<SleepEntity>) => setUpdatedEntity(event.target.value as SleepEntity)}
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
          }
        />
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
        {
          updatedEntity === SleepEntity.BABY &&
          <EditLogRow field='Location' value={
            <FormControl fullWidth>
              <Select
                className='skinny-select'
                labelId='sleep-location-select-label'
                id='sleep-location-select'
                value={updatedLocation!}
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
        }
        {
          updatedEntity === SleepEntity.BABY &&
          <EditLogRow field='Type' value={
            <FormControl fullWidth>
              <Select
                className='skinny-select'
                labelId='sleep-type-select-label'
                id='sleep-type-select'
                value={updatedType!}
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
        }
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
      id={id}
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
