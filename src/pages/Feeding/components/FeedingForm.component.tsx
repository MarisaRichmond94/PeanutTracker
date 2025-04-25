
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { FeedingSide } from '@models';
import { createNewBottleFeeding, createNewBreastFeeding, createNewFeeding, createNewPumping } from '@services';
import { FeedingMethod } from '@types';
import { toCapitalCase } from '@utils';

type FeedingFormProps = {
  onSuccess: () => void;
}

export const FeedingForm = ({ onSuccess }: FeedingFormProps) => {
  const { firstName } = useProfile();

  // bottlefeeding only
  const [amount, setAmount] = useState<number | undefined>();
  const [amountErrorText, setAmountErrorText] = useState<string | undefined>();
  // breastfeeding only
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<Dayjs>(dayjs().add(1, 'minute'));
  const [side, setSide] = useState<FeedingSide>(FeedingSide.BOTH);
  // feeding only
  const [food, setFood] = useState<string | undefined>();
  const [foodErrorText, setFoodErrorText] = useState<string | undefined>();
  const [reaction, setReaction] = useState<string | undefined>();
  const [reactionErrorText, setReactionErrorText] = useState<string | undefined>();
  // pumping only
  const [duration, setDuration] = useState<number>(0);
  const [leftAmount, setLeftAmount] = useState<number>(0);
  const [rightAmount, setRightAmount] = useState<number>(0);
  // shared state
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [method, setMethod] = useState<FeedingMethod>(FeedingMethod.BREAST);
  const [notes, setNotes] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs());

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setFoodErrorText(undefined);
    setReactionErrorText(undefined);
  };

  const clearState = () => {
    setAmount(undefined);
    setDuration(0);
    setEndTime(dayjs());
    setFood(undefined);
    setLeftAmount(0);
    setMethod(FeedingMethod.BREAST);
    setNotes(null);
    setReaction(undefined);
    setRightAmount(0);
    setSide(FeedingSide.BOTH);
    setStartTime(dayjs());
  };

  const onDiscard = () => {
    clearErrors();
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    clearErrors();

    switch (method) {
      case FeedingMethod.BOTTLE:
        if (isNil(amount) || amount <= 0) {
          setAmountErrorText('Missing required amount');
          return;
        }
        await createNewBottleFeeding({ amount, method, notes, timestamp: startTime.toISOString() });
        break;
      case FeedingMethod.BREAST:
        if (startTime.isAfter(endTime)) {
          setDurationErrorText('Start time cannot come after end time');
          return;
        }
        if (startTime.isSame(endTime)) {
          setDurationErrorText('End time cannot match start time');
          return;
        }
        await createNewBreastFeeding({ duration: endTime.diff(startTime, 'minute'), side, method, notes, timestamp: startTime.toISOString() });
        break;
      case FeedingMethod.FOOD:
        if (isNil(food)) {
          setFoodErrorText('Missing required food');
          return;
        }
        if (isNil(reaction)) {
          setReactionErrorText('Missing required reaction');
          return;
        }
        await createNewFeeding({ food, method, notes, reaction, timestamp: startTime.toISOString() });
        break;
      case FeedingMethod.PUMP:
        await createNewPumping({ duration, leftAmount, method, notes, rightAmount, timestamp: startTime.toISOString() });
        break;
    }

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    // pull latest time every time there's a new log
    setStartTime(dayjs());
    setEndTime(dayjs().add(1, 'minute'));
    // expand the form
    setIsFormExpanded(isExpanded);
  };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountErrorText(undefined);
    setAmount(Number(event.target.value))
  };

  const methodSelector = (
    <FormControl fullWidth>
      <InputLabel id='feeding-method-select-label'>Method</InputLabel>
      <Select
        id='feeding-method-select'
        label='Method'
        labelId='feeding-method-select-label'
        onChange={(event: SelectChangeEvent<FeedingMethod>) => setMethod(event.target.value as FeedingMethod)}
        required
        value={method}
      >
        {
          Object.values(FeedingMethod).map((it, index) =>
            <MenuItem key={`feeding-method-${index}`} value={it}>
              {toCapitalCase(it)}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );

  const startTimePicker = (
    <MobileDateTimePicker
      label={FeedingMethod.BREAST ? 'Start Time' : 'Date'}
      value={startTime}
      onChange={(newValue) => setStartTime(newValue ?? dayjs())}
      slotProps={{
        textField: {
          error: startTime.isAfter(endTime),
          helperText: startTime.isAfter(endTime) ? durationErrorText : undefined
        },
      }}
    />
  );

  const noteField = (
    <TextField
      id='feeding-notes-field'
      label='Notes'
      onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
      placeholder={`Any additional details about ${firstName}'s feeding?`}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
      type='string'
      value={notes}
    />
  );

  const getFields = () => {
    switch (method) {
      case FeedingMethod.BOTTLE:
        return (
          <>
            {methodSelector}
            {startTimePicker}
            <TextField
              error={!isNil(amountErrorText)}
              helperText={amountErrorText}
              id='feeding-amount-field'
              label='Amount In Ounces'
              onChange={updateAmount}
              placeholder={`How much did ${firstName} drink?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={amount}
            />
            {noteField}
          </>
        );
      case FeedingMethod.BREAST:
        return (
          <>
            {methodSelector}
            <FormControl fullWidth>
              <InputLabel id='feeding-side-select-label'>Side</InputLabel>
              <Select
                labelId='feeding-side-select-label'
                id='feeding-side-select'
                value={side}
                label='Side'
                onChange={(event: SelectChangeEvent<FeedingSide>) => setSide(event.target.value as FeedingSide)}
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
            {startTimePicker}
            <MobileDateTimePicker
              label='End Time'
              value={endTime}
              onChange={(newValue) => setEndTime(newValue ?? dayjs())}
              slotProps={{
                textField: {
                  error: !isNil(durationErrorText) && startTime.isSame(endTime),
                  helperText: startTime.isSame(endTime) ? durationErrorText : undefined
                },
              }}
            />
            {noteField}
          </>
        );
      case FeedingMethod.FOOD:
        return (
          <>
            {methodSelector}
            {startTimePicker}
            <TextField
              error={!isNil(foodErrorText)}
              helperText={foodErrorText}
              id='feeding-food-field'
              label='Food'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setFood(event.target.value)}
              placeholder={`What food did ${firstName} eat?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='string'
              value={food}
            />
            <TextField
              error={!isNil(reactionErrorText)}
              helperText={reactionErrorText}
              id='feeding-reaction-field'
              label='Reaction'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setReaction(event.target.value)}
              placeholder={`How did ${firstName} react to this food?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='string'
              value={reaction}
            />
            {noteField}
          </>
        );
      case FeedingMethod.PUMP:
        return (
          <>
            {methodSelector}
            {startTimePicker}
            <TextField
              id='feeding-duration-field'
              label='Duration (In Minutes)'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDuration(Number(event.target.value))}
              placeholder='How long did you pump?'
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={duration}
            />
            <TextField
              id='feeding-left-amount-field'
              label='Amount (Left) In Ounces'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLeftAmount(Number(event.target.value))}
              placeholder='How much milk did the left breast yield?'
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={leftAmount}
            />
            <TextField
              id='feeding-right-amount-field'
              label='Amount (Right) In Ounces'
              onChange={(event: ChangeEvent<HTMLInputElement>) => setRightAmount(Number(event.target.value))}
              placeholder='How much milk did the right breast yield?'
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={rightAmount}
            />
            {noteField}
          </>
        );
    }
  };

  return (
    <Form
      fields={getFields()}
      isFormExpanded={isFormExpanded}
      type='Feeding'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
