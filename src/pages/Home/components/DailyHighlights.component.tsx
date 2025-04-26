import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import { useState } from 'react';

export const DailyHighlights = () => {
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  // calculated state
  // TODO

  return (
    <Accordion expanded={isFormExpanded} onChange={() => setIsFormExpanded(!isFormExpanded)}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='growth-form-content'
        id='growth-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Highlights</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        Under Construction
      </AccordionDetails>
    </Accordion>
  );
};
