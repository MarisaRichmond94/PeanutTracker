import { CardContent, FormControl, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { Chore, RepeatType } from '@models';
import { deleteChore, updateChore } from '@services';
import { toCapitalCase } from '@utils';

interface ChoreLogProps {
  chore: Chore;
  onSuccess: () => void;
}

export const ChoreLog = ({ chore, onSuccess }: ChoreLogProps) => {
  const { id, description, lastCompletedAt, lastCompletedBy, name, repeatType } = chore;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState<string | null>(description);
  const [updatedName, setUpdatedName] = useState<string>(name);
  const [updatedRepeatType, setUpdatedRepeatType] = useState<RepeatType>(repeatType);

  const clearErrors = () => {
  };

  const onDelete = async (idToUpdate: string) => {
    await deleteChore(idToUpdate);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedDescription(description);
    setUpdatedName(name);
    setUpdatedRepeatType(repeatType);
    setIsInEditMode(false);
  };

  const onUpdate = async (idToUpdate: string) => {
    clearErrors();

    await updateChore(idToUpdate, {
      description: updatedDescription,
      lastCompletedAt,
      lastCompletedBy,
      name: updatedName,
      repeatType: updatedRepeatType,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Name' value={name} />
        <LogRow field='Description' value={description} />
        <LogRow field='Repeat' value={repeatType} />
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <EditLogRow field='Name' value={
          <TextField
            className='skinny-text-field'
            id='chore-name-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedName(event.target.value)}
            placeholder='Give the chore a meaningful name'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={updatedName}
          />
        } />
        <EditLogRow field='Description' value={
          <TextField
            className='skinny-text-field'
            id='chore-description-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedDescription(event.target.value)}
            placeholder='Include any details about the chore'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={updatedDescription}
          />
        } />
        <EditLogRow field='Repeat' value={
          <FormControl fullWidth>
            <Select
              className='skinny-select'
              labelId='chore-repeat-type-select-label'
              id='chore-repeat-type-select'
              value={updatedRepeatType!}
              onChange={(event: SelectChangeEvent<RepeatType>) => setUpdatedRepeatType(event.target.value as RepeatType)}
            >
              {
                Object.values(RepeatType).map((it, index) =>
                  <MenuItem key={`chore-repeat-type-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
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
