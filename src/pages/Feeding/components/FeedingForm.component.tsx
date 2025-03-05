import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { FeedingMethod, FeedingSide } from '@models';
import { createNewFeeding } from '@services';
import { WhiteButton } from '@styles';
import { toCapitalCase } from '@utils';

export const FeedingForm = () => {
  const [amount, setAmount] = useState<number | undefined>();
  const [amountErrorText, setAmountErrorText] = useState<string | undefined>();
  const [duration, setDuration] = useState<number | undefined>();
  const [durationErrorText, setDurationErrorText] = useState<string | undefined>();
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [method, setMethod] = useState<FeedingMethod>(FeedingMethod.BREAST);
  const [notes, setNotes] = useState<string | undefined>();
  const [side, setSide] = useState<FeedingSide>(FeedingSide.N_A);
  const [sideErrorText, setSideErrorText] = useState<string | undefined>();

  const clearErrors = () => {
    setAmountErrorText(undefined);
    setDurationErrorText(undefined);
    setSideErrorText(undefined);
  };

  const clearState = () => {
    setAmount(undefined);
    setDuration(undefined);
    setMethod(FeedingMethod.BREAST);
    setNotes(undefined);
    setSide(FeedingSide.N_A);
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

  const onDiscard = () => {
    clearErrors();
    clearState();
  };

  const onSubmit = async () => {
    if (handleValidation()) return;
    if (method === FeedingMethod.BREAST) {
      await createNewFeeding({ duration, side, method, notes, timestamp: new Date().toISOString() });
    } else {
      await createNewFeeding({ amount, method, notes, timestamp: new Date().toISOString() });
    }
    clearState();
    setIsFormExpanded(false);
  };

  const onToggleFormState =
    (_: SyntheticEvent, isExpanded: boolean) => {
      setIsFormExpanded(isExpanded);
    };

  const updateAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmountErrorText(undefined);
    setAmount(Number(event.target.value))
  };

  const updateDuration = (event: ChangeEvent<HTMLInputElement>) => {
    setDurationErrorText(undefined);
    setDuration(Number(event.target.value));
  };

  const updateSide = (event: SelectChangeEvent<FeedingSide>) => {
    setSideErrorText(undefined);
    setSide(event.target.value as FeedingSide);
  };

  return (
    <Accordion expanded={isFormExpanded} onChange={onToggleFormState}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='feeding-form-content'
        id='feeding-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Log New Feeding</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div display='flex' flexDirection='column' gap='20px'>
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
          <FormControl error={!isNil(sideErrorText)} fullWidth>
            <InputLabel id='feeding-side-select-label'>Side</InputLabel>
            <Select
              labelId='feeding-side-select-label'
              id='feeding-side-select'
              value={side}
              label='Side'
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
          <TextField
            error={!isNil(amountErrorText)}
            helperText={amountErrorText}
            id='feeding-amount-field'
            label='Amount In Ounces'
            onChange={updateAmount}
            placeholder='(if bottlefeeding) how much?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={amount}
          />
          <TextField
            error={!isNil(durationErrorText)}
            helperText={durationErrorText}
            id='feeding-duration-field'
            label='Duration In Minutes'
            onChange={updateDuration}
            placeholder='(if breastfeeding) for how long?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={duration}
          />
          <TextField
            id='feeding-notes-field'
            label='Notes'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
            placeholder='include any relevant details'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='string'
            value={notes}
          />
        </x.div>
      </AccordionDetails>
      <AccordionActions>
        <x.div display='flex' gap='20px' justifyContent='right'>
          <WhiteButton onClick={onDiscard} variant='outlined'>
            Discard
          </WhiteButton>
          <Button onClick={onSubmit} variant='contained'>
            Log
          </Button>
        </x.div>
      </AccordionActions>
    </Accordion>
  );
};
