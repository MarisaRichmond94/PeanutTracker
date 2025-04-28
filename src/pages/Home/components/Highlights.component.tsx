import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { LogRow } from '@components';
import { BottleFeeding, BreastFeeding, Changing, Growth, Pumping } from '@models';
import { LogEntry, LogType } from '@types';
import { formatLbsToLbsOz, formatMinutesToHoursAndMinutes } from '@utils';

import { calculateDailyBottleFeedingState, calculateDailyBreastFeedingState, calculateDailyChangingState, calculateDailyPumpingState } from '../utils';

type Change = {
  difference: number; // absolute value of change (positive number)
  type: 'Gained' | 'Lost' | 'N/A';
};

type HighlightsProps = {
  isDailySnapshot: boolean;
  logs: LogEntry[];
}

export const Highlights = ({ isDailySnapshot, logs }: HighlightsProps) => {
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  // calculated state
  const [breastFeedings, setBreastFeedings] = useState<number>(); // number of breast feeding sessions in time period
  const [breastFeedingDuration, setBreastFeedingDuration] = useState<number>(); // time spent breast feeding in time period shown in hours and minutes
  const [dirtyDiapers, setDirtyDiapers] = useState<number>(); // total number of dirty diapers in time period
  const [ouncesPumped, setOuncesPumped] = useState<number>(); // total milk pumped in time period shown in ounces
  const [ouncesSupplemented, setOuncesSupplemented] = useState<number>(); // ounces of formula or breast milk supplemented in time period
  const [ouncesTransferred, setOuncesTransferred] = useState<number>(); // ounces of breast milk transferred in time period
  const [pumpSessions, setPumpSessions] = useState<number>(); // number of pump sessions in time period
  const [pumpTime, setPumpTime] = useState<number>(); // time spent pumping in time period shown in hours and minutes
  const [supplementations, setSupplementations] = useState<number>(); // total number of bottles given in time period
  const [totalDiapers, setTotalDiapers] = useState<number>(); // total number of diapers in time period
  const [weightChange, setWeightChange] = useState<string>(); // difference in first and last weight in time period
  const [wetDiapers, setWetDiapers] = useState<number>(); // total number of wet diapers in time period

  const calculateBreastFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BREAST_FEEDING) as BreastFeeding[];
    const { duration, ounces, total } = calculateDailyBreastFeedingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setBreastFeedings(Math.round((total / totalDays) * 100) / 100);
    setBreastFeedingDuration(duration / totalDays);
    setOuncesTransferred(Math.round((ounces / totalDays) * 100) / 100);
  };

  const calculateBottleFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BOTTLE_FEEDING) as BottleFeeding[];
    const { ounces, total } = calculateDailyBottleFeedingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setSupplementations(Math.round((total / totalDays) * 100) / 100);
    setOuncesSupplemented(Math.round((ounces / totalDays) * 100) / 100);
  };

  const calculatePumpingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.PUMPING) as Pumping[];
    const { ounces, time, total } = calculateDailyPumpingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setPumpSessions(Math.round((total / totalDays) * 100) / 100);
    setOuncesPumped(Math.round((ounces / totalDays) * 100) / 100);
    setPumpTime(Math.round((time / totalDays) * 100) / 100)
  };

  const calculateChangingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.CHANGING) as Changing[];
    const { dirty, total, wet } = calculateDailyChangingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setDirtyDiapers(Math.round((dirty / totalDays) * 100) / 100);
    setTotalDiapers(Math.round((total / totalDays) * 100) / 100);
    setWetDiapers(Math.round((wet / totalDays) * 100) / 100);
  };

  const determineDifference = (start: number, end: number): Change => {
    if (end > start) {
      return { difference: end - start, type: 'Gained' };
    } else if (end < start) {
      return { difference: start - end, type: 'Lost' };
    } else {
      return { difference: 0, type: 'N/A' };
    }
  };

  const calculateGrowthState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.GROWTH) as Growth[];
    const growthWithWeight = filteredLogs.filter((log) => !isNil(log.weight));
    if (!isEmpty(growthWithWeight) && growthWithWeight.length >= 2) {
      const last = growthWithWeight[0];
      const first = growthWithWeight[growthWithWeight.length - 1];
      const { difference, type } = determineDifference(first.weight!, last.weight!);
      setWeightChange(`${type} ${formatLbsToLbsOz(difference)}`);
    }
  };

  const calculateState = () => {
    calculateBreastFeedingState();
    calculateBottleFeedingState();
    calculatePumpingState();
    calculateChangingState();
    calculateGrowthState();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { calculateState() }, [logs]);

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
        <Typography>Breast Feedings</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total (Average)' value={`${breastFeedings} feedings`} />
        <LogRow field='Time (Average)' value={formatMinutesToHoursAndMinutes(breastFeedingDuration || 0)} />
        <LogRow field='Transferred (Average)' value={isNil(ouncesTransferred) ? 'Unknown' : `${ouncesTransferred} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Supplementations</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total (Average)' value={`${supplementations} supplementations`} />
        <LogRow field='Supplemented (Average)' value={`${ouncesSupplemented || 0} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Pump Sessions</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total (Average)' value={`${pumpSessions} sessions`} />
        <LogRow field='Time (Average)' value={formatMinutesToHoursAndMinutes(pumpTime || 0)} />
        <LogRow field='Pumped (Average)' value={`${ouncesPumped || 0} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Diaper Changes</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Dirty (Average)' value={`${dirtyDiapers} diapers`} />
        <LogRow field='Wet (Average)' value={`${wetDiapers} diapers`} />
        <LogRow field='Total (Average)' value={`${totalDiapers} diapers`} />
        <Typography sx={{ pt: 1 }}>Growth</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Weight Change' value={weightChange || 'N/A'} />
      </AccordionDetails>
    </Accordion>
  );
};
