import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, TextField, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import { createNewGrowth } from '@services';
import { WhiteButton } from '@styles';

type GrowthFormProps = {
  onSuccess: () => void;
}

export const GrowthForm = ({ onSuccess }: GrowthFormProps) => {
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [headCircumference, setHeadCircumference] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [notes, setNotes] = useState<string | undefined>();
  const [weight, setWeight] = useState<number | undefined>();

  const clearState = () => {
    setHeadCircumference(undefined);
    setHeight(undefined);
    setNotes(undefined);
    setWeight(undefined);
  };

  const onDiscard = () => clearState();

  const onSubmit = async () => {
    await createNewGrowth({ headCircumference, height, notes, weight, timestamp: new Date().toISOString() });
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
        aria-controls='growth-form-content'
        id='growth-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Log New Growth</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div display='flex' flexDirection='column' gap='20px'>
          <TextField
            id='growth-head-circumference-field'
            label='Head Circumference In Centimeters'
            onChange={(event: ChangeEvent<HTMLInputElement>) => setHeadCircumference(Number(event.target.value))}
            placeholder='how big is that dome?'
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
            placeholder='how tall is peanut?'
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
            placeholder='how much does peanut weigh?'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type='number'
            value={weight}
          />
          <TextField
            id='growth-notes-field'
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
