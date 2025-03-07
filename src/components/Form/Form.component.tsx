import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ReactNode, SyntheticEvent } from 'react';

import { WhiteButton } from '@styles';

type FormProps = {
  fields: ReactNode;
  isFormExpanded: boolean;
  type: string;

  onDiscard: () => void;
  onSubmit: () => void;
  onToggleFormState: (event: SyntheticEvent, isExpanded: boolean) => void;
}

export const Form = ({ fields, isFormExpanded, type, onDiscard, onSubmit, onToggleFormState }: FormProps) => (
  <Accordion expanded={isFormExpanded} onChange={onToggleFormState}>
    <AccordionSummary
      expandIcon={<ExpandMoreRounded />}
      aria-controls='growth-form-content'
      id='growth-form-header'
    >
      <Typography sx={{ m: 0, p: 0 }} variant='h6'>{`Log New ${type}`}</Typography>
      <Divider sx={{ borderColor: 'white' }} />
    </AccordionSummary>
    <AccordionDetails>
      <x.div display='flex' flexDirection='column' gap='20px'>
        {fields}
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
