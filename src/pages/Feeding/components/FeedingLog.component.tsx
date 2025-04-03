/* eslint-disable no-case-declarations */
import { CardContent, Divider, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { BottleFeeding, BreastFeeding, Feeding, FeedingSide } from '@models';
import { deleteBottleFeeding, deleteBreastFeeding, deleteFeeding, updateBottleFeeding, updateBreastFeeding, updateFeeding } from '@services';
import { FeedingEntity, FeedingMethod } from '@types';
import { addMinutes, formatTimestamp, getTitle, toCapitalCase } from '@utils';

interface FeedingLogProps {
  feeding: FeedingEntity;
  onSuccess: () => void;
}

export const FeedingLog = ({ feeding, onSuccess }: FeedingLogProps) => {
  const { firstName } = useProfile();

  const { id, method, notes, timestamp } = feeding;

  // bottlefeeding only
  const [updatedAmount, setUpdatedAmount] = useState<number | undefined>();
  const [amountErrorText, setAmountErrorText] = useState<string | undefined>();
  // breastfeeding only
  const [updatedEndTime, setUpdatedEndTime] = useState<Dayjs>(dayjs(timestamp));
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedSide, setUpdatedSide] = useState<FeedingSide | undefined>();
  const [updatedStartTime, setUpdatedStartTime] = useState<Dayjs>(dayjs(timestamp));
  // feeding only
  const [updatedFood, setUpdatedFood] = useState<string | undefined>();
  const [foodErrorText, setFoodErrorText] = useState<string | undefined>();
  const [updatedReaction, setUpdatedReaction] = useState<string | undefined>();
  const [reactionErrorText, setReactionErrorText] = useState<string | undefined>();
  // shared state
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);

  useEffect(() => {
    if (method === FeedingMethod.BREAST) {
      const { duration } = feeding;
      setUpdatedEndTime(dayjs(addMinutes(timestamp, duration)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeding]);

  const resetUniqueState = () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        const { amount } = feeding as BottleFeeding;
        setUpdatedAmount(amount);
        break;
      case FeedingMethod.BREAST:
        const { duration, side, timestamp } = feeding as BreastFeeding;
        setUpdatedStartTime(dayjs(timestamp));
        setUpdatedEndTime(dayjs(addMinutes(timestamp, duration)));
        setUpdatedSide(side);
        break;
      case FeedingMethod.FOOD:
        const { food, reaction } = feeding as Feeding;
        setUpdatedFood(food);
        setUpdatedReaction(reaction);
        break;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { resetUniqueState(); }, []);

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setFoodErrorText(undefined);
    setReactionErrorText(undefined);
  };

  const onDelete = async () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        await deleteBottleFeeding(id);
        break;
      case FeedingMethod.BREAST:
        await deleteBreastFeeding(id);
        break;
      case FeedingMethod.FOOD:
        await deleteFeeding(id);
        break;
    }
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedNotes(notes);
    setIsInEditMode(false);
    resetUniqueState();
  };

  const onUpdate = async () => {
    clearErrors();

    switch (method) {
      case FeedingMethod.BOTTLE:
        if (isNil(updatedAmount) || updatedAmount <= 0) {
          setAmountErrorText('Missing required amount');
          return;
        }
        await updateBottleFeeding(id, { amount: updatedAmount, notes: updatedNotes });
        break;
      case FeedingMethod.BREAST:
        if (updatedStartTime.isAfter(updatedEndTime)) {
          setDurationErrorText('Start time cannot come after end time');
          return;
        }
        if (updatedStartTime.isSame(updatedEndTime)) {
          setDurationErrorText('End time cannot match start time');
          return;
        }
        await updateBreastFeeding(id, { duration: updatedEndTime.diff(updatedStartTime, 'minute'), side: updatedSide, notes: updatedNotes, timestamp: updatedStartTime.toISOString() });
        break;
      case FeedingMethod.FOOD:
        await updateFeeding(id, { })
        break;
    }

    await onSuccess();
    setIsInEditMode(false);
  };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountErrorText(undefined);
    setUpdatedAmount(Number(event.target.value))
  };

  const getContentFields = () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        const { amount } = feeding as BottleFeeding;
        return (
          <>
            <LogRow field='Amount' value={amount} />
          </>
        );
      case FeedingMethod.BREAST:
        const { duration, side } = feeding as BreastFeeding;
        return (
          <>
            <LogRow field='Duration' value={`${duration} minutes`} />
            <LogRow field='Side' value={side} />
          </>
        );
      case FeedingMethod.FOOD:
        const { food, reaction } = feeding as Feeding;
        return (
          <>
            <LogRow field='Food' value={food} />
            <LogRow field='Reaction' value={reaction} />
          </>
        );
    }
  };

  const getEditableContentFields = () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        return (
          <>
            <EditLogRow field='Amount' value={
              <TextField
                className='skinny-text-field'
                error={!isNil(amountErrorText)}
                helperText={amountErrorText}
                id='feeding-amount-field'
                onChange={updateAmount}
                placeholder={`How much did ${firstName} drink?`}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='number'
                value={updatedAmount}
              />
            } />
          </>
        );
      case FeedingMethod.BREAST:
        return (
          <>
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
            <EditLogRow field='Side' value={
              <FormControl fullWidth>
                <Select
                  className='skinny-select'
                  labelId='feeding-side-select-label'
                  id='feeding-side-select'
                  value={updatedSide}
                  onChange={(event: SelectChangeEvent<FeedingSide>) => setUpdatedSide(event.target.value as FeedingSide)}
                >
                  {
                    Object.values(FeedingSide).map((it, index) =>
                      <MenuItem key={`feeding-side-${index}`} value={it}>
                        {toCapitalCase(it)}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            } />
          </>
        );
      case FeedingMethod.FOOD:
        return (
          <>
            <EditLogRow field='Food' value={
              <TextField
                className='skinny-text-field'
                error={!isNil(foodErrorText)}
                helperText={foodErrorText}
                id='feeding-food-field'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedFood(event.target.value)}
                placeholder={`What food did ${firstName} eat?`}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='string'
                value={updatedFood}
              />
            } />
            <EditLogRow field='Reaction' value={
              <TextField
                className='skinny-text-field'
                error={!isNil(reactionErrorText)}
                helperText={reactionErrorText}
                id='feeding-reaction-field'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedReaction(event.target.value)}
                placeholder={`How did ${firstName} react to this food?`}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='string'
                value={updatedReaction}
              />
            } />
          </>
        );
    }
  };

  const getCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>{getTitle(method)}</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        {getContentFields()}
        {!isNil(notes) && <LogRow field='Notes' value={notes} />}
      </x.div>
    </CardContent>
  );

  const getEditableCardContent = () => (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'>
          <b>{getTitle(method)}</b>
        </Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <x.div display='flex' flexDirection='column' gap='15px'>
        <LogRow field='Date' value={formatTimestamp(timestamp)} />
        {getEditableContentFields()}
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
