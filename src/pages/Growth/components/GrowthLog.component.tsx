import { CardContent, TextField } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Growth } from '@models';
import { deleteGrowth, updateGrowth } from '@services';
import { formatDate, formatLbsToLbsOz } from '@utils';

interface GrowthLogProps {
  growth: Growth;
  onSuccess: () => void;
}

export const GrowthLog = ({ growth, onSuccess }: GrowthLogProps) => {
  const { firstName } = useProfile();

  const { id, headCircumference, height, notes, weight, timestamp } = growth;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedHeadCircumference, setUpdatedHeadCircumference] = useState<number | null>(headCircumference);
  const [updatedHeight, setUpdatedHeight] = useState<number | null>(height);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);
  const [updatedWeight, setUpdatedWeight] = useState<number | null>(weight);

  const onDelete = async (idToUpdate: string) => {
    await deleteGrowth(idToUpdate);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedHeadCircumference(headCircumference);
    setUpdatedHeight(height);
    setUpdatedNotes(notes);
    setUpdatedWeight(weight);
    setIsInEditMode(false);
  };

  const onUpdate = async (idToUpdate: string) => {
    await updateGrowth(idToUpdate, {
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
        <LogRow field='Date' value={formatDate(timestamp)} />
        {!isNil(headCircumference) && <LogRow field='Head' value={`${headCircumference} centimeters`} />}
        {!isNil(height) && <LogRow field='Height' value={`${height} inches`} />}
        {!isNil(weight) && <LogRow field='Weight' value={formatLbsToLbsOz(weight)} />}
        {!isNil(notes) && <LogRow field='Notes' value={notes} />}
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatDate(timestamp)} />
        <EditLogRow field='Head' value={
          <TextField
            className='skinny-text-field'
            id='growth-head-circumference-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedHeadCircumference(Number(event.target.value))}
            placeholder={`How big is ${firstName}'s head in centimeters?`}
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
            placeholder={`How tall is ${firstName} in inches?`}
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
            placeholder={`How much does ${firstName} weigh in pounds?`}
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
            placeholder={`Any additional details about ${firstName}'s growth?`}
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
