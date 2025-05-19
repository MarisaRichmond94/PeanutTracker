import { ExpandMoreRounded } from '@mui/icons-material';
import AirlineSeatFlatRoundedIcon from '@mui/icons-material/AirlineSeatFlatRounded';
import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import SanitizerRoundedIcon from '@mui/icons-material/SanitizerRounded';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { LogRow } from '@components';
import { useProfile } from '@contexts';
import { BottleFeeding, BreastFeeding, Changing, Growth, Pumping, Sleep } from '@models';
import { LogEntry, LogType } from '@types';
import { formatLbsToLbsOz, formatMinutesToHoursAndMinutes } from '@utils';

import { calculateDailyBottleFeedingState, calculateDailyBreastFeedingState, calculateDailyChangingState, calculateDailyPumpingState, calculateDailySleepState } from '../utils';

type Change = {
  difference: number; // absolute value of change (positive number)
  type: 'Gained' | 'Lost' | 'N/A';
};

type HighlightsProps = {
  isDailySnapshot: boolean;
  logs: LogEntry[];
}

export const Highlights = ({ isDailySnapshot, logs }: HighlightsProps) => {
  const { firstName } = useProfile();

  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  // calculated state
  const [babySleepTime, setBabySleepTime] = useState<number>(); // number of minutes spent sleeping
  const [breastFeedings, setBreastFeedings] = useState<number>(); // number of breast feeding sessions in time period
  const [dadSleepTime, setDadSleepTime] = useState<number>(); // number of minutes spent sleeping
  const [dirtyDiapers, setDirtyDiapers] = useState<number>(); // total number of dirty diapers in time period
  const [momSleepTime, setMomSleepTime] = useState<number>(); // number of minutes spent sleeping
  const [ouncesPumped, setOuncesPumped] = useState<number>(); // total milk pumped in time period shown in ounces
  const [ouncesSupplemented, setOuncesSupplemented] = useState<number>(); // ounces of formula or breast milk supplemented in time period
  const [ouncesTransferred, setOuncesTransferred] = useState<number>(); // ounces of breast milk transferred in time period
  const [pumpSessions, setPumpSessions] = useState<number>(); // number of pump sessions in time period
  const [pumpTime, setPumpTime] = useState<number>(); // time spent pumping in time period shown in hours and minutes
  const [supplementations, setSupplementations] = useState<number>(); // total number of bottles given in time period
  const [totalDiapers, setTotalDiapers] = useState<number>(); // total number of diapers in time period
  const [weightChange, setWeightChange] = useState<string>(); // difference in first and last weight in time period
  const [wetDiapers, setWetDiapers] = useState<number>(); // total number of wet diapers in time period
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const calculateBreastFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BREAST_FEEDING) as BreastFeeding[];
    const { ounces, total } = calculateDailyBreastFeedingState(filteredLogs);
    const totalDays = isDailySnapshot ? 1 : new Set(filteredLogs.map(log => dayjs(log.timestamp).format('YYYY-MM-DD'))).size;
    setBreastFeedings(Math.round((total / totalDays) * 100) / 100);
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

  const calculateSleepState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.SLEEP) as Sleep[];
    const { babySleepDuration, dadSleepDuration, momSleepDuration } = calculateDailySleepState(filteredLogs);
    setBabySleepTime(babySleepDuration);
    setDadSleepTime(dadSleepDuration);
    setMomSleepTime(momSleepDuration);
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
    calculateSleepState();
    calculateGrowthState();
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant='scrollable'
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab icon={<LocalDiningRoundedIcon />} />
            <Tab icon={<SanitizerRoundedIcon />} />
            <Tab icon={<BabyChangingStationRoundedIcon />} />
            <Tab icon={<AirlineSeatFlatRoundedIcon />} />
            {!isDailySnapshot && <Tab icon={<GrassRoundedIcon />} />}
          </Tabs>
        </Box>
        <HighlightTab value={tab} index={0}>
          <LogRow field={`${isDailySnapshot ? 'Total' : 'Average'} (Breast)`} value={`${breastFeedings} feedings`} />
          <LogRow field={`Transferred${isDailySnapshot ? '' : ' (Average)'}`} value={isNil(ouncesTransferred) ? 'Unknown' : `${ouncesTransferred} ounce(s)`} />
          <LogRow field={`${isDailySnapshot ? 'Total' : 'Average'} (Supp.)`} value={`${supplementations} supps`} />
          <LogRow field={`${isDailySnapshot ? '' : 'Average '}Supplemented`} value={`${ouncesSupplemented || 0} ounce(s)`} />
          <LogRow field={`${isDailySnapshot ? '' : 'Average '}Consumed`} value={`${(ouncesSupplemented || 0) + (ouncesTransferred || 0)} ounce(s)`} />
        </HighlightTab>
        <HighlightTab value={tab} index={1}>
          <LogRow field={isDailySnapshot ? 'Total' : 'Average'} value={`${pumpSessions} sessions`} />
          <LogRow field={`${isDailySnapshot ? 'Total' : 'Average'} Time`} value={formatMinutesToHoursAndMinutes(pumpTime || 0)} />
          <LogRow field={`${isDailySnapshot ? '' : 'Average '}Pumped`} value={`${ouncesPumped || 0} ounce(s)`} />
        </HighlightTab>
        <HighlightTab value={tab} index={2}>
          <LogRow field={`${isDailySnapshot ? 'Total' : 'Average'} Dirty`} value={`${dirtyDiapers} diapers`} />
          <LogRow field={`${isDailySnapshot ? 'Total' : 'Average'} Wet`} value={`${wetDiapers} diapers`} />
          <LogRow field={isDailySnapshot ? 'Total' : 'Average'} value={`${totalDiapers} diapers`} />
        </HighlightTab>
        <HighlightTab value={tab} index={3}>
          <LogRow field={`${firstName}${isDailySnapshot ? '' : ' (Average)'}`} value={isNil(babySleepTime) || babySleepTime === 0 ? 'N/A' : formatMinutesToHoursAndMinutes(babySleepTime)} />
          <LogRow field={`Mom${isDailySnapshot ? '' : ' (Average)'}`} value={isNil(momSleepTime) || momSleepTime === 0 ? 'N/A' : formatMinutesToHoursAndMinutes(momSleepTime || 0)} />
          <LogRow field={`Dad${isDailySnapshot ? '' : ' (Average)'}`} value={isNil(dadSleepTime) || dadSleepTime === 0 ? 'N/A' : formatMinutesToHoursAndMinutes(dadSleepTime || 0)} />
        </HighlightTab>
        {
          !isDailySnapshot &&
          <HighlightTab value={tab} index={4}>
            <LogRow field='Weight Change' value={weightChange || 'N/A'} />
          </HighlightTab>
        }
      </AccordionDetails>
    </Accordion>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const HighlightTab = ({ children, value, index }: TabPanelProps) => (
  <div
    role='tabpanel'
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);
