import { Box, Button, Card, CardActions, CardContent, TextField } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, LogRow } from '@components';
import { Growth } from '@models';
import { deleteGrowth, updateGrowth } from '@services';
import { formatTimestamp } from '@utils';

interface GrowthLogProps {
  growth: Growth;
  onSuccess: () => void;
}

export const GrowthLog = ({ growth, onSuccess }: GrowthLogProps) => {
  const { id, headCircumference, height, notes, weight, timestamp } = growth;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedHeadCircumference, setUpdatedHeadCircumference] = useState<number | undefined>(headCircumference);
  const [updatedHeight, setUpdatedHeight] = useState<number | undefined>(height);
  const [updatedNotes, setUpdatedNotes] = useState<string | undefined>(notes);
  const [updatedWeight, setUpdatedWeight] = useState<number | undefined>(weight);

  const onDelete = async () => {
    await deleteGrowth(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedHeadCircumference(headCircumference);
    setUpdatedHeight(height);
    setUpdatedNotes(notes);
    setUpdatedWeight(weight);
    setIsInEditMode(false);
  };

  const onEdit = async () => setIsInEditMode(true);

  const onUpdate = async () => {
    await updateGrowth(id, {
      headCircumference: updatedHeadCircumference,
      height: updatedHeight,
      notes: updatedNotes,
      weight: updatedWeight,
    });
    await onSuccess();
    setIsInEditMode(false);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <LogRow field='Head' value={`${headCircumference} centimeters`} />
        <LogRow field='Height' value={`${height} inches`} />
        <LogRow field='Weight' value={`${weight} pounds`} />
        <LogRow field='Notes' value={notes} />
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        <EditLogRow field='Head' value={
          <TextField
            className='skinny-text-field'
            id='growth-head-circumference-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedHeadCircumference(Number(event.target.value))}
            placeholder='how big is that dome?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={updatedHeadCircumference}
          />
        } />
        <EditLogRow field='Height' value={
          <TextField
            className='skinny-text-field'
            id='growth-height-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedHeight(Number(event.target.value))}
            placeholder='how tall is peanut?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={updatedHeight}
          />
        } />
        <EditLogRow field='Weight' value={
          <TextField
            className='skinny-text-field'
            id='growth-weight-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedWeight(Number(event.target.value))}
            placeholder='how much does peanut weigh?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={updatedWeight}
          />
        } />
        <EditLogRow field='Notes' value={
          <TextField
            className='skinny-text-field'
            id='growth-notes-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedNotes(event.target.value)}
            placeholder='include any relevant details'
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
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
      <Card>
        {isInEditMode ? getEditableCardContent() : getCardContent()}
        <CardActions sx={{ justifyContent: 'right' }}>
          <Button color='primary' onClick={isInEditMode ? onUpdate : onEdit} variant='contained'>
            {isInEditMode ? 'Update' : 'Edit'}
          </Button>
          <Button color='error' onClick={isInEditMode ? onDiscard : onDelete} variant='outlined'>
            {isInEditMode ? 'Discard' : 'Delete'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
