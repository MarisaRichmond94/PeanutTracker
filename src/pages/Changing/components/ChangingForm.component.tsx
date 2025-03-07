import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { WasteColor, WasteConsistency, WasteType } from '@models';
import { createNewChanging } from '@services';
import { WhiteButton } from '@styles';
import { toCapitalCase } from '@utils';

type ChangingFormProps = {
  onSuccess: () => void;
}

export const ChangingForm = ({ onSuccess }: ChangingFormProps) => {
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [color, setColor] = useState<WasteColor>(WasteColor.NOT_APPLICABLE);
  const [consistency, setConsistency] = useState<WasteConsistency>(WasteConsistency.NOT_APPLICABLE);
  const [notes, setNotes] = useState<string | undefined>();
  const [type, setType] = useState<WasteType>(WasteType.WET);

  const clearState = () => {
    setColor(WasteColor.NOT_APPLICABLE);
    setConsistency(WasteConsistency.NOT_APPLICABLE);
    setNotes(undefined);
    setType(WasteType.WET);
  };

  const onDiscard = () => clearState();

  const onSubmit = async () => {
    await createNewChanging({ color, consistency, notes, type, timestamp: new Date().toISOString() });
    clearState();
    setIsFormExpanded(false);
    onSuccess();
  };

  const onToggleFormState =
    (_: SyntheticEvent, isExpanded: boolean) => {
      setIsFormExpanded(isExpanded);
    };

  return (
    <Accordion expanded={isFormExpanded} onChange={onToggleFormState}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='changing-form-content'
        id='changing-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Log New Changing</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div display='flex' flexDirection='column' gap='20px'>
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
