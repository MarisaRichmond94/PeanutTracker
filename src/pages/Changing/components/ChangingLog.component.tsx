import { CardContent, Divider, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Changing, WasteColor, WasteConsistency, WasteType } from '@models';
import { deleteChanging, updateChanging } from '@services';
import { formatTimestamp, toCapitalCase } from '@utils';

interface ChangingLogProps {
  changing: Changing;
  onSuccess: () => void;
}

export const ChangingLog = ({ changing, onSuccess }: ChangingLogProps) => {
  const { firstName } = useProfile();

  const { id, color, consistency, notes, type, timestamp } = changing;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedColor, setUpdatedColor] = useState<WasteColor>(color);
  const [updatedConsistency, setUpdatedConsistency] = useState<WasteConsistency>(consistency);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);
  const [updatedTimestamp, setUpdatedTimestamp] = useState<Dayjs>(dayjs(timestamp));
  const [updatedType, setUpdatedType] = useState<WasteType>(type);

  const onDelete = async (idToUpdate: string) => {
    await deleteChanging(idToUpdate);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedColor(color);
    setUpdatedConsistency(consistency);
    setUpdatedNotes(notes);
    setUpdatedTimestamp(dayjs(timestamp));
    setUpdatedType(type);
    setIsInEditMode(false);
  };

  const onUpdate = async (idToUpdate: string) => {
    await updateChanging(idToUpdate, {
      color: updatedColor,
      consistency: updatedConsistency,
      notes: updatedNotes,
      timestamp: updatedTimestamp.toISOString(),
      type: updatedType,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>Diaper Change</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <LogRow field='Type' value={toCapitalCase(type)} />
        {color !== WasteColor.NOT_APPLICABLE && <LogRow field='Color' value={toCapitalCase(color)} />}
        {consistency !== WasteConsistency.NOT_APPLICABLE && <LogRow field='Consistency' value={toCapitalCase(consistency)} />}
        {!isNil(notes) && <LogRow field='Notes' value={notes} />}
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>Diaper Changing</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <EditLogRow field='Type' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='waste-type-select-label'
              id='waste-type-select'
              value={updatedType}
              onChange={(event: SelectChangeEvent<WasteType>) => setUpdatedType(event.target.value as WasteType)}
            >
              {
                Object.values(WasteType).map((it, index) =>
                  <MenuItem key={`waste-type-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        } />
        <EditLogRow field='Date' value={
          <MobileDateTimePicker
            value={updatedTimestamp}
            onChange={(newValue) => setUpdatedTimestamp(newValue ?? dayjs())}
            slotProps={{ textField: { className: 'skinny-text-field' } }}
          />
        } />
        <EditLogRow field='Color' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='waste-color-select-label'
              id='waste-color-select'
              value={updatedColor}
              onChange={(event: SelectChangeEvent<WasteColor>) => setUpdatedColor(event.target.value as WasteColor)}
            >
              {
                Object.values(WasteColor).map((it, index) =>
                  <MenuItem key={`waste-color-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        } />
        <EditLogRow field='Consistency' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='waste-consistency-select-label'
              id='waste-consistency-select'
              value={updatedConsistency}
              onChange={(event: SelectChangeEvent<WasteConsistency>) => setUpdatedConsistency(event.target.value as WasteConsistency)}
            >
              {
                Object.values(WasteConsistency).map((it, index) =>
                  <MenuItem key={`waste-consistency-${index}`} value={it}>
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
            id='changing-notes-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedNotes(event.target.value)}
            placeholder={`Any additional details about ${firstName}'s diaper change?`}
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
