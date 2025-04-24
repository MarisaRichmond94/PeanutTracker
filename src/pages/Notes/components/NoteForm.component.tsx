import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { useProfile } from '@contexts';
import { NotePriority } from '@models';
import { createNote } from '@services';
import { toCapitalCase } from '@utils';

type NoteFormProps = {
  onSuccess: () => void;
}

export const NoteForm = ({ onSuccess }: NoteFormProps) => {
  const { firstName } = useProfile();

  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [priority, setPriority] = useState<NotePriority>(NotePriority.MEDIUM);
  const [value, setValue] = useState<string | undefined>();
  const [valueError, setValueError] = useState<string | undefined>();

  const clearErrorState = () => {
    setValueError(undefined);
  };

  const clearState = () => {
    setPriority(NotePriority.MEDIUM);
    setValue(undefined);
  };

  const handleValidation = () => {
    clearErrorState();

    if (isNil(value)) {
      setValueError('Missing required field "value"');
      return true;
    }
  };

  const onDiscard = () => {
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    if (handleValidation()) return;
    await createNote({ priority, value: value!, timestamp: new Date().toISOString() });
    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
  };

  const fields = (
    <>
      <FormControl fullWidth>
        <InputLabel id='note-priority-select-label'>Priority</InputLabel>
        <Select
          id='note-priority-select'
          label='Priority'
          labelId='note-priority-select-label'
          onChange={(event: SelectChangeEvent<NotePriority>) => setPriority(event.target.value as NotePriority)}
          required
          value={priority}
        >
          {
            Object.values(NotePriority).map((it, index) =>
              <MenuItem key={`note-priority-${index}`} value={it}>
                {toCapitalCase(it)}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
      <TextField
        error={!isNil(valueError)}
        helperText={valueError}
        id='note-value-field'
        label='Notes'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
        placeholder={`What do we need to know about ${firstName}?`}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='string'
        value={value}
      />
    </>
  );

  return (
    <Form
      fields={fields}
      isFormExpanded={isFormExpanded}
      type='Note'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
