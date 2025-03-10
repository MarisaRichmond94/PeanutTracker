import { CardContent, Divider, FormControl, FormHelperText, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { Feeding, FeedingMethod, FeedingSide } from '@models';
import { deleteFeeding, updateFeeding } from '@services';
import { formatTimestamp, toCapitalCase } from '@utils';

interface FeedingLogProps {
  feeding: Feeding;
  onSuccess: () => void;
}

export const FeedingLog = ({ feeding, onSuccess }: FeedingLogProps) => {
  const { firstName } = useProfile();

  const { id, amount, duration, method, notes, side, timestamp } = feeding;
  const isBreastFeeding = method === FeedingMethod.BREAST;

  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedAmount, setUpdatedAmount] = useState<number | undefined>(amount);
  const [amountErrorText, setAmountErrorText] = useState<string | undefined>();
  const [updatedDuration, setUpdatedDuration] = useState<number | undefined>(duration);
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedNotes, setUpdatedNotes] = useState<string | undefined>(notes);
  const [updatedSide, setUpdatedSide] = useState<FeedingSide | undefined>(side);
  const [sideErrorText, setSideErrorText] = useState<string | undefined>();

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setSideErrorText(undefined);
  };

  const onDelete = async () => {
    await deleteFeeding(id);
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedAmount(amount);
    setUpdatedDuration(duration);
    setUpdatedNotes(notes);
    setUpdatedSide(side);
    setIsInEditMode(false);
  };

  const handleValidation = (): boolean => {
    clearErrors();
    let hasError = false;

    if (method === FeedingMethod.BREAST) {
      if (isNil(duration) || duration <= 0) {
        setDurationErrorText('Missing required duration');
        hasError = true;
      }
      if (side === FeedingSide.N_A) {
        setSideErrorText('Missing required side');
        hasError = true;
      }
    } else {
      if (isNil(amount) || amount <= 0) {
        setAmountErrorText('Missing required amount');
        hasError = true;
      }
    }

    return hasError;
  };

  const onUpdate = async () => {
    if (handleValidation()) return;
    if (method === FeedingMethod.BREAST) {
      await updateFeeding(id, { duration: updatedDuration, side: updatedSide, notes: updatedNotes });
    } else {
      await updateFeeding(id, { amount: updatedAmount, notes: updatedNotes });
    }
    await onSuccess();
    setIsInEditMode(false);
  };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountErrorText(undefined);
    setUpdatedAmount(Number(event.target.value))
  };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    setUpdatedDuration(Number(event.target.value));
  };

  const updateSide = (event: SelectChangeEvent<FeedingSide>) => {
    setSideErrorText(undefined);
    setUpdatedSide(event.target.value as FeedingSide);
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>{isBreastFeeding ? 'Breast Feeding' : 'Bottle Feeding'}</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        {isBreastFeeding && <LogRow field='Duration' value={duration} />}
        {isBreastFeeding && <LogRow field='Side' value={side} />}
        {!isBreastFeeding && <LogRow field='Amount' value={amount} />}
        <LogRow field='Notes' value={notes} />
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>{isBreastFeeding ? 'Breast Feeding' : 'Bottle Feeding'}</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        {
          isBreastFeeding &&
          <EditLogRow field='Duration' value={
            <TextField
              className='skinny-text-field'
              error={!isNil(durationErrorText)}
              helperText={durationErrorText}
              id='feeding-duration-field'
              onChange={updateDuration}
              placeholder={`How long did ${firstName} feed (if breastfeeding)?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={updatedDuration}
            />
          } />
        }
        {
          isBreastFeeding &&
          <EditLogRow field='Side' value={
            <FormControl error={!isNil(sideErrorText)} fullWidth>
              <Select
                className='skinny-select'
                labelId='feeding-side-select-label'
                id='feeding-side-select'
                value={updatedSide}
                onChange={updateSide}
              >
                {
                  Object.values(FeedingSide).map((it, index) =>
                    <MenuItem key={`feeding-side-${index}`} value={it}>
                      {toCapitalCase(it)}
                    </MenuItem>
                  )
                }
              </Select>
              {!isNil(sideErrorText) && <FormHelperText>{sideErrorText}</FormHelperText>}
            </FormControl>
          } />
        }
        {
          !isBreastFeeding &&
          <EditLogRow field='Amount' value={
            <TextField
              className='skinny-text-field'
              error={!isNil(amountErrorText)}
              helperText={amountErrorText}
              id='feeding-amount-field'
              onChange={updateAmount}
              placeholder={`How much did ${firstName} drink (if bottlefeeding)?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={updatedAmount}
            />
          } />
        }
        <EditLogRow field='Notes' value={
          <TextField
            className='skinny-text-field'
            id='feeding-notes-field'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedNotes(event.target.value)}
            placeholder={`Any additional details about ${firstName}'s feeding?`}
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
