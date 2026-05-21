import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import { isNil } from 'lodash';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { Form } from '@components';
import { createNewChore } from '@services';
import { RepeatType } from '@models';
import { toCapitalCase } from '@utils';

type ChoreFormProps = {
  onSuccess: () => void;
}

export const ChoreForm = ({ onSuccess }: ChoreFormProps) => {
  const [description, setDescription] = useState<string | null>(null);
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [repeatType, setRepeatType] = useState<RepeatType>(RepeatType.WEEKLY);

  const clearErrors = () => {
  };

  const clearState = () => {
    setDescription(null);
    setName(null);
    setRepeatType(RepeatType.WEEKLY);
  };

  const onDiscard = () => {
    clearErrors();
    clearState();
    setIsFormExpanded(false);
  };

  const onSubmit = async () => {
    clearErrors();
    if (isNil(name)) return;

    await createNewChore({
      description,
      lastCompletedAt: null,
      lastCompletedBy: null,
      name,
      repeatType,
    });

    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    // pull latest time every time there's a new log
    // expand the form
    setIsFormExpanded(isExpanded);
  };

  const repeatTypeSelector = (
    <FormControl fullWidth>
      <InputLabel id='chore-type-select-label'>Repeat</InputLabel>
      <Select
        id='chore-type-select'
        label='Repeat'
        labelId='chore-type-select-label'
        onChange={(event: SelectChangeEvent<RepeatType>) => setRepeatType(event.target.value as RepeatType)}
        required
        value={repeatType}
      >
        {
          Object.values(RepeatType).map((it, index) =>
            <MenuItem key={`chore-type-${index}`} value={it}>
              {toCapitalCase(it)}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );

  const fields = (
    <>
      <TextField
        id='chore-name-field'
        label='Name'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        placeholder='Give the chore a meaningful name'
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='string'
        value={name}
      />
      <TextField
        id='chore-description-field'
        label='Description'
        onChange={(event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value)}
        placeholder='Include any details about the chore'
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        type='string'
        value={description}
      />
      {repeatTypeSelector}
    </>
  );

  return (
    <Form
      fields={fields}
      isFormExpanded={isFormExpanded}
      type='Chore'
      onDiscard={onDiscard}
      onSubmit={onSubmit}
      onToggleFormState={onToggleFormState}
    />
  );
};
