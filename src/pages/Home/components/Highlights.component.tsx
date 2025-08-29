import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { LogRow } from '@components';
import { BottleFeeding, BreastFeeding, Changing, Pumping } from '@models';
import { LogEntry, LogType } from '@types';

import { calculateDailyBottleFeedingState, calculateDailyBreastFeedingState, calculateDailyChangingState, calculateDailyPumpingState } from '../utils';

type HighlightsProps = {
  isDailySnapshot: boolean;
  logs: LogEntry[];
}

export const Highlights = ({ isDailySnapshot, logs }: HighlightsProps) => {

  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  const [breastFeedings, setBreastFeedings] = useState<number>(); // number of breast feeding sessions in time period
  const [ouncesPumped, setOuncesPumped] = useState<number>(); // total milk pumped in time period shown in ounces
  const [ouncesSupplemented, setOuncesSupplemented] = useState<number>(); // ounces of formula or breast milk supplemented in time period
  const [pumpSessions, setPumpSessions] = useState<number>(); // number of pump sessions in time period
  const [wetDiapers, setWetDiapers] = useState<number>(); // total number of wet diapers in time period

  const calculateBreastFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BREAST_FEEDING) as BreastFeeding[];
    const { total } = calculateDailyBreastFeedingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setBreastFeedings(Math.round((total / totalDays) * 100) / 100);
  };

  const calculateBottleFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BOTTLE_FEEDING) as BottleFeeding[];
    const { ouncesConsumed } = calculateDailyBottleFeedingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setOuncesSupplemented(Math.round((ouncesConsumed / totalDays) * 100) / 100);
  };

  const calculatePumpingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.PUMPING) as Pumping[];
    const { ounces, total } = calculateDailyPumpingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setPumpSessions(Math.round((total / totalDays) * 100) / 100);
    setOuncesPumped(Math.round((ounces / totalDays) * 100) / 100);
  };

  const calculateChangingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.CHANGING) as Changing[];
    const { wet } = calculateDailyChangingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setWetDiapers(Math.round((wet / totalDays) * 100) / 100);
  };

  const calculateState = () => {
    calculateBreastFeedingState();
    calculateBottleFeedingState();
    calculatePumpingState();
    calculateChangingState();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { calculateState() }, [logs]);

  return (
    <Accordion expanded={isFormExpanded} onChange={() => setIsFormExpanded(!isFormExpanded)}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='highlights-content'
        id='highlights-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Highlights</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <LogRow field='Supplemented' value={`${ouncesSupplemented || 0} ounce(s)`} />
        <LogRow field='Pumped' value={`${ouncesPumped || 0} ounce(s)`} />
        <LogRow field='Sessions' value={`${(breastFeedings || 0) + (pumpSessions || 0)} session(s)`} />
        <LogRow field='Wet Diapers' value={`${wetDiapers} diaper(s)`} />
      </AccordionDetails>
    </Accordion>
  );
};
