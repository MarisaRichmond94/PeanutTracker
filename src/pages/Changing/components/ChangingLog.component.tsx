import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, LogRow } from '@components';
import { Changing, WasteColor, WasteConsistency, WasteType } from '@models';
import { deleteChanging, updateChanging } from '@services';
import { formatTimestamp, toCapitalCase } from '@utils';

interface ChangingLogProps {
  changing: Changing;
  onSuccess: () => void;
}

export const ChangingLog = ({ changing, onSuccess }: ChangingLogProps) => {
  const { id, color, consistency, notes, type, timestamp } = changing;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedColor, setUpdatedColor] = useState<WasteColor>(color);
  const [updatedConsistency, setUpdatedConsistency] = useState<WasteConsistency>(consistency);
  const [updatedNotes, setUpdatedNotes] = useState<string | undefined>(notes);
  const [updatedType, setUpdatedType] = useState<WasteType>(type);

  const onDelete = async () => {
    await deleteChanging(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedColor(color);
    setUpdatedConsistency(consistency);
    setUpdatedNotes(notes);
    setUpdatedType(type);
    setIsInEditMode(false);
  };

  const onEdit = async () => setIsInEditMode(true);

  const onUpdate = async () => {
    await updateChanging(id, {
      color: updatedColor,
      consistency: updatedConsistency,
      notes: updatedNotes,
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
        <LogRow field='Type' value={type} />
        <LogRow field='Color' value={color} />
        <LogRow field='Consistency' value={consistency} />
        <LogRow field='Notes' value={notes} />
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
