import { TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { createNewGrowth } from '@services';
import { isNil } from 'lodash';

type GrowthFormProps = {
  onSuccess: () => void;
}

export const GrowthForm = ({ onSuccess }: GrowthFormProps) => {
  const { firstName } = useProfile();

  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [headCircumference, setHeadCircumference] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<Dayjs>(dayjs());
  const [weight, setWeight] = useState<number | null>(null);

  const clearState = () => {
    setHeadCircumference(null);
    setHeight(null);
    setNotes(null);
    setTimestamp(dayjs());
    setWeight(null);
  };

  const onDiscard = () => {
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    if (isNil(headCircumference) && isNil(height) && isNil(weight)) {
      console.error('No information provided');
      return;
    }
    await createNewGrowth({ headCircumference, height, notes, weight, timestamp: timestamp.toISOString() });
    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
  };

  const fields = (
    <>
      <TextField
        id='growth-head-circumference-field'
        label='Head Circumference In Centimeters'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setHeadCircumference(Number(event.target.value))}
        placeholder={`How big is ${firstName}'s head in centimeters?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='number'
        value={headCircumference}
      />
      <TextField
        id='growth-height-field'
        label='Height In Inches'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setHeight(Number(event.target.value))}
        placeholder={`How tall is ${firstName} in inches?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='number'
        value={height}
      />
      <TextField
        id='growth-weight-field'
        label='Weight In Pounds'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setWeight(Number(event.target.value))}
        placeholder={`How much does ${firstName} weigh in pounds?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='number'
        value={weight}
      />
      <MobileDatePicker
        label='Date'
        value={timestamp}
        onChange={(newValue) => setTimestamp(newValue ?? dayjs())}
      />
      <TextField
        id='growth-notes-field'
        label='Notes'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
        placeholder={`Any additional details about ${firstName}'s growth?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='string'
        value={notes}
      />
    </>
  );

  return (
    <Form
      fields={fields}
      isFormExpanded={isFormExpanded}
      type='Growth'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
