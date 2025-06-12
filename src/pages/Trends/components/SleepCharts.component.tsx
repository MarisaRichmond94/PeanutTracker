import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Sleep } from '@models';
import { getSleepsInRange } from '@services';
import { Period } from '@types';

type SleepEntity = {
  date: string;
  duration: number;
}

export const SleepCharts = ({ period, periodType }: { period: number, periodType: Period }) => {
  const [data, setData] = useState<SleepEntity[]>([]);

  const getChangingsOverNMonths = async () => {
    const sleepsInRange = await getSleepsInRange(
      dayjs().subtract(period, periodType).startOf('day').toISOString(),
      dayjs().endOf('day').toISOString(),
    );
    setData(converttoSleepEntities(sleepsInRange));
  };

  const converttoSleepEntities = (sleeps: Sleep[]): SleepEntity[] => {
    const summaryMap = new Map<string, { duration: number }>();

    for (const sleep of sleeps) {
      const date = dayjs(sleep.startTime).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: sleep.duration });
      }

      const current = summaryMap.get(date)!;
      current.duration += sleep.duration;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration }]) => ({
        date,
        duration,
      })
    );
  };

  useEffect(() => {
    void getChangingsOverNMonths()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Sleep Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'minutes (total)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='duration' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </x.div>
  );
};
