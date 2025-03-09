import { CardContent, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Note, NotePriority } from '@models';
import { deleteNote, updateNote } from '@services';
import { formatTimestamp, toCapitalCase } from '@utils';

interface NoteRecordProps {
  note: Note;
  onSuccess: () => void;
}

export const NoteRecord = ({ note, onSuccess }: NoteRecordProps) => {
  const { firstName } = useProfile();

  const { id, priority, timestamp, value } = note;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedPriority, setUpdatedPriority] = useState<NotePriority>(priority);
  const [updatedValue, setUpdatedValue] = useState<string | undefined>(value);

  const onDelete = async () => {
    await deleteNote(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedPriority(priority);
    setUpdatedValue(value);
    setIsInEditMode(false);
  };

  const onUpdate = async () => {
    await updateNote(id, {
      priority: updatedPriority,
      value: updatedValue,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>Note</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <LogRow field='Priority' value={toCapitalCase(priority)} />
        <LogRow field='Value' value={value} />
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>Note</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <EditLogRow field='Type' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              id='note-priority-select'
              labelId='note-priority-select-label'
              onChange={(event: SelectChangeEvent<NotePriority>) => setUpdatedPriority(event.target.value as NotePriority)}
              required
              value={updatedPriority}
            >
              {
                Object.values(NotePriority).map((it, index) =>
                  <MenuItem key={`note-priority-${index}`} value={it}>
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
            id='note-value-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedValue(event.target.value)}
            placeholder={`What do we need to know about ${firstName}?`}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={updatedValue}
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
