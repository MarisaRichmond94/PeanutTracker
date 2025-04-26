import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Divider, Typography } from '@mui/material';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { LogRow } from '@components';
import { BottleFeeding, BreastFeeding, Changing, Growth, Pumping, WasteType } from '@models';
import { LogEntry, LogType } from '@types';
import { calculateOunceDifference, formatLbsToLbsOz, formatMinutesToHoursAndMinutes } from '@utils';

type Change = {
  difference: number; // absolute value of change (positive number)
  type: 'Gained' | 'Lost' | 'N/A';
};

type HighlightsProps = {
  logs: LogEntry[];
}

export const Highlights = ({ logs }: HighlightsProps) => {
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
  const [weightChange, setWeightChange] = useState<string>(); // difference in first and last weight in time period
  const [wetDiapers, setWetDiapers] = useState<number>(); // total number of wet diapers in time period

  const calculateBreastFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BREAST_FEEDING) as BreastFeeding[];
    setBreastFeedings(filteredLogs.length);
    let timeSpentBreastFeeding = 0;
    let totalOuncesTransferred = 0;
    filteredLogs.forEach((log) => {
      const { duration, endPounds, endOunces, startPounds, startOunces } = log;
      timeSpentBreastFeeding += duration;
      const showWeightChange = [startPounds, startOunces, endPounds, endOunces].every((value) => value != null);
      if (showWeightChange) {
        totalOuncesTransferred += calculateOunceDifference(startPounds!, startOunces!, endPounds!, endOunces!);
      }
    });
    setBreastFeedingDuration(timeSpentBreastFeeding);
    setOuncesTransferred(totalOuncesTransferred);
  };

  const calculateBottleFeedingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.BOTTLE_FEEDING) as BottleFeeding[];
    setSupplementations(filteredLogs.length);
    let supplementedOunces = 0;
    filteredLogs.forEach((log) => {
      const { amount } = log;
      supplementedOunces += amount;
    });
    setOuncesSupplemented(supplementedOunces);
  };

  const calculatePumpingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.PUMPING) as Pumping[];
    setPumpSessions(filteredLogs.length);
    let pumpedOunces = 0;
    let timeSpentPumping = 0;
    filteredLogs.forEach((log) => {
      const { duration, leftAmount, rightAmount } = log;
      pumpedOunces += (leftAmount + rightAmount);
      timeSpentPumping += duration;
    });
    const roundedOunces = Math.ceil(pumpedOunces * 10) / 10;
    setOuncesPumped(roundedOunces);
    setPumpTime(timeSpentPumping)
  };

  const calculateChangingState = () => {
    const filteredLogs = logs.filter((log) => log.logType === LogType.CHANGING) as Changing[];
    let dirtyCount = 0;
    let wetCount = 0;
    filteredLogs.forEach((log) => {
      const { type } = log;
      if (type === WasteType.BOTH || type === WasteType.DIRTY) {
        dirtyCount += 1;
      }
      if (type === WasteType.BOTH || type === WasteType.WET) {
        wetCount += 1;
      }
    });
    setDirtyDiapers(dirtyCount);
    setWetDiapers(wetCount);
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
        <Typography>Breast Feeding</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total Breast Feedings' value={breastFeedings} />
        <LogRow field='Time Spent Breast Feeding' value={formatMinutesToHoursAndMinutes(breastFeedingDuration || 0)} />
        <LogRow field='Ounces Transferred' value={isNil(ouncesTransferred) ? 'Unknown' : `${ouncesTransferred} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Supplementations</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total Supplementation Feedings' value={supplementations} />
        <LogRow field='Ounces Supplemented' value={`${ouncesSupplemented || 0} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Pumping</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Total Pump Sessions' value={pumpSessions} />
        <LogRow field='Time Spent Pumping' value={formatMinutesToHoursAndMinutes(pumpTime || 0)} />
        <LogRow field='Ounces Pumped' value={`${ouncesPumped || 0} ounce(s)`} />
        <Typography sx={{ pt: 1 }}>Changing</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Dirty Diapers' value={dirtyDiapers} />
        <LogRow field='Wet Diapers' value={wetDiapers} />
        <Typography sx={{ pt: 1 }}>Growth</Typography>
        <Divider sx={{ borderColor: 'white', my: 1 }} />
        <LogRow field='Weight Change' value={weightChange || 'N/A'} />
      </AccordionDetails>
    </Accordion>
  );
};
