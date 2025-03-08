import './Home.scss';

import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import BedtimeOffRoundedIcon from '@mui/icons-material/BedtimeOffRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import NoMealsRoundedIcon from '@mui/icons-material/NoMealsRounded';
import { CardContent, Divider, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { Changing, Feeding, FeedingMethod, Growth, Sleep, SleepType, WasteType } from '@models';
import { getTodayChangings, getTodayFeedings, getTodayGrowths, getTodaySleeps } from '@services';
import { LogEntry, LogType } from '@types';
import { formatShortDate, getTimeOnly, toCapitalCase } from '@utils';

import { DailySnapshot, TimelineView } from './components';

enum DailyViewType {
  SPLIT = 'split',
  UNIFIED = 'unified',
}

export const HomePage = () => {
  const [changings, setChangings] = useState<Changing[] | undefined>();
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();
  const [growths, setGrowths] = useState<Growth[] | undefined>();
  const [sleeps, setSleeps] = useState<Sleep[] | undefined>();
  const [view, setView] = useState<DailyViewType>(DailyViewType.UNIFIED);

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
      const formattedType = type === WasteType.BOTH ? 'Wet And Dirty' : type;

      return generateLog(
        <>
          <x.h3 margin='0'>
            {toCapitalCase(`Changed ${formattedType} Diaper`)}
          </x.h3>
          <x.p margin='0'>
            {!isNil(color) && <><b>Color:</b> {color}<br/></>}
            {!isNil(consistency) && <><b>Consistency:</b> {consistency}<br/></>}
            <b>Notes:</b> {notes}
          </x.p>
          <x.p margin='0'>{getTimeOnly(timestamp)}</x.p>
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
          <x.h3 margin='0'>
            {isBreastFeeding ? 'Breast Fed' : 'Bottle Fed'}
          </x.h3>
          <x.p margin='0'>
            {isBreastFeeding && <><b>Duration:</b> {`${duration} minutes`}<br /></>}
            {isBreastFeeding && <><b>Side:</b> {side}<br /></>}
            {!isBreastFeeding && <><b>Amount:</b> {`${amount} ounces`}<br /></>}
            <b>Notes:</b> {notes}
          </x.p>
          <x.p margin='0'>{getTimeOnly(timestamp)}</x.p>
        </>
      );
    });
  };

  const generateGrowthLogs = () => {
    if (isNil(growths)) return <LoadingState />;
    if (isEmpty(growths)) return <EmptyState icon={<GrassRoundedIcon />} type='Growth' />;
    return growths.map((growth) => {
      const { headCircumference, height, notes, timestamp, weight } = growth;
      return generateLog(
        <>
          <x.h3 margin='0'>Recorded Growth</x.h3>
          <x.p margin='0'>
            {!isNil(headCircumference) && <><b>Head Circumference:</b> {`${headCircumference} centimeters`}<br/></>}
            {!isNil(height) && <><b>Height:</b> {`${height} inches`}<br/></>}
            {!isNil(weight) && <><b>Weight:</b> {`${weight} pounds`}<br/></>}
            <b>Notes:</b> {notes}
          </x.p>
          <x.p margin='0'>{getTimeOnly(timestamp)}</x.p>
        </>
      );
    });
  };

  const generateSleepLogs = () => {
    if (isNil(sleeps)) return <LoadingState />;
    if (isEmpty(sleeps)) return <EmptyState icon={<BedtimeOffRoundedIcon />} type='Sleep' />;
    return sleeps.map((sleep) => {
      const { duration, location, notes, startTime, type } = sleep;
      const sleepAction = type === SleepType.NAP ? 'Napped' : 'Slept';

      return generateLog(
        <>
          <x.h3 margin='0'>
            {toCapitalCase(`${sleepAction} in ${location}`)}
          </x.h3>
          <x.p margin='0'>
            <b>Duration:</b> {`${duration} minutes`}<br/>
            <b>Notes:</b> {notes}
          </x.p>
          <x.p margin='0'>{getTimeOnly(startTime)}</x.p>
        </>
      );
    });
  };

  const getCombinedLogs = (): LogEntry[] => {
    const allLogs = [
      ...(feedings?.map((f) => ({ ...f, time: getTimeOnly(f.timestamp), logType: LogType.FEEDING })) || []),
      ...(changings?.map((c) => ({ ...c, time: getTimeOnly(c.timestamp), logType: LogType.CHANGING })) || []),
      ...(growths?.map((g) => ({ ...g, time: getTimeOnly(g.timestamp), logType: LogType.GROWTH })) || []),
      ...(sleeps?.map((s) => ({ ...s, timestamp: s.startTime, time: getTimeOnly(s.startTime), logType: LogType.SLEEP })) || []),
    ];
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allLogs;
  };

  const getLogs = () => {
    switch (view) {
      case DailyViewType.SPLIT:
        return (
          <x.div display='flex' flexDirection='column' gap='15px'>
            <DailySnapshot logs={generateFeedingLogs()} type='Feeding' />
            <DailySnapshot logs={generateSleepLogs()} type='Sleep' />
            <DailySnapshot logs={generateChangingLogs()} type='Changing' />
            <DailySnapshot logs={generateGrowthLogs()} type='Growth' />
          </x.div>
        );
      case DailyViewType.UNIFIED:
        return <TimelineView logs={getCombinedLogs()} />;
    }
  };

  return (
    <>
      <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
        <x.div alignItems='center' display='flex' flexDirection='column'>
          <Typography variant='h5'><b>{`Daily Snapshot (${formatShortDate(new Date().toISOString())})`}</b></Typography>
          <FormControl sx={{ m: 1, width: 200 }}>
            <Select
              id='daily-view-type-select'
              labelId='daily-view-type-select-label'
              onChange={(event: SelectChangeEvent<DailyViewType>) => setView(event.target.value as DailyViewType)}
              required
              value={view}
            >
              {
                Object.values(DailyViewType).map((it, index) =>
                  <MenuItem key={`daily-view-type-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </x.div>
        <Divider sx={{ borderColor: 'white' }} />
      </x.div>
      {getLogs()}
    </>
  );
};
