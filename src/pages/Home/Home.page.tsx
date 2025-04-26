
import './Home.scss';

import FolderOffRoundedIcon from '@mui/icons-material/FolderOffRounded';
import { Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { x } from '@xstyled/styled-components';
import dayjs, { Dayjs } from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { BottleFeeding, BreastFeeding, Changing, Feeding, Growth, Pumping, Sleep } from '@models';
import { getBottleFeedingsInRange, getBreastFeedingsInRange, getChangingsInRange, getFeedingsInRange, getGrowthsInRange, getPumpingsInRange, getSleepsInRange } from '@services';
import { LogEntry, LogType } from '@types';
import { getTimeOnly } from '@utils';

import { Highlights, TimelineView } from './components';

export const HomePage = () => {
  const [bottleFeedings, setBottleFeedings] = useState<BottleFeeding[] | undefined>();
  const [breastFeedings, setBreastFeedings] = useState<BreastFeeding[] | undefined>();
  const [changings, setChangings] = useState<Changing[] | undefined>();
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().endOf('day'));
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();
  const [growths, setGrowths] = useState<Growth[] | undefined>();
  const [isDailySnapshot, setIsDailySnapshot] = useState<boolean>(true);
  const [pumpings, setPumpings] = useState<Pumping[] | undefined>();
  const [sleeps, setSleeps] = useState<Sleep[] | undefined>();
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('day'));

  const loadSnapshot = async () => {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    const bottleFeedings = await getBottleFeedingsInRange(start, end);
    const breastFeedings = await getBreastFeedingsInRange(start, end);
    const changings =  await getChangingsInRange(start, end);
    const feedings =  await getFeedingsInRange(start, end);
    const growths =  await getGrowthsInRange(start, end);
    const pumpings = await getPumpingsInRange(start, end);
    const sleeps = await  await getSleepsInRange(start, end);
    setBottleFeedings(bottleFeedings);
    setBreastFeedings(breastFeedings);
    setChangings(changings);
    setFeedings(feedings);
    setGrowths(growths);
    setPumpings(pumpings);
    setSleeps(sleeps);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadSnapshot(); }, [endDate, startDate]);

  const getCombinedLogs = (): LogEntry[] => {
    const allLogs = [
      ...(bottleFeedings?.map((f) => ({ ...f, time: getTimeOnly(f.timestamp), logType: LogType.BOTTLE_FEEDING })) || []),
      ...(breastFeedings?.map((f) => ({ ...f, time: getTimeOnly(f.timestamp), logType: LogType.BREAST_FEEDING })) || []),
      ...(changings?.map((c) => ({ ...c, time: getTimeOnly(c.timestamp), logType: LogType.CHANGING })) || []),
      ...(feedings?.map((f) => ({ ...f, time: getTimeOnly(f.timestamp), logType: LogType.FEEDING })) || []),
      ...(growths?.map((g) => ({ ...g, time: getTimeOnly(g.timestamp), logType: LogType.GROWTH })) || []),
      ...(pumpings?.map((p) => ({ ...p, time: getTimeOnly(p.timestamp), logType: LogType.PUMPING })) || []),
      ...(sleeps?.map((s) => ({ ...s, timestamp: s.startTime, time: getTimeOnly(s.startTime), logType: LogType.SLEEP })) || []),
    ];
    allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allLogs;
  };

  const getLogs = () => {
    const logs = getCombinedLogs();
    if (isNil(logs)) return <LoadingState />;
    if (isEmpty(logs)) return <EmptyState icon={<FolderOffRoundedIcon />} type='Daily' />;
    return <TimelineView logs={logs} />;
  };

  const toggleIsDailyView = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDailySnapshot(event.target.checked);
    setStartDate(dayjs().startOf('day'));
    setEndDate(dayjs().endOf('day'))
  };

  return (
    <>
      <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
        <x.div alignItems='center' display='flex' flexDirection='column'>
          <Typography variant='h5'><b>Activity</b></Typography>
          <x.div display='flex' flexDirection='row' gap='15px' margin='10px 25px 0 25px'>
            <MobileDatePicker
              disabled={isDailySnapshot}
              onChange={(newValue) => setStartDate(newValue?.startOf('day') ?? dayjs().startOf('day'))}
              value={startDate}
            />
            <x.p>-</x.p>
            <MobileDatePicker
              disabled={isDailySnapshot}
              onChange={(newValue) => setEndDate(newValue?.endOf('day') ?? dayjs().endOf('day'))}
              value={endDate}
            />
          </x.div>
          <FormControlLabel
            control={<Checkbox checked={isDailySnapshot} onChange={toggleIsDailyView} />}
            label='daily view'
          />
        </x.div>
        <Divider sx={{ borderColor: 'white' }} />
      </x.div>
      <x.div margin='15px'>
        <Highlights logs={getCombinedLogs()} />
      </x.div>
      {getLogs()}
    </>
  );
};
