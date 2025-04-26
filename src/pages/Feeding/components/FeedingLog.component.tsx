/* eslint-disable no-case-declarations */
import { CardContent, Divider, FormControl, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';

import { EditLogRow, Log, LogRow } from '@components';
import { useProfile } from '@contexts';
import { BottleFeeding, BottleType, BreastFeeding, Feeding, FeedingSide, Pumping } from '@models';
import { deleteBottleFeeding, deleteBreastFeeding, deleteFeeding, deletePumping, updateBottleFeeding, updateBreastFeeding, updateFeeding, updatePumping } from '@services';
import { FeedingEntity, FeedingMethod } from '@types';
import { addMinutes, calculateOunceDifference, formatTimestamp, getTitle, toCapitalCase } from '@utils';

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
  const [updatedBottleType, setUpdatedBottleType] = useState<BottleType>(BottleType.BREAST_MILK);
  // breastfeeding only
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [updatedEndTime, setUpdatedEndTime] = useState<Dayjs>(dayjs(timestamp));
  const [updatedEndPounds, setUpdatedEndPounds] = useState<number | null>(null);
  const [updatedEndOunces, setUpdatedEndOunces] = useState<number | null>(null);
  const [updatedSide, setUpdatedSide] = useState<FeedingSide | undefined>();
  const [updatedStartPounds, setUpdatedStartPounds] = useState<number | null>(null);
  const [updatedStartOunces, setUpdatedStartOunces] = useState<number | null>(null);
  // feeding only
  const [updatedFood, setUpdatedFood] = useState<string | undefined>();
  const [foodErrorText, setFoodErrorText] = useState<string | undefined>();
  const [updatedReaction, setUpdatedReaction] = useState<string | undefined>();
  const [reactionErrorText, setReactionErrorText] = useState<string | undefined>();
  // pumping only
  const [updatedDuration, setUpdatedDuration] = useState<number>();
  const [updatedLeftAmount, setUpdatedLeftAmount] = useState<number>();
  const [updatedRightAmount, setUpdatedRightAmount] = useState<number>();
  // shared state
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [updatedNotes, setUpdatedNotes] = useState<string | null>(notes);
  const [updatedStartTime, setUpdatedStartTime] = useState<Dayjs>(dayjs(timestamp));

  useEffect(() => {
    if (method === FeedingMethod.BREAST) {
      const { duration } = feeding;
      setUpdatedEndTime(dayjs(addMinutes(timestamp, duration)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeding]);

  const resetUniqueState = () => {
    const { notes } = feeding;
    setUpdatedNotes(notes);

    switch (method) {
      case FeedingMethod.BOTTLE:
        const { amount, type } = feeding as BottleFeeding;
        setUpdatedAmount(amount);
        setUpdatedBottleType(type);
        break;
      case FeedingMethod.BREAST:
        const { duration, endPounds, endOunces, side, startPounds, startOunces, timestamp } = feeding as BreastFeeding;
        setUpdatedStartTime(dayjs(timestamp));
        setUpdatedEndTime(dayjs(addMinutes(timestamp, duration)));
        setUpdatedSide(side);
        setUpdatedStartPounds(startPounds);
        setUpdatedStartOunces(startOunces);
        setUpdatedEndPounds(endPounds);
        setUpdatedEndOunces(endOunces);
        break;
      case FeedingMethod.FOOD:
        const { food, reaction } = feeding as Feeding;
        setUpdatedFood(food);
        setUpdatedReaction(reaction);
        break;
      case FeedingMethod.PUMP:
        const { duration: pumpDuration, leftAmount, rightAmount } = feeding as Pumping;
        setUpdatedDuration(pumpDuration);
        setUpdatedLeftAmount(leftAmount);
        setUpdatedRightAmount(rightAmount);
        break;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { resetUniqueState(); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { resetUniqueState(); }, [isInEditMode]);

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setFoodErrorText(undefined);
    setReactionErrorText(undefined);
  };

  const onDelete = async (idToUpdate: string) => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        await deleteBottleFeeding(idToUpdate);
        break;
      case FeedingMethod.BREAST:
        await deleteBreastFeeding(idToUpdate);
        break;
      case FeedingMethod.FOOD:
        await deleteFeeding(idToUpdate);
        break;
      case FeedingMethod.PUMP:
        await deletePumping(idToUpdate);
        break;
    }
    await onSuccess();
  };

  const onDiscard = () => {
    setUpdatedNotes(notes);
    setIsInEditMode(false);
    resetUniqueState();
  };

  const onUpdate = async (idToUpdate: string) => {
    clearErrors();

    switch (method) {
      case FeedingMethod.BOTTLE:
        if (isNil(updatedAmount) || updatedAmount <= 0) {
          setAmountErrorText('Missing required amount');
          return;
        }
        await updateBottleFeeding(
          idToUpdate,
          { amount: updatedAmount, notes: updatedNotes, timestamp: updatedStartTime.toISOString(), type: updatedBottleType },
        );
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
        await updateBreastFeeding(
          idToUpdate,
          {
            duration: updatedEndTime.diff(updatedStartTime, 'minute'),
            endOunces: updatedEndOunces,
            endPounds: updatedEndPounds,
            notes: updatedNotes,
            side: updatedSide,
            startOunces: updatedStartOunces,
            startPounds: updatedStartPounds,
            timestamp: updatedStartTime.toISOString(),
          },
        );
        break;
      case FeedingMethod.FOOD:
        await updateFeeding(idToUpdate, { food: updatedFood, reaction: updatedReaction, timestamp: updatedStartTime.toISOString() })
        break;
      case FeedingMethod.PUMP:
        await updatePumping(idToUpdate, { duration: updatedDuration, leftAmount: updatedLeftAmount, notes: updatedNotes, rightAmount: updatedRightAmount, timestamp: updatedStartTime.toISOString() });
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
        const { amount, type } = feeding as BottleFeeding;
        return (
          <>
            <LogRow field='Amount' value={`${amount} ounce(s)`} />
            <LogRow field='Type' value={type} />
          </>
        );
      case FeedingMethod.BREAST:
        const { duration, side, startPounds, startOunces, endPounds, endOunces } = feeding as BreastFeeding;
        const showWeightChange = [startPounds, startOunces, endPounds, endOunces].every((value) => value != null);

        return (
          <>
            <LogRow field='Duration' value={`${duration} minute(s)`} />
            <LogRow field='Side' value={toCapitalCase(side)} />
            {
              showWeightChange &&
              <LogRow field='Transferred' value={`${calculateOunceDifference(startPounds!, startOunces!, endPounds!, endOunces!)} ounce(s)`} />
            }
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
      case FeedingMethod.PUMP:
        const { duration: pumpDuration, leftAmount, rightAmount } = feeding as Pumping;
        return (
          <>
            <LogRow field='Duration' value={`${pumpDuration} minute(s)`} />
            <LogRow field='Left' value={`${leftAmount} ounce(s)`} />
            <LogRow field='Right' value={`${rightAmount} ounce(s)`} />
          </>
        );
    }
  };

  const editableStartTimeField = (
    <EditLogRow field={FeedingMethod.BREAST ? 'Start' : 'Date'} value={
      <MobileDateTimePicker
        value={updatedStartTime}
        onChange={(newValue) => setUpdatedStartTime(newValue ?? dayjs())}
        slotProps={{
          textField: {
            className: 'skinny-text-field',
            error: FeedingMethod.BREAST ? updatedStartTime.isAfter(updatedEndTime) : undefined,
            helperText: FeedingMethod.BREAST && updatedStartTime.isAfter(updatedEndTime) ? durationErrorText : undefined
          },
        }}
      />
    } />
  );

  const getEditableContentFields = () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        return (
          <>
            {editableStartTimeField}
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
            <EditLogRow field='Type' value={
              <FormControl fullWidth>
                <Select
                  className='skinny-select'
                  id='bottle-type-select'
                  label='Type'
                  labelId='bottle-type-select-label'
                  onChange={(event: SelectChangeEvent<BottleType>) => setUpdatedBottleType(event.target.value as BottleType)}
                  value={updatedBottleType}
                >
                  {
                    Object.values(BottleType).map((it, index) =>
                      <MenuItem key={`bottle-type-${index}`} value={it}>
                        {toCapitalCase(it)}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            } />
          </>
        );
      case FeedingMethod.BREAST:
        return (
          <>
            {editableStartTimeField}
            <EditLogRow field='Side' value={
              <x.div display='flex' gap='10px'>
                <TextField
                  className='skinny-text-field'
                  id='breast-feeding-start-pounds-field'
                  label='lbs'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedStartPounds(Number(event.target.value))}
                  placeholder='Pounds before feed'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='number'
                  value={updatedStartPounds}
                />
                <TextField
                  className='skinny-text-field'
                  id='breast-feeding-start-ounces-field'
                  label='oz'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedStartOunces(Number(event.target.value))}
                  placeholder='Ounces before feed'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='number'
                  value={updatedStartOunces}
                />
              </x.div>
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
              <x.div display='flex' gap='10px'>
                <TextField
                  className='skinny-text-field'
                  id='breast-feeding-end-pounds-field'
                  label='lbs'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedEndPounds(Number(event.target.value))}
                  placeholder='Pounds after feed'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='number'
                  value={updatedEndPounds}
                />
                <TextField
                  className='skinny-text-field'
                  id='breast-feeding-end-ounces-field'
                  label='oz'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedEndOunces(Number(event.target.value))}
                  placeholder='Ounces after feed'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='number'
                  value={updatedEndOunces}
                />
              </x.div>
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
            {editableStartTimeField}
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
      case FeedingMethod.PUMP:
        return (
          <>
            {editableStartTimeField}
            <EditLogRow field='Duration' value={
              <TextField
                className='skinny-text-field'
                id='feeding-duration-field'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedDuration(Number(event.target.value))}
                placeholder='How long did you pump?'
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='number'
                value={updatedDuration}
              />
            } />
            <EditLogRow field='Amount (Left)' value={
              <TextField
                className='skinny-text-field'
                id='feeding-left-amount-field'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedLeftAmount(Number(event.target.value))}
                placeholder='How much milk did the left breast yield?'
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='number'
                value={updatedLeftAmount}
              />
            } />
            <EditLogRow field='Amount (Right)' value={
              <TextField
                className='skinny-text-field'
                id='feeding-right-amount-field'
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedRightAmount(Number(event.target.value))}
                placeholder='How much milk did the right breast yield?'
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                type='number'
                value={updatedRightAmount}
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedNotes(isEmpty(event.target.value) ? null : event.target.value)}
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
