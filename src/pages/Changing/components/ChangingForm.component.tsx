import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { WasteColor, WasteConsistency, WasteType } from '@models';
import { createNewChanging } from '@services';
import { toCapitalCase } from '@utils';

type ChangingFormProps = {
  onSuccess: () => void;
}

export const ChangingForm = ({ onSuccess }: ChangingFormProps) => {
  const { firstName } = useProfile();

  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [color, setColor] = useState<WasteColor>(WasteColor.NOT_APPLICABLE);
  const [consistency, setConsistency] = useState<WasteConsistency>(WasteConsistency.NOT_APPLICABLE);
  const [notes, setNotes] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<Dayjs>(dayjs());
  const [type, setType] = useState<WasteType>(WasteType.WET);

  const clearState = () => {
    setColor(WasteColor.NOT_APPLICABLE);
    setConsistency(WasteConsistency.NOT_APPLICABLE);
    setNotes(null);
    setTimestamp(dayjs());
    setType(WasteType.WET);
  };

  const onDiscard = () => {
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    await createNewChanging({ color, consistency, notes, type, timestamp: timestamp.toISOString() });
    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setTimestamp(dayjs());
    setIsFormExpanded(isExpanded);
  };

  const fields = (
    <>
      <FormControl fullWidth>
        <InputLabel id='waste-type-select-label'>Type</InputLabel>
        <Select
          id='waste-type-select'
          label='Type'
          labelId='waste-type-select-label'
          onChange={(event: SelectChangeEvent<WasteType>) => setType(event.target.value as WasteType)}
          required
          value={type}
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
      <MobileDateTimePicker
        label='Date & Time'
        value={timestamp}
        onChange={(newValue) => setTimestamp(newValue ?? dayjs())}
      />
      <FormControl fullWidth>
        <InputLabel id='waste-color-select-label'>Color</InputLabel>
        <Select
          labelId='waste-color-select-label'
          id='waste-color-select'
          value={color}
          label='Color'
          onChange={(event: SelectChangeEvent<WasteColor>) => setColor(event.target.value as WasteColor)}
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
      <FormControl fullWidth>
        <InputLabel id='waste-consistency-select-label'>Consistency</InputLabel>
        <Select
          labelId='waste-consistency-select-label'
          id='waste-consistency-select'
          value={consistency}
          label='Consistency'
          onChange={(event: SelectChangeEvent<WasteConsistency>) => setConsistency(event.target.value as WasteConsistency)}
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
      <TextField
        id='changing-notes-field'
        label='Notes'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setNotes(event.target.value)}
        placeholder={`Any additional details about ${firstName}'s diaper change?`}
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
      type='Changing'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
