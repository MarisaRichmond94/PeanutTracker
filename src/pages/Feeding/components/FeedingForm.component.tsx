import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { FeedingSide } from '@models';
import { createNewBottleFeeding, createNewBreastFeeding, createNewFeeding } from '@services';
import { FeedingMethod } from '@types';
import { subtractMinutes, toCapitalCase } from '@utils';
import { DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

type FeedingFormProps = {
  onSuccess: () => void;
}

export const FeedingForm = ({ onSuccess }: FeedingFormProps) => {
  const { firstName } = useProfile();

  // bottlefeeding only
  const [amount, setAmount] = useState<number | undefined>();
  const [amountErrorText, setAmountErrorText] = useState<string | undefined>();
  // breastfeeding only
  const [duration, setDuration] = useState<number | undefined>();
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<Dayjs | undefined>(dayjs());
  const [startTime, setStartTime] = useState<Dayjs | undefined>(dayjs());
  const [side, setSide] = useState<FeedingSide>(FeedingSide.BOTH);
  // feeding only
  const [food, setFood] = useState<string | undefined>();
  const [foodErrorText, setFoodErrorText] = useState<string | undefined>();
  const [reaction, setReaction] = useState<string | undefined>();
  const [reactionErrorText, setReactionErrorText] = useState<string | undefined>();
  // shared state
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [method, setMethod] = useState<FeedingMethod>(FeedingMethod.BREAST);
  const [notes, setNotes] = useState<string | undefined>();

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setFoodErrorText(undefined);
    setReactionErrorText(undefined);
  };

  const clearState = () => {
    setAmount(undefined);
    setDuration(undefined);
    setFood(undefined);
    setMethod(FeedingMethod.BREAST);
    setNotes(undefined);
    setReaction(undefined);
    setSide(FeedingSide.BOTH);
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
        await createNewBottleFeeding({ amount, method, notes, timestamp: new Date().toISOString() });
        break;
      case FeedingMethod.BREAST:
        if (isNil(duration) || duration <= 0) {
          setDurationErrorText('Missing required duration');
          return;
        }
        await createNewBreastFeeding({ duration, side, method, notes, timestamp: subtractMinutes(new Date().toISOString(), duration!) });
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
        await createNewFeeding({ food, method, notes, reaction, timestamp: new Date().toISOString() });
        break;
    }

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
  };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountErrorText(undefined);
    setAmount(Number(event.target.value))
  };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    const nextValue = Number(event.target.value);
    setDuration(nextValue > 0 ? nextValue : undefined);
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
            {/* <MobileDateTimePicker
              label='Start Time'
              value={startTime}
              onChange={(newValue) => setStartTime(newValue ?? undefined)}
            />
            <MobileDateTimePicker
              label='End Time'
              value={endTime}
              onChange={(newValue) => setEndTime(newValue ?? undefined)}
            /> */}
            <TextField
              error={!isNil(durationErrorText)}
              helperText={durationErrorText}
              id='feeding-duration-field'
              label='Duration In Minutes'
              onChange={updateDuration}
              placeholder={`How long did ${firstName} nurse?`}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              type='number'
              value={duration}
            />
            {noteField}
          </>
        )
      case FeedingMethod.FOOD:
        return (
          <>
            {methodSelector}
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
        )
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
