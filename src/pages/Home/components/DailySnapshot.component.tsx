import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ReactNode, SyntheticEvent, useState } from 'react';

type DailySnapshotProps = {
  logs: ReactNode;
  type: string;
}

export const DailySnapshot = ({ logs, type }: DailySnapshotProps) => {
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);

  const onToggleFormState = (_: SyntheticEvent, isExpanded: boolean) => {
    setIsFormExpanded(isExpanded);
  };

  return (
    <Accordion expanded={isFormExpanded} onChange={onToggleFormState}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='growth-form-content'
        id='growth-form-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>{`${type} Logs`}</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div display='flex' flexDirection='column' gap='15px'>
          {logs}
        </x.div>
      </AccordionDetails>
    </Accordion>
  );
};
