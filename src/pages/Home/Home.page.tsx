import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import BedtimeOffRoundedIcon from '@mui/icons-material/BedtimeOffRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import NoMealsRoundedIcon from '@mui/icons-material/NoMealsRounded';
import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, CardContent, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';

import { EmptyState, LoadingState, LogRow } from '@components';
import { Changing, Feeding, FeedingMethod, Growth, Sleep } from '@models';
import { getTodayChangings, getTodayFeedings, getTodayGrowths, getTodaySleeps } from '@services';
import { formatShortDate, getTimeOnly, subtractMinutes } from '@utils';

export const HomePage = () => {
  const [changings, setChangings] = useState<Changing[] | undefined>();
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();
  const [growths, setGrowths] = useState<Growth[] | undefined>();
  const [sleeps, setSleeps] = useState<Sleep[] | undefined>();

  const loadDailySnapshot = async () => {
    const todaysChangings = await getTodayChangings();
    const todaysFeedings = await getTodayFeedings();
    const todaysGrowths = await getTodayGrowths();
    const todaysSleeps = await getTodaySleeps();
    setChangings(todaysChangings);
    setFeedings(todaysFeedings);
    setGrowths(todaysGrowths);
    setSleeps(todaysSleeps);
  };

  useEffect(() => { void loadDailySnapshot(); }, []);

  const generateLog = (rows: ReactNode) => {
    return (
      <CardContent sx={{ outline: 1, outlineColor: 'white', borderRadius: 2 }}>
        <x.div display='flex' flexDirection='column' gap='15px'>
          {rows}
        </x.div>
      </CardContent>
    );
  };

  const generateChangingLogs = () => {
    if (isNil(changings)) return <LoadingState />;
    if (isEmpty(changings)) return <EmptyState icon={<BabyChangingStationRoundedIcon />} type='Changing' />;
    return changings.map((changing) => {
      const { color, consistency, notes, timestamp, type } = changing;
      return generateLog(
        <>
          <LogRow field='Time' value={getTimeOnly(timestamp)} />
          <LogRow field='Type' value={type} />
          <LogRow field='Color' value={color} />
          <LogRow field='Consistency' value={consistency} />
          <LogRow field='Notes' value={notes} />
        </>
      );
    });
  };

  const generateFeedingLogs = () => {
    if (isNil(feedings)) return <LoadingState />;
    if (isEmpty(feedings)) return <EmptyState icon={<NoMealsRoundedIcon />} type='Feeding' />;
    return feedings.map((feeding) => {
      const { amount, duration, method, notes, side, timestamp } = feeding;
      const isBreastFeeding = method === FeedingMethod.BREAST;
      return generateLog(
        <>
          <LogRow field='Method' value={method} />
          <LogRow field='Time' value={getTimeOnly(isBreastFeeding ? subtractMinutes(timestamp, duration!) : timestamp)} />
          {isBreastFeeding && <LogRow field='Duration' value={duration} />}
          {isBreastFeeding && <LogRow field='Side' value={side} />}
          {!isBreastFeeding && <LogRow field='Amount' value={amount} />}
          <LogRow field='Notes' value={notes} />
        </>
      );
    });
  };

  const generateGrowthLogs = () => {
    if (isNil(growths)) return <LoadingState />;
    if (isEmpty(growths)) return <EmptyState icon={<GrassRoundedIcon />} type='Growth' />;
    return growths.map((growth) => {
      const { headCircumference, height, notes, weight } = growth;
      return generateLog(
        <>
          <LogRow field='Head' value={`${headCircumference} centimeters`} />
          <LogRow field='Height' value={`${height} inches`} />
          <LogRow field='Weight' value={`${weight} pounds`} />
          <LogRow field='Notes' value={notes} />
        </>
      );
    });
  };

  const generateSleepLogs = () => {
    if (isNil(sleeps)) return <LoadingState />;
    if (isEmpty(sleeps)) return <EmptyState icon={<BedtimeOffRoundedIcon />} type='Sleep' />;
    return sleeps.map((sleep) => {
      const { duration, location, notes, startTime, type } = sleep;
      return generateLog(
        <>
          <LogRow field='Time' value={getTimeOnly(startTime)} />
          <LogRow field='Duration' value={duration} />
          <LogRow field='Location' value={location} />
          <LogRow field='Type' value={type} />
          <LogRow field='Notes' value={notes} />
        </>
      );
    });
  };

  return (
    <>
      <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
        <x.div display='flex' justifyContent='center'>
          <Typography variant='h5'><b>{`Daily Snapshot (${formatShortDate(new Date().toISOString())})`}</b></Typography>
        </x.div>
        <Divider sx={{ borderColor: 'white' }} />
      </x.div>
      <x.div display='flex' flexDirection='column' gap='15px'>
        <DailySnapshot logs={generateFeedingLogs()} type='Feeding' />
        <DailySnapshot logs={generateSleepLogs()} type='Sleep' />
        <DailySnapshot logs={generateChangingLogs()} type='Changing' />
        <DailySnapshot logs={generateGrowthLogs()} type='Growth' />
      </x.div>
    </>
  );
};

type DailySnapshotProps = {
  logs: ReactNode;
  type: string;
}

const DailySnapshot = ({ logs, type }: DailySnapshotProps) => {
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
        {logs}
      </AccordionDetails>
    </Accordion>
  );
};
